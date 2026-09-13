import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { LibanLogo } from '../ui/LibanLogo';
import { Search, ShoppingBag, Heart } from 'lucide-react';

export const Header = () => {
  const { cartCount, cartSubtotal, formatPrice, wishlist, filters, setFilters, setCartDrawerOpen, setWishlistDrawerOpen, products, setSelectedProduct } = useStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!filters.searchQuery.trim()) return [];
    const q = filters.searchQuery.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)).slice(0, 5);
  }, [filters.searchQuery, products]);

  return (
    <div className="bg-white border-b border-liban-border nav-shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        <button onClick={() => setCartDrawerOpen(true)} className="flex items-center gap-2 bg-liban-dark text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors cursor-pointer shrink-0">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs font-bold">{formatPrice(cartSubtotal)}</span>
          {cartCount > 0 && (
            <span className="bg-brand-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <a href="#" className="hidden sm:flex items-center gap-1 text-liban-muted text-xs hover:text-brand-red transition-colors">
          <span className="font-semibold">M-PESA ACCEPTED</span>
        </a>

        <div className="flex-1 relative" ref={searchRef}>
          <div className="flex border-2 border-brand-red rounded overflow-hidden">
            <select className="px-2 text-xs border-r border-gray-200 focus:outline-none bg-gray-50 text-gray-600">
              <option>All Categories</option>
            </select>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
              onFocus={() => setSearchFocused(true)}
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <button className="bg-brand-red px-4 py-2 text-white hover:bg-brand-redDark transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
          {searchFocused && filters.searchQuery.trim() && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-liban-border shadow-lg rounded-b z-50 overflow-hidden">
              {suggestions.map((p) => (
                <div key={p.id} onClick={() => { setSelectedProduct(p); setSearchFocused(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                  <div>
                    <p className="text-xs font-semibold text-liban-dark">{p.name}</p>
                    <p className="text-xs text-brand-red font-bold">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <LibanLogo size="lg" />

        <button onClick={() => setWishlistDrawerOpen(true)} className="relative p-2 text-liban-muted hover:text-brand-red transition-colors cursor-pointer shrink-0">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
