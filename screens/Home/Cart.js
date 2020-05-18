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
import { StackActions, NavigationActions } from "react-navigation";

const Cart = (props) => {
  const [accordions, setAccordions] = useState([true, true, false]);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState();
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
      setSubTotal(t.toFixed(2));
      t -= couponDiscount.amount ? parseFloat(couponDiscount.amount) : 0;
      t = t < 0 ? 0 : t;
      setTotal(t.toFixed(2));
      let cart = {
        customer_id: props.userInfo.id,
        payment_method: "cod",
        payment_method_title: "cash on delivery",
        set_paid: false,
        discount_total: couponDiscount.amount ? couponDiscount.amount : 0,
        billing: props.userInfo.billing,
        shipping: props.userInfo.shipping,
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
      setCart(cart);
      setLoading(false);
    }
  }, [props.cartItems, couponDiscount, props.userInfo.billing]);
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
    if (cart.coupon_lines) {
      alert(
        "One voucher per order only. Please remove the other voucher code."
      );
      setLoading(false);
      return;
    }
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
    if (
      props.userInfo.billing === undefined ||
      !props.userInfo.billing.phone ||
      !props.userInfo.billing.address_1
    ) {
      alert("Please add a valid contact info");
      setLoading(false);
      return;
    }
    console.log(cart);
    let r = await new WooCommerceApi(props.userInfo.jwt_token).post(
      "orders",
      cart
    );
    if (r.order_key !== undefined) {
      props.removeAllFromCart();
      const resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: "Shop" }),
          NavigationActions.navigate({ routeName: "Orders" }),
        ],
      });
      props.navigation.dispatch(resetAction);
    } else {
      alert("Something went wrong, please try again later.");
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  return (
    <View>
      <ActivityLoader visible={loading} offset={60} />
      <ScrollView style={{ paddingHorizontal: 18 }}>
        <List.Accordion
          title="ITEMS"
          id="1"
          expanded={accordions[0]}
          onPress={() => handleAccordion(0)}
          style={{ backgroundColor: "#fff" }}
        >
          {Object.keys(props.cartItems) &&
            Object.keys(props.cartItems).map((i) => (
              <CartItem {...props.cartItems[i]} key={i} />
            ))}
        </List.Accordion>
        <Divider />

        <List.Accordion
          title="CONTACT INFO"
          id="1"
          expanded={accordions[1]}
          onPress={() => handleAccordion(1)}
          style={{ backgroundColor: "#fff" }}
        >
          <View style={{ padding: 13, backgroundColor: "#fff" }}>
            {props.userInfo.billing &&
            props.userInfo.billing.first_name &&
            props.userInfo.billing.address_1 &&
            props.userInfo.billing.phone ? (
              <View>
                <Text
                  style={{ fontWeight: "bold", fontSize: 18 }}
                  numberOfLines={1}
                >
                  {props.userInfo.billing.first_name +
                    " " +
                    props.userInfo.billing.last_name}
                </Text>
                <Text style={{ fontSize: 18 }}>
                  {props.userInfo.billing.address_1}
                </Text>
                <Button
                  icon="pencil"
                  onPress={() => props.navigation.navigate("Contact Info")}
                >
                  Edit
                </Button>
              </View>
            ) : (
              <Button
                icon="plus"
                onPress={() => props.navigation.navigate("Contact Info")}
              >
                Add contact info
              </Button>
            )}
          </View>
        </List.Accordion>
        <Divider />
        <List.Accordion
          title="DO YOU HAVE A VOUCHER?"
          id="1"
          expanded={accordions[2]}
          onPress={() => handleAccordion(2)}
          style={{ backgroundColor: "#fff" }}
        >
          <View style={{ padding: 13, backgroundColor: "#fff" }}>
            <TextInput
              value={coupon}
              mode="outlined"
              label="Enter Voucher Code"
              onChangeText={(val) => setCoupon(val)}
            />
            <Button mode="contained" onPress={handleCoupon}>
              Apply
            </Button>
          </View>
        </List.Accordion>

        <View
          style={{
            padding: 13,
            backgroundColor: "#fff",
            marginTop: 13,
            borderRadius: 13,
          }}
        >
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
            <Title>Voucher</Title>
            <Title>
              {parseFloat(couponDiscount.amount)
                ? parseFloat(couponDiscount.amount)
                : 0}
            </Title>
          </View>
          {cart && cart.coupon_lines && (
            <View style={{ paddingLeft: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 18, textTransform: "uppercase" }}>
                    {cart.coupon_lines[0].code}
                  </Text>
                  <IconButton
                    icon="close"
                    style={{ backgroundColor: "red" }}
                    color="#fff"
                    onPress={() => {
                      setCouponDiscount({ ...couponDiscount, amount: 0 });
                      setCart(() => {
                        let c = { ...cart };
                        delete c.coupon_lines;
                        return c;
                      });
                    }}
                    size={13}
                  />
                </View>
                <Text>
                  {parseFloat(couponDiscount.amount)
                    ? parseFloat(couponDiscount.amount)
                    : 0}
                </Text>
              </View>
            </View>
          )}
          <Divider />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Title>Total</Title>
            <Title>{total}</Title>
          </View>
        </View>
        <View style={{ marginTop: 13 }}>
          <Button
            mode="contained"
            icon="lock"
            onPress={handleCheckout}
            disabled={Object.keys(props.cartItems).length ? false : true}
          >
            Place order ({total})
          </Button>
        </View>
      </ScrollView>
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
