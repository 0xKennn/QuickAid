import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const CHANNEL_ID = 'quickaid-quick-access';

// Without this, Expo silently drops any notification that arrives while
// the app is in the foreground — which is exactly when our trigger
// fires (right on Home screen mount, right after login). This has to
// run once, early, so it's registered before showQuickAccessNotification
// is ever called.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Tapping a notification brings the app to the foreground by default —
// no extra wiring needed for "press it, go to the app."
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Quick Access',
    importance: Notifications.AndroidImportance.HIGH, // needed to show on lock screen
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

// Shows a simple, dismissible notification. The user can trigger this
// however you wire it up (e.g. a button, or once per app launch).
export async function showQuickAccessNotification() {
  const granted = await requestNotificationPermission();
  if (!granted) return;

  await ensureChannel();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'QuickAid',
      body: 'Tap for quick access to first aid guidance and emergency contacts.',
    },
    trigger: null, // null = show immediately
    identifier: 'quickaid-quick-access',
    channelId: CHANNEL_ID, // must be top-level, not nested under content.android
  });
}