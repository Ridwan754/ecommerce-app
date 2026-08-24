import { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
  id: {
    help: 'Bantuan & Layanan',
    welcome: 'Selamat Datang!',
    subtitle: 'Silakan pilih jenis akses akun Anda',
    customer: 'Pembeli',
    seller: 'Penjual',
    admin: 'Admin',
    emailLabel: 'Email Akun',
    passwordLabel: 'Kata Sandi',
    loginBtn: 'LOG IN SEBAGAI',
    noStoreText: 'Belum punya toko terdaftar?',
    registerBtn: 'Daftar Jadi Seller Sekarang (Wajib NIK/KTP/KK)',
    searchPlaceholder: "Cari produk di Sopi'i...",
    cart: 'Keranjang',
    logout: 'Keluar',
  },
  en: {
    help: 'Help & Support',
    welcome: 'Welcome!',
    subtitle: 'Please select your account access type',
    customer: 'Customer',
    seller: 'Seller',
    admin: 'Admin',
    emailLabel: 'Account Email',
    passwordLabel: 'Password',
    loginBtn: 'LOG IN AS',
    noStoreText: "Don't have a registered store yet?",
    registerBtn: 'Register as Seller Now (ID Card/NIK Required)',
    searchPlaceholder: "Search products in Sopi'i...",
    cart: 'Cart',
    logout: 'Logout',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}