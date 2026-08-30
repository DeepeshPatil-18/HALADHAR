import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { translations, type TranslationKey, type Language } from './translations';

/**
 * Property-Based Tests for Translation System
 * 
 * **Validates: Requirements 1.3, 1.5**
 * 
 * Property 1: Translation Completeness
 * Property 2: Translation Fallback Safety
 */

describe('Translation System Properties', () => {
  // Helper: Extract all translation keys from the TranslationKey type
  const getAllTranslationKeys = (): TranslationKey[] => {
    // Get all keys from the English dictionary (which is the source of truth)
    return Object.keys(translations.en) as TranslationKey[];
  };

  const allLanguages: Language[] = ['en', 'hi', 'mr'];
  const allKeys = getAllTranslationKeys();

  describe('Property 1: Translation Completeness', () => {
    /**
     * **Validates: Requirements 1.3, 1.5**
     * 
     * For every key in the dictionary, all three language codes 
     * have a non-empty string.
     */
    it('every translation key has a non-empty string in all languages', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary translation keys from the actual keys
          fc.constantFrom(...allKeys),
          (key: TranslationKey) => {
            // For each language, the translation must exist and be non-empty
            for (const lang of allLanguages) {
              const translation = translations[lang][key];
              
              // Check that translation exists
              expect(translation, 
                `Translation for key "${key}" in language "${lang}" is missing`
              ).toBeDefined();
              
              // Check that translation is a string
              expect(typeof translation, 
                `Translation for key "${key}" in language "${lang}" is not a string`
              ).toBe('string');
              
              // Check that translation is non-empty
              expect(translation.trim(), 
                `Translation for key "${key}" in language "${lang}" is empty`
              ).not.toBe('');
            }
          }
        ),
        { 
          numRuns: allKeys.length, // Test every single key
          verbose: true 
        }
      );
    });

    it('all languages have the same set of keys', () => {
      const enKeys = new Set(Object.keys(translations.en));
      const hiKeys = new Set(Object.keys(translations.hi));
      const mrKeys = new Set(Object.keys(translations.mr));

      // Check Hindi has all English keys
      for (const key of enKeys) {
        expect(hiKeys.has(key), 
          `Hindi translations missing key: ${key}`
        ).toBe(true);
      }

      // Check Marathi has all English keys
      for (const key of enKeys) {
        expect(mrKeys.has(key), 
          `Marathi translations missing key: ${key}`
        ).toBe(true);
      }

      // Check no extra keys in Hindi
      for (const key of hiKeys) {
        expect(enKeys.has(key), 
          `Hindi has extra key not in English: ${key}`
        ).toBe(true);
      }

      // Check no extra keys in Marathi
      for (const key of mrKeys) {
        expect(enKeys.has(key), 
          `Marathi has extra key not in English: ${key}`
        ).toBe(true);
      }

      // Verify counts match
      expect(hiKeys.size).toBe(enKeys.size);
      expect(mrKeys.size).toBe(enKeys.size);
    });
  });

  describe('Property 2: Translation Fallback Safety', () => {
    /**
     * **Validates: Requirements 1.3, 1.5**
     * 
     * The t(key) function always returns a non-empty string for any 
     * string input, including unknown keys.
     * 
     * We test the fallback logic by simulating the t() function behavior.
     */
    
    // Simulate the t() function from useTranslation
    const t = (language: Language, key: string): string => {
      const inLanguage = translations[language]?.[key as TranslationKey];
      if (inLanguage) return inLanguage;

      const inEnglish = translations['en']?.[key as TranslationKey];
      if (inEnglish) return inEnglish;

      // Final safety net: return the key itself
      return key;
    };

    it('t() always returns a non-empty string for known keys', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...allLanguages),
          fc.constantFrom(...allKeys),
          (language: Language, key: TranslationKey) => {
            const result = t(language, key);
            
            // Result must be defined
            expect(result).toBeDefined();
            
            // Result must be a string
            expect(typeof result).toBe('string');
            
            // Result must be non-empty
            expect(result.trim()).not.toBe('');
          }
        ),
        {
          numRuns: allLanguages.length * Math.min(100, allKeys.length),
          verbose: true
        }
      );
    });

    it('t() returns a non-empty string for unknown keys (returns key itself)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...allLanguages),
          // Generate arbitrary strings that are NOT valid translation keys
          fc.string({ minLength: 1, maxLength: 50 })
            .filter(s => !allKeys.includes(s as TranslationKey)),
          (language: Language, unknownKey: string) => {
            const result = t(language, unknownKey);
            
            // Result must be defined
            expect(result).toBeDefined();
            
            // Result must be a string
            expect(typeof result).toBe('string');
            
            // Result must be non-empty
            expect(result.trim()).not.toBe('');
            
            // For unknown keys, it should return the key itself
            expect(result).toBe(unknownKey);
          }
        ),
        {
          numRuns: 100,
          verbose: true
        }
      );
    });

    it('t() falls back to English when translation is missing in selected language', () => {
      // We can't easily test this with the current implementation since all keys
      // are present in all languages, but we can verify the fallback logic conceptually
      
      // Simulate a missing translation by temporarily creating a partial dictionary
      const mockTranslations = {
        en: { 'test.key': 'English value' },
        hi: {}, // Missing the key
        mr: {}, // Missing the key
      };

      const mockT = (language: Language, key: string): string => {
        const dict = mockTranslations[language] as Record<string, string>;
        const inLanguage = dict?.[key];
        if (inLanguage) return inLanguage;

        const enDict = mockTranslations['en'] as Record<string, string>;
        const inEnglish = enDict?.[key];
        if (inEnglish) return inEnglish;

        return key;
      };

      // Test fallback from Hindi to English
      expect(mockT('hi', 'test.key')).toBe('English value');
      
      // Test fallback from Marathi to English
      expect(mockT('mr', 'test.key')).toBe('English value');
      
      // Test English returns English
      expect(mockT('en', 'test.key')).toBe('English value');
    });

    it('t() never returns null, undefined, or empty string', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...allLanguages),
          fc.oneof(
            fc.constantFrom(...allKeys), // Known keys
            fc.string({ minLength: 1, maxLength: 30 }) // Any string including unknown keys
          ),
          (language: Language, key: string) => {
            const result = t(language, key);
            
            // Never null or undefined
            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            
            // Never empty string
            expect(result).not.toBe('');
            
            // Never only whitespace
            expect(result.trim()).not.toBe('');
          }
        ),
        {
          numRuns: 200,
          verbose: true
        }
      );
    });
  });
});
