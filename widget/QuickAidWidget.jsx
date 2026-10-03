import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

// NOTE: colors/emojis here are set independently of data/categories.js —
// send me that file if you want these to match your in-app category
// colors exactly instead of this close approximation.
const CATEGORY_SHORTCUTS = [
  { id: 'cat_burns',    label: 'Burns',    emoji: '🔥', bg: '#FFF0E0', color: '#C45000' },
  { id: 'cat_cuts',     label: 'Cuts',     emoji: '🩸', bg: '#FFE8E8', color: '#B91C1C' },
  { id: 'cat_choking',  label: 'Choking',  emoji: '🫁', bg: '#F0FDF4', color: '#15803D' },
  { id: 'cat_bleeding', label: 'Bleeding', emoji: '🩹', bg: '#FFF1F2', color: '#9F1239' },
];

const DRRM_NUMBER = '09956146128'; // Command Center — keep in sync with data/hotlines.js

export function QuickAidWidget() {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'center', // keeps content centered instead of stuck at top with gap below
      }}
    >
      <TextWidget
        text="QuickAid"
        style={{ fontSize: 13, fontWeight: 'bold', color: '#5DBB9A', marginBottom: 10 }}
      />

      {/* Call DRRM — fires tel: directly, no app open needed */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: `tel:${DRRM_NUMBER}` }}
        style={{
          width: 'match_parent',
          backgroundColor: '#DC2626',
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 14,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextWidget
          text="🚨 Call DRRM"
          style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }}
        />
      </FlexWidget>

      {/* Category shortcuts — deep-link into the app via OPEN_URI */}
      <FlexWidget style={{ flexDirection: 'row', width: 'match_parent' }}>
        {CATEGORY_SHORTCUTS.map((cat, i) => (
          <FlexWidget
            key={cat.id}
            clickAction="OPEN_URI"
            clickActionData={{ uri: `quickaid://category/${cat.id}` }}
            style={{
              flex: 1,
              backgroundColor: cat.bg,
              borderRadius: 14,
              marginLeft: i === 0 ? 0 : 5,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 12,
              minHeight: 64,
            }}
          >
            <TextWidget text={cat.emoji} style={{ fontSize: 20 }} />
            <TextWidget
              text={cat.label}
              style={{ fontSize: 10, fontWeight: 'bold', color: cat.color, marginTop: 4 }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}