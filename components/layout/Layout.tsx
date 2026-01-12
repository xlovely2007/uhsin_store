
import React from 'react';
// Corrected import path
import { View, User } from '../../types/index';
import BottomNav from './BottomNav';
import BackToTop from '../ui/BackToTop';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  cartCount: number;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, cartCount, user, onLogout }) => {
  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0 md:pt-16">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4 md:px-8 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-100 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Uhsin Store</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setView('home')} className={`text-sm font-bold ${currentView === 'home' ? 'text-indigo-600' : 'text-gray-500'}`}>Home</button>
            <button onClick={() => setView('products')} className={`text-sm font-bold ${currentView === 'products' ? 'text-indigo-600' : 'text-gray-500'}`}>Products</button>
            <button onClick={() => setView('orders')} className={`text-sm font-bold relative ${currentView === 'orders' ? 'text-indigo-600' : 'text-gray-500'}`}>Orders
              {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>}
            </button>
            <button onClick={() => setView('profile')} className={`text-sm font-bold ${currentView === 'profile' ? 'text-indigo-600' : 'text-gray-500'}`}>Profile</button>
            {user?.role === 'admin' && <button onClick={() => setView('admin')} className="bg-gray-900 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95">Admin Portal</button>}
          </nav>
          {user ? (
            <div className="flex items-center gap-2 border-l border-gray-100 pl-2 md:pl-6 ml-2 md:ml-0">
              <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-red-500 transition-all group">
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">Sign Out</span>
              </button>
            </div>
          ) : (
            <button onClick={() => setView('auth')} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Sign In</button>
          )}
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:py-8 mt-16 md:mt-0">{children}</main>
      <BottomNav currentView={currentView} setView={setView} cartCount={cartCount} />
    </div>
  );
};

export default Layout;
