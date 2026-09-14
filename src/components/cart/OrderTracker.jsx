import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Package, Search, CheckCircle2, Clock, Truck, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTracker = () => {
  const { orderTrackerOpen, setOrderTrackerOpen, lookupOrder, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  if (!orderTrackerOpen) return null;

  const handleSearch = () => {
    if (!query.trim()) return;
    const order = lookupOrder(query.trim());
    if (order) { setResult(order); setNotFound(false); }
    else { setResult(null); setNotFound(true); }
  };

  const statusIcons = {
    'Order Placed': Package,
    'Processing': Clock,
    'Shipped': Truck,
    'Out for Delivery': MapPin,
    'Delivered': CheckCircle2,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOrderTrackerOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-white rounded-xl z-10 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-liban-border flex items-center justify-between bg-liban-dark text-white shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-red" />
            <h2 className="font-bold">Track Your Order</h2>
          </div>
          <button onClick={() => setOrderTrackerOpen(false)} className="p-1.5 text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="p-5 space-y-5">
            <div>
              <label className="text-xs font-bold text-liban-muted block mb-2">Order Number or Email Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setNotFound(false); setResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. LIB-12345 or email@example.com"
                  className="flex-1 px-3 py-2 border border-liban-border rounded-lg text-sm focus:outline-none focus:border-brand-red"
                />
                <button onClick={handleSearch} className="px-4 py-2 bg-brand-red text-white rounded-lg font-bold text-sm hover:bg-brand-redDark transition-colors flex items-center gap-2 cursor-pointer">
                  <Search className="w-4 h-4" /> Track
                </button>
              </div>
              {notFound && <p className="text-xs text-brand-red mt-2 font-semibold">No order found. Check your order number or email and try again.</p>}
            </div>
            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-liban-border rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between border-b border-liban-border pb-2">
                    <span className="text-liban-muted">Order Number</span>
                    <span className="font-mono font-bold text-liban-dark">{result.orderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-liban-border pb-2">
                    <span className="text-liban-muted">Status</span>
                    <span className="font-bold text-green-600">{result.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-liban-border pb-2">
                    <span className="text-liban-muted">Total</span>
                    <span className="font-mono font-bold text-liban-dark">{formatPrice(result.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-liban-muted">Est. Delivery</span>
                    <span className="font-bold text-liban-dark">{new Date(result.estimatedDelivery).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-liban-muted uppercase tracking-wider mb-3">Order Timeline</h4>
                  <div className="space-y-3">
                    {result.timeline.map((step, i) => {
                      const Icon = statusIcons[step.status] || Package;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className={'w-8 h-8 rounded-full flex items-center justify-center shrink-0 ' + (step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-liban-muted')}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 pb-3 border-b border-liban-border last:border-0">
                            <div className="flex items-center justify-between">
                              <span className={'text-xs font-bold ' + (step.completed ? 'text-liban-dark' : 'text-liban-muted')}>{step.status}</span>
                              <span className="text-xs text-liban-muted font-mono">{step.date} {step.time !== '--:--' ? step.time : ''}</span>
                            </div>
                            <p className="text-xs text-liban-muted mt-0.5">{step.description}</p>
                            {step.location && <p className="text-xs text-brand-red font-semibold mt-0.5">{step.location}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-green-600" />
              <span>Your order is protected under the <strong>LIBAN Buyer Guarantee</strong>. Contact support if anything seems wrong.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
