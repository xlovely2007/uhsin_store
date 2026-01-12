
import React, { useState } from 'react';
// Corrected import path
import { User, Order, Product } from '../../types/index';

interface ProfileViewProps {
  user: User;
  setUser: (user: User) => void;
  orders: Order[];
  products: Product[];
  onLogout: () => void;
  addToCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, orders, products, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    setUser({ ...user, name });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 border border-gray-100">
        <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} className="w-32 h-32 rounded-full border-4 border-indigo-50" alt="" />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mb-6">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <button onClick={() => setIsEditing(!isEditing)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">Edit</button>
            <button onClick={onLogout} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm">Log Out</button>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold" />
          <button onClick={handleSave} className="mt-4 w-full py-4 bg-gray-900 text-white rounded-xl font-black">Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
