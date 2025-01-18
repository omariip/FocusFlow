import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/SignInScreen";
import SearchScreen from "../screens/SearchScreen";
import TripsScreen from "../screens/TripsScreen";
import ReviewScreen from "../screens/ReviewScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Study" component={StudyScreen} />
      <Tab.Screen name="Quotes" component={QuotesScreen} />
    </Tab.Navigator>
  );
}