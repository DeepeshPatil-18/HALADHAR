interface ErrorAlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export default function ErrorAlert({ title = 'Error', message, onClose }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-red-800">{title}</h3>
          <p className="text-red-700 text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
