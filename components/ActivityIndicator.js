import React, { Component } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { ActivityIndicator, Subheading } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default (props) => {
  let heightoffset = 60;
  if (props.offset !== null) heightoffset = props.offset;
  const style = StyleSheet.create({
    root: {
      backgroundColor: "rgba(0,0,0,0.3)",
      position: "absolute",
      zIndex: 9999,
      justifyContent: "center",
      alignItems: "center",
      height: SCREEN_HEIGHT - heightoffset,
      width: SCREEN_WIDTH,
    },
  });
  return (
    <View>
      {props.visible && (
        <View style={style.root}>
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "80%",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <ActivityIndicator animating={true} style={{ marginRight: 20 }} />
            <Subheading>Processing</Subheading>
          </View>
        </View>
      )}
    </View>
  );
};
