import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Mic,
  MicOff,
} from 'lucide-react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

const API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
console.log(
  'API KEY:',
  API_KEY ? 'LOADED' : 'NOT LOADED'
);

export default function ChatScreen() {
  const [message, setMessage]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef                   = useRef(null);
  const isListeningRef                = useRef(false);
  const transcriptRef                 = useRef('');

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello. I am QuickAid AI Assistant.\n\nDescribe the injury or emergency situation for immediate first-aid guidance.',
    },
  ]);

  // Speech recognition events
  useSpeechRecognitionEvent('result', (event) => {
    if (!isListeningRef.current) return;

    const transcript = event.results?.[0]?.transcript || '';
    if (transcript) {
      transcriptRef.current = transcript; // always keep the latest heard text
      setMessage(transcript);             // live preview while speaking
    }
  });

  useSpeechRecognitionEvent('error', () => {
    if (!isListeningRef.current) return;
    setIsListening(false);
    isListeningRef.current = false;
    transcriptRef.current = '';
  });

  useSpeechRecognitionEvent('end', () => {
    if (!isListeningRef.current) return;
    setIsListening(false);
    isListeningRef.current = false;

    // Recognition session actually ended — this is our real "final" signal,
    // since isFinal on the result event isn't reliable on Android.
    const finalTranscript = transcriptRef.current;
    transcriptRef.current = '';

    if (finalTranscript.trim()) {
      sendMessageWithText(finalTranscript);
    }
  });

    useEffect(() => {
      const showSubscription = Keyboard.addListener(
        'keyboardDidShow',
        () => setKeyboardVisible(true)
      );

      const hideSubscription = Keyboard.addListener(
        'keyboardDidHide',
        () => setKeyboardVisible(false)
      );

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

  async function toggleListening() {
    if (isListening) {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
      isListeningRef.current = false;
    } else {
      try {
        const perm =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission required', 'Microphone access is needed.');
          return;
        }
        setMessage('');
        transcriptRef.current = '';
        await ExpoSpeechRecognitionModule.start({
          lang: 'en-US',
          interimResults: true,
          continuous: false,
          androidIntentOptions: {
            EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 10000,
            EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 5000,
            EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 3000,
          },
        });
        setIsListening(true);
        isListeningRef.current = true;
      } catch (err) {
        console.log('Voice error:', err);
        setIsListening(false);
        isListeningRef.current = false;
      }
    }
  }

  async function sendMessageWithText(text) {
    console.log('sendMessageWithText CALLED');
    console.log('Text:', text);
    console.log('Loading:', loading);
    console.log('API key exists:', !!API_KEY);

    if (!text.trim() || loading) {
      console.log('REQUEST BLOCKED');
      return;
    }

    console.log('STARTING OPENROUTER REQUEST');

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 30000);

    const controller = new AbortController();

    const fetchTimeout = setTimeout(() => {
      controller.abort();
    }, 25000);

    try {
      console.log('ABOUT TO CALL OPENROUTER');

      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          signal: controller.signal,

          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://quickaid.app',
            'X-Title': 'QuickAid',
          },

          body: JSON.stringify({
            model: 'openrouter/free',

            messages: [
              {
                role: 'system',
                content:
                  `
                  You are QuickAid AI, an emergency first-aid assistant for DRRM responders.

                  YOUR PURPOSE:
                  Help users with first aid, injuries, medical emergencies, emergency response, and basic health/safety guidance.

                  RESPONSE STYLE:
                  - Be extremely concise and easy to scan.
                  - Give only the most important actions first.
                  - Use short numbered steps.
                  - Avoid long explanations, tables, essays, and unnecessary background information.
                  - For most situations, keep the response to 3–6 short steps.
                  - Put urgent actions at the beginning.
                  - Clearly state when emergency medical help is needed.
                  - Use simple language that can be understood during a stressful emergency.
                  - Do not overwhelm the user with information.
                  - Do not repeat the user's question.

                  SAFETY:
                  - Never claim to diagnose a condition.
                  - Do not replace professional medical care.
                  - If the situation may be life-threatening, tell the user to contact emergency services immediately.
                  - If important information is missing, ask only the most necessary question.
                  - Do not recommend dangerous or unverified home remedies.
                  - Do not give medication dosages unless the required age/weight and medication information is available.

                  EMERGENCY PRIORITY:
                  If the user describes a potentially life-threatening situation, start with:
                  "🚨 EMERGENCY: Call emergency services now."

                  Then provide only the immediate actions needed while waiting for help.

                  ALLOWED TOPICS:
                  Answer questions involving:
                  - First aid
                  - Injuries and wounds
                  - Burns
                  - Bleeding
                  - Fractures and sprains
                  - Choking
                  - CPR and basic emergency response
                  - Unconsciousness
                  - Seizures
                  - Shock
                  - Poisoning
                  - Heat/cold emergencies
                  - Drowning
                  - Animal/insect bites and stings
                  - Basic medical emergencies
                  - Disaster and emergency preparedness
                  - Emergency response and safety

                  OFF-TOPIC QUESTIONS:
                  If the question is unrelated to first aid, medical guidance, emergencies, health/safety, or disaster response, do not answer it.

                  Instead respond:
                  "I can only help with first aid, medical emergencies, health/safety, and emergency response."

                  IMPORTANT:
                  Stay focused on the user's immediate situation.
                  Do not provide unnecessary medical theory.
                  When giving first-aid instructions, prioritize what the person should DO right now.
                  `
,
              },
              {
                role: 'user',
                content: text,
              },
            ],
          }),
        }
      );

      clearTimeout(fetchTimeout);

      console.log('FETCH COMPLETED');
      console.log('HTTP STATUS:', response.status);
      console.log('HTTP OK:', response.ok);

      const data = await response.json();

      console.log('OPENROUTER DATA RECEIVED');

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
          `OpenRouter HTTP ${response.status}`
        );
      }

      const aiText =
        data?.choices?.[0]?.message?.content ||
        'Unable to generate response.';

      console.log('AI RESPONSE RECEIVED');
      console.log('Response length:', aiText.length);

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text: aiText,
        },
      ]);

      console.log('AI MESSAGE ADDED SUCCESSFULLY');

    } catch (error) {

      console.log('========== OPENROUTER ERROR ==========');
      console.log('Error name:', error?.name);
      console.log('Error message:', error?.message);
      console.log('Full error:', error);
      console.log('======================================');

      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'bot',
          text:
            error?.name === 'AbortError'
              ? 'Request timed out. Please try again.'
              : `Connection error: ${error?.message || 'Unknown error'}`,
        },
      ]);

    } finally {

      clearTimeout(fetchTimeout);
      clearTimeout(safetyTimeout);

      setLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  }

  async function sendMessage() {
    console.log('SEND BUTTON PRESSED');
    console.log('MESSAGE:', message);

    await sendMessageWithText(message);
  }

  function renderMessage({ item }) {
    const isBot = item.sender === 'bot';
    return (
      <View
        style={[
          s.messageRow,
          isBot ? s.botRow : s.userRow,
        ]}
      >
        {isBot && (
          <View style={s.botIcon}>
            <Bot size={18} color="#59C9A5" />
          </View>
        )}
        <View
          style={[
            s.messageBubble,
            isBot ? s.botBubble : s.userBubble,
          ]}
        >
          <Text
            style={[
              s.messageText,
              isBot ? s.botText : s.userText,
            ]}
          >
            {item.text}
          </Text>
        </View>
        {!isBot && (
          <View style={s.userIcon}>
            <User size={18} color="#59C9A5" />
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F8F8"
      />

      <KeyboardAvoidingView
        style={s.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* HEADER */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>
              QuickAid Assistant
            </Text>

            <View style={s.statusRow}>
              <Sparkles size={14} color="#59C9A5" />

              <Text style={s.statusText}>
                AI-powered medical guidance
              </Text>
            </View>
          </View>

          <View style={s.aiBadge}>
            <Bot size={22} color="#59C9A5" />
          </View>
        </View>

        {/* CHAT */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={s.chatContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({
                animated: true,
              });
            }, 50);
          }}
        />

        {/* LISTENING BANNER */}
        {isListening && (
          <View style={s.listeningBanner}>
            <MicOff size={16} color="#059669" />

            <Text style={s.listeningText}>
              Listening... speak your question
            </Text>
          </View>
        )}

        {/* INPUT */}
        <View
          style={[
            s.inputWrapper,
            !keyboardVisible && s.inputWrapperWithTabBar,
          ]}
        >
          <View style={s.inputContainer}>

            {/* MIC */}
            <TouchableOpacity
              style={[
                s.micBtn,
                isListening && s.micBtnActive,
              ]}
              onPress={toggleListening}
            >
              {isListening ? (
                <MicOff size={18} color="#fff" />
              ) : (
                <Mic size={18} color="#59C9A5" />
              )}
            </TouchableOpacity>

            {/* TEXT INPUT */}
            <TextInput
              style={s.input}
              placeholder={
                isListening
                  ? 'Listening...'
                  : 'Describe symptoms or injuries...'
              }
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              editable={!isListening}
              textAlignVertical="center"
              autoCorrect={true}
              returnKeyType="default"
            />

            {/* SEND */}
            <TouchableOpacity
              style={[
                s.sendButton,
                (loading || !message.trim()) &&
                  s.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={loading || !message.trim()}
            >
              {loading ? (
                <ActivityIndicator
                  color="#fff"
                  size="small"
                />
              ) : (
                <Send size={18} color="#fff" />
              )}
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8F8',
  },
keyboardContainer: {
  flex: 1,
},
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusText: {
    color: '#7B8794',
    fontSize: 15,
  },
  aiBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-end',
  },
  botRow:  { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  botIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F7',
    borderTopLeftRadius: 8,
  },
  userBubble: {
    backgroundColor: '#59C9A5',
    borderBottomRightRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 25,
  },
  botText:  { color: '#1F2937' },
  userText: { color: '#FFFFFF', fontWeight: '500' },
  listeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  listeningText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  micBtnActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    color: '#111827',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    minHeight: 44,
    maxHeight: 110,
    paddingHorizontal: 4,
    paddingVertical: 10,
    textAlignVertical: 'center',
    includeFontPadding: true,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#59C9A5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#A0C4B8',
  },
inputWrapperWithTabBar: {
  paddingBottom: 100,
},
keyboardContainer: {
  flex: 1,
},
});