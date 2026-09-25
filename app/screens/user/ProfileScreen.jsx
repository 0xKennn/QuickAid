import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  Keyboard,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, logoutUser } from '../../services/auth';

const LANG_KEY = 'appLanguage';
const NOTIF_KEY = 'quickaid_notifications_enabled';

// ─── VALIDATION HELPERS ───────────────────────────────────

function sanitizeName(text) {
  return text.replace(/[^a-zA-Z\s]/g, '');
}

function validateName(value) {
  if (!value.trim()) return 'Name cannot be empty';
  if (value.trim().length < 2) return 'Name is too short';
  return '';
}

function formatPhone(text) {
  let digits = text.replace(/\D/g, '');

  if (digits.startsWith('63')) {
    digits = '0' + digits.slice(2);
  }

  digits = digits.slice(0, 11);

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
// ─────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();

  const [lang, setLang] = useState('en');
  const [notifEnabled, setNotif] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
  });

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const formRef = React.useRef({
    name: '',
    phone: '',
  });

  // ─── Keyboard height listener ───────────────────────────
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardHeight(0)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  // ───────────────────────────────────────────────────────

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    const l = await AsyncStorage.getItem(LANG_KEY);
    const n = await AsyncStorage.getItem(NOTIF_KEY);

    if (l) setLang(l);
    if (n !== null) setNotif(JSON.parse(n));
  }

  async function toggleLang() {
    const next = lang === 'en' ? 'fil' : 'en';
    setLang(next);
    await AsyncStorage.setItem(LANG_KEY, next);
  }

  async function toggleNotif(val) {
    setNotif(val);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(val));
  }

  function openEdit() {
    // Pre-fill with current profile data
    // Format phone so it displays as 09XX XXX XXXX
    const initial = {
      name: profile?.name || '',
      phone: formatPhone(profile?.phone || ''),
    };

    formRef.current = { ...initial };
    setForm(initial);
    setNameError('');
    setPhoneError('');
    setEditModal(true);
  }

  function handleNameChange(text) {
    const sanitized = sanitizeName(text);
    formRef.current.name = sanitized;
    setForm(f => ({ ...f, name: sanitized }));

    if (nameError) {
      setNameError(validateName(sanitized));
    }
  }

  function handlePhoneChange(text) {
    const formatted = formatPhone(text);
    formRef.current.phone = formatted;
    setForm(f => ({ ...f, phone: formatted }));

    const digits = formatted.replace(/\D/g, '');

    if (digits.length >= 11) {
      setPhoneError(validatePhone(formatted));
    } else if (digits.length >= 2 && !digits.startsWith('09')) {
      setPhoneError('Phone number must start with 09');
    } else {
      setPhoneError('');
    }
  }

  async function handleSave() {
    const data = formRef.current;
    const nameErr = validateName(data.name);
    const phoneErr = validatePhone(data.phone);

    if (nameErr) setNameError(nameErr);
    if (phoneErr) setPhoneError(phoneErr);

    if (nameErr || phoneErr) {
      Alert.alert('Invalid Input', nameErr || phoneErr);
      return;
    }

    setSaving(true);

    try {
      // Only send fields that actually changed
      const updates = {};
      const cleanName = data.name.trim();
      const cleanPhone = data.phone.replace(/\D/g, '');

      if (cleanName !== (profile?.name || '').trim()) {
        updates.name = cleanName;
      }
      if (cleanPhone !== (profile?.phone || '').replace(/\D/g, '')) {
        updates.phone = cleanPhone;
      }

      // If nothing changed, just close the modal
      if (Object.keys(updates).length === 0) {
        setEditModal(false);
        return;
      }

      await updateUserProfile(user.uid, updates);
      await refreshProfile();

      setEditModal(false);
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: logoutUser,
        },
      ]
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#03110D" />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Profile</Text>
          <Text style={s.headerSubtitle}>
            QuickAid healthcare account
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>

          <Text style={s.name}>
            {profile?.name || 'QuickAid User'}
          </Text>

          <Text style={s.email}>
            {user?.email}
          </Text>

          <View style={s.roleBadge}>
            <View style={s.badgeDot} />
            <Text style={s.roleText}>
              DRRM / Medical Personnel
            </Text>
          </View>

          <TouchableOpacity style={s.editButton} onPress={openEdit}>
            <Text style={s.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* PERSONAL INFO */}
        <Text style={s.sectionTitle}>PERSONAL INFORMATION</Text>

        <View style={s.card}>
          <InfoRow label="Full Name" value={profile?.name} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Phone" value={formatPhone(profile?.phone || '')} />
        </View>

        {/* SETTINGS */}
        <Text style={s.sectionTitle}>SETTINGS</Text>

        <View style={s.card}>
          <SettingRow
            title="Language"
            subtitle={lang === 'en' ? 'English' : 'Filipino'}
          >
            <TouchableOpacity style={s.pillButton} onPress={toggleLang}>
              <Text style={s.pillText}>
                {lang === 'en' ? 'EN' : 'FIL'}
              </Text>
            </TouchableOpacity>
          </SettingRow>

          <View style={s.divider} />

          <SettingRow
            title="Push Notifications"
            subtitle={notifEnabled ? 'Enabled' : 'Disabled'}
          >
            <Switch
              value={notifEnabled}
              onValueChange={toggleNotif}
              trackColor={{ false: '#1A2A26', true: '#34D399' }}
              thumbColor={notifEnabled ? '#ECFDF5' : '#FFFFFF'}
            />
          </SettingRow>
        </View>

        {/* ABOUT */}
        <Text style={s.sectionTitle}>SYSTEM</Text>

        <View style={s.card}>
          <InfoRow label="Version" value="QuickAid v1.0" />
          <InfoRow label="Build" value="Healthcare Beta" />
          <InfoRow label="Status" value="Operational" />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={s.footer}>
          QuickAid Capstone 2026{'\n'}
          AI-powered emergency assistance
        </Text>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal
        visible={editModal}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={[s.modalOverlay, { paddingBottom: keyboardHeight }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.modalScrollContent}
          >
            <View style={s.modalContainer}>
              <Text style={s.modalTitle}>Edit Profile</Text>

              {/* NAME */}
              <Text style={s.inputLabel}>Full Name</Text>

              <TextInput
                style={[
                  s.input,
                  nameError
                    ? { borderColor: '#E74C3C', backgroundColor: '#FDF2F2' }
                    : null,
                ]}
                placeholder="Your full name"
                placeholderTextColor="#6B7280"
                value={form.name}
                onChangeText={handleNameChange}
                autoCapitalize="words"
              />

              {nameError ? (
                <Text style={s.errorText}>{nameError}</Text>
              ) : (
                <Text style={s.hintText}>Letters and spaces only</Text>
              )}

              {/* PHONE */}
              <Text style={s.inputLabel}>Phone Number</Text>

              <TextInput
                style={[
                  s.input,
                  phoneError
                    ? { borderColor: '#E74C3C', backgroundColor: '#FDF2F2' }
                    : null,
                ]}
                placeholder="09XX XXX XXXX"
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
                maxLength={13}
                value={form.phone}
                onChangeText={handlePhoneChange}
              />

              {phoneError ? (
                <Text style={s.errorText}>{phoneError}</Text>
              ) : (
                <Text style={s.hintText}>Format: 09XX XXX XXXX (11 digits)</Text>
              )}

              <View style={s.modalButtons}>
                <TouchableOpacity
                  style={s.cancelBtn}
                  onPress={() => setEditModal(false)}
                >
                  <Text style={s.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.saveBtn}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#03110D" />
                  ) : (
                    <Text style={s.saveText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value || '—'}</Text>
    </View>
  );
}

function SettingRow({ title, subtitle, children }) {
  return (
    <View style={s.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.settingTitle}>{title}</Text>
        <Text style={s.settingSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },

  scroll: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    marginBottom: 28,
  },

  headerTitle: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 4,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginBottom: 26,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#6EE7B7',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 16,
  },

  avatarText: {
    color: '#065F46',
    fontSize: 30,
    fontWeight: '800',
  },

  name: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },

  email: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 14,
  },

  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#ECFDF5',

    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,

    marginTop: 16,
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: '#34D399',
    marginRight: 8,
  },

  roleText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 13,
  },

  editButton: {
    marginTop: 18,

    backgroundColor: '#6EE7B7',

    paddingHorizontal: 24,
    paddingVertical: 12,

    borderRadius: 16,
  },

  editButtonText: {
    color: '#064E3B',
    fontWeight: '700',
    fontSize: 14,
  },

  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,

    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',

    borderRadius: 22,
    marginBottom: 24,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  row: {
    paddingHorizontal: 18,
    paddingVertical: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowLabel: {
    color: '#6B7280',
    fontSize: 14,
  },

  rowValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',

    maxWidth: '60%',
    textAlign: 'right',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  settingTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },

  settingSubtitle: {
    color: '#6B7280',
    marginTop: 3,
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  pillButton: {
    backgroundColor: '#ECFDF5',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 16,
  },

  pillText: {
    color: '#059669',
    fontWeight: '700',
  },

  logoutBtn: {
    backgroundColor: '#EF4444',

    paddingVertical: 16,
    borderRadius: 20,

    alignItems: 'center',

    marginBottom: 26,
  },

  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    lineHeight: 22,
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },

  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',

    padding: 24,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  modalTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',

    marginBottom: 20,
  },

  inputLabel: {
    color: '#6B7280',

    marginBottom: 8,
    marginTop: 12,

    fontSize: 13,
  },

  input: {
    backgroundColor: '#F9FAFB',

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: 14,

    color: '#111827',

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#E74C3C',
  },

  hintText: {
    marginTop: 6,
    fontSize: 12,
    color: '#9CA3AF',
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 12,
  },

  cancelBtn: {
    flex: 1,

    backgroundColor: '#F3F4F6',

    paddingVertical: 15,
    borderRadius: 16,

    alignItems: 'center',
  },

  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
  },

  saveBtn: {
    flex: 1,

    backgroundColor: '#6EE7B7',

    paddingVertical: 15,
    borderRadius: 16,

    alignItems: 'center',
  },

  saveText: {
    color: '#064E3B',
    fontWeight: '800',
  },
});