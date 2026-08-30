import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import { BlackoutProvider } from './contexts/BlackoutContext';
import { SignInPage } from './pages/SignInPage';
import { LanguageSelectionPage } from './pages/LanguageSelectionPage';
import { HomePage } from './pages/HomePage';
import { MyFarmPage } from './pages/MyFarmPage';
import { CropPage } from './pages/CropPage';
import { WaterPage } from './pages/WaterPage';
import { ServicesPage } from './pages/ServicesPage';
import { MorePage } from './pages/MorePage';
import { DiseasePage } from './pages/DiseasePage';
import { EducationPage } from './pages/EducationPage';
import { ProfilePage } from './pages/ProfilePage';
import { WhatsAroundMePage } from './pages/WhatsAroundMePage';
import { CommunityPage } from './pages/CommunityPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { AlliedGuideDetailsPage } from './pages/AlliedGuideDetailsPage';
import MarketLinkagePage from './pages/MarketLinkagePage';
import { BazaarPage } from './pages/BazaarPage';
import { WeatherPage } from './pages/WeatherPage';
import { HelpPage } from './pages/HelpPage';
import { AlliedBazarPage } from './pages/AlliedBazarPage';
import { AIChatPage } from './pages/AIChatPage';
import { SystemRecoveryPage } from './pages/SystemRecoveryPage';
import { LabourMachineryPage } from './pages/LabourMachineryPage';

function AppRouter() {
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, isGuest } = useAuth();

  useEffect(() => {
    const lang = localStorage.getItem('language');
    if (!lang) {
      localStorage.setItem('language', 'mr');
      setShowLanguageSelection(false);
    } else {
      setShowLanguageSelection(false);
    }
    setLoading(false);
  }, []);

  // Wait for both local loading and supabase auth check
  if (loading || authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f0' }}>
        <div className="haladhar-spinner" />
      </div>
    );
  }

  if (showLanguageSelection) {
    return <LanguageSelectionPage />;
  }

  // Auth guard: show sign-in if not authenticated and not in guest mode
  const isAuthenticated = !!user || isGuest;

  return (
    <Routes>
      {/* Public: sign-in — redirect to home if already authenticated */}
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignInPage />}
      />

      {/* Protected: redirect to sign-in if not authenticated */}
      <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/signin" replace />} />
      <Route path="/farm"    element={isAuthenticated ? <MyFarmPage />    : <Navigate to="/signin" replace />} />
      <Route path="/crop"    element={isAuthenticated ? <CropPage />      : <Navigate to="/signin" replace />} />
      <Route path="/water"   element={isAuthenticated ? <WaterPage />     : <Navigate to="/signin" replace />} />
      <Route path="/disease" element={isAuthenticated ? <DiseasePage />   : <Navigate to="/signin" replace />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage />   : <Navigate to="/signin" replace />} />
      <Route path="/more"    element={isAuthenticated ? <MorePage />      : <Navigate to="/signin" replace />} />
      <Route path="/ai"      element={isAuthenticated ? <AIChatPage />    : <Navigate to="/signin" replace />} />

      {/* Public routes — accessible without sign-in */}
      <Route path="/education"  element={<EducationPage />} />
      <Route path="/services"   element={<ServicesPage />} />
      <Route path="/around"     element={<WhatsAroundMePage />} />
      <Route path="/around/allied-bazar" element={<AlliedBazarPage />} />
      <Route path="/community"  element={<CommunityPage />} />
      <Route path="/community/event/:eventId"  element={<EventDetailsPage />} />
      <Route path="/community/guide/:guideId"  element={<AlliedGuideDetailsPage />} />
      <Route path="/market"  element={<MarketLinkagePage />} />
      <Route path="/bazaar"  element={<BazaarPage />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/help"    element={<HelpPage />} />
      <Route path="/labour"  element={<LabourMachineryPage />} />
      {/* Developer / Judge — Blackout resilience dashboard */}
      <Route path="/system-recovery" element={<SystemRecoveryPage />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/signin'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <LocationProvider>
            <BlackoutProvider>
              <AppRouter />
            </BlackoutProvider>
          </LocationProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
