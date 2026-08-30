import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, MapPin, Sprout, TrendingUp, Home, Tractor, LayoutGrid, MoreHorizontal, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

export function MyFarmPage() {
  const navigate = useNavigate();
  const { ht } = useHaladharTranslation();
  const { t } = useTranslation();
  const { user } = useAuth();

  // Read farmer profile data from localStorage
  const farmerName = user?.user_metadata?.full_name || user?.user_metadata?.name || localStorage.getItem('userName') || 'शेतकरी';
  const mobile = user?.user_metadata?.phone || localStorage.getItem('userMobile') || '—';
  const district = localStorage.getItem('userDistrict') || '—';
  const village = localStorage.getItem('userVillage') || '—';
  const taluka = localStorage.getItem('userTaluka') || '—';
  
  // Farming context data (what AI uses)
  const primaryCrop = localStorage.getItem('primaryCrop') || '—';
  const landSize = localStorage.getItem('landSize') || '—';
  const enterpriseType = localStorage.getItem('enterpriseType') || '—';
  const irrigationType = localStorage.getItem('irrigationType') || '—';
  const soilType = localStorage.getItem('soilType') || '—';

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        {/* Page heading with edit button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <h1 className="haladhar-heading" style={{ margin: 0 }}>
            {ht('haladhar.nav.profile')}
          </h1>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'var(--haladhar-green)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Edit size={16} />
            {ht('haladhar.profile.edit')}
          </button>
        </div>

        {/* Basic Details Section */}
        <div className="haladhar-card" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--haladhar-green)' }}>
            {ht('haladhar.profile.title')}
          </h3>
          
          <div className="haladhar-info-row">
            <span className="haladhar-info-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={16} color="var(--haladhar-text-muted)" />
              {ht('haladhar.profile.name')}
            </span>
            <span className="haladhar-info-value">{farmerName}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={16} color="var(--haladhar-text-muted)" />
              {ht('haladhar.profile.mobile')}
            </span>
            <span className="haladhar-info-value">{mobile}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="var(--haladhar-text-muted)" />
              {ht('haladhar.profile.village')}
            </span>
            <span className="haladhar-info-value">{village}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">{ht('haladhar.profile.taluka')}</span>
            <span className="haladhar-info-value">{taluka}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">{ht('haladhar.profile.district')}</span>
            <span className="haladhar-info-value">{district}</span>
          </div>
        </div>

        {/* Farming Context Section (AI uses this data) */}
        <div className="haladhar-card">
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--haladhar-green)' }}>
            शेती संदर्भ
          </h3>
          
          <div className="haladhar-info-row">
            <span className="haladhar-info-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sprout size={16} color="var(--haladhar-text-muted)" />
              मुख्य पीक
            </span>
            <span className="haladhar-info-value">{primaryCrop}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">जमिनीचा आकार</span>
            <span className="haladhar-info-value">{landSize}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">व्यवसाय प्रकार</span>
            <span className="haladhar-info-value">{enterpriseType}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">सिंचन</span>
            <span className="haladhar-info-value">{irrigationType}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">माती प्रकार</span>
            <span className="haladhar-info-value">{soilType}</span>
          </div>

          <p style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'var(--haladhar-text-muted)', 
            marginTop: 'var(--space-md)',
            padding: 'var(--space-sm)',
            background: '#f0f9ff',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 0
          }}>
            ℹ️ ही माहिती HALADHAR AI तुम्हाला अधिक चांगले सल्ले देण्यासाठी वापरते
          </p>
        </div>

      </main>

      {/* Bottom nav */}
      <nav className="haladhar-bottom-nav">
        <button className="haladhar-nav-item" onClick={() => navigate('/')}>
          <Home size={24} strokeWidth={2} />
          <span>{ht('haladhar.nav.home')}</span>
        </button>
        <button className="haladhar-nav-item active" onClick={() => navigate('/farm')}>
          <Tractor size={24} strokeWidth={2} />
          <span>{ht('haladhar.nav.profile')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/services')}>
          <LayoutGrid size={24} strokeWidth={2} />
          <span>{ht('haladhar.nav.services')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/more')}>
          <MoreHorizontal size={24} strokeWidth={2} />
          <span>{ht('haladhar.nav.more')}</span>
        </button>
      </nav>
    </div>
  );
}
