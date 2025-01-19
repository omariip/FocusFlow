import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import OpenAI from "openai";

export default function HomeScreen({ navigation }) {
  const [result, setResult] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  const openai = new OpenAI({
    apiKey:
      "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",
  });

  const fetchData = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content:
              "give me recommendations of successfully completing an assignment",
          },
          {
            role: "user",
            content:
              "Generate a list of bullet points, in the following format [{advice: string}]",
          },
        ],
      });

      console.log("Raw Response:", completion.choices[0].message.content);

      // Parse the response manually
      const rawResponse = completion.choices[0].message.content;
      const matches = [...rawResponse.matchAll(/advice:\s*\\?"([^"]+)/g)];

      const adviceArray = matches.map((match) => ({
        advice: match[1].trim(),
      }));

      setResult(adviceArray);
      setCheckedItems(new Array(adviceArray.length).fill(false));
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult([{ advice: "Failed to fetch data." }]);
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

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Paste your assignment here..."
          value={textInput}
          onChangeText={setTextInput}
          multiline
        />
        <Button title="Get Advice" onPress={fetchData} />
      </View>

      <FlatList
        data={result}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderAdvice}
        contentContainerStyle={styles.listContainer}
      />

      {/* <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Study")}>
          <Text>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Uplift")}>
          <Text>Uplift</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "blue",
    borderRadius: 50,
    padding: 10,
  },
});
