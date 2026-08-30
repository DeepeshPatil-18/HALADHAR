/**
 * useUserLocation — single source of truth for device/user location.
 *
 * Priority order:
 *   1. Stored UserLocation object from localStorage (GPS-resolved, non-expired)
 *   2. Manual location from user profile (district string from profile save)
 *   3. Fresh GPS + Nominatim reverse-geocode
 *   4. Unavailable / permission denied
 *
 * Stores:
 *   localStorage key 'haladhar_location' → JSON of UserLocation
 *
 * Refresh interval: 10 minutes (maximumAge on GPS)
 */

import { useState, useEffect, useCallback } from 'react';

export type LocationStatus = 'detecting' | 'found' | 'denied' | 'unavailable';

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  accuracy?: number;
  source: 'gps' | 'manual';
  resolvedAt: number; // Date.now()
}

interface LocationState {
  status: LocationStatus;
  location: UserLocation | null;
  /** Display-friendly string: "Jalgaon, Maharashtra" or "Location unavailable" */
  label: string;
}

const STORAGE_KEY = 'haladhar_location';
const MAX_AGE_MS  = 10 * 60 * 1000; // 10 minutes

/* ── Nominatim reverse geocode ────────────────────────────────── */
async function nominatimReverse(lat: number, lon: number): Promise<{
  city?: string; district?: string; state?: string; country?: string
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return {};
    const d = await res.json();
    const a = d.address || {};
    return {
      city:     a.city     || a.town || a.village || a.hamlet || a.suburb || undefined,
      district: a.county   || a.state_district   || undefined,
      state:    a.state    || undefined,
      country:  a.country  || undefined,
    };
  } catch {
    return {};
  }
}

/* ── Load cached location from localStorage ──────────────────── */
function loadCached(): UserLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const loc: UserLocation = JSON.parse(raw);
    if (Date.now() - (loc.resolvedAt || 0) > MAX_AGE_MS) return null; // expired
    return loc;
  } catch {
    return null;
  }
}

/* ── Save location to localStorage ──────────────────────────── */
function saveLocation(loc: UserLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    // Also write legacy keys so other pages can still read them
    if (loc.city)     localStorage.setItem('userLocation', loc.city);
    if (loc.district) localStorage.setItem('userDistrict', loc.district);
  } catch {}
}

/* ── Build display label ─────────────────────────────────────── */
function buildLabel(loc: UserLocation): string {
  const parts = [loc.city, loc.state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : (loc.district || '');
}

/* ══════════════════════════════════════════════════════════════
   Hook
══════════════════════════════════════════════════════════════ */
export function useUserLocation() {
  const [state, setState] = useState<LocationState>(() => {
    // Try loading a valid cached location immediately (avoids flash)
    const cached = loadCached();
    if (cached) {
      return { status: 'found', location: cached, label: buildLabel(cached) };
    }
    // Check legacy manual profile entry
    const manual = localStorage.getItem('userLocation');
    const district = localStorage.getItem('userDistrict');
    if (manual || district) {
      const loc: UserLocation = {
        latitude: 0, longitude: 0,
        city: manual || undefined,
        district: district || undefined,
        source: 'manual',
        resolvedAt: Date.now(),
      };
      return { status: 'found', location: loc, label: manual || district || '' };
    }
    return { status: 'detecting', location: null, label: '' };
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, status: 'unavailable', location: null }));
      return;
    }

    setState(s => ({ ...s, status: 'detecting' }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const geo = await nominatimReverse(latitude, longitude);

        const loc: UserLocation = {
          latitude, longitude, accuracy,
          city:     geo.city,
          district: geo.district,
          state:    geo.state,
          country:  geo.country,
          source:   'gps',
          resolvedAt: Date.now(),
        };

        saveLocation(loc);

        setState({
          status:   'found',
          location: loc,
          label:    buildLabel(loc),
        });

        console.debug('[Location]', {
          latitude:  loc.latitude,
          longitude: loc.longitude,
          city:      loc.city,
          district:  loc.district,
          state:     loc.state,
          accuracy:  loc.accuracy,
          source:    loc.source,
        });
      },
      (err) => {
        console.debug('[Location] denied or error:', err.code, err.message);
        setState(s => ({ ...s, status: err.code === 1 ? 'denied' : 'unavailable', location: null }));
      },
      { timeout: 10_000, maximumAge: MAX_AGE_MS, enableHighAccuracy: false }
    );
  }, []);

  /* Set manual location (from profile or manual entry) */
  const setManualLocation = useCallback((city: string, district?: string, state?: string) => {
    const loc: UserLocation = {
      latitude: 0, longitude: 0,
      city, district, state,
      source: 'manual',
      resolvedAt: Date.now(),
    };
    saveLocation(loc);
    setState({ status: 'found', location: loc, label: buildLabel(loc) });
  }, []);

  /* Auto-request on mount only if not already found */
  useEffect(() => {
    if (state.status === 'found') return;
    requestLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...state, requestLocation, setManualLocation };
}
