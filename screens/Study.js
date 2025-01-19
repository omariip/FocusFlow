import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import OpenAI from "openai";

const moods = [
  "Anxious",
  "Excited",
  "Nervous",
  "Happy",
  "Sad",
  "Stressed",
  "Courageous",
  "Depressed",
  "Confused",
];

export default function Study() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [result, setResult] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const openai = new OpenAI({
    apiKey:
      "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",
  });

  const fetchData = async () => {
    if (!selectedMood) {
      Alert.alert("Please select a mood first.");
      return;
    }

    try {
      setLoading(true);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Provide recommendations for feeling "${selectedMood}".`,
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
    } catch (error) {
      console.error("Error fetching data:", error);
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
      <TouchableOpacity
        onPress={() => toggleCheckBox(index)}
        style={styles.checkBox}
      >
        {checkedItems[index] && (
          <FontAwesome name="check" size={16} color="white" />
        )}
      </TouchableOpacity>
      <Text style={styles.adviceText}>{item.advice}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodContainer}
      >
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodBox,
              selectedMood === mood && styles.selectedMood,
            ]}
            onPress={() => setSelectedMood(mood)}
            disabled={loading}
          >
            <Text style={styles.moodText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedMood && (
        <Text style={styles.selectedMoodText}>
          Selected Mood: {selectedMood}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : result.length > 0 ? (
        <FlatList
          data={result}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAdvice}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <TouchableOpacity style={styles.fetchButton} onPress={fetchData}>
          <Text style={styles.fetchButtonText}>Get Recommendations</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  moodBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedMood: {
    backgroundColor: "#dcdcdc",
    borderColor: "#c0c0c0",
  },
  moodText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedMoodText: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
    marginVertical: 10,
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
  fetchButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  fetchButtonText: {
    color: "white",
    fontSize: 16,
  },
});
