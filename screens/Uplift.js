import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

const moods = ['Anxiety', 'Fear', 'Confidence', 'Inspiration', 'Failure', 'Success', 'Happiness', 'Time', 'Future', 'Living'];

export default function UpliftScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [selfCareTips, setSelfCareTips] = useState('');

  const moodSuggestions = {
    Anxiety: "Take deep breaths and focus on grounding yourself. Try writing down your thoughts or meditating.",
    Fear: "Identify the cause of your fear. Take small steps to address it, and don't hesitate to seek support.",
    Confidence: "Keep a list of your achievements and remind yourself of your capabilities.",
    Inspiration: "Explore new ideas or take a walk to spark creativity. Let your surroundings inspire you.",
    Failure: "Remember, failure is a stepping stone to growth. Reflect and try again.",
    Success: "Celebrate your wins and express gratitude. Share your joy with loved ones.",
    Happiness: "Enjoy the moment and spread positivity. A gratitude journal can help maintain happiness.",
    Time: "Manage your time effectively by prioritizing tasks. Take breaks when needed.",
    Future: "Visualize your goals and take one step at a time toward them.",
    Living: "Engage in activities that bring you joy. Stay present and cherish the little things."
  };

  const fetchQuote = async () => {
    try {
      const response = await axios.get('https://zenquotes.io/api/random');
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
      console.error(error);
      Alert.alert('Error', 'Failed to fetch quote. Please check your network connection and try again.');
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchQuote();
    setSelfCareTips(moodSuggestions[mood]);
  };

  const handleSelfBetterment = () => {
    if (selectedMood) {
      Alert.alert("Self-Care Tips", selfCareTips || "Take care of yourself!");
    } else {
      Alert.alert("Select a Mood", "Please select a mood to receive suggestions.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>FocusFlow</Text>
        <FontAwesome
          name="user"
          size={24}
          color="black"
          style={styles.profileIcon}
        />
      </View>

      {/* Mood Selector */}
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
              style={styles.moodBox}
              onPress={() => handleMoodSelect(mood)}
            >
              <Text style={styles.moodText}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quote Display */}
      {selectedMood && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>{quote}</Text>
          <Text style={styles.author}>- {author}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.suggestionButton} onPress={handleSelfBetterment}>
        <Text style={styles.suggestionButtonText}>Need Suggestions for Self Betterment?</Text>
      </TouchableOpacity>
      {/* <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Study")}>
          <Text>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Uplift")}>
          <Text>Uplift</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    marginRight: 10,
  },
  questionContainer: {
    alignItems: "center",
    marginVertical: 20,
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
  moodText: {
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
    textAlign: 'center',
  },
  suggestionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  suggestionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
});