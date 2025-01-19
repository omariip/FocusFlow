import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const moods = ['Anxious', 'Excited', 'Nervous', 'Happy', 'Sad', 'Stressed', 'Courageous', 'Depressed', 'Confused'];

export default function Study({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Track pause state
  const [timeLeft, setTimeLeft] = useState(0);
  const [aiSuggestedTime, setAiSuggestedTime] = useState("AI suggests: 45 minutes of study time");
  const timerRef = useRef(null);

  const handleMoodSelect = (mood) => {
    if (!isTimerStart && !isPaused) { // Prevent selecting mood when timer is running or paused
      setSelectedMood(mood);
    }
  };

  const startTimer = () => {
    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    if (totalSeconds <= 0) {
      Alert.alert('Please set a valid time to start the timer.');
      return;
    }

    setTimeLeft(totalSeconds); // Set time left
    setIsTimerStart(true); // Start the timer
    setIsPaused(false); // Reset pause state
  };

  const resumeTimer = () => {
    setIsTimerStart(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsTimerStart(false);
    setIsPaused(true); // Set pause state
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    setIsTimerStart(false);
    setIsPaused(false); // Reset pause state
    clearInterval(timerRef.current);
    setHours('00');
    setMinutes('00');
    setSeconds('00');
    setTimeLeft(0); // Reset time to 0 on reset
  };

  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isTimerStart) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerStart(false);
            Alert.alert('Timer Finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current); // Cleanup interval when unmounting
  }, [isTimerStart]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appName}>FocusFlow</Text>
        <FontAwesome name="user" size={24} color="black" style={styles.profileIcon} />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>How are you feeling before going in the zone?</Text>
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={[styles.moodContainer, { justifyContent: 'center' }]} // Apply justifyContent here
>
  {moods.map((mood, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.moodBox, selectedMood === mood && styles.selectedMood]}
      onPress={() => handleMoodSelect(mood)}
      disabled={isTimerStart || isPaused}  // Disable mood selection when timer is running or paused
    >
      <Text style={styles.moodText}>{mood}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

        
        {/* Display selected mood */}
        {selectedMood && (
          <Text style={styles.selectedMoodText}>Selected Mood: {selectedMood}</Text>
        )}
      </View>

      <View style={styles.mainContent}>
        <View style={styles.timerContainer}>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
              maxLength={2}
              editable={!isTimerStart && !isPaused} // Allow editing time only when not running or paused
            />
            <Text style={styles.timeSeparator}>:</Text>
            <TextInput
              style={styles.timeInput}
              keyboardType="numeric"
              value={minutes}
              onChangeText={setMinutes}
              maxLength={2}
              editable={!isTimerStart && !isPaused}
            />
            <Text style={styles.timeSeparator}>:</Text>
            <TextInput
              style={styles.timeInput}
              keyboardType="numeric"
              value={seconds}
              onChangeText={setSeconds}
              maxLength={2}
              editable={!isTimerStart && !isPaused}
            />
          </View>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <View style={styles.timerButtons}>
            {!isTimerStart && !isPaused ? (
              <TouchableOpacity onPress={startTimer}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : isPaused ? (
              <TouchableOpacity onPress={resumeTimer}>
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pauseTimer}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={resetTimer}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Prompt at the bottom of the screen */}
        <View style={styles.aiPromptContainer}>
          <Text style={styles.aiPromptText}>{aiSuggestedTime}</Text>
        </View>
      </View>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Study")}>
          <Text>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Uplift")}>
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
    flexWrap: 'wrap', // Allows moods to wrap when space is tight
    justifyContent: 'center', // Centers the moods
  },
  moodBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  selectedMood: {
    backgroundColor: '#d3d3d3',
  },
  moodText: {
    fontSize: 16,
  },
  selectedMoodText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '500',
    color: 'green',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center', // Centers the timer and AI prompt vertically
  },
  timerContainer: {
    alignItems: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeInput: {
    width: 50,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  timeSeparator: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  timer: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  timerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
  aiPromptContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  aiPromptText: {
    fontSize: 16,
    color: '#333',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  navItem: {
    padding: 10,
  },
});
