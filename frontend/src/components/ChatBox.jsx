import React, { useState, useEffect } from 'react';
import { X, Send, Store, User } from 'lucide-react';

export default function ChatBox({ isOpen, onClose, currentUserRole, currentUserId, targetSellerId, targetName }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Tentukan Kunci ID Toko untuk Percakapan Ini
  const activeSellerId = currentUserRole === 'seller' ? currentUserId : targetSellerId;
  const storageKey = `chat_messages_${activeSellerId}`;

  // Muat Pesan Sesuai Toko
  useEffect(() => {
    if (activeSellerId) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([
          { id: 1, sender: 'seller', text: `Halo! Selamat datang di ${targetName || 'Toko Kami'}. Ada yang bisa kami bantu?` }
        ]);
      }
    }
  }, [activeSellerId, storageKey, targetName]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: currentUserRole, // 'buyer' atau 'seller'
      text: inputText
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">
      
      {/* HEADER CHAT */}
      <div className="bg-slate-900 text-white p-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {currentUserRole === 'buyer' ? <Store className="w-4 h-4 text-orange-400" /> : <User className="w-4 h-4 text-orange-400" />}
          <div>
            <p className="text-xs font-bold">{targetName || 'Toko'}</p>
            <p className="text-[10px] text-emerald-400">● Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* RIWAYAT PESAN */}
      <div className="p-3 h-64 overflow-y-auto space-y-2.5 bg-slate-50 text-xs">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserRole;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-2.5 rounded-xl ${isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white border text-slate-800 rounded-bl-none shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT BALAS PESAN */}
      <form onSubmit={handleSend} className="p-2 border-t bg-white flex gap-2">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 p-2 bg-slate-100 rounded-xl text-xs focus:outline-orange-500"
        />
        <button type="submit" className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition">
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}