import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PendingVerificationScreen() {
  return (
    <View style={s.container}>
      <Text style={s.icon}>⏳</Text>
      <Text style={s.title}>Verification pending</Text>
      <Text style={s.body}>
        Your responder account is being reviewed. You'll get full access to
        emergency alerts once an admin verifies your account.
      </Text>
      <Text style={s.note}>
        This is usually done within 24 hours. If you registered recently,
        please check back later.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 32, backgroundColor: '#fff' },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '600', color: '#111',
    marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: '#555', textAlign: 'center',
    lineHeight: 22, marginBottom: 16 },
  note: { fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 20 },
});