import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

import {
  LogOut,
  Phone,
  Camera,
  HeartPulse,
  MessageCircle,
  User,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';

import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/auth';

const TIPS = [
  {
    category: 'Burns',
    categoryColor: '#C45000',
    categoryBg: '#FFF0E0',
    title: 'Treating a minor burn',
    steps: [
      'Cool under running water for at least 10 minutes',
      'Do not apply ice, butter, or toothpaste',
      'Cover loosely with a clean non-stick bandage',
    ],
  },
  {
    category: 'Cuts & Wounds',
    categoryColor: '#B91C1C',
    categoryBg: '#FFE8E8',
    title: 'Treating a minor cut',
    steps: [
      'Rinse the wound under clean running water',
      'Apply gentle pressure to stop bleeding',
      'Cover with an adhesive bandage',
    ],
  },
  {
    category: 'Choking',
    categoryColor: '#15803D',
    categoryBg: '#F0FDF4',
    title: 'Responding to choking',
    steps: [
      'Ask "Are you choking?" — act if they cannot speak',
      'Give 5 firm back blows between shoulder blades',
      'Follow with 5 abdominal thrusts (Heimlich)',
    ],
  },
  {
    category: 'Sprains',
    categoryColor: '#0369A1',
    categoryBg: '#F0F9FF',
    title: 'RICE method for sprains',
    steps: [
      'Rest — stop activity immediately',
      'Ice — apply wrapped ice for 15–20 minutes',
      'Compression — wrap with elastic bandage',
    ],
  },
  {
    category: 'Bleeding',
    categoryColor: '#9F1239',
    categoryBg: '#FFF1F2',
    title: 'Controlling bleeding',
    steps: [
      'Apply firm direct pressure with a clean cloth',
      'Maintain pressure for at least 10 minutes',
      'Add more cloth on top if it soaks through',
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();

  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    const dayIndex = new Date().getDate() % TIPS.length;
    setTip(TIPS[dayIndex]);
  }, []);

  const firstName =
    profile?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4F6F5"
      />

      {/* HEADER */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>
              Hello, {firstName}
            </Text>

            <Text style={s.greetingSub}>
              Stay prepared for emergencies
            </Text>
          </View>

          <TouchableOpacity
            style={s.logoutBtn}
            onPress={logoutUser}
          >
            <LogOut
              size={18}
              color="#5DBB9A"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* STATS */}
        <View style={s.statRow}>

          <View style={s.statCard}>
            <Text style={s.statVal}>8</Text>

            <Text style={s.statLabel}>
              Injury{'\n'}Categories
            </Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statVal}>10+</Text>

            <Text style={s.statLabel}>
              First Aid{'\n'}Guides
            </Text>
          </View>

          <View style={s.statCard}>
            <Text style={s.statVal}>2</Text>

            <Text style={s.statLabel}>
              Languages{'\n'}Supported
            </Text>
          </View>

        </View>

        {/* EMERGENCY */}
        <TouchableOpacity
          style={s.emergCard}
          onPress={() =>
            navigation.navigate(
              'EmergencyContacts'
            )
          }
          activeOpacity={0.9}
        >

          <View style={s.emergIcon}>
            <Phone
              size={22}
              color="#5DBB9A"
            />
          </View>

          <View style={s.emergBody}>
            <Text style={s.emergTitle}>
              Emergency Contacts
            </Text>

            <Text style={s.emergSub}>
              Hotlines & personal contacts
              available instantly
            </Text>
          </View>

          <ChevronRight
            size={20}
            color="#5DBB9A"
          />

        </TouchableOpacity>

        {/* QUICK ACTIONS */}
        <Text style={s.sectionLabel}>
          QUICK ACTIONS
        </Text>

        <View style={s.actionGrid}>

          {/* CAPTURE */}
          <TouchableOpacity
            style={s.actionCard}
            onPress={() =>
              navigation.navigate('Capture')
            }
            activeOpacity={0.9}
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor: '#FEE2E2',
                },
              ]}
            >
              <Camera
                size={24}
                color="#EF4444"
              />
            </View>

            <Text style={s.actionTitle}>
              Smart Capture
            </Text>

            <Text style={s.actionSub}>
              Identify injuries with AI camera
            </Text>

          </TouchableOpacity>

          {/* FIRST AID */}
          <TouchableOpacity
            style={s.actionCard}
            onPress={() =>
              navigation.navigate('First Aid')
            }
            activeOpacity={0.9}
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor: '#E0E7FF',
                },
              ]}
            >
              <HeartPulse
                size={24}
                color="#6366F1"
              />
            </View>

            <Text style={s.actionTitle}>
              First Aid Library
            </Text>

            <Text style={s.actionSub}>
              Browse emergency response guides
            </Text>

          </TouchableOpacity>

          {/* CHAT */}
          <TouchableOpacity
            style={s.actionCard}
            onPress={() =>
              navigation.navigate('Chat')
            }
            activeOpacity={0.9}
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor: '#DCFCE7',
                },
              ]}
            >
              <MessageCircle
                size={24}
                color="#22C55E"
              />
            </View>

            <Text style={s.actionTitle}>
              AI Assistant
            </Text>

            <Text style={s.actionSub}>
              Ask healthcare questions
            </Text>

          </TouchableOpacity>

          {/* PROFILE */}
          <TouchableOpacity
            style={s.actionCard}
            onPress={() =>
              navigation.navigate('Profile')
            }
            activeOpacity={0.9}
          >

            <View
              style={[
                s.actionIcon,
                {
                  backgroundColor: '#FEF9C3',
                },
              ]}
            >
              <User
                size={24}
                color="#EAB308"
              />
            </View>

            <Text style={s.actionTitle}>
              My Profile
            </Text>

            <Text style={s.actionSub}>
              Manage account & settings
            </Text>

          </TouchableOpacity>

        </View>

        {/* TIP */}
        <Text style={s.sectionLabel}>
          FIRST AID TIP
        </Text>

        <View style={s.tipCard}>

          <View style={s.tipHeader}>
            <View
              style={[
                s.tipBadge,
                {
                  backgroundColor:
                    tip.categoryBg,
                },
              ]}
            >
              <Text
                style={[
                  s.tipBadgeText,
                  {
                    color:
                      tip.categoryColor,
                  },
                ]}
              >
                {tip.category}
              </Text>
            </View>
          </View>

          <Text style={s.tipTitle}>
            {tip.title}
          </Text>

          <View style={s.tipSteps}>
            {tip.steps.map((step, i) => (
              <View
                key={i}
                style={s.tipStep}
              >

                <View
                  style={[
                    s.tipNum,
                    {
                      backgroundColor:
                        tip.categoryBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.tipNumText,
                      {
                        color:
                          tip.categoryColor,
                      },
                    ]}
                  >
                    {i + 1}
                  </Text>
                </View>

                <Text style={s.tipText}>
                  {step}
                </Text>

              </View>
            ))}
          </View>

        </View>

        {/* DISCLAIMER */}
        <View style={s.disclaimer}>

          <ShieldAlert
            size={18}
            color="#D97706"
          />

          <Text style={s.disclaimerText}>
            For guidance only — not a substitute
            for professional medical care.
            Call emergency services immediately
            during life-threatening situations.
          </Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F6F5',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#F4F6F5',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 30,
    fontWeight: '800',
    color: '#25302B',
  },

  greetingSub: {
    fontSize: 14,
    color: '#7C8B85',
    marginTop: 6,
  },

  logoutBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 3,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  statCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },

  statVal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5DBB9A',
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 11,
    color: '#7C8B85',
    textAlign: 'center',
    lineHeight: 16,
  },

  emergCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    marginBottom: 24,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 3,
  },

  emergIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#EAF8F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emergBody: {
    flex: 1,
    marginLeft: 14,
  },

  emergTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#25302B',
    marginBottom: 4,
  },

  emergSub: {
    fontSize: 13,
    color: '#7C8B85',
    lineHeight: 18,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6F7B76',
    letterSpacing: 1,
    marginBottom: 14,
    marginLeft: 2,
  },

  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 26,
  },

  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },

  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#25302B',
    marginBottom: 6,
  },

  actionSub: {
    fontSize: 12,
    color: '#7C8B85',
    lineHeight: 18,
  },

  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },

  tipHeader: {
    marginBottom: 14,
  },

  tipBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  tipBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#25302B',
    marginBottom: 18,
  },

  tipStep: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  tipNum: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  tipNumText: {
    fontSize: 12,
    fontWeight: '700',
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#5E746B',
    lineHeight: 22,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E7',
    borderRadius: 22,
    padding: 18,
    marginBottom: 30,
  },

  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: '#A16207',
    lineHeight: 20,
    marginLeft: 10,
  },
});

