
import React, { useState, useMemo, useEffect } from 'react';
import { Order, Product, Address, User, View } from '../types';
import { OrderSkeleton, Spinner } from './Skeleton';
import { PROMO_CODES, SPECIAL_OFFERS } from '../constants';

interface OrdersViewProps {
  user: User | null;
  orders: Order[];
  products: Product[];
  cart: { productId: string; quantity: number }[] | undefined;
  removeFromCart: (productId: string) => void;
  handleCheckout: (method: string, address: Address) => void;
  handleCancelOrder: (orderId: string) => void;
  setView: (view: View) => void;
  loading?: boolean;
}

const OrdersView: React.FC<OrdersViewProps> = ({ user, orders, products, cart = [], removeFromCart, handleCheckout, handleCancelOrder, setView, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  
  // Shipping Address State
  const [addressForm, setAddressForm] = useState<Address>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'India'
  });

  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return { ...item, ...product };
  });

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.value > 1) {
      discountAmount = appliedDiscount.value;
    } else {
      discountAmount = cartSubtotal * appliedDiscount.value;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const applyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedDiscount({ code, value: PROMO_CODES[code] });
      setCouponError(null);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try AUDIO25 or WELCOME15');
      setTimeout(() => setCouponError(null), 3000);
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
  };

  const onCancelClick = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      handleCancelOrder(orderId);
    }
  };

  const isAddressValid = addressForm.street && addressForm.city && addressForm.state && addressForm.zip;

  const handleFinalCheckout = () => {
    if (!isAddressValid) {
      alert('Please complete the delivery destination details.');
      return;
    }
    handleCheckout(paymentMethod, addressForm);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const orderDate = new Date(order.date);
      const matchesStart = !startDate || orderDate >= new Date(startDate);
      const matchesEnd = !endDate || orderDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999));
      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [orders, statusFilter, startDate, endDate]);

  const clearFilters = () => {
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="w-10 h-10" color="text-indigo-600" />
                <span className="text-sm font-bold text-indigo-600">
                  {paymentMethod === 'Paytm' ? 'Connecting to Paytm Gateway...' : 'Securely Processing...'}
                </span>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-xl">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Active Cart
          </h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
              <div className="text-4xl mb-4">🛒</div>
              <p className="font-bold text-gray-400">Your cart is empty.</p>
              <p className="text-xs mt-1 mb-8">Start shopping to add items here!</p>
              <button 
                onClick={() => setView('products')}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Return to Shop
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-50 group hover:border-indigo-100 transition-colors">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm font-medium text-gray-400">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id)} disabled={loading} className="text-red-400 hover:text-red-600 p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-8 border-t border-gray-100 space-y-8">
                {/* Shipping Address Section */}
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Delivery Destination
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        placeholder="Street Address"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="ZIP Code"
                        value={addressForm.zip}
                        onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Apply Special Offer</label>
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-2xl animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-black text-green-800">Coupon "{appliedDiscount.code}" Applied</p>
                          <p className="text-xs text-green-600 font-medium">-{appliedDiscount.value > 1 ? `$${appliedDiscount.value}` : `${appliedDiscount.value * 100}%`} savings</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="text-green-800 font-bold text-xs hover:underline">Remove</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Enter offer code..." className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                        <button onClick={applyCoupon} className="px-6 bg-gray-900 text-white font-bold rounded-2xl">Apply</button>
                      </div>
                      {couponError && <p className="text-xs font-bold text-red-500 pl-1">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-[1.5rem] space-y-3 border border-gray-100">
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-black text-gray-900">Total</span>
                    <span className="text-3xl font-black text-indigo-600">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Payment Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Credit Card', 'PayPal', 'Paytm', 'COD'].map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        disabled={loading}
                        className={`p-3 rounded-xl border-2 font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                          paymentMethod === method ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-400 bg-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleFinalCheckout}
                  disabled={loading || !isAddressValid}
                  className={`w-full py-5 rounded-[1.5rem] font-bold text-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100`}
                >
                  {loading ? <Spinner /> : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.833 1.277 9.473 3.666 13.09a12 12 0 0013.904 0c2.39-3.617 3.666-8.257 3.666-13.09z" /></svg>
                  )}
                  {loading ? 'Processing...' : (paymentMethod === 'COD' ? 'Confirm Order' : `Pay $${cartTotal.toFixed(2)}`)}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-black flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-xl">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              Recent Orders
            </h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${showFilters ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:border-gray-200'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              {showFilters ? 'Hide Filters' : 'Filter History'}
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none">
                    <option value="All">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={clearFilters} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Reset All Filters</button>
              </div>
            </div>
          )}
          
          <div className="space-y-8">
            {loading && orders.length === 0 ? (
               <><OrderSkeleton /><OrderSkeleton /></>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="font-bold text-gray-400">No matching orders found.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-50 pb-8 last:border-0 last:pb-0 group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-gray-900 tracking-tight">{order.id}</h4>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(order.date).toLocaleString()}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-4 text-xs">
                    <p className="font-black text-gray-400 uppercase tracking-widest text-[8px] mb-1">Shipping To</p>
                    <p className="text-gray-600 font-bold">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                  </div>
                  <div className="relative h-2.5 bg-gray-100 rounded-full w-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700" 
                      style={{ width: order.status === 'Processing' ? '25%' : order.status === 'Shipped' ? '50%' : '100%' }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-[0.2em]">Quick Delivery Tips</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">Ensure your address ZIP code is accurate for the fastest processing and real-time tracking updates.</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;
