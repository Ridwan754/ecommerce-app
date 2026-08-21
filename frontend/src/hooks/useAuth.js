import { useState } from 'react';

export function useAuth(initialRole = 'buyer', resetCart) {
  const [currentRole, setCurrentRole] = useState(initialRole);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (resetCart) resetCart();
      setCurrentRole('buyer');

      alert("Anda telah berhasil keluar.");
    }
  };

  return {
    currentRole,
    setCurrentRole,
    handleLogout
  };
}