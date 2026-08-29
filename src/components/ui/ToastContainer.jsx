import React from 'react';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div key={toast.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="pointer-events-auto flex items-start gap-3 p-4 rounded bg-liban-dark text-white shadow-2xl border border-gray-800">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-brand-red" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="text-xs text-gray-300 mt-0.5">{toast.message}</p>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
