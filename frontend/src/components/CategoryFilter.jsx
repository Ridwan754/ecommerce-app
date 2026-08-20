import React from 'react';
import { ShoppingBag, Shirt, Smartphone, Watch, Grid } from 'lucide-react';

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: 'all', label: 'Semua', icon: Grid, color: 'bg-slate-100 text-slate-700' },
    { id: 'sepatu', label: 'Sepatu', icon: ShoppingBag, color: 'bg-orange-50 text-orange-600' },
    { id: 'pakaian', label: 'Pakaian', icon: Shirt, color: 'bg-blue-50 text-blue-600' },
    { id: 'gadget', label: 'Gadget', icon: Smartphone, color: 'bg-purple-50 text-purple-600' },
    { id: 'aksesoris', label: 'Aksesoris', icon: Watch, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-800">Kategori Pilihan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                isActive
                    ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700'
                }`}
            >
              <div className={`p-2.5 rounded-xl ${cat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`font-semibold text-xs ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}