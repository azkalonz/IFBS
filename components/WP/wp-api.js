import React from "react";
import { AsyncStorage } from "react-native";
import axios from "axios";

// Token: POST end point https://ifbs.ifuel.com.ph/wp-json/jwt-auth/v1/token
// Me: GET end point https://ifbs.ifuel.com.ph/wp-json/wp/v2/users/me
// All Products: GET end point https://ifbs.ifuel.com.ph/wp-json/wc/v3/products
const url = "https://ifbs.ifuel.com.ph/wp-json/wp/v2/";

export default {
  post: (endpoint, data) => {
    let u = url + endpoint;
    return axios.post(u, data, {
      headers: {
        "Content-type": "application/json",
      },
    });
  },
  login: async (username, password) => {
    let token = await axios
      .post("https://ifbs.ifuel.com.ph/wp-json/jwt-auth/v1/token", {
        username,
        password,
      })
      .then((resp) => JSON.parse(resp.data.trim()).token)
      .catch((err) => err);
    return await axios
      .get("https://ifbs.ifuel.com.ph/wp-json/wp/v2/users/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((resp) => ({ ...JSON.parse(resp.data.trim()), token }))
      .catch((err) => err);
  },
  getAllProducts: async () => {
    let token = null;
    try {
      token = await AsyncStorage.getItem("@token");
      if (token !== null) {
        return await axios
          .get("https://ifbs.ifuel.com.ph/wp-json/wc/v3/products", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((resp) => JSON.parse(resp.data.trim()));
      }
    } catch (error) {}
  },
  getToken: async () => {
    return await AsyncStorage.getItem("@token");
  },
};
