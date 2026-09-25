import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '../config/supabase';

const CACHE_KEY   = 'quickaid_guides_cache';
const VERSION_KEY = 'quickaid_guides_version';
const IMAGE_DIR    = FileSystem.documentDirectory + 'guide-images/';

// --- Local cache -----------------------------------------------------

export async function getCachedGuides() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.log('Failed to read guide cache:', err);
    return null;
  }
}

async function cacheGuidesLocally(guides, version) {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(guides));
  await AsyncStorage.setItem(VERSION_KEY, String(version));
}

async function getLocalVersion() {
  return AsyncStorage.getItem(VERSION_KEY);
}

// --- Remote ------------------------------------------------------------

// Reads app_meta row where key = 'guidesVersion', value = { version: number }.
// Bump this any time you edit guide content in Supabase — that's what
// tells devices a re-sync is needed.
async function getRemoteVersion() {
  const { data, error } = await supabase
    .from('app_meta')
    .select('value')
    .eq('key', 'guidesVersion')
    .single();

  if (error) {
    console.log('Failed to read remote guide version:', error.message);
    return null;
  }
  return data?.value?.version ?? null;
}

async function fetchAllGuidesFromSupabase() {
  const { data, error } = await supabase.from('guides').select('*');
  if (error) throw error;

  return data.map(row => ({
    id: row.id,
    categoryId: row.category_id,
    title: row.title,
    severity: row.severity,
    callEmergency: row.call_emergency,
    content: row.content,
    images: row.images || [],
  }));
}

// --- Image caching -------------------------------------------------------

async function ensureImageDir() {
  const info = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
}

function extensionFromUrl(url) {
  const match = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
  return match ? match[1].toLowerCase() : 'jpg';
}

// Downloads (or re-downloads) an image and caches it locally. This is
// only called when syncGuides has already determined the version
// changed, so we always fetch fresh here rather than trusting a local
// file with the same name — otherwise an updated image URL for the
// same guide+step would silently keep showing the old cached file.
async function cacheImage(url, guideId, stepIndex) {
  if (!url || !url.startsWith('http')) return url; // already local, or empty

  const ext = extensionFromUrl(url);
  const filename = `${guideId}_${stepIndex}.${ext}`;
  const localUri = IMAGE_DIR + filename;

  try {
    const result = await FileSystem.downloadAsync(url, localUri);
    return result.uri;
  } catch (err) {
    console.log(`Failed to cache image for ${guideId} step ${stepIndex}:`, err);
    return url; // fall back to the remote URL if download fails
  }
}

// Caches every image in a guide's shared `images` array (one entry per
// step, same image regardless of language). Empty/missing entries stay
// as-is (null/empty string means "no image for this step").
async function processGuideImages(guide) {
  if (!guide.images || guide.images.length === 0) return guide;

  const cachedImages = await Promise.all(
    guide.images.map((url, i) => cacheImage(url, guide.id, i))
  );

  return { ...guide, images: cachedImages };
}

// --- Public sync entry point ---------------------------------------------

// Call this on app launch (and optionally pull-to-refresh). Returns the
// guides array either way — from a fresh sync, or the existing cache if
// nothing changed / sync failed. Never throws.
export async function syncGuides({ force = false } = {}) {
  try {
    await ensureImageDir();

    const remoteVersion = await getRemoteVersion();
    const localVersion   = await getLocalVersion();

    console.log('Guide sync check — remote:', remoteVersion, 'local:', localVersion, 'force:', force);

    const isUpToDate =
      !force &&
      remoteVersion !== null &&
      localVersion === String(remoteVersion);

    if (isUpToDate) {
      console.log('Guides already up to date, skipping fetch.');
      const cached = await getCachedGuides();
      return { updated: false, guides: cached };
    }

    console.log('Fetching fresh guides from Supabase...');
    const rawGuides = await fetchAllGuidesFromSupabase();
    console.log(`Fetched ${rawGuides.length} guides.`);

    const processedGuides = await Promise.all(
      rawGuides.map(processGuideImages)
    );

    await cacheGuidesLocally(processedGuides, remoteVersion ?? Date.now());
    console.log('Guides cached locally. New version:', remoteVersion ?? Date.now());
    return { updated: true, guides: processedGuides };

  } catch (err) {
    console.log('Guide sync failed, falling back to cache:', err);
    const cached = await getCachedGuides();
    return { updated: false, guides: cached, error: err };
  }
}