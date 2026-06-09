import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen      from '../screens/user/HomeScreen';
import CaptureScreen   from '../screens/user/CaptureScreen';
import FirstAidScreen  from '../screens/user/FirstAidScreen';
import ChatScreen      from '../screens/chat/ChatScreen';
import ProfileScreen   from '../screens/user/ProfileScreen';

const Tab = createBottomTabNavigator();

const icons = {
  Home:       '🏠',
  Capture:    '📷',
  'First Aid':'🩹',
  Chat:       '💬',
  Profile:    '👤',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => (
          <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>
        ),
        tabBarActiveTintColor:   '#B91C1C',
        tabBarInactiveTintColor: '#999',
        tabBarStyle:             { paddingBottom: 4 },
        headerShown:             false,
      })}
    >
      <Tab.Screen name="Home"       component={HomeScreen} />
      <Tab.Screen name="Capture"    component={CaptureScreen} />
      <Tab.Screen name="First Aid"  component={FirstAidScreen} />
      <Tab.Screen name="Chat"       component={ChatScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen} />
    </Tab.Navigator>
  );
}