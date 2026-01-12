
import React, { useState } from 'react';
// Corrected import paths
import { Product, Category } from '../../types/index';
import { CATEGORIES } from '../../constants/index';
import { ProductSkeleton } from '../ui/Skeleton';

interface ProductsViewProps {
  products: Product[];
  addToCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  wishlist: string[];
  loading?: boolean;
  onProductClick?: (id: string) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({ products, addToCart, toggleWishlist, wishlist, loading, onProductClick }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  
  const processedProducts = products.filter(p => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catalogue</h1>
          <p className="text-gray-500">Discover everything you need for your tech workspace</p>
        </div>
        <div className="relative group w-full md:w-80">
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <button onClick={() => setFilter('All')} className={`px-6 py-2 rounded-full font-semibold transition-all flex-shrink-0 ${filter === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100'}`}>All</button>
        {CATEGORIES.map(cat => (<button key={cat.name} onClick={() => setFilter(cat.name as Category)} className={`px-6 py-2 rounded-full font-semibold transition-all flex-shrink-0 ${filter === cat.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100'}`}>{cat.name}</button>))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)) : (
          processedProducts.map((product) => (
            <div key={product.id} onClick={() => onProductClick?.(product.id)} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group relative cursor-pointer flex flex-col">
              <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-3 left-3 z-20 p-2 bg-white/80 rounded-full shadow-md"><svg className={`w-4 h-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
              <div className="relative h-48 overflow-hidden"><img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" /></div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{product.category}</span>
                <h3 className="font-bold text-gray-800 line-clamp-1 mt-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-2 mb-4">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-gray-900">${product.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product.id); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-indigo-100">Add to Cart</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsView;
