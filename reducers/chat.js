const chat = (state = {}, action) => {
  let convo = {};
  switch (action.type) {
    case "NEW_MESSAGE":
      if (state[action.order_id] !== undefined) {
        state[action.order_id].messages = action.messages.concat(
          state[action.order_id].messages
        );
        convo = state;
      } else {
        convo[action.order_id] = {
          messages: action.messages,
        };
      }
      return { ...state, convo };
    case "ADD_CONVO":
      convo[action.order_id] = {
        messages: action.messages,
      };
      convo = { ...state, ...convo };
      if (state[action.order_id] !== undefined) {
        if (state[action.order_id].messages.length >= action.messages.length)
          return state;
      }
      return convo;
  }
  return state;
};

export default chat;
