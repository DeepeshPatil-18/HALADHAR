import { useLanguage } from '../contexts/LanguageContext';
import { translations } from './translations';
import type { Language, TranslationKey } from './translations';

export interface UseTranslationResult {
  /** Translate a known key.  Falls back to English, then to the key itself — never undefined/null/empty. */
  t: (key: TranslationKey) => string;
  /** The currently active language code. */
  language: Language;
}

/**
 * Returns `{ t, language }` for the active language.
 *
 * Fallback chain:
 *   1. translations[language][key]
 *   2. translations['en'][key]
 *   3. key itself  (ensures non-empty string for any unknown key at runtime)
 */
export function useTranslation(): UseTranslationResult {
  const language = useLanguage();

  const t = (key: TranslationKey): string => {
    const inLanguage = translations[language]?.[key];
    if (inLanguage) return inLanguage;

    const inEnglish = translations['en']?.[key];
    if (inEnglish) return inEnglish;

    // Final safety net: return the key itself so the UI is never blank.
    return key as string;
  };

  return { t, language };
}
