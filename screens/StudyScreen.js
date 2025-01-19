import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

export default function Study() {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    const totalSeconds =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    if (totalSeconds <= 0) {
      Alert.alert("Please set a valid time to start the timer.");
      return;
    }

    setTimeLeft(totalSeconds);
    setIsTimerStart(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsTimerStart(false);
    setIsPaused(true);
    clearInterval(timerRef.current);
  };

  const resumeTimer = () => {
    setIsTimerStart(true);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsTimerStart(false);
    setIsPaused(false);
    clearInterval(timerRef.current);
    setHours("00");
    setMinutes("00");
    setSeconds("00");
    setTimeLeft(0);
  };

  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isTimerStart) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerStart(false);
            Alert.alert("Timer Finished");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerStart]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.timeInputContainer}>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            value={hours}
            onChangeText={setHours}
            maxLength={2}
            editable={!isTimerStart && !isPaused}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  timerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeInput: {
    width: 50,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  timeSeparator: {
    fontSize: 20,
  },
  timer: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  timerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonText: {
    fontSize: 18,
    color: "blue",
  },
});
