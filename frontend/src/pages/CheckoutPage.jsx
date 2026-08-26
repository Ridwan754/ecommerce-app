import { useState } from 'react';
import { 
  MapPin, Truck, Tag, CreditCard, 
  Upload, ShieldCheck, CheckCircle2, ArrowLeft, Clock,
  Edit3, X, Navigation
} from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function CheckoutPage({ 
  cartItems = [], 
  onBackToShop = () => {},
  onOrderSuccess = () => {}
}) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [address, setAddress] = useState({
    name: 'Budi Santoso',
    phone: '081234567890',
    fullAddress: 'Jl. Sudirman No. 88, RT 03/RW 05, Menteng, Jakarta Pusat, DKI Jakarta',
    postalCode: '10310',
    lat: -6.1944,
    lng: 106.8229
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState({ ...address });

  const [selectedCourier, setSelectedCourier] = useState('standard');
  const courierOptions = {
    standard: { name: isEn ? 'Standard Delivery' : 'Pengiriman Standar', cost: 15000, estimateDays: '2 - 3 Hari' },
    express: { name: isEn ? 'Express Delivery' : 'Pengiriman Express', cost: 25000, estimateDays: '1 - 2 Hari' },
    sameday: { name: isEn ? 'Same Day Delivery' : 'Pengiriman Hari Yang Sama', cost: 40000, estimateDays: 'Tiba Hari Ini' }
  };

  const [voucherCode, setVoucherCode] = useState('');
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);

  const [paymentType, setPaymentType] = useState('gateway');
  const [transferProof, setTransferProof] = useState(null);

  const merchandiseSubtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const currentShippingCost = courierOptions[selectedCourier].cost;
  const grandTotal = merchandiseSubtotal + Math.max(0, currentShippingCost - shippingDiscount);

  const handleOpenEditModal = () => {
    setTempAddress({ ...address });
    setIsEditModalOpen(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setAddress({ ...tempAddress });
    setIsEditModalOpen(false);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTempAddress(prev => ({
            ...prev,
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6))
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(isEn ? "Failed to get GPS location." : "Gagal mengambil lokasi GPS. Pastikan izin lokasi aktif.");
        }
      );
    }
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim().toUpperCase() === 'ONGKIRFREE') {
      setShippingDiscount(currentShippingCost);
      setIsVoucherApplied(true);
      alert(isEn ? "Free Shipping Voucher Applied!" : "Voucher Gratis Ongkir Berhasil Dipasang!");
    } else {
      alert(isEn ? "Invalid Voucher Code! Try: ONGKIRFREE" : "Kode voucher tidak valid! Coba: ONGKIRFREE");
    }
  };

  // Handler Proses Pesanan dengan Konfirmasi / Alert Sukses
  const handleProcessOrder = () => {
    if (cartItems.length === 0) {
      return alert(isEn ? "Your cart is empty!" : "Keranjang Anda kosong!");
    }
    
    if (paymentType === 'transfer_manual' && !transferProof) {
      return alert(isEn ? "Please upload payment receipt first!" : "Harap unggah bukti transfer penjual terlebih dahulu!");
    }

    // Pesan Notifikasi Sukses Pembuatan Pesanan
    if (paymentType === 'gateway') {
      alert(isEn ? "Redirecting to Midtrans Payment Gateway... Order created successfully!" : "Mengarahkan ke Payment Gateway (Midtrans)... Pesanan berhasil dibuat!");
    } else if (paymentType === 'cod') {
      alert(isEn ? "COD Order Placed Successfully! Payment upon delivery." : "Pesanan COD Berhasil Dibuat! Pembayaran dilakukan saat barang sampai.");
    } else {
      alert(isEn ? "Payment Receipt Uploaded! Order pending seller verification." : "Bukti Transfer Terkirim! Pesanan akan diverifikasi oleh Penjual.");
    }

    // Panggil callback setelah user menekan OK pada alert
    onOrderSuccess();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased pb-20">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToShop} 
              className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-100 transition text-neutral-600 hover:text-black cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black text-white font-black flex items-center justify-center text-xs rounded-lg">
                ▲
              </div>
              <h1 className="text-sm font-black tracking-widest uppercase text-black">
                {isEn ? 'Checkout' : 'Pembayaran (Checkout)'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'ENCRYPTED CHECKOUT' : 'TRANSAKSI AMAN & TERENKRIPSI'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-6">

        {/* 1. ALAMAT PENGIRIMAN */}
        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span>{isEn ? 'Shipping Address' : 'Alamat Pengiriman Pembeli'}</span>
            </div>
            <button 
              onClick={handleOpenEditModal}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-black px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Edit Address' : 'Ubah Alamat'}</span>
            </button>
          </div>

          <div className="text-xs space-y-1 text-neutral-600">
            <p className="font-bold text-black text-sm">{address.name} ({address.phone})</p>
            <p>{address.fullAddress}</p>
            <p className="text-neutral-400 font-mono">{isEn ? 'Postal Code' : 'Kode Pos'}: {address.postalCode}</p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-neutral-100 text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-neutral-500" />
              <span>Titik Maps: {address.lat}, {address.lng}</span>
            </div>
            <a 
              href={`https://www.google.com/maps?q=${address.lat},${address.lng}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-black hover:underline font-bold"
            >
              {isEn ? 'Open in Google Maps' : 'Lihat di Google Maps'} &rarr;
            </a>
          </div>
        </section>

        {/* 2. RINCIAN ITEM */}
        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-4">
            {isEn ? 'Order Items' : 'Produk Yang Dipesan'} ({cartItems.length})
          </h3>
          
          <div className="divide-y divide-neutral-100">
            {cartItems.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-neutral-200 bg-neutral-100" />
                  <div>
                    <p className="font-bold text-black">{item.name}</p>
                    <p className="text-neutral-400 text-[10px] uppercase font-mono">{item.category || (isEn ? 'General' : 'Umum')}</p>
                  </div>
                </div>
                <p className="font-black text-black font-mono">Rp {Number(item.price).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. OPSI PENGIRIMAN */}
        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider">
            <Truck className="w-4 h-4 text-neutral-500" />
            <span>{isEn ? 'Shipping Options' : 'Opsi Pengiriman'}</span>
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
                  className={`p-4 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected ? 'border-black bg-neutral-100 font-bold' : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <p className="font-bold text-black">{courier.name}</p>
                  <p className="text-black font-black font-mono mt-1">Rp {courier.cost.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-neutral-400" /> {courier.estimateDays}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. KODE VOUCHER */}
        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-black text-xs font-bold uppercase tracking-wider w-full md:w-auto">
            <Tag className="w-4 h-4 text-neutral-500" />
            <span>{isEn ? 'Voucher Code' : 'Voucher Diskon'}</span>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder={isEn ? "E.G. ONGKIRFREE" : "CTH: ONGKIRFREE"}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="px-4 py-2 bg-neutral-50 border border-neutral-200 text-xs rounded-xl focus:outline-none focus:border-black uppercase font-mono flex-1 text-black"
            />
            <button
              onClick={handleApplyVoucher}
              className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
            >
              {isEn ? 'Apply' : 'Gunakan'}
            </button>
          </div>
        </section>

        {/* 5. METODE PEMBAYARAN */}
        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider border-b border-neutral-100 pb-4">
            <CreditCard className="w-4 h-4 text-neutral-500" />
            <span>{isEn ? 'Payment Method' : 'Pilih Metode Pembayaran'}</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:border-neutral-400 bg-neutral-50/50 transition">
              <input
                type="radio"
                name="payment"
                value="gateway"
                checked={paymentType === 'gateway'}
                onChange={() => setPaymentType('gateway')}
                className="mt-1 accent-black"
              />
              <div className="text-xs">
                <p className="font-bold text-black">Payment Gateway (Midtrans Otomatis)</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">QRIS, Virtual Account Bank, E-Wallet (Verifikasi Otomatis)</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:border-neutral-400 bg-neutral-50/50 transition">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentType === 'cod'}
                onChange={() => setPaymentType('cod')}
                className="mt-1 accent-black"
              />
              <div className="text-xs">
                <p className="font-bold text-black">Manual: COD (Bayar di Tempat)</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">Bayar tunai langsung ke kurir saat pesanan sampai di alamat tujuan.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:border-neutral-400 bg-neutral-50/50 transition">
              <input
                type="radio"
                name="payment"
                value="transfer_manual"
                checked={paymentType === 'transfer_manual'}
                onChange={() => setPaymentType('transfer_manual')}
                className="mt-1 accent-black"
              />
              <div className="text-xs flex-1">
                <p className="font-bold text-black">Manual: Transfer Rekening Penjual</p>
                <p className="text-neutral-500 text-[11px] mt-0.5">BCA: 8830192381 (a.n Penjual Storefront)</p>
              </div>
            </label>

            {paymentType === 'transfer_manual' && (
              <div className="ml-7 p-4 bg-neutral-100 border border-neutral-200 rounded-xl space-y-3">
                <p className="text-xs font-bold text-neutral-700">{isEn ? 'Upload Transfer Receipt:' : 'Unggah Bukti Transfer Penjual:'}</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    <span>{isEn ? 'Select File' : 'Pilih Bukti Transfer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setTransferProof(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {transferProof && (
                    <span className="text-xs text-neutral-600 font-mono truncate max-w-[200px]">
                      {transferProof.name}
                    </span>
                  )}
                </div>

                {transferProof && (
                  <p className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {isEn ? 'File uploaded successfully' : 'Bukti transfer berhasil terunggah'}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 6. RINCIAN BIAYA & TOMBOL PROSES */}
        <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-3">
            {isEn ? 'Payment Details' : 'Rincian Tagihan'}
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-neutral-500">
              <span>{isEn ? `Subtotal (${cartItems.length} items)` : `Subtotal Produk (${cartItems.length} barang)`}</span>
              <span>Rp {merchandiseSubtotal.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-neutral-500">
              <span>{isEn ? `Shipping Cost (${courierOptions[selectedCourier].name})` : `Ongkos Kirim (${courierOptions[selectedCourier].name})`}</span>
              <span>Rp {currentShippingCost.toLocaleString('id-ID')}</span>
            </div>

            {shippingDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{isEn ? 'Shipping Discount' : 'Potongan Diskon Ongkir'}</span>
                <span>- Rp {shippingDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-black border-t border-neutral-100 pt-3">
              <span>{isEn ? 'Total Payment' : 'Total Pembayaran'}</span>
              <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            onClick={handleProcessOrder}
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition mt-4 cursor-pointer shadow-md"
          >
            {isEn ? 'Complete Purchase' : 'Buat Pesanan Sekarang'}
          </button>
        </section>

      </main>

      {/* MODAL EDIT ALAMAT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8 text-neutral-900">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-black">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>{isEn ? 'Update Shipping Address' : 'Ubah Alamat Pengiriman'}</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-400 hover:text-black p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-600 mb-1">{isEn ? 'Full Name' : 'Nama Penerima'}</label>
                  <input
                    type="text"
                    required
                    value={tempAddress.name}
                    onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-600 mb-1">{isEn ? 'Phone Number' : 'No. Telepon'}</label>
                  <input
                    type="text"
                    required
                    value={tempAddress.phone}
                    onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-600 mb-1">{isEn ? 'Full Address' : 'Alamat Lengkap'}</label>
                <textarea
                  rows="3"
                  required
                  value={tempAddress.fullAddress}
                  onChange={(e) => setTempAddress({ ...tempAddress, fullAddress: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 mb-1">{isEn ? 'Postal Code' : 'Kode Pos'}</label>
                <input
                  type="text"
                  required
                  value={tempAddress.postalCode}
                  onChange={(e) => setTempAddress({ ...tempAddress, postalCode: e.target.value })}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-mono text-black"
                />
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-neutral-500" />
                    <span>{isEn ? 'Coordinates (GPS)' : 'Titik Lokasi (GPS)'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-black font-mono px-2.5 py-1 rounded-lg border border-neutral-200 cursor-pointer"
                  >
                    {isEn ? 'Locate Me' : 'Gunakan Lokasi Saya'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-0.5 font-mono">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={tempAddress.lat}
                      onChange={(e) => setTempAddress({ ...tempAddress, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-mono text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-400 mb-0.5 font-mono">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={tempAddress.lng}
                      onChange={(e) => setTempAddress({ ...tempAddress, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black font-mono text-black"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-full font-semibold hover:bg-neutral-100 hover:text-black cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Batal'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-full font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  {isEn ? 'Save Address' : 'Simpan Alamat'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}