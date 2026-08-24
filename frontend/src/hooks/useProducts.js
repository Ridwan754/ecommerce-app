import { useState } from 'react';

// Data produk bawaan dari masing-masing toko
export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Sepatu Lari Sporty Pro',
    price: 250000,
    originalPrice: 300000,
    discount: '16%',
    rating: 4.8,
    sold: 45,
    stock: 12,
    category: 'sepatu',
    sellerId: 'seller_1',
    sellerName: 'Toko Sepatu Impian',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  },
  {
    id: 2,
    name: 'Kemeja Casual Oversize',
    price: 135000,
    originalPrice: 180000,
    discount: '25%',
    rating: 4.9,
    sold: 88,
    stock: 20,
    category: 'pakaian',
    sellerId: 'seller_2',
    sellerName: 'Fashion Hub Official',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80',
  },
  {
    id: 3,
    name: 'TWS Wireless Earbuds Pro',
    price: 320000,
    originalPrice: 450000,
    discount: '28%',
    rating: 5.0,
    sold: 120,
    stock: 8,
    category: 'gadget',
    sellerId: 'seller_3',
    sellerName: 'GadgetZone Indonesia',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
  },
];

export function useProducts() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  const handleUpdateStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return {
    products,
    handleAddProduct,
    handleUpdateStock,
    handleDeleteProduct,
  };
}