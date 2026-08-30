import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Check, Edit3, User, Phone, Home,
  Map, Layers, Globe, Sprout, Tractor, Leaf, Save,
  Building2, X, AlertCircle, CheckCircle2, Navigation,
} from 'lucide-react';
import { useAuth }             from '../contexts/AuthContext';
import { useSetLanguage }      from '../contexts/LanguageContext';
import { useTranslation }      from '../i18n/useTranslation';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import { supabase }            from '../lib/supabaseClient';
import '../styles/haladhar-design.css';

interface FarmerProfile {
  full_name: string;
  phone: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  enterprise_type: string;
  primary_crop: string | null;
  latitude: number | null;
  longitude: number | null;
  preferred_language: string;
}

const BLANK: FarmerProfile = {
  full_name: '', phone: '', state: '', district: '', taluka: '',
  village: '', enterprise_type: '', primary_crop: null,
  latitude: null, longitude: null, preferred_language: 'mr',
};

const ENTERPRISE_ICONS: Record<string, string> = {
  poultry: '🐓', fisheries: '🐟', apiculture: '🍯',
  mushroom: '🍄', vermicompost: '🪱', dairy: '🐄', goat: '🐐',
};

const LANG_LABELS: Record<string, string> = {
  mr: 'मराठी', hi: 'हिंदी', en: 'English',
};

const LANG_FLAGS: Record<string, string> = {
  mr: '🇮🇳', hi: '🇮🇳', en: '🌐',
};

export function ProfilePage() {
  const navigate    = useNavigate();
  const { t }       = useTranslation();
  const { ht }      = useHaladharTranslation();
  const { user }    = useAuth();
  const setLanguage = useSetLanguage();

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');
  const [profile,  setProfile]  = useState<FarmerProfile>(BLANK);
  const [editMode, setEditMode] = useState(false);
  const [draft,    setDraft]    = useState<FarmerProfile>(BLANK);

  useEffect(() => { if (user) loadProfile(); else setLoading(false); }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('farmer_profiles').select('*').eq('user_id', user.id).single();
      if (data) {
        const p: FarmerProfile = {
          full_name:          data.full_name          || '',
          phone:              data.phone              || '',
          state:              data.state              || '',
          district:           data.district           || '',
          taluka:             data.taluka             || '',
          village:            data.village            || '',
          enterprise_type:    data.enterprise_type    || '',
          primary_crop:       data.primary_crop       ?? null,
          latitude:           data.latitude           ?? null,
          longitude:          data.longitude          ?? null,
          preferred_language: data.preferred_language || 'mr',
        };
        setProfile(p);
        setDraft(p);
        if (data.preferred_language) setLanguage(data.preferred_language as 'en' | 'hi' | 'mr');
        if (data.district)       localStorage.setItem('userDistrict',  data.district);
        if (data.village)        localStorage.setItem('userVillage',   data.village);
        if (data.primary_crop)   localStorage.setItem('primaryCrop',   data.primary_crop);
        if (data.enterprise_type)localStorage.setItem('enterpriseType',data.enterprise_type);
        localStorage.setItem('userLocation', data.district || data.village || '');
      } else {
        // No profile yet — open edit mode so they fill it in
        setEditMode(true);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const requestGPS = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => setDraft(p => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => alert(t('profile.gpsDenied'))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(''); setSaving(true);
    try {
      const { error: err } = await supabase.from('farmer_profiles').upsert({
        user_id: user.id, ...draft, updated_at: new Date().toISOString(),
      });
      if (err) throw err;
      setProfile({ ...draft });
      setLanguage(draft.preferred_language as 'en' | 'hi' | 'mr');
      localStorage.setItem('userLocation',   draft.district || draft.village || '');
      localStorage.setItem('userDistrict',   draft.district);
      localStorage.setItem('userVillage',    draft.village);
      localStorage.setItem('primaryCrop',    draft.primary_crop || '');
      localStorage.setItem('enterpriseType', draft.enterprise_type);
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || t('profile.error'));
    } finally { setSaving(false); }
  };

  const cancelEdit = () => { setDraft({ ...profile }); setEditMode(false); setError(''); };

  const setDraftField = (k: keyof FarmerProfile) => (v: string) =>
    setDraft(p => ({ ...p, [k]: v || null } as FarmerProfile));

  /* ── helpers ─────────────────────────────────────────────── */
  const initials = profile.full_name
    ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const locationParts = [profile.village, profile.taluka, profile.district, profile.state].filter(Boolean);
  const locationText  = locationParts.join(', ') || '—';

  const completeness = [
    profile.full_name, profile.phone, profile.state, profile.district,
    profile.village, profile.enterprise_type, profile.primary_crop,
  ].filter(Boolean).length;
  const completenessMax  = 7;
  const completenessPerc = Math.round((completeness / completenessMax) * 100);

  /* ── loading ─────────────────────────────────────────────── */
  if (loading) return (
    <div className="haladhar-container">
      <div className="haladhar-loading"><div className="haladhar-spinner" /></div>
    </div>
  );

  /* ── main render ─────────────────────────────────────────── */
  return (
    <div className="haladhar-container">
      <div className="pf-root">

        {/* ── HERO BANNER ──────────────────────────────────── */}
        <div className="pf-hero">
          {/* Back button */}
          <button className="pf-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>

          {/* Edit / Cancel button */}
          {!editMode ? (
            <button className="pf-edit-btn" onClick={() => setEditMode(true)}>
              <Edit3 size={16} />
              <span>{ht('haladhar.profile.edit')}</span>
            </button>
          ) : (
            <button className="pf-cancel-btn" onClick={cancelEdit}>
              <X size={16} />
            </button>
          )}

          {/* Avatar */}
          <div className="pf-avatar-wrap">
            <div className="pf-avatar">
              {initials}
            </div>
            {completenessPerc === 100 && (
              <div className="pf-avatar-badge" title="Profile complete">
                <CheckCircle2 size={18} />
              </div>
            )}
          </div>

          {/* Name & location */}
          <h1 className="pf-hero-name">
            {profile.full_name || ht('haladhar.profile.name')}
          </h1>
          <div className="pf-hero-location">
            <MapPin size={13} />
            <span>{locationText}</span>
          </div>

          {/* Language badge */}
          <div className="pf-lang-badge">
            <span>{LANG_FLAGS[profile.preferred_language] || '🌐'}</span>
            <span>{LANG_LABELS[profile.preferred_language] || profile.preferred_language}</span>
          </div>

          {/* Completeness bar */}
          <div className="pf-completeness-wrap">
            <div className="pf-completeness-row">
              <span className="pf-completeness-label">Profile {completenessPerc}% complete</span>
            </div>
            <div className="pf-completeness-track">
              <div className="pf-completeness-fill" style={{ width: `${completenessPerc}%` }} />
            </div>
          </div>
        </div>

        {/* ── SUCCESS TOAST ─────────────────────────────────── */}
        {saved && (
          <div className="pf-toast pf-toast-success">
            <CheckCircle2 size={18} />
            <span>{t('profile.saved')}</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            READ-MODE — detail cards
        ══════════════════════════════════════════════════ */}
        {!editMode && (
          <div className="pf-body">

            {/* ── Contact card ───────────────────────────── */}
            <div className="pf-section-label">
              <User size={14} />
              <span>Personal Details</span>
            </div>
            <div className="pf-card">
              <InfoRow icon={<User size={18} />} label={ht('haladhar.profile.name')} value={profile.full_name} />
              <InfoRow icon={<Phone size={18} />} label={ht('haladhar.profile.mobile')} value={profile.phone} />
              <InfoRow icon={<Globe size={18} />} label={ht('haladhar.profile.language')}
                value={`${LANG_FLAGS[profile.preferred_language] || ''} ${LANG_LABELS[profile.preferred_language] || profile.preferred_language}`} />
            </div>

            {/* ── Location card ──────────────────────────── */}
            <div className="pf-section-label">
              <MapPin size={14} />
              <span>Location</span>
            </div>
            <div className="pf-card">
              <InfoRow icon={<Home size={18} />}   label={ht('haladhar.profile.village')}  value={profile.village} />
              <InfoRow icon={<Map size={18} />}    label={ht('haladhar.profile.taluka')}   value={profile.taluka} />
              <InfoRow icon={<Building2 size={18}/>}label={ht('haladhar.profile.district')} value={profile.district} />
              <InfoRow icon={<Layers size={18} />}  label={t('profile.state')}               value={profile.state} />
              {(profile.latitude && profile.longitude) && (
                <InfoRow
                  icon={<Navigation size={18} />}
                  label="GPS Coordinates"
                  value={`${profile.latitude.toFixed(5)}, ${profile.longitude!.toFixed(5)}`}
                  mono
                />
              )}
            </div>

            {/* ── Farming card ───────────────────────────── */}
            <div className="pf-section-label">
              <Sprout size={14} />
              <span>Farm Details</span>
            </div>
            <div className="pf-card">
              <InfoRow
                icon={<Leaf size={18} />}
                label={t('profile.primaryCrop')}
                value={profile.primary_crop || '—'}
                highlight={!!profile.primary_crop}
              />
              <InfoRow
                icon={<Tractor size={18} />}
                label={t('profile.enterpriseType')}
                value={profile.enterprise_type
                  ? `${ENTERPRISE_ICONS[profile.enterprise_type] || '🌾'} ${t(`enterprise.${profile.enterprise_type}` as any)}`
                  : '—'}
                highlight={!!profile.enterprise_type}
              />
            </div>

            {/* ── Incomplete nudge ───────────────────────── */}
            {completenessPerc < 100 && (
              <div className="pf-nudge" onClick={() => setEditMode(true)}>
                <AlertCircle size={18} className="pf-nudge-icon" />
                <div>
                  <p className="pf-nudge-title">Complete your profile</p>
                  <p className="pf-nudge-sub">
                    {completenessMax - completeness} field{completenessMax - completeness !== 1 ? 's' : ''} missing — tap to fill in
                  </p>
                </div>
                <Edit3 size={16} style={{ color: 'var(--haladhar-green)', marginLeft: 'auto', flexShrink: 0 }} />
              </div>
            )}

          </div>
        )}

        {/* ══════════════════════════════════════════════════
            EDIT MODE — grouped form
        ══════════════════════════════════════════════════ */}
        {editMode && (
          <form onSubmit={handleSave} className="pf-body">

            {/* ── Personal ───────────────────────────────── */}
            <div className="pf-section-label">
              <User size={14} />
              <span>Personal Details</span>
            </div>
            <div className="pf-card pf-card-form">
              <FormField
                icon={<User size={18} />}
                label={ht('haladhar.profile.name')}
                value={draft.full_name}
                onChange={setDraftField('full_name')}
                placeholder="Enter full name"
                required
              />
              <FormField
                icon={<Phone size={18} />}
                label={ht('haladhar.profile.mobile')}
                value={draft.phone}
                onChange={setDraftField('phone')}
                type="tel"
                placeholder="10-digit mobile number"
                required
              />

              {/* Language select */}
              <div className="pf-form-row">
                <span className="pf-form-icon"><Globe size={18} /></span>
                <div className="pf-form-content">
                  <label className="pf-form-label">{ht('haladhar.profile.language')}</label>
                  <select
                    className="haladhar-input pf-select"
                    value={draft.preferred_language}
                    onChange={e => setDraftField('preferred_language')(e.target.value)}
                  >
                    <option value="mr">🇮🇳 मराठी</option>
                    <option value="hi">🇮🇳 हिंदी</option>
                    <option value="en">🌐 English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── Location ───────────────────────────────── */}
            <div className="pf-section-label">
              <MapPin size={14} />
              <span>Location</span>
            </div>
            <div className="pf-card pf-card-form">
              <FormField
                icon={<Home size={18} />}
                label={ht('haladhar.profile.village')}
                value={draft.village}
                onChange={setDraftField('village')}
                placeholder="Your village name"
                required
              />
              <FormField
                icon={<Map size={18} />}
                label={ht('haladhar.profile.taluka')}
                value={draft.taluka}
                onChange={setDraftField('taluka')}
                placeholder="Taluka / Block"
              />
              <FormField
                icon={<Building2 size={18} />}
                label={ht('haladhar.profile.district')}
                value={draft.district}
                onChange={setDraftField('district')}
                placeholder="Your district"
                required
              />
              <FormField
                icon={<Layers size={18} />}
                label={t('profile.state')}
                value={draft.state}
                onChange={setDraftField('state')}
                placeholder="Your state"
                required
              />

              {/* GPS */}
              <div className="pf-form-row pf-gps-row">
                <span className="pf-form-icon"><Navigation size={18} /></span>
                <div className="pf-form-content">
                  <label className="pf-form-label">GPS Location</label>
                  {draft.latitude ? (
                    <p className="pf-gps-set">
                      <CheckCircle2 size={14} style={{ color: 'var(--haladhar-green)' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        {draft.latitude.toFixed(4)}, {draft.longitude?.toFixed(4)}
                      </span>
                    </p>
                  ) : (
                    <p className="pf-gps-empty">Not set</p>
                  )}
                  <button
                    type="button"
                    className="pf-gps-btn"
                    onClick={requestGPS}
                  >
                    <Navigation size={14} />
                    {draft.latitude ? 'Update GPS' : 'Get GPS Location'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Farm Details ───────────────────────────── */}
            <div className="pf-section-label">
              <Sprout size={14} />
              <span>Farm Details</span>
            </div>
            <div className="pf-card pf-card-form">
              <FormField
                icon={<Leaf size={18} />}
                label={t('profile.primaryCrop')}
                value={draft.primary_crop || ''}
                onChange={setDraftField('primary_crop')}
                placeholder="e.g. Cotton, Wheat, Rice"
              />

              {/* Enterprise select */}
              <div className="pf-form-row">
                <span className="pf-form-icon"><Tractor size={18} /></span>
                <div className="pf-form-content">
                  <label className="pf-form-label">{t('profile.enterpriseType')}</label>
                  <select
                    className="haladhar-input pf-select"
                    value={draft.enterprise_type}
                    onChange={e => setDraftField('enterprise_type')(e.target.value)}
                  >
                    <option value="">{t('profile.selectEnterprise')}</option>
                    {['poultry','fisheries','apiculture','mushroom','vermicompost','dairy','goat'].map(k => (
                      <option key={k} value={k}>
                        {ENTERPRISE_ICONS[k]} {t(`enterprise.${k}` as any)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Error ──────────────────────────────────── */}
            {error && (
              <div className="pf-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* ── Actions ────────────────────────────────── */}
            <div className="pf-actions">
              <button
                type="button"
                className="pf-btn-secondary"
                onClick={cancelEdit}
              >
                <X size={18} /> Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="pf-btn-primary"
              >
                {saving ? (
                  <><div className="pf-mini-spinner" /> Saving…</>
                ) : (
                  <><Save size={18} /> {t('profile.save')}</>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

/* ── Info Row (read mode) ─────────────────────────────────── */
function InfoRow({ icon, label, value, mono = false, highlight = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="pf-info-row">
      <span className="pf-info-icon">{icon}</span>
      <div className="pf-info-content">
        <span className="pf-info-label">{label}</span>
        <span className={`pf-info-value${mono ? ' pf-mono' : ''}${highlight ? ' pf-highlight' : ''}`}>
          {value || <span className="pf-empty-val">—</span>}
        </span>
      </div>
    </div>
  );
}

/* ── Form Field (edit mode) ──────────────────────────────── */
function FormField({ icon, label, value, onChange, type = 'text', placeholder, required = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="pf-form-row">
      <span className="pf-form-icon">{icon}</span>
      <div className="pf-form-content">
        <label className="pf-form-label">
          {label}{required && <span className="pf-required"> *</span>}
        </label>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="haladhar-input pf-input"
        />
      </div>
    </div>
  );
}
