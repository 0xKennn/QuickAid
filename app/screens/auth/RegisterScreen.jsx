import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone]       = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await registerUser(email, password, { name, phone });
    } catch (err) {
      Alert.alert('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.title}>Create account</Text>
      <Text style={s.subtitle}>Join QuickAid — for DRRM officers and medical professionals</Text>

      <Text style={s.label}>Full name</Text>
      <TextInput
        style={s.input}
        value={name}
        onChangeText={setName}
        placeholder="Juan dela Cruz"
      />

      <Text style={s.label}>Email</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={s.label}>Phone number</Text>
      <TextInput
        style={s.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="+63 912 345 6789"
        keyboardType="phone-pad"
      />

      <Text style={s.label}>Password</Text>
      <View style={s.passWrap}>
        <TextInput
          style={s.passInput}
          value={password}
          onChangeText={setPassword}
          placeholder="At least 6 characters"
          secureTextEntry={!showPass}
        />
        <TouchableOpacity
          style={s.eyeBtn}
          onPress={() => setShowPass(v => !v)}
        >
          <Text style={s.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={s.btn}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.btnText}>Create account</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={s.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { padding: 24, paddingTop: 60, backgroundColor: '#fff', flexGrow: 1 },
  title:      { fontSize: 26, fontWeight: '600', color: '#111', marginBottom: 4 },
  subtitle:   { fontSize: 13, color: '#666', marginBottom: 28, lineHeight: 20 },
  label:      { fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 12 },
  input:      { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#111', backgroundColor: '#fafafa' },
  passWrap:   { flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fafafa' },
  passInput:  { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111' },
  eyeBtn:     { paddingHorizontal: 12 },
  eyeText:    { fontSize: 18 },
  btn:        { backgroundColor: '#B91C1C', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 24 },
  btnText:    { color: '#fff', fontSize: 15, fontWeight: '600' },
  link:       { textAlign: 'center', marginTop: 16, color: '#B91C1C', fontSize: 14 },
});