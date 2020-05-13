import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ScrollView,
  Text,
  Dimensions,
  RefreshControl,
  View,
  StatusBar,
} from "react-native";
import { connect } from "react-redux";
import { rootDispatch } from "../../actions";
import { WebView } from "react-native-webview";
import axios from "axios";
import Loader from "../../components/ActivityIndicator";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems,
    userInfo: state.userInfo,
    token: state.screens.notification_token,
  };
};

const Shop = (props) => {
  const [webView, setWebView] = useState();
  const [documentHeight, setDocumentHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = props.navigation;
  useEffect(() => {
    if (refreshing && webView) {
      webView.reload();
    }
  }, [webView, refreshing]);
  useEffect(() => {
    if (props.token && props.userInfo.id) {
      axios
        .post(
          "http://notifications.ifuel.com.ph/public/notificationtoken.php",
          {
            customer_id: props.userInfo.id,
            token: props.token,
          }
        )
        .then(({ data }) => {
          if (data.status === "FAILED")
            alert("ERR: NOTIFICATION PERMISSION DENIED");
        });
    }
  }, [props.token, props.userInfo]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, [refreshing]);
  const goToProduct = ({ slug }) => navigation.navigate("Product", { slug });
  const setHeight = ({ height }) => setDocumentHeight(height);
  const viewCart = () => navigation.navigate("Cart");
  const addToCart = () => props.addToCart();
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
  return (
    <View>
      <Loader visible={true} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WebView
          ref={(wv) => {
            setWebView(wv);
          }}
          injectedJavaScript={`
        let $ = jQuery;
        $('a[href*="https://ifbs.ifuel.com.ph/product/"]').each((i,e)=>{
          $(e).on('click',function(event){
            event.preventDefault();
            let slug = $(this).attr('href').split("/");
            slug = slug[slug.length-2];
            let payload = {action: "goToProduct", args: {slug}}
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        });
        });
        $(document.body).on("added_to_cart", function (event, fragments, cart_hash, btn) {
          let id = $(btn[0]).data('product_id');
          let payload = {action: 'addToCart'}
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          if(btn[0].nextElementSibling!=null){
            btn[0].nextElementSibling.onclick = function(e){
              e.preventDefault();
              let payload = {action: 'viewCart'};
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
            }
          }
        });
        `}
          onLoadEnd={() => {
            setRefreshing(false);
            if (webView)
              webView.injectJavaScript(`
          payload = {
            action: "setHeight",
            args: {height: document.body.clientHeight}
          }
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          `);
          }}
          source={{ uri: "https://ifbs.ifuel.com.ph/shop-mobile" }}
          style={{ width: SCREEN_WIDTH, height: documentHeight }}
          onMessage={onWebViewMessage}
        />
      </ScrollView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WebView
          ref={(wv) => {
            setWebView(wv);
          }}
          injectedJavaScript={`
        let $ = jQuery;
        $('a[href*="https://ifbs.ifuel.com.ph/product/"]').each((i,e)=>{
          $(e).on('click',function(event){
            event.preventDefault();
            let slug = $(this).attr('href').split("/");
            slug = slug[slug.length-2];
            let payload = {action: "goToProduct", args: {slug}}
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        });
        });
        $(document.body).on("added_to_cart", function (event, fragments, cart_hash, btn) {
          let id = $(btn[0]).data('product_id');
          let payload = {action: 'addToCart'}
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          if(btn[0].nextElementSibling!=null){
            btn[0].nextElementSibling.onclick = function(e){
              e.preventDefault();
              let payload = {action: 'viewCart'};
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
            }
          }
        });
        `}
          onLoadEnd={() => {
            setRefreshing(false);
            if (webView)
              webView.injectJavaScript(`
          payload = {
            action: "setHeight",
            args: {height: document.body.clientHeight}
          }
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          `);
          }}
          source={{ uri: "https://ifbs.ifuel.com.ph/shop-mobile" }}
          style={{ width: SCREEN_WIDTH, height: documentHeight }}
          onMessage={onWebViewMessage}
        />
      </ScrollView>
    </View>
  );
};

export default connect(mapStateToProps, rootDispatch)(Shop);
