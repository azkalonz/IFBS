const cartItems = (state = {}, action) => {
  let c = state;
  switch (action.type) {
    case "ADD_TO_CART":
      c[action.product.id] = action.product;
      return { ...c };
    case "SET_QUANTITY":
      c = state;
      c[action.id].qty = action.qty ? action.qty : 1;
      return { ...c };
    case "REMOVE_ALL":
      return {};
    case "REMOVE_FROM_CART":
      delete state[action.id];
      return { ...state };
  }
  return state;
};

export default cartItems;
