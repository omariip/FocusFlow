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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { firestore } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import OpenAI from "openai";

export default function AssignmentView({ route }) {
  const { assignment } = route.params;
  const [result, setResult] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checklistExists, setChecklistExists] = useState(false);

  const openai = new OpenAI({
    apiKey:
      "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",
  });

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
    try {
      setLoading(true);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Provide recommendations for completing the assignment titled "${assignment.assignmentName}".`,
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
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
    alignItems: "center",
    marginBottom: 10,
  },
  adviceText: {
    marginLeft: 10,
    fontSize: 16,
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
  },
});
