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


// ─── PHONE FORMATTING & VALIDATION ─────────────────────────

function formatPhone(text) {
  let digits = text.replace(/\D/g, '');

  // Convert +63 / 63 prefix to 09
  if (digits.startsWith('63')) {
    digits = '0' + digits.slice(2);
  }

  // Hard limit: 11 digits
  digits = digits.slice(0, 11);

  // 4-3-4 spacing
  if (digits.length <= 4) return digits;

  if (digits.length <= 7) {
    return digits.slice(0, 4) + ' ' + digits.slice(4);
  }

  return (
    digits.slice(0, 4) +
    ' ' +
    digits.slice(4, 7) +
    ' ' +
    digits.slice(7)
  );
}


function validatePhone(formatted) {
  const digits = formatted.replace(/\D/g, '');

  if (!digits) return 'Phone number is required';
  if (digits.length < 11) return 'Phone number is incomplete';
  if (!digits.startsWith('09')) return 'Phone number must start with 09';
  if (digits.length !== 11) return 'Phone number must be 11 digits';

  return '';
}


// ─── NAME VALIDATION ───────────────────────────────────────

function sanitizeName(text) {
  return text.replace(/[^a-zA-Z\s]/g, '');
}


function validateName(value) {
  if (!value.trim()) return 'Full name is required';
  if (value.trim().length < 2) return 'Name is too short';

  return '';
}


// ─── EMAIL VALIDATION ──────────────────────────────────────

function validateEmail(value) {
  if (!value.trim()) {
    return 'Email address is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value.trim())) {
    return 'Please enter a valid email address';
  }

  return '';
}


// ─── PASSWORD VALIDATION ───────────────────────────────────

function validatePassword(value) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return '';
}


// ───────────────────────────────────────────────────────────

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Registration/API error
  const [registerError, setRegisterError] = useState('');


  // ─── CLEAR ALL ERRORS ────────────────────────────────────

  function clearErrors() {
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setRegisterError('');
  }


  // ─── NAME CHANGE ─────────────────────────────────────────

  function handleNameChange(text) {
    const sanitized = sanitizeName(text);

    setName(sanitized);

    // Typing in ANY field clears ALL errors
    clearErrors();
  }


  // ─── EMAIL CHANGE ────────────────────────────────────────

  function handleEmailChange(text) {
    setEmail(text);

    // Typing in ANY field clears ALL errors
    clearErrors();
  }


  // ─── PHONE CHANGE ────────────────────────────────────────

  function handlePhoneChange(text) {
    const formatted = formatPhone(text);

    setPhone(formatted);

    // Typing in ANY field clears ALL errors
    clearErrors();
  }


  // ─── PASSWORD CHANGE ────────────────────────────────────

  function handlePasswordChange(text) {
    setPassword(text);

    // Typing in ANY field clears ALL errors
    clearErrors();
  }


  // ─── REGISTER ────────────────────────────────────────────

  async function handleRegister() {
    // Clear old errors first
    clearErrors();

    // Validate every field
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passwordErr = validatePassword(password);

    // Set all applicable errors
    if (nameErr) setNameError(nameErr);
    if (emailErr) setEmailError(emailErr);
    if (phoneErr) setPhoneError(phoneErr);
    if (passwordErr) setPasswordError(passwordErr);

    // Stop if there are validation errors
    if (
      nameErr ||
      emailErr ||
      phoneErr ||
      passwordErr
    ) {
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\D/g, '');

      await registerUser(email.trim(), password, {
        name: name.trim(),
        phone: cleanPhone,
      });

    } catch (err) {
      // Show registration error inside the form
      setRegisterError(
        err?.message || 'Unable to create your account. Please try again.'
      );
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
              Join QuickAid and access AI-powered emergency medical assistance.
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

            <View
              style={[
                s.fieldWrap,
                nameError && s.fieldError,
              ]}
            >
              <User
                size={18}
                color={nameError ? '#DC2626' : '#94A3B8'}
              />

              <TextInput
                style={s.fieldInput}
                value={name}
                onChangeText={handleNameChange}
                placeholder="Juan dela Cruz"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="words"
              />
            </View>

            {nameError ? (
              <Text style={s.errorText}>
                {nameError}
              </Text>
            ) : null}


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
                color={emailError ? '#DC2626' : '#94A3B8'}
              />

              <TextInput
                style={s.fieldInput}
                value={email}
                onChangeText={handleEmailChange}
                placeholder="you@example.com"
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


            {/* PHONE */}
            <Text style={s.fieldLabel}>
              PHONE NUMBER
            </Text>

            <View
              style={[
                s.fieldWrap,
                phoneError && s.fieldError,
              ]}
            >
              <Phone
                size={18}
                color={phoneError ? '#DC2626' : '#94A3B8'}
              />

              <TextInput
                style={s.fieldInput}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="09XX XXX XXXX"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
                maxLength={13}
              />
            </View>

            {phoneError ? (
              <Text style={s.errorText}>
                {phoneError}
              </Text>
            ) : null}


            {/* PASSWORD */}
            <Text style={s.fieldLabel}>
              PASSWORD
            </Text>

            <View
              style={[
                s.fieldWrap,
                passwordError && s.fieldError,
              ]}
            >
              <Lock
                size={18}
                color={passwordError ? '#DC2626' : '#94A3B8'}
              />

              <TextInput
                style={s.fieldInput}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Create a password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPass}
              />

              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff
                    size={18}
                    color={passwordError ? '#DC2626' : '#94A3B8'}
                  />
                ) : (
                  <Eye
                    size={18}
                    color={passwordError ? '#DC2626' : '#94A3B8'}
                  />
                )}
              </TouchableOpacity>
            </View>

            {passwordError ? (
              <Text style={s.errorText}>
                {passwordError}
              </Text>
            ) : null}


            {/* REGISTRATION ERROR */}
            {registerError ? (
              <Text style={s.registerErrorText}>
                {registerError}
              </Text>
            ) : null}


            {/* NOTICE */}
            <View style={s.noticeBox}>

              <ShieldCheck
                size={18}
                color="#5DBB9A"
              />

              <Text style={s.noticeText}>
                QuickAid is designed for emergency response teams and healthcare
                professionals.
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
                onPress={() => navigation.navigate('Login')}
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
    paddingTop: 40,
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
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    color: '#DC2626',
  },

  registerErrorText: {
    marginTop: 12,
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
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
