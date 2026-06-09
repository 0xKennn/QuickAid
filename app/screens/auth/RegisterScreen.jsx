import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    if (role === 'responder' && (!organization || !phone)) {
      Alert.alert('Missing fields', 'Responders must provide organization and phone number.');
      return;
    }

    setLoading(true);
    try {
      const profileData = { name };
      if (role === 'responder') {
        profileData.organization = organization;
        profileData.phone = phone;
        profileData.serviceArea = null;
        profileData.available = true;
      }
      await registerUser(email, password, role, profileData);
    } catch (err) {
      Alert.alert('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Create account</Text>
      <Text style={s.subtitle}>Who are you registering as?</Text>

      <View style={s.roleRow}>
        <TouchableOpacity
          style={[s.roleBtn, role === 'user' && s.roleActive]}
          onPress={() => setRole('user')}
        >
          <Text style={[s.roleBtnText, role === 'user' && s.roleActiveText]}>Normal user</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.roleBtn, role === 'responder' && s.roleActive]}
          onPress={() => setRole('responder')}
        >
          <Text style={[s.roleBtnText, role === 'responder' && s.roleActiveText]}>Responder</Text>
        </TouchableOpacity>
      </View>

      {role === 'responder' && (
        <View style={s.infoBanner}>
          <Text style={s.infoText}>Responders receive emergency alerts and assist users in need.</Text>
        </View>
      )}

      <Text style={s.label}>Full name</Text>
      <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Juan dela Cruz" />

      <Text style={s.label}>Email</Text>
      <TextInput style={s.input} value={email} onChangeText={setEmail}
        placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" />

      <Text style={s.label}>Password</Text>
      <TextInput style={s.input} value={password} onChangeText={setPassword}
        placeholder="At least 6 characters" secureTextEntry />

      {role === 'responder' && (
        <>
          <Text style={s.label}>Organization</Text>
          <TextInput style={s.input} value={organization} onChangeText={setOrganization}
            placeholder="e.g. BFP Station 3, Brgy. Health Center" />

          <Text style={s.label}>Contact number</Text>
          <TextInput style={s.input} value={phone} onChangeText={setPhone}
            placeholder="+63 912 345 6789" keyboardType="phone-pad" />
        </>
      )}

      <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
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
  container: { padding: 24, paddingTop: 60, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 26, fontWeight: '600', color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  roleBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1,
    borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fafafa' },
  roleActive: { backgroundColor: '#E8F5F0', borderColor: '#1D9E75' },
  roleBtnText: { fontSize: 14, color: '#888', fontWeight: '500' },
  roleActiveText: { color: '#0F6E56' },
  infoBanner: { backgroundColor: '#E8F5F0', borderRadius: 8, padding: 10, marginBottom: 14 },
  infoText: { fontSize: 13, color: '#0F6E56', lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#111', backgroundColor: '#fafafa' },
  btn: { backgroundColor: '#1D9E75', borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 16, color: '#1D9E75', fontSize: 14 },
});