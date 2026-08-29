import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroBanner = () => {
  const { setPrimaryCategory, setSelectedProduct, products } = useStore();

  const handleShopNow = () => {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="hidden lg:block lg:col-span-3 bg-white border border-liban-border rounded overflow-hidden">
          <div className="bg-brand-red text-white px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-sm">CATEGORIES</span>
          </div>
          <ul className="divide-y divide-liban-border">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => setPrimaryCategory(cat.id)} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-liban-dark hover:text-brand-red hover:bg-gray-50 transition-colors cursor-pointer group">
                  <span>{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-liban-muted group-hover:text-brand-red" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-9 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded overflow-hidden min-h-72 flex items-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_right,#E63946,transparent)]" />
          <div className="relative z-10 px-8 py-10 max-w-lg space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block bg-brand-red text-white text-xs font-bold px-3 py-1 rounded">
              UP TO OFF 60%
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              SMART TECH<br />
              <span className="text-brand-red">FOR KENYA</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-gray-300 text-sm leading-relaxed">
              Premium electronics, fashion, and lifestyle products delivered across Kenya. M-Pesa accepted.
            </motion.p>
            <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} onClick={handleShopNow} className="flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded font-bold text-sm hover:bg-brand-redDark transition-colors cursor-pointer">
              SHOP NOW
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="absolute right-4 bottom-0 hidden sm:block">
            <img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80" alt="Featured Product" className="h-64 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </section>
  );
};
