import { useState, useEffect, useCallback } from 'react';
import { syncGuides, getCachedGuides } from '../services/guidesSync';

// NOTE: adjust the export name below to match whatever guides.js
// actually exports (default export vs named `GUIDES`) — send me that
// file and I'll fix this import exactly.
import { GUIDES as BUNDLED_GUIDES } from '../data/guides';

export function useGuides() {
  const [guides, setGuides]   = useState(BUNDLED_GUIDES); // instant, never blank
  const [loading, setLoading] = useState(true);
  const [synced, setSynced]   = useState(false); // true once a real sync has completed at least once

  const loadGuides = useCallback(async () => {
    // 1. Show cached data immediately if we have it — instant + offline-safe
    const cached = await getCachedGuides();
    if (cached && cached.length > 0) {
      setGuides(cached);
    }

    // 2. Sync in the background. Only overwrite the UI if it actually
    //    returned something — a failed/offline sync keeps showing
    //    whatever we already had (cache or bundled fallback).
    const result = await syncGuides();
    if (result.guides && result.guides.length > 0) {
      setGuides(result.guides);
      setSynced(true);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  // Exposed for a manual pull-to-refresh if you want one later
  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await syncGuides({ force: true });
    if (result.guides && result.guides.length > 0) {
      setGuides(result.guides);
      setSynced(true);
    }
    setLoading(false);
  }, []);

  return { guides, loading, synced, refresh };
}