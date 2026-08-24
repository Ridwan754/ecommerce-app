import React, { useState } from 'react';
import { ShoppingBag, Search, ShoppingCart, Star, Zap, MessageSquare } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import CartModal from './CartModal';
import CheckoutPage from '../../pages/CheckoutPage';
import ChatBox from '../../components/ChatBox';

export default function BuyerDashboard({ 
  products = [], 
  cartItems = [], 
  setCartItems = () => {}, 
  isCartOpen = false,        
  setIsCartOpen = () => {}   
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [currentView, setCurrentView] = useState('katalog');

  // State Fitur Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState('Toko Official Seller');

  const filteredProducts = (products || []).filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleOpenChat = (shopName) => {
    setChatTarget(shopName || 'Penjual Storefront');
    setIsChatOpen(true);
  };

  if (currentView === 'checkout') {
    return (
      <CheckoutPage 
        cartItems={cartItems}
        onBackToShop={() => setCurrentView('katalog')}
        onOrderSuccess={() => {
          setCartItems([]);
          setCurrentView('katalog');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans -m-6 pb-12 relative">
      
      {/* NAVBAR */}
      <header className="bg-[#ee4d2d] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
          
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0" 
            onClick={() => setCurrentView('katalog')}
          >
            <div className="bg-white p-1.5 rounded-lg text-[#ee4d2d]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Sopi'i<span className="font-light text-orange-200"></span>
            </span>
          </div>

          <div className="flex-1 max-w-2xl relative">
            <div className="flex bg-white rounded-sm overflow-hidden p-1 shadow-sm">
              <input 
                type="text" 
                placeholder="Cari produk, toko, atau kategori..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
              <button className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-5 py-1.5 rounded-sm transition flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <button 
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 hover:opacity-80 transition cursor-pointer"
              title="Keranjang Belanja"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-white text-[#ee4d2d] text-[10px] font-black w-4 h-4 rounded-full border border-[#ee4d2d] flex items-center justify-center shadow-sm">
                  {cartItems.length}
                </span>
              )}
            </button>

            <LogoutButton className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs px-3 py-1.5 rounded-sm" />
          </div>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 mt-4 space-y-4">
        
        {/* Banner Promo */}
        <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff7337] rounded-sm p-6 text-white shadow-sm flex justify-between items-center relative overflow-hidden">
          <div className="z-10 max-w-lg">
            <div className="inline-flex items-center gap-1 bg-amber-300 text-[#ee4d2d] text-[10px] font-black px-2.5 py-0.5 rounded-sm uppercase tracking-wider mb-2">
              <Zap className="w-3 h-3 fill-[#ee4d2d]" /> FLASH SALE 2026
            </div>
            <h2 className="text-2xl font-black leading-tight">Diskon Hingga 70% Hari Ini!</h2>
            <p className="text-xs text-orange-100 mt-1">Gratis Ongkir Rp0 ke Seluruh Indonesia tanpa minimal belanja.</p>
          </div>
        </div>

        {/* Bar Kategori */}
        <div className="bg-white p-3 rounded-sm shadow-sm flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-2 shrink-0">Kategori:</span>
          {['semua', 'sepatu', 'pakaian', 'gadget', 'aksesoris'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold capitalize rounded-sm transition whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-[#ee4d2d] text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Katalog Produk */}
        <div className="bg-white p-4 rounded-sm shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-extrabold text-[#ee4d2d] text-sm uppercase tracking-wide">
              Rekomendasi Produk
            </h3>
            <span className="text-xs text-slate-400">Menampilkan {filteredProducts.length} Produk</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-sm border border-slate-200/80 hover:border-[#ee4d2d] hover:shadow-md transition duration-200 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img 
                      src={product.image || 'https://via.placeholder.com/200'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <span className="absolute top-0 right-0 bg-amber-400 text-[#ee4d2d] text-[10px] font-black px-1.5 py-0.5 rounded-bl-sm">
                      {product.discount || '20% OFF'}
                    </span>
                  </div>

                  <div className="p-2 space-y-1">
                    <h4 className="text-xs text-slate-800 line-clamp-2 leading-snug group-hover:text-[#ee4d2d] transition">
                      {product.name}
                    </h4>
                    <div className="pt-1">
                      <span className="text-xs font-extrabold text-[#ee4d2d]">
                        <span className="text-[10px]">Rp</span>{Number(product.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {product.rating || '4.8'}
                      </span>
                      <button 
                        onClick={() => handleOpenChat(product.shopName)}
                        className="text-[#ee4d2d] hover:underline font-bold"
                      >
                        Chat Toko
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2 pt-0">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-1.5 bg-[#fef1ee] text-[#ee4d2d] border border-[#fbd3c9] rounded-sm font-bold text-[11px] hover:bg-[#ee4d2d] hover:text-white transition active:scale-95 cursor-pointer"
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FLOATING CHAT BUTTON UNTUK BUYER */}
      <button
        type="button"
        onClick={() => handleOpenChat('Toko Sepatu Impian')}
        className="fixed bottom-6 right-6 bg-[#ee4d2d] text-white p-3.5 rounded-full shadow-2xl hover:bg-[#d73211] transition flex items-center gap-2 z-40 border-2 border-white cursor-pointer"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline">Chat Penjual</span>
      </button>

      {/* MODAL KERANJANG */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onGoToCheckout={() => setCurrentView('checkout')}
      />

      {/* CHAT WIDGET */}
      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserRole="customer"
        targetName={chatTarget}
      />

    </div>
  );
}