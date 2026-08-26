import { useState } from 'react';
import { Search, ShoppingBag, X, Globe, User, MessageSquare } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import CartModal from './CartModal';
import CheckoutPage from '../../pages/CheckoutPage';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/AuthContext';
import ChatBox from "../../components/ChatBox";

export default function BuyerDashboard({ 
  products = [], 
  cartItems = [], 
  setCartItems = () => {}, 
  isCartOpen = false,        
  setIsCartOpen = () => {}   
}) {
  const { lang, setLang } = useLanguage();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentView, setCurrentView] = useState('katalog');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState('Official Store');

  const isEn = lang === 'en';

  const categories = [
    { key: 'all', label: isEn ? 'All' : 'Semua' },
    { key: 'sepatu', label: isEn ? 'Shoes' : 'Sepatu' },
    { key: 'pakaian', label: isEn ? 'Shirts' : 'Pakaian' },
    { key: 'gadget', label: 'Gadget' },
    { key: 'aksesoris', label: isEn ? 'Accessories' : 'Aksesoris' },
  ];

  const filteredProducts = (products || []).filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProduct = filteredProducts[0];
  const secondaryProducts = filteredProducts.slice(1, 3);
  const gridProducts = filteredProducts.slice(3);

  // Handler Hapus Item Dari Keranjang
  const handleRemoveCartItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased -m-6 pb-20">
      
      {/* HEADER VERCEL COMMERCE STYLE */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setCurrentView('katalog')}
              className="flex items-center gap-2 font-black tracking-tighter text-xl uppercase cursor-pointer"
            >
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold">
                ▲
              </div>
              <span>SOPI'I</span>
            </button>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`transition hover:text-black cursor-pointer ${
                    selectedCategory === cat.key ? 'text-black font-bold underline underline-offset-8' : ''
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-sm relative hidden sm:block">
            <input 
              type="text" 
              placeholder={isEn ? "Search for products..." : "Cari produk..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white text-xs px-4 py-2 pr-9 rounded-md border border-neutral-200 focus:border-black outline-none transition"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200/80 rounded-full px-3 py-1">
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <div className="text-left text-[11px] leading-tight">
                <p className="font-bold text-neutral-800 truncate max-w-[90px]">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-[9px] text-neutral-400 font-medium capitalize">
                  {user?.role || 'Buyer'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
              <Globe className="w-3.5 h-3.5" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-black font-bold cursor-pointer outline-none"
              >
                <option value="id">ID</option>
                <option value="en">EN</option>
              </select>
            </div>

            <button 
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-neutral-100 transition cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
              {cartItems?.length > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <LogoutButton className="text-xs font-semibold px-3 py-1.5 rounded-md border border-neutral-200 hover:bg-black hover:text-white transition cursor-pointer" />
          </div>

        </div>
      </header>

      {/* HERO GRID */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-12">
        
        {featuredProduct && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div 
              onClick={() => setSelectedProduct(featuredProduct)}
              className="lg:col-span-2 relative aspect-[4/3] bg-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img 
                src={featuredProduct.image} 
                alt={featuredProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-neutral-200 shadow-sm flex items-center gap-3">
                <span className="font-bold text-sm text-black">{featuredProduct.name}</span>
                <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                  Rp {Number(featuredProduct.price).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {secondaryProducts.map((prod) => (
                <div 
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="relative flex-1 aspect-[16/9] lg:aspect-auto bg-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-neutral-200 shadow-sm flex items-center gap-2">
                    <span className="font-bold text-xs text-black truncate max-w-[120px]">{prod.name}</span>
                    <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                      Rp {Number(prod.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CATALOG GRID */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              {isEn ? 'All Products' : 'Semua Koleksi'}
            </h2>
            <span className="text-xs text-neutral-400 font-medium">
              {filteredProducts.length} {isEn ? 'items' : 'produk'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(gridProducts.length > 0 ? gridProducts : filteredProducts).map((prod) => (
              <div 
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="group border border-neutral-200 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                </div>
                <div className="p-4 flex items-center justify-between border-t border-neutral-100">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-800 line-clamp-1">{prod.name}</h3>
                    <p className="text-[11px] text-neutral-400">{prod.sellerName || 'Store'}</p>
                  </div>
                  <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                    Rp {Number(prod.price).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FLOATING CHAT BUTTON */}
      <button
        onClick={() => {
          setChatTarget('Official Store');
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-neutral-800 transition flex items-center gap-2 z-40 border border-neutral-700 cursor-pointer"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline">{isEn ? 'Chat Seller' : 'Chat Penjual'}</span>
      </button>

      {/* MODAL DETAIL PRODUK DINAMIS VERCEL */}
      {selectedProduct && (
        <VercelProductModal
          product={selectedProduct}
          lang={lang}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(item) => {
            setCartItems([...cartItems, item]);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* MODAL KERANJANG */}
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

    </div>
  );
}

{/* MODAL PRODUK DETAIL DENGAN VARIASI WARNA & GAMBAR DARI SELLER */}
function VercelProductModal({ product, lang, onClose, onAddToCart }) {
  const isEn = lang === 'en';

  const variants = (product.variants && product.variants.length > 0)
    ? product.variants
    : [{ color: 'Default', image: product.image }];

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const getSizes = () => {
    const text = (product.name + ' ' + (product.category || '')).toLowerCase();
    if (text.includes('sepatu') || text.includes('shoes')) {
      return ['38', '39', '40', '41', '42', '43'];
    }
    if (text.includes('kemeja') || text.includes('kaos') || text.includes('baju') || text.includes('pakaian')) {
      return ['S', 'M', 'L', 'XL', 'XXL'];
    }
    return null;
  };

  const availableSizes = getSizes();
  const [selectedSize, setSelectedSize] = useState(availableSizes ? availableSizes[0] : 'Standard');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl relative border border-neutral-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-neutral-100 hover:bg-neutral-200 text-black p-2 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          <div className="aspect-square bg-neutral-100 relative overflow-hidden">
            <img 
              src={selectedVariant.image || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-300" 
            />
          </div>

          <div className="p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div className="pr-10">
                <h2 className="text-xl font-black text-black leading-snug">{product.name}</h2>
                <p className="text-xs text-neutral-400 mt-1">{product.sellerName || 'Official Store'}</p>
              </div>

              <div className="inline-block bg-blue-600 text-white font-bold text-sm px-3.5 py-1 rounded-full">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </div>

              {availableSizes ? (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    {isEn ? 'Size' : 'Ukuran'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[36px] h-9 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          selectedSize === s
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 text-neutral-600 hover:border-black'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-neutral-400 italic bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                  {isEn ? 'Standard / One Size' : 'Ukuran: Standard / One Size'}
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  {isEn ? 'Color' : 'Warna'}: <span className="text-black font-extrabold">{selectedVariant.color}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        selectedVariant.color === v.color
                          ? 'bg-black text-white border-black'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-black'
                      }`}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button
              onClick={() => onAddToCart({ 
                ...product, 
                selectedSize, 
                selectedColor: selectedVariant.color, 
                image: selectedVariant.image || product.image 
              })}
              className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition cursor-pointer"
            >
              {isEn ? 'Add To Cart' : 'Tambah Ke Keranjang'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}