import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, SEVERITY } from '../../data/categories';

export default function GuideDetailScreen({ route, navigation }) {
  const { guide } = route.params;
  const [lang, setLang] = useState('en');
  const [speaking, setSpeaking] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const cat = CATEGORIES.find(c => c.id === guide.categoryId);
  const sev = SEVERITY[guide.severity];
  const content = guide.content[lang] || guide.content.en;

  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then(l => { if (l) setLang(l); });
    return () => { Speech.stop(); };
  }, []);

  async function speakStep(step, index) {
    await Speech.stop();
    setSpeaking(true);
    setActiveStep(index);
    Speech.speak(`Step ${index + 1}. ${step}`, {
      language: lang === 'fil' ? 'fil-PH' : 'en-US',
      onDone: () => { setSpeaking(false); setActiveStep(null); },
      onError: () => { setSpeaking(false); setActiveStep(null); },
    });
  }

  async function speakAll() {
    await Speech.stop();
    setSpeaking(true);
    const fullText = content.steps.map((s, i) => `Step ${i + 1}. ${s}`).join('. ');
    Speech.speak(fullText, {
      language: lang === 'fil' ? 'fil-PH' : 'en-US',
      onDone: () => { setSpeaking(false); setActiveStep(null); },
      onError: () => { setSpeaking(false); setActiveStep(null); },
    });
  }

  async function stopSpeaking() {
    await Speech.stop();
    setSpeaking(false);
    setActiveStep(null);
  }

  async function toggleLang() {
    const next = lang === 'en' ? 'fil' : 'en';
    await Speech.stop();
    setSpeaking(false);
    setActiveStep(null);
    setLang(next);
    await AsyncStorage.setItem('appLanguage', next);
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={[s.header, { backgroundColor: cat.bg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={[s.backText, { color: cat.accent }]}>‹ Back</Text>
        </TouchableOpacity>
        <View style={s.headerContent}>
          <Text style={s.headerEmoji}>{cat.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.headerTitle, { color: cat.accent }]}>{guide.title}</Text>
            <Text style={[s.headerCat, { color: cat.accent + 'AA' }]}>{cat.name}</Text>
          </View>
          {/* Language toggle */}
          <TouchableOpacity style={[s.langBtn, { borderColor: cat.accent }]} onPress={toggleLang}>
            <Text style={[s.langText, { color: cat.accent }]}>
              {lang === 'en' ? '🇵🇭 FIL' : '🇺🇸 EN'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* Severity + emergency banner */}
        <View style={s.badges}>
          <View style={[s.sevBadge, { backgroundColor: sev.bg }]}>
            <Text style={[s.sevText, { color: sev.color }]}>
              ● {sev.label}
            </Text>
          </View>
          {guide.callEmergency && (
            <View style={s.emergBadge}>
              <Text style={s.emergText}>🚨 Call 911 immediately</Text>
            </View>
          )}
        </View>

        {/* Overview */}
        <View style={s.overviewBox}>
          <Text style={s.overviewLabel}>Overview</Text>
          <Text style={s.overviewText}>{content.overview}</Text>
        </View>

        {/* TTS controls */}
        <View style={s.ttsRow}>
          <TouchableOpacity
            style={[s.ttsBtn, { backgroundColor: cat.accent }]}
            onPress={speaking ? stopSpeaking : speakAll}
          >
            <Text style={s.ttsBtnText}>
              {speaking ? '⏹ Stop reading' : '🔊 Read all steps'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Steps */}
        <Text style={s.stepsLabel}>Steps</Text>
        {content.steps.map((step, i) => (
          <TouchableOpacity
            key={i}
            style={[s.stepCard, activeStep === i && { borderColor: cat.accent, borderWidth: 1.5 }]}
            onPress={() => activeStep === i ? stopSpeaking() : speakStep(step, i)}
            activeOpacity={0.85}
          >
            <View style={[s.stepNum, { backgroundColor: cat.bg }]}>
              <Text style={[s.stepNumText, { color: cat.accent }]}>{i + 1}</Text>
            </View>
            <Text style={s.stepText}>{step}</Text>
            <Text style={s.stepSpeak}>{activeStep === i ? '🔊' : '▶'}</Text>
          </TouchableOpacity>
        ))}

        {/* Emergency CTA */}
        {guide.callEmergency && (
          <View style={s.emergBox}>
            <Text style={s.emergBoxTitle}>⚠️ This is a medical emergency</Text>
            <Text style={s.emergBoxText}>
              These steps are first aid only. Call 911 or your local emergency number immediately.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 8, paddingBottom: 16, paddingHorizontal: 20 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 16, fontWeight: '500' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
  headerCat: { fontSize: 12, marginTop: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  langText: { fontSize: 12, fontWeight: '600' },
  scroll: { padding: 20, paddingBottom: 60 },
  badges: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  sevBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  sevText: { fontSize: 12, fontWeight: '600' },
  emergBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  emergText: { fontSize: 12, color: '#991B1B', fontWeight: '600' },
  overviewBox: { backgroundColor: '#F9F9F9', borderRadius: 12, padding: 14, marginBottom: 16 },
  overviewLabel: { fontSize: 11, fontWeight: '600', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  overviewText: { fontSize: 14, color: '#444', lineHeight: 22 },
  ttsRow: { marginBottom: 16 },
  ttsBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  ttsBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  stepsLabel: { fontSize: 11, fontWeight: '600', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  stepCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 0.5, borderColor: '#EFEFEF',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  stepNum: { width: 30, height: 30, borderRadius: 8, alignItems: 'center',
    justifyContent: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 14, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 22 },
  stepSpeak: { fontSize: 16, color: '#CCC', flexShrink: 0 },
  emergBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 16,
    marginTop: 16, borderWidth: 1, borderColor: '#FECACA' },
  emergBoxTitle: { fontSize: 14, fontWeight: '700', color: '#991B1B', marginBottom: 6 },
  emergBoxText: { fontSize: 13, color: '#7F1D1D', lineHeight: 20 },
});