import { useState } from 'react';
import { Search, ShoppingBag, X, Globe, User, MessageSquare, Clock, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import CartModal from './CartModal';
import CheckoutPage from '../../pages/CheckoutPage';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/AuthContext';
import ChatBox from "../../components/ChatBox";
import ToastNotification from '../../components/ToastNotification';
import OrderHistoryModal from './OrderHistoryModal';
import TrackingModal from './TrackingModal';
import ReviewModal from './ReviewModal';
import PromoBannerSlider from './PromoBannerSlider';

export default function BuyerDashboard({ 
  products = [], 
  cartItems = [], 
  setCartItems = () => {}, 
  isCartOpen = false,        
  setIsCartOpen = () => {}   
}) {
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();
  const isEn = lang === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentView, setCurrentView] = useState('katalog');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState('Official Store');

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReviewProduct, setSelectedReviewProduct] = useState(null);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-8921',
      date: '26 Aug 2026',
      status: 'shipped',
      totalAmount: 250000,
      resi: 'JP9823719283',
      courierName: 'J&T Express (Standar)',
      items: [
        { id: 101, name: 'Sepatu Lari Sporty Pro', price: 250000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' }
      ]
    }
  ]);

  const categories = [
    { key: 'all', label: isEn ? 'All' : 'Semua' },
    { key: 'sepatu', label: isEn ? 'Shoes' : 'Sepatu' },
    { key: 'pakaian', label: isEn ? 'Shirts' : 'Pakaian' },
    { key: 'gadget', label: 'Gadget' },
    { key: 'aksesoris', label: isEn ? 'Accessories' : 'Aksesoris' },
  ];

  const handleAddToCart = (item) => {
    const stockAvailable = item.stock !== undefined ? item.stock : 1;

    if (stockAvailable <= 0) {
      alert(isEn ? 'Sorry, this product is out of stock!' : 'Maaf, stok barang ini sudah habis!');
      return;
    }

    setCartItems([...cartItems, item]);
    setToastMessage(isEn ? 'Product added to cart!' : 'Produk berhasil ditambahkan ke keranjang!');
    setIsToastOpen(true);
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleOpenTracking = (order) => {
    setSelectedTrackingOrder(order);
    setIsTrackingOpen(true);
  };

  const handleOpenReview = (product) => {
    setSelectedReviewProduct(product);
    setIsReviewOpen(true);
  };

  const handleConfirmReceived = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
    setToastMessage(isEn ? 'Order completed!' : 'Pesanan selesai!');
    setIsToastOpen(true);
  };

  const handleReturnRequest = (orderId, reason) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'returned', returnReason: reason } : o));
    setToastMessage(isEn ? 'Return request submitted!' : 'Pengajuan retur berhasil dikirim!');
    setIsToastOpen(true);
  };

  const filteredProducts = (products || []).filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (currentView === 'checkout') {
    return (
      <CheckoutPage 
        cartItems={cartItems}
        onBackToShop={() => setCurrentView('katalog')}
        onOrderSuccess={() => {
          const newOrder = {
            id: `ORD-${Date.now()}`,
            date: 'Hari Ini',
            status: 'paid',
            totalAmount: cartItems.reduce((acc, i) => acc + (Number(i.price) || 0), 0),
            items: [...cartItems]
          };
          setOrders([newOrder, ...orders]);
          setCartItems([]);
          setCurrentView('katalog');
          setToastMessage(isEn ? 'Order placed successfully!' : 'Pesanan berhasil dibuat!');
          setIsToastOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans antialiased -m-6 pb-20">
      
      {/* HEADER VERCEL LIGHT MODE */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setCurrentView('katalog')}
              className="flex items-center gap-2 font-bold tracking-tight text-sm uppercase cursor-pointer text-black"
            >
              <div className="w-5 h-5 bg-black text-white flex items-center justify-center rounded text-[10px] font-black">
                ▲
              </div>
              <span>SOPI'I</span>
            </button>

            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-neutral-500">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`transition hover:text-black cursor-pointer ${
                    selectedCategory === cat.key ? 'text-black font-semibold' : ''
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-xs relative hidden sm:block">
            <input 
              type="text" 
              placeholder={isEn ? "Search..." : "Cari produk..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 text-xs px-3 py-1.5 pr-8 rounded-md border border-neutral-200 focus:border-neutral-400 outline-none transition text-black font-mono placeholder:text-neutral-400"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="p-1.5 text-neutral-500 hover:text-black transition cursor-pointer"
              title={isEn ? "My Orders" : "Pesanan Saya"}
            >
              <Clock className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-md px-2.5 py-1">
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <div className="text-left text-[11px] leading-none">
                <span className="font-semibold text-neutral-800 block truncate max-w-[80px]">
                  {user?.name || 'User'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-mono text-neutral-500">
              <Globe className="w-3.5 h-3.5" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-black font-semibold cursor-pointer outline-none"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
              </select>
            </div>

            <button 
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-neutral-500 hover:text-black transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <LogoutButton className="text-xs font-medium px-2.5 py-1 rounded border border-neutral-200 hover:border-black transition cursor-pointer" />
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-10">
        
        {/* HERO SECTION SLIDER & SIDE WIDGET */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          <div className="lg:col-span-2">
            <PromoBannerSlider />
          </div>

          {/* SIDE WIDGET VERCEL LIGHT MONOCHROME */}
          {/* SIDE WIDGET PROMO VERCEL LIGHT MODE */}
            <div className="hidden lg:flex flex-col justify-between bg-white p-6 rounded-2xl border border-neutral-200 text-black font-sans shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase border border-neutral-200 px-2 py-0.5 rounded bg-neutral-100">
                    MOBILE APP
                  </span>
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-black">
                  SOPI'I CLI & APP
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Gunakan kode voucher di bawah untuk mendapatkan potongan langsung Rp 20.000 pada checkout pertama.
                </p>
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between mt-6">
                <div>
                  <p className="text-[9px] font-mono uppercase text-neutral-500 tracking-wider">KODE VOUCHER</p>
                  <p className="font-mono font-bold text-sm text-black">SOPIIAPP</p>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("SOPIIAPP");
                    setCopiedVoucher(true);
                    setToastMessage("Voucher SOPIIAPP berhasil disalin!");
                    setIsToastOpen(true);
                    setTimeout(() => setCopiedVoucher(false), 2000);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white font-mono text-xs px-3 py-1.5 rounded-md border border-black transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedVoucher ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  <span>{copiedVoucher ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

        </section>

        {/* CATALOG GRID VERCEL LIGHT STYLE */}
        <section className="space-y-4 pt-4 border-t border-neutral-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-mono tracking-wider text-neutral-500 uppercase">
              {isEn ? '// PRODUCTS' : '// KATALOG PRODUK'}
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              {filteredProducts.length} ITEMS
            </span>
          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((prod) => {
                    const currentStock = prod.stock !== undefined ? prod.stock : 1;
                    const isLowStock = currentStock > 0 && currentStock <= 2;
                    const isOutOfStock = currentStock <= 0;

                    // Simulasi jumlah terjual agar tampil dinamis (jika belum ada data sold di database)
                    const totalSold = prod.sold !== undefined ? prod.sold : (prod.id % 50 + 12);

                    return (
                      <div 
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className="group bg-white border border-neutral-200 hover:border-black rounded-xl overflow-hidden transition duration-200 cursor-pointer flex flex-col justify-between relative shadow-2xs hover:shadow-md"
                      >
                        {/* GAMBAR PRODUK */}
                        <div className="aspect-square bg-neutral-100 overflow-hidden relative border-b border-neutral-100">
                          <img 
                            src={prod.image} 
                            alt={prod.name}
                            className={`w-full h-full object-cover group-hover:scale-105 transition duration-300 ${isOutOfStock ? 'grayscale opacity-40' : ''}`} 
                          />
                          
                          {isLowStock && (
                            <span className="absolute top-2 left-2 bg-black text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                              <AlertCircle className="w-3 h-3 text-neutral-300" /> Sisa {currentStock} Unit
                            </span>
                          )}

                          {isOutOfStock && (
                            <span className="absolute top-2 left-2 bg-neutral-200 text-neutral-600 font-mono text-[9px] uppercase px-2 py-0.5 rounded">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>

                        {/* INFORMASI PRODUK: NAMA, TOKO, TERJUAL, & HARGA */}
                        <div className="p-3.5 space-y-2">
                          <div>
                            <h3 className="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:underline">
                              {prod.name}
                            </h3>
                            <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                              {prod.sellerName || 'Official Store'}
                            </p>
                          </div>

                          <div className="flex items-end justify-between pt-1 border-t border-neutral-100">
                            {/* Jumlah Terjual */}
                            <span className="text-[10px] font-mono text-neutral-400">
                              Terjual {totalSold}+
                            </span>

                            {/* Harga Produk */}
                            <span className="font-mono text-xs font-bold text-black bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded">
                              Rp {Number(prod.price).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
        </section>

      </main>

      {/* FLOATING CHAT BUTTON */}
      <button
        onClick={() => {
          setChatTarget('Official Store');
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-neutral-800 transition flex items-center gap-2 z-40 font-mono text-xs font-bold cursor-pointer"
      >
        <MessageSquare className="w-4 h-4 text-white" />
        <span>CHAT SELLER</span>
      </button>

      {/* MODAL DETAIL PRODUK */}
      {selectedProduct && (
        <VercelProductModal
          product={selectedProduct}
          lang={lang}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(item) => {
            handleAddToCart(item);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* MODAL LAINNYA */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setCurrentView('checkout')}
      />

      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserRole="customer"
        targetName={chatTarget}
      />

      <ToastNotification
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
      />

      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        orders={orders}
        onOpenTracking={handleOpenTracking}
        onOpenReview={handleOpenReview}
        onConfirmReceived={handleConfirmReceived}
        onReturnRequest={handleReturnRequest}
      />

      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        order={selectedTrackingOrder}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        product={selectedReviewProduct}
        onSubmitReview={(reviewData) => {
          console.log("Ulasan tersimpan:", reviewData);
        }}
      />

    </div>
  );
}

{/* MODAL PRODUK LIGHT MODE */}
function VercelProductModal({ product, lang, onClose, onAddToCart }) {
  const isEn = lang === 'en';

  const variants = (product.variants && product.variants.length > 0)
    ? product.variants
    : [{ color: 'Default', image: product.image }];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const getSizes = () => {
    const text = (product.name + ' ' + (product.category || '')).toLowerCase();
    if (text.includes('sepatu') || text.includes('shoes')) return ['38', '39', '40', '41', '42', '43'];
    if (text.includes('kemeja') || text.includes('kaos') || text.includes('baju') || text.includes('pakaian')) return ['S', 'M', 'L', 'XL', 'XXL'];
    return null;
  };

  const availableSizes = getSizes();
  const [selectedSize, setSelectedSize] = useState(availableSizes ? availableSizes[0] : 'Standard');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans text-black">
      <div className="bg-white border border-neutral-200 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-black p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          <div className="aspect-square bg-neutral-100 border-r border-neutral-200 relative">
            <img src={selectedVariant.image || product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div>
                <h2 className="text-base font-bold text-black leading-snug">{product.name}</h2>
                <p className="text-[11px] font-mono text-neutral-400 mt-1">{product.sellerName || 'Official Store'}</p>
              </div>

              <div className="font-mono text-sm font-bold text-black bg-neutral-100 px-3 py-1 rounded w-max border border-neutral-200">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </div>

              {availableSizes && (
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">{isEn ? 'SIZE' : 'UKURAN'}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[32px] h-8 px-2 rounded font-mono text-xs border transition cursor-pointer ${
                          selectedSize === s ? 'border-black bg-black text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-black'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <button
              onClick={() => onAddToCart({ 
                ...product, 
                selectedSize, 
                selectedColor: selectedVariant.color, 
                image: selectedVariant.image || product.image 
              })}
              className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase rounded transition cursor-pointer"
            >
              {isEn ? 'ADD TO CART' : 'TAMBAH KERANJANG'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}