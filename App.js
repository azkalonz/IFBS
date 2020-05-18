import React, { Component } from "react";
import Navigator from "./Navigator";
import { Vibration, Platform, StatusBar } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Notifications } from "expo";
import setNotification from "./Notifications";
import mainstore from "./store";

const store = mainstore;
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1c5822",
    accent: "#1c5822",
  },
};

export default class App extends Component {
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      setNotification.WrappedComponent({ token });
    } else {
      alert("Must use physical device for Push Notifications");
    }
    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("order-status", {
        name: "Order Status",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
      Notifications.createChannelAndroidAsync("note", {
        name: "New Note",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  _handleNotification = (notification) => {
    Vibration.vibrate();
    setNotification.WrappedComponent({ notification });
  };
  render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <StatusBar translucent={true} />
          <Navigator />
        </PaperProvider>
      </Provider>
    );
  }
}
