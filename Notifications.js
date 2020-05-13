import React, { Component } from "react";
import { View, Text } from "react-native";
import store from "./store";
import { connect } from "react-redux";
import { rootDispatch } from "./actions";
import axios from "axios";

const Notification = async function (props) {
  if (props.token) {
    store.dispatch({
      type: "SET_NOTIFICATION_TOKEN",
      token: props.token,
    });
  }
  if (props.notification) {
    store.dispatch({
      type: "SET_NOTIFICATION",
      notification: props.notification,
    });
  }
};

export default connect(
  (states) => ({
    notification: states.screens,
  }),
  rootDispatch
)(Notification);
