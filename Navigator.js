import React from "react";
import { Dimensions } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
  Header as DefaultHeader,
} from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Login, Register } from "./screens/Auth";
import { Shop, Cart, Product, Search, Checkout, Orders } from "./screens/Home";
import Header from "./screens/Home/Header";
import BottomTabBar from "./screens/Home/BottomTabBar";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Drawer from "./components/Drawer";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/FontAwesome";

const popularStack = createStackNavigator(
  {
    "Popular Products": {
      screen: Shop,
    },
  },
  {
    defaultNavigationOptions: {
      header: false,
      ...TransitionPresets.SlideFromRightIOS,
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
    Popular: {
      screen: popularStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon5
            name="store"
            color={focused ? tintColor : "#e1e1e1"}
            size={25}
          />
        ),
      },
    },
    "Most Recent": {
      screen: mostRecentStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon
            name="shopping-cart"
            color={focused ? tintColor : "#e1e1e1"}
            size={30}
          />
        ),
      },
    },
  },
  {
    initialRouteName: "Popular",
    // tabBarComponent: (props) => <BottomTabBar {...props} />,
    tabBarOptions: {
      style: {
        height: 60,
        showIcon: true,
      },
      activeTintColor: "#1c5822",
    },
  }
);
const mainStack = createStackNavigator(
  {
    Shop: {
      screen: shopTabs,
      navigationOptions: {
        header: (props) => {
          return <Header {...props} />;
        },
      },
    },
    Cart: {
      screen: Cart,
      navigationOptions: {
        header: (props) => <DefaultHeader {...props} />,
        ...TransitionPresets.SlideFromRightIOS,
      },
    },
    Orders: {
      screen: Orders,
      navigationOptions: {
        header: (props) => <DefaultHeader {...props} />,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      },
    },
    Product: {
      screen: (props) => <Product {...props} />,
      navigationOptions: {
        header: (props) => <DefaultHeader {...props} />,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      },
    },
    Checkout: {
      screen: (props) => <Checkout {...props} />,
      navigationOptions: {
        header: (props) => <DefaultHeader {...props} />,
        ...TransitionPresets.ModalSlideFromBottomIOS,
      },
    },
    "My Account": {
      screen: shopTabs,
    },
    Search: {
      screen: Search,
      navigationOptions: {
        ...TransitionPresets.ModalPresentationIOS,
      },
    },
  },
  {
    initialRouteName: "Shop",
    defaultNavigationOptions: {
      header: false,
    },
  }
);
const appDrawer = createDrawerNavigator(
  {
    drawer: {
      screen: mainStack,
    },
  },
  {
    initialRouteName: "drawer",
    contentComponent: (props) => <Drawer {...props} />,
    drawerWidth: Dimensions.get("window").width / 1.2,
    drawerPosition: "left",
    gesturesEnabled: false,
  }
);
const authStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: false,
    },
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: false,
      ...TransitionPresets.ModalPresentationIOS,
    },
  },
});
const appNavigator = createSwitchNavigator(
  {
    app: appDrawer,
    auth: authStack,
  },
  {
    initialRouteName: "auth",
  }
);
export default createAppContainer(appNavigator);
