import { useState } from 'react';
import { initialProducts } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState(initialProducts);

  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  return {
    products,
    handleAddProduct
  };
}