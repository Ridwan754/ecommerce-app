import React, { useState } from 'react';
import { Plus, Package, DollarSign, ShoppingBag, Store, Truck, MessageSquare } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import ChatBox from '../../components/ChatBox';

export default function SellerDashboard({ products = [], orders = [], onAddProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(10);
  const [category, setCategory] = useState('sepatu');
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // State Fitur Chat Seller
  const [isSellerChatOpen, setIsSellerChatOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      originalPrice: Number(price) * 1.2,
      discount: "10%",
      rating: 5.0,
      sold: 0,
      stock: Number(stock),
      category,
      image: imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
    };

    if (onAddProduct) {
      onAddProduct(newProduct);
    }

    setName('');
    setPrice('');
    setStock(10);
    setImageUrl('');
    alert("Produk berhasil ditambahkan ke katalog toko!");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans -m-6 p-6 relative">
      
      {/* NAVBAR SELLER CENTRE */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white p-4 rounded-2xl shadow-lg mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide">Shopee<span className="text-amber-200">SellerCentre</span></h1>
            <p className="text-[11px] opacity-90">Kelola toko, inventaris barang, dan pesanan pelanggan</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl font-bold border border-white/20">
            Status Toko: <span className="text-emerald-300">● Aktif</span>
          </span>
          <LogoutButton className="bg-white text-orange-600 border-white/30 hover:bg-orange-50" />
        </div>
      </header>

      {/* STATISTIK RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">Total Produk</p>
            <p className="text-2xl font-black text-slate-800">{products?.length || 0}</p>
          </div>
          <Package className="w-9 h-9 text-orange-500 bg-orange-50 p-2 rounded-xl" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">Pesanan Masuk</p>
            <p className="text-2xl font-black text-orange-600">{orders?.length || 0}</p>
          </div>
          <ShoppingBag className="w-9 h-9 text-orange-500 bg-orange-50 p-2 rounded-xl" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">Siap Dikirim</p>
            <p className="text-2xl font-black text-blue-600">0</p>
          </div>
          <Truck className="w-9 h-9 text-blue-500 bg-blue-50 p-2 rounded-xl" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">Total Pendapatan</p>
            <p className="text-2xl font-black text-emerald-600">Rp 0</p>
          </div>
          <DollarSign className="w-9 h-9 text-emerald-500 bg-emerald-50 p-2 rounded-xl" />
        </div>
      </div>

      {/* TAB SUB-MENU SELLER */}
      <div className="flex gap-2 border-b border-slate-200 mb-6 bg-white p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Kelola Produk & Stok
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'add' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          + Tambah Produk Baru
        </button>
      </div>

      {/* KONTEN TAB 1: FORM TAMBAH PRODUK BARU */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
          <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" /> Form Tambah Produk Baru
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600">Nama Produk</label>
              <input 
                type="text" 
                required
                placeholder="Contoh: Sepatu Lari Ultra Boost" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">Harga Jual (Rp)</label>
              <input 
                type="number" 
                required
                placeholder="Contoh: 250000" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">Stok Barang</label>
              <input 
                type="number" 
                required
                value={stock} 
                onChange={(e) => setStock(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-orange-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600">Kategori Produk</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-orange-500"
              >
                <option value="sepatu">Sepatu & Alas Kaki</option>
                <option value="pakaian">Pakaian & Fashion</option>
                <option value="gadget">Elektronik & Gadget</option>
                <option value="aksesoris">Aksesoris</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-600">URL Gambar Produk (Opsional)</label>
              <input 
                type="url" 
                placeholder="https://..." 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-orange-500"
              />
            </div>

            <button 
              type="submit" 
              className="sm:col-span-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-orange-500/20 hover:opacity-95 transition"
            >
              Simpan & Publikasikan Produk
            </button>
          </form>
        </div>
      )}

      {/* KONTEN TAB 2: DAFTAR KATALOG PRODUK */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-slate-800 text-base">Katalog Produk Toko Anda</h2>
            <button 
              onClick={() => setActiveTab('add')}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              + Tambah Barang Lagi
            </button>
          </div>

          {!products || products.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Belum Ada Produk Ditambahkan</p>
              <p className="text-[11px] text-slate-400 mt-1">Klik tombol "+ Tambah Produk Baru" di atas untuk mulai berjualan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="p-3">Produk</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Stok</th>
                    <th className="p-3">Terjual</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" />
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </td>
                      <td className="p-3 capitalize text-slate-600">{item.category || 'Umum'}</td>
                      <td className="p-3 font-bold text-orange-600">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                      <td className="p-3 font-mono">{item.stock ?? 10} pcs</td>
                      <td className="p-3 text-slate-500">{item.sold || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FLOATING BUTTON CHAT UNTUK SELLER */}
      <button
        type="button"
        onClick={() => setIsSellerChatOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-900 text-white p-3.5 rounded-full shadow-2xl hover:bg-slate-800 transition flex items-center gap-2 z-40 border-2 border-orange-500 cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 text-orange-400" />
        <span className="text-xs font-bold hidden sm:inline">Chat Pelanggan</span>
      </button>

      {/* WIDGET CHAT SELLER */}
      <ChatBox
        isOpen={isSellerChatOpen}
        onClose={() => setIsSellerChatOpen(false)}
        currentUserRole="seller"
        targetName="Budi Santoso (Pembeli)"
      />

    </div>
  );
}