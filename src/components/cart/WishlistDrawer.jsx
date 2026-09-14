import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const WishlistDrawer = () => {
  const { wishlist, wishlistDrawerOpen, setWishlistDrawerOpen, toggleWishlist, addToCart, formatPrice, setSelectedProduct } = useStore();



  if (!wishlistDrawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWishlistDrawerOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }} className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="p-4 border-b border-liban-border flex items-center justify-between bg-liban-dark text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-red fill-current" />
            <h2 className="font-bold">Wishlist ({wishlist.length})</h2>
          </div>
          <button onClick={() => setWishlistDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <Heart className="w-12 h-12 text-liban-muted" />
              <div>
                <h3 className="font-bold text-liban-dark">Your wishlist is empty</h3>
                <p className="text-xs text-liban-muted mt-1">Save products you love for later.</p>
              </div>
              <button onClick={() => setWishlistDrawerOpen(false)} className="px-6 py-2 bg-brand-red text-white rounded font-semibold text-xs hover:bg-brand-redDark transition-colors cursor-pointer">Browse Products</button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div key={product.id} className="p-3 border border-liban-border rounded bg-white flex gap-3 items-center hover:border-brand-red transition-colors group">
                <div onClick={() => { setSelectedProduct(product); setWishlistDrawerOpen(false); }} className="w-16 h-16 rounded border border-liban-border overflow-hidden bg-gray-50 shrink-0 cursor-pointer">
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-liban-dark truncate">{product.name}</h4>
                  <span className="text-sm font-bold text-brand-red font-mono">{formatPrice(product.price)}</span>
                  {(product.originalPrice ?? product.original_price) && <span className="text-xs text-liban-muted line-through font-mono ml-1">{formatPrice(product.originalPrice ?? product.original_price)}</span>}
                  <div className="mt-2">
                    <button onClick={() => addToCart(product, 1, product.colors?.[0]?.name)} className="flex items-center gap-1 px-3 py-1.5 bg-brand-red text-white rounded text-xs font-bold hover:bg-brand-redDark transition-colors cursor-pointer">
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
                <button onClick={() => toggleWishlist(product)} className="text-liban-muted hover:text-brand-red p-1 transition-colors cursor-pointer self-start"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};




