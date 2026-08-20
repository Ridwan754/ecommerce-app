import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // State Form Tambah Produk (Seller)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);

  // State Admin (List User)
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Ambil data user dari localStorage jika sudah pernah login
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        fetchUsers();
      }
    }
    fetchProducts();
  }, []);

  // Fetch Daftar Produk
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Gagal mengambil produk:', err);
    }
  };

  // Fetch Daftar User (Khusus Admin)
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUserList(data);
      }
    } catch (err) {
      console.error('Gagal mengambil daftar user:', err);
    }
  };

  // Fetch Keranjang
  const fetchCart = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/cart?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const totalItems = data.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (err) {
      console.error('Gagal mengambil keranjang:', err);
    }
  };

  // Handler Login Google
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:5000/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        fetchCart(data.id);
        if (data.role === 'admin') fetchUsers();
      } else {
        alert('Login gagal: ' + data.message);
      }
    } catch (err) {
      alert('Gagal menghubungi server!');
    }
  };

  // Handler Logout
  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('user');
  };

  // Handler Tambah Produk (Seller)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return alert('Lengkapi semua field!');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('user_id', user.id);
    if (image) formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/products', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        alert('Produk berhasil ditambahkan!');
        setName('');
        setPrice('');
        setStock('');
        setImage(null);
        fetchProducts();
      } else {
        const data = await res.json();
        alert('Gagal: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menambah produk');
    }
  };

  // Handler Ubah Role (Admin)
  const handleChangeRole = async (targetUserId, newRole) => {
    try {
      const res = await fetch('http://localhost:5000/admin/change-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: targetUserId, role: newRole })
      });
      if (res.ok) {
        alert('Role berhasil diperbarui!');
        fetchUsers();
      }
    } catch (err) {
      alert('Gagal mengubah role');
    }
  };

  // Handler Tambah ke Keranjang (Buyer)
  const handleAddToCart = async (productId) => {
    if (!user) return alert('Silakan login terlebih dahulu!');
    try {
      const res = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, product_id: productId })
      });
      if (res.ok) {
        alert('Produk masuk ke keranjang!');
        fetchCart(user.id);
      }
    } catch (err) {
      alert('Gagal menambah ke keranjang');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🛍️</span>
          <h1 className="text-2xl font-bold text-blue-600">Storefront</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Badge User & Role */}
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium">👋 {user.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold uppercase ${
                  user.role === 'admin' ? 'bg-red-100 text-red-700' :
                  user.role === 'seller' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* Tombol Keranjang (Buyer / Seller) */}
              <button className="relative bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => alert('Login Google Gagal')} />
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* DASHBOARD ADMIN (Hanya Tampil Jika User = Admin) */}
        {user && user.role === 'admin' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🛡️ Panel Admin - Kelola Pengguna
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b text-gray-600 text-sm">
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role Saat Ini</th>
                    <th className="p-3">Aksi Ubah Role</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50 text-sm">
                      <td className="p-3">{u.id}</td>
                      <td className="p-3 font-semibold">{u.username}</td>
                      <td className="p-3 text-gray-500">{u.email}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleChangeRole(u.id, 'buyer')}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          Jadi Buyer
                        </button>
                        <button
                          onClick={() => handleChangeRole(u.id, 'seller')}
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                        >
                          Jadi Seller
                        </button>
                        <button
                          onClick={() => handleChangeRole(u.id, 'admin')}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        >
                          Jadi Admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DASHBOARD SELLER (Hanya Tampil Jika User = Seller) */}
        {user && user.role === 'seller' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📦 Dashboard Seller - Tambah Produk Jualan
            </h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Produk</label>
                <input
                  type="text"
                  placeholder="Misal: Sepatu Sneakers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  placeholder="250000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jumlah Stok</label>
                <input
                  type="number"
                  placeholder="10"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Foto Produk</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border p-1.5 rounded-lg text-sm text-gray-500"
                  accept="image/*"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + Tambahkan Produk Baru
                </button>
              </div>
            </form>
          </div>
        )}

        {/* KATALOG PRODUK (Dapat Dilihat Semua Orang) */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔥 Katalog Produk Terpopuler
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada produk yang dijual.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <img
                    src={p.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={p.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-base mb-1 truncate">{p.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-blue-600 font-extrabold text-lg">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Stok: {p.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p.id)}
                      className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <span>+ Keranjang</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;