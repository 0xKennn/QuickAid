import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import * as Speech from 'expo-speech';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CATEGORIES,
  SEVERITY,
} from '../../data/categories';

export default function GuideDetailScreen({
  route,
  navigation,
}) {
  const { guide } = route.params;

  const [lang, setLang] =
    useState('en');

  const [speaking, setSpeaking] =
    useState(false);

  const [activeStep, setActiveStep] =
    useState(null);

  const cat = CATEGORIES.find(
    c => c.id === guide.categoryId
  );

  const sev =
    SEVERITY[guide.severity];

  const content =
    guide.content[lang] ||
    guide.content.en;

  useEffect(() => {
    AsyncStorage.getItem(
      'appLanguage'
    ).then(l => {
      if (l) setLang(l);
    });

    return () => {
      Speech.stop();
    };
  }, []);

  async function speakStep(
    step,
    index
  ) {
    await Speech.stop();

    setSpeaking(true);
    setActiveStep(index);

    Speech.speak(
      `Step ${index + 1}. ${step}`,
      {
        language:
          lang === 'fil'
            ? 'fil-PH'
            : 'en-US',

        onDone: () => {
          setSpeaking(false);
          setActiveStep(null);
        },

        onError: () => {
          setSpeaking(false);
          setActiveStep(null);
        },
      }
    );
  }

  async function speakAll() {
    await Speech.stop();

    setSpeaking(true);

    const fullText =
      content.steps
        .map(
          (s, i) =>
            `Step ${
              i + 1
            }. ${s}`
        )
        .join('. ');

    Speech.speak(fullText, {
      language:
        lang === 'fil'
          ? 'fil-PH'
          : 'en-US',

      onDone: () => {
        setSpeaking(false);
        setActiveStep(null);
      },

      onError: () => {
        setSpeaking(false);
        setActiveStep(null);
      },
    });
  }

  async function stopSpeaking() {
    await Speech.stop();

    setSpeaking(false);
    setActiveStep(null);
  }

  async function toggleLang() {
    const next =
      lang === 'en'
        ? 'fil'
        : 'en';

    await Speech.stop();

    setSpeaking(false);
    setActiveStep(null);

    setLang(next);

    await AsyncStorage.setItem(
      'appLanguage',
      next
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7FAF9"
      />

      {/* HEADER */}
      <View style={s.header}>

        <View style={s.headerTop}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={s.backBtn}
          >
            <Text style={s.backText}>
              ‹ Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.langBtn}
            onPress={toggleLang}
          >
            <Text style={s.langBtnText}>
              {lang === 'en'
                ? '🇵🇭 FIL'
                : '🇺🇸 EN'}
            </Text>
          </TouchableOpacity>

        </View>

        <View style={s.headerBody}>

          <View
            style={[
              s.headerIcon,
              {
                backgroundColor:
                  cat.bg,
              },
            ]}
          >
            <Text style={s.headerEmoji}>
              {cat.emoji}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>
              {guide.title}
            </Text>

            <Text style={s.headerCat}>
              {cat.name}
            </Text>
          </View>

        </View>

      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={
          s.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* BADGES */}
        <View style={s.badgeRow}>

          <View
            style={[
              s.sevBadge,
              {
                backgroundColor:
                  sev.bg,
              },
            ]}
          >
            <View
              style={[
                s.sevDot,
                {
                  backgroundColor:
                    sev.dot,
                },
              ]}
            />

            <Text
              style={[
                s.sevText,
                {
                  color:
                    sev.color,
                },
              ]}
            >
              {sev.label}
            </Text>
          </View>

          {guide.callEmergency && (
            <View style={s.emergBadge}>
              <Text
                style={
                  s.emergBadgeText
                }
              >
                🚨 Call 911
              </Text>
            </View>
          )}

        </View>

        {/* OVERVIEW */}
        <View style={s.overviewCard}>

          <Text style={s.overviewLabel}>
            Overview
          </Text>

          <Text style={s.overviewText}>
            {content.overview}
          </Text>

        </View>

        {/* TTS BUTTON */}
        <TouchableOpacity
          style={[
            s.ttsBtn,
            {
              backgroundColor:
                cat.accent,
            },
          ]}
          onPress={
            speaking
              ? stopSpeaking
              : speakAll
          }
        >
          <Text style={s.ttsBtnText}>
            {speaking
              ? '⏹ Stop reading'
              : '🔊 Read all steps aloud'}
          </Text>
        </TouchableOpacity>

        {/* STEPS */}
        <Text style={s.stepsLabel}>
          Steps
        </Text>

        {content.steps.map(
          (step, i) => (
            <TouchableOpacity
              key={i}
              style={[
                s.stepCard,

                activeStep === i && {
                  borderColor:
                    cat.accent,

                  borderWidth: 1.5,
                },
              ]}
              onPress={() =>
                activeStep === i
                  ? stopSpeaking()
                  : speakStep(
                      step,
                      i
                    )
              }
              activeOpacity={0.9}
            >

              <View
                style={[
                  s.stepNum,
                  {
                    backgroundColor:
                      cat.bg,
                  },
                ]}
              >
                <Text
                  style={[
                    s.stepNumText,
                    {
                      color:
                        cat.accent,
                    },
                  ]}
                >
                  {i + 1}
                </Text>
              </View>

              <Text style={s.stepText}>
                {step}
              </Text>

              <Text style={s.stepPlay}>
                {activeStep === i
                  ? '🔊'
                  : '▶'}
              </Text>

            </TouchableOpacity>
          )
        )}

        {/* EMERGENCY */}
        {guide.callEmergency && (
          <View style={s.emergBox}>

            <Text style={s.emergBoxTitle}>
              ⚠️ Medical emergency
            </Text>

            <Text style={s.emergBoxText}>
              These steps are
              first aid only.
              Contact emergency
              responders immediately
              and do not delay
              professional care.
            </Text>

          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#F7FAF9',
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 22,

    backgroundColor: '#F7FAF9',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent:
      'space-between',

    alignItems: 'center',

    marginBottom: 22,
  },

  backBtn: {
    backgroundColor: '#FFFFFF',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  backText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },

  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  langBtnText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
  },

  headerBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,
  },

  headerEmoji: {
    fontSize: 30,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',

    lineHeight: 28,
  },

  headerCat: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  scroll: {
    flex: 1,
    backgroundColor: '#F7FAF9',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,

    marginBottom: 18,
  },

  sevBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 20,
  },

  sevDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  sevText: {
    fontSize: 12,
    fontWeight: '700',
  },

  emergBadge: {
    backgroundColor: '#FEE2E2',

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 20,
  },

  emergBadgeText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '700',
  },

  overviewCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 18,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#EEF2F7',

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  overviewLabel: {
    fontSize: 11,
    fontWeight: '700',

    color: '#6B7280',

    textTransform: 'uppercase',
    letterSpacing: 1,

    marginBottom: 8,
  },

  overviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 24,
  },

  ttsBtn: {
    borderRadius: 18,

    paddingVertical: 15,

    alignItems: 'center',

    marginBottom: 22,
  },

  ttsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  stepsLabel: {
    fontSize: 11,
    fontWeight: '700',

    color: '#6B7280',

    textTransform: 'uppercase',
    letterSpacing: 1,

    marginBottom: 12,
  },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 16,

    marginBottom: 10,

    borderWidth: 1,
    borderColor: '#EEF2F7',

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  stepNum: {
    width: 34,
    height: 34,
    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    flexShrink: 0,
  },

  stepNumText: {
    fontSize: 15,
    fontWeight: '800',
  },

  stepText: {
    flex: 1,

    fontSize: 14,
    color: '#374151',

    lineHeight: 24,
  },

  stepPlay: {
    fontSize: 16,
    color: '#9CA3AF',

    marginTop: 3,
  },

  emergBox: {
    backgroundColor: '#FEF2F2',

    borderRadius: 22,

    padding: 18,

    marginTop: 12,

    borderWidth: 1,
    borderColor: '#FECACA',
  },

  emergBoxTitle: {
    fontSize: 15,
    fontWeight: '800',

    color: '#991B1B',

    marginBottom: 8,
  },

  emergBoxText: {
    fontSize: 14,
    color: '#7F1D1D',

    lineHeight: 22,
  },
});