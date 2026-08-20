import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "644147848430-pv2j9s9v77b8fnh0b21rglpfsqj4snru.apps.googleusercontent.com";
const API_URL = "http://localhost:5000";

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]); // Untuk Admin mengelola User
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Form State Tambah Produk (Khusus Seller)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProducts();
    if (user) {
      if (user.role === 'buyer') fetchCart();
      if (user.role === 'admin') fetchUsers();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      if (res.ok) setUsersList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/cart?user_id=${user.id}`);
      if (res.ok) setCart(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSuccess = async (cred) => {
    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: cred.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (err) {
      alert("Login Gagal");
    }
  };

  // Admin Ubah Role User (Buyer -> Seller / Admin)
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${API_URL}/admin/change-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });
      if (res.ok) {
        alert("Role user berhasil diperbarui!");
        fetchUsers();
      }
    } catch (err) {
      alert("Gagal mengubah role");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'seller') return alert("Hanya Seller yang boleh menambah barang!");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('user_id', user.id);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert("Produk Berhasil Dijual!");
        setName('');
        setPrice('');
        setImage(null);
        e.target.reset();
        fetchProducts();
      }
    } catch (err) {
      alert("Gagal menambahkan produk");
    }
  };

  const addToCart = async (productId) => {
    if (!user) return alert("Silakan login terlebih dahulu!");
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: productId }),
      });
      if (res.ok) {
        fetchCart();
        setIsCartOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.subtotal, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-extrabold text-2xl text-blue-600">
            <span>🛍️</span>
            <span>Storefront</span>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'buyer' && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition"
              >
                <span>🛒 Keranjang</span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">
                  👋 {user.username} 
                  <span className="ml-2 text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {user.role}
                  </span>
                </span>
                <button 
                  onClick={() => { localStorage.clear(); setUser(null); }}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <GoogleLogin onSuccess={handleGoogleSuccess} shape="pill" size="medium" />
            )}
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* PANEL ADMIN: KELOLA USER & ROLE */}
        {user?.role === 'admin' && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4">👑 Dashboard Admin - Kelola User</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                  <tr>
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role Saat Ini</th>
                    <th className="p-3">Aksi Ubah Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3 font-medium">{u.username}</td>
                      <td className="p-3 text-slate-500">{u.email}</td>
                      <td className="p-3 font-bold uppercase">{u.role}</td>
                      <td className="p-3 space-x-2">
                        <button onClick={() => handleChangeRole(u.id, 'seller')} className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-semibold">Jadikan Seller</button>
                        <button onClick={() => handleChangeRole(u.id, 'buyer')} className="bg-slate-500 text-white px-3 py-1 rounded text-xs font-semibold">Jadikan Buyer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* PANEL SELLER: TAMBAH PRODUK JUALAN */}
        {user?.role === 'seller' && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4">🏪 Dashboard Seller - Tambah Produk Jualan</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Produk</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2.5 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Harga (Rp)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2.5 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Stok Awal</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} required className="w-full p-2.5 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Foto Produk</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="w-full text-xs text-slate-500" />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm">
                Publish Produk
              </button>
            </form>
          </section>
        )}

        {/* KATALOG PRODUK (Dapat dilihat semua orang) */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">🔥 Katalog Produk Terpopuler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="w-full h-44 bg-slate-100">
                    <img src={p.image_url || 'https://via.placeholder.com/300'} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 text-base mb-2">{p.name}</h4>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-extrabold text-emerald-600 text-lg">Rp {Number(p.price).toLocaleString('id-ID')}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Stok: {p.stock}</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Keranjang Hanya Muncul untuk Buyer */}
                {(!user || user.role === 'buyer') && (
                  <div className="p-4 pt-0">
                    <button 
                      onClick={() => addToCart(p.id)}
                      disabled={p.stock < 1}
                      className={`w-full py-2.5 rounded-lg font-bold ${p.stock < 1 ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {p.stock < 1 ? 'Stok Habis' : '+ Keranjang'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
}