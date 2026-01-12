
import React from 'react';
// Corrected import path
import { Product, View, User } from '../../types/index';

interface ProductDetailViewProps {
  product: Product;
  products: Product[];
  addToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onRate: (id: string, rating: number) => void;
  onAddReview: (id: string, review: { userName: string; rating: number; comment: string }) => void;
  setView: (view: View) => void;
  onProductClick: (id: string) => void;
  currentUser: User | null;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, addToCart, toggleWishlist, isWishlisted, setView }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in pb-20">
      <button onClick={() => setView('products')} className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>Catalog</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm relative"><img src={product.image} className="w-full h-full object-cover" alt="" /><button onClick={() => toggleWishlist(product.id)} className="absolute top-6 right-6 p-3 bg-white/90 rounded-full shadow-lg"><svg className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button></div>
        <div className="flex flex-col">
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block w-fit mb-4">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">{product.name}</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">{product.description}</p>
          <div className="flex items-baseline gap-4 mb-10"><span className="text-5xl font-black text-indigo-600">${product.price}</span></div>
          <button onClick={() => addToCart(product.id)} disabled={product.stock === 0} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 shadow-xl disabled:bg-gray-200">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
