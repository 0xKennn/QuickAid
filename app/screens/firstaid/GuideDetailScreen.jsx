import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, StatusBar, Alert
} from 'react-native';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIES, SEVERITY } from '../../data/categories';

export default function GuideDetailScreen({ route, navigation }) {
  const { guide }                   = route.params;
  const [lang, setLang]             = useState('en');
  const [speaking, setSpeaking]     = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  const cat     = CATEGORIES.find(c => c.id === guide.categoryId);
  const sev     = SEVERITY[guide.severity];
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
      onDone:  () => { setSpeaking(false); setActiveStep(null); },
      onError: () => { setSpeaking(false); setActiveStep(null); },
    });
  }

  async function speakAll() {
    await Speech.stop();
    setSpeaking(true);
    const fullText = content.steps.map((s, i) => `Step ${i + 1}. ${s}`).join('. ');
    Speech.speak(fullText, {
      language: lang === 'fil' ? 'fil-PH' : 'en-US',
      onDone:  () => { setSpeaking(false); setActiveStep(null); },
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
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      {/* Header */}
      <View style={[s.header, { backgroundColor: '#B91C1C' }]}>
        <View style={s.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Text style={s.backText}>‹ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.langBtn} onPress={toggleLang}>
            <Text style={s.langBtnText}>
              {lang === 'en' ? '🇵🇭 FIL' : '🇺🇸 EN'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={s.headerBody}>
          <View style={[s.headerIcon, { backgroundColor: cat.bg }]}>
            <Text style={s.headerEmoji}>{cat.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>{guide.title}</Text>
            <Text style={s.headerCat}>{cat.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Severity + emergency */}
        <View style={s.badgeRow}>
          <View style={[s.sevBadge, { backgroundColor: sev.bg }]}>
            <View style={[s.sevDot, { backgroundColor: sev.dot }]} />
            <Text style={[s.sevText, { color: sev.color }]}>{sev.label}</Text>
          </View>
          {guide.callEmergency && (
            <View style={s.emergBadge}>
              <Text style={s.emergBadgeText}>🚨 Call 911 immediately</Text>
            </View>
          )}
        </View>

        {/* Overview */}
        <View style={s.overviewCard}>
          <Text style={s.overviewLabel}>Overview</Text>
          <Text style={s.overviewText}>{content.overview}</Text>
        </View>

        {/* TTS button */}
        <TouchableOpacity
          style={[s.ttsBtn, { backgroundColor: cat.accent }]}
          onPress={speaking ? stopSpeaking : speakAll}
        >
          <Text style={s.ttsBtnText}>
            {speaking ? '⏹  Stop reading' : '🔊  Read all steps aloud'}
          </Text>
        </TouchableOpacity>

        {/* Steps */}
        <Text style={s.stepsLabel}>Steps</Text>
        {content.steps.map((step, i) => (
          <TouchableOpacity
            key={i}
            style={[
              s.stepCard,
              activeStep === i && { borderColor: cat.accent, borderWidth: 1.5 }
            ]}
            onPress={() => activeStep === i ? stopSpeaking() : speakStep(step, i)}
            activeOpacity={0.85}
          >
            <View style={[s.stepNum, { backgroundColor: cat.bg }]}>
              <Text style={[s.stepNumText, { color: cat.accent }]}>{i + 1}</Text>
            </View>
            <Text style={s.stepText}>{step}</Text>
            <Text style={s.stepPlay}>{activeStep === i ? '🔊' : '▶'}</Text>
          </TouchableOpacity>
        ))}

        {/* Emergency box */}
        {guide.callEmergency && (
          <View style={s.emergBox}>
            <Text style={s.emergBoxTitle}>⚠️ Medical emergency</Text>
            <Text style={s.emergBoxText}>
              These steps are first aid only. Call 911 or your local emergency
              number immediately and do not delay professional care.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#B91C1C' },
  header:         { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  headerTop:      { flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 16 },
  backBtn:        {},
  backText:       { fontSize: 16, color: '#fff', fontWeight: '500' },
  langBtn:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.2)' },
  langBtnText:    { fontSize: 12, color: '#fff', fontWeight: '600' },
  headerBody:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon:     { width: 48, height: 48, borderRadius: 12,
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerEmoji:    { fontSize: 26 },
  headerTitle:    { fontSize: 17, fontWeight: '700', color: '#fff', lineHeight: 22 },
  headerCat:      { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  scroll:         { flex: 1, backgroundColor: '#F5F5F5',
                    borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  scrollContent:  { padding: 16, paddingBottom: 60 },
  badgeRow:       { flexDirection: 'row', gap: 8, marginBottom: 14 },
  sevBadge:       { flexDirection: 'row', alignItems: 'center', gap: 6,
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sevDot:         { width: 7, height: 7, borderRadius: 4 },
  sevText:        { fontSize: 12, fontWeight: '600' },
  emergBadge:     { backgroundColor: '#FEE2E2', paddingHorizontal: 12,
                    paddingVertical: 6, borderRadius: 20 },
  emergBadgeText: { fontSize: 12, color: '#991B1B', fontWeight: '600' },
  overviewCard:   { backgroundColor: '#fff', borderRadius: 14, padding: 14,
                    marginBottom: 14, borderWidth: 0.5, borderColor: '#F0F0F0' },
  overviewLabel:  { fontSize: 11, fontWeight: '600', color: '#888',
                    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  overviewText:   { fontSize: 13, color: '#444', lineHeight: 22 },
  ttsBtn:         { borderRadius: 12, paddingVertical: 13,
                    alignItems: 'center', marginBottom: 16 },
  ttsBtnText:     { color: '#fff', fontSize: 14, fontWeight: '600' },
  stepsLabel:     { fontSize: 11, fontWeight: '600', color: '#888',
                    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  stepCard:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12,
                    backgroundColor: '#fff', borderRadius: 12, padding: 13,
                    marginBottom: 8, borderWidth: 0.5, borderColor: '#F0F0F0' },
  stepNum:        { width: 30, height: 30, borderRadius: 8,
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText:    { fontSize: 14, fontWeight: '700' },
  stepText:       { flex: 1, fontSize: 13, color: '#333', lineHeight: 22 },
  stepPlay:       { fontSize: 15, color: '#CCC', flexShrink: 0, marginTop: 3 },
  emergBox:       { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14,
                    marginTop: 8, borderWidth: 1, borderColor: '#FECACA' },
  emergBoxTitle:  { fontSize: 14, fontWeight: '700', color: '#991B1B', marginBottom: 6 },
  emergBoxText:   { fontSize: 13, color: '#7F1D1D', lineHeight: 20 },
});