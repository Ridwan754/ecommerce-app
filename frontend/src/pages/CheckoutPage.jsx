import { useState } from 'react';
import { 
  MapPin, Truck, Tag, CreditCard, ShoppingBag, 
  Upload, ShieldCheck, CheckCircle2, ArrowLeft, Clock 
} from 'lucide-react';

export default function CheckoutPage({ 
  cartItems = [], 
  onBackToShop = () => {},
  onOrderSuccess = () => {}
}) {
  // 1. Data Alamat Pembeli
  const [address] = useState({
    name: 'Budi Santoso',
    phone: '081234567890',
    fullAddress: 'Jl. Sudirman No. 88, RT 03/RW 05, Menteng, Jakarta Pusat, DKI Jakarta',
    postalCode: '10310'
  });

  // 2. State Opsi Pengiriman Manual (Standard, Express, Same Day)
  const [selectedCourier, setSelectedCourier] = useState('standard');
  
  const courierOptions = {
    standard: { name: 'Reguler (Manual)', cost: 15000, estimateDays: '2 - 3 Hari' },
    express: { name: 'Express (Manual)', cost: 25000, estimateDays: '1 - 2 Hari' },
    sameday: { name: 'Same Day (Manual)', cost: 40000, estimateDays: 'Tiba Hari Ini' }
  };

  // 3. State Voucher & Potongan Ongkir
  const [voucherCode, setVoucherCode] = useState('');
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);

  // 4. State Metode Pembayaran (Payment Gateway vs Manual)
  const [paymentType, setPaymentType] = useState('gateway'); // 'gateway' | 'cod' | 'transfer_manual'
  const [transferProof, setTransferProof] = useState(null);

  // Perhitungan Subtotal, Ongkir, dan Total
  const merchandiseSubtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const currentShippingCost = courierOptions[selectedCourier].cost;
  const grandTotal = merchandiseSubtotal + Math.max(0, currentShippingCost - shippingDiscount);

  // Handler Klaim Voucher Gratis Ongkir
  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === 'ONGKIRFREE') {
      setShippingDiscount(currentShippingCost); // Gratis ongkir 100%
      setIsVoucherApplied(true);
      alert("Voucher Gratis Ongkir Berhasil Dipasang!");
    } else {
      alert("Kode voucher tidak valid! Coba gunakan: ONGKIRFREE");
    }
  };

  // Handler Buat Pesanan
  const handleProcessOrder = () => {
    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }

    if (paymentType === 'transfer_manual' && !transferProof) {
      alert("Harap unggah bukti transfer penjual terlebih dahulu!");
      return;
    }

    if (paymentType === 'gateway') {
      alert("Mengarahkan ke Pop-up Payment Gateway (Midtrans Snap)...");
    } else if (paymentType === 'cod') {
      alert("Pesanan COD berhasil dibuat! Pembayaran dilakukan saat barang sampai.");
    } else {
      alert("Bukti transfer terkirim! Pesanan akan diverifikasi oleh Penjual.");
    }

    onOrderSuccess();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans pb-16">
      
      {/* HEADER CHECKOUT SHOPEE */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={onBackToShop} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-[#ee4d2d]" />
              <h1 className="text-xl font-black text-[#ee4d2d]">Checkout</h1>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">Transaksi Aman & Terenkripsi</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-4">

        {/* 1. ALAMAT PENGIRIMAN PEMBELI */}
        <div className="bg-white p-5 rounded-sm border-t-4 border-t-[#ee4d2d] shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#ee4d2d] font-bold text-sm">
            <MapPin className="w-4 h-4" />
            <span>Alamat Pengiriman Pembeli</span>
          </div>
          <div className="text-xs text-slate-700 pl-6 space-y-1">
            <p className="font-extrabold text-slate-900">{address.name} ({address.phone})</p>
            <p>{address.fullAddress}, {address.postalCode}</p>
          </div>
        </div>

        {/* 2. RINCIAN PRODUK DIBELI */}
        <div className="bg-white p-5 rounded-sm shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 mb-3">Produk Yang Dipesan</h3>
          <div className="space-y-3">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-12 h-12 object-cover rounded-sm border" />
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-slate-400 text-[10px]">Kategori: {item.category || 'Umum'}</p>
                  </div>
                </div>
                <p className="font-extrabold text-slate-800">Rp {Number(item.price).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. JASA PENGIRIMAN MANUAL (ESTIMASI WAKTU & TIBA) */}
        <div className="bg-white p-5 rounded-sm shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#ee4d2d] font-bold text-sm">
            <Truck className="w-4 h-4" />
            <span>Opsi Pengiriman Manual</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.keys(courierOptions).map((key) => {
              const courier = courierOptions[key];
              const isSelected = selectedCourier === key;
              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedCourier(key);
                    if (isVoucherApplied) setShippingDiscount(courier.cost);
                  }}
                  className={`p-3 border rounded-sm cursor-pointer transition text-xs ${
                    isSelected ? 'border-[#ee4d2d] bg-orange-50/40' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-800">{courier.name}</p>
                  <p className="text-[#ee4d2d] font-extrabold mt-1">Rp {courier.cost.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Estimasi Tiba: {courier.estimateDays}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. VOUCHER GRATIS ONGKIR */}
        <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-slate-800 text-xs font-bold w-full md:w-auto">
            <Tag className="w-4 h-4 text-[#ee4d2d]" />
            <span>Voucher Sopi'i (Gratis Ongkir)</span>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Masukkan kode (Cth: ONGKIRFREE)"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 text-xs rounded-sm focus:outline-[#ee4d2d] uppercase flex-1"
            />
            <button
              onClick={handleApplyVoucher}
              className="bg-[#ee4d2d] text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-[#d73211] transition"
            >
              Gunakan
            </button>
          </div>
        </div>

        {/* 5. METODE PEMBAYARAN (MANUAL & PAYMENT GATEWAY) */}
        <div className="bg-white p-5 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#ee4d2d] font-bold text-sm border-b pb-3">
            <CreditCard className="w-4 h-4" />
            <span>Pilih Metode Pembayaran</span>
          </div>

          <div className="space-y-3">
            {/* OPSI 1: Payment Gateway */}
            <label className="flex items-start gap-3 p-3 border rounded-sm cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="payment"
                value="gateway"
                checked={paymentType === 'gateway'}
                onChange={() => setPaymentType('gateway')}
                className="mt-1 accent-[#ee4d2d]"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Payment Gateway (Otomatis)</p>
                <p className="text-slate-500 text-[11px]">QRIS, Virtual Account Bank, E-Wallet (Midtrans Automatic Verification)</p>
              </div>
            </label>

            {/* OPSI 2: Manual COD */}
            <label className="flex items-start gap-3 p-3 border rounded-sm cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentType === 'cod'}
                onChange={() => setPaymentType('cod')}
                className="mt-1 accent-[#ee4d2d]"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Manual: COD (Bayar di Tempat)</p>
                <p className="text-slate-500 text-[11px]">Bayar tunai langsung ke kurir saat pesanan sampai di alamat tujuan.</p>
              </div>
            </label>

            {/* OPSI 3: Manual Transfer & Upload Bukti */}
            <label className="flex items-start gap-3 p-3 border rounded-sm cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="payment"
                value="transfer_manual"
                checked={paymentType === 'transfer_manual'}
                onChange={() => setPaymentType('transfer_manual')}
                className="mt-1 accent-[#ee4d2d]"
              />
              <div className="text-xs flex-1">
                <p className="font-bold text-slate-800">Manual: Transfer Rekening Penjual</p>
                <p className="text-slate-500 text-[11px]">BCA: 8830192381 (a.n Penjual Storefront)</p>
              </div>
            </label>

            {/* AREA UPLOAD BUKTI TRANSFER UNTUK PEMBAYARAN MANUAL */}
            {paymentType === 'transfer_manual' && (
              <div className="ml-7 p-4 bg-orange-50/50 border border-dashed border-orange-200 rounded-sm space-y-2">
                <p className="text-xs font-bold text-slate-700">Unggah Bukti Transfer Penjual:</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTransferProof(e.target.files[0])}
                  className="text-xs text-slate-500"
                />
                {transferProof && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File terunggah: {transferProof.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 6. TABEL RINCIAN BIAYA TRANSPARAN */}
        <div className="bg-white p-5 rounded-sm shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Rincian Tagihan</h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Produk ({cartItems.length} barang)</span>
              <span>Rp {merchandiseSubtotal.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Subtotal Pengiriman ({courierOptions[selectedCourier].name})</span>
              <span>Rp {currentShippingCost.toLocaleString('id-ID')}</span>
            </div>

            {shippingDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Diskon Potongan Ongkir</span>
                <span>- Rp {shippingDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-[#ee4d2d] border-t pt-3">
              <span>Total Pembayaran</span>
              <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            onClick={handleProcessOrder}
            className="w-full py-3.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black text-sm rounded-sm shadow-md transition mt-4 uppercase tracking-wider"
          >
            Buat Pesanan Sekarang
          </button>
        </div>

      </main>

    </div>
  );
}