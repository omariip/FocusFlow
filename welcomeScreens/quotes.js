import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Quotes({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Render the PNG image */}
      <Image
        source={require("../assets/quotes.png")} // Update with your PNG path
        style={styles.image}
      />

      {/* Display the title and description */}
      <Text style={styles.title}>Stay Inspired!</Text>
      <Text style={styles.text}>
      Boost your motivation with generated quotes designed to inspire and keep you moving forward.
      </Text>

      {/* Next button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("StudyTimer")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  image: {
    width: 400, // Adjust width as needed
    height: 400, // Adjust height as needed
    marginBottom: 30,
    resizeMode: "contain", // Ensure the image scales properly
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25, // More rounded corners
    elevation: 5, // Add shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600", // Slightly bolder text
    letterSpacing: 1, // Add spacing between letters
  },
});