import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => Alert.alert("Password reset email sent!"))
      .catch((error) => Alert.alert(error.message));
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handlePasswordReset}
      >
        <Text style={styles.primaryButtonText}>Send Reset Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  appNameContainer: {
    alignItems: "center",
    marginBottom: 120,
  },
  icon: {
    width: 70,
    height: 70,
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
  },
  focusText: {
    color: "black", // Keep "Focus" color as black
  },
  flowText: {
    color: "#4CAF50", // Change "Flow" color to green
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});
