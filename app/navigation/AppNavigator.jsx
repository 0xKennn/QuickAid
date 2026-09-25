import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen             from '../screens/auth/LoginScreen';
import RegisterScreen          from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen    from '../screens/auth/ForgotPasswordScreen';
import MainTabs                from './MainTabs';
import EmergencyContactsScreen from '../screens/emergency/EmergencyContactsScreen';
import CaptureScreen           from '../screens/user/CaptureScreen';
import CaptureResultScreen     from '../screens/user/CaptureResultScreen';
import GuideDetailScreen       from '../screens/firstaid/GuideDetailScreen';

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
            <Stack.Screen name="Login"          component={LoginScreen} />
            <Stack.Screen name="Register"       component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainApp"           component={MainTabs} />
            <Stack.Screen name="Capture"           component={CaptureScreen} />
            <Stack.Screen name="CaptureResult"     component={CaptureResultScreen} />
            <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
            {/*
              Standalone GuideDetail — used specifically for viewing a
              recommended guide from CaptureResultScreen. Deliberately
              NOT nested inside the First Aid tab's stack, so opening a
              guide from a capture result never pollutes/persists into
              the tab's own browsing history. Back from here correctly
              returns to CaptureResult, not the tab bar.
            */}
            <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}