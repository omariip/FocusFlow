import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <Text style={styles.appName}>FocusFlow</Text>
      <FontAwesome
        name="user"
        size={24}
        color="black"
        style={styles.profileIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    marginRight: 10,
  },
});

export default TopBar;
