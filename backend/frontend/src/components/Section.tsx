/**
 * Section - Consistent section spacing and headers
 */

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'relaxed';
}

export function Section({ 
  title, 
  subtitle, 
  children,
  spacing = 'normal'
}: SectionProps) {
  const spacingClasses = {
    tight: 'space-y-3',
    normal: 'space-y-4',
    relaxed: 'space-y-6'
  };
  
  return (
    <section className={spacingClasses[spacing]}>
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && (
            <h2 className="text-[20px] font-bold text-gray-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-[14px] text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
