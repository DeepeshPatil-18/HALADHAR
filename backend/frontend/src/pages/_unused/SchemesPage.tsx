import { useState, useEffect } from 'react';
import { HaladharHeader } from '../components/HaladharHeader';
import { useTranslation } from '../i18n/useTranslation';
import { api } from '../services/api';
import type { Scheme } from '../services/schemeApi';

export default function SchemesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'schemes' | 'training'>('schemes');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Fetch schemes on mount
  useEffect(() => {
    if (activeTab === 'schemes') {
      fetchSchemes('');
    }
  }, [activeTab]);

  const fetchSchemes = async (query: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.searchSchemes(query);
      setSchemes(data.schemes || []);
    } catch (err) {
      setError('Could not load schemes');
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchSchemes(searchQuery);
  };

  const quickSearchTerms = ['Poultry', 'Dairy', 'Beekeeping', 'Mushroom', 'Fish', 'Goat'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <HaladharHeader title="Schemes" />
      
      <main className="flex-1 content-with-nav">
        <div className="mobile-container py-4">
          {/* Page Title */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gov-green mb-1">
              {t('schemes.title') || 'Schemes & Training'}
            </h1>
            <p className="text-xs text-gov-text-gray">
              {t('schemes.subtitle') || 'Government schemes and training resources'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setActiveTab('schemes')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                activeTab === 'schemes'
                  ? 'bg-gov-green text-white'
                  : 'bg-white text-gov-text-gray border border-gov-border'
              }`}
            >
              📋 Schemes
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm ${
                activeTab === 'training'
                  ? 'bg-gov-green text-white'
                  : 'bg-white text-gov-text-gray border border-gov-border'
              }`}
            >
              🎓 Training
            </button>
          </div>

          {/* Schemes Tab */}
          {activeTab === 'schemes' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="gov-card">
                <h2 className="font-semibold text-gov-green mb-3">Search Schemes</h2>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name, enterprise type..."
                    className="gov-input flex-1 text-sm"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="gov-button gov-button-primary px-6"
                  >
                    🔍
                  </button>
                </div>

                {/* Quick Search */}
                <div>
                  <p className="text-xs text-gov-text-gray mb-2">Quick search:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSearchTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          fetchSchemes(term);
                        }}
                        className="px-3 py-1 text-xs bg-gov-bg-mint text-gov-green rounded-full border border-gov-green"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="text-center py-8">
                  <div className="loading-spinner mx-auto mb-2"></div>
                  <p className="text-sm text-gov-text-gray">Loading schemes...</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="gov-card bg-red-50 border-l-4 border-red-500">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Schemes List */}
              {!loading && schemes.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm text-gov-text-gray">
                    Found {schemes.length} scheme{schemes.length !== 1 ? 's' : ''}
                  </div>

                  {schemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      onClick={() => setSelectedScheme(scheme)}
                      className="gov-card cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gov-green flex-1">{scheme.name}</h3>
                        {scheme.benefits.subsidy_percentage && (
                          <span className="text-xs bg-gov-saffron text-white px-2 py-1 rounded-full ml-2">
                            {scheme.benefits.subsidy_percentage}% Subsidy
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gov-text-gray mb-2">{scheme.description}</p>
                      <div className="flex items-center justify-between text-xs text-gov-text-gray">
                        <span>{scheme.ministry}</span>
                        <span className="text-gov-saffron font-semibold">View Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && schemes.length === 0 && !error && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-gov-text-gray">
                    {searchQuery ? 'No schemes found. Try a different search.' : 'Search for schemes above'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="space-y-4">
              <div className="gov-card">
                <h2 className="text-lg font-semibold text-gov-green mb-2">Training Portal</h2>
                <p className="text-sm text-gov-text-gray mb-4">
                  Access training resources from ICAR, KVKs, and state agriculture departments
                </p>

                {/* Training Categories */}
                <div className="space-y-3">
                  {['Poultry Farming', 'Dairy Management', 'Beekeeping', 'Mushroom Cultivation', 
                    'Fish Farming', 'Vermicomposting'].map((training) => (
                    <div key={training} className="border border-gov-border rounded-lg p-3 hover:bg-gov-bg-mint transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gov-green">{training}</div>
                          <div className="text-xs text-gov-text-gray mt-1">
                            Videos, PDFs, and online courses
                          </div>
                        </div>
                        <span className="text-2xl">🎓</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gov-border">
                  <p className="text-xs text-gov-text-gray">
                    Training resources from verified government sources
                  </p>
                </div>
              </div>

              <div className="gov-card bg-blue-50 border-l-4 border-blue-500">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  ℹ️ About Training Resources
                </h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Curated from ICAR and KVK portals</li>
                  <li>• Available in multiple languages</li>
                  <li>• Free for all farmers</li>
                  <li>• Regularly updated content</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto rounded-t-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gov-border p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gov-green">{selectedScheme.name}</h2>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-2xl text-gov-text-gray hover:text-gov-green"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-gov-green mb-2">Description</h3>
                <p className="text-sm text-gov-text-gray">{selectedScheme.description}</p>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-semibold text-gov-green mb-2">Benefits</h3>
                {selectedScheme.benefits.subsidy_percentage && (
                  <div className="text-sm mb-2">
                    <span className="font-semibold">Subsidy:</span> {selectedScheme.benefits.subsidy_percentage}%
                  </div>
                )}
                <ul className="text-sm text-gov-text-gray space-y-1">
                  {selectedScheme.benefits.other_benefits.map((benefit, idx) => (
                    <li key={idx}>• {benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Eligibility */}
              <div>
                <h3 className="font-semibold text-gov-green mb-2">Eligibility</h3>
                <ul className="text-sm text-gov-text-gray space-y-1">
                  {selectedScheme.eligibility.conditions.map((condition, idx) => (
                    <li key={idx}>• {condition}</li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="font-semibold text-gov-green mb-2">Required Documents</h3>
                <ul className="text-sm text-gov-text-gray space-y-1">
                  {selectedScheme.application_process.required_documents.map((doc, idx) => (
                    <li key={idx}>• {doc}</li>
                  ))}
                </ul>
              </div>

              {/* How to Apply */}
              <div>
                <h3 className="font-semibold text-gov-green mb-2">How to Apply</h3>
                <p className="text-sm text-gov-text-gray mb-3">
                  {selectedScheme.application_process.how_to_apply}
                </p>
                {selectedScheme.contact_info.website && (
                  <a
                    href={selectedScheme.contact_info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gov-button gov-button-primary w-full text-center block"
                  >
                    Apply Online →
                  </a>
                )}
              </div>

              {/* Ministry */}
              <div className="pt-4 border-t border-gov-border text-xs text-gov-text-gray">
                <div><strong>Department:</strong> {selectedScheme.ministry}</div>
                {selectedScheme.state && (
                  <div className="mt-1"><strong>State:</strong> {selectedScheme.state}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
