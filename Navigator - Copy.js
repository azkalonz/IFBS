import React from "react";
import { Text, View } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Login } from "./screens/Auth";
import { Shop, Cart } from "./screens/Home";
import Header from "./screens/Home/Header";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";

const popularStack = createStackNavigator(
  {
    "Popular Products": {
      screen: Shop,
    },
  },
  {
    defaultNavigationOptions: {
      header: false,
    },
  }
);
const mostRecentStack = createStackNavigator(
  {
    "Most Recent": Shop,
  },
  {
    defaultNavigationOptions: {
      header: false,
    },
  }
);
const shopTabs = createBottomTabNavigator(
  {
    Popular: popularStack,
    "Most Recent": mostRecentStack,
  },
  {
    initialRouteName: "Popular",
  }
);
const mainStack = createStackNavigator(
  {
    Shop: {
      screen: shopTabs,
      navigationOptions: {
        title: "Hello",
        header: (props) => <Header {...props} />,
      },
    },
    Cart: {
      screen: Cart,
    },
    "My Account": {
      screen: shopTabs,
    },
  },
  {
    defaultNavigationOptions: {
      header: false,
    },
  }
);
const appDrawer = createDrawerNavigator({
  drawer: mainStack,
});
const authStack = createStackNavigator({
  Login: {
    screen: Login,
  },
  Register: {
    screen: Login,
  },
});
const appNavigator = createSwitchNavigator(
  {
    app: appDrawer,
    auth: authStack,
  },
  {
    initialRouteName: "app",
  }
);
export default createAppContainer(appNavigator);
