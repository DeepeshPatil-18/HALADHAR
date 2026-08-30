import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Droplets, Bug } from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

export function CropPage() {
  const navigate = useNavigate();
  const { ht } = useHaladharTranslation();

  // Sample crop data
  const cropData = {
    name: 'कापूस',
    status: 'चांगली',
    stage: 'फुलोरा अवस्था',
    planted: '14 जुलै',
    area: '3 एकर',
  };

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
          <button onClick={() => navigate('/farm')} style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <ChevronLeft size={24} color="var(--haladhar-text-primary)" />
          </button>
          <h1 className="haladhar-heading" style={{ margin: 0, marginLeft: 'var(--space-sm)' }}>
            {cropData.name}
          </h1>
        </div>

        {/* Crop Status */}
        <div className="haladhar-card haladhar-spacer-lg">
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <span className="haladhar-caption">{ht('haladhar.crop.status')}</span>
            <p className="haladhar-subheading" style={{ color: 'var(--haladhar-green)', marginTop: 'var(--space-xs)' }}>
              {cropData.status}
            </p>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">{ht('haladhar.crop.stage')}</span>
            <span className="haladhar-info-value">{cropData.stage}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">{ht('haladhar.crop.planted')}</span>
            <span className="haladhar-info-value">{cropData.planted}</span>
          </div>

          <div className="haladhar-info-row">
            <span className="haladhar-info-label">{ht('haladhar.crop.area')}</span>
            <span className="haladhar-info-value">{cropData.area}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <button
            className="haladhar-button haladhar-button-primary"
            onClick={() => navigate('/disease')}
            style={{ width: '100%' }}
          >
            <Camera size={20} />
            {ht('haladhar.crop.takePhoto')}
          </button>

          <p className="haladhar-caption" style={{ textAlign: 'center', marginTop: 0 }}>
            {ht('haladhar.crop.photoInstruction')}
          </p>

          <button
            className="haladhar-service-box"
            onClick={() => navigate('/water')}
          >
            <div className="haladhar-service-icon">
              <Droplets size={24} strokeWidth={2} />
            </div>
            <div className="haladhar-service-content">
              <span className="haladhar-service-title">{ht('haladhar.farm.waterInfo')}</span>
            </div>
          </button>

          <button
            className="haladhar-service-box"
            onClick={() => navigate('/disease')}
          >
            <div className="haladhar-service-icon">
              <Bug size={24} strokeWidth={2} />
            </div>
            <div className="haladhar-service-content">
              <span className="haladhar-service-title">{ht('haladhar.crop.checkDisease')}</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
