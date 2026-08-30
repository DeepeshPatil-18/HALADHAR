interface FarmerUpdate {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  location: string;
  date: string;
  link?: string;
}

interface FarmerUpdateCardProps {
  update: FarmerUpdate;
}

export function FarmerUpdateCard({ update }: FarmerUpdateCardProps) {
  const handleClick = () => {
    if (update.link) {
      // Handle navigation
      console.log('Navigate to:', update.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl border border-gray-200 p-4 
                hover:shadow-md hover:border-[#0b5e2c] transition-all cursor-pointer
                active:scale-[0.98]"
    >
      {/* Header with icon and category */}
      <div className="flex items-start gap-3 mb-2">
        <span className="text-[24px]">{update.icon}</span>
        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-gray-900 mb-1">
            {update.title}
          </h3>
          <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2">
            {update.description}
          </p>
        </div>
      </div>

      {/* Footer with location and date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-[11px] text-gray-500">
          {update.location} • {update.date}
        </span>
        <span className="text-[#0b5e2c] text-[13px] font-semibold">
          देखें →
        </span>
      </div>
    </div>
  );
}
