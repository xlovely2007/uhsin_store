
import React, { useState } from 'react';
// Corrected import path
import { User, View } from '../../types/index';

interface AuthViewProps {
  onLogin: (user: User) => void;
  setView: (view: View) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, setView }) => {
  const [email, setEmail] = useState('admin@uhsinstore.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
      wishlist: [],
      joinedAt: new Date().toISOString()
    };
    onLogin(mockUser);
    setView('home');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in duration-700">
      <div className="bg-white w-full max-w-md p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-50 text-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h1 className="text-4xl font-black mb-10">Welcome</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-5 bg-gray-50 border rounded-[1.2rem] outline-none font-bold" placeholder="Email" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.2rem] font-black text-xl shadow-xl active:scale-95 transition-all">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
