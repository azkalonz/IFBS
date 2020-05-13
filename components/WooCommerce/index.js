import axios from "axios";
let base64 = require("base-64");

function WooCommerceApi(token = "") {
  this.username = "ck_75a262e62f2d034bd292d8bf23ad29deab44d285";
  this.password = "cs_d518ad3d46cdf0701800dff183897a2869ba449c";
  this.url = "https://ifbs.ifuel.com.ph/wp-json/wc/v3/";
  this.jwt = token;
  this.get = (endpoint) => {
    return axios
      .get(this.url + endpoint, {
        headers: {
          Authorization:
            "Bearer " +
            this.jwt +
            ", " +
            "Basic " +
            base64.encode(this.username + ":" + this.password),
        },
      })
      .then((resp) => JSON.parse(resp.data.trim()))
      .catch((err) => err);
  };
  this.post = (endpoint, data) => {
    return axios
      .post(this.url + endpoint, data, {
        headers: {
          Authorization:
            "Bearer " +
            this.jwt +
            ", " +
            "Basic " +
            base64.encode(this.username + ":" + this.password),
        },
      })
      .then((resp) => JSON.parse(resp.data.trim()))
      .catch((err) => err);
  };
}

export default WooCommerceApi;
