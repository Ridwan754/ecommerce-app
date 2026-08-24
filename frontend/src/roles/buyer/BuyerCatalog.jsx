import React, { useState } from 'react';
import { MessageSquare, Store, ShoppingCart } from 'lucide-react';
import ChatBox from './ChatBox';

export default function BuyerCatalog({ products = [] }) {
  const [activeChatSeller, setActiveChatSeller] = useState(null); // Menyimpan Toko yang Sedang Dihubungi

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-black text-slate-800 mb-6">Katalog Produk Multi-Seller</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <img src={product.image} alt={product.name} className="w-full h-44 object-cover rounded-xl mb-3" />
              
              {/* NAMA TOKO / SELLER */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                <Store className="w-3.5 h-3.5 text-orange-500" />
                <span>{product.sellerName || 'Toko Resmi'}</span>
              </div>

              <h3 className="font-bold text-slate-800 text-sm mb-1">{product.name}</h3>
              <p className="text-orange-600 font-black text-base mb-3">Rp {Number(product.price).toLocaleString('id-ID')}</p>
            </div>

            {/* TOMBOL CHAT DENGAN TOKO YANG BERSANGKUTAN */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChatSeller({ id: product.sellerId, name: product.sellerName })}
                className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-200 py-2 rounded-xl text-xs font-bold hover:bg-orange-100 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Chat Toko
              </button>
              
              <button className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHATBOX PEMBELI -> TOKO TUJUAN */}
      {activeChatSeller && (
        <ChatBox
          isOpen={!!activeChatSeller}
          onClose={() => setActiveChatSeller(null)}
          currentUserRole="buyer"
          targetSellerId={activeChatSeller.id}
          targetName={activeChatSeller.name}
        />
      )}
    </div>
  );
}