import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  Animated,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Easing,
  ScrollView,
  AsyncStorage,
} from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import Animations from "../../components/Animations";
import ActivityLoader from "../../components/ActivityIndicator";
import { SvgXml } from "react-native-svg";
import WP from "../../components/WP/wp-api";
import backgrounds from "../../components/SvgBackgrounds";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Register = (props) => {
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState();
  const validate = {
    email: (e) =>
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(e).toLowerCase()
      ),
    phone: (p) => (p.length >= 10 ? !/\D/gi.test(p) : false),
    name: (n) => /^[a-z ,.'-]+$/i.test(n),
    password: (p) => p.length >= 8,
    matchWith: (a, b) => a.value === b.value,
  };
  const _validateLength = (val, min, max) =>
    val.length <= min && val.length >= max;
  const fields = {
    first_name: {
      title: "First Name",
      minChar: 1,
      type: "name",
      maxChar: 26,
      next: "last_name",
      style: { width: "49%" },
    },
    last_name: {
      title: "Last Name",
      type: "name",
      next: "email",
      minChar: 1,
      maxChar: 26,
      style: { width: "49%" },
    },
    email: {
      title: "Email",
      config: {
        autoCapitalize: "none",
      },
      type: "email",
      next: "phone",
    },
    phone: {
      title: "Phone number",
      next: "password",
      type: "phone",
    },
    password: {
      title: "Password",
      config: {
        secureTextEntry: true,
        autoCapitalize: "none",
      },
      validate: false,
      next: "repassword",
      type: "password",
    },
    repassword: {
      title: "Re-type Password",
      config: {
        secureTextEntry: true,
        autoCapitalize: "none",
      },
      validate: true,
      type: "password",
    },
  };
  useEffect(() => {
    setLoading(false);
    setFormFields(fields);
  }, []);
  useEffect(() => {
    if (formFields) {
      Object.keys(formFields).map((k) => {
        let ff = formFields[k];
        ff.onBlur = () => {
          if (ff.value === undefined || ff.value.trim().length === 0) return;
          let valid = validate[ff.type](ff.value);
          if (ff.type === "password" && ff.validate)
            valid = validate.matchWith(
              formFields.password,
              formFields.repassword
            );
          setFormFields(() => {
            let f = { ...formFields };
            let s = {};
            if (!valid) s = { backgroundColor: "#ed4337" };
            else s = { backgroundColor: "#fff" };
            f[k] = {
              ...f[k],
              style: {
                ...f[k].style,
                ...s,
              },
            };
            return f;
          });
        };
        ff.onSubmitEditing = () => {
          if (ff.next !== undefined) {
            setTimeout(() => {
              formFields[ff.next].ref.focus();
            }, 500);
          } else {
            _handleRegisterBtn();
          }
        };
      });
    }
  }, [formFields]);
  const _handleRegisterBtn = async () => {
    for (let k in formFields) {
      if (k === "ref") continue;
      let f = formFields[k];
      if (f.value !== undefined) {
        if (
          !validate[f.type](f.value) ||
          !_validateLength(
            f.value,
            f.min || f.value.length,
            f.max || f.value.length
          )
        ) {
          alert("Invalid " + f.title);
          return;
        }
      } else {
        alert("Please fill out the required fields.");
        return;
      }
    }
    setLoading(true);
    let res = await WP.post("users/register", {
      email: formFields.email.value.trim().toLowerCase(),
      username: formFields.email.value.trim().toLowerCase(),
      first_name: formFields.first_name.value
        .trim()
        .split(" ")
        .map((i) => i[0].toUpperCase() + i.substr(1))
        .join(" "),
      last_name: formFields.last_name.value
        .trim()
        .split(" ")
        .map((i) => i[0].toUpperCase() + i.substr(1))
        .join(" "),
      password: formFields.password.value.trim(),
      billing: {
        phone: formFields.phone.value.trim(),
      },
    })
      .then((e) => ({ error: false }))
      .catch((err) => {
        alert("Email already exists.");
        setLoading(false);
        return { error: true };
      });
    if (!res.error) {
      await AsyncStorage.removeItem("@username");
      await AsyncStorage.removeItem("@password");
      await AsyncStorage.removeItem("@token");
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.setItem("@username", formFields.email.value);
      await AsyncStorage.setItem("@password", formFields.password.value);
      props.navigation.navigate("Login", {
        autologin: true,
      });
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ActivityLoader visible={loading} offset={0} />
      <ScrollView>
        <View style={style.root}>
          <Animations
            style={{ width: "100%" }}
            config={{ easing: Easing.elastic(), delay: 300 }}
            name="slideY"
            method="timing"
            from={new Animated.Value(SCREEN_HEIGHT)}
            to={0}
            duration={1000}
          >
            <View>
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.05)",
                  padding: 30,
                  borderRadius: 30,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Title style={{ marginBottom: 13 }}>Create Account</Title>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {formFields &&
                      Object.keys(formFields).map((k, i) => (
                        <TextInput
                          key={i}
                          ref={(ref) => {
                            if (ref) formFields[k].ref = ref;
                          }}
                          value={formFields[k].value}
                          onChangeText={(val) => {
                            setFormFields(() => {
                              let f = { ...formFields };
                              let s = {};
                              f[k] = { ...formFields[k], value: val };
                              return f;
                            });
                          }}
                          style={{
                            borderTopStartRadius: 10,
                            borderTopEndRadius: 10,
                            borderBottomEndRadius: 10,
                            marginVertical: 3,
                            borderBottomStartRadius: 10,
                            overflow: "hidden",
                            width: "100%",
                            backgroundColor: "#fff",
                            ...formFields[k].style,
                          }}
                          onSubmitEditing={() =>
                            formFields[k].onSubmitEditing()
                          }
                          onBlur={() => formFields[k].onBlur()}
                          returnKeyType={formFields[k].next ? "next" : "done"}
                          label={formFields[k].title}
                          {...formFields[k].config}
                        />
                      ))}
                  </View>
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
                    onPress={_handleRegisterBtn}
                  >
                    Register Now
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
              <Text
                style={{ color: "#fff", textDecorationLine: "underline" }}
                onPress={() => props.navigation.navigate("Login")}
              >
                I already have an account
              </Text>
            </View>
          </Animations>
        </View>
      </ScrollView>
      <SvgXml
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: "#1c5822",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
        xml={backgrounds.squares}
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
    backgroundColor: "#fff",
  },
});

export default Register;
