
import React from 'react';
import { CustomPage } from '../types';
import { Icon } from '../components/Icons';

interface CustomPageScreenProps {
    page: CustomPage;
    onBack: () => void;
}

export const CustomPageScreen: React.FC<CustomPageScreenProps> = ({ page, onBack }) => {
    return (
        <div className="bg-[#F9F9F9] min-h-screen animate-slide-in">
            <header className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                    <Icon name="chevron-left" className="w-6 h-6 text-[#333333]" />
                </button>
                <h1 className="text-xl font-bold text-[#333333] text-center flex-grow mr-8">{page.title}</h1>
            </header>

            <div className="p-6">
                <div className="bg-white border border-[#D6EAF8] rounded-xl p-6 shadow-sm">
                    <p className="text-md text-[#444] leading-relaxed whitespace-pre-wrap">
                        {page.content}
                    </p>
                </div>
            </div>
        </div>
    );
};
