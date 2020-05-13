import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class BottomTabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={style.root}>
        <View style={style.tab}>
          <Text>Popular</Text>
        </View>
        <View style={style.tab}>
          <Text>Recent</Text>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create({
  root: {
    backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tab: {
    width: "50%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
