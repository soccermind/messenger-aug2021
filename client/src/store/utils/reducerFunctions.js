export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.latestMessageCreatedAt = message.createdAt;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageCreatedAt = message.createdAt;
      return convoCopy;
    } else {
      return convo;
    }
  }).sort((a, b) => { return new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt)});
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [], latestMessageCreatedAt: "1970-01-01T08:00:00.000Z" };
      newState.push(fakeConvo);
    }
  });

  return newState.sort((a, b) => { return new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt)});
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvoCopy = { ...convo };
      newConvoCopy.id = message.conversationId;
      newConvoCopy.messages.push(message);
      newConvoCopy.latestMessageText = message.text;
      newConvoCopy.latestMessageCreatedAt = message.createdAt;
      return newConvoCopy;
    } else {
      return convo;
    }
  }).sort((a, b) => { return new Date(b.latestMessageCreatedAt) - new Date(a.latestMessageCreatedAt)});
};

export const clearUnreadMessagesInStore = (state, activeConversation) => {
  return state.map((convo) => {
    if (convo.otherUser.username === activeConversation) {
      const convoCopy = { ...convo };
      convoCopy.messages.forEach((msg, idx, array) => {
        if (convoCopy.otherUser.id === msg.senderId) {
          array[idx].unread = false;
        }
      });
      return convoCopy;
    } else {
      return convo;
    }
  });
};