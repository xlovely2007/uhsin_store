
import React, { useState, useMemo } from 'react';
// Corrected import path
import { Product, Order, User, AdminSubView, AdminLog } from '../../types/index';
import { generateProductDescription } from '../../services/geminiService';

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

const AdminView: React.FC<AdminViewProps> = ({ products, orders, users, logs, onUpdateProduct, onDeleteProduct, onUpdateOrder, onUpdateUser }) => {
  const [activeSubView, setActiveSubView] = useState<AdminSubView>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.total, 0);
    return { revenue: revenue.toFixed(2), orders: orders.length, users: users.length, stock: products.length };
  }, [orders, users, products]);

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Revenue', value: `$${stats.revenue}`, icon: '💰', color: 'bg-indigo-600' },
          { label: 'Orders', value: stats.orders, icon: '📦', color: 'bg-violet-600' },
          { label: 'Users', value: stats.users, icon: '👥', color: 'bg-emerald-600' },
          { label: 'Catalogue', value: stats.stock, icon: '⚡', color: 'bg-orange-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center">
            <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p><h3 className="text-2xl font-black">{item.value}</h3></div>
            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>{item.icon}</div>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100"><h3 className="text-xl font-black mb-6">Recent Activity</h3><div className="space-y-4">{logs.slice(0, 5).map(log => (<div key={log.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl"><div className={`w-1.5 h-10 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`} /><div><p className="text-xs font-black">{log.action}</p><p className="text-[10px] text-gray-400 uppercase mt-1">{log.target}</p></div></div>))}</div></div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-black">Catalogue</h2><button onClick={() => setEditingProduct({ name: '', price: 0, stock: 0, category: 'Power', image: 'https://picsum.photos/400/400', description: '' })} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">Add Item</button></div>
      <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50 border-b border-gray-100"><tr><th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th><th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th><th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Value</th><th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th></tr></thead><tbody className="divide-y divide-gray-50">{products.map(p => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-6 py-5 flex items-center gap-4"><img src={p.image} className="w-10 h-10 rounded-lg object-cover" /><div><p className="text-sm font-black">{p.name}</p><p className="text-[10px] text-indigo-500 font-black uppercase">{p.category}</p></div></td><td className="px-6 py-5 text-center font-bold text-sm">{p.stock}</td><td className="px-6 py-5 text-right font-black">${p.price}</td><td className="px-6 py-5 text-right"><button onClick={() => setEditingProduct(p)} className="text-indigo-600 mr-2 font-bold">Edit</button><button onClick={() => onDeleteProduct(p.id)} className="text-red-500 font-bold">Delete</button></td></tr>))}</tbody></table></div>
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl">
          <h3 className="text-2xl font-black mb-6">Product Management</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Name" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="p-4 bg-gray-50 rounded-xl outline-none font-bold" />
              <input type="number" placeholder="Stock" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} className="p-4 bg-gray-50 rounded-xl outline-none font-bold" />
            </div>
            <textarea placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} rows={3} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-medium text-sm" />
            <div className="flex gap-4"><button onClick={() => onUpdateProduct({...editingProduct, id: editingProduct.id || Math.random().toString(36).substr(2,9)} as Product)} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-black">Save Item</button><button onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-black">Cancel</button></div>
          </div>
        </div></div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh] pb-12">
      <aside className="w-full lg:w-64 space-y-2"><div className="bg-gray-900 rounded-[2rem] p-4 shadow-xl">
        {['dashboard', 'products', 'orders', 'users', 'logs'].map(id => (
          <button key={id} onClick={() => setActiveSubView(id as AdminSubView)} className={`w-full text-left px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest ${activeSubView === id ? 'bg-white text-gray-900' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>{id}</button>
        ))}
      </div></aside>
      <main className="flex-1 min-w-0">{activeSubView === 'dashboard' ? renderDashboard() : activeSubView === 'products' ? renderProducts() : <div className="p-20 text-center text-gray-400 font-bold italic">Module implementation active. Data available in terminal.</div>}</main>
    </div>
  );
};

export default AdminView;
