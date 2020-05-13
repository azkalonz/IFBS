import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Button, Card, Title } from "react-native-paper";
import WP from "../../components/WP/wp-api";
import { connect } from "react-redux";
import { cartDispatch } from "../../actions";
import { WebView } from "react-native-webview";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const mapStateToProps = (state) => {
  return {
    cartItems: state,
  };
};

const Shop = (props) => {
  const [products, setProducts] = useState();
  const [webView, setWebView] = useState();
  const [documentHeight, setDocumentHeight] = useState(0);
  const navigation = props.navigation;
  useEffect(() => {
    WP.getAllProducts().then((resp) => {
      setProducts(resp);
    });
  }, []);
  const productItem = (product) => {
    return (
      <Card
        onPress={() => {
          navigation.navigate("Product Details", product);
        }}
        style={{ width: "47%", margin: 5, position: "relative" }}
        key={product.id}
      >
        <Title
          style={{
            fontWeight: "bold",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2,
            color: "#fff",
            backgroundColor: "#000",
            borderRadius: 200,
            paddingHorizontal: 12,
            paddingVertical: 5,
          }}
        >
          P {product.price}
        </Title>
        <Card.Cover source={{ uri: product.images[0].src }} />
        <Card.Content>
          <Title numberOfLines={1}>{product.name}</Title>
        </Card.Content>
        <Card.Actions>
          {product.type === "simple" && (
            <Button
              mode="contained"
              icon="cart"
              style={{ width: "100%" }}
              onPress={() => {
                if (
                  props.cartItems.filter((item) => item.id === product.id)
                    .length
                ) {
                  navigation.navigate("Cart");
                } else {
                  props.addItem(product);
                }
              }}
            >
              {props.cartItems.filter((item) => item.id === product.id).length
                ? "Checkout"
                : "Add to Cart"}
            </Button>
          )}
          {product.type !== "simple" && (
            <Button mode="contained" icon="eye" style={{ width: "100%" }}>
              VARIATIONS
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };
  const setHeight = () => setDocumentHeight();
  const details = (props) => {
    navigation.navigate("Product Details", { test: props });
  };
  const onWebViewMessage = (event) => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
      if (typeof eval(data.action) === "function") {
        eval(data.action)(data.args);
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  };
  return (
    <ScrollView>
      <WebView
        ref={(wv) => {
          setWebView(wv);
        }}
        injectedJavaScript={`
          window.onload = function(){
            window.ReactNativeWebView.postMessage('{"action":"setHeight"}');
          }
          document.querySelectorAll('.add_to_cart_button').forEach(btn=>{
            btn.onclick=()=>{
              window.ReactNativeWebView.postMessage('{"action":"details","args":"hello"}');
            }
          })
        `}
        source={{ uri: "https://ifbs.ifuel.com.ph/shop-mobile" }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 3 }}
        onMessage={onWebViewMessage}
      />
      {/* <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {products && products.map((product) => productItem(product))}
      </View> */}
    </ScrollView>
  );
};

export default connect(mapStateToProps, cartDispatch)(Shop);
