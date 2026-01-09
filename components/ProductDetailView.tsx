
import React, { useState, useRef, useEffect } from 'react';
import { Product, View, User, Review } from '../types';

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

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ 
  product, 
  products, 
  addToCart, 
  toggleWishlist, 
  isWishlisted, 
  onRate, 
  onAddReview,
  setView,
  onProductClick,
  currentUser
}) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [showShareFeedback, setShowShareFeedback] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Review form state
  const [reviewName, setReviewName] = useState(currentUser?.name || '');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);

  // Zoom state
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRateSubmit = (rating: number) => {
    setUserRating(rating);
    onRate(product.id, rating);
    setHasRated(true);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || reviewRating === 0) {
      alert('Please fill out all fields and provide a rating.');
      return;
    }
    onAddReview(product.id, {
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewComment('');
    setReviewRating(0);
    if (!currentUser) setReviewName('');
    alert('Thank you! Your review has been added.');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;

    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    
    setZoomPos({ x, y });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareFeedback(true);
      setShowShareMenu(false);
      setTimeout(() => setShowShareFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} on Uhsin Store!`);
    
    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: `Check out ${product.name} on Uhsin Store!`,
      text: product.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShowShareMenu(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Filter related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 relative pb-20">
      {/* Share Toast Notification */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${showShareFeedback ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold text-sm">Link copied to clipboard!</span>
        </div>
      </div>

      <button 
        onClick={() => setView('products')}
        className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Visuals */}
        <div className="space-y-4">
          <div 
            ref={imgContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsZoomed(true)}
            onTouchEnd={() => setIsZoomed(false)}
            onTouchMove={handleMouseMove}
            className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-sm relative cursor-crosshair group touch-none"
          >
            <img 
              src={product.image} 
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
              }}
              className="w-full h-full object-cover transition-transform duration-200 ease-out" 
              alt={product.name} 
            />
            
            {/* Wishlist Button Overlay */}
            <button 
              onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
              className={`absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all z-10 ${isZoomed ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
            >
              <svg 
                className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Zoom Hint Icon */}
            <div className={`absolute bottom-6 left-6 p-2 bg-black/20 backdrop-blur-md rounded-lg transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors">
                <img src={`https://picsum.photos/seed/${product.id + i}/200/200`} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block">
                {product.category}
              </span>
              
              {/* Share Menu */}
              <div className="relative" ref={shareMenuRef}>
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                  title="Share this product"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6L15.316 6.316m0 0a3 3 0 115.368 2.684 3 3 0 01-5.368-2.684zm0 9.474a3 3 0 115.368 2.684 3 3 0 01-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => handleSocialShare('twitter')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Share on X
                      </button>
                      <button 
                        onClick={() => handleSocialShare('facebook')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      <button 
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy Link
                      </button>
                      <button 
                        onClick={handleNativeShare}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6L15.316 6.316m0 0a3 3 0 115.368 2.684 3 3 0 01-5.368-2.684zm0 9.474a3 3 0 115.368 2.684 3 3 0 01-5.368-2.684z" />
                        </svg>
                        More Options
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-black text-gray-900">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400 font-medium">({product.ratingCount || 0} reviews)</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-gray-500 text-lg leading-relaxed">
              {product.description} Built for professionals and tech enthusiasts, this {product.category.toLowerCase()} solution combines cutting-edge performance with premium aesthetics.
            </p>
          </div>

          <div className="mb-10 space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-indigo-600">${product.price}</span>
              <span className="text-gray-400 line-through font-medium text-xl">${(product.price * 1.2).toFixed(2)}</span>
            </div>
            <div className={`text-sm font-bold flex items-center gap-2 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-600' : product.stock > 0 ? 'bg-amber-600' : 'bg-red-600'}`}></span>
              {product.stock > 0 ? `${product.stock} units available in stock` : 'Out of stock'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button 
              onClick={() => addToCart(product.id)}
              disabled={product.stock === 0}
              className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </button>
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`w-full py-5 rounded-[1.5rem] font-bold text-lg border-2 transition-all flex items-center justify-center gap-3 ${isWishlisted ? 'border-red-100 bg-red-50 text-red-600' : 'border-gray-200 text-gray-700 hover:border-indigo-600 hover:text-indigo-600'}`}
            >
              <svg className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Quick Rating Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-4">Rate this product</h3>
            {hasRated ? (
              <div className="flex items-center gap-4 text-green-600 font-bold">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                Thanks for your feedback! You rated this {userRating} stars.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRateSubmit(star)}
                      className="transition-all transform hover:scale-125"
                    >
                      <svg 
                        className={`w-10 h-10 ${star <= (hoverRating || userRating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">Click a star to submit your rating instantly.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
        <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-500 uppercase tracking-widest">Connectivity</div>
            <p className="font-bold text-gray-800">Advanced Wireless Protocol 2.1 with backwards compatibility for legacy devices.</p>
          </div>
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-500 uppercase tracking-widest">Efficiency</div>
            <p className="font-bold text-gray-800">GaN II Technology ensures 98% power conversion efficiency with minimal thermal output.</p>
          </div>
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-500 uppercase tracking-widest">Materials</div>
            <p className="font-bold text-gray-800">Recycled aerospace-grade aluminum and bio-based polymers for a sustainable lifecycle.</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-3xl font-black text-gray-900">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-400">{product.reviews?.length || 0} Comments</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Write a Review */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
              <h4 className="text-xl font-black mb-6">Write a Review</h4>
              <form onSubmit={handleAddReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    readOnly={!!currentUser}
                    placeholder="Enter your name"
                    className={`w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm ${currentUser ? 'opacity-60 cursor-not-allowed' : ''}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button"
                        onClick={() => setReviewRating(s)}
                        onMouseEnter={() => setReviewHover(s)}
                        onMouseLeave={() => setReviewHover(0)}
                        className="transition-transform active:scale-90"
                      >
                        <svg className={`w-8 h-8 ${s <= (reviewHover || reviewRating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Comment</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                <div className="text-4xl mb-4 text-gray-300">💬</div>
                <h5 className="text-lg font-black text-gray-400 mb-1">No reviews yet</h5>
                <p className="text-sm text-gray-400">Be the first to share your experience with the community.</p>
              </div>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-base">{rev.userName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(rev.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed">{rev.comment}</p>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      Helpful
                    </button>
                    <button className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                      Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-gray-900">Related Products</h3>
            <button 
              onClick={() => setView('products')}
              className="text-indigo-600 font-bold text-sm hover:underline"
            >
              Explore More
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar px-2 snap-x">
            {relatedProducts.map(relProduct => (
              <div 
                key={relProduct.id} 
                onClick={() => onProductClick(relProduct.id)}
                className="flex-shrink-0 w-64 bg-white rounded-3xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/20 transition-all group cursor-pointer snap-start"
              >
                <div className="relative h-48 overflow-hidden rounded-t-[1.5rem]">
                  <img 
                    src={relProduct.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="" 
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-bold text-gray-700">{relProduct.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-gray-800 truncate mb-1">{relProduct.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-indigo-600">${relProduct.price}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{relProduct.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailView;
