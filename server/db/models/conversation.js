const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  createdByUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});


module.exports = Conversation;
