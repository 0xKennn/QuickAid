import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ScrollView, TextInput, Switch, Alert,
  ActivityIndicator, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, logoutUser } from '../../services/auth';

const LANG_KEY  = 'appLanguage';
const NOTIF_KEY = 'quickaid_notifications_enabled';

export default function ProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [lang, setLang]           = useState('en');
  const [notifEnabled, setNotif]  = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ name: '', phone: '' });
  const formRef                   = React.useRef({ name: '', phone: '' });

  useEffect(() => { loadPreferences(); }, []);

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
    const initial = { name: profile?.name || '', phone: profile?.phone || '' };
    formRef.current = { ...initial };
    setForm(initial);
    setEditModal(true);
  }

  async function handleSave() {
    const data = formRef.current;
    if (!data.name.trim()) {
      Alert.alert('Missing field', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name:  data.name.trim(),
        phone: data.phone.trim(),
      });
      await refreshProfile();
      setEditModal(false);
      Alert.alert('Saved', 'Your profile has been updated.');
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
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: logoutUser },
      ]
    );
  }

  function InfoRow({ label, value }) {
    return (
      <View style={s.infoRow}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value || '—'}</Text>
      </View>
    );
  }

  function SettingRow({ label, sub, children }) {
    return (
      <View style={s.settingRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.settingLabel}>{label}</Text>
          {sub && <Text style={s.settingSub}>{sub}</Text>}
        </View>
        {children}
      </View>
    );
  }

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.profileName}>{profile?.name || 'User'}</Text>
          <Text style={s.profileEmail}>{user?.email}</Text>
          <View style={s.roleBadge}>
            <Text style={s.roleText}>🏥 DRRM / Medical Professional</Text>
          </View>
          <TouchableOpacity style={s.editBtn} onPress={openEdit}>
            <Text style={s.editBtnText}>✏️  Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Personal info */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Personal information</Text>
          <View style={s.card}>
            <InfoRow label="Full name" value={profile?.name} />
            <InfoRow label="Email"     value={user?.email} />
            <InfoRow label="Phone"     value={profile?.phone} />
          </View>
        </View>

        {/* Settings */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Settings</Text>
          <View style={s.card}>
            <SettingRow
              label="Language"
              sub={lang === 'en' ? 'English' : 'Filipino (Tagalog)'}
            >
              <TouchableOpacity style={s.langToggle} onPress={toggleLang}>
                <Text style={s.langToggleText}>
                  {lang === 'en' ? '🇺🇸 EN' : '🇵🇭 FIL'}
                </Text>
              </TouchableOpacity>
            </SettingRow>
            <View style={s.divider} />
            <SettingRow
              label="Push notifications"
              sub={notifEnabled ? 'Enabled' : 'Disabled'}
            >
              <Switch
                value={notifEnabled}
                onValueChange={toggleNotif}
                trackColor={{ false: '#E0E0E0', true: '#FECACA' }}
                thumbColor={notifEnabled ? '#B91C1C' : '#fff'}
              />
            </SettingRow>
          </View>
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>About</Text>
          <View style={s.card}>
            <InfoRow label="App version" value="1.0.0 (Beta)" />
            <InfoRow label="Build"       value="Phase 2 Complete" />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={s.footerText}>
          QuickAid · Capstone Project 2026{'\n'}
          For first aid guidance only — not a substitute for professional medical care.
        </Text>

      </ScrollView>

      {/* Edit modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Edit profile</Text>

            <Text style={s.fieldLabel}>Full name</Text>
            <TextInput
              style={s.input}
              value={form.name}
              onChangeText={t => {
                formRef.current.name = t;
                setForm(f => ({ ...f, name: t }));
              }}
              placeholder="Your full name"
            />

            <Text style={s.fieldLabel}>Phone number</Text>
            <TextInput
              style={s.input}
              value={form.phone}
              onChangeText={t => {
                formRef.current.phone = t;
                setForm(f => ({ ...f, phone: t }));
              }}
              placeholder="+63 912 345 6789"
              keyboardType="phone-pad"
            />

            <Text style={s.editNote}>
              Email cannot be changed here.
            </Text>

            <View style={s.modalBtns}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setEditModal(false)}
                disabled={saving}
              >
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.saveBtnText}>Save changes</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#F5F5F5' },
  header:       { backgroundColor: '#B91C1C', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle:  { fontSize: 20, fontWeight: '700', color: '#fff' },
  scroll:       { paddingBottom: 48 },
  avatarSection:{ backgroundColor: '#fff', alignItems: 'center', paddingVertical: 28,
    paddingHorizontal: 20, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0', marginBottom: 16 },
  avatar:       { width: 80, height: 80, borderRadius: 40, backgroundColor: '#B91C1C',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:   { fontSize: 28, fontWeight: '700', color: '#fff' },
  profileName:  { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#888', marginBottom: 10 },
  roleBadge:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
    paddingVertical: 6, borderRadius: 20, backgroundColor: '#FEE2E2', marginBottom: 14 },
  roleText:     { fontSize: 13, fontWeight: '600', color: '#B91C1C' },
  editBtn:      { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E0E0E0' },
  editBtnText:  { fontSize: 13, fontWeight: '500', color: '#444' },
  section:      { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#888', textTransform: 'uppercase',
    letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  card:         { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    borderWidth: 0.5, borderColor: '#F0F0F0' },
  infoRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: '#F5F5F5' },
  infoLabel:    { fontSize: 13, color: '#888', fontWeight: '500' },
  infoValue:    { fontSize: 13, color: '#111', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  settingRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  settingLabel: { fontSize: 13, fontWeight: '500', color: '#111' },
  settingSub:   { fontSize: 12, color: '#888', marginTop: 2 },
  divider:      { height: 0.5, backgroundColor: '#F5F5F5', marginHorizontal: 16 },
  langToggle:   { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#FEE2E2', borderWidth: 0.5, borderColor: '#FECACA' },
  langToggleText:{ fontSize: 13, fontWeight: '600', color: '#B91C1C' },
  logoutBtn:    { marginHorizontal: 16, marginTop: 8, marginBottom: 16, backgroundColor: '#fff',
    borderRadius: 14, paddingVertical: 15, alignItems: 'center',
    borderWidth: 0.5, borderColor: '#FECACA' },
  logoutText:   { fontSize: 15, fontWeight: '600', color: '#B91C1C' },
  footerText:   { fontSize: 11, color: '#BBB', textAlign: 'center', lineHeight: 18, paddingHorizontal: 32 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet:   { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 40 },
  modalTitle:   { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 20 },
  fieldLabel:   { fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 12 },
  input:        { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#111', backgroundColor: '#FAFAFA' },
  editNote:     { fontSize: 12, color: '#999', marginTop: 12, fontStyle: 'italic' },
  modalBtns:    { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn:    { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#F5F5F5' },
  cancelBtnText:{ fontSize: 14, fontWeight: '600', color: '#666' },
  saveBtn:      { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#B91C1C' },
  saveBtnText:  { fontSize: 14, fontWeight: '600', color: '#fff' },
});