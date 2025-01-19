import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function AddAssignment({ route, navigation }) {
  const { courseId } = route.params; // Get the course ID
  const [assignmentName, setAssignmentName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddAssignment = async () => {
    try {
      await addDoc(collection(firestore, `courses/${courseId}/assignments`), {
        assignmentName,
        dueDate,
        createdAt: new Date(),
      });

      console.log("Assignment added successfully!");
      // Reset fields and navigate back
      setAssignmentName("");
      setDueDate("");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Assignment</Text>
      <TextInput
        style={styles.input}
        placeholder="Assignment Name"
        value={assignmentName}
        onChangeText={setAssignmentName}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (e.g., YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Save Assignment" onPress={handleAddAssignment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
