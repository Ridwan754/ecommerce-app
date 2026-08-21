import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

import LoginPage from './pages/LoginPage';
import AdminDashboard from './roles/admin/AdminDashboard';
import SellerDashboard from './roles/seller/SellerDashboard';
import BuyerDashboard from './roles/buyer/BuyerDashboard';

function AppContent() {
  const { user } = useAuth();
  const { products, handleAddProduct } = useProducts();
  const { cartItems, setCartItems, isCartOpen, setIsCartOpen } = useCart();

  // 1. Jika belum login, tampilkan Login Page
  if (!user) {
    return <LoginPage />;
  }

  // 2. Tampilkan Dashboard sesuai role user
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;

    case 'seller':
      return (
        <SellerDashboard 
          products={products || []} 
          onAddProduct={handleAddProduct} 
        />
      );

    case 'customer':
    case 'buyer':
      return (
        <BuyerDashboard 
          products={products || []}
          cartItems={cartItems || []}
          setCartItems={setCartItems}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
      );

    default:
      return <LoginPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}