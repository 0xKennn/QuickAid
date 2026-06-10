import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';

export default function FirstAidLibraryScreen({ navigation }) {
  const [search, setSearch]       = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const filtered = GUIDES.filter(g => {
    const matchesCat    = selectedCat ? g.categoryId === selectedCat : true;
    const matchesSearch = search.trim() === ''
      ? true
      : g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.content.en.overview.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCat = id => CATEGORIES.find(c => c.id === id);

  const activeCatName = selectedCat
    ? getCat(selectedCat)?.name
    : null;

  const sevStyle = {
    mild:     { bg: '#DCFCE7', color: '#166534' },
    moderate: { bg: '#FEF9C3', color: '#854D0E' },
    severe:   { bg: '#FEE2E2', color: '#991B1B' },
  };

  function GuideCard({ item }) {
    const cat = getCat(item.categoryId);
    const sev = sevStyle[item.severity];
    return (
      <TouchableOpacity
        style={[s.card, { borderLeftColor: cat.accent }]}
        onPress={() => navigation.navigate('GuideDetail', { guide: item })}
        activeOpacity={0.85}
      >
        <View style={[s.cardIcon, { backgroundColor: cat.bg }]}>
          <Text style={s.cardEmoji}>{cat.emoji}</Text>
        </View>
        <View style={s.cardBody}>
          <Text style={s.cardTitle}>{item.title}</Text>
          <Text style={s.cardCat}>{cat.name}</Text>
          <View style={s.cardBadges}>
            <View style={[s.badge, { backgroundColor: sev.bg }]}>
              <Text style={[s.badgeText, { color: sev.color }]}>
                {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
              </Text>
            </View>
            {item.callEmergency && (
              <View style={s.badge911}>
                <Text style={s.badge911Text}>🚨 Call 911</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={s.chev}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#B91C1C" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>First Aid Library</Text>
        <Text style={s.headerSub}>
          {CATEGORIES.length} categories · {GUIDES.length} guides
        </Text>
      </View>

      <View style={s.body}>
        {/* Search */}
        <View style={s.searchWrap}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search injuries, guides..."
            placeholderTextColor="#BBB"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={s.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category filter pills */}
        <FlatList
          horizontal
          data={[{ id: null, name: 'All', emoji: '📋' }, ...CATEGORIES]}
          keyExtractor={c => c.id ?? 'all'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.catList}
          style={{ flexGrow: 0, marginBottom: 14 }}
          renderItem={({ item }) => {
            const active = selectedCat === item.id;
            return (
              <TouchableOpacity
                style={[s.catPill, active && s.catPillActive]}
                onPress={() => setSelectedCat(item.id)}
              >
                <Text style={s.catEmoji}>{item.emoji}</Text>
                <Text style={[s.catPillText, active && s.catPillTextActive]}>
                  {item.id === null ? 'All' : item.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Section label */}
        <Text style={s.sectionLabel}>
          {activeCatName ? `${activeCatName} guides` : 'All guides'} ({filtered.length})
        </Text>

        {/* Guide list */}
        <FlatList
          data={filtered}
          keyExtractor={g => g.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>🔍</Text>
              <Text style={s.emptyTitle}>No guides found</Text>
              <Text style={s.emptyText}>Try a different search or category.</Text>
            </View>
          }
          renderItem={({ item }) => <GuideCard item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: '#B91C1C' },
  header:           { backgroundColor: '#B91C1C', paddingHorizontal: 20,
                      paddingTop: 14, paddingBottom: 24 },
  headerTitle:      { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub:        { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  body:             { flex: 1, backgroundColor: '#F5F5F5', borderTopLeftRadius: 20,
                      borderTopRightRadius: 20, marginTop: -12, paddingTop: 16 },
  searchWrap:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                      borderRadius: 12, paddingHorizontal: 14, marginHorizontal: 16,
                      marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB', gap: 8 },
  searchIcon:       { fontSize: 16 },
  searchInput:      { flex: 1, paddingVertical: 12, fontSize: 14, color: '#111' },
  clearBtn:         { fontSize: 14, color: '#999', padding: 4 },
  catList:          { paddingHorizontal: 16, gap: 8 },
  catPill:          { flexDirection: 'row', alignItems: 'center', gap: 5,
                      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
                      backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
  catPillActive:    { backgroundColor: '#B91C1C', borderColor: '#B91C1C' },
  catEmoji:         { fontSize: 13 },
  catPillText:      { fontSize: 12, fontWeight: '500', color: '#555' },
  catPillTextActive:{ color: '#fff' },
  sectionLabel:     { fontSize: 11, fontWeight: '600', color: '#888',
                      textTransform: 'uppercase', letterSpacing: 0.6,
                      marginHorizontal: 16, marginBottom: 10 },
  list:             { paddingHorizontal: 16, paddingBottom: 100, gap: 8 },
  card:             { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                      borderRadius: 14, padding: 13, borderLeftWidth: 3,
                      borderWidth: 0.5, borderColor: '#F0F0F0', gap: 12 },
  cardIcon:         { width: 46, height: 46, borderRadius: 11,
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardEmoji:        { fontSize: 24 },
  cardBody:         { flex: 1 },
  cardTitle:        { fontSize: 13, fontWeight: '600', color: '#111', marginBottom: 2 },
  cardCat:          { fontSize: 11, color: '#888', marginBottom: 6 },
  cardBadges:       { flexDirection: 'row', gap: 5 },
  badge:            { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeText:        { fontSize: 11, fontWeight: '600' },
  badge911:         { backgroundColor: '#FEE2E2', paddingHorizontal: 8,
                      paddingVertical: 3, borderRadius: 20 },
  badge911Text:     { fontSize: 11, color: '#991B1B', fontWeight: '600' },
  chev:             { fontSize: 22, color: '#DDD' },
  empty:            { alignItems: 'center', paddingTop: 60 },
  emptyEmoji:       { fontSize: 40, marginBottom: 12 },
  emptyTitle:       { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 6 },
  emptyText:        { fontSize: 13, color: '#888' },
});