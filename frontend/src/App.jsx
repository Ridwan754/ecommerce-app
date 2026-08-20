import React, { useState } from 'react';
import { initialProducts } from './data/products';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import HeroBanner from './components/HeroBanner';
import CartModal from './components/CartModal';
import { ShoppingBag, Search, ShoppingCart, LogOut } from 'lucide-react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove));
  };

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory('all')}>
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Storefront
            </span>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tombol Keranjang (Membuka Modal) */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* HERO BANNER & PROMO */}
        <HeroBanner />

        {/* FILTER KATEGORI */}
        <CategoryFilter 
          activeCategory={selectedCategory} 
          onSelectCategory={(catId) => setSelectedCategory(catId)} 
        />

        {/* KATALOG PRODUK */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">
            {selectedCategory === 'all' ? '🔥 Semua Produk' : `Kategori: ${selectedCategory.toUpperCase()}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        </section>
      </main>

      {/* MODAL KERANJANG DETAIL */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
}