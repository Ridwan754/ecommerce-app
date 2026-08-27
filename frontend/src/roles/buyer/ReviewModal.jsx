import { useState } from 'react';
import { X, Star } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, product, onSubmitReview }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('Mohon tulis ulasan produk Anda!');
    
    onSubmitReview({
      productId: product.id,
      rating,
      comment
    });
    alert('Terima kasih! Ulasan Anda berhasil disimpan.');
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-neutral-900 space-y-4">
        
        <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-black">Beri Penilaian Produk</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-xl border border-neutral-200" />
          <div>
            <p className="font-bold text-xs text-black">{product.name}</p>
            <p className="text-[10px] text-neutral-400">Rp {Number(product.price).toLocaleString('id-ID')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-neutral-600 mb-2">Rating Bintang:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition hover:scale-110"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-600 mb-1">Ulasan Anda:</label>
            <textarea
              rows="3"
              required
              placeholder="Bagaimana kualitas barang, ketepatan ukuran, dan pengiriman?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-black text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
          >
            Kirim Penilaian
          </button>
        </form>

      </div>
    </div>
  );
}