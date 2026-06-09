// app/screens/user/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { logoutUser } from '../../services/auth';
export default function HomeScreen() {
  return <Button title="Logout" onPress={logoutUser} />;
}
const s = StyleSheet.create({ c:{flex:1,alignItems:'center',justifyContent:'center'},
  t:{fontSize:18,color:'#888'} });

