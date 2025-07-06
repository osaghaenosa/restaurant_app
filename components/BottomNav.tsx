
import React from 'react';
import { Tab } from '../types';
import { Icon } from './Icons';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  cartCount: number;
}

const NavItem: React.FC<{
  tab: Tab;
  iconName: React.ComponentProps<typeof Icon>['name'];
  label: string;
  activeTab: Tab;
  onClick: (tab: Tab) => void;
  badgeCount?: number;
}> = ({ tab, iconName, label, activeTab, onClick, badgeCount }) => {
  const isActive = activeTab === tab;
  const color = isActive ? 'text-[#5DADE2]' : 'text-[#2874A6]';

  return (
    <button onClick={() => onClick(tab)} className="flex flex-col items-center justify-center w-full transition-colors duration-200">
      <div className="relative">
        <Icon name={iconName} className={`h-7 w-7 ${color}`} />
        {badgeCount && badgeCount > 0 && (
          <div className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {badgeCount}
          </div>
        )}
      </div>
      <span className={`text-xs mt-1 ${color} ${isActive ? 'font-semibold' : 'font-normal'}`}>{label}</span>
    </button>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, cartCount }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#FFFFFF] shadow-[0_-2px_5px_rgba(0,0,0,0.05)] border-t border-[#D6EAF8] flex justify-around items-center px-2">
      <NavItem tab={Tab.Home} iconName="home" label="Home" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem tab={Tab.Reels} iconName="reels" label="Reels" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem tab={Tab.Orders} iconName="orders" label="Orders" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem tab={Tab.Cart} iconName="cart" label="Cart" activeTab={activeTab} onClick={setActiveTab} badgeCount={cartCount} />
      <NavItem tab={Tab.Account} iconName="account" label="Account" activeTab={activeTab} onClick={setActiveTab} />
    </nav>
  );
};