import React, { useState, useEffect } from "react";
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
import TopBar from "../components/TopBar";

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "courses"));
        const fetchedCourses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(fetchedCourses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Delete a course
  const deleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(firestore, "courses", courseId));
      setCourses(courses.filter((course) => course.id !== courseId)); // Update UI
      Alert.alert("Success", "Course deleted successfully.");
    } catch (error) {
      console.error("Error deleting course:", error);
      Alert.alert("Error", "Failed to delete course. Please try again.");
    }
  };

  // Confirm delete action
  const confirmDelete = (courseId) => {
    Alert.alert(
      "Delete Course",
      "Are you sure you want to delete this course?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCourse(courseId),
        },
      ]
    );
  };

  // Render individual course item
  const renderCourse = ({ item }) => (
    <View style={styles.courseItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("CourseView", { course: item })}
      >
        <Text style={styles.courseName}>{item.courseName}</Text>
        <Text style={styles.courseDetails}>
          Professor: {item.courseProfessor}
        </Text>
        <Text style={styles.courseDetails}>Time: {item.courseTime}</Text>
        <Text style={styles.courseDetails}>
          Location: {item.courseLocation}
        </Text>
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
      <TopBar />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={renderCourse}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("AddCourse")}
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
  listContainer: {
    marginTop: 20,
  },
  courseItem: {
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
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  courseDetails: {
    fontSize: 14,
    color: "#555",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
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
  deleteButton: {
    backgroundColor: "#E63946",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
