
import React, { useState } from 'react';
// Corrected import paths
import { Product, View } from '../../types/index';
import { CATEGORIES, SPECIAL_OFFERS } from '../../constants/index';
import { ProductSkeleton } from '../ui/Skeleton';

interface HomeViewProps {
  setView: (view: View) => void;
  products: Product[];
  addToCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  wishlist: string[];
  loading?: boolean;
  onProductClick?: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setView, products, addToCart, toggleWishlist, wishlist, loading, onProductClick }) => {
  const featuredProducts = products.slice(0, 4);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white p-8 md:p-16">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Level up your <br /><span className="text-indigo-400">Digital Lifestyle.</span></h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-lg">Discover a curated collection of premium electronic accessories designed to enhance your performance and protect your gear.</p>
          <button onClick={() => setView('products')} className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 shadow-lg">Shop Collection</button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><span className="text-indigo-600">✨</span> Limited Time Offers</h2>
        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-2 snap-x">
          {SPECIAL_OFFERS.map((offer) => (
            <div key={offer.id} className={`flex-shrink-0 w-[300px] md:w-[400px] bg-gradient-to-br ${offer.bgGradient} p-8 rounded-[2rem] text-white shadow-xl snap-start relative overflow-hidden group`}>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Special Promotion</span>
                  <h3 className="text-2xl md:text-3xl font-black mb-1">{offer.title}</h3>
                  <p className="text-white/80 font-medium mb-6">{offer.subtitle}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-black block">{offer.discount}</span>
                    <span className="text-sm font-mono font-black tracking-wider bg-black/20 px-2 py-1 rounded border border-white/20 mt-2 inline-block">{offer.code}</span>
                  </div>
                  <button onClick={() => copyCode(offer.code)} className={`p-4 rounded-2xl transition-all ${copiedCode === offer.code ? 'bg-green-500 text-white' : 'bg-white text-gray-900'}`}>
                    {copiedCode === offer.code ? (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>) : (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 012 2h8a2 2 0 012-2v-2" /></svg>)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <button onClick={() => setView('products')} className="text-indigo-600 font-bold text-sm">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (Array.from({length: 4}).map((_, i) => <ProductSkeleton key={i} />)) : (
            featuredProducts.map((product) => (
              <div key={product.id} onClick={() => onProductClick?.(product.id)} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative cursor-pointer border border-gray-100">
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-4 left-4 z-20 p-2 bg-white/80 rounded-full shadow-md"><svg className={`w-5 h-5 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
                <div className="relative h-64 overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-black text-indigo-600">${product.price}</span>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product.id); }} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
