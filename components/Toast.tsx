
import React from 'react';
import { XIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from '../constants';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  let bgColor = '';
  let borderColor = '';
  let icon = null;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      borderColor = 'border-green-600';
      icon = <CheckCircleIcon className="h-5 w-5 text-white" />;
      break;
    case 'error':
      bgColor = 'bg-red-500';
      borderColor = 'border-red-600';
      icon = <XCircleIcon className="h-5 w-5 text-white" />;
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-500';
      borderColor = 'border-blue-600';
      icon = <InfoIcon className="h-5 w-5 text-white" />;
      break;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white flex items-center space-x-3 ${bgColor} ${borderColor} border`}
    >
      {icon}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto text-white opacity-90 hover:opacity-100" aria-label="Close notification">
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
