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

import { CATEGORIES } from '../../data/categories';
import { GUIDES } from '../../data/guides';

export default function FirstAidLibraryScreen({
  navigation,
}) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] =
    useState(null);

  const filtered = GUIDES.filter(g => {
    const matchesCat = selectedCat
      ? g.categoryId === selectedCat
      : true;

    const matchesSearch =
      search.trim() === ''
        ? true
        : g.title
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          g.content.en.overview
            .toLowerCase()
            .includes(search.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const getCat = id =>
    CATEGORIES.find(c => c.id === id);

  const activeCatName = selectedCat
    ? getCat(selectedCat)?.name
    : null;

  const sevStyle = {
    mild: {
      bg: '#DCFCE7',
      color: '#166534',
    },

    moderate: {
      bg: '#FEF3C7',
      color: '#92400E',
    },

    severe: {
      bg: '#FEE2E2',
      color: '#991B1B',
    },
  };

  function GuideCard({ item }) {
    const cat = getCat(item.categoryId);

    const sev = sevStyle[item.severity];

    return (
      <TouchableOpacity
        style={[
          s.card,
          {
            borderLeftColor: cat.accent,
          },
        ]}
        onPress={() =>
          navigation.navigate(
            'GuideDetail',
            { guide: item }
          )
        }
        activeOpacity={0.9}
      >
        <View
          style={[
            s.cardIcon,
            {
              backgroundColor: cat.bg,
            },
          ]}
        >
          <Text style={s.cardEmoji}>
            {cat.emoji}
          </Text>
        </View>

        <View style={s.cardBody}>
          <Text style={s.cardTitle}>
            {item.title}
          </Text>

          <Text style={s.cardCat}>
            {cat.name}
          </Text>

          <View style={s.cardBadges}>

            <View
              style={[
                s.badge,
                {
                  backgroundColor: sev.bg,
                },
              ]}
            >
              <Text
                style={[
                  s.badgeText,
                  {
                    color: sev.color,
                  },
                ]}
              >
                {item.severity
                  .charAt(0)
                  .toUpperCase() +
                  item.severity.slice(1)}
              </Text>
            </View>

            {item.callEmergency && (
              <View style={s.badge911}>
                <Text style={s.badge911Text}>
                  🚨 Emergency
                </Text>
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7FAF9"
      />

      {/* HEADER */}
      <View style={s.header}>

        <Text style={s.headerTitle}>
          First Aid Library
        </Text>

        <Text style={s.headerSub}>
          {CATEGORIES.length} categories ·{' '}
          {GUIDES.length} guides
        </Text>

      </View>

      <View style={s.body}>

        {/* SEARCH */}
        <View style={s.searchWrap}>

          <Text style={s.searchIcon}>
            🔍
          </Text>

          <TextInput
            style={s.searchInput}
            placeholder="Search injuries, guides..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
            >
              <Text style={s.clearBtn}>
                ✕
              </Text>
            </TouchableOpacity>
          )}

        </View>

        {/* CATEGORY PILLS */}
        <FlatList
          horizontal
          data={[
            {
              id: null,
              name: 'All',
              emoji: '📋',
            },
            ...CATEGORIES,
          ]}
          keyExtractor={c =>
            c.id ?? 'all'
          }
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={s.catList}
          style={{
            flexGrow: 0,
            marginBottom: 16,
          }}
          renderItem={({ item }) => {
            const active =
              selectedCat === item.id;

            return (
              <TouchableOpacity
                style={[
                  s.catPill,
                  active &&
                    s.catPillActive,
                ]}
                onPress={() =>
                  setSelectedCat(item.id)
                }
              >
                <Text style={s.catEmoji}>
                  {item.emoji}
                </Text>

                <Text
                  style={[
                    s.catPillText,
                    active &&
                      s.catPillTextActive,
                  ]}
                >
                  {item.id === null
                    ? 'All'
                    : item.name.split(
                        ' '
                      )[0]}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* SECTION */}
        <Text style={s.sectionLabel}>
          {activeCatName
            ? `${activeCatName} guides`
            : 'All guides'}{' '}
          ({filtered.length})
        </Text>

        {/* LIST */}
        <FlatList
          data={filtered}
          keyExtractor={g => g.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={
            false
          }
          ListEmptyComponent={
            <View style={s.empty}>

              <Text style={s.emptyEmoji}>
                🔍
              </Text>

              <Text style={s.emptyTitle}>
                No guides found
              </Text>

              <Text style={s.emptyText}>
                Try another keyword or
                category.
              </Text>

            </View>
          }
          renderItem={({ item }) => (
            <GuideCard item={item} />
          )}
        />

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#F7FAF9',
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: '#F7FAF9',
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.6,
  },

  headerSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  body: {
    flex: 1,
    paddingTop: 6,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    marginHorizontal: 18,
    marginBottom: 14,

    borderRadius: 18,

    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  searchIcon: {
    fontSize: 16,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,

    fontSize: 14,
    color: '#111827',
  },

  clearBtn: {
    fontSize: 14,
    color: '#9CA3AF',
    padding: 4,
  },

  catList: {
    paddingHorizontal: 18,
    gap: 10,
  },

  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    backgroundColor: '#FFFFFF',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  catPillActive: {
    backgroundColor: '#63D3AE',
    borderColor: '#63D3AE',
  },

  catEmoji: {
    fontSize: 13,
  },

  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  catPillTextActive: {
    color: '#FFFFFF',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',

    color: '#6B7280',

    textTransform: 'uppercase',
    letterSpacing: 1,

    marginHorizontal: 20,
    marginBottom: 10,
  },

  list: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 14,

    borderLeftWidth: 4,

    borderWidth: 1,
    borderColor: '#EEF2F7',

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 14,
  },

  cardEmoji: {
    fontSize: 26,
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',

    marginBottom: 4,
  },

  cardCat: {
    fontSize: 12,
    color: '#6B7280',

    marginBottom: 8,
  },

  cardBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  badge911: {
    backgroundColor: '#FEE2E2',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 30,
  },

  badge911Text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
  },

  chev: {
    fontSize: 26,
    color: '#D1D5DB',
    marginLeft: 8,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyEmoji: {
    fontSize: 42,
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
    color: '#6B7280',
  },
});