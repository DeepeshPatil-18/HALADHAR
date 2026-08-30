// ---------------------------------------------------------------------------
// BuyerMatchCard Component
// Requirement 9.4–9.5: Display matched buyers with contact reveal
// ---------------------------------------------------------------------------

import { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { BuyerRequirement } from '../lib/marketMatching';

interface BuyerMatchCardProps {
  matchCount: number;
  buyers: BuyerRequirement[];
}

/**
 * Displays "X potential buyers found" and reveals contact details on tap.
 * 
 * **Validates: Requirements 9.4–9.5**
 */
export function BuyerMatchCard({ matchCount, buyers }: BuyerMatchCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (matchCount === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border-2 border-teal-500 p-4 shadow-sm">
      {/* Match count header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤝</span>
          <span className="font-semibold text-lg text-gray-900">
            {matchCount} {t('market.potentialBuyers')}
          </span>
        </div>
        <span className="text-gray-500 text-2xl">
          {expanded ? '▼' : '▶'}
        </span>
      </button>

      {/* Expanded buyer list */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t pt-3">
          {buyers.map((buyer) => (
            <div
              key={buyer.id}
              className="bg-teal-50 rounded-lg p-3 border border-teal-200"
            >
              <div className="flex flex-col gap-2">
                {/* Buyer details */}
                <div className="text-sm text-gray-700">
                  <p>
                    <strong>{t('market.product')}:</strong> {buyer.product}
                  </p>
                  <p>
                    <strong>{t('market.quantity')}:</strong> {buyer.quantity_needed} {buyer.unit}
                  </p>
                  {buyer.quality_grade && (
                    <p>
                      <strong>{t('market.quality')}:</strong> {buyer.quality_grade}
                    </p>
                  )}
                  {buyer.price_range_min !== null && buyer.price_range_max !== null && (
                    <p>
                      <strong>Price range:</strong> ₹{buyer.price_range_min} - ₹{buyer.price_range_max}
                    </p>
                  )}
                  <p>
                    <strong>Required by:</strong> {new Date(buyer.required_by).toLocaleDateString()}
                  </p>
                </div>

                {/* Contact button */}
                {buyer.contact_method && (
                  <a
                    href={
                      buyer.contact_method.startsWith('http')
                        ? buyer.contact_method
                        : `tel:${buyer.contact_method}`
                    }
                    className="inline-flex items-center justify-center px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {buyer.contact_method.includes('whatsapp') || buyer.contact_method.includes('wa.me')
                      ? '💬 WhatsApp'
                      : '📞 '}{' '}
                    {t('market.contactBuyer')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
