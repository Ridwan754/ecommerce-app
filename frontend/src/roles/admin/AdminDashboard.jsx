import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Store, AlertCircle, CheckCircle2, 
  XCircle, Search, MoreVertical, TrendingUp, DollarSign 
} from 'lucide-react';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Data Dummy Pengajuan Toko Baru
  const [pendingSellers, setPendingSellers] = useState([
    { id: 1, storeName: "Toko Sepatu Impian", owner: "Budi Santoso", email: "budi@gmail.com", date: "18 Aug 2026" },
    { id: 2, storeName: "Gadget Corner Tech", owner: "Siti Rahma", email: "siti@gmail.com", date: "19 Aug 2026" },
    { id: 3, storeName: "Distro Fashion Lokal", owner: "Andi Wijaya", email: "andi@gmail.com", date: "20 Aug 2026" },
  ]);

  const handleApprove = (id, name) => {
    setPendingSellers(pendingSellers.filter(item => item.id !== id));
    alert(`Toko "${name}" berhasil diverifikasi dan diizinkan berjualan!`);
  };

  const handleReject = (id, name) => {
    setPendingSellers(pendingSellers.filter(item => item.id !== id));
    alert(`Pengajuan toko "${name}" ditolak.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER ADMIN */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Control Panel Administrator</h1>
            <p className="text-xs text-slate-400">Kelola pengguna, verifikasi seller, dan pantau statistik platform</p>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30">
          System Normal
        </span>
      </div>

      {/* 2. RINGKASAN STATISTIK PLATFORM */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Pembeli</p>
            <p className="text-2xl font-bold text-slate-800">1,240</p>
          </div>
          <Users className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-xl" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Toko Terverifikasi</p>
            <p className="text-2xl font-bold text-slate-800">48</p>
          </div>
          <Store className="w-8 h-8 text-purple-500 bg-purple-50 p-1.5 rounded-xl" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pengajuan Seller</p>
            <p className="text-2xl font-bold text-amber-600">{pendingSellers.length}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-amber-500 bg-amber-50 p-1.5 rounded-xl" />
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Transaksi</p>
            <p className="text-xl font-bold text-emerald-600">Rp 148.5M</p>
          </div>
          <DollarSign className="w-8 h-8 text-emerald-500 bg-emerald-50 p-1.5 rounded-xl" />
        </div>
      </div>

      {/* 3. TABEL VERIFIKASI SELLER BARU */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Verifikasi Toko/Seller Baru</h2>
            <p className="text-xs text-slate-500">Setujui atau tolak pendaftaran toko baru di platform</p>
          </div>

          {/* Search Table */}
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Cari toko..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Toko</th>
                <th className="py-3 px-4">Pemilik (Owner)</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {pendingSellers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Tidak ada pengajuan toko baru saat ini.
                  </td>
                </tr>
              ) : (
                pendingSellers
                  .filter(s => s.storeName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((seller) => (
                    <tr key={seller.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{seller.storeName}</td>
                      <td className="py-3.5 px-4">{seller.owner}</td>
                      <td className="py-3.5 px-4 text-slate-500">{seller.email}</td>
                      <td className="py-3.5 px-4 text-slate-500">{seller.date}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleApprove(seller.id, seller.storeName)}
                            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-lg font-bold transition text-[11px]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                          </button>
                          <button 
                            onClick={() => handleReject(seller.id, seller.storeName)}
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg font-bold transition text-[11px]"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}