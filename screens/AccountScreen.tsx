
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, CustomPage } from '../types';
import { Icon } from '../components/Icons';

interface AccountScreenProps {
    user: UserProfile;
    customPages: CustomPage[];
    onShowAdmin: () => void;
    onShowDeals: () => void;
    onEditProfile: () => void;
    onShowAddresses: () => void;
    onShowPayments: () => void;
    onShowCustomPage: (id: string) => void;
    onLogout: () => void;
}

const SettingItem: React.FC<{ iconName: React.ComponentProps<typeof Icon>['name']; label: string; onClick?: () => void }> = ({ iconName, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-white border border-transparent rounded-lg text-left hover:bg-[#F9F9F9] transition-colors active:bg-[#D6EAF8]">
        <div className="flex items-center">
            <Icon name={iconName} className="w-6 h-6 text-[#2874A6] mr-4"/>
            <span className="text-md font-semibold text-[#333333]">{label}</span>
        </div>
        <Icon name="chevron-right" className="w-5 h-5 text-[#666666]"/>
    </button>
);

export const AccountScreen: React.FC<AccountScreenProps> = (props) => {
    const { user, customPages, onLogout, onEditProfile, onShowAddresses, onShowPayments, onShowDeals, onShowAdmin, onShowCustomPage } = props;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const threshold = 50; // pixels to scroll before collapsing
            setIsHeaderCollapsed(container.scrollTop > threshold);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);
    
    const canSeeAdmin = user.role === 'admin' || user.role === 'superadmin';

    return (
        <div className="relative h-full flex flex-col bg-[#F9F9F9]">
             {/* Sticky Collapsed Header */}
            <header className={`sticky top-0 z-20 flex items-center p-4 bg-white/80 backdrop-blur-sm shadow-sm transition-opacity duration-300 ${isHeaderCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <img src={user.avatarUrl} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-white"/>
                <h1 className="ml-3 text-lg font-bold text-[#333333]">{user.name}</h1>
            </header>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                {/* Expanded Header */}
                <div className="relative h-48 w-full bg-gradient-to-r from-[#5DADE2] to-[#2874A6] flex items-end p-4 text-white">
                    <div className={`absolute bottom-4 left-4 flex items-center transition-all duration-300 ${isHeaderCollapsed ? 'opacity-0 transform -translate-y-4' : 'opacity-100'}`}>
                        <div className="relative">
                            <img src={user.avatarUrl} alt="User" className="w-20 h-20 rounded-full object-cover border-4 border-white/50 shadow-lg"/>
                            <button onClick={onEditProfile} className="absolute -bottom-1 -right-1 bg-white text-[#2874A6] rounded-full p-1 shadow-md">
                                <Icon name="edit" className="w-4 h-4"/>
                            </button>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-sm opacity-90">{user.email}</p>
                        </div>
                    </div>
                </div>
                
                {/* Settings List */}
                <div className="p-4 space-y-2 bg-[#F9F9F9]">
                    <div className="bg-white rounded-xl shadow-sm border border-[#D6EAF8]">
                        <SettingItem iconName="account" label="Edit Profile" onClick={onEditProfile} />
                        <SettingItem iconName="orders" label="Saved Addresses" onClick={onShowAddresses} />
                        <SettingItem iconName="cart" label="Payment Methods" onClick={onShowPayments} />
                    </div>
                     <div className="bg-white rounded-xl shadow-sm border border-[#D6EAF8]">
                        <SettingItem iconName="tag" label="See Deals" onClick={onShowDeals} />
                        {canSeeAdmin && <SettingItem iconName="dashboard" label="Admin Panel" onClick={onShowAdmin} />}
                    </div>
                     {customPages.length > 0 && (
                         <div className="bg-white rounded-xl shadow-sm border border-[#D6EAF8]">
                            {customPages.map(page => (
                                <SettingItem 
                                    key={page.id} 
                                    iconName={page.icon} 
                                    label={page.title} 
                                    onClick={() => onShowCustomPage(page.id)} 
                                />
                            ))}
                        </div>
                    )}
                     <div className="bg-white rounded-xl shadow-sm border border-[#D6EAF8]">
                        <button onClick={onLogout} className="w-full flex items-center p-4 text-left text-red-500 hover:bg-red-50 transition-colors rounded-lg">
                            <Icon name="logout" className="w-6 h-6 mr-4"/>
                            <span className="text-md font-semibold">Log Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
