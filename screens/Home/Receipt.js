import React, { Component, useEffect, useState } from "react";
import { View, Text, Alert, Image, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CaravanLogo from "../../assets/CaravanLogo";
import { Chip, Title, Divider, Button } from "react-native-paper";
import ActivityLoader from "../../components/ActivityIndicator";
import WooCommerceApi from "../../components/WooCommerce";
import { connect } from "react-redux";
import { rootDispatch } from "../../actions";

const { width, height } = Dimensions.get("window");
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const Receipt = (props) => {
  const [order, setOrder] = useState();
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let date = new Date(props.navigation.state.params.date_created);
    setDate(date);
    setOrder(props.navigation.state.params);
    setLoading(false);
  }, []);
  const handleCancelOrder = () =>
    Alert.alert(
      "Cancel Order",
      "Do you want to cancel this order?",
      [
        {
          text: "No",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            setLoading(true);
            await new WooCommerceApi(props.userInfo.jwt_token)
              .post("orders/" + order.id, {
                status: "cancelled",
              })
              .then((resp) => {
                console.log(resp);
                setLoading(false);
                setOrder({ ...order, status: "cancelled" });
              })
              .catch((err) => {
                alert("Something went wrong, please try again later.");
                console.log(err);
              });
          },
        },
      ],
      { cancelable: false }
    );
  const receiptBorder = (style = {}) => {
    var images = [],
      imgWidth = 7,
      winWidth = Dimensions.get("window").width;

    for (var i = 0; i < Math.ceil(winWidth / imgWidth); i++) {
      images.push(
        <Image
          source={require("../../assets/receipt-border.png")}
          style={{ height: 30, width: 30, ...style }}
        />
      );
    }
    return images;
  };
  return (
    <View>
      <ActivityLoader visible={loading} offset={60} />
      <ScrollView>
        <View style={{ padding: 13, paddingBottom: 100 }}>
          {order && (
            <View
              style={{
                backgroundColor: "#fff",
                shadowColor: "#000",
                marginTop: 13,
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

                elevation: 9,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  marginTop: -20,
                  overflow: "hidden",
                }}
              >
                {receiptBorder({ transform: [{ rotate: "180deg" }] }).map(
                  (i) => i
                )}
              </View>
              <View
                style={{
                  alignItems: "center",
                  marginVertical: 20,
                  marginHorizontal: 13,
                  padding: 13,
                }}
              >
                <View style={{ width: "80%", height: 100 }}>
                  <CaravanLogo width="100%" height="100%" />
                </View>
                <View
                  style={{
                    marginTop: 13,
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Title style={{ marginRight: 13 }}>Order #{order.id}</Title>
                  <Chip>
                    <Text>{order.status}</Text>
                  </Chip>
                </View>
                {date && (
                  <View style={{ width: "100%" }}>
                    <Text>
                      {month[date.getMonth()]} {date.getDate()},
                      {date.getFullYear()}
                    </Text>
                  </View>
                )}
                <View style={{ width: "100%", marginTop: 13 }}>
                  <Title>Summary</Title>
                  {order.line_items.map((i) => (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "rgba(0,255,0,0.05)",
                        padding: 7,
                        margin: 3,
                        borderRadius: 5,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={{ fontSize: 18 }}>{i.name}</Text>
                        <Text
                          style={{ marginHorizontal: 7, fontWeight: "bold" }}
                        >
                          x{i.quantity}
                        </Text>
                      </View>
                      <View>
                        <Text>{i.total}</Text>
                      </View>
                    </View>
                  ))}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      padding: 7,
                      margin: 3,
                      borderRadius: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text>TOTAL</Text>
                    <View>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {" "}
                        {order.total}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: "100%" }}>
                  <Divider />
                </View>
                {order.status === "pending" && (
                  <View
                    style={{
                      width: "100%",
                      marginTop: 13,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      icon="close"
                      style={{ flex: 1 }}
                      onPress={handleCancelOrder}
                    >
                      Cancel Order
                    </Button>
                    <Button
                      icon="note"
                      style={{ flex: 1 }}
                      mode="contained"
                      onPress={() => props.navigation.navigate("Chat", order)}
                    >
                      Add Note
                    </Button>
                  </View>
                )}
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  marginBottom: -20,
                  overflow: "hidden",
                }}
              >
                {receiptBorder().map((i) => i)}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default connect(
  (states) => ({ userInfo: states.userInfo }),
  rootDispatch
)(Receipt);
