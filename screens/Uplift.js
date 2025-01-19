import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import OpenAI from "openai";
import axios from "axios";
import TopBar from "../components/TopBar";

const moods = [
  "Anxiety",
  "Fear",
  "Confidence",
  "Inspiration",
  "Failure",
  "Success",
  "Happiness",
  "Time",
  "Future",
  "Living",
];

export default function UpliftScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const openai = new OpenAI({
    apiKey:
      "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",
  });

  // Fetch advice based on the selected mood
  const fetchAdvice = async (mood) => {
    try {
      setLoading(true);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Provide recommendations for feeling "${mood}". Generate a list of bullet points in plain text.`,
          },
        ],
      });

      const rawResponse = completion.choices[0].message.content;

      // Split the response into lines and filter out empty or non-advice lines
      const adviceArray = rawResponse
        .split("\n")
        .map((line) => line.replace(/^\s*-\s*/, "").trim()) // Remove leading bullet points
        .filter((line) => line.length > 0); // Filter out empty lines

      setAdvice(adviceArray);
      setCheckedItems(new Array(adviceArray.length).fill(false)); // Reset checkboxes
    } catch (error) {
      console.error("Error fetching advice:", error);
      Alert.alert("Error", "Failed to fetch advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchAdvice(mood);
  };

  // Toggle checkbox state
  const toggleCheckBox = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  // Fetch a random quote
  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://zenquotes.io/api/random");
      const quotes = response.data;
      if (quotes.length > 0) {
        const randomQuote = quotes[0];
        setQuote(randomQuote.q);
        setAuthor(randomQuote.a);
      } else {
        setQuote("No quotes found.");
        setAuthor("");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      Alert.alert("Error", "Failed to fetch quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView>
        <View style={styles.questionContainer}>
          <Text style={styles.question}>How are you feeling today?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moodContainer}
          >
            {moods.map((mood, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodBox,
                  selectedMood === mood && styles.selectedMood,
                ]}
                onPress={() => handleMoodSelect(mood)}
                disabled={loading}
              >
                <Text style={styles.moodText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Display Selected Mood Advice */}
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : advice.length > 0 ? (
          <View style={styles.adviceContainer}>
            <Text style={styles.adviceTitle}>
              Suggestions for "{selectedMood}":
            </Text>
            {advice.map((item, index) => (
              <View key={index} style={styles.adviceItem}>
                <TouchableOpacity
                  style={styles.checkBox}
                  onPress={() => toggleCheckBox(index)}
                >
                  {checkedItems[index] && (
                    <FontAwesome name="check" size={16} color="white" />
                  )}
                </TouchableOpacity>
                <Text style={styles.adviceText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : (
          selectedMood && (
            <Text style={styles.placeholderText}>
              No advice yet. Select a mood to get suggestions.
            </Text>
          )
        )}

        {/* Quote Generation Button */}
        <TouchableOpacity
          style={styles.quoteButton}
          onPress={fetchQuote}
          disabled={loading}
        >
          <Text style={styles.quoteButtonText}>A Quote Just For You...</Text>
        </TouchableOpacity>

        {/* Display Generated Quote */}
        {quote && (
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>"{quote}"</Text>
            <Text style={styles.author}>- {author}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  questionContainer: {
    alignItems: "center",
    marginVertical: 20,
    marginTop: 40,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: "row",
  },
  moodBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  selectedMood: {
    backgroundColor: "#dcdcdc",
  },
  moodText: {
    fontSize: 16,
  },
  adviceContainer: {
    marginTop: 20,
    paddingHorizontal: 10, // Add padding to prevent text from touching edges
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  adviceItem: {
    flexDirection: "row",
    alignItems: "flex-start", // Align text to the top
    marginVertical: 5,
    paddingRight: 10, // Avoid text getting cut off by the edge
  },
  adviceText: {
    flex: 1, // Allow text to occupy available space
    flexWrap: "wrap", // Ensure long text wraps
    fontSize: 16,
    marginRight: 10, // Prevent text from touching the right edge
  },
  placeholderText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
    marginTop: 20,
    textAlign: "center", // Center align placeholder text
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },

  quoteButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  quoteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  quoteContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  quote: {
    fontSize: 24,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    textAlign: "center",
  },
});
