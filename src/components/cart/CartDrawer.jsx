import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const { cart, cartDrawerOpen, setCartDrawerOpen, removeFromCart, updateQuantity, cartCount, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal, freeShippingThreshold, freeShippingRemaining, formatPrice, activeCoupon, applyCoupon, removeCoupon, setCheckoutModalOpen, setSelectedProduct } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) setCouponError(res.message);
    else setCouponInput('');
  };

  const progress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  if (!cartDrawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartDrawerOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 220 }} className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10">
        <div className="p-4 border-b border-liban-border flex items-center justify-between bg-liban-dark text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-red" />
            <h2 className="font-bold">Shopping Cart ({cartCount})</h2>
          </div>
          <button onClick={() => setCartDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-b border-liban-border text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-brand-red" />
              {freeShippingRemaining === 0 ? <span className="text-green-600 font-bold">Free Delivery Unlocked!</span> : <span>Add <strong>{formatPrice(freeShippingRemaining)}</strong> for free delivery</span>}
            </div>
            <span className="font-mono text-liban-muted">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={'h-full transition-all rounded-full ' + (freeShippingRemaining === 0 ? 'bg-green-500' : 'bg-brand-red')} style={{ width: progress + '%' }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <ShoppingBag className="w-12 h-12 text-liban-muted" />
              <div>
                <h3 className="font-bold text-liban-dark">Your cart is empty</h3>
                <p className="text-xs text-liban-muted mt-1">Add products to get started.</p>
              </div>
              <button onClick={() => setCartDrawerOpen(false)} className="px-6 py-2 bg-brand-red text-white rounded font-semibold text-xs hover:bg-brand-redDark transition-colors cursor-pointer">Continue Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-3 border border-liban-border rounded bg-white flex gap-3 items-center hover:border-brand-red transition-colors group">
                <div onClick={() => { setSelectedProduct(item.product); setCartDrawerOpen(false); }} className="w-16 h-16 rounded border border-liban-border overflow-hidden bg-gray-50 shrink-0 cursor-pointer">
                  <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-liban-dark truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-liban-muted mt-0.5">
                    {item.selectedColor && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.selectedColor}</span>}
                    {item.selectedSize && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.selectedSize}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-liban-border rounded overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-liban-muted hover:text-liban-dark transition-colors cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center text-xs font-mono font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-liban-muted hover:text-liban-dark transition-colors cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-xs font-bold text-brand-red font-mono">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-liban-muted hover:text-brand-red p-1 transition-colors cursor-pointer self-start"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-4 border-t border-liban-border bg-gray-50 space-y-3">
            <div>
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200 text-xs">
                  <div className="flex items-center gap-2 text-green-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-green-600" />
                    Code <strong>{activeCoupon.code}</strong> applied (save {formatPrice(cartDiscount)})
                  </div>
                  <button onClick={removeCoupon} className="text-red-600 font-bold hover:underline cursor-pointer">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-liban-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="Coupon code (try LIBAN20)" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="w-full pl-8 pr-3 py-2 border border-liban-border rounded text-xs uppercase focus:outline-none focus:border-brand-red" />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-liban-dark text-white rounded font-semibold text-xs hover:bg-gray-800 transition-colors cursor-pointer">Apply</button>
                  </div>
                  {couponError && <p className="text-xs text-brand-red">{couponError}</p>}
                </form>
              )}
            </div>
            <div className="space-y-1.5 text-xs text-liban-muted">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-mono font-semibold text-liban-dark">{formatPrice(cartSubtotal)}</span></div>
              {cartDiscount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span className="font-mono">-{formatPrice(cartDiscount)}</span></div>}
              <div className="flex justify-between"><span>Delivery</span><span className={'font-mono font-semibold ' + (cartShipping === 0 ? 'text-green-600' : 'text-liban-dark')}>{cartShipping === 0 ? 'FREE' : formatPrice(cartShipping)}</span></div>
              <div className="flex justify-between"><span>VAT (16%)</span><span className="font-mono font-semibold text-liban-dark">{formatPrice(cartTax)}</span></div>
              <div className="flex justify-between pt-2 border-t border-liban-border text-sm font-bold text-liban-dark">
                <span>Total</span><span className="font-mono text-brand-red text-base">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <button onClick={() => { setCartDrawerOpen(false); setCheckoutModalOpen(true); }} className="w-full py-3 bg-brand-red text-white rounded font-bold text-sm hover:bg-brand-redDark transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-xs text-liban-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              M-Pesa & Card � Secure Checkout
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};




