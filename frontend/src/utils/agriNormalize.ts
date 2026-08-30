/**
 * agriNormalize — lightweight agriculture term normalization.
 *
 * Corrects common speech-recognition errors for Indian crop and service names
 * before sending text to the HALADHAR AI assistant.
 *
 * Rules are ordered: multi-word / most-specific patterns first.
 * Only fixes the canonical term — the original user message is preserved
 * in the chat UI (we show rawText, send normalized text to the API).
 */

interface NormRule {
  pattern: RegExp;
  canonical: string;
  /** Human-readable label shown as a correction hint */
  display: string;
}

const RULES: NormRule[] = [

  // ── Soybean (primary issue: "sonia" → soybean) ─────────────────────
  // Multi-word / Marathi phrase first
  { pattern: /सोयाबीनचा\s+भाव/gi,                                           canonical: 'soybean price',   display: 'Soybean price (सोयाबीनचा भाव)' },
  { pattern: /सोयाबीन/g,                                                     canonical: 'soybean',         display: 'Soybean (सोयाबीन)' },
  { pattern: /\b(sonia|sonya|sony|soya\s*beans?|soyabin|soyabean|soybin)\b/gi, canonical: 'soybean',      display: 'Soybean (सोयाबीन)' },

  // ── Onion ───────────────────────────────────────────────────────────
  { pattern: /(प्याज|कांदा)/g,                                              canonical: 'onion',           display: 'Onion (कांदा)' },
  { pattern: /\b(kaanda|kanda|pyaaz)\b/gi,                                   canonical: 'onion',           display: 'Onion (कांदा)' },

  // ── Wheat ───────────────────────────────────────────────────────────
  { pattern: /(गेहूं|गेहू|गहू)/g,                                           canonical: 'wheat',           display: 'Wheat (गेहूं)' },
  { pattern: /\b(gehu|gehun)\b/gi,                                            canonical: 'wheat',           display: 'Wheat (गेहूं)' },

  // ── Cotton ──────────────────────────────────────────────────────────
  { pattern: /(कापूस|कपास)/g,                                               canonical: 'cotton',          display: 'Cotton (कापूस)' },
  { pattern: /\b(kapus|kapas)\b/gi,                                           canonical: 'cotton',          display: 'Cotton (कापूस)' },

  // ── Paddy / Rice ────────────────────────────────────────────────────
  { pattern: /(धान|भात)/g,                                                   canonical: 'paddy',           display: 'Paddy (धान)' },
  { pattern: /\b(dhan|dhaan)\b/gi,                                            canonical: 'paddy',           display: 'Paddy (धान)' },

  // ── Maize ───────────────────────────────────────────────────────────
  { pattern: /(मक्का|मकई)/g,                                                canonical: 'maize',           display: 'Maize (मक्का)' },
  { pattern: /\b(makka|makai|corn)\b/gi,                                      canonical: 'maize',           display: 'Maize (मक्का)' },

  // ── Tomato ──────────────────────────────────────────────────────────
  { pattern: /(टोमॅटो|टमाटर)/g,                                            canonical: 'tomato',          display: 'Tomato (टोमॅटो)' },
  { pattern: /\b(tamatar|tamata)\b/gi,                                        canonical: 'tomato',          display: 'Tomato (टोमॅटो)' },

  // ── Chilli ──────────────────────────────────────────────────────────
  { pattern: /(मिर्च|मिरची)/g,                                              canonical: 'chilli',          display: 'Chilli (मिर्च)' },
  { pattern: /\b(mirchi|mirchee|chilli\s*pepper)\b/gi,                        canonical: 'chilli',          display: 'Chilli (मिर्च)' },

  // ── Turmeric ────────────────────────────────────────────────────────
  { pattern: /(हल्दी|हळद)/g,                                                canonical: 'turmeric',        display: 'Turmeric (हळद)' },
  { pattern: /\bhaldi\b/gi,                                                   canonical: 'turmeric',        display: 'Turmeric (हळद)' },

  // ── Chickpea / Gram ─────────────────────────────────────────────────
  { pattern: /(हरभरा|चना)/g,                                                 canonical: 'chickpea',        display: 'Chickpea (हरभरा)' },
  { pattern: /\b(chana|channa)\b/gi,                                          canonical: 'chickpea',        display: 'Chickpea (हरभरा)' },

  // ── Groundnut / Peanut ──────────────────────────────────────────────
  { pattern: /(मूंगफली|शेंगदाणे)/g,                                         canonical: 'groundnut',       display: 'Groundnut (शेंगदाणे)' },
  { pattern: /\b(moongphali|shengdane|peanut)\b/gi,                           canonical: 'groundnut',       display: 'Groundnut (शेंगदाणे)' },

  // ── Mustard ─────────────────────────────────────────────────────────
  { pattern: /(सरसों|मोहरी)/g,                                               canonical: 'mustard',         display: 'Mustard (सरसों)' },
  { pattern: /\b(sarson|mohri)\b/gi,                                          canonical: 'mustard',         display: 'Mustard (सरसों)' },

  // ── Jowar / Sorghum ─────────────────────────────────────────────────
  { pattern: /ज्वार/g,                                                       canonical: 'jowar',           display: 'Jowar (ज्वार)' },
  { pattern: /\b(jawar|jwar|sorghum)\b/gi,                                    canonical: 'jowar',           display: 'Jowar (ज्वार)' },

  // ── Bajra / Pearl Millet ────────────────────────────────────────────
  { pattern: /बाजरा/g,                                                       canonical: 'bajra',           display: 'Bajra (बाजरा)' },
  { pattern: /\b(bajri|pearl\s*millet)\b/gi,                                  canonical: 'bajra',           display: 'Bajra (बाजरा)' },

  // ── Arhar / Tur Dal ─────────────────────────────────────────────────
  { pattern: /(अरहर|तूर)/g,                                                  canonical: 'arhar',           display: 'Arhar/Tur (अरहर)' },
  { pattern: /\b(tur|toor|pigeon\s*pea)\b/gi,                                 canonical: 'arhar',           display: 'Arhar/Tur (अरहर)' },

  // ── Moong / Green Gram ──────────────────────────────────────────────
  { pattern: /(मूंग|मुग)/g,                                                  canonical: 'moong',           display: 'Moong (मूंग)' },
  { pattern: /\b(mung|green\s*gram)\b/gi,                                     canonical: 'moong',           display: 'Moong (मूंग)' },

  // ── Urad / Black Gram ───────────────────────────────────────────────
  { pattern: /(उड़द|उडीद)/g,                                                 canonical: 'urad',            display: 'Urad (उड़द)' },
  { pattern: /\b(udid|black\s*gram)\b/gi,                                     canonical: 'urad',            display: 'Urad (उड़द)' },

  // ── Sugarcane ───────────────────────────────────────────────────────
  { pattern: /(गन्ना|ऊस)/g,                                                  canonical: 'sugarcane',       display: 'Sugarcane (ऊस)' },
  { pattern: /\b(ganna|oos)\b/gi,                                             canonical: 'sugarcane',       display: 'Sugarcane (ऊस)' },

  // ── Garlic ──────────────────────────────────────────────────────────
  { pattern: /(लहसुन|लसूण)/g,                                               canonical: 'garlic',          display: 'Garlic (लसूण)' },
  { pattern: /\b(lahsun|lasun)\b/gi,                                          canonical: 'garlic',          display: 'Garlic (लसूण)' },

  // ── Ginger ──────────────────────────────────────────────────────────
  { pattern: /(अदरक|आलं)/g,                                                  canonical: 'ginger',          display: 'Ginger (अदरक)' },
  { pattern: /\b(adrak|aale)\b/gi,                                            canonical: 'ginger',          display: 'Ginger (अदरक)' },

  // ── Potato ──────────────────────────────────────────────────────────
  { pattern: /आलू/g,                                                          canonical: 'potato',          display: 'Potato (आलू)' },
  { pattern: /\b(aalu|aloo)\b/gi,                                             canonical: 'potato',          display: 'Potato (आलू)' },

  // ── Rice (general) ──────────────────────────────────────────────────
  { pattern: /(चावल|तांदूळ)/g,                                               canonical: 'rice',            display: 'Rice (चावल)' },
  { pattern: /\b(chawal|tandul)\b/gi,                                         canonical: 'rice',            display: 'Rice (चावल)' },
];

export interface NormResult {
  /** The normalized text (send this to the AI) */
  text: string;
  /** Whether any corrections were applied */
  changed: boolean;
  /** Human-readable labels of applied corrections */
  corrections: string[];
}

/**
 * Normalize agricultural terms in a user's message.
 *
 * @param input - Raw user message (may contain STT errors or Hindi/Marathi crop names)
 * @returns NormResult with the corrected text and a list of corrections applied
 *
 * @example
 * normalizeAgriTerms("what's the price of sonia?")
 * // → { text: "what's the price of soybean?", changed: true, corrections: ["Soybean (सोयाबीन)"] }
 */
export function normalizeAgriTerms(input: string): NormResult {
  let text = input;
  const corrections: string[] = [];

  for (const rule of RULES) {
    const replaced = text.replace(rule.pattern, rule.canonical);
    if (replaced !== text) {
      corrections.push(rule.display);
      text = replaced;
    }
  }

  return { text, changed: corrections.length > 0, corrections };
}
