import { useState, useEffect } from 'react';
import { X, Send, Store, User } from 'lucide-react';

export default function ChatBox({ isOpen, onClose, currentUserRole, currentUserId, targetSellerId, targetName }) {
  const [inputText, setInputText] = useState('');

  // 1. Tentukan Kunci ID Toko untuk Percakapan Ini
  const activeSellerId = currentUserRole === 'seller' ? currentUserId : targetSellerId;
  const storageKey = `chat_messages_${activeSellerId}`;

  // 2. Inisialisasi State Messages Langsung dari localStorage (Lazy Initialization)
  const [messages, setMessages] = useState(() => {
    if (!activeSellerId) return [];
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      { sender: 'seller', text: 'Halo! Ada yang bisa kami bantu?' }
    ];
  });

  // 3. Simpan Pesan ke localStorage Setiap Ada Perubahan Pesan
  useEffect(() => {
    if (activeSellerId && messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, activeSellerId, storageKey]);

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      sender: currentUserRole || 'customer',
      text: inputText.trim()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-neutral-200 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans flex flex-col h-[450px]">
      
      {/* Header Chat */}
      <div className="bg-black text-white p-4 flex justify-between items-center border-b border-neutral-800">
        <div className="flex items-center gap-2">
          {currentUserRole === 'seller' ? (
            <User className="w-4 h-4 text-neutral-300" />
          ) : (
            <Store className="w-4 h-4 text-neutral-300" />
          )}
          <span className="font-bold text-xs tracking-wider uppercase">
            {targetName || (currentUserRole === 'seller' ? 'Customer' : 'Official Store')}
          </span>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Chat */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50 text-xs">
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUserRole;
          return (
            <div
              key={index}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  isMe
                    ? 'bg-black text-white rounded-br-none font-medium'
                    : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-none shadow-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Chat */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 text-xs p-2 bg-neutral-100 border border-neutral-200 rounded-xl outline-none focus:border-black transition"
        />
        <button
          type="submit"
          className="bg-black text-white p-2 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}