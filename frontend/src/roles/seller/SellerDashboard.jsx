import { useState } from 'react';
import { Plus, Trash2, Package, Store, User, Globe, Image, PlusCircle } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/AuthContext';

export default function SellerDashboard({ products = [], setProducts = () => {} }) {
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();
  const isEn = lang === 'en';

  // Form State untuk Tambah Produk Baru oleh Seller
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('sepatu');
  const [mainImage, setMainImage] = useState('');

  // Dynamic Array State untuk Variasi Warna & Gambar
  const [variants, setVariants] = useState([
    { color: 'Merah', image: '' },
    { color: 'Hitam', image: '' }
  ]);

  const handleAddVariantRow = () => {
    setVariants([...variants, { color: '', image: '' }]);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleRemoveVariantRow = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !mainImage) {
      return alert(isEn ? 'Please complete all required fields!' : 'Mohon lengkapi semua kolom wajib!');
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      sellerName: user?.name || 'Toko Saya',
      image: mainImage,
      variants: variants.filter(v => v.color.trim() !== '')
    };

    setProducts([newProduct, ...products]);

    // Reset Form
    setName('');
    setPrice('');
    setMainImage('');
    setVariants([{ color: 'Merah', image: '' }, { color: 'Hitam', image: '' }]);
    alert(isEn ? 'Product added successfully!' : 'Produk berhasil ditambahkan!');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const sellerProducts = products.filter(
    p => p.sellerName === user?.name || p.sellerName === 'Toko Saya' || true
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased -m-6 pb-20">
      
      {/* VERCEL STYLE HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold text-xs">
              ▲
            </div>
            <h1 className="text-sm font-black tracking-tight uppercase">
              SOPI'I <span className="text-neutral-400 font-light">SELLER DASHBOARD</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1">
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <div className="text-left text-[11px] leading-tight">
                <p className="font-bold text-neutral-800 truncate max-w-[90px]">
                  {user?.name || 'Seller'}
                </p>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                  {user?.role || 'Seller'}
                </p>
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

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM TAMBAH PRODUK DENGAN VARIASI WARNA & GAMBAR */}
        <section className="lg:col-span-1 bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs h-fit space-y-6">
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {isEn ? 'Add New Product' : 'Tambah Produk Baru'}
          </h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {isEn ? 'Product Name' : 'Nama Produk'} *
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition"
                placeholder="Contoh: Sepatu Nike Running"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {isEn ? 'Price (Rp)' : 'Harga (Rp)'} *
              </label>
              <input 
                type="number" 
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition"
                placeholder="250000"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {isEn ? 'Category' : 'Kategori'}
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition font-bold cursor-pointer"
              >
                <option value="sepatu">{isEn ? 'Shoes' : 'Sepatu'}</option>
                <option value="pakaian">{isEn ? 'Apparel' : 'Pakaian'}</option>
                <option value="gadget">Gadget</option>
                <option value="aksesoris">{isEn ? 'Accessories' : 'Aksesoris'}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {isEn ? 'Main Image URL' : 'URL Gambar Utama'} *
              </label>
              <input 
                type="url" 
                required
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* VARIASI WARNA DAN GAMBAR */}
            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                  {isEn ? 'Color & Image Variants' : 'Variasi Warna & Gambar'}
                </label>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {isEn ? 'Add Variant' : 'Tambah Variasi'}
                </button>
              </div>

              {variants.map((variant, idx) => (
                <div key={idx} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 space-y-2 relative">
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="Nama Warna (e.g. Merah)"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                      className="w-1/3 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-black"
                    />
                    <input 
                      type="url" 
                      placeholder="URL Gambar Warna Ini"
                      value={variant.image}
                      onChange={(e) => handleVariantChange(idx, 'image', e.target.value)}
                      className="flex-1 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-black"
                    />
                    {variants.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveVariantRow(idx)}
                        className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer mt-4"
            >
              {isEn ? 'Save Product' : 'Simpan Produk'}
            </button>
          </form>
        </section>

        {/* DAFTAR PRODUK SELLER */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs h-fit">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-800" />
              {isEn ? 'Your Products' : 'Daftar Produk Toko'} ({sellerProducts.length})
            </h2>
          </div>

          <div className="divide-y divide-neutral-100">
            {sellerProducts.length > 0 ? (
              sellerProducts.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-neutral-200 bg-neutral-100 shrink-0" />
                    <div>
                      <h3 className="text-xs font-bold text-neutral-900">{p.name}</h3>
                      <p className="text-[11px] font-bold text-blue-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {p.variants?.length || 0} {isEn ? 'Variants' : 'Variasi Warna'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-neutral-400 italic">
                {isEn ? 'No products added yet.' : 'Belum ada produk yang ditambahkan.'}
              </div>
            )}
          </div>
        </section>

      </main>

    </div>
  );
}