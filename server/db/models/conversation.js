const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");
const Conversation_User = require("./conversationUser")

const Conversation = db.define("conversation", {
  createdByUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Conversation.findConversation = async function (participantIds) {
  const conversation = await Conversation.findOne({
    include: { 
      model: Conversation_User,
      where: {
        userId: {
          [Op.in]: participantIds
        }
      }
    }
  });
};


module.exports = Conversation;
