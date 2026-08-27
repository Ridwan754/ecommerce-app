import { useState, useEffect } from 'react';
import { 
  Store, Package, Users, Trash2, Edit3, 
  CheckCircle, XCircle, Globe, User, Search, X, ShieldAlert, AlertTriangle 
} from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import { useLanguage } from '../../context/useLanguage';

export default function AdminDashboard({ 
  products = [], 
  setProducts = () => {},
  sellers = [], 
  setSellers = () => {} 
}) {
  const { lang, setLang } = useLanguage();
  const isEn = lang === 'en';

  const [activeTab, setActiveTab] = useState('sellers');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. KATA KUNCI SENSITIF (AUTO-BAN SECURITY)
  const BANNED_KEYWORDS = [
    'ganja', 'sabu', 'obatin', 'obat bius', 'dosis tinggi', 'sianida', 
    'pisau lipat', 'pedang', 'katana', 'celurit', 'senjata', 'pistol', 
    'peluru', 'narkoba', 'tramadol', 'eximer', 'pisau', 'sangkur'
  ];

  // 2. FUNGSI PEMINDAIAN KEAMANAN OTOMATIS (Mendukung Multi-Tab Chrome via localStorage)
  useEffect(() => {
    const scanForBannedProducts = () => {
      const localProducts = JSON.parse(localStorage.getItem('app_products') || '[]');
      const allProductsToCheck = products.length > 0 ? products : localProducts;

      if (allProductsToCheck.length > 0) {
        allProductsToCheck.forEach((product) => {
          const textToCheck = `${product.name || ''} ${product.description || ''}`.toLowerCase();
          const containsBannedItem = BANNED_KEYWORDS.some(keyword => textToCheck.includes(keyword));

          if (containsBannedItem) {
            const sellerToBan = product.sellerName || 'Toko Saya';

            // A. Update status seller menjadi BANNED
            setSellers(prevSellers => {
              const localSellers = JSON.parse(localStorage.getItem('app_sellers') || '[]');
              const currentSellers = prevSellers.length > 0 ? prevSellers : localSellers;

              const updated = currentSellers.map(s => {
                if ((s.name === sellerToBan || s.owner === sellerToBan) && s.status !== 'banned') {
                  return { 
                    ...s, 
                    status: 'banned', 
                    banReason: `Menjual produk terlarang/berbahaya: "${product.name}"` 
                  };
                }
                return s;
              });

              localStorage.setItem('app_sellers', JSON.stringify(updated));
              return updated;
            });

            // B. Hapus otomatis produk ilegal tersebut
            setProducts(prevProducts => {
              const filtered = (prevProducts.length > 0 ? prevProducts : allProductsToCheck)
                .filter(p => p.id !== product.id);
              localStorage.setItem('app_products', JSON.stringify(filtered));
              return filtered;
            });

            alert(`[SECURITY SYSTEM] Toko "${sellerToBan}" ter-banned otomatis karena terdeteksi menjual barang terlarang: "${product.name}"`);
          }
        });
      }
    };

    scanForBannedProducts();

    const handleStorageChange = (e) => {
      if (e.key === 'app_products' || !e.key) {
        scanForBannedProducts();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [products, setProducts, setSellers]);

  // 3. SINKRONISASI DAFTAR TOKO AKTIF
  useEffect(() => {
    if (products.length > 0) {
      const uniqueSellerNames = [...new Set(products.map(p => p.sellerName || 'Official Store'))];
      
      setSellers(prevSellers => {
        const existingNames = prevSellers.map(s => s.name);
        const newSellersFromProducts = uniqueSellerNames
          .filter(name => !existingNames.includes(name))
          .map((name, index) => ({
            id: `SLR-${Date.now()}-${index}`,
            name: name,
            owner: 'Mitra Penjual',
            email: `${name.toLowerCase().replace(/\s+/g, '')}@store.com`,
            nik: '3201019827361234',
            status: 'active'
          }));

        const updatedSellers = [...prevSellers, ...newSellersFromProducts];
        localStorage.setItem('app_sellers', JSON.stringify(updatedSellers));
        return updatedSellers;
      });
    }
  }, [products, setSellers]);

  // 4. SINKRONISASI REAL-TIME: MEMBACA PENGAJUAN SELLER BARU DARI LOCALSTORAGE
  const [pendingSellers, setPendingSellers] = useState([
    { id: 'PEND-1', name: 'Distro Fashion', owner: 'Siti Rahma', email: 'siti@gmail.com', nik: '3201027384918273', date: '21 Aug 2026' }
  ]);

  useEffect(() => {
    const loadPendingSellers = () => {
      const savedPending = JSON.parse(localStorage.getItem('app_pending_sellers') || '[]');
      if (savedPending.length > 0) {
        setPendingSellers(savedPending);
      }
    };

    loadPendingSellers();

    const handlePendingStorageChange = (e) => {
      if (e.key === 'app_pending_sellers' || !e.key) {
        loadPendingSellers();
      }
    };

    window.addEventListener('storage', handlePendingStorageChange);
    return () => window.removeEventListener('storage', handlePendingStorageChange);
  }, []);

  // State Modal Edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');

  const [editingSeller, setEditingSeller] = useState(null);
  const [editSellerName, setEditSellerName] = useState('');
  const [editSellerOwner, setEditSellerOwner] = useState('');

  // HANDLERS AKSI ADMIN
  const handleApproveSeller = (pendingItem) => {
    const newActiveSeller = {
      id: `SLR-${Date.now()}`,
      name: pendingItem.name,
      owner: pendingItem.owner,
      email: pendingItem.email,
      nik: pendingItem.nik,
      status: 'active'
    };
    
    // Update daftar toko aktif
    const updatedSellers = [...sellers, newActiveSeller];
    setSellers(updatedSellers);
    localStorage.setItem('app_sellers', JSON.stringify(updatedSellers));

    // Hapus dari daftar pending
    const updatedPending = pendingSellers.filter(s => s.id !== pendingItem.id);
    setPendingSellers(updatedPending);
    localStorage.setItem('app_pending_sellers', JSON.stringify(updatedPending));

    alert(isEn ? 'Seller approved!' : 'Seller berhasil disetujui!');
  };

  const handleRejectSeller = (id) => {
    const updatedPending = pendingSellers.filter(s => s.id !== id);
    setPendingSellers(updatedPending);
    localStorage.setItem('app_pending_sellers', JSON.stringify(updatedPending));
  };

  const handleUnbanSeller = (id) => {
    const updated = sellers.map(s => s.id === id ? { ...s, status: 'active', banReason: null } : s);
    setSellers(updated);
    localStorage.setItem('app_sellers', JSON.stringify(updated));
    alert(isEn ? 'Seller unbanned successfully!' : 'Akses toko berhasil dipulihkan!');
  };

  const handleDeleteSeller = (id) => {
    if (confirm(isEn ? 'Delete this store?' : 'Yakin ingin menghapus toko ini?')) {
      const updated = sellers.filter(s => s.id !== id);
      setSellers(updated);
      localStorage.setItem('app_sellers', JSON.stringify(updated));
    }
  };

  const handleOpenEditSeller = (seller) => {
    setEditingSeller(seller);
    setEditSellerName(seller.name);
    setEditSellerOwner(seller.owner);
  };

  const handleSaveSeller = (e) => {
    e.preventDefault();
    const updated = sellers.map(s => s.id === editingSeller.id ? { ...s, name: editSellerName, owner: editSellerOwner } : s);
    setSellers(updated);
    localStorage.setItem('app_sellers', JSON.stringify(updated));
    setEditingSeller(null);
    alert(isEn ? 'Store updated!' : 'Data toko berhasil diperbarui!');
  };

  const handleDeleteProduct = (id) => {
    if (confirm(isEn ? 'Delete this product?' : 'Yakin ingin menghapus produk ini?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('app_products', JSON.stringify(updated));
    }
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdPrice(prod.price);
    setEditProdCategory(prod.category || 'sepatu');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const updated = products.map(p => p.id === editingProduct.id ? { 
      ...p, 
      name: editProdName, 
      price: Number(editProdPrice), 
      category: editProdCategory 
    } : p);
    setProducts(updated);
    localStorage.setItem('app_products', JSON.stringify(updated));
    setEditingProduct(null);
    alert(isEn ? 'Product updated!' : 'Produk berhasil diperbarui!');
  };

  // Filter Data
  const filteredSellers = (sellers || []).filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.owner?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = (products || []).filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sellerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bannedSellers = (sellers || []).filter(s => s.status === 'banned');

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased -m-6 pb-20">
      
      {/* HEADER VERCEL ADMIN */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold text-xs">
              ▲
            </div>
            <h1 className="text-sm font-black tracking-tight uppercase">
              SOPI'I <span className="text-neutral-400 font-light">ADMIN CONTROL PANEL</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1">
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <div className="text-left text-[11px] leading-tight">
                <p className="font-bold text-neutral-800">Admin Super</p>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Administrator</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
              <Globe className="w-3.5 h-3.5" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-black font-bold cursor-pointer outline-none"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
              </select>
            </div>

            <LogoutButton className="text-xs font-semibold px-3 py-1.5 rounded-md border border-neutral-200 hover:bg-black hover:text-white transition cursor-pointer" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* NAVIGASI TAB UTAMA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('sellers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'sellers' 
                  ? 'bg-black text-white shadow-xs' 
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-black'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{isEn ? 'Sellers Management' : 'Manajemen Toko / Seller'} ({sellers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'products' 
                  ? 'bg-black text-white shadow-xs' 
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-black'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isEn ? 'All Products Control' : 'Kelola Semua Produk'} ({products.length})</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={isEn ? "Search..." : "Cari data..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3.5 py-1.5 pr-8 text-xs focus:outline-none focus:border-black font-medium text-black"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* TAB 1: MANAJEMEN SELLER & PERINGATAN BANNED */}
        {activeTab === 'sellers' && (
          <div className="space-y-8">
            
            {/* PANEL SIKAP KEAMANAN: TOKO TER-BANNED OTOMATIS */}
            {bannedSellers.length > 0 && (
              <section className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3 shadow-xs">
                <h2 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Peringatan Sistem: Seller Ter-Banned Otomatis ({bannedSellers.length})
                </h2>

                <div className="divide-y divide-rose-100 text-xs">
                  {bannedSellers.map(banned => (
                    <div key={banned.id} className="py-3 flex items-center justify-between gap-4 first:pt-0">
                      <div>
                        <p className="font-bold text-rose-900 text-sm">{banned.name}</p>
                        <p className="text-rose-600 text-[11px] font-medium">{banned.banReason}</p>
                        <p className="text-rose-400 font-mono text-[10px] mt-0.5">ID: {banned.id}</p>
                      </div>

                      <button
                        onClick={() => handleUnbanSeller(banned.id)}
                        className="bg-rose-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-rose-700 transition cursor-pointer shrink-0"
                      >
                        Buka Banned (Unban)
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 1. VERIFIKASI SELLER BARU (TERHUBUNG KE LOGINPAGE REGISTER) */}
            {pendingSellers.length > 0 && (
              <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-neutral-100">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {isEn ? 'Pending Seller Verification' : 'Pengajuan Verifikasi Seller Baru'} ({pendingSellers.length})
                  </h2>
                </div>

                <div className="divide-y divide-neutral-100 text-xs">
                  {pendingSellers.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50">
                      <div>
                        <p className="font-bold text-neutral-900">{item.name}</p>
                        <p className="text-neutral-500 text-[11px]">{item.owner} ({item.email})</p>
                        <p className="text-neutral-400 font-mono text-[10px] mt-0.5">NIK: {item.nik}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveSeller(item)}
                          className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-neutral-800 transition cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isEn ? 'Approve' : 'Setujui'}</span>
                        </button>
                        <button
                          onClick={() => handleRejectSeller(item.id)}
                          className="flex items-center gap-1 border border-neutral-200 text-neutral-600 px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Reject' : 'Tolak'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. DAFTAR TOKO AKTIF */}
            <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-neutral-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {isEn ? 'Active Stores List' : 'Daftar Toko / Seller Aktif'} ({filteredSellers.length})
                </h2>
              </div>

              <div className="divide-y divide-neutral-100 text-xs">
                {filteredSellers.length > 0 ? (
                  filteredSellers.map((s) => (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-neutral-900 text-sm">{s.name}</p>
                          {s.status === 'banned' && (
                            <span className="bg-red-100 text-red-600 font-black text-[9px] uppercase px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Banned
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-500">{s.owner} ({s.email || 'N/A'})</p>
                        <p className="text-neutral-400 font-mono text-[10px] mt-0.5">ID: {s.id} | NIK: {s.nik || 'VERIFIED'}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditSeller(s)}
                          className="p-2 border border-neutral-200 rounded-lg text-neutral-600 hover:text-black hover:border-black transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSeller(s.id)}
                          className="p-2 border border-neutral-200 rounded-lg text-neutral-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-neutral-400 italic">
                    {isEn ? 'No stores found.' : 'Tidak ada toko terdaftar.'}
                  </div>
                )}
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: MANAJEMEN KELOLA SEMUA PRODUK */}
        {activeTab === 'products' && (
          <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-neutral-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {isEn ? 'Manage All E-Commerce Products' : 'Kelola Seluruh Produk E-Commerce'} ({filteredProducts.length})
              </h2>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50">
                    <div className="flex items-center gap-3">
                      <img src={p.image || 'https://via.placeholder.com/60'} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-neutral-200 bg-neutral-100 shrink-0" />
                      <div>
                        <h3 className="font-bold text-neutral-900">{p.name}</h3>
                        <p className="font-mono text-blue-600 font-bold">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Toko: <span className="font-bold text-neutral-700">{p.sellerName || 'Official Store'}</span> | Kategori: {p.category || 'Umum'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-2 border border-neutral-200 rounded-lg text-neutral-600 hover:text-black hover:border-black transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 border border-neutral-200 rounded-lg text-neutral-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-neutral-400 italic">
                  {isEn ? 'No products available.' : 'Belum ada produk.'}
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* MODAL EDIT PRODUK */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-neutral-900 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-black">
                {isEn ? 'Edit Product (Admin Override)' : 'Edit Produk (Akses Admin)'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-black p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={editProdPrice}
                  onChange={(e) => setEditProdPrice(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 mb-1">Kategori</label>
                <select
                  value={editProdCategory}
                  onChange={(e) => setEditProdCategory(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-bold text-black"
                >
                  <option value="sepatu">Sepatu</option>
                  <option value="pakaian">Pakaian</option>
                  <option value="gadget">Gadget</option>
                  <option value="aksesoris">Aksesoris</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-full font-semibold hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-full font-bold hover:bg-neutral-800"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT TOKO */}
      {editingSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-neutral-900 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-black">
                {isEn ? 'Edit Store Info' : 'Edit Informasi Toko'}
              </h3>
              <button onClick={() => setEditingSeller(null)} className="text-neutral-400 hover:text-black p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSeller} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-600 mb-1">Nama Toko</label>
                <input
                  type="text"
                  required
                  value={editSellerName}
                  onChange={(e) => setEditSellerName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 mb-1">Nama Pemilik</label>
                <input
                  type="text"
                  required
                  value={editSellerOwner}
                  onChange={(e) => setEditSellerOwner(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingSeller(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-full font-semibold hover:bg-neutral-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-full font-bold hover:bg-neutral-800"
                >
                  Simpan Toko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}