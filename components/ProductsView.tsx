
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';
import { ProductSkeleton } from './Skeleton';

interface ProductsViewProps {
  products: Product[];
  addToCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  wishlist: string[];
  loading?: boolean;
  onProductClick?: (id: string) => void;
}

type SortOption = 'Featured' | 'Price: Low to High' | 'Price: High to Low' | 'Rating';

const ProductsView: React.FC<ProductsViewProps> = ({ products, addToCart, toggleWishlist, wishlist, loading, onProductClick }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('Featured');
  
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const processedProducts = products
    .filter(p => {
      const matchesFilter = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesMinPrice = minPrice === '' || p.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || p.price <= Number(maxPrice);
      const matchesStock = !inStockOnly || p.stock > 0;
      return matchesFilter && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        case 'Rating':
          return b.rating - a.rating;
        case 'Featured':
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setFilter('All');
    setSearch('');
    setSortBy('Featured');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catalogue</h1>
          <p className="text-gray-500">Discover everything you need for your workspace</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-sm group-hover:border-indigo-200"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border shadow-sm ${showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(minPrice !== '' || maxPrice !== '' || inStockOnly) && (
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-xl shadow-indigo-100/20 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium text-gray-700 cursor-pointer"
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Rating">Highest Rating</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
                <span className="text-gray-300">—</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex items-center h-12">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-bold text-gray-700">In Stock Only</span>
              </label>
            </div>

            <div>
              <button 
                onClick={clearFilters}
                className="w-full py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <button 
          onClick={() => setFilter('All')}
          className={`px-6 py-2 rounded-full font-semibold transition-all flex-shrink-0 ${filter === 'All' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.name}
            onClick={() => setFilter(cat.name as Category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all flex-shrink-0 ${filter === cat.name ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          processedProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div 
                key={product.id} 
                onClick={() => onProductClick?.(product.id)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col group relative cursor-pointer"
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                  className="absolute top-3 left-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <svg 
                    className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{product.category}</span>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{product.rating}</span>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-gray-900">${product.price}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
                      disabled={product.stock === 0}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
                    >
                      {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {processedProducts.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters, sorting, or search term.</p>
          <button 
            onClick={clearFilters}
            className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
