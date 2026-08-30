/**
 * CTAButton - Consistent call-to-action button
 */

import { ChevronRight } from 'lucide-react';

interface CTAButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export function CTAButton({ 
  label, 
  onClick, 
  variant = 'ghost',
  icon
}: CTAButtonProps) {
  const variantClasses = {
    primary: 'bg-[#0b5e2c] text-white hover:bg-[#094d24]',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'text-[#0b5e2c] hover:bg-[#0b5e2c]/5'
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        px-4 py-2 rounded-lg
        flex items-center gap-2
        text-[13px] font-semibold
        active:scale-95 transition-all
      `}
    >
      {icon}
      <span>{label}</span>
      <ChevronRight size={16} strokeWidth={2.5} />
    </button>
  );
}
