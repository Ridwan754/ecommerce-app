import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "title": "E-Commerce System",
      "add_product": "Add Product",
      "buy": "Buy Now",
      "stock": "Stock",
      "out_of_stock": "Out of Stock",
      "chat": "Chat Seller/Buyer",
      "admin_panel": "Admin Panel (Create User)",
      "pay_method": "Payment Method"
    }
  },
  id: {
    translation: {
      "title": "Sistem E-Commerce",
      "add_product": "Tambah Barang",
      "buy": "Beli Sekarang",
      "stock": "Stok",
      "out_of_stock": "Stok Habis",
      "chat": "Chat Penjual/Pembeli",
      "admin_panel": "Panel Admin (Buat Akun)",
      "pay_method": "Metode Pembayaran"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "id",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;