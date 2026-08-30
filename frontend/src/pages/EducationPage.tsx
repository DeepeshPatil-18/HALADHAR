import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Droplets, Bug, Sprout, IndianRupee, Tractor } from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

export function EducationPage() {
  const navigate = useNavigate();
  const { ht }   = useHaladharTranslation();

  const categories = [
    {
      icon: Sprout,
      title: ht('haladhar.education.cropInfo'),
      query: 'पिकांची माहिती',
    },
    {
      icon: Droplets,
      title: ht('haladhar.education.waterSaving'),
      query: 'पाणी बचत कशी करावी',
    },
    {
      icon: Bug,
      title: ht('haladhar.education.diseasePest'),
      query: 'पिकांवरील रोग आणि किड',
    },
    {
      icon: Tractor,
      title: ht('haladhar.education.modern'),
      query: 'आधुनिक शेती तंत्र',
    },
    {
      icon: IndianRupee,
      title: ht('haladhar.education.marketInfo'),
      query: 'बाजारभाव माहिती',
    },
  ];

  const handleCategory = (query: string) => {
    // Opens AI assistant with the topic as initial query — reuses existing AI
    navigate('/ai', { state: { initialQuery: query } });
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
          <div style={{ marginLeft: 'var(--space-sm)' }}>
            <h1 className="haladhar-heading" style={{ margin: 0 }}>
              {ht('haladhar.education.title')}
            </h1>
          </div>
        </div>

        {/* Intro */}
        <div className="haladhar-card" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <BookOpen size={32} color="var(--haladhar-green)" style={{ flexShrink: 0 }} />
          <p className="haladhar-body">{ht('haladhar.help.askHaladhar')}</p>
        </div>

        {/* Category list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={i}
                className="haladhar-service-box"
                onClick={() => handleCategory(cat.query)}
              >
                <div className="haladhar-service-icon">
                  <Icon size={26} strokeWidth={2} />
                </div>
                <span className="haladhar-service-title" style={{ flex: 1, textAlign: 'left' }}>
                  {cat.title}
                </span>
                <ChevronRight size={20} color="var(--haladhar-text-muted)" />
              </button>
            );
          })}
        </div>

      </main>
    </div>
  );
}
