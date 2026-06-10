import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
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
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

          {/* Hero */}
          <View style={s.hero}>
            <View style={s.logoBox}>
              <Text style={s.logoIcon}>➕</Text>
            </View>
            <Text style={s.appName}>Create account</Text>
            <Text style={s.appTagline}>
              For DRRM officers &amp; medical professionals
            </Text>
          </View>

          {/* Form card */}
          <View style={s.card}>

            {/* Step indicator */}
            <View style={s.stepRow}>
              <View style={[s.stepDot, s.stepActive]} />
              <View style={s.stepDot} />
            </View>

            {/* Full name */}
            <Text style={s.fieldLabel}>Full name</Text>
            <View style={s.fieldWrap}>
              <Text style={s.fieldIcon}>👤</Text>
              <TextInput
                style={s.fieldInput}
                value={name}
                onChangeText={setName}
                placeholder="Juan dela Cruz"
                placeholderTextColor="#BBB"
              />
            </View>

            {/* Email */}
            <Text style={s.fieldLabel}>Email address</Text>
            <View style={s.fieldWrap}>
              <Text style={s.fieldIcon}>✉️</Text>
              <TextInput
                style={s.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="you@drrm.gov.ph"
                placeholderTextColor="#BBB"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone */}
            <Text style={s.fieldLabel}>Phone number</Text>
            <View style={s.fieldWrap}>
              <Text style={s.fieldIcon}>📱</Text>
              <TextInput
                style={s.fieldInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="+63 912 345 6789"
                placeholderTextColor="#BBB"
                keyboardType="phone-pad"
              />
            </View>

            {/* Password */}
            <Text style={s.fieldLabel}>Password</Text>
            <View style={s.fieldWrap}>
              <Text style={s.fieldIcon}>🔒</Text>
              <TextInput
                style={s.fieldInput}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor="#BBB"
                secureTextEntry={!showPass}
              />
              {/* <TouchableOpacity onPress={() => setShowPass(v => !v)} style={s.eyeBtn}>
                <Text style={s.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity> */}
            </View>

            {/* Disclaimer */}
            <View style={s.disclaimer}>
              <Text style={s.disclaimerText}>
                🏥 QuickAid is intended for DRRM officers and licensed medical professionals only.
              </Text>
            </View>

            {/* Create account button */}
            <TouchableOpacity
              style={[s.btnPrimary, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnPrimaryText}>Create Account</Text>
              }
            </TouchableOpacity>

            {/* Login link */}
            <View style={s.bottomRow}>
              <Text style={s.bottomText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={s.bottomLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#B91C1C' },
  hero:          { backgroundColor: '#B91C1C', alignItems: 'center',
                   paddingTop: 40, paddingBottom: 32, paddingHorizontal: 24 },
  logoBox:       { width: 60, height: 60, borderRadius: 15,
                   backgroundColor: 'rgba(255,255,255,0.18)',
                   alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoIcon:      { fontSize: 28 },
  appName:       { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 6 },
  appTagline:    { fontSize: 13, color: 'rgba(255,255,255,0.75)',
                   textAlign: 'center', lineHeight: 20 },
  card:          { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28,
                   borderTopRightRadius: 28, paddingHorizontal: 24,
                   paddingTop: 28, paddingBottom: 40 },
  stepRow:       { flexDirection: 'row', justifyContent: 'center',
                   gap: 6, marginBottom: 24 },
  stepDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FECACA' },
  stepActive:    { width: 20, borderRadius: 4, backgroundColor: '#B91C1C' },
  fieldLabel:    { fontSize: 11, fontWeight: '600', color: '#555',
                   textTransform: 'uppercase', letterSpacing: 0.6,
                   marginBottom: 8, marginTop: 16 },
  fieldWrap:     { flexDirection: 'row', alignItems: 'center', borderWidth: 1,
                   borderColor: '#E5E7EB', borderRadius: 12,
                   backgroundColor: '#F9FAFB', paddingHorizontal: 14, gap: 10 },
  fieldIcon:     { fontSize: 17 },
  fieldInput:    { flex: 1, fontSize: 14, color: '#111', paddingVertical: 13 },
  eyeBtn:        { padding: 4 },
  eyeIcon:       { fontSize: 17 },
  disclaimer:    { backgroundColor: '#FEE2E2', borderRadius: 10,
                   padding: 12, marginTop: 20, marginBottom: 4 },
  disclaimerText:{ fontSize: 12, color: '#B91C1C', lineHeight: 18 },
  btnPrimary:    { backgroundColor: '#B91C1C', borderRadius: 12,
                   paddingVertical: 16, alignItems: 'center',
                   marginTop: 20, marginBottom: 24 },
  btnPrimaryText:{ fontSize: 16, fontWeight: '700', color: '#fff' },
  bottomRow:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bottomText:    { fontSize: 14, color: '#888' },
  bottomLink:    { fontSize: 14, color: '#B91C1C', fontWeight: '600' },
});