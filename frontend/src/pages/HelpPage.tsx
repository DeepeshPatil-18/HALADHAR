import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Phone, CheckCircle, FileText,
  Users, AlertCircle, Tractor, Droplets, Sun, Home, Sprout, X
} from 'lucide-react';
import { schemeApi, type Scheme } from '../services/schemeApi';
import { useTranslation } from '../i18n/useTranslation';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

const ICON_MAP: Record<string, React.ReactElement> = {
  Tractor:  <Tractor  size={24} strokeWidth={2} />,
  Droplets: <Droplets size={24} strokeWidth={2} />,
  Sun:      <Sun      size={24} strokeWidth={2} />,
  Home:     <Home     size={24} strokeWidth={2} />,
  Sprout:   <Sprout   size={24} strokeWidth={2} />,
};

export function HelpPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { ht } = useHaladharTranslation();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categorySchemes, setCategorySchemes] = useState<Scheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'equipment', icon: 'Tractor',  title: t('help.equipment'),  desc: t('help.equipmentDesc') },
    { id: 'irrigation',icon: 'Droplets', title: t('help.irrigation'), desc: t('help.irrigationDesc') },
    { id: 'solar',     icon: 'Sun',      title: t('help.solar'),      desc: t('help.solarDesc') },
    { id: 'polyhouse', icon: 'Home',     title: t('help.polyhouse'),  desc: t('help.polyhouseDesc') },
    { id: 'allied',    icon: 'Sprout',   title: t('help.allied'),     desc: t('help.alliedDesc') },
    { id: 'modern',    icon: 'Sprout',   title: t('help.modern'),     desc: t('help.modernDesc') },
  ];

  const govSchemes = [
    t('help.pmKisan'),
    t('help.cropInsurance'),
    t('help.soilHealth'),
    t('help.mahaDBT'),
  ];

  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    schemeApi.getSchemesByCategory(selectedCategory)
      .then(s => setCategorySchemes(s))
      .catch(() => setCategorySchemes([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const closeModal = () => {
    setSelectedCategory(null);
    setCategorySchemes([]);
    setSelectedScheme(null);
  };

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            <ChevronLeft size={24} color="var(--haladhar-text-primary)" />
          </button>
          <h1 className="haladhar-heading" style={{ margin: 0, marginLeft: 'var(--space-sm)' }}>
            {ht('haladhar.schemes.title')}
          </h1>
        </div>

        {/* Summary */}
        <p className="haladhar-body" style={{ marginBottom: 'var(--space-lg)' }}>
          {t('help.schemesSummary')}
        </p>

        {/* Known schemes list */}
        <div className="haladhar-card" style={{ marginBottom: 'var(--space-lg)' }}>
          {govSchemes.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) 0',
              borderBottom: i < govSchemes.length - 1 ? '1px solid var(--haladhar-border-light)' : 'none',
            }}>
              <CheckCircle size={18} color="var(--haladhar-green)" style={{ flexShrink: 0 }} />
              <span className="haladhar-body">{s}</span>
            </div>
          ))}
        </div>

        {/* Subsidy categories */}
        <p className="haladhar-subheading" style={{ marginBottom: 'var(--space-md)' }}>
          {t('help.subsidySchemes')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              className="haladhar-service-box"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="haladhar-service-icon" style={{ color: 'var(--haladhar-green)' }}>
                {ICON_MAP[cat.icon]}
              </div>
              <div className="haladhar-service-content">
                <p className="haladhar-service-title">{cat.title}</p>
                <p className="haladhar-service-desc">{cat.desc}</p>
              </div>
              <ChevronRight size={20} color="var(--haladhar-text-muted)" />
            </button>
          ))}
        </div>

        {/* Kisan Call Centre */}
        <div className="haladhar-divider" />
        <div className="haladhar-alert haladhar-alert-info" style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
            <Phone size={20} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{t('help.kisanCallCenter')}</p>
              <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)' }}>{t('help.freeService')}</p>
              <a
                href="tel:1800-180-1551"
                className="haladhar-button haladhar-button-primary"
                style={{ display: 'inline-flex', textDecoration: 'none' }}
              >
                <Phone size={18} />
                {t('help.callNumber')}
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="haladhar-alert haladhar-alert-warning" style={{ marginTop: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 'var(--text-sm)' }}>{t('help.disclaimerText')}</p>
          </div>
        </div>

      </main>

      {/* ---- SCHEMES MODAL ---- */}
      {selectedCategory && !selectedScheme && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', width: '100%', maxWidth: 'var(--mobile-max)',
              borderRadius: '16px 16px 0 0', maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            {/* Modal header */}
            <div style={{
              position: 'sticky', top: 0, background: 'white',
              padding: 'var(--space-md)', borderBottom: '1px solid var(--haladhar-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h2 className="haladhar-subheading" style={{ margin: 0 }}>
                {categories.find(c => c.id === selectedCategory)?.title}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--haladhar-text-muted)" />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 'var(--space-md)' }}>
              {loading && (
                <div className="haladhar-loading">
                  <div className="haladhar-spinner" />
                  <p className="haladhar-caption">{t('schemes.loading')}</p>
                </div>
              )}

              {!loading && categorySchemes.length === 0 && (
                <div>
                  <div className="haladhar-alert haladhar-alert-warning" style={{ marginBottom: 'var(--space-md)' }}>
                    <p style={{ fontSize: 'var(--text-sm)' }}>{t('help.schemeComingSoon')}</p>
                  </div>
                  <a href="tel:1800-180-1551"
                    className="haladhar-button haladhar-button-primary"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                    <Phone size={18} />
                    {t('help.callNumber')}
                  </a>
                </div>
              )}

              {!loading && categorySchemes.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {categorySchemes.map(scheme => (
                    <button
                      key={scheme.id}
                      className="haladhar-service-box"
                      onClick={() => setSelectedScheme(scheme)}
                      style={{ flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
                    >
                      <p className="haladhar-service-title">{scheme.name}</p>
                      <p className="haladhar-service-desc">{scheme.description}</p>
                      {scheme.subsidy && (
                        <span style={{
                          marginTop: 'var(--space-xs)',
                          fontSize: 'var(--text-xs)', fontWeight: 700,
                          color: 'var(--haladhar-green)',
                          background: '#f0fdf4', padding: '2px 8px',
                          borderRadius: 'var(--radius-md)',
                        }}>
                          {scheme.subsidy}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- SCHEME DETAIL MODAL ---- */}
      {selectedScheme && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', width: '100%', maxWidth: 'var(--mobile-max)',
              borderRadius: '16px 16px 0 0', maxHeight: '95vh', overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              position: 'sticky', top: 0, background: 'white',
              padding: 'var(--space-md)', borderBottom: '1px solid var(--haladhar-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <h2 className="haladhar-subheading" style={{ margin: 0, flex: 1, paddingRight: 'var(--space-md)' }}>
                {selectedScheme.name}
              </h2>
              <button onClick={closeModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--haladhar-text-muted)" />
              </button>
            </div>

            {/* Detail body */}
            <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <p className="haladhar-body">{selectedScheme.description}</p>

              {/* Benefit */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <CheckCircle size={20} color="var(--haladhar-green)" />
                  <p className="haladhar-subheading" style={{ margin: 0 }}>{t('schemes.whatHelp')}</p>
                </div>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}>
                  <p style={{ fontWeight: 700, color: '#15803d' }}>{selectedScheme.benefit}</p>
                  {selectedScheme.subsidy && <p style={{ fontSize: 'var(--text-sm)', color: '#166534', marginTop: 'var(--space-xs)' }}>{selectedScheme.subsidy}</p>}
                </div>
              </div>

              {/* Eligibility */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <Users size={20} color="var(--haladhar-blue)" />
                  <p className="haladhar-subheading" style={{ margin: 0 }}>{t('schemes.whoEligible')}</p>
                </div>
                {selectedScheme.eligibility.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                    <CheckCircle size={16} color="var(--haladhar-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p className="haladhar-body">{item}</p>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <FileText size={20} color="#ea580c" />
                  <p className="haladhar-subheading" style={{ margin: 0 }}>{t('schemes.requiredDocs')}</p>
                </div>
                {selectedScheme.documents.map((doc, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                    <FileText size={16} color="var(--haladhar-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p className="haladhar-body">{doc}</p>
                  </div>
                ))}
              </div>

              {/* How to apply */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <FileText size={20} color="#9333ea" />
                  <p className="haladhar-subheading" style={{ margin: 0 }}>{t('schemes.howToApply')}</p>
                </div>
                {selectedScheme.applicationProcess.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'var(--haladhar-green)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 'var(--text-xs)', fontWeight: 700, flexShrink: 0,
                    }}>{i + 1}</div>
                    <p className="haladhar-body">{step}</p>
                  </div>
                ))}
              </div>

              {/* Apply buttons */}
              {selectedScheme.applicationUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--haladhar-border)' }}>
                  <a
                    href={selectedScheme.applicationUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="haladhar-button haladhar-button-primary"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    {t('schemes.applyButton')}
                  </a>
                  {selectedScheme.statusCheckUrl && (
                    <a
                      href={selectedScheme.statusCheckUrl}
                      target="_blank" rel="noopener noreferrer"
                      className="haladhar-button haladhar-button-secondary"
                      style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                    >
                      {t('schemes.statusButton')}
                    </a>
                  )}
                </div>
              )}

              {/* Source */}
              <p className="haladhar-caption">
                {t('schemes.sourceUrl')}: {selectedScheme.source} · {t('help.lastUpdated')}: {selectedScheme.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
