import * as Location from 'expo-location';
import { supabase } from '../config/supabase';

export const EMERGENCY_TYPES = [
  'Medical Emergency',
  'Fire',
  'Accident',
  'Crime',
  'Natural Disaster',
  'Other',
];

// Returns a Google Maps link for the user's current location, or null
// if permission was denied / location couldn't be determined. Never
// throws — an emergency SMS should still be sendable without location
// rather than getting blocked by a permission hiccup.
export async function getCurrentLocationLink() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  } catch (err) {
    console.log('Location fetch failed:', err.message);
    return null;
  }
}

function composeDistressMessage({ senderName, emergencyType, mapsLink }) {
  const who = senderName ? `${senderName} needs` : 'I need';
  const locationLine = mapsLink
    ? `Location: ${mapsLink}`
    : 'Location: unavailable';

  return (
    `EMERGENCY ALERT - ${who} immediate help.\n` +
    `Type: ${emergencyType}\n` +
    `${locationLine}\n` +
    `Sent via QuickAid app.`
  );
}

// recipients: array of phone number strings (any format — sanitized
// server-side). This now sends the SMS from the app's own Semaphore
// account via a Supabase Edge Function, rather than relying on the
// user's own SIM/load — the app carries the cost, not the user.
export async function sendEmergencySMS({ senderName, emergencyType, recipients }) {
  if (!recipients || recipients.length === 0) {
    return { success: false, error: 'No recipients selected.' };
  }

  const mapsLink = await getCurrentLocationLink();
  const message = composeDistressMessage({ senderName, emergencyType, mapsLink });

  try {
    const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
      body: { recipients, message },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}