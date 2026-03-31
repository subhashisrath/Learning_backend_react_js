import { useState, useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast">
      <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${type === 'success' ? 'text-emerald-500' : type === 'error' ? 'text-red-500' : 'text-primary-500'}`} />
      <p className="text-sm font-medium text-surface-800">{message}</p>
      <button onClick={onClose} className="ml-2 rounded-lg p-1 text-surface-400 hover:bg-surface-100">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
