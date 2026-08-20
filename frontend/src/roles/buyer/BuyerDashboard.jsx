import React, { useState } from 'react';
import HeroBanner from './HeroBanner';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import CartModal from './CartModal';

export default function BuyerDashboard({ products, cartItems, setCartItems, isCartOpen, setIsCartOpen }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter((product) => {
    return selectedCategory === 'all' || product.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Banner Promo */}
      <HeroBanner />

      {/* Filter Kategori */}
      <CategoryFilter 
        activeCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* Katalog Produk */}
      <section className="space-y-4 min-h-[400px]">
        <h2 className="text-base font-bold text-slate-800">
          {selectedCategory === 'all' ? '🔥 Semua Produk' : `Kategori: ${selectedCategory.toUpperCase()}`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={(p) => setCartItems([...cartItems, p])} 
            />
          ))}
        </div>
      </section>

      {/* Modal Keranjang */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(idx) => setCartItems(cartItems.filter((_, i) => i !== idx))}
      />
    </div>
  );
}