import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Package, User, ChevronDown } from 'lucide-react';
import { CURRENCIES } from '../../data/products';

export const TopBar = () => {
  const { currency, setCurrency, setOrderTrackerOpen } = useStore();
  return (
    <div className="bg-liban-dark text-gray-300 text-xs py-2 px-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Store Location</a>
          <a href="#" className="hover:text-white transition-colors">Newsletter</a>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-white font-semibold">
          <Phone className="w-3 h-3 text-brand-red" />
          <span>CALL US NOW: 0800 723 456</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent text-gray-300 text-xs focus:outline-none cursor-pointer"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code} className="bg-gray-900">{c.code}</option>
            ))}
          </select>
          <button onClick={() => setOrderTrackerOpen(true)} className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <Package className="w-3 h-3" />
            <span>Track Order</span>
          </button>
          <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
            <User className="w-3 h-3" />
            <span>Register / Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
