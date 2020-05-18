import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { Title, IconButton, Subheading, Searchbar } from "react-native-paper";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ShoppingCart } from "../../components/Icons";
import { LinearGradient } from "expo-linear-gradient";

const STATUS_BAR = StatusBar.statusBarHeight || 24;

const Header = (props) => {
  const navigation = props.navigation;
  const style = StyleSheet.create({
    root: {
      paddingVertical: STATUS_BAR + 10,
      paddingBottom: STATUS_BAR / 2,
      paddingHorizontal: 5,
      backgroundColor: "#1c5822",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
  return (
    <LinearGradient
      colors={["#9cc637", "#1c5822"]}
      start={[1.2, 0.8]}
      style={style.root}
    >
      <View style={{ width: "20%", alignItems: "center" }}>
        <IconButton
          icon="menu"
          color="#fff"
          size={30}
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      </View>
      <View style={{ width: "60%" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <View pointerEvents="none">
            <Searchbar style={{ width: "100%" }} placeholder="Search" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ width: "20%", alignItems: "center" }}>
        <IconButton
          icon="cart"
          color="#fff"
          size={30}
          onPress={() => {
            navigation.navigate("Cart");
          }}
        />
        {Object.keys(props.cartItems).length ? (
          <View
            pointerEvents="none"
            style={{
              backgroundColor: "red",
              paddingHorizontal: 5,
              borderRadius: 999,
              position: "absolute",
              bottom: 0,
              width: 33,
              alignItems: "center",
              justifyContent: "center",
              height: 33,
              right: 0,
              borderWidth: 3,
              borderColor: "#9cc637",
            }}
          >
            <Subheading
              style={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: Object.keys(props.cartItems).length > 99 ? 9 : 14,
              }}
            >
              {Object.keys(props.cartItems).length > 99
                ? "99+"
                : Object.keys(props.cartItems).length}
            </Subheading>
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const mapStatetoProps = (state) => {
  return {
    cartItems: state.cartItems,
    products: state.products,
  };
};

export default connect(mapStatetoProps)(Header);
