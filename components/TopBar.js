import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const TopBar = () => {
  return (
    <View style={styles.topBar}>
      <View style={styles.appNameContainer}>
        <Image
          source={require("../assets/physical-wellbeing.png")}
          style={styles.icon}
        />
        <Text style={styles.appName}>
          <Text style={styles.focusText}>Focus</Text>
          <Text style={styles.flowText}>Flow</Text>
        </Text>
      </View>
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
    paddingHorizontal: 10,
  },
  appNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  focusText: {
    color: "black", // Keep the color as default or set it to a preferred value
  },
  flowText: {
    color: "#4CAF50", // Change Flow to green
  },
  profileIcon: {
    marginRight: 10,
  },
});

export default TopBar;
