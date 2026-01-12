
import React, { useState } from 'react';
// Corrected import paths
import { Order, Product, Address, User, View } from '../../types/index';
import { Spinner } from '../ui/Skeleton';
import { PROMO_CODES } from '../../constants/index';

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
  const [addressForm, setAddressForm] = useState<Address>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'India'
  });

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId)!;
    return { ...item, ...product };
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isAddressValid = addressForm.street && addressForm.city && addressForm.state && addressForm.zip;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><div className="bg-indigo-50 p-2 rounded-xl"><svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>Active Cart</h2>
          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-200">
              <p className="font-bold text-gray-400">Your cart is empty.</p>
              <button onClick={() => setView('products')} className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Shop Now</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-50 group">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm font-medium text-gray-400">${item.price} x {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-gray-100 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Delivery Destination</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Street" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                      <input type="text" placeholder="ZIP" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 px-6 bg-gray-50 rounded-2xl">
                  <span className="font-black text-gray-900 text-lg">Total</span>
                  <span className="font-black text-indigo-600 text-2xl">${subtotal.toFixed(2)}</span>
                </div>
                <button onClick={() => handleCheckout('COD', addressForm)} disabled={loading || !isAddressValid} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                  {loading ? <Spinner /> : 'Complete Purchase'}
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3"><div className="bg-gray-50 p-2 rounded-xl"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>Order History</h2>
          <div className="space-y-6">
            {orders.length === 0 ? (<p className="text-center py-10 text-gray-400 font-medium italic">No orders yet.</p>) : (
              orders.map(o => (
                <div key={o.id} className="p-6 bg-gray-50 rounded-2xl flex justify-between items-start">
                  <div>
                    <p className="font-black text-gray-900 tracking-tight">{o.id}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(o.date).toLocaleDateString()}</p>
                    <p className="text-xs font-bold text-indigo-600 mt-2">{o.status}</p>
                  </div>
                  <p className="font-black text-gray-900">${o.total.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-fit">
        <h3 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Shopping Support</h3>
        <p className="text-xs text-gray-500 leading-relaxed">Free delivery on orders over $200. Secure processing via local encryption.</p>
      </div>
    </div>
  );
};

export default OrdersView;
