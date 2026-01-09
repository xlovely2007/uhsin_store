
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, cartCount }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'products', label: 'Products', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )},
    { id: 'orders', label: 'Orders', badge: cartCount, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )},
    { id: 'profile', label: 'Profile', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )}
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as View)}
          className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${
            currentView === item.id ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <div className={`p-1 rounded-full transition-all ${currentView === item.id ? 'bg-indigo-50' : ''}`}>
            {item.icon}
          </div>
          <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span className="absolute top-2 right-1/4 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
