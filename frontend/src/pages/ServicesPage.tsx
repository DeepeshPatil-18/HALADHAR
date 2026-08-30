import { useNavigate } from 'react-router-dom';
import {
  CloudSun, Sprout, Droplets, IndianRupee, Bug,
  ClipboardList, BookOpen, ChevronRight,
  Home, Tractor, LayoutGrid, MoreHorizontal, Wrench,
} from 'lucide-react';
import { useHaladharTranslation } from '../i18n/haladhar-translations';
import '../styles/haladhar-design.css';

export function ServicesPage() {
  const navigate = useNavigate();
  const { ht }   = useHaladharTranslation();

  const services = [
    { icon: CloudSun,     title: ht('haladhar.service.weather'),   route: '/weather' },
    { icon: Droplets,     title: ht('haladhar.service.water'),     route: '/water' },
    { icon: Sprout,       title: ht('haladhar.service.myCrop'),    route: '/crop' },
    { icon: Bug,          title: ht('haladhar.service.disease'),   route: '/disease' },
    { icon: IndianRupee,  title: ht('haladhar.service.market'),    route: '/bazaar' },
    { icon: ClipboardList,title: ht('haladhar.service.schemes'),   route: '/help' },
    { icon: BookOpen,     title: ht('haladhar.service.education'), route: '/education' },
    { icon: Wrench,       title: ht('haladhar.service.labour'),    route: '/labour' },
  ];

  return (
    <div className="haladhar-container">
      <main className="haladhar-page">

        <h1 className="haladhar-heading" style={{ marginBottom: 'var(--space-lg)' }}>
          {ht('haladhar.nav.services')}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                className="haladhar-service-box"
                onClick={() => navigate(s.route)}
              >
                <div className="haladhar-service-icon">
                  <Icon size={26} strokeWidth={2} />
                </div>
                <span className="haladhar-service-title" style={{ flex: 1, textAlign: 'left' }}>
                  {s.title}
                </span>
                <ChevronRight size={20} color="var(--haladhar-text-muted)" />
              </button>
            );
          })}
        </div>

      </main>

      {/* Bottom nav — Services tab active */}
      <nav className="haladhar-bottom-nav">
        <button className="haladhar-nav-item" onClick={() => navigate('/')}>
          <Home size={24} strokeWidth={2} /><span>{ht('haladhar.nav.home')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/farm')}>
          <Tractor size={24} strokeWidth={2} /><span>{ht('haladhar.nav.myFarm')}</span>
        </button>
        <button className="haladhar-nav-item active" onClick={() => navigate('/services')}>
          <LayoutGrid size={24} strokeWidth={2} /><span>{ht('haladhar.nav.services')}</span>
        </button>
        <button className="haladhar-nav-item" onClick={() => navigate('/more')}>
          <MoreHorizontal size={24} strokeWidth={2} /><span>{ht('haladhar.nav.more')}</span>
        </button>
      </nav>
    </div>
  );
}
