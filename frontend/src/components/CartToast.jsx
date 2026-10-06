import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function CartToast() {
  const { toast, hideToast } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const bgStyle =
    toast.type === 'warning'
      ? 'bg-amber-600 border-amber-500 text-white'
      : toast.type === 'success'
      ? 'bg-slate-900 border-orange-500 text-white'
      : 'bg-slate-800 border-slate-700 text-white';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className={`flex items-center gap-3 text-sm font-medium ${bgStyle} rounded-2xl px-4 py-3 shadow-lg border`}>
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={hideToast}
          className="ml-2 rounded-full p-1 text-slate-300 hover:bg-white/20 hover:text-white"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
