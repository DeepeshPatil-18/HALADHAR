import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useLanguage, useSetLanguage } from '../contexts/LanguageContext';

export function DashboardHeader() {
  const language = useLanguage();
  const setLanguage = useSetLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languageNames: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी'
  };

  const languages: Array<{ code: 'en' | 'hi' | 'mr'; name: string }> = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'mr', name: 'मराठी' }
  ];

  const handleLanguageChange = (lang: 'en' | 'hi' | 'mr') => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo.png" 
            alt="KrishiMitra" 
            className="w-9 h-9 object-contain"
          />
          <span className="text-[20px] font-bold text-[#0b5e2c] tracking-tight">
            KrishiMitra
          </span>
        </div>
        
        {/* Language Selection Dropdown - Dynamic with menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg 
                      bg-[#0b5e2c] text-white text-[13px] font-semibold
                      hover:bg-[#094d24] active:scale-95 transition-all"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            title="Change language"
            aria-label={`Current language: ${languageNames[language]}`}
          >
            <Globe size={17} strokeWidth={2.5} />
            <span>{languageNames[language]}</span>
          </button>

          {/* Language Menu Dropdown */}
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors
                    ${language === lang.code 
                      ? 'bg-[#0b5e2c] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                >
                  {lang.name}
                  {language === lang.code && ' ✓'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
