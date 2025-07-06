
import React from 'react';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
  return (
    <div 
      className="fixed top-5 right-5 z-50 animate-fade-in-down"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center bg-gradient-to-r from-[#28a745] to-[#218838] text-white text-sm font-semibold px-4 py-3 rounded-lg shadow-xl border-2 border-white/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{message}</p>
        <button onClick={onClose} className="ml-4 -mr-1 p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Close notification">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
