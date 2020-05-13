import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, Dimensions, Text, Image } from "react-native";
import { rootDispatch } from "../../actions";
import { connect } from "react-redux";
import {
  List,
  TextInput,
  IconButton,
  Divider,
  Button,
  Title,
} from "react-native-paper";
import ActivityLoader from "../../components/ActivityIndicator";
import WooCommerceApi from "../../components/WooCommerce";

const Cart = (props) => {
  const [accordions, setAccordions] = useState([true, false]);
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState();

  useEffect(() => {
    let t = 0;
    if (Object.keys(props.cartItems)) {
      Object.keys(props.cartItems).forEach(
        (tt) => (t += props.cartItems[tt].price * props.cartItems[tt].qty)
      );
      setSubTotal(t);
      t -= couponDiscount.amount ? parseFloat(couponDiscount.amount) : 0;
      t = t < 0 ? 0 : t;
      setTotal(t);
      setLoading(false);
    }
  }, [props.cartItems, couponDiscount]);
  const CartItem = (p) => {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#fff",
          marginVertical: 7,
          paddingVertical: 10,
        }}
        key={p.id}
      >
        <List.Item
          title={p.name}
          description={`Price: ${p.price} \nSubtotal: ${p.qty * p.price}`}
          left={(props) => (
            <Image
              style={{ width: 100, height: "100%" }}
              source={{ uri: p.images[0].src }}
              resizeMode="cover"
            />
          )}
          right={() => (
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <IconButton
                icon="close"
                size={20}
                style={{
                  position: "absolute",
                  top: -30,
                  backgroundColor: "#fff",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,

                  elevation: 2,
                  right: 0,
                }}
                onPress={() => {
                  props.removeFromCart(p.id);
                }}
              />
              <IconButton
                icon="minus"
                size={20}
                onPress={() => {
                  props.setQty(p.id, p.qty - 1);
                }}
              />
              <TextInput
                style={{ height: 40 }}
                value={p.qty.toString()}
                keyboardType="numeric"
                onChangeText={(val) =>
                  props.setQty(p.id, isNaN(parseInt(val)) ? 1 : parseInt(val))
                }
              />
              <IconButton
                icon="plus"
                size={20}
                onPress={() => {
                  props.setQty(p.id, p.qty + 1);
                }}
              />
            </View>
          )}
        />
        <Divider />
      </View>
    );
  };
  const handleAccordion = (id) => {
    let a = [...accordions];
    a[id] = !accordions[id];
    setAccordions(a);
  };
  const handleCoupon = async () => {
    setLoading(true);
    let res = await new WooCommerceApi(props.userInfo.jwt_token)
      .get("coupons?code=" + coupon)
      .then((resp) => resp);
    if (!res.length) alert("Invalid coupon");
    else {
      setCouponDiscount(res[0]);
    }
    setLoading(false);
  };
  const handleCheckout = async () => {
    setLoading(true);
    let cart = {
      payment_method: "cod",
      payment_method_title: "cash on delivery",
      set_paid: false,
      discount_total: couponDiscount.amount ? couponDiscount.amount : 0,
      line_items: Object.keys(props.cartItems).map((k) => ({
        product_id: props.cartItems[k].id,
        quantity: props.cartItems[k].qty,
      })),
    };
    if (couponDiscount.amount) {
      cart.coupon_lines = [
        {
          id: couponDiscount.id,
          code: couponDiscount.code,
          discount: couponDiscount.amount,
        },
      ];
    }
    props.navigation.navigate("Checkout", cart);
    setLoading(false);
  };
  return (
    <View>
      <ActivityLoader visible={loading} offset={60} />
      <ScrollView style={{ marginBottom: 40 }}>
        <List.Accordion
          title="ITEMS"
          id="1"
          expanded={accordions[0]}
          onPress={() => handleAccordion(0)}
        >
          {Object.keys(props.cartItems) &&
            Object.keys(props.cartItems).map((i) => (
              <CartItem {...props.cartItems[i]} key={i} />
            ))}
        </List.Accordion>
        <Divider />

        <List.Accordion
          title="COUPON CODE"
          id="1"
          expanded={accordions[1]}
          onPress={() => handleAccordion(1)}
        >
          <View style={{ padding: 13 }}>
            <TextInput
              value={coupon}
              mode="outlined"
              label="Enter Coupon Code"
              onChangeText={(val) => setCoupon(val)}
            />
            <Button mode="contained" onPress={handleCoupon}>
              Apply Coupon
            </Button>
          </View>
        </List.Accordion>
        <Divider />
        <View style={{ padding: 13 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Title>Subtotal</Title>
            <Title>{subTotal}</Title>
          </View>
          <Divider />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Title>Coupon</Title>
            <Title>
              {parseFloat(couponDiscount.amount)
                ? parseFloat(couponDiscount.amount)
                : 0}
            </Title>
          </View>
          <Divider />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Title>Total</Title>
            <Title>{total}</Title>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Button
          mode="contained"
          icon="lock"
          onPress={handleCheckout}
          disabled={Object.keys(props.cartItems).length ? false : true}
        >
          Checkout
        </Button>
      </View>
    </View>
  );
};

const mapStatetoProps = (state) => {
  return {
    cartItems: state.cartItems,
    userInfo: state.userInfo,
  };
};

export default connect(mapStatetoProps, rootDispatch)(Cart);
