
import React, { useState } from 'react';
import { Product, View } from '../types';
import { CATEGORIES, SPECIAL_OFFERS } from '../constants';
import { ProductSkeleton } from './Skeleton';

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
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-900 text-white p-8 md:p-16">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
            Level up your <br />
            <span className="text-indigo-400">Digital Lifestyle.</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-lg">
            Discover a curated collection of premium electronic accessories designed to enhance your performance and protect your gear.
          </p>
          <button 
            onClick={() => setView('products')}
            className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-black/20"
          >
            Shop Collection
          </button>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,73.1,41.4C64.8,53.8,53.8,64,41.1,71.4C28.4,78.8,14.2,83.4,-0.4,84C-15,84.7,-29.9,81.3,-43.3,74.5C-56.7,67.7,-68.5,57.5,-76.5,44.7C-84.5,31.9,-88.7,16,-88.3,0.2C-87.9,-15.5,-83,-31.1,-74.2,-44.1C-65.4,-57.1,-52.7,-67.5,-39.1,-75C-25.5,-82.5,-12.7,-87.1,1.1,-89C14.9,-90.9,29.8,-90.1,43.7,-83.4L44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Special Offers Slider */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="text-indigo-600">✨</span> Limited Time Offers
          </h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-2 snap-x">
          {SPECIAL_OFFERS.map((offer) => (
            <div 
              key={offer.id}
              className={`flex-shrink-0 w-[300px] md:w-[400px] bg-gradient-to-br ${offer.bgGradient} p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100/20 snap-start relative overflow-hidden group`}
            >
              {/* Decorative elements */}
              <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                    Special Promotion
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black mb-1">{offer.title}</h3>
                  <p className="text-white/80 font-medium mb-6">{offer.subtitle}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl font-black block">{offer.discount}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-white/60 uppercase">Code:</span>
                      <span className="text-sm font-mono font-black tracking-wider bg-black/20 px-2 py-1 rounded border border-white/20">
                        {offer.code}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => copyCode(offer.code)}
                    className={`p-4 rounded-2xl transition-all ${copiedCode === offer.code ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:scale-105 active:scale-95'}`}
                  >
                    {copiedCode === offer.code ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 012 2h8a2 2 0 012-2v-2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Quick Categories</h2>
          <button onClick={() => setView('products')} className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setView('products')}
              className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold text-gray-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-8">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </>
          ) : (
            featuredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div 
                  key={product.id} 
                  onClick={() => onProductClick?.(product.id)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative cursor-pointer border border-gray-100/50"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className="absolute top-4 left-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <svg 
                      className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-400 ml-1">{product.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-indigo-600">${product.price}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
