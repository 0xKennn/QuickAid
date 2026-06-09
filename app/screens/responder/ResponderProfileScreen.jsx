// app/screens/user/HomeScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function HomeScreen() {
  return <View style={s.c}><Text style={s.t}>Responder Profile</Text></View>;
}
const s = StyleSheet.create({ c:{flex:1,alignItems:'center',justifyContent:'center'},
  t:{fontSize:18,color:'#888'} });