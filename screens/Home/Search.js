import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { connect } from "react-redux";
import { List, Title, Avatar, Divider, Searchbar } from "react-native-paper";
import WooCommerceApi from "../../components/WooCommerce";
const STATUS_BAR = StatusBar.statusBarHeight || 24;

const Search = (props) => {
  const [searchItem, setSearchItem] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const searchBarRef = useRef();
  const ResultItem = (item) => {
    let pic = item.images[0].src;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Product", item);
          }}
        >
          <List.Item
            title={item.name}
            right={() => (
              <Text style={{ fontWeight: "bold" }}>P {item.price}</Text>
            )}
            left={() => (
              <Avatar.Image
                size={40}
                source={{ uri: pic }}
                style={{ marginRight: 10 }}
              />
            )}
          />
        </TouchableOpacity>
        <Divider />
      </View>
    );
  };
  useEffect(() => {
    setTimeout(() => searchBarRef.current.focus(), 500);
  }, [searchBarRef]);
  useEffect(() => {
    if (searchItem.length > 0) {
      setLoading(true);
      new WooCommerceApi(props.userInfo.jwt_token)
        .get("products?search=" + searchItem)
        .then((resp) => {
          setLoading(false);
          setSearchResult(resp);
        });
    }
  }, [searchItem]);
  return (
    <View>
      <Searchbar
        style={{ width: "100%" }}
        placeholder="Search"
        ref={searchBarRef}
        onChangeText={(val) => setSearchItem(val)}
      />
      {searchResult && (
        <FlatList
          data={searchResult}
          renderItem={({ item }) => <ResultItem {...item} />}
          keyExtractor={(item) => item.id}
        />
      )}
      <View style={{ padding: 13 }}>
        {searchResult && searchResult.length === 0 && (
          <Text>No result for {searchItem}</Text>
        )}
        {loading && <Text>Searching...</Text>}
      </View>
    </View>
  );
};

const mapStateToProps = (states) => {
  return {
    products: states.products,
    userInfo: states.userInfo,
  };
};

export default connect(mapStateToProps)(Search);
