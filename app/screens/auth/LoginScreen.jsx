import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { loginUser } from '../../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(email, password);
      // AuthContext picks up the state change — navigation handled by AppNavigator
    } catch (err) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Welcome back</Text>
      <Text style={s.subtitle}>Log in to QuickAid</Text>

      <Text style={s.label}>Email</Text>
      <TextInput style={s.input} value={email} onChangeText={setEmail}
        placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />

      <Text style={s.label}>Password</Text>
      <TextInput style={s.input} value={password} onChangeText={setPassword}
        placeholder="Your password" secureTextEntry />

      <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.btnText}>Log in</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={s.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '600', color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#111', backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#1D9E75', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 16, color: '#1D9E75', fontSize: 14 },
});