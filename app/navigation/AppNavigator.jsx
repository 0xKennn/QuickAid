import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen            from '../screens/auth/LoginScreen';
import RegisterScreen         from '../screens/auth/RegisterScreen';
import MainTabs               from './MainTabs';
import EmergencyContactsScreen from '../screens/emergency/EmergencyContactsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#B91C1C" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login"    component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainApp"           component={MainTabs} />
            <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}