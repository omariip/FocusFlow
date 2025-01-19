import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import Welcome from "./welcomeScreens/welcome";
import Assignment from "./welcomeScreens/assignment";
import Task from "./welcomeScreens/tasksBreakDown";
import Quotes from "./welcomeScreens/quotes";
import StudyTimer from "./welcomeScreens/studyTimer";
import Quiz from "./welcomeScreens/quiz";
import Letter from "./welcomeScreens/letter";
import UpliftScreen from "./screens/Uplift";
// import StudyScreen from "./screens/Study";
import TabNavigator from "./navigation/TabNavigator";
import Study from "./screens/StudyScreen";
import AddCourse from "./screens/AddCourse";
import CourseView from "./screens/CourseView";
import AddAssignment from "./screens/AddAssignmentView";
import AssignmentView from "./screens/AssignmentView";

const Stack = createStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking app launch state:", error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          {isFirstLaunch ? (
            <>
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: true }} // Hide header for this screen
              />
              <Stack.Screen
                name="Assignment"
                component={Assignment}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Tasks"
                component={Task}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Quotes"
                component={Quotes}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="StudyTimer"
                component={StudyTimer}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Quiz"
                component={Quiz}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Letter"
                component={Letter}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="Uplift"
                component={UpliftScreen}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Study"
                component={Study}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Home"
                component={TabNavigator}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="AddCourse"
                component={AddCourse}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="CourseView"
                component={CourseView}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="AddAssignment"
                component={AddAssignment}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="AssignmentView"
                component={AssignmentView}
                options={{ headerShown: true }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="Uplift"
                component={UpliftScreen}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Study"
                component={Study}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Forgot Password"
                component={ForgotPasswordScreen}
                options={{ headerShown: true }} // Show header with back button
              />
              <Stack.Screen
                name="Home"
                component={TabNavigator}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="AddCourse"
                component={AddCourse}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="CourseView"
                component={CourseView}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="AddAssignment"
                component={AddAssignment}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="AssignmentView"
                component={AssignmentView}
                options={{ headerShown: true }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
