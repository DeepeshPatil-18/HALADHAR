import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Bug, Leaf } from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

// Common issues list — static educational content, no fake API data
const COMMON_DISEASES = [
  { name: 'करपा (Blight)', crop: 'भात / टोमॅटो' },
  { name: 'भुरी (Powdery Mildew)', crop: 'द्राक्ष / कांदा' },
  { name: 'तांबेरा (Rust)', crop: 'गहू / हरभरा' },
  { name: 'मर रोग (Wilt)', crop: 'कापूस / मिरची' },
];
const COMMON_PESTS = [
  { name: 'बोंडअळी (Bollworm)', crop: 'कापूस' },
  { name: 'माव (Aphids)',       crop: 'सर्व पिके' },
  { name: 'पांढरी माशी (Whitefly)', crop: 'कापूस / मिरची' },
  { name: 'थ्रिप्स (Thrips)',  crop: 'कांदा / द्राक्ष' },
];

export function DiseasePage() {
  const navigate = useNavigate();
  const { ht }   = useHaladharTranslation();
  const fileRef  = useRef<HTMLInputElement>(null);

  const handleCapture = () => fileRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Route to AI with context — preserves existing AI functionality
      navigate('/ai', {
        state: { initialQuery: `${ht('haladhar.crop.checkDisease')}: ${file.name}` },
      });
    }
    e.target.value = '';
  };

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            <ChevronLeft size={24} color="var(--haladhar-text-primary)" />
          </button>
          <h1 className="haladhar-heading" style={{ margin: 0, marginLeft: 'var(--space-sm)' }}>
            {ht('haladhar.disease.title')}
          </h1>
        </div>

        {/* Primary action — large camera circle */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <button
            onClick={handleCapture}
            style={{
              width: 148, height: 148, borderRadius: '50%',
              backgroundColor: 'var(--haladhar-green)',
              border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-md)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Camera size={56} color="white" strokeWidth={1.5} />
          </button>

          <h2 className="haladhar-subheading" style={{ marginBottom: 'var(--space-xs)' }}>
            {ht('haladhar.disease.takePhoto')}
          </h2>
          <p className="haladhar-body">{ht('haladhar.crop.photoInstruction')}</p>

          <button
            className="haladhar-button haladhar-button-primary"
            onClick={handleCapture}
            style={{ width: '100%', marginTop: 'var(--space-lg)' }}
          >
            <Camera size={20} />
            {ht('haladhar.action.takePhoto')}
          </button>

          {/* Hidden file input — accepts camera on mobile */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        <div className="haladhar-divider" />

        {/* Common Diseases */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Leaf size={20} color="var(--haladhar-green)" />
            <h3 className="haladhar-subheading" style={{ margin: 0 }}>
              {ht('haladhar.disease.common')}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {COMMON_DISEASES.map((d, i) => (
              <div key={i} className="haladhar-card" style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{d.name}</span>
                  <span className="haladhar-caption">{d.crop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Pests */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Bug size={20} color="var(--haladhar-red)" />
            <h3 className="haladhar-subheading" style={{ margin: 0 }}>
              {ht('haladhar.disease.commonPests')}
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {COMMON_PESTS.map((p, i) => (
              <div key={i} className="haladhar-card" style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{p.name}</span>
                  <span className="haladhar-caption">{p.crop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
