import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Study = () => {
  const WORK_TIME = 25 * 60 * 1000; // 25 minutes in milliseconds
  const SHORT_BREAK = 5 * 60 * 1000; // 5 minutes in milliseconds

  const [currentDuration, setCurrentDuration] = useState(WORK_TIME);
  const [remainingTime, setRemainingTime] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newRemainingTime = Math.max(currentDuration - elapsed, 0); // Prevent negative numbers
        setRemainingTime(newRemainingTime);

        if (newRemainingTime === 0) {
          clearInterval(timer);
          alert("Time is up!");
          handleSwitchSession();
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, startTime, currentDuration]);

  const handleStartPause = () => {
    if (!isRunning) {
      setStartTime(Date.now() - (currentDuration - remainingTime)); // Adjust start time to resume
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(currentDuration);
  };

  const handleSwitchSession = () => {
    setIsRunning(false);
    const nextDuration = currentDuration === WORK_TIME ? SHORT_BREAK : WORK_TIME;
    setCurrentDuration(nextDuration);
    setRemainingTime(nextDuration);
  };

  const customFormatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        The Pomodoro Technique helps you focus and manage time by alternating 25 minutes of work
        with 5-minute breaks.
      </Text>
      <Text style={styles.title}>
        {currentDuration === WORK_TIME ? "Work Session" : "Short Break"}
      </Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{customFormatTime(remainingTime)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isRunning ? "#E63946" : "#4CAF50" },
          ]}
          onPress={handleStartPause}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSwitchSession}>
          <Text style={styles.buttonText}>
            Switch to {currentDuration === WORK_TIME ? "Break" : "Work"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D3557",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: "#A8DADC",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F1FAEE",
    marginBottom: 20,
  },
  timerContainer: {
    marginBottom: 30,
    backgroundColor: "#457B9D",
    padding: 20,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    width: 220,
    height: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#F1FAEE",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#A8DADC",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D3557",
    textAlign: "center",
  },
});

export default Study;
