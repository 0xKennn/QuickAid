import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth';

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Hello, {profile?.name?.split(' ')[0]} 👋</Text>
            <Text style={s.subtitle}>Stay safe. Help is one tap away.</Text>
          </View>
          <TouchableOpacity onPress={logoutUser} style={s.logoutBtn}>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency contacts banner */}
        <TouchableOpacity
          style={s.emergencyBanner}
          onPress={() => navigation.navigate('EmergencyContacts')}
          activeOpacity={0.85}
        >
          <View style={s.bannerLeft}>
            <Text style={s.bannerEmoji}>📞</Text>
            <View>
              <Text style={s.bannerTitle}>Emergency Contacts</Text>
              <Text style={s.bannerSub}>Hotlines & personal contacts — one tap to call</Text>
            </View>
          </View>
          <Text style={s.bannerChevron}>›</Text>
        </TouchableOpacity>

        {/* Quick action cards */}
        <Text style={s.sectionTitle}>Quick actions</Text>
        <View style={s.cardRow}>
          <TouchableOpacity
            style={[s.actionCard, { backgroundColor: '#E1F5EE' }]}
            onPress={() => navigation.navigate('Capture')}
          >
            <Text style={s.actionEmoji}>📷</Text>
            <Text style={s.actionTitle}>Smart Capture</Text>
            <Text style={s.actionSub}>Identify injury with camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.actionCard, { backgroundColor: '#EEF2FF' }]}
            onPress={() => navigation.navigate('First Aid')}
          >
            <Text style={s.actionEmoji}>🩹</Text>
            <Text style={s.actionTitle}>First Aid Library</Text>
            <Text style={s.actionSub}>Browse guides by category</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            ⚠️ QuickAid is a first aid guide and decision support tool. It is not a substitute for professional medical care. In life-threatening emergencies, always call 911 first.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#F5F5F5' },
  logoutText: { fontSize: 13, color: '#666', fontWeight: '500' },
  emergencyBanner: { flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#FEE2E2',
    borderRadius: 14, padding: 16, marginBottom: 24,
    borderWidth: 0.5, borderColor: '#FECACA' },
  bannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  bannerEmoji: { fontSize: 28 },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#991B1B', marginBottom: 2 },
  bannerSub: { fontSize: 12, color: '#B91C1C', lineHeight: 16 },
  bannerChevron: { fontSize: 24, color: '#B91C1C' },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionCard: { flex: 1, borderRadius: 14, padding: 16,
    borderWidth: 0.5, borderColor: '#E0E0E0' },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 4 },
  actionSub: { fontSize: 12, color: '#666', lineHeight: 18 },
  disclaimer: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14,
    borderWidth: 0.5, borderColor: '#FDE68A' },
  disclaimerText: { fontSize: 12, color: '#92400E', lineHeight: 18 },
});