import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet,
  SafeAreaView, StatusBar, Alert, Linking, Modal,
  TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HOTLINES } from '../../data/hotlines';
import { getContacts, saveContact, deleteContact } from '../../services/contacts';

const RELATIONSHIPS = [
  'Mother', 'Father', 'Sibling', 'Spouse', 'Child',
  'Relative', 'Friend', 'Doctor', 'Neighbor', 'Other'
];

export default function EmergencyContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', number: '', relationship: 'Mother' });
  const [tab, setTab] = useState('personal');
  const formRef = React.useRef({ name: '', number: '', relationship: 'Mother' });

  useFocusEffect(useCallback(() => {
    loadContacts();
  }, []));

  async function loadContacts() {
    setLoading(true);
    const c = await getContacts();
    setContacts(c);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    const initial = { name: '', number: '', relationship: 'Mother' };
    formRef.current = initial;
    setForm(initial);
    setModalVisible(true);
  }

  function openEdit(contact) {
    setEditing(contact);
    const initial = {
      name: contact.name,
      number: contact.number,
      relationship: contact.relationship
    };
    formRef.current = { ...initial };
    setForm(initial);
    setModalVisible(true);
  }

  async function handleSave() {
    const data = formRef.current;
    console.log('handleSave fired, data:', JSON.stringify(data));
    
    if (!data.name.trim() || !data.number.trim()) {
      Alert.alert('Missing fields', 'Please enter a name and phone number.');
      return;
    }
  
    try {
      console.log('Calling saveContact...');
      await saveContact(editing ? { ...editing, ...data } : data);
      console.log('saveContact done');
      setModalVisible(false);
      await loadContacts();
      console.log('loadContacts done');
    } catch (err) {
      console.log('ERROR:', err.message);
      Alert.alert('Error saving contact', err.message);
    }
  }

  function handleDelete(contact) {
    Alert.alert(
      'Remove contact',
      `Remove ${contact.name} from your emergency contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive', onPress: async () => {
            await deleteContact(contact.id);
            loadContacts();
          }
        },
      ]
    );
  }

  function callNumber(number) {
    const url = `tel:${number.replace(/\s+/g, '')}`;
    Linking.canOpenURL(url).then(can => {
      if (can) Linking.openURL(url);
      else Alert.alert('Cannot make call', 'Your device does not support phone calls.');
    });
  }

  function ContactCard({ item, isHotline }) {
    return (
      <View style={s.card}>
        <View style={[s.avatar, { backgroundColor: isHotline ? '#FEE2E2' : '#E1F5EE' }]}>
          <Text style={s.avatarText}>
            {isHotline ? item.emoji : item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={s.cardBody}>
          <Text style={s.cardName}>{item.name}</Text>
          <Text style={s.cardSub}>{isHotline ? item.category : item.relationship}</Text>
          <Text style={s.cardNumber}>{item.number}</Text>
        </View>
        <View style={s.cardActions}>
          <TouchableOpacity
            style={[s.callBtn, { backgroundColor: isHotline ? '#B91C1C' : '#1D9E75' }]}
            onPress={() => callNumber(item.number)}
          >
            <Text style={s.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
          {!isHotline && (
            <View style={s.actionRow}>
              <TouchableOpacity onPress={() => openEdit(item)} style={s.iconBtn}>
                <Text style={s.iconBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)} style={s.iconBtn}>
                <Text style={s.iconBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={s.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>Emergency Contacts</Text>
        <Text style={s.subtitle}>One tap to call in an emergency</Text>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'personal' && s.tabActive]}
          onPress={() => setTab('personal')}
        >
          <Text style={[s.tabText, tab === 'personal' && s.tabTextActive]}>
            👤 My contacts ({contacts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'hotlines' && s.tabActive]}
          onPress={() => setTab('hotlines')}
        >
          <Text style={[s.tabText, tab === 'hotlines' && s.tabTextActive]}>
            🚨 Hotlines ({HOTLINES.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {tab === 'personal' ? (
        loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color="#1D9E75" />
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={c => c.id}
            contentContainerStyle={s.list}
            ListEmptyComponent={
              <View style={s.empty}>
                <Text style={s.emptyEmoji}>👤</Text>
                <Text style={s.emptyTitle}>No contacts yet</Text>
                <Text style={s.emptyText}>
                  Add emergency contacts like family members or a personal doctor.
                </Text>
              </View>
            }
            renderItem={({ item }) => <ContactCard item={item} isHotline={false} />}
          />
        )
      ) : (
        <FlatList
          data={HOTLINES}
          keyExtractor={h => h.id}
          contentContainerStyle={s.list}
          renderItem={({ item }) => <ContactCard item={item} isHotline={true} />}
        />
      )}

      {/* Add button */}
      {tab === 'personal' && (
        <TouchableOpacity style={s.fab} onPress={openAdd}>
          <Text style={s.fabText}>+ Add contact</Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>
              {editing ? 'Edit contact' : 'Add emergency contact'}
            </Text>

            <Text style={s.fieldLabel}>Name</Text>
            <TextInput
              style={s.input}
              value={form.name}
              onChangeText={t => {
                formRef.current.name = t;
                setForm(f => ({ ...f, name: t }));
              }}
              placeholder="e.g. Sharmaine"
            />

            <Text style={s.fieldLabel}>Phone number</Text>
            <TextInput
              style={s.input}
              value={form.number}
              onChangeText={t => {
                formRef.current.number = t;
                setForm(f => ({ ...f, number: t }));
              }}
              placeholder="e.g. +63 912 345 6789"
              keyboardType="phone-pad"
            />

            <Text style={s.fieldLabel}>Relationship</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
            >
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {RELATIONSHIPS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={[s.relPill, form.relationship === r && s.relPillActive]}
                    onPress={() => {
                      formRef.current.relationship = r;
                      setForm(f => ({ ...f, relationship: r }));
                    }}
                  >
                    <Text style={[s.relPillText, form.relationship === r && s.relPillTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={s.modalBtns}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                <Text style={s.saveBtnText}>Save contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: '#1D9E75', fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  tabRow: { flexDirection: 'row', marginHorizontal: 20, marginVertical: 12, gap: 8 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E0E0E0' },
  tabActive: { backgroundColor: '#E1F5EE', borderColor: '#1D9E75' },
  tabText: { fontSize: 13, fontWeight: '500', color: '#888' },
  tabTextActive: { color: '#0F6E56' },
  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: 14, borderWidth: 0.5, borderColor: '#F0F0F0',
    backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 8, elevation: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 22, fontWeight: '700' },
  cardBody: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  cardSub: { fontSize: 12, color: '#888', marginBottom: 2 },
  cardNumber: { fontSize: 13, color: '#555', fontWeight: '500' },
  cardActions: { alignItems: 'flex-end', gap: 6 },
  callBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  callBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6 },
  iconBtnText: { fontSize: 16 },
  fab: { position: 'absolute', bottom: 28, left: 20, right: 20,
    backgroundColor: '#1D9E75', borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', shadowColor: '#1D9E75', shadowOpacity: 0.3,
    shadowRadius: 12, elevation: 4 },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 8 },
  emptyText: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#111', backgroundColor: '#FAFAFA' },
  relPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E0E0E0' },
  relPillActive: { backgroundColor: '#E1F5EE', borderColor: '#1D9E75' },
  relPillText: { fontSize: 13, color: '#888', fontWeight: '500' },
  relPillTextActive: { color: '#0F6E56' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', backgroundColor: '#F5F5F5' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#666' },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 10,
    alignItems: 'center', backgroundColor: '#1D9E75' },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});