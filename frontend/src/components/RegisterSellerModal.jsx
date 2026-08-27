import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function RegisterSellerModal({ isOpen, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    nik: '',
    ktpUrl: '',
    kkUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nik || formData.nik.length !== 16) {
      alert("NIK harus berisi 16 digit!");
      return;
    }
    
    onSubmitSuccess({
      id: Date.now(),
      ...formData,
      status: 'pending',
      submissionDate: new Date().toLocaleDateString('id-ID')
    });

    alert("Pengajuan berhasil! Mohon tunggu verifikasi dari Admin.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full rounded-3xl p-6 shadow-2xl border border-orange-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-black text-slate-800 mb-1">Formulir Pendaftaran Seller</h2>
        <p className="text-xs text-slate-500 mb-6">Lengkapi identitas resmi Anda untuk mulai berjualan di ShopeeModern.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Nama Toko</label>
              <input type="text" required value={formData.shopName} onChange={(e) => setFormData({...formData, shopName: e.target.value})} className="w-full mt-1 p-2.5 border rounded-xl text-xs" placeholder="Contoh: Toko Berkah" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Nama Pemilik (Sesuai KTP)</label>
              <input type="text" required value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} className="w-full mt-1 p-2.5 border rounded-xl text-xs" placeholder="Nama Lengkap" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600">Email Aktif</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full mt-1 p-2.5 border rounded-xl text-xs" placeholder="seller@gmail.com" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Nomor NIK (KTP)</label>
              <input type="number" required value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} className="w-full mt-1 p-2.5 border rounded-xl text-xs" placeholder="3201xxxxxxxxxxxx" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-dashed border-orange-200 p-3 rounded-xl text-center bg-orange-50/50">
              <Upload className="w-5 h-5 mx-auto text-orange-500 mb-1" />
              <p className="text-[11px] font-bold text-slate-700">Foto KTP</p>
              <input type="file" required onChange={() => setFormData({...formData, ktpUrl: 'ktp_validated.jpg'})} className="text-[10px] mt-1 text-slate-500" />
            </div>
            <div className="border-2 border-dashed border-orange-200 p-3 rounded-xl text-center bg-orange-50/50">
              <Upload className="w-5 h-5 mx-auto text-orange-500 mb-1" />
              <p className="text-[11px] font-bold text-slate-700">Foto Kartu Keluarga (KK)</p>
              <input type="file" required onChange={() => setFormData({...formData, kkUrl: 'kk_validated.jpg'})} className="text-[10px] mt-1 text-slate-500" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-500">Batal</button>
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-xs font-bold shadow-md">Kirim Pengajuan</button>
          </div>
        </form>
      </div>
    </div>
  );
}