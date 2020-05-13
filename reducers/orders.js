const orders = (state = 0, action) => {
  switch (action.type) {
    case "SET ORDERS":
      return action.payload;
  }
  return state;
};

export default orders;
