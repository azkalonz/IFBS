import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  AsyncStorage,
  Animated,
  Image,
  TouchableOpacity,
  Linking,
  Easing,
  ScrollView,
} from "react-native";
import {
  ActivityIndicator,
  TextInput,
  Button,
  Title,
} from "react-native-paper";
import WP from "../../components/WP/wp-api";
import { rootDispatch } from "../../actions";
import { connect } from "react-redux";
import WooCommerceApi from "../../components/WooCommerce";
import Animations from "../../components/Animations";
import { SvgXml } from "react-native-svg";
import backgrounds from "../../components/SvgBackgrounds";
import axios from "axios";
import firebase from "../../firebase";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState();
  const [autologin, setAutologin] = useState(false);
  const [password, setPassword] = useState();
  const [status, setStatus] = useState("Loading");
  const passwordRef = useRef();
  const usernameRef = useRef();
  const navigation = props.navigation;

  useEffect(() => {
    setStatus("Loading...");
    getUserInfo();
  }, []);
  useEffect(() => {
    if (autologin) {
      handleLoginBtn();
    }
    try {
      if (props.navigation.state.params.autologin) getUserInfo();
    } catch (e) {}
  }, [autologin, props.navigation.state]);

  const getUserInfo = async () => {
    setLoading(true);
    try {
      setStatus("Getting user info...");
      const u = await AsyncStorage.getItem("@username");
      const p = await AsyncStorage.getItem("@password");
      if (u !== null && p !== null) {
        setUsername(u);
        setPassword(p);
        setAutologin(true);
      } else {
        setLoading(false);
        setAutologin(false);
      }
    } catch (error) {}
  };

  const saveLoginInfo = async (username, password, token, user) => {
    try {
      setStatus("Saving login info...");
      await AsyncStorage.setItem("@token", token);
      await AsyncStorage.setItem("@username", username);
      await AsyncStorage.setItem("@password", password);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setStatus("Loading store...");
      await new WooCommerceApi(token).get("products").then((resp) => {
        props.setProducts(resp.filter((p) => p.status === "publish"));
      });
      await props.setUserInfo({ ...user, jwt_token: token });
      navigation.navigate("app");
    } catch (error) {}
  };
  const handleLoginBtn = async () => {
    if (username === undefined) usernameRef.current.focus();
    else if (password === undefined) passwordRef.current.focus();
    if (username === undefined || password === undefined) return;
    setLoading(true);
    await WP.login(username.toLowerCase(), password).then(async (data) => {
      await axios
        .post(
          "http://notifications.ifuel.com.ph/public/notificationtoken.php",
          {
            customer_id: data.id,
            token: props.token,
          }
        )
        .then((res) => console.log(res.data, token, data.id))
        .catch((err) => alert(err));
      if (!data.token) {
        alert("Incorrect Username/Password", username, password);
        await AsyncStorage.removeItem("@token");
        await AsyncStorage.removeItem("@username");
        await AsyncStorage.removeItem("@password");
        setAutologin(false);
      } else {
        await saveLoginInfo(username, password, data.token, data);
      }
    });
    setLoading(false);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View style={style.root}>
          {loading && (
            <View style={style.loader}>
              <ActivityIndicator animating={loading} />
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", color: "#fff", marginTop: 13 }}
                >
                  {status}
                </Text>
              </View>
            </View>
          )}
          {!loading && (
            <Animations
              style={{ height: "30%", width: "100%" }}
              config={{ easing: Easing.bounce }}
              name="slideY"
              method="timing"
              from={new Animated.Value(-200)}
              to={0}
              duration={2000}
            >
              <Image
                style={{ height: "100%", width: "100%" }}
                resizeMode="contain"
                source={require("../../assets/login-logo.png")}
              />
            </Animations>
          )}
          {!loading && (
            <Animations
              style={{ width: "100%" }}
              config={{ easing: Easing.back(), delay: 300 }}
              name="fade"
              method="timing"
              from={new Animated.Value(0)}
              to={1}
              duration={1000}
            >
              <View>
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    padding: 30,
                    borderRadius: 30,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Title style={{ marginBottom: 13 }}>
                      Sign into your Account
                    </Title>
                    <TextInput
                      label="Username / Email"
                      ref={usernameRef}
                      mode="contained"
                      style={style.txtinput}
                      value={username}
                      autoCapitalize="none"
                      returnKeyType={"next"}
                      onChangeText={(val) => {
                        setUsername(val);
                      }}
                      onSubmitEditing={() => {
                        passwordRef.current.focus();
                      }}
                    />
                    <TextInput
                      label="Password"
                      ref={passwordRef}
                      mode="contained"
                      style={style.txtinput}
                      value={password}
                      autoCapitalize="none"
                      secureTextEntry={true}
                      onChangeText={(val) => {
                        setPassword(val);
                      }}
                      onSubmitEditing={handleLoginBtn}
                    />
                  </View>
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <Text
                      style={{ textDecorationLine: "underline" }}
                      onPress={() =>
                        Linking.openURL(
                          "https://ifbs.ifuel.com.ph/my-account/lost-password/"
                        )
                      }
                    >
                      Forgot your password?
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <Button
                      style={style.btn}
                      mode="contained"
                      onPress={handleLoginBtn}
                    >
                      Login
                    </Button>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{ color: "#fff", textDecorationLine: "underline" }}
                    onPress={() => navigation.navigate("Register")}
                  >
                    Don't have an account? Register Now
                  </Text>
                </TouchableOpacity>
              </View>
            </Animations>
          )}
        </View>
      </ScrollView>
      <SvgXml
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
        xml={backgrounds.tornado}
      />
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  root: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  txtinput: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
    marginVertical: 3,
    borderBottomStartRadius: 10,
    overflow: "hidden",
  },
  btn: {
    width: "80%",
    borderRadius: 30,
    marginVertical: 5,
  },
  loader: {
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 999,
  },
});

export default connect(
  (states) => ({
    token: states.screens.notification_token,
  }),
  rootDispatch
)(Login);
