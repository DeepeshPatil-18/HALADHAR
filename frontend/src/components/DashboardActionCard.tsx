import { Link } from 'react-router-dom';

interface DashboardActionCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  path: string;
  color?: string;
}

export function DashboardActionCard({
  icon,
  title,
  subtitle,
  path,
  color = 'bg-white',
}: DashboardActionCardProps) {
  return (
    <Link to={path} className="block">
      <div
        className={`${color} rounded-xl border-2 border-gray-200 p-5 
                  hover:border-[#0b5e2c] hover:shadow-lg transition-all
                  active:scale-[0.96] min-h-[140px] flex flex-col justify-center`}
      >
        {/* Icon */}
        <div className="text-[40px] mb-3 text-center">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-bold text-gray-900 text-center mb-1">
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[12px] text-gray-600 text-center leading-tight">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}
