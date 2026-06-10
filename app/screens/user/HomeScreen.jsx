import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth';

const TIPS = [
  {
    category: 'Burns',
    categoryColor: '#C45000',
    categoryBg: '#FFF0E0',
    title: 'Treating a minor burn',
    steps: [
      'Cool under running water for at least 10 minutes',
      'Do not apply ice, butter, or toothpaste',
      'Cover loosely with a clean non-stick bandage',
    ],
  },
  {
    category: 'Cuts & Wounds',
    categoryColor: '#B91C1C',
    categoryBg: '#FFE8E8',
    title: 'Treating a minor cut',
    steps: [
      'Rinse the wound under clean running water',
      'Apply gentle pressure to stop bleeding',
      'Cover with an adhesive bandage',
    ],
  },
  {
    category: 'Choking',
    categoryColor: '#15803D',
    categoryBg: '#F0FDF4',
    title: 'Responding to choking',
    steps: [
      'Ask "Are you choking?" — act if they cannot speak',
      'Give 5 firm back blows between shoulder blades',
      'Follow with 5 abdominal thrusts (Heimlich)',
    ],
  },
  {
    category: 'Sprains',
    categoryColor: '#0369A1',
    categoryBg: '#F0F9FF',
    title: 'RICE method for sprains',
    steps: [
      'Rest — stop activity immediately',
      'Ice — apply wrapped ice for 15–20 minutes',
      'Compression — wrap with elastic bandage',
    ],
  },
  {
    category: 'Bleeding',
    categoryColor: '#9F1239',
    categoryBg: '#FFF1F2',
    title: 'Controlling bleeding',
    steps: [
      'Apply firm direct pressure with a clean cloth',
      'Maintain pressure for at least 10 minutes',
      'Add more cloth on top if it soaks through',
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    const dayIndex = new Date().getDate() % TIPS.length;
    setTip(TIPS[dayIndex]);
  }, []);

  const firstName = profile?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      {/* Red header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>Hello, {firstName} 👋</Text>
            <Text style={s.greetingSub}>DRRM Officer · Stay prepared</Text>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={logoutUser}>
            <Text style={s.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Stats row */}
        <View style={s.statRow}>
          <View style={s.statCard}>
            <Text style={s.statVal}>8</Text>
            <Text style={s.statLabel}>Injury{'\n'}categories</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>10+</Text>
            <Text style={s.statLabel}>First aid{'\n'}guides</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statVal}>2</Text>
            <Text style={s.statLabel}>Languages{'\n'}supported</Text>
          </View>
        </View>

        {/* Emergency contacts banner */}
        <TouchableOpacity
          style={s.emergCard}
          onPress={() => navigation.navigate('EmergencyContacts')}
          activeOpacity={0.85}
        >
          <View style={s.emergIcon}>
            <Text style={s.emergIconText}>📞</Text>
          </View>
          <View style={s.emergBody}>
            <Text style={s.emergTitle}>Emergency Contacts</Text>
            <Text style={s.emergSub}>Hotlines &amp; personal contacts — one tap to call</Text>
          </View>
          <Text style={s.emergChev}>›</Text>
        </TouchableOpacity>

        {/* Quick actions */}
        <Text style={s.sectionLabel}>Quick actions</Text>
        <View style={s.actionGrid}>
          <TouchableOpacity
            style={s.actionCard}
            onPress={() => navigation.navigate('Capture')}
            activeOpacity={0.85}
          >
            <View style={[s.actionIcon, { backgroundColor: '#FEE2E2' }]}>
              <Text style={s.actionEmoji}>📷</Text>
            </View>
            <Text style={s.actionTitle}>Smart Capture</Text>
            <Text style={s.actionSub}>Identify injury with camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.actionCard}
            onPress={() => navigation.navigate('First Aid')}
            activeOpacity={0.85}
          >
            <View style={[s.actionIcon, { backgroundColor: '#E0E7FF' }]}>
              <Text style={s.actionEmoji}>🩹</Text>
            </View>
            <Text style={s.actionTitle}>First Aid Library</Text>
            <Text style={s.actionSub}>Browse all guides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.actionCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.85}
          >
            <View style={[s.actionIcon, { backgroundColor: '#DCFCE7' }]}>
              <Text style={s.actionEmoji}>🤖</Text>
            </View>
            <Text style={s.actionTitle}>AI Assistant</Text>
            <Text style={s.actionSub}>Ask medical questions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.actionCard}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}
          >
            <View style={[s.actionIcon, { backgroundColor: '#FEF9C3' }]}>
              <Text style={s.actionEmoji}>👤</Text>
            </View>
            <Text style={s.actionTitle}>My Profile</Text>
            <Text style={s.actionSub}>Settings &amp; preferences</Text>
          </TouchableOpacity>
        </View>

        {/* First aid tip of the day */}
        <Text style={s.sectionLabel}>First aid tip of the day</Text>
        <View style={s.tipCard}>
          <View style={s.tipHeader}>
            <View style={[s.tipBadge, { backgroundColor: tip.categoryBg }]}>
              <Text style={[s.tipBadgeText, { color: tip.categoryColor }]}>
                {tip.category}
              </Text>
            </View>
          </View>
          <Text style={s.tipTitle}>{tip.title}</Text>
          <View style={s.tipSteps}>
            {tip.steps.map((step, i) => (
              <View key={i} style={s.tipStep}>
                <View style={[s.tipNum, { backgroundColor: tip.categoryBg }]}>
                  <Text style={[s.tipNumText, { color: tip.categoryColor }]}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={s.tipText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerIcon}>⚠️</Text>
          <Text style={s.disclaimerText}>
            For guidance only — not a substitute for professional medical care.
            Call 911 in life-threatening emergencies.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#B91C1C' },
  header:         { backgroundColor: '#B91C1C', paddingHorizontal: 20,
                    paddingTop: 12, paddingBottom: 24 },
  headerRow:      { flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'flex-start' },
  greeting:       { fontSize: 20, fontWeight: '700', color: '#fff' },
  greetingSub:    { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  logoutBtn:      { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.18)' },
  logoutText:     { fontSize: 13, color: '#fff', fontWeight: '500' },
  scroll:         { flex: 1, backgroundColor: '#F5F5F5',
                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                    marginTop: -12 },
  scrollContent:  { padding: 16, paddingBottom: 40 },
  statRow:        { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard:       { flex: 1, backgroundColor: '#fff', borderRadius: 12,
                    padding: 12, alignItems: 'center',
                    borderWidth: 0.5, borderColor: '#F0F0F0' },
  statVal:        { fontSize: 20, fontWeight: '700', color: '#B91C1C' },
  statLabel:      { fontSize: 10, color: '#888', textAlign: 'center',
                    marginTop: 3, lineHeight: 14 },
  emergCard:      { flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#fff', borderRadius: 14, padding: 14,
                    borderWidth: 0.5, borderColor: '#FECACA',
                    borderLeftWidth: 3, borderLeftColor: '#B91C1C',
                    marginBottom: 16, gap: 12 },
  emergIcon:      { width: 42, height: 42, borderRadius: 10,
                    backgroundColor: '#FEE2E2', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0 },
  emergIconText:  { fontSize: 20 },
  emergBody:      { flex: 1 },
  emergTitle:     { fontSize: 14, fontWeight: '600', color: '#B91C1C', marginBottom: 2 },
  emergSub:       { fontSize: 12, color: '#888' },
  emergChev:      { fontSize: 22, color: '#B91C1C' },
  sectionLabel:   { fontSize: 11, fontWeight: '600', color: '#888',
                    textTransform: 'uppercase', letterSpacing: 0.6,
                    marginBottom: 10, marginLeft: 2 },
  actionGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  actionCard:     { width: '47.5%', backgroundColor: '#fff', borderRadius: 14,
                    padding: 14, borderWidth: 0.5, borderColor: '#F0F0F0' },
  actionIcon:     { width: 42, height: 42, borderRadius: 10, alignItems: 'center',
                    justifyContent: 'center', marginBottom: 10 },
  actionEmoji:    { fontSize: 22 },
  actionTitle:    { fontSize: 13, fontWeight: '600', color: '#111', marginBottom: 3 },
  actionSub:      { fontSize: 11, color: '#888', lineHeight: 16 },
  tipCard:        { backgroundColor: '#fff', borderRadius: 14, padding: 16,
                    borderWidth: 0.5, borderColor: '#F0F0F0', marginBottom: 14 },
  tipHeader:      { marginBottom: 10 },
  tipBadge:       { alignSelf: 'flex-start', paddingHorizontal: 10,
                    paddingVertical: 4, borderRadius: 6 },
  tipBadgeText:   { fontSize: 11, fontWeight: '600', textTransform: 'uppercase',
                    letterSpacing: 0.4 },
  tipTitle:       { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 12 },
  tipSteps:       { gap: 8 },
  tipStep:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipNum:         { width: 20, height: 20, borderRadius: 6, alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  tipNumText:     { fontSize: 11, fontWeight: '700' },
  tipText:        { fontSize: 13, color: '#555', lineHeight: 20, flex: 1 },
  disclaimer:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8,
                    backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12,
                    borderWidth: 0.5, borderColor: '#FDE68A' },
  disclaimerIcon: { fontSize: 14, marginTop: 1 },
  disclaimerText: { fontSize: 12, color: '#92400E', lineHeight: 18, flex: 1 },
});