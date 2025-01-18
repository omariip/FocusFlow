import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Task({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.text}>This is the Task screen.</Text>
      <Button title="Next" onPress={() => navigation.navigate("Quotes")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, textAlign: "center", marginBottom: 20 },
});
