import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadBadge: {
    marginRight: "2.5rem",
    marginTop: "0.4rem",
    fontSize: "0.75rem",
    fontWeight: "bold",
    padding: "0.5rem",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        <Badge
          classes={{ badge: classes.unreadBadge }}
          color="primary"
          badgeContent={conversation.messages.filter((msg) => 
            msg.senderId === otherUser.id && msg.unread).length
            }
        >
        </Badge>
      </Box>
    </Box>
  );
};

export default ChatContent;
