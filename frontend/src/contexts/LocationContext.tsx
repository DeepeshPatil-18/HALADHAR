/**
 * LocationContext — makes the shared UserLocation available to all pages
 * without prop-drilling.
 *
 * Wraps <App> so every route gets the same location instance.
 */

import { createContext, useContext, ReactNode } from 'react';
import { useUserLocation } from '../hooks/useUserLocation';
import type { UserLocation, LocationStatus } from '../hooks/useUserLocation';

interface LocationContextValue {
  status: LocationStatus;
  location: UserLocation | null;
  label: string;
  requestLocation: () => void;
  setManualLocation: (city: string, district?: string, state?: string) => void;
}

const LocationContext = createContext<LocationContextValue>({
  status: 'detecting',
  location: null,
  label: '',
  requestLocation: () => {},
  setManualLocation: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const loc = useUserLocation();
  return <LocationContext.Provider value={loc}>{children}</LocationContext.Provider>;
}

/** Use this in any component to get the current user location */
export function useLocation() {
  return useContext(LocationContext);
}
