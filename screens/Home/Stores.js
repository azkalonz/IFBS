import React, { Component } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import {
  Button,
  IconButton,
  Card,
  Title,
  TouchableRipple,
  List,
  Divider,
  Paragraph,
} from "react-native-paper";
import { SvgXml } from "react-native-svg";
import backgrounds from "../../components/SvgBackgrounds";
import { connect } from "react-redux";
import { rootDispatch } from "../../actions";
import { TouchableOpacity } from "react-native-gesture-handler";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const Stores = (props) => {
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          padding: 13,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {props.categories &&
          props.categories
            .filter((c) => c.name !== "App")
            .map((c) => (
              <View key={c.id} style={{ width: "100%", marginBottom: 13 }}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("ProductsByStore", c)
                  }
                >
                  <Card>
                    {c.image !== null ? (
                      <Card.Cover
                        style={{ backgroundColor: "#fff", height: 100 }}
                        source={{ uri: c.image.src }}
                        resizeMode="contain"
                      />
                    ) : null}

                    <Card.Title title={c.name} subtitle={c.description} />
                    <Card.Content>
                      <Paragraph>{c.description}</Paragraph>
                    </Card.Content>

                    {/* <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions> */}
                  </Card>
                </TouchableOpacity>
              </View>
            ))}
      </View>
    </ScrollView>
  );
};

export default connect(
  (states) => ({
    categories: states.categories,
  }),
  rootDispatch
)(Stores);
