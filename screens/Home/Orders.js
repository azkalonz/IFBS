import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  StyleSheet,
  RefreshControl,
} from "react-native";
import WooCommerceApi from "../../components/WooCommerce";
import {
  DataTable,
  Chip,
  Searchbar,
  Modal,
  Portal,
  Divider,
  List,
  Title,
  Provider,
  Button,
} from "react-native-paper";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import ActivityLoader from "../../components/ActivityIndicator";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const Orders = (props) => {
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ordersCopy, setOrdersCopy] = useState([]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    new WooCommerceApi(props.userInfo.jwt_token)
      .get("orders?customer=" + props.userInfo.id)
      .then((resp) => {
        setOrders(resp);
        setOrdersCopy(resp);
        setRefreshing(false);
      });
  }, [refreshing]);
  const [orderFilter, setOrderFilter] = useState({
    column: "status",
    value: "all",
  });
  const filterOptions = [
    { name: "All", value: "all" },
    { name: "Processing", value: "processing" },
    { name: "Completed", value: "completed" },
    { name: "Pending", value: "pending" },
    { name: "On Hold", value: "on-hold" },
  ];
  useEffect(() => {
    setLoading(true);
    new WooCommerceApi(props.userInfo.jwt_token)
      .get("orders?customer=" + props.userInfo.id)
      .then((resp) => {
        setOrders(resp);
        setOrdersCopy(resp);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    filteredOrders();
  }, [orderFilter]);
  const STATUS_COLOR = {
    pending: {
      icon: "information",
      style: {
        color: "#222",
      },
    },
    processing: {
      icon: "information",
      style: {
        color: "#222",
      },
    },
    completed: {
      icon: "check",
      style: {
        backgroundColor: "#8bc34a",
        color: "#fff",
      },
    },
    cancelled: {
      icon: "alert",
      style: {
        backgroundColor: "#f44336",
        color: "#fff",
      },
    },
    refunded: {
      icon: "check",
      style: {
        backgroundColor: "#8bc34a",
        color: "#fff",
      },
    },
    failed: {
      icon: "check",
      style: {
        backgroundColor: "#8bc34a",
        color: "#fff",
      },
    },
    "on-hold": {
      icon: "alert",
      style: {
        backgroundColor: "#f44336",
        color: "#fff",
      },
    },
  };
  const orderItem = (item) => {
    let month = [
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
    let date = new Date(item.date_created);
    let isNotified = props.notifications.filter(
      (notif) => parseInt(notif.id) === parseInt(item.id)
    ).length;
    return (
      <TouchableOpacity key={item.id}>
        <DataTable.Row
          style={{
            width: SCREEN_WIDTH,
            height: 50,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ width: "10%", alignItems: "center" }}>
            <DataTable.Cell>
              <Text style={{ fontWeight: isNotified ? "bold" : "normal" }}>
                {item.id}
              </Text>
            </DataTable.Cell>
          </View>
          <View style={{ width: "35%", alignItems: "center" }}>
            <Chip {...STATUS_COLOR[item.status]}>
              <Text style={{ color: STATUS_COLOR[item.status].style.color }}>
                {item.status}
              </Text>
            </Chip>
          </View>
          <View style={{ width: "25%", alignItems: "center" }}>
            <DataTable.Cell style={{ justifyContent: "center" }}>
              <Text style={{ fontWeight: isNotified ? "bold" : "normal" }}>
                {month[date.getMonth() - 1] + " " + date.getDate()}
              </Text>
            </DataTable.Cell>
          </View>
          <View style={{ width: "40%", alignItems: "center" }}>
            <DataTable.Cell>
              <Text style={{ fontWeight: isNotified ? "bold" : "normal" }}>
                {item.total} ({item.line_items.length})
              </Text>
            </DataTable.Cell>
          </View>
        </DataTable.Row>
      </TouchableOpacity>
    );
  };
  const filteredOrders = (search = "") => {
    let pagedOrders = [...orders];
    pagedOrders = pagedOrders.splice(page, ITEMS_PER_PAGE);
    let searchFiltered = pagedOrders.filter(
      (order) =>
        JSON.stringify(order).toLowerCase().indexOf(search.toLowerCase()) >= 0
    );
    let filteredOrder =
      orderFilter.value === "all"
        ? searchFiltered
        : searchFiltered.filter(
            (order) => order[orderFilter.column] == orderFilter.value
          );
    setOrdersCopy(filteredOrder);
  };
  return (
    <Provider>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={style.modal}>
            <View style={style.modalContent}>
              <Title>Filter</Title>
              <Divider />
              {filterOptions.map((filter, i) => (
                <List.Item
                  key={i}
                  title={filter.name}
                  onPress={() => {
                    setOrderFilter({ column: "status", value: filter.value });
                    setModalVisible(false);
                  }}
                />
              ))}
            </View>
          </View>
        </Modal>
      </Portal>
      <ActivityLoader visible={loading} offset={60} />
      <View style={{ padding: 20 }}>
        <Searchbar
          style={{ width: "100%", borderRadius: 20 }}
          placeholder="Order ID / Status / Total"
          onChangeText={(e) => filteredOrders(e)}
        />
        <Button
          icon="filter"
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={{ borderRadius: 20, marginTop: 10 }}
        >
          Filter
        </Button>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <DataTable>
          <DataTable.Header style={{ width: SCREEN_WIDTH }}>
            <View style={{ width: "10%", alignItems: "center" }}>
              <DataTable.Title>No.</DataTable.Title>
            </View>
            <View style={{ width: "35%", alignItems: "center" }}>
              <DataTable.Title>Status</DataTable.Title>
            </View>
            <View style={{ width: "25%", alignItems: "center" }}>
              <DataTable.Title>Date</DataTable.Title>
            </View>
            <View style={{ width: "30%", alignItems: "center" }}>
              <DataTable.Title>Total</DataTable.Title>
            </View>
          </DataTable.Header>
          {orders.length === 0 && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 20,
                opacity: 0.3,
              }}
            >
              <Title>No orders to list</Title>
            </View>
          )}
          {orders && ordersCopy.map((item) => orderItem(item))}
        </DataTable>
      </ScrollView>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(orders.length / ITEMS_PER_PAGE)}
        onPageChange={(page) => {
          setPage(page);
        }}
        label={
          page +
          1 +
          " - " +
          (orders.length < ITEMS_PER_PAGE ? orders.length : ITEMS_PER_PAGE) +
          " of " +
          Math.ceil(orders.length / ITEMS_PER_PAGE)
        }
      />
    </Provider>
  );
};
const style = StyleSheet.create({
  modal: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    padding: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
  },
});
export default connect((states) => ({
  notifications: states.screens.notifications,
  userInfo: states.userInfo,
}))(Orders);
