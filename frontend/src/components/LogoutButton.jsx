import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/useLanguage';

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuth();
  const { lang } = useLanguage();

  const isEn = lang === 'en';
  const label = isEn ? 'Logout' : 'Keluar';
  const confirmMsg = isEn 
    ? 'Log out from your current account?' 
    : 'Keluar dari akun Anda saat ini?';

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm(confirmMsg)) {
      logout();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}