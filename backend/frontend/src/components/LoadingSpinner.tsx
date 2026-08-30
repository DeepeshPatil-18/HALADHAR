interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="w-full h-full border-4 border-gray-200 border-t-green-600 rounded-full"></div>
      </div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
}
