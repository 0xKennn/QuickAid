import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Mic,
  MicOff,
  ChevronDown,
  Check,
  Languages,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { CATEGORIES, SEVERITY } from '../../data/categories';
import { matchCommand } from '../../services/voice';
import { useGuides } from '../../hooks/useGuides';

// Steps are plain translated text. Images live separately on
// guide.images[i] — one shared image per step index, same across
// every language, so it never needs to be duplicated per translation.
function stepText(step) {
  return typeof step === 'string' ? step : step.text;
}

const LANGUAGES = [
  { code: 'en',  label: 'English' },
  { code: 'fil', label: 'Filipino' },
  { code: 'ceb', label: 'Bisaya' },
];

// Android's on-device TTS/speech-recognition engines don't have a
// Cebuano voice or recognition locale — Bisaya falls back to the
// Filipino voice/recognizer, which at least reads/understands
// something close, rather than silently failing or defaulting to
// English pronunciation.
function speechLocale(lang) {
  return lang === 'en' ? 'en-US' : 'fil-PH';
}

export default function GuideDetailScreen({ route, navigation }) {
  const { guides }   = useGuides();
  const passedGuide  = route.params.guide;
  // Prefer the freshest synced copy if we have one; fall back to
  // whatever was passed in (bundled data, or pre-sync).
  const guide = guides.find(g => g.id === passedGuide.id) || passedGuide;

  const [lang, setLang]               = useState('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeStep, setActiveStep]   = useState(0);
  const [isListening, setIsListening] = useState(false); // reflects hands-free voice mode on/off
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const scrollRef                     = useRef(null);
  const activeStepRef                 = useRef(0);
  const stepYRef                      = useRef({}); // measured on-screen Y per step index

  // Hands-free voice mode refs
  const handsFreeRef        = useRef(false); // is voice mode toggled on
  const isSessionActiveRef  = useRef(false); // is a recognition session currently running
  const commandTranscriptRef = useRef('');
  const mountedRef           = useRef(true);

  const cat     = CATEGORIES.find(c => c.id === guide.categoryId);
  const sev     = SEVERITY[guide.severity];
  const content = guide.content[lang] || guide.content.en;
  const steps   = content.steps;

  // Keep ref in sync with state
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then(l => {
      if (l) setLang(l);
    });

    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      handsFreeRef.current = false;
      Speech.stop();
      ExpoSpeechRecognitionModule.stop();
    };
  }, []);

  // Starts one recognition session. Called on mic toggle, and re-called
  // automatically after each session ends, as long as voice mode is on.
  async function startListeningSession() {
    if (!handsFreeRef.current || !mountedRef.current) return;

    try {
      commandTranscriptRef.current = '';
      await ExpoSpeechRecognitionModule.start({
        lang: speechLocale(lang),
        interimResults: false,
        continuous: false,
        androidIntentOptions: {
          EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 1500,
          EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 1000,
          EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 1000,
        },
      });
      isSessionActiveRef.current = true;
    } catch (err) {
      console.log('Voice session start error:', err);
      isSessionActiveRef.current = false;
      // Retry shortly if voice mode is still on — a single failed session
      // (e.g. brief mic contention) shouldn't kill hands-free mode.
      if (handsFreeRef.current && mountedRef.current) {
        setTimeout(startListeningSession, 800);
      }
    }
  }

  // Speech recognition events
  useSpeechRecognitionEvent('result', (event) => {
    if (!isSessionActiveRef.current) return;
    const transcript = event.results?.[0]?.transcript || '';
    if (transcript) {
      commandTranscriptRef.current = transcript;
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (!isSessionActiveRef.current) {
      // Error before/without an active session (e.g. no speech detected) —
      // still worth retrying if hands-free mode is on.
      if (handsFreeRef.current && mountedRef.current) {
        setTimeout(startListeningSession, 800);
      }
      return;
    }
    console.log('Voice error:', event.error);
    isSessionActiveRef.current = false;

    if (handsFreeRef.current && mountedRef.current) {
      setTimeout(startListeningSession, 800);
    } else {
      setIsListening(false);
    }
  });

  useSpeechRecognitionEvent('end', () => {
    if (!isSessionActiveRef.current) return;
    isSessionActiveRef.current = false;

    const transcript = commandTranscriptRef.current;
    commandTranscriptRef.current = '';

    if (transcript) {
      console.log('Heard:', transcript);
      const command = matchCommand(transcript, lang);
      if (command) handleVoiceCommand(command);
    }

    // Auto-restart — this is what makes it hands-free instead of
    // one command per mic tap.
    if (handsFreeRef.current && mountedRef.current) {
      setTimeout(startListeningSession, 400);
    } else {
      setIsListening(false);
    }
  });

  function handleVoiceCommand(command) {
    const current = activeStepRef.current;
    switch (command) {
      case 'next':
        goToStep(Math.min(current + 1, steps.length - 1));
        break;
      case 'back':
        goToStep(Math.max(current - 1, 0));
        break;
      case 'repeat':
        readStep(current);
        break;
      case 'readAll':
        readAllSteps();
        break;
      case 'stop':
        readAllRef.current = false; // interrupts readAllSteps if in progress
        Speech.stop();
        setIsSpeaking(false);
        break;
      case 'help':
        Alert.alert(
          '🚨 Emergency',
          'Do you need to call emergency services?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Call 911', onPress: () => Linking.openURL('tel:911') },
          ]
        );
        break;
    }
  }

  function scrollToStep(index) {
    const y = stepYRef.current[index];
    scrollRef.current?.scrollTo({
      y: y !== undefined ? Math.max(y - 12, 0) : index * 110,
      animated: true,
    });
  }

  function goToStep(index) {
    setActiveStep(index);
    activeStepRef.current = index;
    readStep(index);
    scrollToStep(index);
  }

  async function readStep(index) {
    await Speech.stop();
    setIsSpeaking(true);
    Speech.speak(`Step ${index + 1}. ${stepText(steps[index])}`, {
      language: speechLocale(lang),
      rate: 0.9,
      onDone:  () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }

  // Reads every step in order, one after another, advancing the active
  // step and scroll position as it goes. Stops early if readAllRef is
  // cleared (e.g. by the "stop" voice command or a manual step tap).
  const readAllRef = useRef(false);

  async function readAllSteps() {
    await Speech.stop();
    readAllRef.current = true;
    setIsSpeaking(true);

    for (let i = 0; i < steps.length; i++) {
      if (!readAllRef.current || !mountedRef.current) break;

      setActiveStep(i);
      activeStepRef.current = i;
      scrollToStep(i);

      await new Promise((resolve) => {
        Speech.speak(`Step ${i + 1}. ${stepText(steps[i])}`, {
          language: speechLocale(lang),
          rate: 0.9,
          onDone:  resolve,
          onError: resolve,
        });
      });
    }

    readAllRef.current = false;
    setIsSpeaking(false);
  }

  // Toggles hands-free voice mode on/off — replaces the old
  // "tap mic, speak one command, mic turns off" behavior.
  async function toggleListening() {
    if (handsFreeRef.current) {
      handsFreeRef.current = false;
      setIsListening(false);
      isSessionActiveRef.current = false;
      await ExpoSpeechRecognitionModule.stop();
    } else {
      try {
        const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission required', 'Microphone access is needed for voice commands.');
          return;
        }
        handsFreeRef.current = true;
        setIsListening(true);
        await startListeningSession();
      } catch (err) {
        console.log('Voice start error:', err);
        handsFreeRef.current = false;
        setIsListening(false);
      }
    }
  }

  async function selectLang(code) {
    if (code === lang) {
      setLangMenuOpen(false);
      return;
    }
    await Speech.stop();
    setIsSpeaking(false);
    setLang(code);
    await AsyncStorage.setItem('appLanguage', code);
    setLangMenuOpen(false);
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F6" />

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerEmoji}>{cat.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle} numberOfLines={1}>{guide.title}</Text>
            <Text style={s.headerCat}>{cat.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.langBtn} onPress={() => setLangMenuOpen(true)}>
          <Languages size={18} color="#374151" />
          <ChevronDown size={14} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={langMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setLangMenuOpen(false)}
      >
        <TouchableOpacity
          style={s.menuBackdrop}
          activeOpacity={1}
          onPress={() => setLangMenuOpen(false)}
        >
          <View style={s.menuCard}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={s.menuItem}
                onPress={() => selectLang(l.code)}
              >
                <Text style={[s.menuItemText, l.code === lang && s.menuItemTextActive]}>
                  {l.label}
                </Text>
                {l.code === lang && <Check size={18} color="#5DBB9A" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badges */}
        <View style={s.badgeRow}>
          <View style={[s.sevBadge, { backgroundColor: sev.bg }]}>
            <Text style={[s.sevText, { color: sev.color }]}>● {sev.label}</Text>
          </View>
          {guide.callEmergency && (
            <View style={s.emergBadge}>
              <Text style={s.emergText}>🚨 Call 911</Text>
            </View>
          )}
        </View>

        {/* Overview */}
        <View style={s.overviewCard}>
          <Text style={s.overviewLabel}>Overview</Text>
          <Text style={s.overviewText}>{content.overview}</Text>
        </View>

        {/* Voice hint */}
        {isListening && (
          <View style={s.voiceHint}>
            <Text style={s.voiceHintText}>
              🎤 Voice mode on — say "next", "back", "repeat", "read all", or "call for help"
            </Text>
          </View>
        )}

        {/* Step counter */}
        <Text style={s.stepsLabel}>
          Step {activeStep + 1} of {steps.length}
        </Text>

        {/* Steps */}
        {steps.map((step, i) => (
          <TouchableOpacity
            key={i}
            style={[
              s.stepCard,
              i === activeStep && { borderColor: cat.accent, borderWidth: 2 },
              i < activeStep && s.stepDone,
            ]}
            onPress={() => goToStep(i)}
            onLayout={(e) => {
              stepYRef.current[i] = e.nativeEvent.layout.y;
            }}
            activeOpacity={0.85}
          >
            <View style={[
              s.stepNum,
              {
                backgroundColor:
                  i === activeStep ? cat.accent
                  : i < activeStep ? '#D1FAE5'
                  : cat.bg,
              },
            ]}>
              <Text style={[
                s.stepNumText,
                {
                  color:
                    i === activeStep ? '#fff'
                    : i < activeStep ? '#059669'
                    : cat.accent,
                },
              ]}>
                {i < activeStep ? '✓' : i + 1}
              </Text>
            </View>
            <View style={s.stepBody}>
              <Text style={[s.stepText, i < activeStep && { color: '#9CA3AF' }]}>
                {stepText(step)}
              </Text>
              {guide.images?.[i] && (
                <Image
                  source={{ uri: guide.images[i] }}
                  style={s.stepImage}
                  resizeMode="cover"
                />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Nav buttons */}
        <View style={s.navRow}>
          <TouchableOpacity
            style={[s.navBtn, activeStep === 0 && s.navBtnDisabled]}
            onPress={() => goToStep(Math.max(activeStep - 1, 0))}
            disabled={activeStep === 0}
          >
            <Text style={s.navBtnText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.navBtn,
              { backgroundColor: cat.accent, borderWidth: 0 },
              activeStep === steps.length - 1 && s.navBtnDisabled,
            ]}
            onPress={() => goToStep(Math.min(activeStep + 1, steps.length - 1))}
            disabled={activeStep === steps.length - 1}
          >
            <Text style={[s.navBtnText, { color: '#fff' }]}>Next →</Text>
          </TouchableOpacity>
        </View>

        {guide.callEmergency && (
          <View style={s.emergBox}>
            <Text style={s.emergBoxTitle}>⚠️ Medical emergency</Text>
            <Text style={s.emergBoxText}>
              These steps are first aid only. Call 911 immediately.
            </Text>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FLOATING VOICE CONTROL */}
      <View style={s.voiceControls}>
        <TouchableOpacity
          style={[s.voiceBtn, s.micBtn, isListening && s.micBtnActive]}
          onPress={toggleListening}
        >
          {isListening
            ? <MicOff size={22} color="#fff" />
            : <Mic size={22} color="#fff" />
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: '#F5F7F6' },
  header:         { flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', paddingHorizontal: 22,
                    paddingTop: 10, paddingBottom: 16 },
  backBtn:        { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff',
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
  headerCenter:   { flexDirection: 'row', alignItems: 'center', gap: 10,
                    flex: 1, marginHorizontal: 10 },
  headerEmoji:    { fontSize: 30, flexShrink: 0 },
  headerTitle:    { fontSize: 15, fontWeight: '700', color: '#111827' },
  headerCat:      { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  langBtn:        { flexDirection: 'row', alignItems: 'center', gap: 2,
                    height: 44, paddingHorizontal: 12, borderRadius: 22,
                    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
  menuBackdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)',
                    justifyContent: 'flex-start', alignItems: 'flex-end',
                    paddingTop: 80, paddingRight: 22 },
  menuCard:       { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 6,
                    minWidth: 160, elevation: 6, shadowColor: '#000',
                    shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  menuItem:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 12, paddingHorizontal: 16 },
  menuItemText:   { fontSize: 14, fontWeight: '500', color: '#374151' },
  menuItemTextActive: { color: '#111827', fontWeight: '700' },
  scroll:         { flex: 1 },
  scrollContent:  { padding: 20 },
  badgeRow:       { flexDirection: 'row', gap: 8, marginBottom: 14 },
  sevBadge:       { flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sevText:        { fontSize: 12, fontWeight: '600' },
  emergBadge:     { backgroundColor: '#FEE2E2', paddingHorizontal: 12,
                    paddingVertical: 6, borderRadius: 20 },
  emergText:      { fontSize: 12, color: '#991B1B', fontWeight: '600' },
  overviewCard:   { backgroundColor: '#fff', borderRadius: 20, padding: 16,
                    marginBottom: 20, elevation: 1 },
  overviewLabel:  { fontSize: 11, fontWeight: '700', color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  overviewText:   { fontSize: 14, color: '#374151', lineHeight: 22 },
  voiceHint:      { backgroundColor: '#EAF8F2', borderRadius: 12, padding: 12,
                    marginBottom: 14, borderWidth: 1, borderColor: '#A7F3D0' },
  voiceHintText:  { fontSize: 13, color: '#059669', fontWeight: '500' },
  stepsLabel:     { fontSize: 12, fontWeight: '700', color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  stepCard:       { flexDirection: 'row', alignItems: 'flex-start', gap: 14,
                    backgroundColor: '#fff', borderRadius: 16, padding: 14,
                    marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6', elevation: 1 },
  stepDone:       { opacity: 0.55 },
  stepNum:        { width: 32, height: 32, borderRadius: 10, alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0 },
  stepNumText:    { fontSize: 13, fontWeight: '800' },
  stepText:       { fontSize: 14, color: '#111827', lineHeight: 22 },
  stepBody:       { flex: 1 },
  stepImage:      { width: '100%', aspectRatio: 16 / 9, borderRadius: 12, marginTop: 10 },
  navRow:         { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 16 },
  navBtn:         { flex: 1, paddingVertical: 14, borderRadius: 16,
                    alignItems: 'center', backgroundColor: '#fff',
                    borderWidth: 1, borderColor: '#E5E7EB' },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText:     { fontSize: 14, fontWeight: '700', color: '#374151' },
  emergBox:       { backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16,
                    borderWidth: 1, borderColor: '#FECACA', marginBottom: 16 },
  emergBoxTitle:  { fontSize: 14, fontWeight: '700', color: '#991B1B', marginBottom: 6 },
  emergBoxText:   { fontSize: 13, color: '#7F1D1D', lineHeight: 20 },
  voiceControls:  { position: 'absolute', bottom: 100, right: 20,
                    flexDirection: 'column', gap: 12 },
  voiceBtn:       { width: 56, height: 56, borderRadius: 20, backgroundColor: '#fff',
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#E5E7EB', elevation: 4 },
  voiceBtnSpeaking: { backgroundColor: '#5DBB9A', borderColor: '#5DBB9A' },
  micBtn:         { backgroundColor: '#5DBB9A', borderColor: '#5DBB9A' },
  micBtnActive:   { backgroundColor: '#EF4444', borderColor: '#EF4444' },
});