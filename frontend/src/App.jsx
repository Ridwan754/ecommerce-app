import React, { useState } from 'react';
import { initialProducts } from './data/products';

// Import dari folder roles khusus
import BuyerDashboard from './roles/buyer/BuyerDashboard';
import SellerDashboard from './roles/seller/SellerDashboard';
import AdminDashboard from './roles/admin/AdminDashboard';

import { ShoppingBag, ShoppingCart, LogOut, UserCheck } from 'lucide-react';

export default function App() {
  // Role State: 'buyer' | 'seller' | 'admin'
  const [currentRole, setCurrentRole] = useState('buyer');

  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* NAVBAR & ROLE SWITCHER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentRole('buyer')}>
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Storefront
            </span>
          </div>

          {/* Switcher Role untuk Pengujian */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Mode Akses:
            </span>
            <button 
              onClick={() => setCurrentRole('buyer')}
              className={`px-3 py-1 rounded-lg font-bold transition ${currentRole === 'buyer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              Buyer
            </button>
            <button 
              onClick={() => setCurrentRole('seller')}
              className={`px-3 py-1 rounded-lg font-bold transition ${currentRole === 'seller' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              Seller
            </button>
            <button 
              onClick={() => setCurrentRole('admin')}
              className={`px-3 py-1 rounded-lg font-bold transition ${currentRole === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              Admin
            </button>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'buyer' && (
              <button onClick={() => setIsCartOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
            )}
            <button className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* RENDER HALAMAN SESUAI ROLE */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentRole === 'buyer' && (
          <BuyerDashboard 
            products={products}
            cartItems={cartItems}
            setCartItems={setCartItems}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {currentRole === 'seller' && (
          <SellerDashboard 
            products={products} 
            onAddProduct={handleAddProduct} 
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard />
        )}
      </main>

    </div>
  );
}