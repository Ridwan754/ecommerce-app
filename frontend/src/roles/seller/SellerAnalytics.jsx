import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

export default function SellerAnalytics({ products = [] }) {
  // Contoh kalkulasi ringkas
  const totalProducts = products.length;
  const estimatedRevenue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) * 2; // Simulasi
  const totalOrders = Math.floor(totalProducts * 1.5);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Pendapatan (Estimasi)</p>
          <p className="text-lg font-black text-black font-mono mt-1">
            Rp {estimatedRevenue.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-black">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Pesanan</p>
          <p className="text-lg font-black text-black font-mono mt-1">
            {totalOrders} Transaksi
          </p>
        </div>
        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-black">
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Performa Toko</p>
          <p className="text-lg font-black text-emerald-600 font-mono mt-1 flex items-center gap-1">
            +14.5% <TrendingUp className="w-4 h-4" />
          </p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}