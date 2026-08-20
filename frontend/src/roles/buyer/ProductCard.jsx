import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
          -{product.discount}
        </span>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:text-red-500'
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-xs text-slate-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400" /> {product.rating}
            </span>
            <span>•</span>
            <span>Terjual {product.sold}+</span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-[10px] text-slate-400 line-through">
              Rp {product.originalPrice.toLocaleString('id-ID')}
            </div>
            <div className="text-base font-bold text-blue-600">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
          </div>

          <button 
            onClick={() => onAddToCart(product)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>+ Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
}