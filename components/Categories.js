import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { List, Divider } from "react-native-paper";

export default Categories = (props) => {
  return (
    <List.Accordion
      title="Categories"
      titleStyle={{ color: "#fff" }}
      id="1"
      style={{ backgroundColor: "#1c5822" }}
    >
      {props.items.map(
        (c, i) =>
          c !== "App" && (
            <View key={i}>
              <Divider />
              <TouchableOpacity>
                <List.Item title={c} titleStyle={{ fontWeight: "bold" }} />
              </TouchableOpacity>
              <Divider />
            </View>
          )
      )}
    </List.Accordion>
  );
};
