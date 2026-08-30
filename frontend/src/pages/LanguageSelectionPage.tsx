import { useSetLanguage } from '../contexts/LanguageContext';

export function LanguageSelectionPage() {
  const setLanguage = useSetLanguage();

  const handleLanguageSelect = (lang: 'en' | 'hi' | 'mr') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-bg-light p-4">
      <div className="mobile-container max-w-md text-center">
        {/* Government Header Style */}
        <div className="mb-8">
          <div className="text-5xl mb-4">🇮🇳</div>
          <h1 className="text-3xl font-bold text-gov-green mb-2">KrishiMitra</h1>
          <p className="text-gov-text-gray text-sm">कृषि सहायक | शेतकरी मित्र</p>
          <div className="mt-4 text-xs text-gov-text-gray">
            <div className="text-gov-green font-semibold">Team Airavata</div>
            <div className="mt-1">Agriculture Assistant Platform</div>
          </div>
        </div>

        {/* Language Instruction */}
        <div className="mb-8 gov-card">
          <p className="text-lg font-semibold text-gov-green mb-3">
            Choose your language
          </p>
          <p className="text-sm text-gov-text-gray mb-1">अपनी भाषा चुनें</p>
          <p className="text-sm text-gov-text-gray">आपली भाषा निवडा</p>
        </div>

        {/* Language Buttons - Large tap targets */}
        <div className="space-y-4">
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full gov-button gov-button-primary text-xl py-5"
          >
            English
          </button>

          <button
            onClick={() => handleLanguageSelect('hi')}
            className="w-full gov-button gov-button-primary text-xl py-5"
          >
            हिंदी (Hindi)
          </button>

          <button
            onClick={() => handleLanguageSelect('mr')}
            className="w-full gov-button gov-button-primary text-xl py-5"
          >
            मराठी (Marathi)
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gov-text-gray bilingual-text">
            This platform is a prototype developed for hackathon demonstration
          </p>
          <p className="mt-2 text-xs font-semibold text-gov-green">
            Team Airavata
          </p>
        </div>
      </div>
    </div>
  );
}
