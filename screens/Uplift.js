import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const moods = ['Happy', 'Stressed', 'Excited', 'Nervous', 'Depressed', 'Calm', 'Anxious', 'Content'];

export default function UpliftScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  const fetchQuote = async (mood) => {
    try {
      const response = await axios.get(`https://zenquotes.io/api/random`);
      const quoteData = response.data[0];
      setQuote(quoteData.q);
      setAuthor(quoteData.a);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchQuote(mood);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>FocusFlow</Text>
        <FontAwesome name="user" size={24} color="black" style={styles.profileIcon} />
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>How are you feeling today?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <TouchableOpacity key={index} style={styles.moodBox} onPress={() => handleMoodSelect(mood)}>
              <Text style={styles.moodText}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {selectedMood && (
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>{quote}</Text>
          <Text style={styles.author}>- {author}</Text>
        </View>
      )}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text>Uplift</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    marginRight: 10,
  },
  questionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
  },
  moodBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
  },
  moodText: {
    fontSize: 16,
  },
  quoteContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  quote: {
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
});