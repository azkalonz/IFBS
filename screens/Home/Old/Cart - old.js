import React, { useState } from "react";
import { ScrollView, View, Text, Image } from "react-native";
import {
  Title,
  Subheading,
  TextInput,
  IconButton,
  Dialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";
import { cartDispatch } from "../../actions";
import { connect } from "react-redux";

const Cart = (props) => {
  const [dialog, setDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState();
  const CartItem = (product) => {
    return (
      <View
        key={product.id}
        style={{
          padding: 15,
          borderWidth: 1,
          marginBottom: 20,
          borderColor: 90,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            style={{
              marginRight: 10,
              width: 100,
              height: 100,
              borderRadius: 100,
            }}
            source={{
              uri: product.images[0].src,
            }}
          />
          <Title numberOfLines={1}>{product.name}</Title>
          <IconButton
            style={{
              backgroundColor: "red",
              position: "absolute",
              top: 0,
              right: 0,
            }}
            icon="close"
            color="#fff"
            onPress={() => {
              setItemToRemove(product.id);
              setDialog(true);
            }}
          />
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
        >
          <Subheading style={{ marginRight: 30 }}>Quantity</Subheading>
          <IconButton
            icon="minus"
            color="#fff"
            style={{ backgroundColor: "#fda209" }}
            onPress={() => product.qty > 1 && props.addQty(product.id, -1)}
          />
          <TextInput
            placeholder="0"
            value={product.qty.toString()}
            keyboardType="numeric"
            onChangeText={(val) => {
              props.setQty(
                product.id,
                isNaN(parseInt(val)) ? product.qty : parseInt(val)
              );
            }}
          />
          <IconButton
            icon="plus"
            color="#fff"
            style={{ backgroundColor: "#fda209" }}
            onPress={() => {
              props.addQty(product.id, 1);
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View>
      <Portal>
        <Dialog
          visible={dialog}
          onDismiss={() => {
            setDialog(false);
          }}
        >
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Remove this from cart?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setDialog(false);
              }}
            >
              No
            </Button>
            <Button
              onPress={() => {
                setDialog(false);
                props.removeFromCart(itemToRemove);
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView style={{ padding: 20 }}>
        {props.cartItems && props.cartItems.map((product) => CartItem(product))}
      </ScrollView>
    </View>
  );
};

const mapStatetoProps = (state) => {
  return {
    cartItems: state,
  };
};

export default connect(mapStatetoProps, cartDispatch)(Cart);
