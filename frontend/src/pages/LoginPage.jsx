import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Store, ShoppingBag } from 'lucide-react';
import RegisterSellerModal from '../components/RegisterSellerModal';

export default function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('customer@shopee.com');
  const [password, setPassword] = useState('123456');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans">
      
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white py-4 px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-xl text-orange-600 shadow-sm">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight">Sopi'i<span className="text-amber-200"></span></span>
          </div>
          <span className="text-sm font-medium opacity-90">Bantuan & Layanan</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-orange-100">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Selamat Datang!</h2>
            <p className="text-xs text-slate-400 mt-1">Silakan pilih jenis akses akun Anda</p>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setSelectedRole('customer'); setEmail('customer@shopee.com'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${selectedRole === 'customer' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600'}`}
            >
              <ShoppingBag className="w-4 h-4" /> Pembeli
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('seller'); setEmail('seller@shopee.com'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${selectedRole === 'seller' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600'}`}
            >
              <Store className="w-4 h-4" /> Penjual
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setEmail('admin@shopee.com'); }}
              className={`py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${selectedRole === 'admin' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-600'}`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600">Email Akun ({selectedRole.toUpperCase()})</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-orange-500 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Kata Sandi</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-orange-500 transition"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:opacity-95 transition"
            >
              LOG IN SEBAGAI {selectedRole.toUpperCase()}
            </button>
          </form>

          {/* Tombol Pendaftaran Seller Mandiri */}
          {selectedRole === 'seller' && (
            <div className="mt-4 text-center border-t pt-4">
              <p className="text-xs text-slate-500">Belum punya toko terdaftar?</p>
              <button 
                type="button" 
                onClick={() => setIsRegisterOpen(true)}
                className="text-xs font-bold text-orange-600 hover:underline mt-1"
              >
                Daftar Jadi Seller Sekarang (Wajib NIK/KTP/KK)
              </button>
            </div>
          )}

        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400 border-t bg-white">
        © 2026 Sopi'i E-Commerce Marketplace System
      </footer>

      {/* MODAL PENDAFTARAN SELLER */}
      <RegisterSellerModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSubmitSuccess={(data) => console.log('Pengajuan disubmit:', data)} 
      />

    </div>
  );
}