import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FirstAidLibraryScreen from '../firstaid/FirstAidLibraryScreen';
import GuideDetailScreen from '../firstaid/GuideDetailScreen';

const Stack = createStackNavigator();

export default function FirstAidScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Library" component={FirstAidLibraryScreen} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
    </Stack.Navigator>
  );
}