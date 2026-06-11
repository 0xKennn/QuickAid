import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';

import {
  ChevronLeft,
  ShieldCheck,
  Brain,
  RotateCcw,
  Sparkles,
  Activity,
} from 'lucide-react-native';

import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';

export default function CaptureResultScreen({
  route,
  navigation,
}) {

  const {
    photoUri,
    injuryType,
    severity,
    confidence,
  } = route.params;

  const cat =
    CATEGORIES.find(c =>
      c.name
        .toLowerCase()
        .includes(
          injuryType.toLowerCase()
        )
    ) || CATEGORIES[0];

  const matchedGuide =
    GUIDES.find(g =>
      g.categoryId === cat.id &&
      g.severity === severity
    );

  const confidencePct =
    Math.round(confidence * 100);

  const severityConfig = {
    mild: {
      label: 'Mild',
      bg: '#123328',
      text: '#7BE0B8',
    },

    moderate: {
      label: 'Moderate',
      bg: '#2F2B16',
      text: '#F4D35E',
    },

    severe: {
      label: 'Severe',
      bg: '#3A1D1D',
      text: '#FF8A8A',
    },
  };

  const sev =
    severityConfig[severity] ||
    severityConfig.mild;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B0F0E"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        {/* HEADER */}
        <View style={s.header}>

          <TouchableOpacity
            style={s.headerBtn}
            onPress={() =>
              navigation.goBack()
            }
          >
            <ChevronLeft
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={s.title}>
              Analysis Result
            </Text>

            <Text style={s.subtitle}>
              AI-powered injury assessment
            </Text>
          </View>

          <View style={s.aiBadge}>
            <Brain
              size={18}
              color="#8FE3C1"
            />
          </View>

        </View>

        {/* IMAGE */}
        <View style={s.imageCard}>

          <Image
            source={{ uri: photoUri }}
            style={s.image}
            resizeMode="cover"
          />

        </View>

        {/* RESULT CARD */}
        <View style={s.resultCard}>

          <View style={s.resultTop}>

            <View>

              <Text style={s.label}>
                DETECTED CONDITION
              </Text>

              <Text style={s.injuryText}>
                {injuryType}
              </Text>

            </View>

            <View
              style={[
                s.severityBadge,
                {
                  backgroundColor:
                    sev.bg,
                },
              ]}
            >
              <Activity
                size={14}
                color={sev.text}
              />

              <Text
                style={[
                  s.severityText,
                  {
                    color: sev.text,
                  },
                ]}
              >
                {sev.label}
              </Text>

            </View>

          </View>

          {/* CONFIDENCE */}
          <View style={s.confidenceSection}>

            <View style={s.confidenceRow}>
              <Text style={s.confidenceLabel}>
                AI Confidence
              </Text>

              <Text style={s.confidenceValue}>
                {confidencePct}%
              </Text>
            </View>

            <View style={s.progressBg}>
              <View
                style={[
                  s.progressFill,
                  {
                    width:
                      `${confidencePct}%`,
                  },
                ]}
              />
            </View>

          </View>

        </View>

        {/* DISCLAIMER */}
        <View style={s.noticeCard}>

          <ShieldCheck
            size={18}
            color="#79D8B2"
          />

          <Text style={s.noticeText}>
            This AI assessment is for
            guidance purposes only.
            Always verify with a
            licensed medical
            professional.
          </Text>

        </View>

        {/* GUIDE */}
        {matchedGuide && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={s.guideCard}
            onPress={() =>
              navigation.navigate(
                'First Aid',
                {
                  screen:
                    'GuideDetail',
                  params: {
                    guide:
                      matchedGuide,
                  },
                }
              )
            }
          >

            <View style={s.guideIcon}>
              <Sparkles
                size={18}
                color="#8FE3C1"
              />
            </View>

            <View style={{ flex: 1 }}>

              <Text style={s.guideLabel}>
                RECOMMENDED GUIDE
              </Text>

              <Text style={s.guideTitle}>
                {matchedGuide.title}
              </Text>

              <Text style={s.guideAction}>
                View treatment steps
              </Text>

            </View>

          </TouchableOpacity>
        )}

        {/* ACTIONS */}
        <View style={s.actions}>

          {/* RETAKE */}
          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={() =>
              navigation.goBack()
            }
          >

            <RotateCcw
              size={18}
              color="#D7E4DD"
            />

            <Text style={s.secondaryText}>
              Retake
            </Text>

          </TouchableOpacity>

          {/* ANALYZE AGAIN */}
          <TouchableOpacity
            style={s.primaryBtn}
          >

            <Sparkles
              size={18}
              color="#FFFFFF"
            />

            <Text style={s.primaryText}>
              Analyze
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#0B0F0E',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
  },

  headerBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  title: {
    color: '#FFFFFF',

    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: '#7D8B86',

    fontSize: 14,

    marginTop: 2,
  },

  aiBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,

    backgroundColor:
      'rgba(143,227,193,0.08)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  imageCard: {
    marginHorizontal: 20,

    borderRadius: 28,

    overflow: 'hidden',

    backgroundColor: '#111614',
  },

  image: {
    width: '100%',
    height: 340,
  },

  resultCard: {
    marginTop: 18,
    marginHorizontal: 20,

    backgroundColor: '#111614',

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.04)',
  },

  resultTop: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',

    marginBottom: 20,
  },

  label: {
    color: '#6F817A',

    fontSize: 11,
    fontWeight: '700',

    letterSpacing: 1.2,
  },

  injuryText: {
    color: '#FFFFFF',

    fontSize: 24,
    fontWeight: '800',

    marginTop: 6,
  },

  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    gap: 8,
  },

  severityText: {
    fontWeight: '700',
    fontSize: 13,
  },

  confidenceSection: {
    marginTop: 6,
  },

  confidenceRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',

    marginBottom: 10,
  },

  confidenceLabel: {
    color: '#8D9B96',

    fontSize: 14,
  },

  confidenceValue: {
    color: '#8FE3C1',

    fontWeight: '800',

    fontSize: 15,
  },

  progressBg: {
    height: 10,

    backgroundColor:
      'rgba(255,255,255,0.06)',

    borderRadius: 999,

    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',

    backgroundColor: '#63C9A3',

    borderRadius: 999,
  },

  noticeCard: {
    marginTop: 18,
    marginHorizontal: 20,

    backgroundColor:
      'rgba(143,227,193,0.06)',

    borderRadius: 20,

    padding: 18,

    flexDirection: 'row',

    gap: 12,
  },

  noticeText: {
    flex: 1,

    color: '#AAB7B2',

    fontSize: 13,

    lineHeight: 22,
  },

  guideCard: {
    marginTop: 18,
    marginHorizontal: 20,

    backgroundColor: '#111614',

    borderRadius: 24,

    padding: 18,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 14,
  },

  guideIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,

    backgroundColor:
      'rgba(143,227,193,0.08)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  guideLabel: {
    color: '#72827C',

    fontSize: 11,
    fontWeight: '700',

    letterSpacing: 1,
  },

  guideTitle: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '700',

    marginTop: 4,
  },

  guideAction: {
    color: '#8FE3C1',

    fontSize: 13,

    marginTop: 6,
  },

  actions: {
    flexDirection: 'row',

    gap: 12,

    marginTop: 26,
    marginHorizontal: 20,
  },

  secondaryBtn: {
    flex: 1,

    height: 58,

    borderRadius: 18,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,
  },

  secondaryText: {
    color: '#D7E4DD',

    fontWeight: '700',

    fontSize: 15,
  },

  primaryBtn: {
    flex: 1,

    height: 58,

    borderRadius: 18,

    backgroundColor: '#5DBB9A',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,
  },

  primaryText: {
    color: '#FFFFFF',

    fontWeight: '800',

    fontSize: 15,
  },

});