import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  setCartItems = () => {},
  onGoToCheckout = () => {} 
}) {
  if (!isOpen) return null;

  // Total Subtotal Barang
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

  // Hapus 1 Produk dari Keranjang
  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  // Handler Pindah ke Halaman Checkout
  const handleCheckoutClick = () => {
    onClose(); 
    onGoToCheckout(); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end transition-opacity">
      <div className="bg-white max-w-md w-full h-full shadow-2xl flex flex-col justify-between p-4">
        
        <div>
          {/* Header Modal */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="font-extrabold text-[#ee4d2d] text-base flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Keranjang Belanja ({cartItems.length})
            </h3>
            <button 
              onClick={onClose} 
              className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Item Keranjang */}
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold">Keranjang Anda masih kosong</p>
              <p className="text-[10px] mt-1">Yuk, pilih produk favoritmu sekarang!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 border p-2.5 rounded-sm bg-slate-50 relative group">
                  <img 
                    src={item.image || 'https://via.placeholder.com/80'} 
                    alt={item.name} 
                    className="w-14 h-14 object-cover rounded-sm border shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs font-black text-[#ee4d2d] mt-1">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(index)} 
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition"
                    title="Hapus item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Ringkasan Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-3 bg-white">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Subtotal Produk</span>
              <span className="font-black text-[#ee4d2d] text-base">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={handleCheckoutClick}
              className="w-full py-3 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-xs rounded-sm shadow transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}