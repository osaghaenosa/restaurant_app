

import React from 'react';
import { FoodCard } from '../components/FoodCard';
import { AppSettings, FoodItem } from '../types';
import { Icon } from '../components/Icons';

interface DealsScreenProps {
    foodItems: FoodItem[];
    onFoodItemClick: (id: string) => void;
    onAddToCart: (item: FoodItem, quantity: number) => void;
    onBack: () => void;
    appSettings: AppSettings;
}

const DealsBanner: React.FC = () => (
    <div className="bg-gradient-to-r from-red-500 to-orange-400 text-white p-6 rounded-2xl shadow-lg my-4 flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold">Hot Deals! 🔥</h2>
            <p className="text-md">Up to 40% OFF on selected items!</p>
        </div>
        <span className="text-5xl font-extrabold transform -rotate-12 opacity-80">SALE</span>
    </div>
);

export const DealsScreen: React.FC<DealsScreenProps> = ({ foodItems, onFoodItemClick, onAddToCart, onBack, appSettings }) => {
    const dealItems = foodItems.filter(item => item.discountPercent && item.discountPercent > 0);

    return (
        <div className="bg-[#F9F9F9] min-h-screen animate-slide-in">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
                <h1 className="text-xl font-bold text-[#333333] text-center flex-grow mr-8">Fresh Deals</h1>
            </header>
            <div className="p-4 space-y-4">
                <DealsBanner />
                <div>
                    <h2 className="text-xl font-bold text-[#333333] mb-3">Don't Miss Out!</h2>
                    {dealItems.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {dealItems.map(item => (
                                <FoodCard 
                                    key={item.id} 
                                    item={item} 
                                    onCardClick={onFoodItemClick}
                                    onAddToCart={onAddToCart}
                                    appLogoUrl={appSettings.appLogoUrl}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#666666]">No deals available right now. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};