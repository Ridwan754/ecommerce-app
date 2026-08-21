import React, { useState } from 'react';
import { Send, X, Store, User, Image, Paperclip } from 'lucide-react';

export default function ChatBox({ 
  isOpen, 
  onClose, 
  currentUserRole = 'customer', // 'customer' | 'seller'
  targetName = 'Toko Sepatu Impian' 
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'seller',
      text: 'Halo! Ada yang bisa kami bantu mengenai produk ini?',
      time: '14:00'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: currentUserRole === 'seller' ? 'seller' : 'buyer',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Balasan Otomatis Simulasi jika dikirim oleh Buyer
    if (currentUserRole !== 'seller') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'seller',
            text: 'Terima kasih atas pesannya! Stok barang ready ya kak, silakan diorder.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-t-2xl shadow-2xl border border-orange-200 z-50 flex flex-col h-[450px] overflow-hidden">
      
      {/* HEADER CHAT */}
      <div className="bg-[#ee4d2d] text-white p-3.5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white/20 rounded-full">
            {currentUserRole === 'seller' ? <User className="w-4 h-4 text-white" /> : <Store className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h4 className="font-bold text-xs line-clamp-1">{targetName}</h4>
            <p className="text-[10px] text-orange-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span> Online
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* BODY CHAT (ISI PESAN) */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f8f8f8]">
        {messages.map((msg) => {
          const isMyMessage = (currentUserRole === 'seller' && msg.sender === 'seller') ||
                              (currentUserRole !== 'seller' && msg.sender === 'buyer');

          return (
            <div key={msg.id} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs shadow-sm ${
                  isMyMessage
                    ? 'bg-[#ee4d2d] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          );
        })}
      </div>

      {/* FOOTER CHAT (INPUT FORM) */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ketik pesan di sini..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
        />
        <button
          type="submit"
          className="p-2 bg-[#ee4d2d] text-white rounded-full hover:bg-[#d73211] transition shadow"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}