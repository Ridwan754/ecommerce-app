import React, { useState } from 'react';
import { Plus, Package, DollarSign, TrendingUp, Store } from 'lucide-react';

export default function SellerDashboard({ products, onAddProduct }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('sepatu');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    onAddProduct({
      id: Date.now(),
      name,
      price: Number(price),
      originalPrice: Number(price) * 1.2,
      discount: "10%",
      rating: 5.0,
      sold: 0,
      category,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
    });

    setName('');
    setPrice('');
    alert("Produk berhasil ditambahkan!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard Penjual</h1>
            <p className="text-xs text-slate-500">Kelola toko dan produk Anda di sini</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Produk</p>
            <p className="text-xl font-bold text-slate-800">{products.length}</p>
          </div>
          <Package className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Penjualan</p>
            <p className="text-xl font-bold text-emerald-600">Rp 12.500.000</p>
          </div>
          <DollarSign className="w-8 h-8 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pesanan Baru</p>
            <p className="text-xl font-bold text-orange-600">8 Pesanan</p>
          </div>
          <TrendingUp className="w-8 h-8 text-orange-500 bg-orange-50 p-1.5 rounded-lg" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" /> Tambah Produk Baru
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="Nama Produk" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="number" 
            placeholder="Harga (Rp)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sepatu">Sepatu</option>
            <option value="pakaian">Pakaian</option>
            <option value="gadget">Gadget</option>
            <option value="aksesoris">Aksesoris</option>
          </select>
          <button type="submit" className="sm:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition">
            Simpan Produk
          </button>
        </form>
      </div>
    </div>
  );
}