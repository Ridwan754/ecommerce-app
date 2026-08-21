import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import { ShieldCheck, UserPlus, Trash2, CheckCircle, XCircle, FileText, Store } from 'lucide-react';

export default function AdminDashboard() {
  const [activeSellers, setActiveSellers] = useState([
    { id: 1, shopName: 'Toko Sepatu Impian', ownerName: 'Budi Santoso', email: 'budi@gmail.com', nik: '3201019827361234' }
  ]);

  const [pendingSellers, setPendingSellers] = useState([
    { id: 101, shopName: 'Distro Fashion', ownerName: 'Siti Rahma', email: 'siti@gmail.com', nik: '3201027384918273', submissionDate: '21 Aug 2026' }
  ]);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({ shopName: '', ownerName: '', email: '', nik: '' });

  const handleApprove = (seller) => {
    setActiveSellers([...activeSellers, seller]);
    setPendingSellers(pendingSellers.filter(s => s.id !== seller.id));
    alert(`Toko "${seller.shopName}" berhasil DISETUJUI!`);
  };

  const handleReject = (id) => {
    if (window.confirm("Yakin ingin menolak pengajuan ini?")) {
      setPendingSellers(pendingSellers.filter(s => s.id !== id));
    }
  };

  const handleDeleteActiveSeller = (id) => {
    if (window.confirm("Hapus seller ini dari platform?")) {
      setActiveSellers(activeSellers.filter(s => s.id !== id));
    }
  };

  const handleAddManualSeller = (e) => {
    e.preventDefault();
    const newSeller = { id: Date.now(), ...manualForm };
    setActiveSellers([...activeSellers, newSeller]);
    setIsManualModalOpen(false);
    setManualForm({ shopName: '', ownerName: '', email: '', nik: '' });
    alert("Seller manual berhasil ditambahkan!");
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      
      {/* NAVBAR ADMIN */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-wide">ADMINISTRATOR CONTROL PANEL</h1>
              <p className="text-[10px] text-slate-400">Sopi'i E-Commerce Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-orange-400 font-semibold">
              Role: Master Admin
            </span>
            <LogoutButton className="bg-slate-800 text-red-400 border-slate-700 hover:bg-red-500/10" />
          </div>
        </div>
      </header>

      {/* BODY ADMIN */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Manajemen Akses Penjual</h2>
            <p className="text-xs text-slate-500">Kelola toko aktif, verifikasi berkas, atau daftarkan penjual secara manual.</p>
          </div>
          <button 
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition"
          >
            <UserPlus className="w-4 h-4" /> Bantu Daftarkan Seller (Manual)
          </button>
        </div>

        {/* VERIFIKASI SELLER BARU */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" /> Pengajuan Verifikasi Seller Baru ({pendingSellers.length})
          </h3>
          
          {pendingSellers.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Tidak ada antrean pengajuan baru saat ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b">
                  <tr>
                    <th className="p-3">Nama Toko</th>
                    <th className="p-3">Pemilik</th>
                    <th className="p-3">NIK (KTP)</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3 text-center">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pendingSellers.map(seller => (
                    <tr key={seller.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{seller.shopName}</td>
                      <td className="p-3">{seller.ownerName} <br/><span className="text-[10px] text-slate-400">{seller.email}</span></td>
                      <td className="p-3 font-mono text-slate-600">{seller.nik}</td>
                      <td className="p-3">{seller.submissionDate}</td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleApprove(seller)} className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5" /> Setujui
                          </button>
                          <button onClick={() => handleReject(seller.id)} className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-xl font-bold hover:bg-red-100">
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DAFTAR SELLER AKTIF */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-500" /> Daftar Toko / Seller Aktif ({activeSellers.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b">
                <tr>
                  <th className="p-3">ID Toko</th>
                  <th className="p-3">Nama Toko</th>
                  <th className="p-3">Pemilik & Kontak</th>
                  <th className="p-3">NIK Verified</th>
                  <th className="p-3 text-center">Kelola Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeSellers.map(seller => (
                  <tr key={seller.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 font-mono">#SLR-{seller.id}</td>
                    <td className="p-3 font-bold text-slate-800">{seller.shopName}</td>
                    <td className="p-3">{seller.ownerName} ({seller.email})</td>
                    <td className="p-3 font-mono">{seller.nik}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleDeleteActiveSeller(seller.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-xl transition border border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* MODAL INPUT MANUAL ADMIN */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border">
            <h3 className="font-bold text-slate-800 text-base mb-2">Tambah Seller Manual</h3>
            <p className="text-xs text-slate-500 mb-4">Gunakan ini jika calon penjual tidak bisa mendaftar secara mandiri.</p>

            <form onSubmit={handleAddManualSeller} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600">Nama Toko</label>
                <input type="text" required value={manualForm.shopName} onChange={e => setManualForm({...manualForm, shopName: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Nama Pemilik</label>
                <input type="text" required value={manualForm.ownerName} onChange={e => setManualForm({...manualForm, ownerName: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Email</label>
                <input type="email" required value={manualForm.email} onChange={e => setManualForm({...manualForm, email: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">NIK (KTP)</label>
                <input type="number" required value={manualForm.nik} onChange={e => setManualForm({...manualForm, nik: e.target.value})} className="w-full mt-1 p-2 border rounded-xl text-xs" placeholder="16 Digit NIK" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t mt-4">
                <button type="button" onClick={() => setIsManualModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Batal</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Simpan & Aktifkan Toko</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}