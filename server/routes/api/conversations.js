const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      convoJSON.latestMessageCreatedAt = convoJSON.messages[convoJSON.messages.length - 1].createdAt;

      const readMessages = convoJSON.messages.filter((msg) =>
      msg.senderId === userId && msg.read);
      convoJSON.lastReadMessageId = readMessages.length > 0 
        ? readMessages[readMessages.length - 1].id
        : null;

      convoJSON.unreadMessageCount = convoJSON.messages.reduce((count, currentMsg) => 
        count + (currentMsg.senderId === convoJSON.otherUser.id && !currentMsg.read ? 1 : 0), 0);

      conversations[i] = convoJSON;
    }
    conversations.sort((a, b) => { return new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt) })
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const { conversationId } = req.body;
    const conversation = await Conversation.findByPk(conversationId);
    if (conversation.user1Id === userId || conversation.user2Id === userId) {
      await Message.update(
          { read: true },
          { where: {
              conversationId: conversation.id,
              senderId: {
                [Op.ne]: userId
              }
            }
          }
        );
    }
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
