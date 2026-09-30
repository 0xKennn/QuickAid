import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  Mail,
  ArrowLeft,
  HeartPulse,
  CheckCircle,
} from 'lucide-react-native';

import { resetPassword } from '../../services/auth';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Email validation error
  const [emailError, setEmailError] = useState('');

  function validateEmail(value) {
    if (!value.trim()) {
      return 'Please enter your email address.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address.';
    }

    return '';
  }

  function handleEmailChange(text) {
    setEmail(text);

    // Remove error as soon as the user starts typing
    setEmailError('');
  }

  async function handleReset() {
    // Clear previous error
    setEmailError('');

    const error = validateEmail(email);

    if (error) {
      setEmailError(error);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      // Firebase error handling
      if (err.code === 'auth/invalid-email') {
        setEmailError('That email address looks invalid.');
      } else if (err.code === 'auth/user-not-found') {
        setEmailError('No account found with that email.');
      } else {
        setEmailError(
          err?.message || 'Could not send the reset email. Please try again.'
        );
      }
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

            <TouchableOpacity
              style={s.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={20} color="#25302B" />
            </TouchableOpacity>

            <View style={s.logoBox}>
              <HeartPulse size={34} color="#5DBB9A" />
            </View>

            <Text style={s.appName}>
              QuickAid
            </Text>

          </View>


          {/* CARD */}
          <View style={s.card}>

            {!sent ? (
              <>

                <Text style={s.formTitle}>
                  Reset Password
                </Text>

                <Text style={s.formSub}>
                  Enter the email address linked to your account and we'll
                  send you a link to reset your password.
                </Text>


                {/* EMAIL */}
                <Text style={s.fieldLabel}>
                  EMAIL ADDRESS
                </Text>

                <View
                  style={[
                    s.fieldWrap,
                    emailError && s.fieldError,
                  ]}
                >

                  <Mail
                    size={18}
                    color={
                      emailError
                        ? '#DC2626'
                        : '#94A3B8'
                    }
                  />

                  <TextInput
                    style={s.fieldInput}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="Enter your email"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                </View>

                {emailError ? (
                  <Text style={s.errorText}>
                    {emailError}
                  </Text>
                ) : null}


                {/* BUTTON */}
                <TouchableOpacity
                  style={[
                    s.btnPrimary,
                    loading && { opacity: 0.7 },
                  ]}
                  onPress={handleReset}
                  disabled={loading}
                >

                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={s.btnPrimaryText}>
                      Send Reset Link
                    </Text>
                  )}

                </TouchableOpacity>

              </>
            ) : (
              <>

                {/* SUCCESS */}
                <View style={s.successIcon}>
                  <CheckCircle
                    size={40}
                    color="#5DBB9A"
                  />
                </View>

                <Text style={s.formTitle}>
                  Check Your Email
                </Text>

                <Text style={s.formSub}>
                  We've sent a password reset link to{'\n'}

                  <Text
                    style={{
                      fontWeight: '700',
                      color: '#25302B',
                    }}
                  >
                    {email.trim()}
                  </Text>

                  . Follow the instructions there to set a new password.
                </Text>


                <TouchableOpacity
                  style={s.btnPrimary}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={s.btnPrimaryText}>
                    Back to Sign In
                  </Text>
                </TouchableOpacity>

              </>
            )}


            {/* BACK TO LOGIN */}
            {!sent && (
              <View style={s.bottomRow}>

                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                >
                  <Text style={s.bottomLink}>
                    Back to Sign In
                  </Text>
                </TouchableOpacity>

              </View>
            )}

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
    paddingTop: 50,
    paddingBottom: 35,
    paddingHorizontal: 24,
  },

  backBtn: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontSize: 30,
    fontWeight: '800',
    color: '#25302B',
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
    fontSize: 26,
    fontWeight: '800',
    color: '#25302B',
    marginBottom: 8,
    textAlign: 'center',
  },

  formSub: {
    fontSize: 14,
    color: '#8B9590',
    marginBottom: 30,
    lineHeight: 20,
    textAlign: 'center',
  },

  successIcon: {
    alignSelf: 'center',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EAF8F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6F7B76',
    marginBottom: 10,
    marginTop: 8,
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
    marginBottom: 8,
  },

  fieldError: {
    borderColor: '#DC2626',
    borderWidth: 1.5,
    backgroundColor: '#FEF2F2',
  },

  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: '#25302B',
    marginLeft: 12,
  },

  errorText: {
    marginTop: 2,
    marginLeft: 14,
    marginBottom: 20,
    fontSize: 12,
    color: '#DC2626',
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
    marginTop: 24,
  },

  bottomLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5DBB9A',
  },

});
