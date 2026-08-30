import { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';

interface PosterData {
  id: string;
  type: 'weather' | 'market' | 'scheme' | 'allied' | 'event';
  image: string;
  title: string;
  subtitle: string;
  route: string;
  priority: number;
}

export function usePosterData() {
  const [posters, setPosters] = useState<PosterData[]>([]);
  const [loading, setLoading] = useState(true);
  const userLoc = useLocation();

  // Default fallback location
  const DEFAULT_LOC = { name: 'India', district: '', state: '', lat: 20.59, lon: 78.96 };

  useEffect(() => {
    fetchPosterData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoc.status]); // Refetch when location changes

  const fetchPosterData = async () => {
    try {
      const postersData: PosterData[] = [];

      // POSTER 1: Event Details/Timeline (ALWAYS FIRST - Priority 0)
      postersData.push({
        id: 'event-1',
        type: 'event',
        image: '/Posters/eventtimeline.png',
        title: 'आगामी कार्यक्रम',
        subtitle: 'कृषि प्रशिक्षण और समुदाय कार्यक्रम',
        route: '/community',
        priority: 0, // ALWAYS FIRST
      });

      // POSTER 2: Weather Data (Priority 1-2)
      try {
        const loc = userLoc.location;
        const lat     = loc?.latitude  && loc.latitude  !== 0 ? loc.latitude  : DEFAULT_LOC.lat;
        const lon     = loc?.longitude && loc.longitude !== 0 ? loc.longitude : DEFAULT_LOC.lon;
        const name    = loc?.city || loc?.district || DEFAULT_LOC.name;
        const state   = loc?.state?.toLowerCase() || DEFAULT_LOC.state;
        const district= loc?.district || DEFAULT_LOC.district;

        const weatherParams = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          location: name,
          state: state.toLowerCase(),
          district: district,
        });

        const weatherRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/weather?${weatherParams}`
        );

        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          
          // Check for weather alerts
          const hasAlert = weatherData.alerts && weatherData.alerts.length > 0;

          // Always add weather poster
          const nextRainDay = weatherData.next_rain_event;
          let subtitle = 'मौसम अपडेट देखें';
          
          if (nextRainDay && nextRainDay.date) {
            const rainAmount = nextRainDay.amount_mm || 0;
            subtitle = `${nextRainDay.date_label}: ${rainAmount.toFixed(0)} mm बारिश संभव`;
          } else if (hasAlert) {
            subtitle = 'मौसम चेतावनी देखें';
          } else {
            subtitle = `${weatherData.current?.temperature_c || 0}°C - ${name}`;
          }

          postersData.push({
            id: 'weather-1',
            type: 'weather',
            image: '/Posters/climatealert.png',
            title: 'मौसम अपडेट',
            subtitle: subtitle,
            route: '/weather',
            priority: hasAlert ? 1 : 2,
          });
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        // Add default weather poster
        postersData.push({
          id: 'weather-1',
          type: 'weather',
          image: '/Posters/climatealert.png',
          title: 'मौसम अपडेट',
          subtitle: 'आज का मौसम देखें',
          route: '/weather',
          priority: 2,
        });
      }

      // POSTER 3: Market Price Data (Priority 3-4)
      try {
        const loc = userLoc.location;
        const state = loc?.state || DEFAULT_LOC.state;
        
        const marketParams = new URLSearchParams({
          commodity: 'Onion',
          state: state,
        });

        const marketRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/mandi-price?${marketParams}`
        );

        if (marketRes.ok) {
          const marketData = await marketRes.json();
          
          if (marketData.prices && marketData.prices.length > 0) {
            const price = marketData.prices[0];
            const priceRs = price.price_per_quintal;
            const trend = price.trend || 'same';
            
            let subtitle = `₹${priceRs.toLocaleString()} प्रति क्विंटल`;
            if (trend === 'up') {
              subtitle = `भाव बढ़े: ${subtitle}`;
            }

            postersData.push({
              id: 'market-1',
              type: 'market',
              image: '/Posters/marketalert.png',
              title: `${price.commodity} का भाव`,
              subtitle: subtitle,
              route: '/around',
              priority: trend === 'up' ? 3 : 4,
            });
          }
        }
      } catch (err) {
        console.error('Market fetch error:', err);
        // Add default market poster
        postersData.push({
          id: 'market-1',
          type: 'market',
          image: '/Posters/marketalert.png',
          title: 'बाज़ार भाव',
          subtitle: 'आज का भाव देखें',
          route: '/around',
          priority: 4,
        });
      }

      // POSTER 4: Scheme Poster (Priority 5)
      postersData.push({
        id: 'scheme-1',
        type: 'scheme',
        image: '/Posters/schemes.webp',
        title: 'सरकारी योजनाएं',
        subtitle: 'किसानों के लिए नई योजनाएं देखें',
        route: '/help',
        priority: 5,
      });

      // POSTER 5: Allied Farming Poster (Priority 6)
      postersData.push({
        id: 'allied-1',
        type: 'allied',
        image: '/Posters/alliedfarming.png',
        title: 'सहायक खेती',
        subtitle: 'दूध, मछली, मुर्गी पालन के भाव देखें',
        route: '/around/allied-bazar',
        priority: 6,
      });

      // Sort by priority (lower number = higher priority)
      postersData.sort((a, b) => a.priority - b.priority);

      // Always show exactly 5 posters
      setPosters(postersData.slice(0, 5));
    } catch (err) {
      console.error('Poster data fetch error:', err);
      // Fallback: show all 5 static posters
      setPosters([
        {
          id: 'event-1',
          type: 'event',
          image: '/Posters/eventtimeline.png',
          title: 'आगामी कार्यक्रम',
          subtitle: 'कृषि प्रशिक्षण और समुदाय कार्यक्रम',
          route: '/community',
          priority: 0,
        },
        {
          id: 'weather-1',
          type: 'weather',
          image: '/Posters/climatealert.png',
          title: 'मौसम अपडेट',
          subtitle: 'आज का मौसम देखें',
          route: '/weather',
          priority: 1,
        },
        {
          id: 'market-1',
          type: 'market',
          image: '/Posters/marketalert.png',
          title: 'बाज़ार भाव',
          subtitle: 'आज का भाव देखें',
          route: '/around',
          priority: 2,
        },
        {
          id: 'scheme-1',
          type: 'scheme',
          image: '/Posters/schemes.webp',
          title: 'सरकारी योजनाएं',
          subtitle: 'किसानों के लिए नई योजनाएं देखें',
          route: '/help',
          priority: 3,
        },
        {
          id: 'allied-1',
          type: 'allied',
          image: '/Posters/alliedfarming.png',
          title: 'सहायक खेती',
          subtitle: 'दूध, मछली, मुर्गी पालन के भाव देखें',
          route: '/around/allied-bazar',
          priority: 4,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { posters, loading };
}
