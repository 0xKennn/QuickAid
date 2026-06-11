import React, { useState, useRef } from 'react';
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
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  Send,
  Bot,
  User,
  Sparkles,
} from 'lucide-react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text:
        'Hello. I am QuickAid AI Assistant.\n\nDescribe the injury or emergency situation for immediate first-aid guidance.',
    },
  ]);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
    };

    setMessages(prev => [...prev, userMessage]);

    const currentMessage = message;
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization:
              'Bearer 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',
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',

            messages: [
              {
                role: 'system',
                content:
                  'You are QuickAid AI, a professional first aid and emergency medical assistant for DRRM responders. Provide concise, accurate, calm medical guidance.',
              },

              {
                role: 'user',
                content: currentMessage,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const aiText =
        data?.choices?.[0]?.message?.content ||
        'Unable to generate response.';

      const aiReply = {
        id: Math.random().toString(),
        sender: 'bot',
        text: aiText,
      };

      setMessages(prev => [...prev, aiReply]);

    } catch (error) {
      console.log(error);

      const errorReply = {
        id: Math.random().toString(),
        sender: 'bot',
        text:
          'Connection error. Please check internet connectivity.',
      };

      setMessages(prev => [...prev, errorReply]);

    } finally {
      setLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
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

      {/* CHAT AREA */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={s.chatContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={s.inputWrapper}>
          <View style={s.inputContainer}>
            <TextInput
              style={s.input}
              placeholder="Describe symptoms or injuries..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <TouchableOpacity
              style={s.sendButton}
              onPress={sendMessage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
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

  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
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

  botRow: {
    justifyContent: 'flex-start',
  },

  userRow: {
    justifyContent: 'flex-end',
  },

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

  botText: {
    color: '#1F2937',
  },

  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },

  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 95,
    backgroundColor: '#FFFFFF',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    backgroundColor: '#FFFFFF',

    borderRadius: 28,

    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 10,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    maxHeight: 120,
    paddingTop: 6,
    paddingBottom: 6,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: '#59C9A5',

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 10,
  },
});