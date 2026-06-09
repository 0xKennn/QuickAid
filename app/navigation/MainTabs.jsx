import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/user/HomeScreen';
import CaptureScreen from '../screens/user/CaptureScreen';
import FirstAidScreen from '../screens/user/FirstAidScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import AlertsScreen from '../screens/responder/AlertsScreen';
import PendingVerificationScreen from '../screens/responder/PendingVerificationScreen';

const Tab = createBottomTabNavigator();

const icons = {
  Home: '🏠',
  Capture: '📷',
  'First Aid': '🩹',
  Alerts: '🚨',
  Profile: '👤',
};

function AlertsRouter() {
  const { profile } = useAuth();
  return profile?.role === 'responder_verified'
    ? <AlertsScreen />
    : <PendingVerificationScreen />;
}

export default function MainTabs() {
  const { profile } = useAuth();
  const isResponder = profile?.role === 'responder_pending' ||
                      profile?.role === 'responder_verified';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => (
          <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>
        ),
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Capture" component={CaptureScreen} />
      <Tab.Screen name="First Aid" component={FirstAidScreen} />
      {isResponder && (
        <Tab.Screen name="Alerts" component={AlertsRouter} />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}