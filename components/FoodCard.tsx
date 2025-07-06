

import React, { useState } from 'react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onCardClick: (id: string) => void;
  onAddToCart: (item: FoodItem, quantity: number) => void;
  appLogoUrl: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onCardClick, onAddToCart, appLogoUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onCardClick from firing when the button is clicked
    onAddToCart(item, 1);
  };

  const hasDiscount = item.discountPercent && item.discountPercent > 0;
  const discountedPrice = hasDiscount ? item.price * (1 - (item.discountPercent ?? 0) / 100) : item.price;

  return (
    <div 
      className="bg-white border border-[#D6EAF8] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95 relative"
      onClick={() => onCardClick(item.id)}
    >
      <div className="w-full h-32 relative bg-gray-100">
        {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img
                    src={appLogoUrl}
                    alt="Loading..."
                    className="w-12 h-12 object-contain filter grayscale opacity-30 animate-pulse"
                />
            </div>
        )}
        <img
            src={item.imageUrl}
            alt={item.name}
            className={`w-full h-32 object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
        />
      </div>

       {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md z-10">
            -{item.discountPercent}%
          </div>
        )}
      <div className="p-3">
        <h3 className="text-md font-semibold text-[#333333] truncate">{item.name}</h3>
        <p className="text-sm text-[#666666]">{item.category}</p>
        <div className="flex justify-between items-center mt-2">
           {hasDiscount ? (
            <div>
              <span className="text-sm font-bold text-gray-400 line-through">₦{item.price.toFixed(0)}</span>
              <span className="text-lg font-bold text-red-500 ml-1.5">₦{discountedPrice.toFixed(0)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-[#2874A6]">₦{item.price.toFixed(0)}</span>
          )}
          <button 
            onClick={handleAddToCartClick}
            className="bg-[#5DADE2] text-white rounded-full p-1.5 shadow-md hover:bg-[#2874A6] transition-colors"
            aria-label={`Add one ${item.name} to cart`}
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};