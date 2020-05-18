import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, Text, Image, Animated } from "react-native";
import { rootDispatch } from "../../actions";
import { connect } from "react-redux";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { ScrollView } from "react-native-gesture-handler";
import {
  Title,
  Button,
  Divider,
  Avatar,
  IconButton,
  Paragraph,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import { Rating, AirbnbRating } from "react-native-ratings";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import WooCommerceApi from "../../components/WooCommerce";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CAROUSEL_HEIGHT = SCREEN_HEIGHT - 300;
const STATUS = ["ADD TO CART", "REMOVE FROM CART"];
const Product = (props) => {
  const reviewRef = useRef();
  const ratingRef = useRef();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();
  const [reviews, setReviews] = useState();
  const [status, setStatus] = useState(STATUS[0]);
  const [index, setIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const scrollY = new Animated.Value(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const getReviews = () =>
    new WooCommerceApi(props.userInfo.jwt_token, "v2").get(
      "products/" + product.id + "/reviews"
    );
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#222" }}
      labelStyle={{ color: "#222" }}
      style={{ backgroundColor: "#fff" }}
    />
  );
  const handleReview = () => {
    setLoading(true);
    let review = {
      name: props.userInfo.first_name + " " + props.userInfo.last_name,
      review: reviewRef.current.root._getText(),
      email: props.userInfo.email,
      rating: ratingRef.current.state.position,
    };
    if (!review.review || review.review.length <= 0) reviewRef.current.focus();
    else {
      new WooCommerceApi(props.userInfo.jwt_token, "v2")
        .post("products/" + product.id + "/reviews", review)
        .then((res) => {
          setReviews([res, ...reviews]);
          setIndex(1);
          setLoading(false);
        });
    }
  };
  const RateAndReview = () => (
    <View style={{ padding: 13 }}>
      {!loading && (
        <View>
          <AirbnbRating
            ref={ratingRef}
            count={5}
            reviews={["Meh", "OK", "Good", "Very Good", "Amazing"]}
            defaultRating={5}
            size={20}
          />
          <TextInput
            ref={reviewRef}
            placeholder="Amazing product!"
            label="Review"
            multiline={true}
            height={100}
          />
          <Button mode="contained" onPress={handleReview}>
            Submit Review
          </Button>
        </View>
      )}
      {loading && <ActivityIndicator animating={loading} />}
    </View>
  );
  const ReviewsRoute = () => (
    <View style={{ height: 300 }}>
      <ScrollView>
        <View style={{ paddingBottom: 80, backgroundColor: "#fff" }}>
          {reviews &&
            reviews.map((rev, index) => (
              <View
                key={index}
                style={{ padding: 13, backgroundColor: "#fff" }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View>
                    <Avatar.Image
                      size={40}
                      resizeMethod="resize"
                      source={require("../../assets/avatar.png")}
                      style={{ marginRight: 10 }}
                    />
                  </View>
                  <View>
                    <Rating
                      type="star"
                      readonly={true}
                      ratingCount={5}
                      startingValue={parseFloat(rev.rating)}
                      imageSize={12}
                      style={{ alignItems: "flex-start" }}
                    />
                    <Text>{rev.name}</Text>
                  </View>
                </View>
                <View style={{ marginLeft: 53 }}>
                  <Paragraph>{rev.review}</Paragraph>
                </View>
                <Divider />
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <Image
          resizeMethod="resize"
          style={{ width: SCREEN_WIDTH, height: "100%" }}
          source={{ uri: item.src }}
          resizeMode="cover"
        />
      </View>
    );
  };
  const renderScene = SceneMap({
    first: RateAndReview,
    second: ReviewsRoute,
  });
  const [routes] = React.useState([
    { key: "first", title: "Rate & Review" },
    { key: "second", title: "Reviews" },
  ]);
  useEffect(() => {
    let p = props.navigation.state.params;
    if (p === undefined) props.navigation.goBack();
    setProduct(p);
    if (props.cartItems[p.id] !== undefined) {
      setStatus(STATUS[1]);
    }
  }, []);
  useEffect(() => {
    if (product && !reviews)
      getReviews().then((resp) => {
        if (resp) setReviews(resp.reverse());
      });
  }, [product]);
  return (
    <View>
      <Animated.ScrollView
        snapToOffsets={[100]}
        snapToEnd={false}
        snapToStart={true}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY,
              },
            },
          },
        ])}
        stickyHeaderIndices={[0]}
      >
        <Animated.View
          style={{
            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            position: "absolute",
            backgroundColor: "#fff",
            padding: 7,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.5,
            shadowRadius: 12.35,
            elevation: 19,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            left: 0,
            right: 0,
            top: 0,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              onPress={() => props.navigation.goBack()}
            />
            <Animated.View
              style={{
                opacity: scrollY.interpolate({
                  inputRange: [0, CAROUSEL_HEIGHT - 30, CAROUSEL_HEIGHT],
                  outputRange: [0, 0, 1],
                  extrapolate: "clamp",
                }),
              }}
            >
              {product && <Title>{product.name}</Title>}
            </Animated.View>
          </View>
        </Animated.View>
        {product && (
          <View style={{ backgroundColor: "#fff" }}>
            <View
              style={{
                width: "100%",
                height: CAROUSEL_HEIGHT,
              }}
            >
              <Animated.View
                style={{
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  opacity: scrollY.interpolate({
                    inputRange: [CAROUSEL_HEIGHT / 2, CAROUSEL_HEIGHT],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                  left: 0,
                  zIndex: 9,
                }}
                pointerEvents="none"
              ></Animated.View>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Carousel
                  data={product.images}
                  renderItem={_renderItem}
                  sliderWidth={SCREEN_WIDTH}
                  itemWidth={SCREEN_WIDTH}
                  onSnapToItem={(i) => setActiveSlide(i)}
                />
                <Pagination
                  dotsLength={product.images.length}
                  containerStyle={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                  activeDotIndex={activeSlide}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 9,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 12.35,

                    elevation: 19,
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
                <Image
                  style={{
                    width: SCREEN_WIDTH,
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: -1,
                    bottom: 0,
                  }}
                  resizeMethod="resize"
                  source={{ uri: product.images[activeSlide].src }}
                  blurRadius={100}
                  resizeMode="cover"
                />
              </View>
            </View>
            <Divider />
            <View style={{ alignItems: "flex-start", padding: 13 }}>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Title style={{ fontSize: 30 }}>{product.name}</Title>
                </View>
                <View>
                  <IconButton icon="heart-outline" color="#1c5822" />
                </View>
              </View>
              <Rating
                type="star"
                readonly={true}
                ratingCount={5}
                startingValue={parseFloat(product.average_rating)}
                imageSize={19}
                style={{ alignItems: "flex-start" }}
              />
              <Paragraph style={{ marginTop: 13 }}>Lorem Ipsum</Paragraph>
            </View>
          </View>
        )}
        <Divider />
        <View
          style={{
            flexDirection: "row",
            padding: 13,
            backgroundColor: "#fff",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            {product && product.sale_price.length ? (
              <Title style={{ textDecorationLine: "line-through" }}>
                P {product.regular_price * parseInt(qty)}
              </Title>
            ) : null}
            <Title>P {product && product.price * parseInt(qty)}</Title>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              icon="minus"
              style={{
                backgroundColor: "#fff",
                borderRadius: 7,
                borderColor: "#888",
                borderWidth: 0.5,
              }}
              onPress={() => {
                if (parseInt(qty) <= 1) return;
                if (props.cartItems[product.id] === undefined)
                  setQty(parseInt(qty) - 1);
                else {
                  props.setQty(product.id, props.cartItems[product.id].qty - 1);
                  setQty(parseInt(qty) - 1);
                }
              }}
            />
            <TextInput
              style={{ backgroundColor: "#fff", borderRadius: 7, height: 40 }}
              placeholder="1"
              value={qty.toString()}
              keyboardType="numeric"
              onChangeText={(val) => {
                if (
                  parseInt(val) <= 0 ||
                  product === undefined ||
                  isNaN(parseInt(val))
                )
                  return;
                if (props.cartItems[product.id] === undefined) setQty(val);
                else {
                  props.setQty(product.id, parseInt(val));
                  setQty(val);
                }
              }}
            />
            <IconButton
              style={{
                backgroundColor: "#fff",
                borderRadius: 7,
                borderColor: "#888",
                borderWidth: 0.5,
              }}
              icon="plus"
              onPress={() => {
                if (props.cartItems[product.id] === undefined)
                  setQty(parseInt(qty) + 1);
                else {
                  props.setQty(product.id, props.cartItems[product.id].qty + 1);
                  setQty(parseInt(qty) + 1);
                }
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Button
            icon="cart"
            mode={status === STATUS[1] ? "outlined" : "contained"}
            style={{ flex: 1 }}
            onPress={() => {
              if (product === undefined) return;
              if (status === STATUS[0]) {
                props.addToCart(product, qty);
                setStatus(STATUS[1]);
              } else {
                props.removeFromCart(product.id);
                setStatus(STATUS[0]);
              }
            }}
          >
            {status}
          </Button>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          initialLayout={{ width: SCREEN_WIDTH }}
        />
      </Animated.ScrollView>
    </View>
  );
};

const mapStatetoProps = (state) => {
  return {
    cartItems: state.cartItems,
    userInfo: state.userInfo,
  };
};

export default connect(mapStatetoProps, rootDispatch)(Product);
