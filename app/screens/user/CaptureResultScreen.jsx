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
  ArrowLeft,
  Brain,
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle,
  AlertCircle,
  XCircle,
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
    isNormal,
  } = route.params;

  const cat =
    CATEGORIES.find(c =>
      c.name
        .toLowerCase()
        .includes(injuryType.toLowerCase())
    ) || CATEGORIES[0];

  const matchedGuide = GUIDES.find(
    g =>
      g.categoryId === cat.id &&
      g.severity === severity
  );

  const confidencePct = Math.round(confidence * 100);

  const sevConfig = {
    mild: {
      label: 'Mild',
      bg: '#DCFCE7',
      color: '#166534',
      dot: '#16A34A',
      Icon: CheckCircle,
    },
    moderate: {
      label: 'Moderate',
      bg: '#FEF9C3',
      color: '#854D0E',
      dot: '#CA8A04',
      Icon: AlertCircle,
    },
    severe: {
      label: 'Severe',
      bg: '#FEE2E2',
      color: '#991B1B',
      dot: '#DC2626',
      Icon: XCircle,
    },
  }[severity] || {
    label: 'Unknown',
    bg: '#F5F5F5',
    color: '#666',
    dot: '#999',
    Icon: AlertCircle,
  };

  const SevIcon = sevConfig.Icon;

  const confidenceColor =
    confidence >= 0.75
      ? '#16A34A'
      : confidence >= 0.6
      ? '#CA8A04'
      : '#DC2626';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F7F6"
      />

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Result</Text>
        <View style={{ width: 54 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* PHOTO */}
        {photoUri && (
          <View style={s.photoCard}>
            <Image
              source={{ uri: photoUri }}
              style={s.photo}
              resizeMode="cover"
            />
            <View style={s.photoOverlay}>
              <View style={s.aiTag}>
                <Brain size={12} color="#fff" />
                <Text style={s.aiTagText}>
                  AI Analysis
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* NO INJURY DETECTED */}
        {isNormal && (
          <View style={s.normalCard}>
            <Text style={s.normalEmoji}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.normalTitle}>
                No injury detected
              </Text>
              <Text style={s.normalSub}>
                Skin appears normal. If you are
                experiencing pain or discomfort,
                please consult a medical professional.
              </Text>
            </View>
          </View>
        )}

        {/* RESULT CARD */}
        <View style={s.resultCard}>

          {/* Injury type */}
          <View style={s.injuryRow}>
            <View
              style={[
                s.injuryIcon,
                { backgroundColor: cat.bg },
              ]}
            >
              <Text style={s.injuryEmoji}>
                {cat.emoji}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.injuryLabel}>
                Detected Injury
              </Text>
              <Text style={s.injuryType}>
                {injuryType}
              </Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Severity */}
          <View style={s.severityRow}>
            <Text style={s.fieldLabel}>
              Severity
            </Text>
            <View
              style={[
                s.sevBadge,
                { backgroundColor: sevConfig.bg },
              ]}
            >
              <SevIcon
                size={13}
                color={sevConfig.color}
              />
              <Text
                style={[
                  s.sevText,
                  { color: sevConfig.color },
                ]}
              >
                {sevConfig.label}
              </Text>
            </View>
          </View>

          <View style={s.divider} />

          {/* Confidence */}
          <View style={s.confSection}>
            <View style={s.confLabelRow}>
              <Text style={s.fieldLabel}>
                AI Confidence
              </Text>
              <Text
                style={[
                  s.confPct,
                  { color: confidenceColor },
                ]}
              >
                {confidencePct}%
              </Text>
            </View>
            <View style={s.confBarBg}>
              <View
                style={[
                  s.confBarFill,
                  {
                    width: `${confidencePct}%`,
                    backgroundColor: confidenceColor,
                  },
                ]}
              />
            </View>
            {confidence < 0.6 && (
              <View style={s.lowConfWarn}>
                <AlertTriangle
                  size={13}
                  color="#854D0E"
                />
                <Text style={s.lowConfText}>
                  Low confidence — try retaking
                  with better lighting.
                </Text>
              </View>
            )}
          </View>

        </View>

        {/* DISCLAIMER */}
        <View style={s.disclaimer}>
          <AlertTriangle size={16} color="#D97706" />
          <Text style={s.disclaimerText}>
            AI assessment is for guidance only.
            Always verify with a licensed
            medical professional.
          </Text>
        </View>

        {/* RECOMMENDED GUIDE — only if injury detected */}
        {!isNormal && matchedGuide && (
          <>
            <Text style={s.sectionLabel}>
              RECOMMENDED GUIDE
            </Text>
            <TouchableOpacity
              style={s.guideCard}
              onPress={() =>
                navigation.navigate('GuideDetail', { guide: matchedGuide })
              }
              activeOpacity={0.9}
            >
              <View
                style={[
                  s.guideIcon,
                  { backgroundColor: cat.bg },
                ]}
              >
                <Text style={s.guideEmoji}>
                  {cat.emoji}
                </Text>
              </View>
              <View style={s.guideBody}>
                <Text style={s.guideTitle}>
                  {matchedGuide.title}
                </Text>
                <Text style={s.guideSub}>
                  {cat.name}
                </Text>
              </View>
              <View style={s.guideArrow}>
                <BookOpen size={18} color="#5DBB9A" />
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* ACTIONS */}
        <Text style={s.sectionLabel}>ACTIONS</Text>
        <View style={s.actions}>
          <TouchableOpacity
            style={s.actionPrimary}
            onPress={() =>
              navigation.navigate('MainApp', {
                screen: 'First Aid',
              })
            }
            activeOpacity={0.9}
          >
            <BookOpen size={20} color="#fff" />
            <Text style={s.actionPrimaryText}>
              Browse First Aid Library
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.actionSecondary}
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
          >
            <Camera size={20} color="#374151" />
            <Text style={s.actionSecondaryText}>
              Take Another Photo
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
    backgroundColor: '#F5F7F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#F5F7F6',
  },
  backBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  photoCard: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
    height: 220,
    backgroundColor: '#DDEEE7',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  aiTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  normalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  normalEmoji: { fontSize: 28 },
  normalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  normalSub: {
    fontSize: 13,
    color: '#4B7A5C',
    lineHeight: 20,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  injuryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  injuryIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuryEmoji: { fontSize: 28 },
  injuryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  injuryType: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  sevBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sevText: {
    fontSize: 13,
    fontWeight: '700',
  },
  confSection: {},
  confLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  confPct: {
    fontSize: 14,
    fontWeight: '800',
  },
  confBarBg: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  confBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  lowConfWarn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#FEF9C3',
    borderRadius: 10,
    padding: 10,
  },
  lowConfText: {
    flex: 1,
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 18,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF8E7',
    borderRadius: 22,
    padding: 16,
    marginBottom: 22,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#A16207',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F7B76',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 2,
  },
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  guideIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideEmoji: { fontSize: 26 },
  guideBody: { flex: 1 },
  guideTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  guideSub: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  guideArrow: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#EAF8F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  actionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#5DBB9A',
    borderRadius: 22,
    paddingVertical: 18,
    shadowColor: '#5DBB9A',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  actionPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  actionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  actionSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
});