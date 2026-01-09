
import React, { useState } from 'react';
import { User, View } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
  setView: (view: View) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, setView }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'admin@uhsinstore.com', // Pre-fill for easy testing
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for "Modern JWT Setup"
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock authentication + JWT simulation
    const mockToken = btoa(JSON.stringify({ email: formData.email, role: formData.email.includes('admin') ? 'admin' : 'user' }));
    localStorage.setItem('uhsin_jwt', mockToken);

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: formData.name || (formData.email.split('@')[0]),
      role: formData.email.includes('admin') ? 'admin' : 'user',
      wishlist: [],
      joinedAt: new Date().toISOString(),
      bankDetails: {
        bankName: '',
        accountNumber: '',
        ifsc: '',
        accountHolder: formData.name || (formData.email.split('@')[0])
      }
    };
    
    onLogin(mockUser);
    setLoading(false);
    setView('home');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in duration-700">
      <div className="bg-white w-full max-w-md p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-gray-50 relative overflow-hidden">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Get Started'}</h1>
          <p className="text-gray-500 mt-2 font-medium">Elevating your digital ecosystem.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[1.2rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                placeholder="Ex. Alex Morgan"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[1.2rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
              placeholder="admin@uhsinstore.com"
            />
          </div>

          <div>
            <div className="flex justify-between mb-3 ml-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
              {isLogin && <button type="button" className="text-[10px] font-black text-indigo-600 uppercase">Forgot?</button>}
            </div>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[1.2rem] focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-[1.2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
               <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-10 text-center relative z-10">
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? "New to the platform?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-indigo-600 font-black hover:underline"
            >
              {isLogin ? 'Join Now' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-relaxed">
            Developer Notice: Simulated JWT <br />Session Management active.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
