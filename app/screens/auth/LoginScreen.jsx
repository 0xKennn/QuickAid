import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { loginUser } from '../../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
      Alert.alert('Login failed', err.message);
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
            <Text style={s.appName}>QuickAid</Text>
            <Text style={s.appTagline}>
              AI-Powered Injury Detection &amp; Medical Guidance
            </Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.formTitle}>Welcome back</Text>
            <Text style={s.formSub}>Sign in to your account</Text>

            {/* Email */}
            <Text style={s.fieldLabel}>Email address</Text>
            <View style={s.fieldWrap}>
              <Text style={s.fieldIcon}>✉️</Text>
              <TextInput
                style={s.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#BBB"
                keyboardType="email-address"
                autoCapitalize="none"
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
                placeholder="Enter your password"
                placeholderTextColor="#BBB"
                secureTextEntry={!showPass}
              />
              {/* <TouchableOpacity onPress={() => setShowPass(v => !v)} style={s.eyeBtn}>
                <Text style={s.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity> */}
            </View>

            {/* Forgot */}
            <TouchableOpacity style={s.forgotWrap}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign in button */}
            <TouchableOpacity
              style={[s.btnPrimary, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.btnPrimaryText}>Sign In</Text>
              }
            </TouchableOpacity>

            {/* Register link */}
            <View style={s.bottomRow}>
              <Text style={s.bottomText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={s.bottomLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#B91C1C' },
  hero:         { backgroundColor: '#B91C1C', alignItems: 'center',
                  paddingTop: 48, paddingBottom: 36, paddingHorizontal: 24 },
  logoBox:      { width: 72, height: 72, borderRadius: 18,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoIcon:     { fontSize: 36 },
  appName:      { fontSize: 30, fontWeight: '700', color: '#fff', marginBottom: 6 },
  appTagline:   { fontSize: 13, color: 'rgba(255,255,255,0.75)',
                  textAlign: 'center', lineHeight: 20 },
  card:         { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 28,
                  borderTopRightRadius: 28, paddingHorizontal: 24,
                  paddingTop: 32, paddingBottom: 40 },
  formTitle:    { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
  formSub:      { fontSize: 14, color: '#888', marginBottom: 28 },
  fieldLabel:   { fontSize: 11, fontWeight: '600', color: '#555',
                  textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, marginTop: 16 },
  fieldWrap:    { flexDirection: 'row', alignItems: 'center', borderWidth: 1,
                  borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#F9FAFB',
                  paddingHorizontal: 14, gap: 10 },
  fieldIcon:    { fontSize: 17 },
  fieldInput:   { flex: 1, fontSize: 14, color: '#111', paddingVertical: 14 },
  eyeBtn:       { padding: 4 },
  eyeIcon:      { fontSize: 17 },
  forgotWrap:   { alignItems: 'flex-end', marginTop: 10, marginBottom: 24 },
  forgotText:   { fontSize: 13, color: '#B91C1C', fontWeight: '500' },
  btnPrimary:   { backgroundColor: '#B91C1C', borderRadius: 12, paddingVertical: 16,
                  alignItems: 'center', marginBottom: 24 },
  btnPrimaryText:{ fontSize: 16, fontWeight: '700', color: '#fff' },
  bottomRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bottomText:   { fontSize: 14, color: '#888' },
  bottomLink:   { fontSize: 14, color: '#B91C1C', fontWeight: '600' },
});