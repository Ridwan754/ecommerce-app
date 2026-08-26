import { useState } from 'react';
import { 
  MapPin, Truck, Tag, CreditCard, ShoppingBag, 
  Upload, ShieldCheck, CheckCircle2, ArrowLeft, Clock,
  Edit3, X, Navigation
} from 'lucide-react';

export default function CheckoutPage({ 
  cartItems = [], 
  onBackToShop = () => {},
  onOrderSuccess = () => {}
}) {
  // 1. Data Alamat Pembeli dengan Titik Maps (Latitude & Longitude)
  const [address, setAddress] = useState({
    name: 'Budi Santoso',
    phone: '081234567890',
    fullAddress: 'Jl. Sudirman No. 88, RT 03/RW 05, Menteng, Jakarta Pusat, DKI Jakarta',
    postalCode: '10310',
    lat: -6.1944,
    lng: 106.8229
  });

  // State Modal Ubah Alamat
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState({ ...address });

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

  // Handler Buka Modal Edit Alamat
  const handleOpenEditModal = () => {
    setTempAddress({ ...address });
    setIsEditModalOpen(true);
  };

  // Handler Simpan Alamat Baru
  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddress({ ...tempAddress });
    setIsEditModalOpen(false);
    alert("Alamat pengiriman dan titik lokasi maps berhasil diperbarui!");
  };

  // Handler Ambil Lokasi Saat Ini (Geolocation Browser)
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTempAddress(prev => ({
            ...prev,
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6))
          }));
          alert("Berhasil mendapatkan koordinat lokasi Anda saat ini!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Gagal mengambil lokasi GPS. Pastikan izin lokasi/GPS aktif.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung Geolocation.");
    }
  };

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
      
      {/* HEADER CHECKOUT */}
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
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Transaksi Aman & Terenkripsi</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-4">

        {/* 1. ALAMAT PENGIRIMAN PEMBELI + TAMPILAN TITIK MAPS */}
        <div className="bg-white p-5 rounded-sm border-t-4 border-t-[#ee4d2d] shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#ee4d2d] font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Alamat Pengiriman Pembeli</span>
            </div>
            <button 
              onClick={handleOpenEditModal}
              className="flex items-center gap-1 text-xs text-[#ee4d2d] font-bold border border-[#ee4d2d] px-2.5 py-1 rounded-sm hover:bg-orange-50 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Alamat</span>
            </button>
          </div>

          <div className="text-xs text-slate-700 pl-6 space-y-1">
            <p className="font-extrabold text-slate-900">{address.name} ({address.phone})</p>
            <p>{address.fullAddress}</p>
            <p className="text-slate-500">Kode Pos: <span className="font-semibold text-slate-800">{address.postalCode}</span></p>
            
            {/* Display Titik Maps */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Navigation className="w-3.5 h-3.5 text-[#ee4d2d]" />
                <span className="font-medium">Titik Maps: {address.lat}, {address.lng}</span>
              </div>
              <a 
                href={`https://www.google.com/maps?q=${address.lat},${address.lng}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Lihat di Google Maps &rarr;
              </a>
            </div>
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

        {/* 3. JASA PENGIRIMAN MANUAL */}
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

        {/* 5. METODE PEMBAYARAN */}
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

            {/* AREA UPLOAD BUKTI TRANSFER */}
            {paymentType === 'transfer_manual' && (
              <div className="ml-7 p-4 bg-orange-50/50 border border-dashed border-orange-200 rounded-sm space-y-3">
                <p className="text-xs font-bold text-slate-700">Unggah Bukti Transfer Penjual:</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>Pilih & Upload Bukti</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTransferProof(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {transferProof && (
                    <span className="text-xs text-slate-600 truncate max-w-[200px]">
                      {transferProof.name}
                    </span>
                  )}
                </div>

                {transferProof && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> File terunggah: {transferProof.name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 6. TABEL RINCIAN BIAYA */}
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

      {/* MODAL EDIT ALAMAT & TITIK MAPS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-md max-w-lg w-full p-6 shadow-xl relative my-8">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ee4d2d]" />
                <span>Ubah Alamat Pengiriman</span>
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              
              {/* Nama & Telepon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    required
                    value={tempAddress.name}
                    onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-sm focus:outline-[#ee4d2d]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. Telepon</label>
                  <input
                    type="text"
                    required
                    value={tempAddress.phone}
                    onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-sm focus:outline-[#ee4d2d]"
                  />
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows="3"
                  required
                  value={tempAddress.fullAddress}
                  onChange={(e) => setTempAddress({ ...tempAddress, fullAddress: e.target.value })}
                  placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  className="w-full p-2 border border-slate-300 rounded-sm focus:outline-[#ee4d2d]"
                />
              </div>

              {/* Kode Pos */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                <input
                  type="text"
                  required
                  value={tempAddress.postalCode}
                  onChange={(e) => setTempAddress({ ...tempAddress, postalCode: e.target.value })}
                  placeholder="Contoh: 10310"
                  className="w-full p-2 border border-slate-300 rounded-sm focus:outline-[#ee4d2d]"
                />
              </div>

              {/* PENGATURAN TITIK MAPS */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-[#ee4d2d]" />
                    <span>Titik Lokasi Maps (Koordinat GPS)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1 rounded-sm border"
                  >
                    Gunakan Lokasi Saya
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={tempAddress.lat}
                      onChange={(e) => setTempAddress({ ...tempAddress, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border border-slate-300 rounded-sm focus:outline-[#ee4d2d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={tempAddress.lng}
                      onChange={(e) => setTempAddress({ ...tempAddress, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 border border-slate-300 rounded-sm focus:outline-[#ee4d2d]"
                    />
                  </div>
                </div>

                {/* Live Preview Google Maps Embed */}
                <div className="mt-2 border rounded-sm overflow-hidden h-40 bg-slate-100">
                  <iframe
                    title="Alamat Maps Preview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://maps.google.com/maps?q=${tempAddress.lat},${tempAddress.lng}&z=15&output=embed`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-sm font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ee4d2d] text-white rounded-sm font-bold hover:bg-[#d73211]"
                >
                  Simpan Alamat
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}