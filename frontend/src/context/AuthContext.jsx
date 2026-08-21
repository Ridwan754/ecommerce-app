import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // State percakapan terpusat dengan key 'toko-sepatu-impian'
  const [chatThreads, setChatThreads] = useState({
    'toko-sepatu-impian': [
      {
        id: 1,
        sender: 'seller',
        text: 'Halo! Selamat datang di Toko Sepatu Impian. Ada yang bisa kami bantu?',
        time: '14:00'
      }
    ]
  });

  const login = (email, password, role) => {
    const userData = { email, role, token: `fake-jwt-token-${role}` };
    setUser(userData);
    localStorage.setItem('user_session', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  // Fungsi kirim pesan terhubung langsung ke ID Toko
  const sendMessageToStore = (storeId, text, senderRole) => {
    const newMessage = {
      id: Date.now(),
      sender: senderRole === 'seller' ? 'seller' : 'buyer',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatThreads((prev) => ({
      ...prev,
      [storeId]: [...(prev[storeId] || []), newMessage]
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, chatThreads, sendMessageToStore }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);