import React, { useState } from "react";
import { View, Dimensions, Text } from "react-native";
import { rootDispatch } from "../../actions";
import { connect } from "react-redux";
import { WebView } from "react-native-webview";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Cart = (props) => {
  const [webView, setWebView] = useState();
  const { navigation } = props;
  const gotoShop = () => navigation.goBack();
  const goToCheckout = () => navigation.navigate("Checkout");
  const removeFromCart = () => props.removeFromCart();
  const onWebViewMessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
      if (typeof eval(data.action) === "function") {
        if (data.args !== undefined) eval(data.action)(data.args);
        else eval(data.action)();
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  };
  const webViewScripts = `
  setReturnToShopBtn = ()=>{
    let r = document.querySelector('.wc-backward');
    r.onclick = (e)=>{
      e.preventDefault();
      payload = {action: "gotoShop"}
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    };
  }
  removeFromCart = ()=>{
    let payload = {action: 'removeFromCart'};
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
  }
  setCheckout = ()=>{
    jQuery('.checkout-button').click(function(e){
      e.preventDefault();
      payload = {action: "goToCheckout"}
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    })
  }
  `;
  return (
    <View style={{ height: SCREEN_HEIGHT - 25, width: SCREEN_WIDTH }}>
      <WebView
        ref={(wv) => {
          setWebView(wv);
        }}
        automaticallyAdjustContentInsets={false}
        onLoadEnd={() => {
          if (webView)
            webView.injectJavaScript(
              `
              ${webViewScripts}
              initCart = ()=>{
               setCheckout();
                if(document.querySelector('.wc-backward')!==null){
                  setReturnToShopBtn();
                }
                $ = jQuery;
                $(document.body).on("updated_cart_totals", function () {
                  setCheckout();
                  removeFromCart();
                });
                $(document.body).on("wc_cart_emptied", function () {
                  removeFromCart();
                  if(document.querySelector('.wc-backward')!==null){
                    setReturnToShopBtn();
                  }
                });
              }
              initCart();
              `
            );
        }}
        source={{ uri: "https://ifbs.ifuel.com.ph/cart-mobile" }}
        onMessage={onWebViewMessage}
      />
    </View>
  );
};

const mapStatetoProps = (state) => {
  return {
    cartItems: state,
  };
};

export default connect(mapStatetoProps, rootDispatch)(Cart);
