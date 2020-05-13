const screens = (
  state = { direction: "UP", notifications: [], token: "" },
  action
) => {
  switch (action.type) {
    case "SET_XY":
      return { ...state, x: action.x, y: action.y };
    case "SET_DIRECTION":
      return { ...state, direction: action.direction };
    case "SET_NOTIFICATION_TOKEN":
      return { ...state, notification_token: action.token };
    case "SET_NOTIFICATION":
      let newData = action.notification.data;
      for (let i = 0; i < state.notifications.length; i++) {
        let n = state.notifications;
        if (n[i].id === newData.id) {
          n[i].status = newData.status;
          return { ...state, notifications: state.notifications };
        }
      }
      return {
        ...state,
        notifications: [...state.notifications, newData],
      };
  }
  return state;
};

export default screens;
