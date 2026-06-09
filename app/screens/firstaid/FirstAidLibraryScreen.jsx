import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';

export default function FirstAidLibraryScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const filtered = GUIDES.filter(g => {
    const matchesCat = selectedCat ? g.categoryId === selectedCat : true;
    const matchesSearch = search.trim() === ''
      ? true
      : g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.content.en.overview.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCat = (id) => CATEGORIES.find(c => c.id === id);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <Text style={s.title}>First Aid Library</Text>
        <Text style={s.subtitle}>8 categories · {GUIDES.length} guides</Text>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search injuries..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category filter pills */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={c => c.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.catList}
        renderItem={({ item }) => {
          const active = selectedCat === item.id;
          return (
            <TouchableOpacity
              style={[s.catPill, active && { backgroundColor: item.accent }]}
              onPress={() => setSelectedCat(active ? null : item.id)}
            >
              <Text style={s.catPillEmoji}>{item.emoji}</Text>
              <Text style={[s.catPillText, active && { color: '#fff' }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Guide cards */}
      <FlatList
        data={filtered}
        keyExtractor={g => g.id}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyText}>No guides found.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const cat = getCat(item.categoryId);
          const sevColor = {
            mild:     { bg: '#DCFCE7', color: '#166534' },
            moderate: { bg: '#FEF9C3', color: '#854D0E' },
            severe:   { bg: '#FEE2E2', color: '#991B1B' },
          }[item.severity];

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
                <View style={s.cardFooter}>
                  <View style={[s.sevBadge, { backgroundColor: sevColor.bg }]}>
                    <Text style={[s.sevText, { color: sevColor.color }]}>
                      {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                    </Text>
                  </View>
                  {item.callEmergency && (
                    <View style={s.emergBadge}>
                      <Text style={s.emergText}>🚨 Call 911</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#111' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
    marginVertical: 10, backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#111' },
  catList: { paddingHorizontal: 20, paddingBottom: 10, gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12,
    paddingVertical: 7, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 0.5,
    borderColor: '#E0E0E0' },
  catPillEmoji: { fontSize: 14 },
  catPillText: { fontSize: 12, fontWeight: '500', color: '#555' },
  list: { paddingHorizontal: 20, paddingBottom: 40, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, borderLeftWidth: 4, borderWidth: 0.5,
    borderColor: '#F0F0F0', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  cardIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  cardCat: { fontSize: 12, color: '#888', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', gap: 6 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  sevText: { fontSize: 11, fontWeight: '500' },
  emergBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  emergText: { fontSize: 11, color: '#991B1B', fontWeight: '500' },
  chevron: { fontSize: 22, color: '#CCC' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: '#888' },
});