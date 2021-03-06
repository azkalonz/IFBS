import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  ScrollView,
  Easing,
  Text,
  Button as ButtonR,
  Image,
  Animated,
  RefreshControl,
} from "react-native";
import {
  Button,
  IconButton,
  Card,
  Title,
  TouchableRipple,
  List,
  Divider,
} from "react-native-paper";
import { connect } from "react-redux";
import { rootDispatch } from "../../actions";
import WooCommerceApi from "../../components/WooCommerce";
import Animations from "../../components/Animations";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";
import { LinearGradient } from "expo-linear-gradient";
import { Hamburger } from "../../components/Icons/green";

const { width, height } = Dimensions.get("screen");
const productsButtonConfig = {
  simple: {
    title: "Add to Cart",
    isRemove: false,
    type: "SIMPLE",
  },
  variations: {
    title: "Variations",
    isRemove: false,
    type: "VARIATION",
  },
};
const options = {
  config: {
    width: 100,
    height: 100,
  },
};

const Shop = (props) => {
  const scrollY = new Animated.Value(0);
  const [page, setPage] = useState(2);
  const [nomore, setNomore] = useState(false);
  const [buttons, setButtons] = useState(
    props.products.map((product) =>
      product.type === "simple"
        ? {
            ...productsButtonConfig.simple,
            width: new Animated.Value(20),
            options: {
              ...options,
              height: new Animated.Value(0),
              width: new Animated.Value(0),
            },
          }
        : {
            ...productsButtonConfig.variations,
            width: new Animated.Value(20),
            options: {
              ...options,
              height: new Animated.Value(0),
              width: new Animated.Value(0),
            },
          }
    )
  );
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    new WooCommerceApi(props.userInfo.jwt_token, "v2")
      .get("products?per_page=20&page=" + page)
      .then((resp) => {
        if (resp.length) {
          let newProducts = props.products.concat(
            resp.filter((p) => p.status === "publish")
          );
          props.setProducts(newProducts);
          setButtons(
            newProducts.map((product) =>
              product.type === "simple"
                ? {
                    ...productsButtonConfig.simple,
                    width: new Animated.Value(20),
                    options: {
                      ...options,
                      height: new Animated.Value(0),
                      width: new Animated.Value(0),
                    },
                  }
                : {
                    ...productsButtonConfig.variations,
                    width: new Animated.Value(20),
                    options: {
                      ...options,
                      height: new Animated.Value(0),
                      width: new Animated.Value(0),
                    },
                  }
            )
          );
          setPage(page + 1);
        } else {
          setNomore(true);
        }
        setRefreshing(false);
      });
  }, [refreshing]);
  const _animate = (from, to, d = 1200) =>
    Animated.timing(from, {
      toValue: to,
      duration: d,
      easing: Easing.elastic(),
      extrapolate: "clamp",
    });
  const handleProductOptions = (i) => {
    const { width, height } = buttons[i].options;
    let w = width.__getValue() !== 0 ? 0 : buttons[i].options.config.width;
    let h = height.__getValue() !== 0 ? 0 : buttons[i].options.config.height;
    _animate(buttons[i].options.height, h, 300).start();
    _animate(buttons[i].options.width, w, 300).start();
  };
  const handleItemButton = (i, p, x = true) => {
    let b = buttons;
    let isRemove = buttons[i].title === "Remove";
    if (isRemove && x) {
      props.navigation.navigate("Cart");
      return;
    }
    switch (buttons[i].type) {
      case "SIMPLE":
        isRemove
          ? _animate(buttons[i].width, 20).start()
          : _animate(buttons[i].width, 100).start();

        isRemove ? props.removeFromCart(p.id) : props.addToCart(p);
        b = [...buttons];
        b.splice(i, 1);
        b.splice(i, 0, {
          ...buttons[i],
          config: {
            style: isRemove ? {} : style.selected,
            color: isRemove ? "#1c5822" : "#fff",
          },
          title: isRemove ? "Add to cart" : "Remove",
        });
    }
    setButtons(b);
  };
  const productItem = (product, i) => {
    const handleProduct = () => props.navigation.navigate("Product", product);
    if (buttons[i] === undefined) return null;
    let catImage = props.categories.filter(
      (c) => c.name === product.categories[0].name
    )[0];
    catImage = catImage.image === null ? null : catImage.image.src;
    return (
      <Card
        style={{ width: "47%", margin: 5, position: "relative" }}
        key={i}
        onPress={() => null}
      >
        <View
          style={{ position: "absolute", right: 0, top: 130, zIndex: 99999 }}
        >
          <TouchableRipple
            rippleColor="rgba(0, 0, 0, .32)"
            onPress={() => handleProductOptions(i)}
            style={{ borderRadius: 100 }}
          >
            <IconButton icon="dots-vertical" size={18} />
          </TouchableRipple>
          <Animated.View
            style={{
              position: "absolute",
              right: 3,
              top: 30,
              overflow: "hidden",
              opacity: buttons[i].options.width.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
              }),
              width: buttons[i].options.width.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 160],
              }),
              padding: 0,
              zIndex: 999,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <List.Item
              title="Add to favorites"
              titleStyle={{ fontSize: 15 }}
              style={{ padding: 0 }}
            />
            <Divider />
            {buttons[i].title === "Remove" ? (
              <TouchableOpacity
                onPress={() => {
                  handleProductOptions(i);
                  handleItemButton(i, product, false);
                  props.removeFromCart(product.id);
                }}
              >
                <List.Item
                  title="Remove from cart"
                  titleStyle={{ fontSize: 15 }}
                  style={{ padding: 0 }}
                />
              </TouchableOpacity>
            ) : null}
          </Animated.View>
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2,
            padding: 6,
          }}
        >
          {catImage !== null ? (
            <Image
              resizeMethod="resize"
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
              source={{
                uri: catImage,
              }}
            />
          ) : null}
        </View>
        {product.sale_price.length ? (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              zIndex: 2,
              backgroundColor: "red",
              padding: 6,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#fff" }}>
              {Math.floor(
                (parseFloat(product.sale_price) /
                  parseFloat(product.regular_price)) *
                  100
              )}{" "}
              % OFF
            </Text>
          </View>
        ) : null}
        <TouchableOpacity onPress={handleProduct}>
          <Card.Cover
            source={{ uri: product.images[0].src }}
            style={{ height: 130 }}
          />
        </TouchableOpacity>
        <Card.Content
          style={{
            minHeight: 45,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <TouchableOpacity onPress={handleProduct}>
              <Text numberOfLines={2} style={{ fontSize: 16 }}>
                {product.name}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontWeight: "bold", color: "#fda209" }}>
            P {product.price}
          </Text>
          <Rating
            type="star"
            readonly={true}
            ratingCount={5}
            startingValue={parseFloat(product.average_rating)}
            imageSize={12}
            style={{ alignItems: "flex-start" }}
          />
        </Card.Content>
        <Card.Actions>
          <View style={{ width: "100%" }}>
            {product.type === "simple" ? (
              <TouchableOpacity onPress={() => handleItemButton(i, product)}>
                <Animated.View
                  style={{
                    borderRadius: 30,
                    width: buttons[i].width.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: buttons[i].width.interpolate({
                      inputRange: [20, 100],
                      outputRange: ["rgba(28,88,34,0)", "rgba(28,88,34,1)"],
                    }),
                  }}
                >
                  <IconButton
                    icon="cart"
                    color={
                      buttons[i].config ? buttons[i].config.color : "#1c5822"
                    }
                  />
                  <Animated.Text
                    numberOfLines={1}
                    style={{
                      opacity: buttons[i].width.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 1],
                      }),
                      color: "#fff",
                    }}
                  >
                    {buttons[i].title === "Remove" ? "View Cart" : " "}
                  </Animated.Text>
                </Animated.View>
              </TouchableOpacity>
            ) : (
              <IconButton icon="plus" color="#1c5822" />
            )}
            <Animated.View
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                opacity:
                  product.type === "simple"
                    ? buttons[i].width.interpolate({
                        inputRange: [20, 100],
                        outputRange: [1, 0],
                      })
                    : 1,
              }}
            >
              <TouchableOpacity onPress={() => null}>
                <IconButton icon="heart-outline" color="#1c5822" />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Card.Actions>
      </Card>
    );
  };
  return (
    <Animated.ScrollView
      stickyHeaderIndices={[0]}
      snapToOffsets={[100]}
      snapToEnd={false}
      snapToStart={true}
      onScroll={(e) => {
        scrollY.setValue(e.nativeEvent.contentOffset.y);
        let paddingToBottom = 100;
        paddingToBottom += e.nativeEvent.layoutMeasurement.height;
        if (
          e.nativeEvent.contentOffset.y >=
          e.nativeEvent.contentSize.height - paddingToBottom
        ) {
          if (!nomore && !refreshing) onRefresh();
        }
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ width: "100%" }}>
        <Animated.View
          style={{
            opacity: scrollY.interpolate({
              inputRange: [0, 60],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          }}
        >
          <LinearGradient
            colors={["#9cc637", "#1c5822"]}
            start={[1.2, 0.8]}
            style={{
              width: "100%",
              padding: 13,
              paddingBottom: 50,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 21,
              }}
            >
              Choose store
            </Text>
          </LinearGradient>
        </Animated.View>
        <Animated.ScrollView
          horizontal={true}
          style={{
            marginTop: -34,
            borderRadius: scrollY.interpolate({
              inputRange: [0, 90],
              outputRange: [10, 0],
              extrapolate: "clamp",
            }),
            backgroundColor: "#fff",
            padding: scrollY.interpolate({
              inputRange: [0, 90],
              outputRange: [13, 0],
              extrapolate: "clamp",
            }),
            margin: scrollY.interpolate({
              inputRange: [0, 90],
              outputRange: [9, 0],
              extrapolate: "clamp",
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 60],
                  outputRange: [0, -60],
                  extrapolate: "clamp",
                }),
              },
            ],
            flexDirection: "row",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          {props.categories &&
            props.categories
              .filter((c) => c.name !== "App")
              .map((c, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    props.navigation.navigate("ProductsByStore", c)
                  }
                >
                  <Animated.View
                    style={{
                      padding: 10,
                      alignItems: "center",
                      transform: [
                        {
                          scale: scrollY.interpolate({
                            inputRange: [0, 60],
                            outputRange: [1, 0.7],
                            extrapolate: "clamp",
                          }),
                        },
                      ],
                    }}
                  >
                    {c.image !== null ? (
                      <Image
                        resizeMethod="resize"
                        source={{ uri: c.image.src }}
                        style={{ width: 50, height: 50 }}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text>{c.name}</Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
        </Animated.ScrollView>
      </View>
      {/* <Animations
        name="fade"
        method="timing"
        from={new Animated.Value(0)}
        to={1}
        duration={1000}
      >
        <View style={{ marginBottom: 13 }}>
          <Title style={{ padding: 13 }}>Promos</Title>
          <ScrollView
            horizontal={true}
            snapToInterval={width + 6}
            showsHorizontalScrollIndicator={false}
          >
            <View
              style={{
                marginLeft: 13,
                height: 100,
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Image
                style={{ height: "100%", width: width, borderRadius: 8 }}
                resizeMode="contain"
                source={require("../../assets/carousel/1.jpg")}
              />
              <Image
                style={{ height: "100%", width: width, borderRadius: 8 }}
                resizeMode="contain"
                source={require("../../assets/carousel/2.png")}
              />
              <Image
                style={{ height: "100%", width: width, borderRadius: 8 }}
                resizeMode="contain"
                source={require("../../assets/carousel/4.png")}
              />
              <Image
                style={{ height: "100%", width: width, borderRadius: 8 }}
                resizeMode="contain"
                source={require("../../assets/carousel/3.png")}
              />
            </View>
          </ScrollView>
        </View>
      </Animations> */}
      <Animations
        name="fade"
        method="timing"
        from={new Animated.Value(0)}
        to={1}
        duration={1000}
      >
        <Title style={{ padding: 13 }}>Products</Title>
        <Animations
          name="slideY"
          method="timing"
          from={new Animated.Value(height)}
          config={{ easing: Easing.elastic() }}
          to={0}
          duration={1000}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {props.products &&
            props.products.map((product, index) => productItem(product, index))}
        </Animations>
      </Animations>
    </Animated.ScrollView>
  );
};
const style = {
  selected: {
    backgroundColor: "#1c5822",
  },
};
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartItems,
    userInfo: state.userInfo,
    products: state.products,
    categories: state.categories,
  };
};

export default connect(mapStateToProps, rootDispatch)(Shop);
