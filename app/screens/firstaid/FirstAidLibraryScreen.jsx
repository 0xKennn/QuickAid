import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';

export default function FirstAidLibraryScreen({ navigation }) {
  const [search, setSearch]         = useState('');
  const [selectedCat, setSelectedCat] = useState(null);

  const filtered = GUIDES.filter(g => {
    const matchesCat = selectedCat
      ? g.categoryId === selectedCat
      : true;
    const matchesSearch = search.trim() === ''
      ? true
      : g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.content.en.overview.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCat = id => CATEGORIES.find(c => c.id === id);

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
        onPress={() =>
          navigation.navigate('GuideDetail', { guide: item })
        }
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
                {item.severity.charAt(0).toUpperCase() +
                  item.severity.slice(1)}
              </Text>
            </View>
            {item.callEmergency && (
              <View style={s.badge911}>
                <Text style={s.badge911Text}>🚨 Emergency</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={s.chev}>›</Text>
      </TouchableOpacity>
    );
  }

  const ALL_CATS = [
    { id: null, name: 'All', emoji: '📋' },
    ...CATEGORIES,
  ];

  const activeCatName = selectedCat
    ? getCat(selectedCat)?.name?.toUpperCase()
    : 'ALL';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F6" />

      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.headerTitle}>First Aid Library</Text>
        <Text style={s.headerSub}>
          {CATEGORIES.length} categories · {GUIDES.length} guides
        </Text>
      </View>

      {/* SEARCH */}
      <View style={s.searchWrap}>
        <Search size={18} color="#9CA3AF" />
        <TextInput
          style={s.searchInput}
          placeholder="Search injuries, guides..."
          placeholderTextColor="#BBB"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={s.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORY PILLS */}
      <FlatList
        horizontal
        data={ALL_CATS}
        keyExtractor={c => c.id ?? 'all'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.catList}
        style={{ flexGrow: 0, flexShrink: 0, marginBottom: 14 }}
        renderItem={({ item }) => {
          const active = selectedCat === item.id;
          return (
            <TouchableOpacity
              style={[
                s.catPill,
                active && s.catPillActive,
              ]}
              onPress={() => setSelectedCat(item.id)}
              activeOpacity={0.8}
            >
              <Text style={s.catEmoji}>{item.emoji}</Text>
              <Text
                style={[
                  s.catPillText,
                  active && { color: '#fff' },
                ]}
              >
                {item.id === null
                  ? 'All'
                  : item.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* SECTION LABEL */}
      <Text style={s.sectionLabel}>
        {`${activeCatName} GUIDES (${filtered.length})`}
      </Text>

      {/* GUIDE LIST */}
      <FlatList
        data={filtered}
        keyExtractor={g => g.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🔍</Text>
            <Text style={s.emptyTitle}>No guides found</Text>
            <Text style={s.emptyText}>
              Try a different search or category.
            </Text>
          </View>
        }
        renderItem={({ item }) => <GuideCard item={item} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F7F6',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },

  headerSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: '#111827',
  },

  clearBtn: {
    fontSize: 14,
    color: '#9CA3AF',
    padding: 4,
  },

  catList: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 4,
  },

  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  catPillActive: {
    backgroundColor: '#5DBB9A',
    borderColor: '#5DBB9A',
  },

  catEmoji: {
    fontSize: 13,
  },

  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    flexShrink: 0,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginHorizontal: 20,
    marginBottom: 12,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 3,
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  cardEmoji: { fontSize: 26 },

  cardBody: { flex: 1 },

  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },

  cardCat: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '500',
  },

  cardBadges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  badge911: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badge911Text: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '700',
  },

  chev: {
    fontSize: 22,
    color: '#D1D5DB',
    flexShrink: 0,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});