import { useMemo } from 'react';
import { X, Truck, Copy, CheckCircle2 } from 'lucide-react';

export default function TrackingModal({ isOpen, onClose, order }) {
  // Menggunakan useMemo agar generasi resi aman dari error impure function
  const trackingNumber = useMemo(() => {
    if (!order) return '';
    return order.resi || `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  }, [order]);

  if (!isOpen || !order) return null;

  const courierName = order.courierName || 'J&T Express (Standar)';

  const copyResi = () => {
    navigator.clipboard.writeText(trackingNumber);
    alert(`Nomor resi ${trackingNumber} berhasil disalin!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8 text-neutral-900 space-y-4">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Lacak Pengiriman Paket</span>
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Kurir & Resi */}
        <div className="bg-neutral-100 p-4 rounded-2xl flex justify-between items-center font-mono text-xs">
          <div>
            <p className="text-[10px] text-neutral-400 uppercase font-bold font-sans">Kurir Ekspedisi</p>
            <p className="font-bold text-neutral-800">{courierName}</p>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-bold font-sans">No. Resi</p>
              <p className="font-bold text-black">{trackingNumber}</p>
            </div>
            <button 
              onClick={copyResi}
              className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-600 transition cursor-pointer"
              title="Salin Resi"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Timeline Perjalanan */}
        <div className="space-y-3 pt-2">
          <p className="font-bold text-[11px] uppercase tracking-wider text-neutral-400">Riwayat Perjalanan Paket:</p>
          
          <div className="relative pl-6 space-y-4 border-l-2 border-neutral-200 text-xs">
            {order.status === 'completed' && (
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </span>
                <p className="font-bold text-emerald-600">Paket Telah Diterima</p>
                <p className="text-neutral-500 text-[11px]">Paket diserahkan ke penerima di lokasi tujuan.</p>
                <p className="text-[10px] text-neutral-400 font-mono mt-0.5">27 Aug 2026, 14:20 WIB</p>
              </div>
            )}

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></span>
              <p className="font-bold text-black">Kurir Membawa Paket Menuju Alamat Tujuan</p>
              <p className="text-neutral-500 text-[11px]">Kurir sedang mengantar paket ke alamat Anda.</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">27 Aug 2026, 08:15 WIB</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-neutral-400 border-2 border-white"></span>
              <p className="font-bold text-neutral-800">Tiba di Sorting Hub Jakarta Pusat</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">26 Aug 2026, 21:00 WIB</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-neutral-400 border-2 border-white"></span>
              <p className="font-bold text-neutral-800">Paket Diserahkan ke Ekspedisi</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">26 Aug 2026, 16:45 WIB</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}