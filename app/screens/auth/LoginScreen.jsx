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
  Mail,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
} from 'lucide-react-native';

import { loginUser } from '../../services/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
              <HeartPulse size={34} color="#5DBB9A" />
            </View>

            <Text style={s.appName}>QuickAid</Text>

            <Text style={s.appTagline}>
              AI-powered injury detection & medical guidance
            </Text>
          </View>

          {/* CARD */}
          <View style={s.card}>
            <Text style={s.formTitle}>Welcome Back</Text>

            <Text style={s.formSub}>
              Sign in to continue your healthcare journey.
            </Text>

            {/* EMAIL */}
            <Text style={s.fieldLabel}>EMAIL ADDRESS</Text>

            <View style={s.fieldWrap}>
              <Mail size={18} color="#94A3B8" />

              <TextInput
                style={s.fieldInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* PASSWORD */}
            <Text style={s.fieldLabel}>PASSWORD</Text>

            <View style={s.fieldWrap}>
              <Lock size={18} color="#94A3B8" />

              <TextInput
                style={s.fieldInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
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

            {/* FORGOT */}
            <TouchableOpacity style={s.forgotWrap}>
              <Text style={s.forgotText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* BUTTON */}
            <TouchableOpacity
              style={[
                s.btnPrimary,
                loading && { opacity: 0.7 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.btnPrimaryText}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={s.bottomRow}>
              <Text style={s.bottomText}>
                Don’t have an account?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={s.bottomLink}>
                  Sign Up
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
    paddingTop: 70,
    paddingBottom: 35,
    paddingHorizontal: 24,
  },

  logoBox: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: '#EAF8F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  appName: {
    fontSize: 36,
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

  formTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#25302B',
    marginBottom: 8,
  },

  formSub: {
    fontSize: 14,
    color: '#8B9590',
    marginBottom: 30,
    lineHeight: 20,
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
    marginLeft: 12
  },

  fieldInput: {
  flex: 1,
  fontSize: 15,
  color: '#25302B',
  marginLeft: 12,
},

  forgotWrap: {
    alignItems: 'flex-end',
    marginTop: 14,
    marginBottom: 28,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5DBB9A',
  },

  btnPrimary: {
    height: 58,
    borderRadius: 999,
    backgroundColor: '#5DBB9A',
    alignItems: 'center',
    justifyContent: 'center',

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

