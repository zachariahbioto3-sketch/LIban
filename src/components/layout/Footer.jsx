import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { LibanLogo } from '../ui/LibanLogo';
import { Mail, ArrowRight, ShieldCheck, Phone, MapPin, Check } from 'lucide-react';

export const Footer = () => {
  const { setPrimaryCategory, setOrderTrackerOpen, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    showToast('Subscribed!', 'You will receive exclusive Liban deals and offers.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-liban-dark text-gray-300 border-t border-gray-800 pt-12 pb-8 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="p-6 sm:p-8 rounded bg-gray-900 border border-gray-800 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider">LIBAN Exclusive Deals</span>
              <h3 className="text-2xl font-black text-white mt-1">Get 15% off your first order.</h3>
              <p className="text-xs text-gray-400 mt-2">Subscribe for flash sales, new arrivals, and M-Pesa exclusive offers.</p>
            </div>
            <div>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-green-900/40 border border-green-700 rounded text-green-300 text-xs font-semibold">
                  <Check className="w-4 h-4 text-green-400" /> Welcome to Liban! Check your email for your 15% code.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-red" />
                  </div>
                  <button type="submit" className="px-5 py-2.5 bg-brand-red text-white rounded font-bold text-xs hover:bg-brand-redDark transition-colors flex items-center gap-1.5 cursor-pointer shrink-0">
                    Subscribe <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <LibanLogo theme="dark" size="lg" />
            <p className="text-xs text-gray-400 leading-relaxed">Kenya's premier e-commerce platform for electronics, fashion, and lifestyle products.</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-red" /><span>0800 723 456</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-red" /><span>Nairobi, Kenya</span></div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-brand-red" /><span>M-Pesa Certified Merchant</span></div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Categories</p>
            <ul className="space-y-2 text-xs text-gray-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => { setPrimaryCategory(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-red transition-colors cursor-pointer text-left">{cat.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => setOrderTrackerOpen(true)} className="hover:text-brand-red transition-colors cursor-pointer text-left">Track My Order</button></li>
              <li><span>Delivery Guide</span></li>
              <li><span>Returns & Refunds</span></li>
              <li><span>M-Pesa Payments</span></li>
              <li><span>Warranty Claims</span></li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white">About Liban</p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><span>About Us</span></li>
              <li><span>Seller Portal</span></li>
              <li><span>Wholesale & B2B</span></li>
              <li><span>Store Locations</span></li>
              <li><span>Careers at Liban</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>� {new Date().getFullYear()} Liban E-Commerce Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['M-PESA', 'VISA', 'MASTERCARD', 'COD'].map((p) => (
              <span key={p} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400 text-xs font-mono">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
