import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartModal({ 
  isOpen, 
  onClose = () => {}, 
  cartItems = [], 
  onRemoveItem = () => {}, 
  onCheckout = () => {} 
}) {
  if (!isOpen) return null;

  // Memastikan cartItems berbentuk Array
  const itemsList = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = itemsList.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const isCartEmpty = itemsList.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-black border-l border-neutral-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header Vercel Light Style */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                MY CART ({itemsList.length})
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-black p-1 rounded-md transition border border-neutral-200 hover:border-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List Produk Keranjang */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-100">
            {!isCartEmpty ? (
              itemsList.map((item, index) => (
                <div 
                  key={index} 
                  className="pt-4 first:pt-0 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={item.image || 'https://via.placeholder.com/100'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Qty: 1</p>
                      <p className="text-xs font-black text-black mt-1">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(index)}
                    className="text-neutral-400 hover:text-red-600 p-2 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-neutral-400 space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-300 stroke-[1.2]" />
                <p className="uppercase tracking-widest text-[11px]">Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action Button */}
          <div className="p-6 border-t border-neutral-200 space-y-4 bg-white">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-black pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span className="text-base font-black">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Tombol yang sudah aktif & dapat diklik */}
            <button
              disabled={isCartEmpty}
              onClick={() => {
                onClose(); // Tutup modal keranjang
                if (onCheckout) onCheckout(); // Eksekusi pindah ke halaman checkout
              }}
              className="w-full py-4 bg-black hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-bold text-xs uppercase tracking-widest rounded-full transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}