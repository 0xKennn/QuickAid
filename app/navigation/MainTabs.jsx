import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  House,
  Camera,
  HeartPulse,
  MessageCircle,
  User,
} from 'lucide-react-native';

import HomeScreen from '../screens/user/HomeScreen';
import CaptureScreen from '../screens/user/CaptureScreen';
import FirstAidScreen from '../screens/user/FirstAidScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarStyle: {
          position: 'absolute',
          height: 78,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,

          paddingTop: 10,
          paddingBottom: 10,

          marginHorizontal: 16,
          marginBottom: 14,

          borderRadius: 28,

          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 18,
          shadowOffset: {
            width: 0,
            height: 10,
          },

          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },

        tabBarActiveTintColor: '#5DBB9A',
        tabBarInactiveTintColor: '#A0A0A0',

        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? 24 : 22;

          switch (route.name) {
            case 'Home':
              return (
                <House
                  size={iconSize}
                  color={color}
                  strokeWidth={2.3}
                />
              );

            case 'Capture':
              return (
                <Camera
                  size={iconSize}
                  color={color}
                  strokeWidth={2.3}
                />
              );

            case 'First Aid':
              return (
                <HeartPulse
                  size={iconSize}
                  color={color}
                  strokeWidth={2.3}
                />
              );

            case 'Chat':
              return (
                <MessageCircle
                  size={iconSize}
                  color={color}
                  strokeWidth={2.3}
                />
              );

            case 'Profile':
              return (
                <User
                  size={iconSize}
                  color={color}
                  strokeWidth={2.3}
                />
              );

            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Capture"
        component={CaptureScreen}
      />

      <Tab.Screen
        name="First Aid"
        component={FirstAidScreen}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

