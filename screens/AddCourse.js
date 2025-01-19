import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebaseConfig";

const AddCourse = ({ navigation }) => {
  const [courseName, setCourseName] = useState("");
  const [courseProfessor, setCourseProfessor] = useState("");
  const [courseTime, setCourseTime] = useState("");
  const [courseLocation, setCourseLocation] = useState("");

  const handleAddCourse = async () => {
    try {
      const docRef = await addDoc(collection(firestore, "courses"), {
        courseName,
        courseProfessor,
        courseTime,
        courseLocation,
        createdAt: new Date(),
      });
      console.log("Course added with ID:", docRef.id);

      setCourseName("");
      setCourseProfessor("");
      setCourseTime("");
      setCourseLocation("");

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course Name"
        value={courseName}
        onChangeText={setCourseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Professor"
        value={courseProfessor}
        onChangeText={setCourseProfessor}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Time"
        value={courseTime}
        onChangeText={setCourseTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Location"
        value={courseLocation}
        onChangeText={setCourseLocation}
      />

      <Button title="Add Course" onPress={handleAddCourse} />
    </View>
  );
};

export default AddCourse;

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
