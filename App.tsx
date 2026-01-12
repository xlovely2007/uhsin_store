
import React, { useState } from 'react';
// Corrected import path to point to the types directory index
import { View } from './types/index';
import { useStore } from './hooks/useStore';
import Layout from './components/layout/Layout';
import HomeView from './components/views/HomeView';
import ProductsView from './components/views/ProductsView';
import OrdersView from './components/views/OrdersView';
import ProfileView from './components/views/ProfileView';
import AdminView from './components/views/AdminView';
import AuthView from './components/views/AuthView';
import ProductDetailView from './components/views/ProductDetailView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const store = useStore();

  const handleLogout = () => {
    store.setUser(null);
    localStorage.removeItem('uhsin_jwt');
    localStorage.removeItem('uhsin_user');
    setCurrentView('home');
    store.setCart([]);
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!store.isInitialized && store.isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Uhsin Store</h2>
        <p className="text-gray-400 text-sm mt-2 animate-pulse">Initializing Premium Experience...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setView={setCurrentView} products={store.products} addToCart={store.addToCart} toggleWishlist={store.toggleWishlist} wishlist={store.user?.wishlist || []} loading={store.isLoading} onProductClick={openProductDetail} />;
      case 'products':
        return <ProductsView products={store.products} addToCart={store.addToCart} toggleWishlist={store.toggleWishlist} wishlist={store.user?.wishlist || []} loading={store.isLoading} onProductClick={openProductDetail} />;
      case 'product-detail':
        const product = store.products.find(p => p.id === selectedProductId);
        return product ? (
          <ProductDetailView product={product} products={store.products} addToCart={store.addToCart} toggleWishlist={store.toggleWishlist} isWishlisted={store.user?.wishlist.includes(product.id) || false} onRate={store.handleRateProduct} onAddReview={store.handleAddReview} setView={setCurrentView} onProductClick={openProductDetail} currentUser={store.user} />
        ) : <HomeView setView={setCurrentView} products={store.products} addToCart={store.addToCart} toggleWishlist={store.toggleWishlist} wishlist={store.user?.wishlist || []} onProductClick={openProductDetail} />;
      case 'orders':
        return <OrdersView user={store.user} orders={store.orders.filter(o => o.userId === store.user?.id)} products={store.products} handleCheckout={async (m, a) => { await store.handleCheckout(m, a); setCurrentView('orders'); }} handleCancelOrder={(id) => { store.setOrders(prev => prev.map(o => o.id === id ? {...o, status: 'Cancelled'} : o)); store.createLog('Cancelled Order', id, 'warning'); }} setView={setCurrentView} cart={store.cart} removeFromCart={store.removeFromCart} loading={store.isLoading} />;
      case 'profile':
        return store.user ? (
          <ProfileView user={store.user} setUser={store.setUser} orders={store.orders.filter(o => o.userId === store.user.id)} products={store.products} addToCart={store.addToCart} toggleWishlist={store.toggleWishlist} onLogout={handleLogout} />
        ) : <AuthView onLogin={store.setUser} setView={setCurrentView} />;
      case 'admin':
        return store.user?.role === 'admin' ? (
          <AdminView products={store.products} orders={store.orders} users={store.users} logs={store.adminLogs} onUpdateProduct={store.handleUpdateProduct} onDeleteProduct={store.handleDeleteProduct} onUpdateOrder={(updated) => store.setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))} onUpdateUser={(updated) => store.setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))} />
        ) : <div className="text-center py-20"><h2 className="text-4xl font-black text-red-500 mb-4">Unauthorized</h2><button onClick={() => setCurrentView('home')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl">Home</button></div>;
      case 'auth':
        return <AuthView onLogin={store.setUser} setView={setCurrentView} />;
      default:
        return <HomeView setView={setCurrentView} products={store.products} addToCart={store.addToCart} toggleWishlist={store.toggleWishlist} wishlist={store.user?.wishlist || []} onProductClick={openProductDetail} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} cartCount={store.cart.length} user={store.user} onLogout={handleLogout}>
      {renderView()}
    </Layout>
  );
};

export default App;
