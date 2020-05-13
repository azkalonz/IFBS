import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import {
  ScrollView,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { connect } from "react-redux";
import { List, Title, Avatar, Divider, Searchbar } from "react-native-paper";

const STATUS_BAR = StatusBar.statusBarHeight || 24;

const Search = (props) => {
  const [searchItem, setSearchItem] = useState("");
  const searchBarRef = useRef();
  const ResultItem = (item) => {
    let pic = item.images[0].src;
    return (
      <View>
        <TouchableNativeFeedback
        // onPress={() => {
        //   props.navigation.navigate("Product", {
        //     slug: item.slug,
        //   });
        // }}
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
        </TouchableNativeFeedback>
        <Divider />
      </View>
    );
  };
  useEffect(() => {
    setTimeout(() => searchBarRef.current.focus(), 500);
  }, [searchBarRef]);
  return (
    <View>
      <Searchbar
        style={{ width: "100%" }}
        placeholder="Search"
        ref={searchBarRef}
        onChangeText={(val) => setSearchItem(val)}
      />
      <FlatList
        data={props.products.filter(
          (product) => JSON.stringify(product).indexOf(searchItem) >= 0
        )}
        renderItem={({ item }) => <ResultItem {...item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const mapStateToProps = (states) => {
  return {
    products: states.products,
  };
};

export default connect(mapStateToProps)(Search);
