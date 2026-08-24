import { useState } from 'react';
import { X, Store, ShoppingCart, Star, Check } from 'lucide-react';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  // Daftar ukuran otomatis berdasarkan kategori
  const getSizeOptions = () => {
    const cat = product.category?.toLowerCase() || '';
    if (cat.includes('sepatu') || cat.includes('alas kaki')) {
      return ['38', '39', '40', '41', '42', '43', '44'];
    }
    if (cat.includes('pakaian') || cat.includes('baju') || cat.includes('celana') || cat.includes('fashion')) {
      return ['S', 'M', 'L', 'XL', 'XXL'];
    }
    return null; // Tidak ada pilihan ukuran untuk kategori selain fashion/sepatu
  };

  const availableSizes = getSizeOptions();
  const [selectedSize, setSelectedSize] = useState(availableSizes ? availableSizes[0] : null);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize: selectedSize || 'N/A'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 p-2 rounded-full shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Gambar Produk */}
          <div className="bg-slate-100 relative aspect-square md:aspect-auto">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow">
                {product.discount}
              </span>
            )}
          </div>

          {/* Info Detail Produk */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Badge Toko / Seller */}
              <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-xl text-xs font-bold w-max border border-orange-100">
                <Store className="w-4 h-4" />
                <span>{product.sellerName || 'Toko Official'}</span>
              </div>

              {/* Judul & Rating */}
              <h2 className="text-lg font-black text-slate-800 leading-snug">{product.name}</h2>
              
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold ml-1 text-slate-700">{product.rating || '5.0'}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{product.sold || 0} Terjual</span>
              </div>

              {/* Harga */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-black text-orange-600">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    Rp {Number(product.originalPrice).toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              {/* PILIHAN UKURAN (Jika kategori pakaian/sepatu) */}
              {availableSizes ? (
                <div className="pt-2 border-t">
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Pilih Ukuran / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                          selectedSize === size
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        {selectedSize === size && <Check className="w-3 h-3" />}
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t">
                  <p className="text-[11px] text-slate-400 italic">Produk ini tidak memerlukan pilihan ukuran.</p>
                </div>
              )}

            </div>

            {/* Tombol Tambah Ke Keranjang */}
            <button
              onClick={handleAddToCart}
              className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              + Tambah ke Keranjang
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}