import { cartItems, userInfo, products, screens, orders } from "./reducers";
import { createStore, combineReducers } from "redux";
export default createStore(
  combineReducers({ cartItems, userInfo, products, screens, orders })
);
