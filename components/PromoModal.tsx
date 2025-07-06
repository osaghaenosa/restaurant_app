
import React from 'react';

interface PromoModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

export const PromoModal: React.FC<PromoModalProps> = ({ visible, onClose, onNavigate }) => {
  if (!visible) return null;

  // Prevents clicks inside the modal from closing it
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      onClick={onClose} // Close when clicking the backdrop
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-zoom-in"
        onClick={handleModalContentClick}
      >
        <div className="relative">
          <img src="https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Delicious food" className="w-full h-48 object-cover"/>
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 bg-black/30 text-white rounded-full p-1.5 hover:bg-black/50 transition-colors"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 text-center">
          <h2 id="promo-title" className="text-3xl font-bold text-[#2874A6]">You Don't Want To Miss This!</h2>
          <p className="text-md text-[#666] mt-2">Get up to <span className="font-bold text-[#5DADE2]">40% OFF</span> on all burgers and pizzas this weekend. Fresh deals are waiting for you.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
             <button
              onClick={onClose}
              className="w-full bg-gray-200 text-[#333] font-bold py-3 px-4 rounded-full shadow-md hover:bg-gray-300 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={onNavigate}
              className="w-full bg-gradient-to-r from-[#5DADE2] to-[#2874A6] text-white font-bold py-3 px-4 rounded-full shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              Shop Deals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
