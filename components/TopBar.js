import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Navigation hook

const TopBar = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Access navigation

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleFutureSelf = () => {
    setModalVisible(false);
    navigation.navigate("LetterToFuture"); // Navigate to the LetterToFuture screen
  };

  const handleSignOut = async () => {
    try {
      setModalVisible(false);
      // Add Firebase sign-out logic here
      console.log("Signing out...");
      navigation.replace("SignIn"); // Redirect to login screen
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <>
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
          onPress={toggleModal}
        />
      </View>

      {/* Modal for Profile Options */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleFutureSelf}
            >
              <Text style={styles.modalText}>Letter to Your Future Self</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <Text style={styles.modalText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.cancelButton]}
              onPress={toggleModal}
            >
              <Text style={[styles.modalText, styles.cancelText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    color: "black",
  },
  flowText: {
    color: "#4CAF50",
  },
  profileIcon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  signOutButton: {
    backgroundColor: "#f44336",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  modalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: "black",
  },
});

export default TopBar;
