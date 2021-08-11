import React, { Component } from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { withStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { markMessagesAsRead } from "../../store/utils/thunkCreators";
import { clearUnreadMessages } from "../../store/conversations";

const styles = {
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
};

class Chat extends Component {
  handleClick = async (conversation, currentUserId) => {
    await this.props.setActiveChat(conversation.otherUser.username);
    await this.props.clearUnreadMessages(conversation.otherUser.username);
    conversation.id && await markMessagesAsRead(currentUserId, conversation.otherUser.id, conversation.id, conversation.otherUser.username);
  };

  render() {
    const { classes } = this.props;
    const otherUser = this.props.conversation.otherUser;
    return (
      <Box
        onClick={() => this.handleClick(this.props.conversation, this.props.user.id)}
        className={classes.root}
      >
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={this.props.conversation} />
      </Box>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    clearUnreadMessages: (activeConversation) => {
      dispatch(clearUnreadMessages(activeConversation));
    },
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(Chat));
