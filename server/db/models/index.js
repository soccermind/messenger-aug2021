const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Conversation_User = require("./conversationUser");

// associations

Conversation.belongsToMany(User, { through: Conversation_User });
User.belongsToMany(Conversation, { through: Conversation_User });
Conversation.hasMany(Conversation_User);
Conversation_User.belongsTo(Conversation);
User.hasMany(Conversation_User);
Conversation_User.belongsTo(User);
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
