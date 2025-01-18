import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Assignment({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Text style={styles.text}>This is the assignment screen.</Text>
      <Button title="Next" onPress={() => navigation.navigate("Tasks")} />
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
