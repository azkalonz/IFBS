import React, { useState, useEffect } from "react";
import { View, Dimensions, Text } from "react-native";
import { rootDispatch } from "../../actions";
import { connect } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Product = (props) => {
  return null;
};

const mapStatetoProps = (state) => {
  return {
    cartItems: state,
  };
};

export default connect(mapStatetoProps, rootDispatch)(Product);
