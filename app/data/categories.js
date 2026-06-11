import {
  Flame,
  Droplets,
  Bone,
  Brain,
  Waves,
  Activity,
  Wind,
  HeartPulse,
} from 'lucide-react-native';

export const CATEGORY_ICONS = {
  flame: Flame,
  droplets: Droplets,
  bone: Bone,
  brain: Brain,
  waves: Waves,
  activity: Activity,
  wind: Wind,
  'heart-pulse': HeartPulse,
};
export const CATEGORIES = [
  {
    id: 'cat_burns',
    name: 'Burns',
    icon: 'flame',
    emoji: '🔥',
    bg: '#FFF4E6',
    softBg: '#FFF8F1',
    accent: '#EA580C',
    gradient: ['#FB923C', '#EA580C'],
  },

  {
    id: 'cat_cuts',
    name: 'Cuts & Wounds',
    icon: 'droplets',
    emoji: '🩸',
    bg: '#FFEAEA',
    softBg: '#FFF5F5',
    accent: '#DC2626',
    gradient: ['#F87171', '#DC2626'],
  },

  {
    id: 'cat_fractures',
    name: 'Fractures & Broken Bones',
    icon: 'bone',
    emoji: '🦴',
    bg: '#EEF2FF',
    softBg: '#F8FAFF',
    accent: '#4338CA',
    gradient: ['#818CF8', '#4338CA'],
  },

  {
    id: 'cat_choking',
    name: 'Choking',
    icon: 'wind',
    emoji: '😮',
    bg: '#ECFDF5',
    softBg: '#F4FFF9',
    accent: '#059669',
    gradient: ['#34D399', '#059669'],
  },

  {
    id: 'cat_bleeding',
    name: 'Bleeding',
    icon: 'heart-pulse',
    emoji: '🩸',
    bg: '#FFF1F2',
    softBg: '#FFF7F8',
    accent: '#BE123C',
    gradient: ['#FB7185', '#BE123C'],
  },

  {
    id: 'cat_sprains',
    name: 'Sprains & Strains',
    icon: 'activity',
    emoji: '🦵',
    bg: '#F0F9FF',
    softBg: '#F8FCFF',
    accent: '#0284C7',
    gradient: ['#38BDF8', '#0284C7'],
  },

  {
    id: 'cat_seizures',
    name: 'Seizures',
    icon: 'brain',
    emoji: '🧠',
    bg: '#FAF5FF',
    softBg: '#FDF9FF',
    accent: '#9333EA',
    gradient: ['#C084FC', '#9333EA'],
  },

  {
    id: 'cat_drowning',
    name: 'Drowning',
    icon: 'waves',
    emoji: '🌊',
    bg: '#EFF6FF',
    softBg: '#F7FBFF',
    accent: '#2563EB',
    gradient: ['#60A5FA', '#2563EB'],
  },
];

export const SEVERITY = {
  mild: {
    label: 'Mild',
    bg: '#DCFCE7',
    color: '#166534',
    dot: '#22C55E',
    icon: '🟢',
  },

  moderate: {
    label: 'Moderate',
    bg: '#FEF3C7',
    color: '#92400E',
    dot: '#F59E0B',
    icon: '🟠',
  },

  severe: {
    label: 'Severe',
    bg: '#FEE2E2',
    color: '#991B1B',
    dot: '#EF4444',
    icon: '🔴',
  },
};