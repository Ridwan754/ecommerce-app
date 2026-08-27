import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function ToastNotification({ message, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Otomatis menghilang setelah 3 detik
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-xs font-bold tracking-wide">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-2 text-neutral-400 hover:text-white transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}