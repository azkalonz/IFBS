const products = (state = [], action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return action.payload;
  }
  return state;
};

export default products;
