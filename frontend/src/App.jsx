import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import BuyerDashboard from './roles/buyer/BuyerDashboard';
import SellerDashboard from './roles/seller/SellerDashboard';
import AdminDashboard from './roles/admin/AdminDashboard';

export default function App() {
  const { user } = useAuth();

  // State produk universal dengan struktur variants dari Seller
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Sepatu Lari Sporty Pro',
      price: 250000,
      category: 'sepatu',
      sellerName: 'Toko Sepatu Impian',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
      variants: [
        { color: 'Merah', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop' },
        { color: 'Hitam', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop' },
        { color: 'Putih', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&auto=format&fit=crop' }
      ]
    },
    {
      id: 2,
      name: 'Kemeja Casual Oversize',
      price: 135000,
      category: 'pakaian',
      sellerName: 'Fashion Hub Official',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop',
      variants: [
        { color: 'Biru Denim', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop' },
        { color: 'Hitam', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop' }
      ]
    },
    {
      id: 3,
      name: 'TWS Wireless Earbuds Pro',
      price: 320000,
      category: 'gadget',
      sellerName: 'GadgetZone Indo',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop',
      variants: [
        { color: 'Hitam', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop' },
        { color: 'Putih', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop' }
      ]
    }
  ]);

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === 'seller') {
    return <SellerDashboard products={products} setProducts={setProducts} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard products={products} setProducts={setProducts} />;
  }

  return (
    <BuyerDashboard 
      products={products}
      cartItems={cartItems}
      setCartItems={setCartItems}
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
    />
  );
}