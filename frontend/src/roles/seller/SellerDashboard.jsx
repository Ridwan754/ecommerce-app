import React, { useState } from 'react';
import { Plus, Package, DollarSign, ShoppingBag, Store, Truck, MessageSquare, Edit2, Trash2, Check, X, Upload } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import ChatBox from '../../components/ChatBox';

// Daftar Toko/Seller yang Tersedia
export const STORES = [
  { id: 'seller_1', name: 'Toko Sepatu Impian', owner: 'Ahmad' },
  { id: 'seller_2', name: 'Fashion Hub Official', owner: 'Siti' },
  { id: 'seller_3', name: 'GadgetZone Indonesia', owner: 'Budi' },
];

export default function SellerDashboard({ 
  products = [], 
  orders = [], 
  onAddProduct, 
  onUpdateStock, 
  onDeleteProduct,
  currentSellerId = 'seller_1',
  onChangeSeller
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(10);
  const [category, setCategory] = useState('sepatu');
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  const [editingId, setEditingId] = useState(null);
  const [editingStock, setEditingStock] = useState(0);
  const [isSellerChatOpen, setIsSellerChatOpen] = useState(false);

  // Ambil detail toko yang sedang aktif
  const currentSeller = STORES.find(s => s.id === currentSellerId) || STORES[0];

  // Filter produk khusus milik seller yang sedang aktif
  const sellerProducts = products.filter(p => p.sellerId === currentSeller.id);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
      sellerId: currentSeller.id,      // ID Toko
      sellerName: currentSeller.name,  // Nama Toko
      image: imagePreview || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
    };

    if (onAddProduct) onAddProduct(newProduct);

    setName('');
    setPrice('');
    setStock(10);
    setImagePreview(null);
    setActiveTab('products');
    alert(`Produk berhasil ditambahkan ke ${currentSeller.name}!`);
  };

  const startEditingStock = (item) => {
    setEditingId(item.id);
    setEditingStock(item.stock ?? 10);
  };

  const handleSaveStock = (id) => {
    if (onUpdateStock) onUpdateStock(id, Number(editingStock));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans -m-6 p-6 relative">
      
      {/* NAVBAR SELLER CENTRE */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white p-4 rounded-2xl shadow-lg mb-6 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide">Shopee<span className="text-amber-200">SellerCentre</span></h1>
            <p className="text-[11px] opacity-90">Kelola toko, inventaris barang, dan pesanan pelanggan</p>
          </div>
        </div>

        {/* BERALIH AKUN TOKO/SELLER */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-xs flex items-center gap-2 border border-white/20">
            <span className="font-bold">Ganti Toko:</span>
            <select 
              value={currentSellerId} 
              onChange={(e) => onChangeSeller && onChangeSeller(e.target.value)}
              className="bg-white text-slate-800 font-bold rounded-lg p-1 text-xs outline-none cursor-pointer"
            >
              {STORES.map(store => (
                <option key={store.id} value={store.id}>{store.name} ({store.owner})</option>
              ))}
            </select>
          </div>

          <LogoutButton className="bg-white text-orange-600 border-white/30 hover:bg-orange-50" />
        </div>
      </header>

      {/* STATISTIK RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">Produk Toko Ini</p>
            <p className="text-2xl font-black text-slate-800">{sellerProducts?.length || 0}</p>
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

      {/* TAB SUB-MENU */}
      <div className="flex gap-2 border-b border-slate-200 mb-6 bg-white p-2 rounded-2xl shadow-sm">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Kelola Produk & Stok ({currentSeller.name})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'add' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          + Tambah Produk Baru
        </button>
      </div>

      {/* FORM TAMBAH PRODUK */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm space-y-4">
          <h2 className="font-black text-slate-800 text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" /> Tambah Produk Untuk Toko: <span className="text-orange-600">{currentSeller.name}</span>
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
              <label className="text-xs font-bold text-slate-600 block mb-1">Unggah Foto Produk</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-600 font-bold hover:bg-orange-50 hover:border-orange-400 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-orange-500" />
                  <span>Pilih File Gambar</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                
                {imagePreview && (
                  <div className="relative flex items-center gap-2 bg-slate-100 p-2 rounded-xl border">
                    <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
                    <span className="text-[10px] text-emerald-600 font-bold">✓ File Siap</span>
                    <button type="button" onClick={() => setImagePreview(null)} className="text-red-500 text-xs ml-2 hover:underline">Hapus</button>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="sm:col-span-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-orange-500/20 hover:opacity-95 transition cursor-pointer"
            >
              Simpan & Publikasikan Produk
            </button>
          </form>
        </div>
      )}

      {/* KATALOG PRODUK SELLER */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-slate-800 text-base">Katalog Produk {currentSeller.name}</h2>
            <button onClick={() => setActiveTab('add')} className="text-xs font-bold text-orange-600 hover:underline cursor-pointer">
              + Tambah Barang Lagi
            </button>
          </div>

          {!sellerProducts || sellerProducts.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">Belum Ada Produk Ditambahkan di Toko Ini</p>
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
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sellerProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" />
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </td>
                      <td className="p-3 capitalize text-slate-600">{item.category || 'Umum'}</td>
                      <td className="p-3 font-bold text-orange-600">Rp {Number(item.price).toLocaleString('id-ID')}</td>
                      <td className="p-3 font-mono">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editingStock}
                              onChange={(e) => setEditingStock(e.target.value)}
                              className="w-16 p-1 border border-orange-500 rounded bg-white text-xs"
                            />
                            <button onClick={() => handleSaveStock(item.id)} className="p-1 bg-emerald-500 text-white rounded"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1 bg-slate-300 text-slate-700 rounded"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{item.stock ?? 10} pcs</span>
                            <button onClick={() => startEditingStock(item)} className="text-slate-400 hover:text-orange-500"><Edit2 className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-500">{item.sold || 0}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => onDeleteProduct && onDeleteProduct(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* WIDGET CHAT SELLER (PESANAN PEMBELI MASUK SESUAI TOKO SESEORANG) */}
      <button
        type="button"
        onClick={() => setIsSellerChatOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-900 text-white p-3.5 rounded-full shadow-2xl hover:bg-slate-800 transition flex items-center gap-2 z-40 border-2 border-orange-500 cursor-pointer"
      >
        <MessageSquare className="w-5 h-5 text-orange-400" />
        <span className="text-xs font-bold hidden sm:inline">Pesan Masuk ({currentSeller.name})</span>
      </button>

      <ChatBox
        isOpen={isSellerChatOpen}
        onClose={() => setIsSellerChatOpen(false)}
        currentUserRole="seller"
        currentUserId={currentSeller.id}
        targetName="Pembeli (Budi)"
      />

    </div>
  );
}