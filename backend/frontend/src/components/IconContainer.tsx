/**
 * IconContainer - Consistent icon treatment for cards and actions
 */

interface IconContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export function IconContainer({ 
  children, 
  variant = 'default',
  size = 'md'
}: IconContainerProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };
  
  const variantClasses = {
    default: 'bg-gray-50 text-gray-700',
    accent: 'bg-[#0b5e2c]/10 text-[#0b5e2c]',
    subtle: 'bg-white text-gray-600 border border-gray-200'
  };
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-xl flex items-center justify-center
      `}
    >
      {children}
    </div>
  );
}
