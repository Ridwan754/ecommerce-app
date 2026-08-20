import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cartItems, onRemoveItem }) {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right">
        
        {/* Header Modal */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-lg">Keranjang Belanja</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Barang */}
          <div className="py-4 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">Keranjang Anda masih kosong.</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                    <p className="text-xs font-bold text-blue-600 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-600">Total Pembayaran:</span>
              <span className="text-lg font-bold text-blue-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <button 
              onClick={() => alert("Mengarahkan ke halaman pembayaran...")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-95 text-xs"
            >
              Checkout Sekarang ({cartItems.length})
            </button>
          </div>
        )}

      </div>
    </div>
  );
}