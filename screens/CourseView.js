import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

export default function CourseView({ route, navigation }) {
  const { course } = route.params;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, `courses/${course.id}/assignments`)
        );
        const fetchedAssignments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignments(fetchedAssignments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [course.id]);

  const renderAssignment = ({ item }) => (
    <View style={styles.assignmentItem}>
      <Text style={styles.assignmentName}>{item.assignmentName}</Text>
      <Text style={styles.assignmentDetails}>Due Date: {item.dueDate}</Text>
      <Button
        title="Start"
        onPress={() =>
          navigation.navigate("AssignmentView", { assignment: item })
        }
      />
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
  },
  assignmentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  assignmentDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
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
