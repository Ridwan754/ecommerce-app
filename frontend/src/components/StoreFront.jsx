import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Heart, ShoppingCart, LogOut, 
  Star, Tag, ChevronRight, Laptop, Shirt, Smartphone, Watch
} from 'lucide-react';

export default function EcommerceStorefront() {
  const [searchTerm, setSearchTerm] = useState('');

  // Contoh Data Dummy Produk
  const products = [
    {
      id: 1,
      name: "Sepatu Sneakers Running Cool",
      price: 250000,
      originalPrice: 350000,
      discount: "28%",
      rating: 4.8,
      sold: 150,
      stock: 15,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
    },
    {
      id: 2,
      name: "Headphone Bluetooth Wireless Bass",
      price: 499000,
      originalPrice: 750000,
      discount: "33%",
      rating: 4.9,
      sold: 85,
      stock: 8,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
    },
    {
      id: 3,
      name: "Smartwatch Sport Monitor Heart",
      price: 320000,
      originalPrice: 400000,
      discount: "20%",
      rating: 4.7,
      sold: 210,
      stock: 20,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    },
    {
      id: 4,
      name: "Kacamata Casual UV Protection",
      price: 120000,
      originalPrice: 150000,
      discount: "20%",
      rating: 4.6,
      sold: 95,
      stock: 12,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 1. NAVBAR PERBAIKAN */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Storefront
            </span>
          </div>

          {/* Search Bar Besar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari sepatu, laptop, atau pakaian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Action Menu (User Profile & Cart) */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-full relative">
              <Heart className="w-5 h-5" />
            </button>
            
            <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                1
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium text-slate-700">👋 Ridwan</span>
            </div>

            <button className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl border border-red-200 transition">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTAINER UTAMA */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* 2. HERO BANNER PROMO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 md:p-12 shadow-lg">
          <div className="relative z-10 max-w-lg space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> Promo Gajian Spektakuler
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Diskon Hingga <span className="text-yellow-300">50%</span> Untuk Semua Sneakers!
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Dapatkan koleksi terbaru dengan penawaran gratis ongkir ke seluruh Indonesia.
            </p>
            <button className="mt-2 inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-md">
              Belanja Sekarang <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {/* Hiasan Dekorasi */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </section>

        {/* 3. KATEGORI PINTASAN */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-800">Kategori Pilihan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Sepatu', icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
              { label: 'Pakaian', icon: Shirt, color: 'bg-blue-50 text-blue-600' },
              { label: 'Gadget', icon: Smartphone, color: 'bg-purple-50 text-purple-600' },
              { label: 'Aksesoris', icon: Watch, color: 'bg-emerald-50 text-emerald-600' },
            ].map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition">
                <div className={`p-3 rounded-xl ${cat.color}`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-700">{cat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KATALOG PRODUK GRID */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              🔥 Katalog Produk Terpopuler
            </h2>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Lihat Semua</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col justify-between">
                
                {/* Gambar & Badge */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                    -{product.discount}
                  </span>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 transition">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Produk */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 leading-snug hover:text-blue-600 cursor-pointer">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.rating}
                      </span>
                      <span>•</span>
                      <span>Terjual {product.sold}+</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Harga */}
                    <div>
                      <div className="text-xs text-slate-400 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Button Tambah */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm active:scale-95">
                      <ShoppingCart className="w-4 h-4" />
                      <span>+ Keranjang</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}