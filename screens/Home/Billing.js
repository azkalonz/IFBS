import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { Title, TextInput, List, Button } from "react-native-paper";
import WooCommerceApi from "../../components/WooCommerce";
import { connect } from "react-redux";
import { rootDispatch } from "../../actions";
import ActivityLoader from "../../components/ActivityIndicator";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Billing = (props) => {
  const [accordions, setAccordions] = useState([true, false]);
  const [shipping, setShipping] = useState(null);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (shipping === null) getUserShipping();
  });
  const getUserShipping = async () => {
    let r = await new WooCommerceApi(props.userInfo.jwt_token).get(
      "customers/" + props.userInfo.id
    );
    setLoading(false);
    props.setUserInfo({ billing: r.billing, shipping: r.shipping });
    setBilling(r.billing);
    setShipping(r.shipping);
  };
  const handleShipping = (p) => {
    setShipping({ ...shipping, ...p });
  };
  const handleBilling = (p) => {
    setBilling({ ...billing, ...p });
  };
  const billing_fields = [
    { title: "First Name", key: "first_name", style: { width: "49%" } },
    { title: "Last Name", key: "last_name", style: { width: "49%" } },
    {
      title: "Phone Number",
      key: "phone",
      config: { keyboardType: "numeric" },
    },
    { title: "Email", key: "email" },
    { title: "Company (Optional)", key: "company" },
    { title: "Address 1", key: "address_1" },
    { title: "Address 2", key: "address_2" },
    { title: "City", key: "city" },
    { title: "State", key: "state" },
    { title: "Postcode", key: "postcode" },
    { title: "Country", key: "country" },
  ];
  const saveBilling = async () => {
    setLoading(true);
    if (!billing.phone) {
      alert("Please enter a valid phone number");
      setLoading(false);
      return;
    } else if (!billing.address_1) {
      alert("Please enter your address");
      setLoading(false);
      return;
    }
    await new WooCommerceApi(props.userInfo.jwt_token)
      .post("customers/" + props.userInfo.id, {
        billing,
      })
      .then((resp) => {
        setLoading(false);
        props.setUserInfo({ billing: resp.billing, shipping: resp.shipping });
        props.navigation.goBack();
      });
  };
  return (
    <KeyboardAvoidingView>
      <ActivityLoader visible={loading} offset={60} />
      <ScrollView style={{ marginBottom: 40 }}>
        <View>
          <List.Accordion
            title="CONTACT INFO"
            id="1"
            expanded={accordions[0]}
            onPress={() =>
              setAccordions(() => {
                let a = [...accordions];
                a[0] = !accordions[0];
                return a;
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                width: SCREEN_WIDTH,
                flexWrap: "wrap",
                padding: 13,
                justifyContent: "space-between",
              }}
            >
              {billing_fields.map((field) => (
                <TextInput
                  mode="flat"
                  {...field.config}
                  style={
                    field.style
                      ? { ...field.style, marginVertical: 7 }
                      : { width: "100%", marginVertical: 7 }
                  }
                  key={field.key}
                  value={billing ? billing[field.key] : ""}
                  label={field.title}
                  onChangeText={(val) => {
                    let p = {};
                    p[field.key] = val;
                    handleBilling(p);
                  }}
                />
              ))}
            </View>
          </List.Accordion>
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
          icon="check"
          onPress={saveBilling}
          disabled={loading ? true : false}
        >
          Save
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
export default connect(
  (states) => ({ userInfo: states.userInfo }),
  rootDispatch
)(Billing);
