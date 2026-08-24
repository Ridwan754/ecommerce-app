import { useState } from 'react';
import { ShieldCheck, UserPlus, CheckCircle2, XCircle, Trash2, Globe, User, X } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const isEn = lang === 'en';

  const [pendingSellers, setPendingSellers] = useState([
    { id: 1, name: 'Distro Fashion', owner: 'Siti Rahma', email: 'siti@gmail.com', nik: '3201027384918273', date: '21 Aug 2026' }
  ]);

  const [activeSellers, setActiveSellers] = useState([
    { id: 'SLR-1', name: 'Toko Sepatu Impian', owner: 'Budi Santoso', email: 'budi@gmail.com', nik: '3201019827361234' }
  ]);

  const handleApprove = (seller) => {
    setActiveSellers([...activeSellers, { id: `SLR-${activeSellers.length + 1}`, name: seller.name, owner: seller.owner, email: seller.email, nik: seller.nik }]);
    setPendingSellers(pendingSellers.filter(s => s.id !== seller.id));
  };

  const handleReject = (id) => {
    setPendingSellers(pendingSellers.filter(s => s.id !== id));
  };

  const handleDeleteActive = (id) => {
    setActiveSellers(activeSellers.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased -m-6 pb-20">
      
      {/* VERCEL STYLE DASHBOARD HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold text-xs">
              ▲
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight uppercase flex items-center gap-2">
                SOPI'I <span className="text-neutral-400 font-light">ADMIN CONTROL</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1">
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <div className="text-left text-[11px] leading-tight">
                <p className="font-bold text-neutral-800 truncate max-w-[90px]">
                  {user?.name || 'Master Admin'}
                </p>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                  {user?.role || 'Admin'}
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

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        
        {/* ACTION BANNER */}
        <section className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-neutral-900">
              {isEn ? 'Seller Access Management' : 'Manajemen Akses Penjual'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isEn 
                ? 'Manage active stores, verify pending documents, or register sellers manually.' 
                : 'Kelola toko aktif, verifikasi berkas, atau daftarkan penjual secara manual.'}
            </p>
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isEn ? 'Manual Register Seller' : 'Bantu Daftarkan Seller (Manual)'}</span>
          </button>
        </section>

        {/* PENGAJUAN VERIFIKASI SELLER BARU */}
        <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-800" />
              {isEn ? 'Pending Seller Verification' : 'Pengajuan Verifikasi Seller Baru'} ({pendingSellers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-6">{isEn ? 'Store Name' : 'Nama Toko'}</th>
                  <th className="py-3 px-6">{isEn ? 'Owner' : 'Pemilik'}</th>
                  <th className="py-3 px-6">NIK (KTP)</th>
                  <th className="py-3 px-6">{isEn ? 'Date' : 'Tanggal'}</th>
                  <th className="py-3 px-6 text-right">{isEn ? 'Action' : 'Aksi Verifikasi'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-medium">
                {pendingSellers.length > 0 ? (
                  pendingSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-neutral-50/50 transition">
                      <td className="py-4 px-6 font-bold text-neutral-900">{seller.name}</td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-neutral-800">{seller.owner}</p>
                        <p className="text-[10px] text-neutral-400">{seller.email}</p>
                      </td>
                      <td className="py-4 px-6 text-neutral-600 font-mono text-[11px]">{seller.nik}</td>
                      <td className="py-4 px-6 text-neutral-500">{seller.date}</td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleApprove(seller)}
                          className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Approve' : 'Setujui'}</span>
                        </button>
                        <button
                          onClick={() => handleReject(seller.id)}
                          className="inline-flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-neutral-200 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{isEn ? 'Reject' : 'Tolak'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-xs text-neutral-400 italic">
                      {isEn ? 'No pending seller verifications.' : 'Tidak ada pengajuan verifikasi baru.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* DAFTAR TOKO / SELLER AKTIF */}
        <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {isEn ? 'Active Stores / Sellers' : 'Daftar Toko / Seller Aktif'} ({activeSellers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">{isEn ? 'Store Name' : 'Nama Toko'}</th>
                  <th className="py-3 px-6">{isEn ? 'Owner & Contact' : 'Pemilik & Kontak'}</th>
                  <th className="py-3 px-6">NIK Verified</th>
                  <th className="py-3 px-6 text-right">{isEn ? 'Action' : 'Kelola Admin'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-medium">
                {activeSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-neutral-50/50 transition">
                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">{seller.id}</td>
                    <td className="py-4 px-6 font-bold text-neutral-900">{seller.name}</td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-neutral-800">{seller.owner}</p>
                      <p className="text-[10px] text-neutral-400">{seller.email}</p>
                    </td>
                    <td className="py-4 px-6 text-neutral-600 font-mono text-[11px]">{seller.nik}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteActive(seller.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition cursor-pointer"
                        title={isEn ? "Delete Store" : "Hapus Toko"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* MODAL REGISTRASI SELLER INLINE */}
      {isRegisterOpen && (
        <InlineRegisterSellerModal
          isEn={isEn}
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={(newSeller) => {
            setActiveSellers([...activeSellers, newSeller]);
            setIsRegisterOpen(false);
          }}
        />
      )}

    </div>
  );
}

{/* KOMPONEN MODAL SELLER VERCEL STYLE */}
function InlineRegisterSellerModal({ isEn, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', owner: '', email: '', nik: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.owner) return;
    onSuccess({
      id: `SLR-${Math.floor(Math.random() * 1000)}`,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl overflow-hidden shadow-2xl relative border border-neutral-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black p-1 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-4">
          <h2 className="text-base font-bold text-neutral-900">
            {isEn ? 'Register Seller Manually' : 'Daftarkan Seller Manual'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {isEn ? 'Store Name' : 'Nama Toko'}
              </label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition"
                placeholder="Contoh: Official Fashion Store"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {isEn ? 'Owner Name' : 'Nama Pemilik'}
              </label>
              <input 
                type="text" 
                required
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition"
                placeholder="Nama Lengkap KTP"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Email
              </label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition"
                placeholder="seller@gmail.com"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                NIK KTP
              </label>
              <input 
                type="text" 
                required
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-black transition font-mono"
                placeholder="16 Digit Nomor KTP"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer"
            >
              {isEn ? 'Save & Activate Seller' : 'Simpan & Aktifkan Seller'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}