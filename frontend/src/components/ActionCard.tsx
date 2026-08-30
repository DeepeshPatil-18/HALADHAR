/**
 * ActionCard - Consistent card for primary actions
 */

import { ChevronRight } from 'lucide-react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export function ActionCard({ icon, title, description, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-4 
                 flex flex-col items-start gap-3
                 hover:border-[#0b5e2c] hover:shadow-sm
                 active:scale-[0.98] transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-[#0b5e2c]/10 text-[#0b5e2c]
                      flex items-center justify-center">
        {icon}
      </div>
      
      <div className="flex-1 text-left">
        <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-[13px] text-gray-600 leading-snug">
          {description}
        </p>
      </div>
      
      <ChevronRight size={18} className="text-gray-400 self-end -mt-2" />
    </button>
  );
}
