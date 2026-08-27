import { useState } from 'react';
import { 
  X, PackageCheck, Truck, CheckCircle2, Star, 
  RotateCcw, Clock, ArrowLeftRight
} from 'lucide-react';

export default function OrderHistoryModal({ 
  isOpen, 
  onClose, 
  orders = [],
  onOpenTracking = () => {},
  onOpenReview = () => {},
  onConfirmReceived = () => {},
  onReturnRequest = () => {}
}) {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'dikemas') return order.status === 'paid' || order.status === 'processing';
    if (activeTab === 'dikirim') return order.status === 'shipped';
    if (activeTab === 'selesai') return order.status === 'completed';
    if (activeTab === 'pengembalian') return order.status === 'returned' || order.status === 'return_pending';
    return true;
  });

  const handleReturnAction = (orderId) => {
    const reason = prompt('Masukkan alasan pengembalian barang (misal: Barang rusak / tidak sesuai ukuran):');
    if (reason) {
      onReturnRequest(orderId, reason);
      alert('Pengajuan pengembalian barang berhasil dikirim!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-neutral-900">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-neutral-500" />
            <span>Pesanan Saya</span>
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB FILTRASI STATUS */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-neutral-100 mb-4 text-xs">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'dikemas', label: 'Dikemas' },
            { id: 'dikirim', label: 'Dikirim' },
            { id: 'selesai', label: 'Selesai & Penilaian' },
            { id: 'pengembalian', label: 'Pengembalian' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LIST PESANAN */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 divide-y divide-neutral-100">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-3">
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-[11px] font-bold text-neutral-400">ID: #{order.id}</p>
                    <p className="text-[10px] text-neutral-400">{order.date}</p>
                  </div>

                  {order.status === 'completed' && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                  )}
                  {order.status === 'shipped' && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Dalam Pengiriman
                    </span>
                  )}
                  {(order.status === 'paid' || order.status === 'processing') && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Dikemas Penjual
                    </span>
                  )}
                  {(order.status === 'returned' || order.status === 'return_pending') && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Pengajuan Pengembalian
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {(order.items || []).map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between text-xs bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-neutral-200" />
                        <div>
                          <p className="font-bold text-black">{item.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">1 Barang</p>
                        </div>
                      </div>
                      <p className="font-mono font-bold text-black">Rp {Number(item.price).toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                </div>

                {/* AKSI HANYA TAMPIL SESUAI KONDISI */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <span className="font-black text-xs text-black font-mono">
                    Total: Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {(order.status === 'shipped' || order.status === 'completed') && (
                      <button
                        onClick={() => onOpenTracking(order)}
                        className="px-3 py-1.5 border border-neutral-200 hover:border-black rounded-lg text-[11px] font-bold text-neutral-700 transition cursor-pointer flex items-center gap-1 bg-white"
                      >
                        <Truck className="w-3.5 h-3.5" /> Lacak Paket
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        onClick={() => onConfirmReceived(order.id)}
                        className="px-3 py-1.5 bg-black text-white rounded-lg text-[11px] font-bold hover:bg-neutral-800 transition cursor-pointer"
                      >
                        Pesanan Diterima
                      </button>
                    )}

                    {(order.status === 'shipped' || order.status === 'completed') && (
                      <button
                        onClick={() => handleReturnAction(order.id)}
                        className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" /> Ajukan Retur
                      </button>
                    )}

                    {order.status === 'completed' && (
                      <button
                        onClick={() => onOpenReview(order.items[0])}
                        className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-[11px] font-bold hover:bg-amber-500 transition cursor-pointer flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-black" /> Beri Penilaian
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400 italic">
              Tidak ada pesanan pada kategori ini.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}