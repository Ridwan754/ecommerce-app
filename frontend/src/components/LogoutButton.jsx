import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Keluar dari akun Anda saat ini?")) {
      logout();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl transition cursor-pointer ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Keluar</span>
    </button>
  );
}