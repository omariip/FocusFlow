import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Import icons from @expo/vector-icons
import HomeScreen from "../screens/HomeScreen";
import StudyScreen from "../screens/StudyScreen";
import UpliftScreen from "../screens/Uplift"; // Updated import

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Assign icons based on the route name
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Study") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Uplift") {
            iconName = focused ? "heart" : "heart-outline";
          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Study" component={StudyScreen} />
      <Tab.Screen name="Uplift" component={UpliftScreen} />
    </Tab.Navigator>
  );
}
