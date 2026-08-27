import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

export default function PromoBannerSlider() {
  const banners = [
    {
      id: 1,
      badge: "EXCLUSIVE DROP",
      title: "SUMMER SELECTION 2026",
      subtitle: "Koleksi terbatas edisi musim panas dengan potongan harga hingga 40%.",
      code: "SUMMER40",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    },
    {
      id: 2,
      badge: "LOGISTICS",
      title: "COMPLIMENTARY SHIPPING",
      subtitle: "Bebas biaya pengiriman ke seluruh Indonesia tanpa batas minimum transaksi.",
      code: "FREESHIP",
      image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80"
    },
    {
      id: 3,
      badge: "HARDWARE & TECH",
      title: "PREMIUM ESSENTIALS",
      subtitle: "Dapatkan cashback 15% untuk perangkat dan aksesoris audio pilihan.",
      code: "AUDIO15",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Otomatis bergeser setiap 3 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] bg-white rounded-2xl overflow-hidden border border-neutral-200 group font-sans text-neutral-900 shadow-2xs">
      
      {/* CONTAINER SLIDE */}
      <div 
        className="w-full h-full flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((slide) => (
          <div 
            key={slide.id}
            className="w-full h-full shrink-0 relative flex items-center justify-between p-8 sm:p-12 bg-white"
          >
            {/* GRID PATTERN LATAR BELAKANG HALUS */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

            {/* TEKS PROMO */}
            <div className="max-w-md space-y-3 z-10">
              <span className="inline-block text-[10px] font-mono tracking-widest text-neutral-600 uppercase border border-neutral-300 px-2.5 py-1 rounded-md bg-neutral-100">
                {slide.badge}
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black leading-tight">
                {slide.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed line-clamp-2">
                {slide.subtitle}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="font-mono text-xs font-semibold tracking-wider text-white bg-black px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                  PROMO: {slide.code}
                </span>
                <span className="text-xs text-neutral-600 hover:text-black transition flex items-center gap-1 cursor-pointer font-medium">
                  Claim <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* GAMBAR PRODUK */}
            <div className="relative h-full w-2/5 hidden sm:flex items-center justify-center z-10">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="max-h-[80%] object-contain rounded-xl border border-neutral-200 shadow-md transition duration-500 hover:scale-105" 
              />
            </div>
          </div>
        ))}
      </div>

      {/* NAVIGASI TOMBOL (KIRI / KANAN) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
        <button 
          onClick={prevSlide}
          className="w-7 h-7 bg-white hover:bg-neutral-100 border border-neutral-200 text-black rounded-md flex items-center justify-center transition cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-7 h-7 bg-white hover:bg-neutral-100 border border-neutral-200 text-black rounded-md flex items-center justify-center transition cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* INDIKATOR TITIK (DOTS) */}
      <div className="absolute bottom-4 left-8 right-8 flex gap-1.5 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-0.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx ? 'w-8 bg-black' : 'w-4 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
}