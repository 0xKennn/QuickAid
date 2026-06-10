import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, StatusBar, ActivityIndicator,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_HISTORY_KEY = 'quickaid_chat_history';
const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL   = 'meta-llama/llama-3.1-8b-instruct';

const SYSTEM_PROMPT = `You are QuickAid Assistant, a helpful medical first aid AI embedded in the QuickAid mobile app used in the Philippines.

Your role:
- Answer first aid, injury, and general medical questions clearly and concisely
- Always use simple, easy-to-understand language
- For serious or life-threatening situations, ALWAYS advise the user to call 911 or seek immediate professional medical help
- You may answer general health and medical questions but always recommend consulting a licensed doctor for diagnosis or treatment
- Be empathetic, calm, and reassuring — users may be in stressful situations
- Keep responses concise and mobile-friendly (short paragraphs, use numbered steps when giving instructions)
- If asked about something outside health/medical topics, politely redirect to medical questions

Disclaimer: Always remind users that your responses are for guidance only and not a substitute for professional medical care.`;

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const listRef                 = useRef(null);

  useEffect(() => { loadHistory(); }, []);

  async function loadHistory() {
    try {
      const raw = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        const welcome = [{
          id: 'welcome',
          role: 'assistant',
          content: "Hi! I'm QuickAid Assistant 👋\n\nI can help you with first aid guidance, injury questions, and general medical information.\n\n⚠️ For emergencies, always call 911 first.\n\nHow can I help you today?",
          timestamp: new Date().toISOString(),
        }];
        setMessages(welcome);
        await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(welcome));
      }
    } catch (err) {
      console.log('loadHistory error:', err.message);
    }
  }

  async function saveHistory(msgs) {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(msgs));
    } catch (err) {
      console.log('saveHistory error:', err.message);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    saveHistory(updated);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    // Safety timeout — force reset loading after 30 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 30000);

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...updated
          .filter(m => m.id !== 'welcome')
          .map(m => ({ role: m.role, content: m.content }))
      ];

      const controller  = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(API_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer':  'https://quickaid.app',
          'X-Title':       'QuickAid',
        },
        body: JSON.stringify({
          model:       MODEL,
          messages:    apiMessages,
          max_tokens:  1024,
          temperature: 0.7,
        }),
      });

      clearTimeout(fetchTimeout);
      const data = await res.json();

      console.log('API status:', res.status);
      console.log('API data:', JSON.stringify(data).slice(0, 200));

      if (!res.ok) {
        throw new Error(data?.error?.message || `HTTP ${res.status}`);
      }

      const reply = data.choices?.[0]?.message?.content ||
        'Sorry, I could not generate a response.';

      const assistantMsg = {
        id:        (Date.now() + 1).toString(),
        role:      'assistant',
        content:   reply,
        timestamp: new Date().toISOString(),
      };

      const final = [...updated, assistantMsg];
      setMessages(final);
      saveHistory(final);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);

    } catch (err) {
      console.log('sendMessage error:', err.message);
      const errMsg = {
        id:        (Date.now() + 1).toString(),
        role:      'assistant',
        content:   err.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError:   true,
      };
      const final = [...updated, errMsg];
      setMessages(final);
      saveHistory(final);
    } finally {
      clearTimeout(safetyTimeout);
      setLoading(false);
    }
  }

  async function clearHistory() {
    Alert.alert(
      'Clear chat history',
      'This will delete all your conversation history. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear', style: 'destructive', onPress: async () => {
            const welcome = [{
              id:        'welcome',
              role:      'assistant',
              content:   "Hi! I'm QuickAid Assistant 👋\n\nI can help you with first aid guidance, injury questions, and general medical information.\n\n⚠️ For emergencies, always call 911 first.\n\nHow can I help you today?",
              timestamp: new Date().toISOString(),
            }];
            setMessages(welcome);
            await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(welcome));
          }
        },
      ]
    );
  }

  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
  }

  function MessageBubble({ item }) {
    const isUser = item.role === 'user';
    return (
      <View style={[s.bubbleWrap, isUser ? s.bubbleWrapUser : s.bubbleWrapBot]}>
        {!isUser && (
          <View style={s.avatar}>
            <Text style={s.avatarText}>⚕️</Text>
          </View>
        )}
        <View style={{ maxWidth: '80%' }}>
          <View style={[
            s.bubble,
            isUser  ? s.bubbleUser  : s.bubbleBot,
            item.isError && s.bubbleError,
          ]}>
            <Text style={[
              s.bubbleText,
              isUser ? s.bubbleTextUser : s.bubbleTextBot,
            ]}>
              {item.content}
            </Text>
          </View>
          <Text style={[s.timestamp, isUser ? s.timestampUser : s.timestampBot]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  }

  const suggestions = [
    "How do I treat a minor burn?",
    "What are signs of a stroke?",
    "How to stop bleeding fast?",
    "What to do if someone is choking?",
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerAvatar}>
            <Text style={s.headerAvatarText}>⚕️</Text>
          </View>
          <View>
            <Text style={s.headerTitle}>QuickAid Assistant</Text>
            <Text style={s.headerSub}>Medical AI · For guidance only</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearHistory} style={s.clearBtn}>
          <Text style={s.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={s.messageList}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={
            loading ? (
              <View style={s.typingWrap}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>⚕️</Text>
                </View>
                <View style={s.typingBubble}>
                  <ActivityIndicator size="small" color="#B91C1C" />
                  <Text style={s.typingText}>QuickAid is thinking...</Text>
                </View>
              </View>
            ) : null
          }
          renderItem={({ item }) => <MessageBubble item={item} />}
        />

        {/* Suggestions — only on fresh chat */}
        {messages.length === 1 && (
          <View style={s.suggestions}>
            <Text style={s.suggestLabel}>Suggested questions</Text>
            <View style={s.suggestRow}>
              {suggestions.map((q, i) => (
                <TouchableOpacity
                  key={i}
                  style={s.suggestChip}
                  onPress={() => setInput(q)}
                >
                  <Text style={s.suggestText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            ⚠️ For guidance only — not a substitute for professional medical care
          </Text>
        </View>

        {/* Input row */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask a medical question..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || loading) && s.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={s.sendBtnText}>↑</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#fff' },
  header:          { flexDirection: 'row', alignItems: 'center',
                     justifyContent: 'space-between', backgroundColor: '#B91C1C',
                     paddingHorizontal: 16, paddingVertical: 12 },
  headerLeft:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar:    { width: 40, height: 40, borderRadius: 20,
                     backgroundColor: 'rgba(255,255,255,0.2)',
                     alignItems: 'center', justifyContent: 'center' },
  headerAvatarText:{ fontSize: 20 },
  headerTitle:     { fontSize: 15, fontWeight: '700', color: '#fff' },
  headerSub:       { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  clearBtn:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                     backgroundColor: 'rgba(255,255,255,0.2)' },
  clearBtnText:    { fontSize: 13, color: '#fff', fontWeight: '500' },
  messageList:     { padding: 16, paddingBottom: 8, gap: 12 },
  bubbleWrap:      { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleWrapUser:  { justifyContent: 'flex-end' },
  bubbleWrapBot:   { justifyContent: 'flex-start' },
  avatar:          { width: 32, height: 32, borderRadius: 16,
                     backgroundColor: '#FEE2E2', alignItems: 'center',
                     justifyContent: 'center', flexShrink: 0 },
  avatarText:      { fontSize: 16 },
  bubble:          { borderRadius: 18, paddingHorizontal: 14,
                     paddingVertical: 10, maxWidth: '100%' },
  bubbleUser:      { backgroundColor: '#B91C1C', borderBottomRightRadius: 4 },
  bubbleBot:       { backgroundColor: '#F5F5F5', borderBottomLeftRadius: 4 },
  bubbleError:     { backgroundColor: '#FEF9C3' },
  bubbleText:      { fontSize: 14, lineHeight: 22 },
  bubbleTextUser:  { color: '#fff' },
  bubbleTextBot:   { color: '#111' },
  timestamp:       { fontSize: 11, color: '#999', marginTop: 4 },
  timestampUser:   { textAlign: 'right', marginRight: 4 },
  timestampBot:    { textAlign: 'left', marginLeft: 4 },
  typingWrap:      { flexDirection: 'row', alignItems: 'center',
                     gap: 8, padding: 8 },
  typingBubble:    { flexDirection: 'row', alignItems: 'center', gap: 8,
                     backgroundColor: '#F5F5F5', borderRadius: 18,
                     paddingHorizontal: 14, paddingVertical: 10 },
  typingText:      { fontSize: 13, color: '#666' },
  suggestions:     { paddingHorizontal: 16, paddingBottom: 8 },
  suggestLabel:    { fontSize: 11, color: '#999', fontWeight: '500',
                     textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  suggestRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestChip:     { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                     backgroundColor: '#FEE2E2', borderWidth: 0.5,
                     borderColor: '#FECACA' },
  suggestText:     { fontSize: 12, color: '#B91C1C', fontWeight: '500' },
  disclaimer:      { paddingHorizontal: 16, paddingVertical: 6,
                     backgroundColor: '#FFFBEB', borderTopWidth: 0.5,
                     borderTopColor: '#FDE68A' },
  disclaimerText:  { fontSize: 11, color: '#92400E', textAlign: 'center' },
  inputRow:        { flexDirection: 'row', alignItems: 'flex-end', gap: 8,
                     paddingHorizontal: 16, paddingVertical: 10,
                     borderTopWidth: 0.5, borderTopColor: '#F0F0F0',
                     backgroundColor: '#fff' },
  input:           { flex: 1, borderWidth: 1, borderColor: '#E0E0E0',
                     borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
                     fontSize: 14, color: '#111', backgroundColor: '#FAFAFA',
                     maxHeight: 100 },
  sendBtn:         { width: 44, height: 44, borderRadius: 22,
                     backgroundColor: '#B91C1C', alignItems: 'center',
                     justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#E0E0E0' },
  sendBtnText:     { color: '#fff', fontSize: 20, fontWeight: '700' },
});