import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Store, Star } from 'lucide-react';


export function Navbar() {
  const { lang, setLang, t } = useLanguage();
  return (
    <nav className="p-4 bg-white shadow flex justify-between">
      <input type="text" placeholder={t.searchPlaceholder} />

      <div className="flex gap-4 items-center">
        <button>{t.cart}</button>
        <button>{t.logout}</button>

        {/* Pemilih bahasa juga bisa dipasang di Navbar dalam aplikasi */}
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="id">ID</option>
          <option value="en">EN</option>
        </select>
      </div>
    </nav>
  );
}
export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
      <div>
        {/* Gambar Produk */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          {product.discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
              {product.discount}
            </span>
          )}
        </div>

        {/* Konten Produk */}
        <div className="p-3.5 space-y-2">
          {/* Label Nama Toko Penjual */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md w-max">
            <Store className="w-3 h-3 text-orange-500" />
            <span>{product.sellerName || 'Toko Official'}</span>
          </div>

          <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>

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
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
        >
          + Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}