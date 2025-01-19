import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LetterToFuture = () => {
  const [letter, setLetter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isLetterLocked, setLetterLocked] = useState(false);
  const [canOpenLetter, setCanOpenLetter] = useState(false);

  useEffect(() => {
    loadLetter();
  }, []);

  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
    }
    setDatePickerVisible(false);
  };

  const saveLetter = async () => {
    if (!letter.trim()) {
      Alert.alert("Error", "Please write a letter before saving.");
      return;
    }
    if (!selectedDate || selectedDate <= new Date()) {
      Alert.alert("Error", "Please select a future date.");
      return;
    }

    try {
      const letterData = {
        text: letter,
        unlockDate: selectedDate.toISOString(),
      };
      await AsyncStorage.setItem("futureLetter", JSON.stringify(letterData));
      setLetter("");
      setLetterLocked(true);
      setCanOpenLetter(false);
      Alert.alert("Success", "Your letter has been saved and hidden!");
    } catch (error) {
      console.error("Error saving letter:", error);
      Alert.alert("Error", "Failed to save the letter. Please try again.");
    }
  };

  const loadLetter = async () => {
    try {
      const savedLetter = await AsyncStorage.getItem("futureLetter");
      if (savedLetter) {
        const letterData = JSON.parse(savedLetter);
        const unlockDate = new Date(letterData.unlockDate);
        const canOpen = unlockDate <= new Date();
        setCanOpenLetter(canOpen);
        setLetterLocked(true);
        setSelectedDate(unlockDate);

        if (canOpen) {
          setLetter(letterData.text);
        }
      }
    } catch (error) {
      console.error("Error loading letter:", error);
    }
  };

  const openLetter = () => {
    if (!canOpenLetter) {
      Alert.alert(
        "Locked",
        `Your letter will be available to open on ${selectedDate.toDateString()}`
      );
      return;
    }
    Alert.alert("Your Letter", letter);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write a Letter to Your Future Self</Text>
      {!isLetterLocked && (
        <TextInput
          style={styles.input}
          placeholder="Write your letter here..."
          multiline
          value={letter}
          onChangeText={setLetter}
        />
      )}

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setDatePickerVisible(true)}
        disabled={isLetterLocked}
      >
        <Text style={styles.buttonText}>
          {isLetterLocked
            ? `Unlock Date: ${selectedDate.toDateString()}`
            : "Set Unlock Date"}
        </Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {!isLetterLocked && (
        <TouchableOpacity style={styles.saveButton} onPress={saveLetter}>
          <Text style={styles.buttonText}>Save Letter</Text>
        </TouchableOpacity>
      )}
      {isLetterLocked && (
        <TouchableOpacity
          style={[
            styles.openButton,
            { backgroundColor: canOpenLetter ? "#4CAF50" : "#ccc" },
          ]}
          onPress={openLetter}
        >
          <Text style={styles.buttonText}>
            {canOpenLetter ? "Open Letter" : "Locked"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  openButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LetterToFuture;
