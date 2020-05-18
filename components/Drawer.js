import React, { useEffect, Component } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { List, Avatar, Title, Divider } from "react-native-paper";
import { connect } from "react-redux";
import WooCommerceApi from "./WooCommerce";
import { rootDispatch } from "../actions";
import backgrounds from "./SvgBackgrounds";
import { SvgXml } from "react-native-svg";
import Categories from "./Categories";
import { Star } from "./Icons";
import { ShoppingCart, Store, ShoppingBag } from "./Icons/green";

console.warn = () => null;

class Drawer extends Component {
  constructor(props) {
    super(props);
    if (props.userInfo === undefined) this.handleLogout();
    this.avatar = props.userInfo.avatar_urls["96"];
    this.first_name = props.userInfo.first_name;
    this.email = props.userInfo.email;
    this.navigate = props.navigation.navigate;
  }
  _getCustomer = async () => {
    let customer = await new WooCommerceApi(this.props.userInfo.jwt_token).get(
      "customers/" + this.props.userInfo.id
    );
    this.props.setUserInfo({ ...this.props.userInfo, ...customer });
  };
  componentDidMount() {
    if (this.props.userInfo.first_name == undefined) this._getCustomer();
  }
  handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@password");
      await AsyncStorage.removeItem("@username");
      await AsyncStorage.removeItem("@token");
      this.navigate("auth");
    } catch (e) {
      console.log(e);
    }
  };
  NotificationCounter = ({ name }) => {
    let total = this.props.notifications.map(
      (notifitem) => notifitem.name === name
    );
    return total.length ? (
      <View
        style={{
          backgroundColor: "red",
          padding: 10,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {total.length}
        </Text>
      </View>
    ) : null;
  };
  render() {
    return (
      <View style={{ paddingTop: 30 }}>
        <ScrollView>
          <TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                paddingVertical: 50,
                flexWrap: "wrap",
                overflow: "hidden",
              }}
            >
              <Avatar.Image
                size={40}
                source={{ uri: this.avatar }}
                style={{ marginRight: 10 }}
              />
              <View>
                <Title numberOfLines={1}>
                  {this.props.userInfo.first_name}
                </Title>
                <Text style={{ fontSize: 11 }}>
                  {this.props.userInfo.email}
                </Text>
              </View>
              <SvgXml
                style={{
                  width: "100%",
                  height: "400%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: -1,
                }}
                xml={backgrounds.squares}
              />
            </View>
          </TouchableOpacity>
          <Categories
            items={this.props.categories}
            onPress={(c) => this.navigate("ProductsByStore", c)}
          />
          <TouchableOpacity>
            <List.Item
              title="Shop"
              onPress={() => {
                this.navigate("Popular Products");
              }}
              left={(props) => <Store {...props} width={30} height={30} />}
            />
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity>
            <List.Item
              title="Cart"
              onPress={() => {
                this.navigate("Cart");
              }}
              left={(props) => (
                <ShoppingCart width={30} height={30} {...props} />
              )}
            />
          </TouchableOpacity>
          <Divider />
          <List.Item
            title="My Orders"
            onPress={() => {
              this.props.clearNotifications();
              this.navigate("Orders");
            }}
            right={() => this.NotificationCounter({ name: "order" })}
            left={(props) => <ShoppingBag width={30} height={30} {...props} />}
          />
          <Divider />
          <TouchableOpacity>
            <List.Item title="Logout" onPress={this.handleLogout} />
          </TouchableOpacity>
          <Divider />
        </ScrollView>
      </View>
    );
  }
}
export default connect(
  (states) => ({
    userInfo: states.userInfo,
    notifications: states.screens.notifications,
    products: states.products,
    categories: states.categories,
  }),
  rootDispatch
)(Drawer);
