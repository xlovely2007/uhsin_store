
import React, { useState, useMemo } from 'react';
import { Product, Category, Order, User, AdminSubView, AdminLog } from '../types';
import { CATEGORIES } from '../constants';
import { generateProductDescription } from '../services/geminiService';
import { Spinner } from './Skeleton';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  users: User[];
  logs: AdminLog[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrder: (order: Order) => void;
  onUpdateUser: (user: User) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  products, 
  orders, 
  users, 
  logs,
  onUpdateProduct, 
  onDeleteProduct,
  onUpdateOrder,
  onUpdateUser 
}) => {
  const [activeSubView, setActiveSubView] = useState<AdminSubView>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((acc, o) => acc + o.total, 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    return {
      revenue: totalRevenue.toFixed(2),
      ordersCount: orders.length,
      productsCount: products.length,
      usersCount: users.length,
      lowStock
    };
  }, [orders, products, users]);

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.revenue}`, icon: '💰', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Orders', value: stats.ordersCount, icon: '📦', color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Users', value: stats.usersCount, icon: '👥', color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Products', value: stats.productsCount, icon: '⚡', color: 'bg-orange-50 text-orange-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-xl`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-6">Recent Activity Logs</h3>
          <div className="space-y-3">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-500' :
                  log.type === 'error' ? 'bg-red-500' :
                  log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{log.action}: <span className="font-medium text-gray-500">{log.target}</span></p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setActiveSubView('logs')} className="w-full py-2 text-xs font-bold text-indigo-600 hover:underline">View All Logs</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-6">Low Stock Alerts</h3>
          <div className="space-y-4">
            {products.filter(p => p.stock < 10).slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-8 h-8 rounded-lg object-cover" />
                  <p className="text-sm font-bold text-gray-800">{p.name}</p>
                </div>
                <span className="text-xs font-black text-red-600">{p.stock} left</span>
              </div>
            ))}
            {stats.lowStock === 0 && <p className="text-sm text-gray-400 italic text-center py-4">All items well stocked.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">Catalogue Management</h2>
        <button 
          onClick={() => setEditingProduct({ name: '', price: 0, stock: 0, category: 'Power', image: 'https://picsum.photos/400/400' })}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          <span>➕</span> Quick Add Item
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900 text-sm">${p.price}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl">✏️</button>
                      <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black mb-8">{editingProduct.id ? 'Edit Catalogue Item' : 'Add New Catalogue Item'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Item Name</label>
                  <input 
                    type="text" 
                    value={editingProduct.name} 
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Price</label>
                    <input 
                      type="number" 
                      value={editingProduct.price} 
                      onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Inventory</label>
                    <input 
                      type="number" 
                      value={editingProduct.stock} 
                      onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                  <select 
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catalogue Description</label>
                    <button 
                      onClick={async () => {
                        setIsGenerating(true);
                        const desc = await generateProductDescription(editingProduct.name || '', editingProduct.category || '');
                        setEditingProduct({...editingProduct, description: desc});
                        setIsGenerating(false);
                      }}
                      className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-black uppercase hover:bg-indigo-100"
                    >
                      {isGenerating ? 'AI Writing...' : '✨ Generate with AI'}
                    </button>
                  </div>
                  <textarea 
                    value={editingProduct.description} 
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={4}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => {
                      const finalProduct = {
                        ...editingProduct,
                        id: editingProduct.id || Math.random().toString(36).substr(2, 9),
                        rating: editingProduct.rating || 5
                      } as Product;
                      onUpdateProduct(finalProduct);
                      setEditingProduct(null);
                    }}
                    className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-black shadow-xl"
                  >
                    Publish
                  </button>
                  <button onClick={() => setEditingProduct(null)} className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-gray-900">System Activity Logs</h2>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  log.type === 'success' ? 'bg-green-100 text-green-700' :
                  log.type === 'error' ? 'bg-red-100 text-red-700' :
                  log.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {log.type}
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500">Admin: <span className="font-bold">{log.adminName}</span> | Target: <span className="font-bold">{log.target}</span></p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-center py-10 text-gray-400 italic">No activity logs recorded yet.</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[70vh]">
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-2 sticky top-24">
          <div className="px-6 py-4 mb-4 border-b border-gray-50 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Administrative Role</p>
            <p className="font-black text-indigo-600 text-lg">Command Center</p>
          </div>
          {[
            { id: 'dashboard', label: 'Overview', icon: '📊' },
            { id: 'products', label: 'Catalogue', icon: '📦' },
            { id: 'orders', label: 'Operations', icon: '📝' },
            { id: 'users', label: 'Permissions', icon: '👥' },
            { id: 'logs', label: 'Activity Logs', icon: '📜' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id as AdminSubView)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                activeSubView === item.id 
                  ? 'bg-gray-900 text-white shadow-xl' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1">
        {activeSubView === 'dashboard' && renderDashboard()}
        {activeSubView === 'products' && renderProducts()}
        {activeSubView === 'logs' && renderLogs()}
        {activeSubView === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-black text-gray-900">Order Operations</h2>
             {/* Reuse existing logic but with updated style if needed */}
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr><th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th><th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th><th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">{o.id}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select value={o.status} onChange={(e) => onUpdateOrder({ ...o, status: e.target.value as any })} className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold">
                            <option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
        {activeSubView === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-900">User Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map(u => (
                <div key={u.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-12 h-12 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-400 truncate mb-2">{u.email}</p>
                    <button onClick={() => onUpdateUser({...u, role: u.role === 'admin' ? 'user' : 'admin'})} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {u.role}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminView;
