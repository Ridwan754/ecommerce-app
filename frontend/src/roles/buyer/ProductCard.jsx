import { useState } from 'react';
import { Heart, Star, Store, ShoppingCart, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Navbar({ onSearch, onCartClick, onLogout }) {
  const { lang, setLang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <nav className="p-4 bg-white shadow flex justify-between items-center gap-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={t.searchPlaceholder || 'Cari produk...'}
        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-orange-500 flex-1 max-w-md"
      />

      <div className="flex gap-3 items-center">
        <button
          onClick={onCartClick}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-orange-500 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t.cart || 'Keranjang'}</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout || 'Keluar'}</span>
        </button>

        {/* Pemilih Bahasa */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="text-xs border border-slate-200 rounded-md p-1 bg-slate-50 focus:outline-orange-500 cursor-pointer"
        >
          <option value="id">ID</option>
          <option value="en">EN</option>
        </select>
      </div>
    </nav>
  );
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = () => {
    setIsWishlisted(!isWishlisted);
    if (onToggleWishlist) onToggleWishlist(product, !isWishlisted);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
      <div>
        {/* Gambar Produk */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
              {product.discount}
            </span>
          )}
          
          {/* Tombol Wishlist (Menggunakan Ikon Heart) */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-white transition"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Konten Produk */}
        <div className="p-3.5 space-y-2">
          {/* Label Nama Toko Penjual (Menggunakan Ikon Store) */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md w-max">
            <Store className="w-3 h-3 text-orange-500" />
            <span>{product.sellerName || 'Toko Official'}</span>
          </div>

          <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating Produk (Menggunakan Ikon Star) */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-slate-700">{product.rating || '4.8'}</span>
            <span className="text-slate-400 text-[10px]">({product.sold || '50+'} terjual)</span>
          </div>

          {/* Harga */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-sm text-orange-600">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through">
                Rp {Number(product.originalPrice).toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Button Keranjang */}
      <div className="p-3.5 pt-0">
        <button
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>+ Tambah ke Keranjang</span>
        </button>
      </div>
    </div>
  );
}