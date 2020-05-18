const userInfo = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, ...action.payload };
  }
  return state;
};

export default userInfo;
