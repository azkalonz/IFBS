import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  Animated,
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
  ActivityIndicator,
  Button,
} from "react-native-paper";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { rootDispatch } from "../../actions";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODALS = ["FILTER", "ORDER", "CONFIRM", "MODAL_MESSAGE"];
const Orders = (props) => {
  const ITEMS_PER_PAGE = 10;
  const scrollY = new Animated.Value(0);
  const [currentItem, setCurrentItem] = useState();
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [modalMessage, setMOdalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalView, setModalView] = useState(MODALS[0]);
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
  const [routes] = React.useState([
    { key: "first", title: "All" },
    { key: "second", title: "Completed" },
    { key: "third", title: "Cancelled" },
  ]);
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
  const openModal = (modal) => {
    setModalView(modal);
    setModalVisible(true);
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
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          props.clearNotifications();
          props.navigation.navigate("Order Details", item);
        }}
        onLongPress={() => {
          setCurrentItem(item);
          openModal(MODALS[1]);
        }}
      >
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
                {month[date.getMonth()] + " " + date.getDate()}
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
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#222" }}
      labelStyle={{ color: "#222" }}
      style={{ backgroundColor: "#fff" }}
    />
  );
  const OrdersData = (filter = "") => (
    <View>
      <ScrollView>
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
          {loading && (
            <ActivityIndicator
              animating={loading}
              style={{ paddingVertical: 13 }}
            />
          )}
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
          {orders &&
            ordersCopy
              .filter((o) => (filter.length > 0 ? o.status === filter : true))
              .map((item) => orderItem(item))}
        </DataTable>
      </ScrollView>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(
          orders.filter((o) => (filter.length > 0 ? o.status === filter : true))
            .length / ITEMS_PER_PAGE
        )}
        onPageChange={(page) => {
          setPage(page);
        }}
        label={
          page +
          1 +
          " - " +
          (orders.length < ITEMS_PER_PAGE
            ? orders.filter((o) =>
                filter.length > 0 ? o.status === filter : true
              ).length
            : ITEMS_PER_PAGE) +
          " of " +
          Math.ceil(
            orders.filter((o) =>
              filter.length > 0 ? o.status === filter : true
            ).length / ITEMS_PER_PAGE
          )
        }
      />
    </View>
  );
  const Route2 = () => null;
  const renderScene = SceneMap({
    first: () => OrdersData(),
    second: () => OrdersData("completed"),
    third: () => OrdersData("cancelled"),
  });
  const handleCancelOrder = async () => {
    setMOdalMessage("Processing...");
    openModal(MODALS[4]);
    await new WooCommerceApi(props.userInfo.jwt_token)
      .post("orders/" + currentItem.id, {
        status: "cancelled",
      })
      .then((resp) => {
        onRefresh();
        setMOdalMessage("");
        setModalVisible(false);
      });
  };
  return (
    <Provider>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={style.modal}>
            <View style={style.modalContent}>
              {modalView === MODALS[0] ? (
                <View>
                  <Title>Filter</Title>
                  <Divider />
                  {filterOptions.map((filter, i) => (
                    <List.Item
                      key={i}
                      title={filter.name}
                      onPress={() => {
                        setOrderFilter({
                          column: "status",
                          value: filter.value,
                        });
                        setModalVisible(false);
                      }}
                    />
                  ))}
                </View>
              ) : null}
              {modalView === MODALS[1] ? (
                <View>
                  <Title>Options</Title>
                  <Divider />
                  <List.Item
                    title="Add Note to Vendor"
                    onPress={() =>
                      props.navigation.navigate("Chat", {
                        id: currentItem.id,
                      })
                    }
                  />
                  <Divider />
                  <List.Item
                    title="View details"
                    onPress={() =>
                      props.navigation.navigate("Order Details", currentItem)
                    }
                  />
                  <Divider />
                  {currentItem && currentItem.status === "pending" && (
                    <List.Item
                      title="Cancel order"
                      onPress={() => openModal(MODALS[3])}
                    />
                  )}
                </View>
              ) : null}
              {modalView === MODALS[3] ? (
                <View>
                  <Title>Cancel order?</Title>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      marginVertical: 7,
                    }}
                  >
                    <Button
                      style={{ flex: 1 }}
                      onPress={() => setModalVisible(false)}
                    >
                      No
                    </Button>
                    <Button
                      mode="contained"
                      style={{ flex: 1 }}
                      onPress={handleCancelOrder}
                    >
                      Yes
                    </Button>
                  </View>
                </View>
              ) : null}
              {modalView === MODALS[4] ? (
                <View>
                  <Title>{modalMessage}</Title>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </Portal>
      <ScrollView
        snapToOffsets={[90]}
        snapToEnd={false}
        snapToStart={true}
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: scrollY,
              },
            },
          },
        ])}
      >
        <Animated.View>
          <Animated.View
            style={{
              borderRadius: scrollY.interpolate({
                inputRange: [0, 60],
                outputRange: [20, 0],
                extrapolate: "clamp",
              }),
              overflow: "hidden",
            }}
          >
            <Searchbar
              style={{
                width: "100%",
              }}
              placeholder="Order ID / Status / Total"
              onChangeText={(e) => filteredOrders(e)}
            />
          </Animated.View>
          <Animated.View
            style={{
              transform: [
                {
                  scale: scrollY.interpolate({
                    inputRange: [0, 60],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [0, 60],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
            }}
          >
            <Button
              icon="filter"
              mode="contained"
              onPress={() => openModal(MODALS[0])}
              style={{ borderRadius: 20, marginTop: 10 }}
            >
              Filter
            </Button>
          </Animated.View>
        </Animated.View>
        <View style={{ minHeight: SCREEN_HEIGHT - 90 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: SCREEN_WIDTH }}
          />
        </View>
      </ScrollView>
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
export default connect(
  (states) => ({
    notifications: states.screens.notifications,
    userInfo: states.userInfo,
  }),
  rootDispatch
)(Orders);
