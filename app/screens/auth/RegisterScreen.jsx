import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Heart,
  ShieldCheck,
} from 'lucide-react-native';

import { registerUser } from '../../services/auth';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert(
        'Missing fields',
        'Please fill in all required fields.'
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password, {
        name,
        phone,
      });
    } catch (err) {
      Alert.alert('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4F6F5"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View style={s.hero}>
            <View style={s.logoBox}>
              <Heart size={32} color="#5DBB9A" />
            </View>

            <Text style={s.appName}>
              Create Account
            </Text>

            <Text style={s.appTagline}>
              Join QuickAid and access AI-powered
              emergency medical assistance.
            </Text>
          </View>

          {/* CARD */}
          <View style={s.card}>

            {/* STEP INDICATOR */}
            <View style={s.stepRow}>
              <View style={[s.stepDot, s.stepActive]} />
              <View style={s.stepDot} />
            </View>

            {/* FULL NAME */}
            <Text style={s.fieldLabel}>
              FULL NAME
            </Text>

            <View style={s.fieldWrap}>
              <User size={18} color="#94A3B8" />

              <TextInput
                style={s.fieldInput}
                value={name}
                onChangeText={setName}
                placeholder="Juan dela Cruz"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            {/* EMAIL */}
            <Text style={s.fieldLabel}>
              EMAIL ADDRESS
            </Text>

            <View style={s.fieldWrap}>
              <Mail size={18} color="#94A3B8" />

              <TextInput
                style={s.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PHONE */}
            <Text style={s.fieldLabel}>
              PHONE NUMBER
            </Text>

            <View style={s.fieldWrap}>
              <Phone size={18} color="#94A3B8" />

              <TextInput
                style={s.fieldInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="+63 912 345 6789"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
              />
            </View>

            {/* PASSWORD */}
            <Text style={s.fieldLabel}>
              PASSWORD
            </Text>

            <View style={s.fieldWrap}>
              <Lock size={18} color="#94A3B8" />

              <TextInput
                style={s.fieldInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPass}
              />

              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff size={18} color="#94A3B8" />
                ) : (
                  <Eye size={18} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>

            {/* NOTICE */}
            <View style={s.noticeBox}>
              <ShieldCheck
                size={18}
                color="#5DBB9A"
              />

              <Text style={s.noticeText}>
                QuickAid is designed for emergency
                response teams and healthcare professionals.
              </Text>
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={[
                s.btnPrimary,
                loading && { opacity: 0.7 },
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.btnPrimaryText}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={s.bottomRow}>
              <Text style={s.bottomText}>
                Already have an account?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Login')
                }
              >
                <Text style={s.bottomLink}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },

  hero: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },

  logoBox: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: '#EAF8F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: '#25302B',
    marginBottom: 8,
  },

  appTagline: {
    fontSize: 15,
    color: '#7C8B85',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 36,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 5,
  },

  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
  },

  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#D9E6E0',
    marginHorizontal: 4,
  },

  stepActive: {
    width: 28,
    backgroundColor: '#5DBB9A',
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6F7B76',
    marginBottom: 10,
    marginTop: 18,
    letterSpacing: 1,
  },

  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DFE7E3',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
  },

  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: '#25302B',
    marginLeft: 12,
  },

  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF8F4',
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
    marginBottom: 8,
  },

  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#5E746B',
    lineHeight: 20,
    marginLeft: 10,
  },

  btnPrimary: {
    height: 58,
    borderRadius: 999,
    backgroundColor: '#5DBB9A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,

    shadowColor: '#5DBB9A',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 4,
  },

  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },

  bottomText: {
    fontSize: 14,
    color: '#8B9590',
  },

  bottomLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5DBB9A',
    marginLeft: 4,
  },
});

