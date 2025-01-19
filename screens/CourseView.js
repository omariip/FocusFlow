import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

export default function CourseView({ route, navigation }) {
  const { course } = route.params;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      setLoading(true); // Show loading spinner while fetching
      const querySnapshot = await getDocs(
        collection(firestore, `courses/${course.id}/assignments`)
      );
      const fetchedAssignments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignments(fetchedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Refresh assignments whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchAssignments();
    }, [course.id])
  );

  // Delete an assignment
  const deleteAssignment = async (assignmentId) => {
    try {
      await deleteDoc(
        doc(firestore, `courses/${course.id}/assignments`, assignmentId)
      );
      setAssignments(
        assignments.filter((assignment) => assignment.id !== assignmentId)
      ); // Update UI
      Alert.alert("Success", "Assignment deleted successfully.");
    } catch (error) {
      console.error("Error deleting assignment:", error);
      Alert.alert("Error", "Failed to delete assignment. Please try again.");
    }
  };

  // Confirm delete action
  const confirmDelete = (assignmentId) => {
    Alert.alert(
      "Delete Assignment",
      "Are you sure you want to delete this assignment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAssignment(assignmentId),
        },
      ]
    );
  };

  const renderAssignment = ({ item }) => (
    <View style={styles.assignmentItem}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("AssignmentView", { assignment: item })
        }
        style={{ flex: 1 }}
      >
        <Text style={styles.assignmentName}>{item.assignmentName}</Text>
        <Text style={styles.assignmentDetails}>Due Date: {item.dueDate}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id)}
      >
        <FontAwesome name="trash" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Assignments</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id}
          renderItem={renderAssignment}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Floating Add Assignment Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          navigation.navigate("AddAssignment", { courseId: course.id })
        }
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    marginTop: 10,
  },
  assignmentItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignmentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  assignmentDetails: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#E63946",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
