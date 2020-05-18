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
          c.name !== "App" && (
            <View key={i}>
              <Divider />
              <TouchableOpacity onPress={() => props.onPress(c)}>
                <List.Item title={c.name} titleStyle={{ fontWeight: "bold" }} />
              </TouchableOpacity>
              <Divider />
            </View>
          )
      )}
    </List.Accordion>
  );
};
