import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { LinearGradient } from 'expo-linear-gradient';

import {
  X,
  Zap,
  Image as ImageIcon,
  Camera,
} from 'lucide-react-native';

export default function CaptureScreen({
  navigation,
}) {

  const [photo, setPhoto] = useState(null);

  const [flash, setFlash] =
    useState(false);

  /* HIDE TAB BAR */
  useEffect(() => {

    const parent =
      navigation.getParent();

    parent?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 84,
          borderTopWidth: 0,
          elevation: 10,
        },
      });
    };

  }, [navigation]);

  async function takePhoto() {

    const perm =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!perm.granted) {

      Alert.alert(
        'Permission required',
        'Camera access is needed.'
      );

      return;
    }

    const result =
      await ImagePicker.launchCameraAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 0.8,
      });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function pickFromGallery() {

    const perm =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {

      Alert.alert(
        'Permission required',
        'Gallery access is needed.'
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality: 0.8,
      });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  return (

    <SafeAreaView style={s.safe}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F5F7F6"
      />

      {/* HEADER */}
      <View style={s.header}>

        <TouchableOpacity
          style={s.topBtn}
          onPress={() => navigation.goBack()}
        >
          <X
            size={24}
            color="#111827"
          />
        </TouchableOpacity>

        <Text style={s.headerTitle}>
          Smart Capture
        </Text>

        <TouchableOpacity
          style={s.topBtn}
          onPress={() => setFlash(!flash)}
        >
          <Zap
            size={21}
            color={
              flash
                ? '#63D3AE'
                : '#111827'
            }
          />
        </TouchableOpacity>

      </View>

      {/* CAMERA AREA */}
      <View style={s.cameraArea}>

        {/* OVERLAY */}
        <LinearGradient
          colors={[
            'rgba(99,211,174,0.10)',
            'rgba(255,255,255,0)',
            'rgba(99,211,174,0.06)',
          ]}
          style={StyleSheet.absoluteFill}
        />

        {photo ? (

          <Image
            source={{ uri: photo }}
            style={s.preview}
          />

        ) : (

          <View style={s.placeholder}>

            <Camera
              size={78}
              color="rgba(17,24,39,0.10)"
            />

            {/* SCAN FRAME */}
            <View style={s.scanFrame}>

              <View
                style={[s.corner, s.tl]}
              />

              <View
                style={[s.corner, s.tr]}
              />

              <View
                style={[s.corner, s.bl]}
              />

              <View
                style={[s.corner, s.br]}
              />

            </View>

            <Text style={s.frameHint}>
              Position injury within frame
            </Text>

          </View>
        )}

      </View>

      {/* CONTROLS */}
      <View style={s.controls}>

        {/* GALLERY */}
        <TouchableOpacity
          style={s.sideControl}
          onPress={pickFromGallery}
        >
          <ImageIcon
            size={24}
            color="#4B5563"
          />
        </TouchableOpacity>

        {/* CAPTURE */}
        <TouchableOpacity
          style={s.captureBtn}
          onPress={takePhoto}
          activeOpacity={0.9}
        >
          <View style={s.captureOuter}>
            <View style={s.captureInner} />
          </View>
        </TouchableOpacity>

        {/* EMPTY RIGHT */}
        <View style={s.sideControl}/>
        
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
    paddingTop: 10,
    paddingBottom: 16,

    backgroundColor: '#F5F7F6',
  },

  headerTitle: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  cameraArea: {
    flex: 0.88,
    

    marginHorizontal: 18,
    marginBottom: 18,

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
    width: 250,
    height: 250,
  },

  corner: {
    position: 'absolute',

    width: 42,
    height: 42,

    borderColor: '#63D3AE',
  },

  tl: {
    top: 0,
    left: 0,

    borderTopWidth: 5,
    borderLeftWidth: 5,

    borderTopLeftRadius: 14,
  },

  tr: {
    top: 0,
    right: 0,

    borderTopWidth: 5,
    borderRightWidth: 5,

    borderTopRightRadius: 14,
  },

  bl: {
    bottom: 0,
    left: 0,

    borderBottomWidth: 5,
    borderLeftWidth: 5,

    borderBottomLeftRadius: 14,
  },

  br: {
    bottom: 0,
    right: 0,

    borderBottomWidth: 5,
    borderRightWidth: 5,

    borderBottomRightRadius: 14,
  },

  frameHint: {
    position: 'absolute',
    bottom: 140,

    color: '#6B7280',

    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  controls: {
    position: 'absolute',
  
    bottom: 110,
  
    left: 0,
    right: 0,
  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  
    paddingHorizontal: 34,
    paddingTop: 8,
  
    zIndex: 999,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  captureBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,

    backgroundColor:
      'rgba(99,211,174,0.22)',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor:
      'rgba(99,211,174,0.45)',
  },

  captureInner: {
    width: 76,
    height: 76,
    borderRadius: 38,

    backgroundColor: '#63D3AE',
  },
});