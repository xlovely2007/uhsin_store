
import React, { useState } from 'react';
import { User, Order, Product, Address } from '../types';

interface ProfileViewProps {
  user: User;
  setUser: (user: User) => void;
  orders: Order[];
  products: Product[];
  onLogout: () => void;
  addToCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser, orders, products, onLogout, addToCart, toggleWishlist }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bankName: user.bankDetails?.bankName || '',
    accountNumber: user.bankDetails?.accountNumber || '',
    ifsc: user.bankDetails?.ifsc || '',
    accountHolder: user.bankDetails?.accountHolder || '',
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zip: user.address?.zip || '',
    country: user.address?.country || 'India'
  });

  const handleSave = () => {
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country
      },
      bankDetails: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        accountHolder: formData.accountHolder
      }
    });
    setIsEditing(false);
  };

  const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8 border border-gray-100">
        <div className="relative">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
            alt={user.name} 
            className="w-32 h-32 rounded-full border-4 border-indigo-50 object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button onClick={onLogout} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm">Log Out</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Shipping Address
          </h2>
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <input type="text" placeholder="Street" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none" />
                <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none" />
                  <input type="text" placeholder="ZIP" value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} className="w-full p-3 border rounded-xl text-sm outline-none" />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-50">
                {user.address?.street ? (
                  <div className="space-y-1">
                    <p className="font-bold text-gray-800">{user.address.street}</p>
                    <p className="text-sm text-gray-500">{user.address.city}, {user.address.state} {user.address.zip}</p>
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No default shipping address set.</p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
            Wallet & Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
              {isEditing ? (
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              ) : (
                <p className="font-semibold text-gray-800">{user.name}</p>
              )}
            </div>
            {isEditing && (
              <button onClick={handleSave} className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold">Save Changes</button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileView;
