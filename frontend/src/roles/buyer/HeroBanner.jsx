import { useState } from 'react';
import { Tag, ChevronRight, TicketCheck, Copy } from 'lucide-react';

export default function HeroBanner() {
  const [copied, setCopied] = useState(false);
  const voucherCode = "GAJIAN50";

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-10 shadow-lg">
      <div className="relative z-10 max-w-xl space-y-4">
        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" /> Promo Gajian Spektakuler
        </span>
        
        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
          Diskon Hingga <span className="text-yellow-300">50%</span> + Gratis Ongkir!
        </h1>
        
        <p className="text-blue-100 text-xs md:text-sm">
          Gunakan kode voucher saat checkout untuk klaim potongan harga spesial hari ini.
        </p>

        {/* Kotak Voucher Promo */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl">
            <TicketCheck className="w-4 h-4 text-yellow-300" />
            <span className="text-xs font-mono font-bold tracking-wider">{voucherCode}</span>
            <button 
              onClick={handleCopyVoucher}
              className="ml-2 p-1 hover:bg-white/20 rounded-lg transition"
              title="Salin Kode"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <button className="bg-white text-blue-600 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-md flex items-center gap-1.5">
            {copied ? '✓ Kode Disalin!' : 'Klaim Promo'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
    </section>
  );
}