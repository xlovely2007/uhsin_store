
import { useState, useEffect, useCallback } from 'react';
// Corrected import paths to point to the correct modules
import { Product, User, Order, AdminLog, Address, Review } from '../types/index';
import { INITIAL_PRODUCTS } from '../constants/index';

export const useStore = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    };
    init();
  }, []);

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

  const createLog = useCallback((action: string, target: string, type: AdminLog['type'] = 'info') => {
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
  }, [user]);

  const addToCart = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    if (!user) return false;
    const isInWishlist = user.wishlist.includes(productId);
    const updatedWishlist = isInWishlist
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];
    setUser({ ...user, wishlist: updatedWishlist });
    return true;
  }, [user]);

  const handleCheckout = async (paymentMethod: string, shippingAddress: Address) => {
    if (!user) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

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

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsLoading(false);
    return newOrder;
  };

  const handleUpdateProduct = useCallback((newProduct: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === newProduct.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newProduct;
        createLog('Updated Product', newProduct.name, 'success');
        return updated;
      }
      createLog('Created Product', newProduct.name, 'success');
      return [newProduct, ...prev];
    });
  }, [createLog]);

  const handleDeleteProduct = useCallback((id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    createLog('Deleted Product', prod?.name || id, 'error');
  }, [products, createLog]);

  const handleRateProduct = useCallback((productId: string, newRating: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const oldCount = p.ratingCount || 0;
        const newCount = oldCount + 1;
        const currentRating = p.rating;
        const updatedRating = Number(((currentRating * oldCount + newRating) / newCount).toFixed(1));
        return { ...p, rating: updatedRating, ratingCount: newCount };
      }
      return p;
    }));
  }, []);

  const handleAddReview = useCallback((productId: string, review: { userName: string; rating: number; comment: string }) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview: Review = {
          id: Math.random().toString(36).substr(2, 9),
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          date: new Date().toISOString()
        };
        const updatedReviews = [newReview, ...(p.reviews || [])];
        const oldCount = p.ratingCount || 0;
        const newCount = oldCount + 1;
        const currentRating = p.rating;
        const updatedRating = Number(((currentRating * oldCount + review.rating) / newCount).toFixed(1));
        return { ...p, reviews: updatedReviews, rating: updatedRating, ratingCount: newCount };
      }
      return p;
    }));
  }, []);

  return {
    user, setUser,
    products, setProducts,
    orders, setOrders,
    users, setUsers,
    adminLogs, setAdminLogs,
    cart, setCart,
    isLoading, setIsLoading,
    isInitialized,
    addToCart, removeFromCart, toggleWishlist,
    handleCheckout, handleUpdateProduct, handleDeleteProduct,
    handleRateProduct, handleAddReview, createLog
  };
};
