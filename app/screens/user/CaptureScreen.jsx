import React, { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  Zap,
  Image as ImageIcon,
  Camera,
  Search,
} from 'lucide-react-native';

import { classifyImage } from '../../services/classifier';

const FLOATING_TAB_STYLE = {
  position: 'absolute',
  height: 78,
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0,
  paddingTop: 10,
  paddingBottom: 10,
  marginHorizontal: 16,
  marginBottom: 14,
  borderRadius: 28,
  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 10,
};

export default function CaptureScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [photo, setPhoto]         = useState(null);
  const [flash, setFlash]         = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    // Camera permission is handled by useCameraPermissions above.
    // Gallery picking still goes through expo-image-picker, so it
    // needs its own permission request.
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();

    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });

    return () => {
      parent?.setOptions({ tabBarStyle: FLOATING_TAB_STYLE });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  async function takePhoto() {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (result?.uri) setPhoto(result.uri);
    } catch (err) {
      Alert.alert('Camera error', err.message);
    }
  }

  async function pickFromGallery() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Gallery error', err.message);
    }
  }

  function retakePhoto() {
    setPhoto(null);
    setAnalyzing(false);
  }

  async function analyzePhoto() {
    if (!photo || analyzing) return;
    setAnalyzing(true);

    try {
      const result = await classifyImage(photo);

      if (result.isUnknown) {
        Alert.alert(
          'No injury recognized',
          `The image does not appear to contain a recognizable injury (${Math.round(result.confidence * 100)}% confidence). Please take a clearer photo of the affected area.`,
          [
            { text: 'Retake', onPress: retakePhoto },
            {
              text: 'Browse guides manually',
              onPress: () => navigation.navigate('First Aid'),
            },
          ]
        );
        return;
      }

      if (result.confidence < 0.75) {
        Alert.alert(
          'Low confidence result',
          `Detected ${result.injuryType} with ${Math.round(result.confidence * 100)}% confidence. Result may not be accurate.`,
          [
            { text: 'Retake', style: 'cancel', onPress: retakePhoto },
            {
              text: 'Continue',
              onPress: () => navigation.navigate('CaptureResult', {
                photoUri:   photo,
                injuryType: result.injuryType,
                severity:   result.severity,
                confidence: result.confidence,
                isNormal:   result.isNormal,
              }),
            },
          ]
        );
        return;
      }

      navigation.navigate('CaptureResult', {
        photoUri:   photo,
        injuryType: result.injuryType,
        severity:   result.severity,
        confidence: result.confidence,
        isNormal:   result.isNormal,
      });

    } catch (err) {
      Alert.alert(
        'Analysis failed',
        'Could not reach the AI server. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F6" />

      {/* HEADER */}
      <View
        style={[
          s.header,
          {
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <TouchableOpacity
          style={s.topBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <X size={24} color="#111827" />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Smart Capture</Text>
          <Text style={s.headerSub}>AI-powered injury detection</Text>
        </View>

        <TouchableOpacity
          style={s.topBtn}
          onPress={() => setFlash(f => !f)}
          activeOpacity={0.7}
        >
          <Zap size={21} color={flash ? '#63D3AE' : '#111827'} />
        </TouchableOpacity>
      </View>

      {/* CAMERA AREA */}
      <View style={s.cameraArea}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={s.preview}
            resizeMode="cover"
          />
        ) : permission?.granted ? (
          // Live camera preview — active as soon as the screen mounts,
          // no button press needed to "open" it.
          <CameraView
            ref={cameraRef}
            style={s.preview}
            facing="back"
            enableTorch={flash}
          >
            <LinearGradient
              colors={[
                'rgba(99,211,174,0.10)',
                'rgba(255,255,255,0)',
                'rgba(99,211,174,0.06)',
              ]}
              style={StyleSheet.absoluteFill}
            />
            <View style={s.placeholder} pointerEvents="none">
              <View style={s.scanFrame}>
                <View style={[s.corner, s.tl]} />
                <View style={[s.corner, s.tr]} />
                <View style={[s.corner, s.bl]} />
                <View style={[s.corner, s.br]} />
              </View>
              <Text style={s.frameHint}>
                Position injury within frame
              </Text>
            </View>
          </CameraView>
        ) : (
          // Permission not yet granted (or still loading)
          <View style={s.placeholder}>
            <Camera size={64} color="rgba(17,24,39,0.12)" />
            <Text style={s.frameHint}>
              {permission === null
                ? 'Checking camera permission...'
                : 'Camera access needed to scan injuries'}
            </Text>
            {permission?.granted === false && (
              <TouchableOpacity
                style={s.permissionBtn}
                onPress={requestPermission}
              >
                <Text style={s.permissionBtnText}>Grant Permission</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {analyzing && (
          <View style={s.analyzingOverlay}>
            <ActivityIndicator size="large" color="#63D3AE" />
            <Text style={s.analyzingText}>Analyzing injury...</Text>
            <Text style={s.analyzingSubText}>
              AI server is processing your image
            </Text>
          </View>
        )}
      </View>

      {/* CONTROLS */}
      <View style={s.controls}>
        {!photo ? (
          // Before photo — Gallery | Capture | (empty)
          <>
            <TouchableOpacity
              style={s.sideControl}
              onPress={pickFromGallery}
              activeOpacity={0.7}
            >
              <ImageIcon size={24} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity
              style={s.captureBtn}
              onPress={takePhoto}
              activeOpacity={0.8}
              disabled={!permission?.granted}
            >
              <View style={s.captureOuter}>
                <View style={s.captureInner} />
              </View>
            </TouchableOpacity>

            {/* Invisible spacer to keep capture centered */}
            <View style={s.sideControlInvisible} />
          </>
        ) : (
          // After photo — Retake | Analyze | (empty)
          <>
            <TouchableOpacity
              style={s.sideControl}
              onPress={retakePhoto}
              activeOpacity={0.7}
              disabled={analyzing}
            >
              <X size={22} color="#4B5563" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                s.analyzeBtn,
                analyzing && s.analyzeBtnDisabled,
              ]}
              onPress={analyzePhoto}
              activeOpacity={0.8}
              disabled={analyzing}
            >
              {analyzing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Search size={20} color="#fff" />
                  <Text style={s.analyzeBtnText}>Analyze</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={s.sideControlInvisible} />
          </>
        )}
      </View>

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
    paddingBottom: 16,
    backgroundColor: '#F5F7F6',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  topBtn: {
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
  cameraArea: {
    flex: 1,
    marginHorizontal: 18,
    marginBottom: 16,
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#DDEEE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  scanFrame: {
    position: 'absolute',
    width: 220,
    height: 220,
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#63D3AE',
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  frameHint: {
    position: 'absolute',
    bottom: 24,
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  permissionBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#63D3AE',
    borderRadius: 16,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  analyzingSubText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 34,
    paddingTop: 8,
    paddingBottom: 110,
    backgroundColor: '#F5F7F6',
  },
  sideControl: {
    width: 60,
    height: 60,
    borderRadius: 22,
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
  sideControlInvisible: {
    width: 60,
    height: 60,
  },
  captureBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(99,211,174,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(99,211,174,0.45)',
  },
  captureInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#63D3AE',
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 140,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#5DBB9A',
    shadowColor: '#5DBB9A',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  analyzeBtnDisabled: {
    backgroundColor: '#A0C4B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});