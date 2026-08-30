import { useTranslation } from '../i18n/useTranslation';

export function GovHeader() {
  const { t } = useTranslation();

  return (
    <header className="gov-header">
      <div className="mobile-container">
        <div className="flex items-center justify-between py-4">
          {/* Left: KrishiMitra Logo */}
          <div className="flex items-center gap-2.5">
            <div className="text-3xl">🌾</div>
            <div>
              <h1 className="text-[19px] font-bold text-gov-green leading-tight">
                {t('app.title')}
              </h1>
              <p className="text-[11px] text-gov-text-gray">
                {t('app.tagline') || 'कृषि सहायक'}
              </p>
            </div>
          </div>

          {/* Right: Ashoka Emblem with Bilingual Text */}
          <div className="flex flex-col items-end">
            {/* Ashoka Emblem Icon (simplified as emoji for now) */}
            <div className="text-3xl mb-1">🇮🇳</div>
            
            {/* Team Attribution */}
            <div className="bilingual-text text-right">
              <div className="text-gov-green font-semibold text-[11px]">Team Airavata</div>
              <div className="text-[10px] mt-0.5">Agriculture Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
