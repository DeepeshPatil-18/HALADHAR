import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Users, Tractor, ClipboardList,
  MapPin, Star, Phone, MessageCircle, CheckCircle,
  X, Plus, Home, LayoutGrid, MoreHorizontal,
  Wrench, Wheat, Sprout, Search, Filter,
  BadgeCheck, Clock, IndianRupee,
} from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

/* ============================================================
   DATA TYPES
   ============================================================ */
type ListingType = 'labour' | 'machinery';
type TabKey = 'all' | 'labour' | 'machinery' | 'requirements';
type PostingMode = 'available' | 'required';

interface Listing {
  id: number;
  type: ListingType;
  mode: PostingMode;
  name: string;
  phone: string;
  role: string;           // e.g. "Harvesting Labour" / "Tractor with Driver"
  skills?: string[];      // labour skills
  machineType?: string;   // machinery category
  rate: number;
  rateUnit: 'day' | 'hour' | 'acre' | 'season';
  distance: number;       // km
  village: string;
  district: string;
  rating: number;         // 0–5
  reviews: number;
  verified: boolean;
  available: boolean;
  avatar: string;         // emoji or initials
  postedHours: number;
  description?: string;
}

/* ============================================================
   MOCK DATA
   ============================================================ */
const MOCK_LISTINGS: Listing[] = [
  // ── AVAILABLE LABOUR ────────────────────────────────────
  {
    id: 1, type: 'labour', mode: 'available',
    name: 'Ramesh Patil', phone: '9876543210',
    role: 'Harvesting Labour', skills: ['Wheat Harvesting', 'Onion Lifting', 'Fruit Picking'],
    rate: 400, rateUnit: 'day', distance: 1.2, village: 'Kopargaon', district: 'Ahmednagar',
    rating: 4.7, reviews: 38, verified: true, available: true,
    avatar: 'RP', postedHours: 2,
    description: 'Experienced in wheat and onion harvesting. Available with team of 5.',
  },
  {
    id: 2, type: 'labour', mode: 'available',
    name: 'Sunita Bai', phone: '9823456701',
    role: 'Transplanting & Weeding', skills: ['Paddy Transplanting', 'Weeding', 'Vegetable Picking'],
    rate: 320, rateUnit: 'day', distance: 2.5, village: 'Nevasa', district: 'Ahmednagar',
    rating: 4.5, reviews: 21, verified: true, available: true,
    avatar: 'SB', postedHours: 5,
    description: 'Expert in paddy transplanting. Group of 8 women workers available.',
  },
  {
    id: 3, type: 'labour', mode: 'available',
    name: 'Manoj Shinde', phone: '9765432109',
    role: 'Spraying Labour', skills: ['Pesticide Spraying', 'Fertilizer Application', 'Drip Maintenance'],
    rate: 500, rateUnit: 'day', distance: 3.8, village: 'Rahuri', district: 'Ahmednagar',
    rating: 4.9, reviews: 62, verified: true, available: false,
    avatar: 'MS', postedHours: 18,
    description: 'Certified spray operator with 8 years experience.',
  },
  {
    id: 4, type: 'labour', mode: 'available',
    name: 'Laxmi Kale', phone: '9812345678',
    role: 'Grape Pruning Specialist', skills: ['Grape Pruning', 'Training', 'Canopy Management'],
    rate: 600, rateUnit: 'day', distance: 6.1, village: 'Sangamner', district: 'Ahmednagar',
    rating: 4.8, reviews: 45, verified: true, available: true,
    avatar: 'LK', postedHours: 1,
    description: 'Grape pruning specialist with knowledge of Khor and Xmas pruning cycles.',
  },
  // ── AVAILABLE MACHINERY ─────────────────────────────────
  {
    id: 5, type: 'machinery', mode: 'available',
    name: 'Suresh Mane', phone: '9878901234',
    role: 'Tractor with Rotavator', machineType: 'Tractor',
    skills: ['Rotavator', 'Cultivator', 'Plough', 'Levelling'],
    rate: 1200, rateUnit: 'hour', distance: 0.8, village: 'Kopargaon', district: 'Ahmednagar',
    rating: 4.6, reviews: 54, verified: true, available: true,
    avatar: '🚜', postedHours: 3,
    description: '55 HP Mahindra tractor. Rotavator & MB plough available.',
  },
  {
    id: 6, type: 'machinery', mode: 'available',
    name: 'Nitin Jadhav', phone: '9765098765',
    role: 'Combine Harvester', machineType: 'Harvester',
    skills: ['Wheat', 'Soybean', 'Maize Harvesting'],
    rate: 2500, rateUnit: 'acre', distance: 4.2, village: 'Shrirampur', district: 'Ahmednagar',
    rating: 4.4, reviews: 29, verified: true, available: true,
    avatar: '🌾', postedHours: 6,
    description: 'John Deere W70 combine. Quick booking — season is busy.',
  },
  {
    id: 7, type: 'machinery', mode: 'available',
    name: 'Pravin Gaikwad', phone: '9823012345',
    role: 'Sugarcane Harvester', machineType: 'Harvester',
    skills: ['Sugarcane Cutting', 'Loading'],
    rate: 3200, rateUnit: 'acre', distance: 7.5, village: 'Belapur', district: 'Ahmednagar',
    rating: 4.3, reviews: 17, verified: false, available: true,
    avatar: '🎋', postedHours: 12,
    description: 'Sugarcane harvesting machine available Oct–Feb season.',
  },
  {
    id: 8, type: 'machinery', mode: 'available',
    name: 'Ravi Desai', phone: '9867890123',
    role: 'Sprayer Drone', machineType: 'Drone',
    skills: ['Pesticide Spraying', 'Nano Urea', 'Foliar Application'],
    rate: 800, rateUnit: 'acre', distance: 2.1, village: 'Rahata', district: 'Ahmednagar',
    rating: 5.0, reviews: 14, verified: true, available: true,
    avatar: '🚁', postedHours: 1,
    description: 'DJI Agras T40 drone. 40L capacity. DGCA certified pilot.',
  },
  {
    id: 9, type: 'machinery', mode: 'available',
    name: 'Sanjay Bhosale', phone: '9812567890',
    role: 'Drip Irrigation Setup', machineType: 'Equipment',
    skills: ['Drip Installation', 'Mainline Laying', 'Filter Fitting'],
    rate: 1500, rateUnit: 'day', distance: 5.3, village: 'Newasa', district: 'Ahmednagar',
    rating: 4.2, reviews: 9, verified: false, available: true,
    avatar: '💧', postedHours: 24,
    description: 'Full drip system installation team.',
  },
  // ── REQUIREMENTS ─────────────────────────────────────────
  {
    id: 10, type: 'labour', mode: 'required',
    name: 'Bharat Thorat', phone: '9898765432',
    role: 'Need Onion Harvesting Labour',
    skills: ['Onion Lifting', 'Sorting'],
    rate: 380, rateUnit: 'day', distance: 1.9, village: 'Kopargaon', district: 'Ahmednagar',
    rating: 0, reviews: 0, verified: true, available: true,
    avatar: 'BT', postedHours: 4,
    description: 'Need 10 labours for 5 acres onion lifting. Starting Monday.',
  },
  {
    id: 11, type: 'machinery', mode: 'required',
    name: 'Ganesh Pawar', phone: '9823456789',
    role: 'Need Rotavator for 3 Acres',
    machineType: 'Tractor',
    rate: 1000, rateUnit: 'hour', distance: 3.1, village: 'Puntamba', district: 'Ahmednagar',
    rating: 0, reviews: 0, verified: false, available: true,
    avatar: 'GP', postedHours: 8,
    description: 'Need tractor with rotavator for 3 acres. Ready soil, cotton stubble removed.',
  },
  {
    id: 12, type: 'labour', mode: 'required',
    name: 'Kavita Jadhav', phone: '9765432198',
    role: 'Need Grape Pruning Workers',
    skills: ['Grape Pruning', 'Tying'],
    rate: 550, rateUnit: 'day', distance: 2.7, village: 'Mahalabadnagar', district: 'Ahmednagar',
    rating: 0, reviews: 0, verified: true, available: true,
    avatar: 'KJ', postedHours: 2,
    description: 'Need 6 skilled grape workers for pruning 2 acres. Xmas pruning.',
  },
];

const MACHINE_ICONS: Record<string, string> = {
  Tractor: '🚜', Harvester: '🌾', Drone: '🚁', Equipment: '⚙️', default: '🔧',
};

const RATE_UNIT_LABEL: Record<string, string> = {
  day: '/ day', hour: '/ hr', acre: '/ acre', season: '/ season',
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function LabourMachineryPage() {
  const navigate  = useNavigate();
  const { ht }    = useHaladharTranslation();

  const [activeTab,   setActiveTab]   = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPost,    setShowPost]    = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // post form state
  const [postType,    setPostType]    = useState<ListingType>('labour');
  const [postMode,    setPostMode]    = useState<PostingMode>('available');
  const [postName,    setPostName]    = useState('');
  const [postPhone,   setPostPhone]   = useState('');
  const [postDesc,    setPostDesc]    = useState('');
  const [postRate,    setPostRate]    = useState('');

  /* ── filter logic ─────────────────────────────────────── */
  const filtered = MOCK_LISTINGS.filter(l => {
    if (activeTab === 'labour')       return l.type === 'labour'    && l.mode === 'available';
    if (activeTab === 'machinery')    return l.type === 'machinery'  && l.mode === 'available';
    if (activeTab === 'requirements') return l.mode === 'required';
    return l.mode === 'available';                                    // 'all'
  }).filter(l => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.role.toLowerCase().includes(q) ||
      l.village.toLowerCase().includes(q) ||
      (l.skills || []).some(s => s.toLowerCase().includes(q))
    );
  });

  /* ── post submit ──────────────────────────────────────── */
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPost(false);
    setPostSuccess(true);
    setPostName(''); setPostPhone(''); setPostDesc(''); setPostRate('');
    setTimeout(() => setPostSuccess(false), 3500);
  };

  /* ── tab config ───────────────────────────────────────── */
  const TABS: { key: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'all',          label: ht('haladhar.labour.tabAll'),          icon: <LayoutGrid size={14} />,   count: MOCK_LISTINGS.filter(l => l.mode === 'available').length },
    { key: 'labour',       label: ht('haladhar.labour.tabLabour'),       icon: <Users size={14} />,        count: MOCK_LISTINGS.filter(l => l.type === 'labour' && l.mode === 'available').length },
    { key: 'machinery',    label: ht('haladhar.labour.tabMachinery'),    icon: <Tractor size={14} />,      count: MOCK_LISTINGS.filter(l => l.type === 'machinery' && l.mode === 'available').length },
    { key: 'requirements', label: ht('haladhar.labour.tabRequirements'), icon: <ClipboardList size={14} />, count: MOCK_LISTINGS.filter(l => l.mode === 'required').length },
  ];

  /* ── stats summary ────────────────────────────────────── */
  const stats = [
    { label: 'Labour', value: MOCK_LISTINGS.filter(l => l.type === 'labour' && l.mode === 'available').length, icon: '👷', color: '#e8f5e9', text: '#2d6a4f' },
    { label: 'Machines', value: MOCK_LISTINGS.filter(l => l.type === 'machinery' && l.mode === 'available').length, icon: '🚜', color: '#fff8e1', text: '#f57c00' },
    { label: 'Needed', value: MOCK_LISTINGS.filter(l => l.mode === 'required').length, icon: '📋', color: '#fce4ec', text: '#c62828' },
  ];

  return (
    <div className="haladhar-container">
      <div className="lm-root">

        {/* ── HERO HEADER ───────────────────────────────── */}
        <div className="lm-hero">
          <button className="lm-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft size={22} />
          </button>

          <div className="lm-hero-text">
            <h1 className="lm-hero-title">
              <Wrench size={20} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              {ht('haladhar.labour.title')}
            </h1>
            <p className="lm-hero-sub">
              <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
              {ht('haladhar.labour.subtitle')}
            </p>
          </div>

          {/* Stats row */}
          <div className="lm-stats-row">
            {stats.map((s, i) => (
              <div key={i} className="lm-stat-pill" style={{ background: s.color }}>
                <span className="lm-stat-icon">{s.icon}</span>
                <span className="lm-stat-val" style={{ color: s.text }}>{s.value}</span>
                <span className="lm-stat-lbl" style={{ color: s.text }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEARCH BAR ────────────────────────────────── */}
        <div className="lm-search-wrap">
          <div className="lm-search-box">
            <Search size={17} className="lm-search-icon" />
            <input
              className="lm-search-input"
              placeholder="Search labour, machine, village…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="lm-search-clear" onClick={() => setSearchQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>
          <button className="lm-post-fab" onClick={() => setShowPost(true)}>
            <Plus size={18} />
            <span>{ht('haladhar.labour.postBtn').replace('+ ', '')}</span>
          </button>
        </div>

        {/* ── TABS ──────────────────────────────────────── */}
        <div className="lm-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`lm-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`lm-tab-count ${activeTab === tab.key ? 'active' : ''}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── SUCCESS TOAST ─────────────────────────────── */}
        {postSuccess && (
          <div className="lm-toast">
            <CheckCircle size={18} />
            <span>{ht('haladhar.labour.postSuccess')}</span>
          </div>
        )}

        {/* ── LISTINGS ──────────────────────────────────── */}
        <div className="lm-listings">
          {filtered.length === 0 ? (
            <div className="lm-empty">
              <Wheat size={40} style={{ color: 'var(--haladhar-text-muted)', marginBottom: 10 }} />
              <p>{ht('haladhar.labour.noResults')}</p>
            </div>
          ) : (
            filtered.map(l => (
              <ListingCard key={l.id} listing={l} ht={ht} />
            ))
          )}
        </div>

      </div>

      {/* ── POST MODAL ────────────────────────────────────── */}
      {showPost && (
        <div className="lm-modal-overlay" onClick={() => setShowPost(false)}>
          <div className="lm-modal" onClick={e => e.stopPropagation()}>
            <div className="lm-modal-header">
              <h2 className="lm-modal-title">{ht('haladhar.labour.postTitle')}</h2>
              <button className="lm-modal-close" onClick={() => setShowPost(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="lm-modal-form">

              {/* Type toggle */}
              <div className="lm-form-group">
                <label className="lm-form-label">{ht('haladhar.labour.postTypeLabel')}</label>
                <div className="lm-type-toggle">
                  {(['labour', 'machinery'] as ListingType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`lm-type-btn ${postType === t ? 'active' : ''}`}
                      onClick={() => setPostType(t)}
                    >
                      {t === 'labour' ? <Users size={16} /> : <Tractor size={16} />}
                      {t === 'labour' ? ht('haladhar.labour.postTypeLabour') : ht('haladhar.labour.postTypeMachine')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available / Required toggle */}
              <div className="lm-form-group">
                <div className="lm-mode-toggle">
                  <button
                    type="button"
                    className={`lm-mode-btn ${postMode === 'available' ? 'active-avail' : ''}`}
                    onClick={() => setPostMode('available')}
                  >
                    <CheckCircle size={15} /> {ht('haladhar.labour.available')}
                  </button>
                  <button
                    type="button"
                    className={`lm-mode-btn ${postMode === 'required' ? 'active-req' : ''}`}
                    onClick={() => setPostMode('required')}
                  >
                    <ClipboardList size={15} /> {ht('haladhar.labour.required')}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="lm-form-group">
                <label className="lm-form-label">{ht('haladhar.labour.postNameLabel')} *</label>
                <input
                  className="lm-form-input"
                  placeholder={ht('haladhar.labour.postNamePlaceholder')}
                  value={postName}
                  onChange={e => setPostName(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="lm-form-group">
                <label className="lm-form-label">{ht('haladhar.labour.postPhoneLabel')} *</label>
                <input
                  className="lm-form-input"
                  type="tel"
                  placeholder={ht('haladhar.labour.postPhonePlaceholder')}
                  value={postPhone}
                  onChange={e => setPostPhone(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="lm-form-group">
                <label className="lm-form-label">{ht('haladhar.labour.postDescLabel')}</label>
                <textarea
                  className="lm-form-textarea"
                  placeholder={ht('haladhar.labour.postDescPlaceholder')}
                  value={postDesc}
                  onChange={e => setPostDesc(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Rate */}
              <div className="lm-form-group">
                <label className="lm-form-label">{ht('haladhar.labour.postRateLabel')}</label>
                <div className="lm-rate-row">
                  <span className="lm-rate-prefix">₹</span>
                  <input
                    className="lm-form-input lm-rate-input"
                    type="number"
                    min="0"
                    placeholder={ht('haladhar.labour.postRatePlaceholder')}
                    value={postRate}
                    onChange={e => setPostRate(e.target.value)}
                  />
                  <span className="lm-rate-suffix">/ day</span>
                </div>
              </div>

              {/* Actions */}
              <div className="lm-modal-actions">
                <button type="button" className="lm-btn-cancel" onClick={() => setShowPost(false)}>
                  {ht('haladhar.labour.postCancel')}
                </button>
                <button type="submit" className="lm-btn-submit">
                  <Plus size={16} /> {ht('haladhar.labour.postSubmit')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ──────────────────────────────────────── */}
      <nav className="haladhar-bottom-nav">
        <button className="haladhar-nav-item" onClick={() => navigate('/')}>
          <Home size={22} strokeWidth={2} /><span>{ht('haladhar.nav.home')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/farm')}>
          <Sprout size={22} strokeWidth={2} /><span>{ht('haladhar.nav.myFarm')}</span>
        </button>
        <button className="haladhar-nav-item active" onClick={() => navigate('/services')}>
          <LayoutGrid size={22} strokeWidth={2} /><span>{ht('haladhar.nav.services')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/more')}>
          <MoreHorizontal size={22} strokeWidth={2} /><span>{ht('haladhar.nav.more')}</span>
        </button>
      </nav>
    </div>
  );
}

/* ============================================================
   LISTING CARD
   ============================================================ */
function ListingCard({ listing: l, ht }: { listing: Listing; ht: (k: any) => string }) {
  const [expanded, setExpanded] = useState(false);

  const isEmoji = (s: string) => /\p{Emoji}/u.test(s);

  const rateUnitLabel: Record<string, string> = {
    day: ht('haladhar.labour.perDay'),
    hour: ht('haladhar.labour.perHour'),
    acre: '/ acre',
    season: '/ season',
  };

  const statusColor = l.mode === 'required'
    ? { bg: '#fff3e0', text: '#e65100', dot: '#ff9800' }
    : l.available
      ? { bg: '#e8f5e9', text: '#2d6a4f', dot: '#4caf50' }
      : { bg: '#fafafa', text: '#9e9e9e', dot: '#bdbdbd' };

  return (
    <div
      className={`lm-card ${l.mode === 'required' ? 'lm-card-required' : ''} ${!l.available && l.mode === 'available' ? 'lm-card-busy' : ''}`}
      onClick={() => setExpanded(v => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
    >
      {/* ── Top row ───────────────────────────────────── */}
      <div className="lm-card-top">

        {/* Avatar */}
        <div className="lm-avatar" style={{ background: l.type === 'labour' ? '#e8f5e9' : '#fff8e1' }}>
          {isEmoji(l.avatar)
            ? <span className="lm-avatar-emoji">{l.avatar}</span>
            : <span className="lm-avatar-initials">{l.avatar}</span>
          }
        </div>

        {/* Info */}
        <div className="lm-card-info">
          <div className="lm-card-name-row">
            <span className="lm-card-name">{l.name}</span>
            {l.verified && (
              <BadgeCheck size={14} className="lm-verified-icon" />
            )}
          </div>
          <p className="lm-card-role">{l.role}</p>

          {/* Skills chips */}
          {l.skills && l.skills.length > 0 && (
            <div className="lm-skills">
              {l.skills.slice(0, 2).map((s, i) => (
                <span key={i} className="lm-skill-chip">{s}</span>
              ))}
              {l.skills.length > 2 && (
                <span className="lm-skill-chip lm-skill-more">+{l.skills.length - 2}</span>
              )}
            </div>
          )}
        </div>

        {/* Right meta */}
        <div className="lm-card-meta">
          {/* Status badge */}
          <span
            className="lm-status-badge"
            style={{ background: statusColor.bg, color: statusColor.text }}
          >
            <span className="lm-status-dot" style={{ background: statusColor.dot }} />
            {l.mode === 'required'
              ? ht('haladhar.labour.required')
              : l.available ? ht('haladhar.labour.available') : 'Busy'}
          </span>

          {/* Rate */}
          <div className="lm-rate">
            <IndianRupee size={13} strokeWidth={2.5} />
            <span className="lm-rate-val">{l.rate.toLocaleString('en-IN')}</span>
            <span className="lm-rate-unit">{rateUnitLabel[l.rateUnit] || `/ ${l.rateUnit}`}</span>
          </div>
        </div>
      </div>

      {/* ── Second row — location + rating + time ────── */}
      <div className="lm-card-footer">
        <span className="lm-footer-item">
          <MapPin size={12} />
          {l.village} · {l.distance} {ht('haladhar.labour.km')}
        </span>
        {l.rating > 0 && (
          <span className="lm-footer-item">
            <Star size={12} fill="#ffc107" color="#ffc107" />
            {l.rating} ({l.reviews})
          </span>
        )}
        <span className="lm-footer-item">
          <Clock size={12} />
          {l.postedHours < 24 ? `${l.postedHours}h ago` : `${Math.floor(l.postedHours / 24)}d ago`}
        </span>
      </div>

      {/* ── Expanded panel ────────────────────────────── */}
      {expanded && (
        <div className="lm-card-expanded" onClick={e => e.stopPropagation()}>
          {l.description && (
            <p className="lm-card-desc">{l.description}</p>
          )}

          {/* All skills */}
          {l.skills && l.skills.length > 2 && (
            <div className="lm-skills lm-skills-expanded">
              {l.skills.map((s, i) => (
                <span key={i} className="lm-skill-chip">{s}</span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="lm-card-actions">
            <a
              href={`tel:${l.phone}`}
              className="lm-action-btn lm-action-call"
              onClick={e => e.stopPropagation()}
            >
              <Phone size={16} /> {ht('haladhar.labour.call')}
            </a>
            <a
              href={`https://wa.me/91${l.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lm-action-btn lm-action-whatsapp"
              onClick={e => e.stopPropagation()}
            >
              <MessageCircle size={16} /> {ht('haladhar.labour.whatsapp')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
