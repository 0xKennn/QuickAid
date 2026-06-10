import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Image
} from 'react-native';
import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';

export default function CaptureResultScreen({ route, navigation }) {
  const { photoUri, injuryType, severity, confidence } = route.params;

  const cat = CATEGORIES.find(c =>
    c.name.toLowerCase().includes(injuryType.toLowerCase())
  ) || CATEGORIES[0];

  const matchedGuide = GUIDES.find(g =>
    g.categoryId === cat.id && g.severity === severity
  );

  const sevConfig = {
    mild:     { label: 'Mild',     bg: '#DCFCE7', color: '#166534', dot: '#16A34A' },
    moderate: { label: 'Moderate', bg: '#FEF9C3', color: '#854D0E', dot: '#CA8A04' },
    severe:   { label: 'Severe',   bg: '#FEE2E2', color: '#991B1B', dot: '#DC2626' },
  }[severity] || { label: 'Unknown', bg: '#F5F5F5', color: '#666', dot: '#999' };

  const confidencePct = Math.round(confidence * 100);
  const confidenceColor = confidence >= 0.75
    ? '#16A34A' : confidence >= 0.6
    ? '#CA8A04' : '#DC2626';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.backText}>‹ Retake</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Analysis Result</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo + result card */}
        <View style={s.resultCard}>
          {photoUri && (
            <Image
              source={{ uri: photoUri }}
              style={s.photo}
              resizeMode="cover"
            />
          )}

          <View style={s.resultBody}>
            {/* Injury type */}
            <View style={s.injuryRow}>
              <View style={[s.injuryIcon, { backgroundColor: cat.bg }]}>
                <Text style={s.injuryEmoji}>{cat.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.injuryLabel}>Detected injury</Text>
                <Text style={s.injuryType}>{injuryType}</Text>
              </View>
            </View>

            {/* Badges */}
            <View style={s.badgeRow}>
              <View style={[s.sevBadge, { backgroundColor: sevConfig.bg }]}>
                <View style={[s.sevDot, { backgroundColor: sevConfig.dot }]} />
                <Text style={[s.sevText, { color: sevConfig.color }]}>
                  {sevConfig.label}
                </Text>
              </View>
            </View>

            {/* Confidence bar */}
            <View style={s.confSection}>
              <View style={s.confLabelRow}>
                <Text style={s.confLabel}>AI Confidence</Text>
                <Text style={[s.confPct, { color: confidenceColor }]}>
                  {confidencePct}%
                </Text>
              </View>
              <View style={s.confBarBg}>
                <View style={[s.confBarFill, {
                  width: `${confidencePct}%`,
                  backgroundColor: confidenceColor
                }]} />
              </View>
              {confidence < 0.6 && (
                <Text style={s.confWarning}>
                  ⚠️ Low confidence — consider retaking with better lighting.
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            ⚠️ This is an AI-generated assessment for guidance only.
            Always verify with a licensed medical professional.
          </Text>
        </View>

        {/* Matched guide */}
        {matchedGuide && (
          <>
            <Text style={s.sectionLabel}>Recommended first aid guide</Text>
            <TouchableOpacity
              style={[s.guideCard, { borderLeftColor: cat.accent }]}
              onPress={() => navigation.navigate('First Aid', {
                screen: 'GuideDetail',
                params: { guide: matchedGuide }
              })}
              activeOpacity={0.85}
            >
              <View style={[s.guideIcon, { backgroundColor: cat.bg }]}>
                <Text style={s.guideEmoji}>{cat.emoji}</Text>
              </View>
              <View style={s.guideBody}>
                <Text style={s.guideTitle}>{matchedGuide.title}</Text>
                <Text style={s.guideSub}>{cat.name}</Text>
                <Text style={[s.guideAction, { color: cat.accent }]}>
                  View step-by-step guide →
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.libraryBtn}
            onPress={() => navigation.navigate('First Aid')}
          >
            <Text style={s.libraryBtnText}>🩹  Browse First Aid Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.retakeBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={s.retakeBtnText}>📷  Take Another Photo</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#B91C1C' },
  header:        { backgroundColor: '#B91C1C', flexDirection: 'row',
                   alignItems: 'center', justifyContent: 'space-between',
                   paddingHorizontal: 20, paddingVertical: 14 },
  backText:      { fontSize: 16, color: '#fff', fontWeight: '500' },
  headerTitle:   { fontSize: 17, fontWeight: '700', color: '#fff' },
  scroll:        { flex: 1, backgroundColor: '#F5F5F5',
                   borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  scrollContent: { padding: 16, paddingBottom: 48 },
  resultCard:    { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
                   marginBottom: 12, borderWidth: 0.5, borderColor: '#F0F0F0' },
  photo:         { width: '100%', height: 180 },
  resultBody:    { padding: 16 },
  injuryRow:     { flexDirection: 'row', alignItems: 'center',
                   gap: 12, marginBottom: 12 },
  injuryIcon:    { width: 48, height: 48, borderRadius: 12,
                   alignItems: 'center', justifyContent: 'center' },
  injuryEmoji:   { fontSize: 26 },
  injuryLabel:   { fontSize: 11, color: '#888', fontWeight: '500',
                   textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  injuryType:    { fontSize: 18, fontWeight: '700', color: '#111' },
  badgeRow:      { flexDirection: 'row', gap: 8, marginBottom: 14 },
  sevBadge:      { flexDirection: 'row', alignItems: 'center', gap: 6,
                   paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  sevDot:        { width: 7, height: 7, borderRadius: 4 },
  sevText:       { fontSize: 12, fontWeight: '600' },
  confSection:   {},
  confLabelRow:  { flexDirection: 'row', justifyContent: 'space-between',
                   marginBottom: 6 },
  confLabel:     { fontSize: 12, color: '#888', fontWeight: '500' },
  confPct:       { fontSize: 13, fontWeight: '700' },
  confBarBg:     { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4,
                   overflow: 'hidden', marginBottom: 6 },
  confBarFill:   { height: '100%', borderRadius: 4 },
  confWarning:   { fontSize: 12, color: '#854D0E', marginTop: 4 },
  disclaimer:    { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12,
                   borderWidth: 0.5, borderColor: '#FDE68A', marginBottom: 16 },
  disclaimerText:{ fontSize: 12, color: '#92400E', lineHeight: 18, textAlign: 'center' },
  sectionLabel:  { fontSize: 11, fontWeight: '600', color: '#888',
                   textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  guideCard:     { backgroundColor: '#fff', borderRadius: 14, padding: 14,
                   borderLeftWidth: 3, borderWidth: 0.5, borderColor: '#F0F0F0',
                   flexDirection: 'row', gap: 12, marginBottom: 16 },
  guideIcon:     { width: 46, height: 46, borderRadius: 11,
                   alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  guideEmoji:    { fontSize: 24 },
  guideBody:     { flex: 1 },
  guideTitle:    { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  guideSub:      { fontSize: 12, color: '#888', marginBottom: 6 },
  guideAction:   { fontSize: 13, fontWeight: '600' },
  actions:       { gap: 10 },
  libraryBtn:    { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14,
                   alignItems: 'center', borderWidth: 0.5, borderColor: '#E0E0E0' },
  libraryBtnText:{ fontSize: 14, fontWeight: '600', color: '#111' },
  retakeBtn:     { backgroundColor: '#B91C1C', borderRadius: 12,
                   paddingVertical: 14, alignItems: 'center' },
  retakeBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});