

import React from 'react';
import { FoodCard } from '../components/FoodCard';
import { FoodItem, AppSettings } from '../types';

const categories = ['All', 'Burgers', 'Pizza', 'Salads', 'Sushi', 'Pasta', 'Desserts'];

const PromoBanner: React.FC<{title: string, subtitle: string}> = ({title, subtitle}) => (
    <div className="bg-gradient-to-r from-[#5DADE2] to-[#2874A6] text-white p-6 rounded-2xl shadow-lg my-4 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm">{subtitle}</p>
        </div>
        <button className="bg-white text-[#2874A6] font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transition">
            Order Now
        </button>
    </div>
);

export const HomeScreen = ({ 
    foodItems, 
    onFoodItemClick, 
    onAddToCart,
    appSettings
}: { 
    foodItems: FoodItem[];
    onFoodItemClick: (id: string) => void;
    onAddToCart: (item: FoodItem, quantity: number) => void;
    appSettings: AppSettings;
}) => {
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredItems = foodItems
        .filter(item => activeCategory === 'All' || item.category === activeCategory)
        .filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="p-4 space-y-4">
            <header className="flex justify-between items-center">
                 <div>
                    <p className="text-sm text-[#666666]">Welcome to</p>
                    <h1 className="text-2xl font-bold text-[#333333]">{appSettings.appName}</h1>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover"/>
                 </div>
            </header>

            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search for dishes..." 
                    className="w-full bg-[#F9F9F9] border border-[#D6EAF8] rounded-full py-3 pl-12 pr-4 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#5DADE2]" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>

            <div className="overflow-x-auto pb-2 -mx-4 px-4">
                <div className="flex space-x-3">
                    {categories.map(category => (
                        <button key={category} onClick={() => setActiveCategory(category)} className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${activeCategory === category ? 'bg-[#2874A6] text-white' : 'bg-[#D6EAF8] text-[#333333]'}`}>
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <PromoBanner title={appSettings.promoTitle} subtitle={appSettings.promoSubtitle} />

            <div>
                <h2 className="text-xl font-bold text-[#333333] mb-3">
                    {searchQuery ? `Results for "${searchQuery}"` : 'Featured Menu'}
                </h2>
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredItems.map(item => (
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
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-500">No Dishes Found</p>
                        <p className="text-sm text-gray-400">Try changing your search query or category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};