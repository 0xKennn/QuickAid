import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CaptureScreen({ navigation }) {
  const [photo, setPhoto]       = useState(null);
  const [flash, setFlash]       = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Camera permission required',
        'Please allow camera access in your device settings to use Smart Capture.',
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function pickFromGallery() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Gallery permission required',
        'Please allow photo library access to select an image.',
        [{ text: 'OK' }]
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  function retakePhoto() {
    setPhoto(null);
    setAnalyzing(false);
  }

  function analyzePhoto() {
    if (!photo) return;
    setAnalyzing(true);

    // Simulate ML analysis delay — replace with real TFLite in Phase 3
    setTimeout(() => {
      setAnalyzing(false);
      // Navigate to result screen with mock data for now
      navigation.navigate('CaptureResult', {
        photoUri:   photo,
        injuryType: 'Burns',
        severity:   'mild',
        confidence: 0.87,
      });
    }, 2500);
  }

  const INJURY_TYPES = [
    { emoji: '🔥', label: 'Burns',     bg: '#FFF0E0' },
    { emoji: '🩸', label: 'Cuts',      bg: '#FFE8E8' },
    { emoji: '🦴', label: 'Fractures', bg: '#EEF2FF' },
    { emoji: '💉', label: 'Bleeding',  bg: '#FFF1F2' },
    { emoji: '🦵', label: 'Sprains',   bg: '#F0F9FF' },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Smart Capture</Text>
          <Text style={s.headerSub}>AI-powered injury detection</Text>
        </View>
        <TouchableOpacity
          style={s.flashBtn}
          onPress={() => setFlash(f => !f)}
        >
          <Text style={s.flashIcon}>{flash ? '⚡' : '🔦'}</Text>
        </TouchableOpacity>
      </View>

      {/* Camera / Preview area */}
      <View style={s.cameraArea}>
        {photo ? (
          // Photo preview
          <Image source={{ uri: photo }} style={s.preview} resizeMode="cover" />
        ) : (
          // Camera placeholder with scan frame
          <View style={s.placeholder}>
            <Text style={s.placeholderIcon}>📷</Text>
            <Text style={s.placeholderText}>Camera preview</Text>

            {/* Scan frame corners */}
            <View style={s.scanFrame}>
              <View style={[s.corner, s.tl]} />
              <View style={[s.corner, s.tr]} />
              <View style={[s.corner, s.bl]} />
              <View style={[s.corner, s.br]} />
            </View>

            <Text style={s.frameHint}>Position injury within frame</Text>
          </View>
        )}
      </View>

      {/* Bottom panel */}
      <View style={s.bottomPanel}>

        {/* Tip */}
        {!photo && (
          <View style={s.tipRow}>
            <Text style={s.tipIcon}>💡</Text>
            <Text style={s.tipText}>
              Ensure good lighting and keep the injury clearly visible
              within the frame for best results.
            </Text>
          </View>
        )}

        {/* Action buttons */}
        {!photo ? (
          <View style={s.btnRow}>
            <TouchableOpacity style={s.sideBtn} onPress={pickFromGallery}>
              <Text style={s.sideBtnIcon}>🖼️</Text>
              <Text style={s.sideBtnText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.captureBtn} onPress={takePhoto}>
              <View style={s.captureBtnInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.sideBtn}
              onPress={() => setFlash(f => !f)}
            >
              <Text style={s.sideBtnIcon}>{flash ? '⚡' : '🔦'}</Text>
              <Text style={s.sideBtnText}>Flash</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Analyze / retake buttons
          <View style={s.analyzeRow}>
            <TouchableOpacity style={s.retakeBtn} onPress={retakePhoto}>
              <Text style={s.retakeBtnText}>🔄  Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.analyzeBtn, analyzing && { opacity: 0.7 }]}
              onPress={analyzePhoto}
              disabled={analyzing}
            >
              <Text style={s.analyzeBtnText}>
                {analyzing ? '🔍  Analyzing...' : '🔍  Analyze Injury'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Detectable injury types */}
        <Text style={s.typesLabel}>Detectable injury types</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.typesList}
        >
          {INJURY_TYPES.map((t, i) => (
            <View key={i} style={s.typeChip}>
              <View style={[s.typeIcon, { backgroundColor: t.bg + '30' }]}>
                <Text style={s.typeEmoji}>{t.emoji}</Text>
              </View>
              <Text style={s.typeLabel}>{t.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            ⚠️ AI assessment is for guidance only — always verify with a medical professional.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#000' },
  header:           { backgroundColor: '#000', flexDirection: 'row',
                      alignItems: 'center', justifyContent: 'space-between',
                      paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle:      { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub:        { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  flashBtn:         { width: 38, height: 38, borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      alignItems: 'center', justifyContent: 'center' },
  flashIcon:        { fontSize: 18 },
  cameraArea:       { height: 260, backgroundColor: '#1A1A1A',
                      position: 'relative', overflow: 'hidden' },
  placeholder:      { flex: 1, alignItems: 'center', justifyContent: 'center',
                      position: 'relative' },
  placeholderIcon:  { fontSize: 44, opacity: 0.3, marginBottom: 8 },
  placeholderText:  { fontSize: 13, color: 'rgba(255,255,255,0.3)' },
  scanFrame:        { position: 'absolute', width: 170, height: 170,
                      top: '50%', left: '50%',
                      marginTop: -85, marginLeft: -85 },
  corner:           { position: 'absolute', width: 26, height: 26,
                      borderColor: '#B91C1C', borderStyle: 'solid' },
  tl:               { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3,
                      borderTopLeftRadius: 4 },
  tr:               { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3,
                      borderTopRightRadius: 4 },
  bl:               { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3,
                      borderBottomLeftRadius: 4 },
  br:               { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3,
                      borderBottomRightRadius: 4 },
  frameHint:        { position: 'absolute', bottom: 16, fontSize: 11,
                      color: 'rgba(255,255,255,0.5)' },
  preview:          { width: '100%', height: '100%' },
  bottomPanel:      { flex: 1, backgroundColor: '#111',
                      paddingHorizontal: 16, paddingTop: 16 },
  tipRow:           { flexDirection: 'row', alignItems: 'flex-start', gap: 8,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderRadius: 10, padding: 12, marginBottom: 16 },
  tipIcon:          { fontSize: 15 },
  tipText:          { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.55)',
                      lineHeight: 18 },
  btnRow:           { flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'center', gap: 20, marginBottom: 20 },
  sideBtn:          { alignItems: 'center', gap: 4, flex: 1,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderRadius: 12, paddingVertical: 12 },
  sideBtnIcon:      { fontSize: 22 },
  sideBtnText:      { fontSize: 12, color: '#fff', fontWeight: '500' },
  captureBtn:       { width: 70, height: 70, borderRadius: 35,
                      backgroundColor: '#B91C1C', alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 3, borderColor: 'rgba(255,255,255,0.25)' },
  captureBtnInner:  { width: 54, height: 54, borderRadius: 27,
                      backgroundColor: '#fff', opacity: 0.9 },
  analyzeRow:       { flexDirection: 'row', gap: 10, marginBottom: 20 },
  retakeBtn:        { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 12, paddingVertical: 14,
                      alignItems: 'center' },
  retakeBtnText:    { fontSize: 14, color: '#fff', fontWeight: '500' },
  analyzeBtn:       { flex: 2, backgroundColor: '#B91C1C', borderRadius: 12,
                      paddingVertical: 14, alignItems: 'center' },
  analyzeBtnText:   { fontSize: 14, color: '#fff', fontWeight: '700' },
  typesLabel:       { fontSize: 10, color: 'rgba(255,255,255,0.4)',
                      textTransform: 'uppercase', letterSpacing: 0.6,
                      marginBottom: 10 },
  typesList:        { gap: 10, paddingBottom: 4 },
  typeChip:         { alignItems: 'center', gap: 5 },
  typeIcon:         { width: 42, height: 42, borderRadius: 10,
                      alignItems: 'center', justifyContent: 'center' },
  typeEmoji:        { fontSize: 20 },
  typeLabel:        { fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  disclaimer:       { marginTop: 12, backgroundColor: 'rgba(255,251,235,0.08)',
                      borderRadius: 10, padding: 10 },
  disclaimerText:   { fontSize: 11, color: 'rgba(255,200,100,0.7)',
                      textAlign: 'center', lineHeight: 16 },
});