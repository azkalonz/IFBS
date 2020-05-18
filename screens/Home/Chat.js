import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, KeyboardAvoidingView } from "react-native";
import { connect } from "react-redux";
import { rootDispatch } from "../../actions";
import WooCommerceApi from "../../components/WooCommerce";
import { GiftedChat } from "react-native-gifted-chat";
import { ScrollView } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [orderId, setOrderId] = useState();
  useEffect(() => {
    let orderId = props.navigation.state.params.id;
    if (orderId === undefined) {
      props.navigation.goBack();
      return;
    }
    setOrderId(orderId);
    new WooCommerceApi(props.userInfo.jwt_token)
      .get("orders/" + orderId + "/notes")
      .then((resp) => {
        props.addConvo({
          order_id: orderId,
          messages: resp
            .filter((r) => r.note.indexOf("Order status") !== 0)
            .map((r, i) => {
              let isMe =
                r.author === "WooCommerce" ||
                r.author ===
                  props.userInfo.first_name + " " + props.userInfo.last_name;
              return {
                id: isMe && i !== resp.length - 1 ? props.userInfo.id : 1,
                author: isMe ? "Me" : "store",
                message: r.note,
                createdAt: r.date_created,
              };
            }),
        });
      });
  }, []);
  useEffect(() => {
    getMessages();
  }, [props.chat, orderId]);
  const getMessages = () => {
    if (orderId) {
      if (props.chat[orderId])
        setMessages(
          props.chat[orderId].messages.map((m, i) => ({
            _id: i,
            text: m.message,
            createdAt: m.createdAt,
            user: {
              _id: m.id,
              name: m.author,
              avatar: "https://placeimg.com/140/140/any",
            },
          }))
        );
    }
  };
  const onSend = (m = []) => {
    setMessages(GiftedChat.append(messages, m));
    new WooCommerceApi(props.userInfo.jwt_token).post(
      "orders/" + orderId + "/notes",
      {
        note: m[0].text,
      }
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(message) => onSend(message)}
      user={{
        _id: props.userInfo.id,
      }}
    />
  );
};

export default connect(
  (states) => ({
    chat: states.chat,
    userInfo: states.userInfo,
  }),
  rootDispatch
)(Chat);
