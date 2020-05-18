const rootDispatch = (dispatch) => {
  return {
    setDirection: (direction) => {
      dispatch({
        type: "SET_DIRECTION",
        direction,
      });
    },
    setUserInfo: (user) => {
      dispatch({
        type: "SET_USER_INFO",
        payload: user,
      });
    },
    setXY: (x, y) =>
      dispatch({
        type: "SET_XY",
        x,
        y,
      }),
    setProducts: (products) => {
      dispatch({
        type: "SET_PRODUCTS",
        payload: products,
      });
    },
    addConvo: ({ order_id, messages }) =>
      dispatch({
        type: "ADD_CONVO",
        order_id,
        messages,
      }),
    setCategories: (cat) =>
      dispatch({
        type: "SET_CATEGORIES",
        payload: cat,
      }),
    clearNotifications: () =>
      dispatch({
        type: "CLEAR_NOTIFICATION",
      }),
    setQty: (id, qty) =>
      dispatch({
        type: "SET_QUANTITY",
        id,
        qty,
      }),
    removeAllFromCart: () => dispatch({ type: "REMOVE_ALL" }),
    setOrders: (orders) =>
      dispatch({
        type: "SET_ORDERS",
        payload: orders,
      }),
    removeFromCart: (id) => {
      dispatch({
        type: "REMOVE_FROM_CART",
        id,
      });
    },
    addToCart: (item, qty = 1) =>
      dispatch({
        type: "ADD_TO_CART",
        product: { ...item, qty },
      }),
    setNotification: (notification) =>
      dispatch({
        type: "SET_NOTIFICATION",
        notification,
      }),
  };
};

export { rootDispatch };
