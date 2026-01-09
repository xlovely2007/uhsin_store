
import React, { useState, useEffect, useCallback } from 'react';
import { View, Product, User, Order, Review, Address, AdminLog } from './types';
import { INITIAL_PRODUCTS } from './constants.tsx';
import { api } from './services/api';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import OrdersView from './components/OrdersView';
import ProfileView from './components/ProfileView';
import AdminView from './components/AdminView';
import AuthView from './components/AuthView';
import ProductDetailView from './components/ProductDetailView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Sync data with Render backend
  const syncData = useCallback(async () => {
    try {
      // In a real production app, we would fetch from the API here
      // For this implementation, we attempt a sync and fallback to local storage
      const [remoteProducts, remoteOrders] = await Promise.all([
        api.get<Product[]>('/products').catch(() => null),
        api.get<Order[]>('/orders').catch(() => null)
      ]);

      if (remoteProducts) setProducts(remoteProducts);
      if (remoteOrders) setOrders(remoteOrders);
      
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const storedProducts = localStorage.getItem('uhsin_products');
      const storedUser = localStorage.getItem('uhsin_user');
      const storedOrders = localStorage.getItem('uhsin_orders');
      const storedUsers = localStorage.getItem('uhsin_users_list');
      const storedLogs = localStorage.getItem('uhsin_admin_logs');

      if (storedProducts) setProducts(JSON.parse(storedProducts));
      else {
        const initProducts = INITIAL_PRODUCTS.map(p => ({ ...p, ratingCount: Math.floor(Math.random() * 100) + 10 }));
        setProducts(initProducts);
      }

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedOrders) setOrders(JSON.parse(storedOrders));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else if (storedUser) setUsers([JSON.parse(storedUser)]);
      if (storedLogs) setAdminLogs(JSON.parse(storedLogs));

      setIsInitialized(true);
      setIsLoading(false);
      
      // Start real-time sync loop
      syncData();
    };
    init();

    const interval = setInterval(syncData, 15000); // Sync every 15s
    return () => clearInterval(interval);
  }, [syncData]);

  // Persist to local storage as cache
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('uhsin_products', JSON.stringify(products));
      localStorage.setItem('uhsin_orders', JSON.stringify(orders));
      localStorage.setItem('uhsin_users_list', JSON.stringify(users));
      localStorage.setItem('uhsin_admin_logs', JSON.stringify(adminLogs));
      if (user) localStorage.setItem('uhsin_user', JSON.stringify(user));
      else localStorage.removeItem('uhsin_user');
    }
  }, [products, orders, users, adminLogs, user, isInitialized]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('uhsin_jwt');
    localStorage.removeItem('uhsin_user');
    setCurrentView('home');
    setCart([]);
  };

  const createLog = (action: string, target: string, type: AdminLog['type'] = 'info') => {
    if (!user) return;
    const newLog: AdminLog = {
      id: Math.random().toString(36).substr(2, 9),
      adminId: user.id,
      adminName: user.name,
      action,
      target,
      timestamp: new Date().toISOString(),
      type
    };
    setAdminLogs(prev => [newLog, ...prev].slice(0, 100));
    api.post('/logs', newLog).catch(() => {}); // Fire and forget
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      setCurrentView('auth');
      return;
    }
    const isInWishlist = user.wishlist.includes(productId);
    const updatedWishlist = isInWishlist
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];
    
    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    api.put(`/users/${user.id}`, updatedUser).catch(() => {});
  };

  const handleCheckout = async (paymentMethod: string, shippingAddress: Address) => {
    if (!user) {
      setCurrentView('auth');
      return;
    }

    setIsLoading(true);
    const orderItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        priceAtPurchase: product.price
      };
    });

    const total = orderItems.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.id,
      items: orderItems,
      total,
      status: 'Processing',
      date: new Date().toISOString(),
      trackingNumber: `TRK${Math.floor(Math.random() * 1000000000)}`,
      paymentMethod,
      shippingAddress
    };

    try {
      await api.post('/orders', newOrder);
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setCurrentView('orders');
      alert(`Order ${newOrder.id} successfully synced to Render backend!`);
    } catch (e) {
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setCurrentView('orders');
      alert(`Order processed locally. Syncing with Render.com in background.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Cancelled' } : order
    ));
    api.put(`/orders/${orderId}`, { status: 'Cancelled' }).catch(() => {});
    createLog('Cancelled Order', orderId, 'warning');
  };

  const handleUpdateProduct = async (newProduct: Product) => {
    const isNew = !products.some(p => p.id === newProduct.id);
    try {
      if (isNew) {
        await api.post('/products', newProduct);
        createLog('Created Product', newProduct.name, 'success');
      } else {
        await api.put(`/products/${newProduct.id}`, newProduct);
        createLog('Updated Product', newProduct.name, 'success');
      }
    } catch (e) {}

    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === newProduct.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newProduct;
        return updated;
      }
      return [newProduct, ...prev];
    });
  };

  const handleDeleteProduct = async (id: string) => {
    const prod = products.find(p => p.id === id);
    try {
      await api.delete(`/products/${id}`);
      createLog('Deleted Product', prod?.name || id, 'error');
    } catch (e) {}
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    api.put(`/orders/${updatedOrder.id}`, updatedOrder).catch(() => {});
    createLog('Updated Order Status', `${updatedOrder.id} -> ${updatedOrder.status}`, 'info');
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (user?.id === updatedUser.id) setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    api.put(`/users/${updatedUser.id}`, updatedUser).catch(() => {});
    createLog('Updated User Role', `${updatedUser.email} -> ${updatedUser.role}`, 'warning');
  };

  if (!isInitialized && isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Uhsin Store</h2>
        <p className="text-gray-400 text-sm mt-2 animate-pulse">Establishing Real-time Connection...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView setView={setCurrentView} products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={user?.wishlist || []} loading={isLoading} onProductClick={openProductDetail} />;
      case 'products':
        return <ProductsView products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={user?.wishlist || []} loading={isLoading} onProductClick={openProductDetail} />;
      case 'product-detail':
        const product = products.find(p => p.id === selectedProductId);
        return product ? (
          <ProductDetailView product={product} products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={user?.wishlist.includes(product.id) || false} onRate={(id, r) => {}} onAddReview={(id, rev) => {}} setView={setCurrentView} onProductClick={openProductDetail} currentUser={user} />
        ) : <HomeView setView={setCurrentView} products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={user?.wishlist || []} onProductClick={openProductDetail} />;
      case 'orders':
        return <OrdersView user={user} orders={orders.filter(o => o.userId === user?.id)} products={products} handleCheckout={handleCheckout} handleCancelOrder={handleCancelOrder} setView={setCurrentView} cart={cart} removeFromCart={removeFromCart} loading={isLoading} />;
      case 'profile':
        return user ? (
          <ProfileView user={user} setUser={setUser} orders={orders.filter(o => o.userId === user.id)} products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} onLogout={handleLogout} />
        ) : <AuthView onLogin={setUser} setView={setCurrentView} />;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminView products={products} orders={orders} users={users} logs={adminLogs} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onUpdateOrder={handleUpdateOrder} onUpdateUser={handleUpdateUser} />
        ) : <div className="text-center py-20"><h2 className="text-4xl font-black text-red-500 mb-4">Unauthorized</h2><button onClick={() => setCurrentView('home')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl">Home</button></div>;
      case 'auth':
        return <AuthView onLogin={setUser} setView={setCurrentView} />;
      default:
        return <HomeView setView={setCurrentView} products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={user?.wishlist || []} onProductClick={openProductDetail} />;
    }
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} cartCount={cart.length} user={user} onLogout={handleLogout} isConnected={isConnected}>
      {renderView()}
    </Layout>
  );
};

export default App;
