import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { firestore } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import OpenAI from "openai";

export default function AssignmentView({ route }) {
  const { assignment } = route.params;
  const [result, setResult] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checklistExists, setChecklistExists] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);

  // Fetch API key from Firestore
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "apiKey"));
        let key = null;

        querySnapshot.forEach((doc) => {
          if (doc.id === "apiKey") {
            key = doc.data().apiKey;
          }
        });

        if (key) {
          setApiKey(key);
        } else {
          throw new Error("API Key not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching API key from Firestore:", error);
        Alert.alert("Error", "Failed to fetch API key. Please try again.");
      } finally {
        setApiLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  // Fetch checklist from Firestore
  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const docRef = doc(
          firestore,
          `assignments/${assignment.id}/checklist`,
          "data"
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setResult(docSnap.data().checklist);
          setCheckedItems(
            new Array(docSnap.data().checklist.length).fill(false)
          );
          setChecklistExists(true);
        }
      } catch (error) {
        console.error("Error fetching checklist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [assignment.id]);

  const fetchData = async () => {
    if (!apiKey) {
      Alert.alert("Error", "API key not loaded. Please try again later.");
      return;
    }

    const openai = new OpenAI({ apiKey });

    try {
      setLoading(true);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Provide recommendations for completing the assignment titled "${textInput}".`,
          },
          {
            role: "user",
            content:
              "Generate a list of bullet points, in the following format [{advice: string}]",
          },
        ],
      });

      const rawResponse = completion.choices[0].message.content;
      const matches = [...rawResponse.matchAll(/advice:\s*\\?"([^"]+)/g)];

      const adviceArray = matches.map((match) => ({
        advice: match[1].trim(),
      }));

      setResult(adviceArray);
      setCheckedItems(new Array(adviceArray.length).fill(false));

      // Save to Firestore
      const docRef = doc(
        firestore,
        `assignments/${assignment.id}/checklist`,
        "data"
      );
      await setDoc(docRef, { checklist: adviceArray });

      setChecklistExists(true);
    } catch (error) {
      console.error("Error fetching or saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckBox = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  const renderAdvice = ({ item, index }) => (
    <View style={styles.adviceItem}>
      <CustomCheckBox
        isChecked={checkedItems[index]}
        onPress={() => toggleCheckBox(index)}
      />
      <Text style={styles.adviceText}>{item.advice}</Text>
    </View>
  );

  const CustomCheckBox = ({ isChecked, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.checkBox}>
      {isChecked && <FontAwesome name="check" size={16} color="white" />}
    </TouchableOpacity>
  );

  if (apiLoading || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.assignmentTitle}>{assignment.assignmentName}</Text>
      <Text style={styles.assignmentDetail}>
        Due Date: {assignment.dueDate}
      </Text>

      {!checklistExists && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Paste your assignment details here..."
            value={textInput}
            onChangeText={setTextInput}
            multiline
          />
          <Button title="Get Advice" onPress={fetchData} />
        </View>
      )}

      <FlatList
        data={result}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderAdvice}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  assignmentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  assignmentDetail: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  listContainer: {
    marginTop: 20,
  },
  adviceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    flexWrap: "wrap", // Ensure text wraps properly
  },
  adviceText: {
    flex: 1, // Allow text to expand
    fontSize: 16,
    flexWrap: "wrap",
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    marginRight: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
