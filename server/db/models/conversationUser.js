const Sequelize = require("sequelize");
const db = require("../db");

const Conversation_User = db.define("Conversation_User", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  lastReadMessageId: {
    type: Sequelize.INTEGER,
  },
  unreadMessageCount: {
    type: Sequelize.INTEGER,
  },
});