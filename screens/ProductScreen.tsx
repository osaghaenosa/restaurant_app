

import React, { useState } from 'react';
import { AppSettings, FoodItem } from '../types';
import { Icon } from '../components/Icons';
import { FoodCard } from '../components/FoodCard';

interface ProductScreenProps {
  item: FoodItem;
  allFoodItems: FoodItem[];
  onAddToCart: (item: FoodItem, quantity: number) => void;
  onBack: () => void;
  onProductClick: (id: string) => void;
  appSettings: AppSettings;
}

export const ProductScreen: React.FC<ProductScreenProps> = ({ item, allFoodItems, onAddToCart, onBack, onProductClick, appSettings }) => {
    const [quantity, setQuantity] = useState(1);
    const [mainImageLoaded, setMainImageLoaded] = useState(false);

    const relatedItems = allFoodItems.filter(
        fi => fi.category === item.category && fi.id !== item.id
    ).slice(0, 4);

    const handleAddToCartClick = () => {
        onAddToCart(item, quantity);
        onBack(); // Return to the previous screen after adding to cart
    };
    
    const hasDiscount = item.discountPercent && item.discountPercent > 0;
    const discountedPrice = hasDiscount ? item.price * (1 - (item.discountPercent ?? 0) / 100) : item.price;


    return (
        <div className="bg-white min-h-screen animate-slide-in">
            <div className="relative">
                <div className="w-full h-64 relative bg-gray-100">
                    {!mainImageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <img
                                src={appSettings.appLogoUrl}
                                alt="Loading..."
                                className="w-16 h-16 object-contain filter grayscale opacity-30 animate-pulse"
                            />
                        </div>
                    )}
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={`w-full h-64 object-cover transition-opacity duration-500 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setMainImageLoaded(true)}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <button onClick={onBack} className="absolute top-4 left-4 bg-white/70 p-2 rounded-full backdrop-blur-sm hover:bg-white/90 transition-all duration-200 shadow-md">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
            </div>
            
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold text-[#333333] flex-1 pr-4">{item.name}</h1>
                     {hasDiscount ? (
                        <div className="text-right">
                            <span className="text-xl font-bold text-gray-400 line-through">₦{item.price.toFixed(0)}</span>
                            <span className="text-2xl font-bold text-red-500 ml-2">₦{discountedPrice.toFixed(0)}</span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-[#2874A6]">₦{item.price.toFixed(0)}</span>
                    )}
                </div>
                
                 <div className="flex items-center space-x-2">
                    <p className="text-sm text-[#2874A6] font-semibold bg-[#D6EAF8] inline-block px-3 py-1 rounded-full">{item.category}</p>
                    {hasDiscount && (
                        <p className="text-sm text-white font-semibold bg-red-500 inline-block px-3 py-1 rounded-full">
                            {item.discountPercent}% OFF
                        </p>
                    )}
                </div>

                <p className="text-md text-[#444] mt-2 leading-relaxed">
                    {item.description}
                </p>
            </div>

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 border-t border-[#D6EAF8]">
                 <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="bg-[#D6EAF8] text-[#2874A6] rounded-full p-2.5 hover:bg-[#5DADE2] hover:text-white transition-colors disabled:opacity-50" disabled={quantity <= 1}>
                            <Icon name="remove" className="w-5 h-5" />
                        </button>
                        <span className="w-12 text-center font-bold text-xl text-[#333333]">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="bg-[#D6EAF8] text-[#2874A6] rounded-full p-2.5 hover:bg-[#5DADE2] hover:text-white transition-colors">
                            <Icon name="add" className="w-5 h-5" />
                        </button>
                    </div>
                    <button onClick={handleAddToCartClick} className="bg-[#2874A6] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transition-all text-md flex items-center active:scale-95">
                        <Icon name="cart" className="w-5 h-5 mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>

            {relatedItems.length > 0 && (
                <div className="p-4 mt-2">
                    <h2 className="text-xl font-bold text-[#333333] mb-3">You might also like</h2>
                    <div className="grid grid-cols-2 gap-4 pb-4">
                        {relatedItems.map(relatedItem => (
                            <FoodCard 
                                key={relatedItem.id} 
                                item={relatedItem} 
                                onCardClick={onProductClick}
                                onAddToCart={onAddToCart}
                                appLogoUrl={appSettings.appLogoUrl}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};