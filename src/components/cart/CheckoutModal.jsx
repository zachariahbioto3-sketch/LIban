import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { X, Lock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Package, Truck, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Delivery', price: 350, estimatedDays: '3-5 business days' },
  { id: 'express', name: 'Express Delivery', price: 750, estimatedDays: '1-2 business days' },
  { id: 'free', name: 'Free Delivery', price: 0, estimatedDays: '5-7 business days' },
];

export const CheckoutModal = () => {
  const { checkoutModalOpen, setCheckoutModalOpen, cart, cartSubtotal, cartDiscount, cartTax, activeCoupon, formatPrice, createOrder, setOrderTrackerOpen } = useStore();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [address, setAddress] = useState({ fullName: '', email: '', phone: '', street: '', city: 'Nairobi', county: 'Nairobi', zipCode: '' });

  if (!checkoutModalOpen) return null;

  const shippingFee = shippingMethod.price;
  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + shippingFee + cartTax);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({ items: [...cart], shippingAddress: address, shippingMethod, payment: { method: paymentMethod, phone: mpesaPhone }, subtotal: cartSubtotal, discount: cartDiscount, shippingFee, tax: cartTax, total: finalTotal, status: 'Order Placed', estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() });
      setPlacedOrderNumber(order.orderNumber);
      setIsProcessing(false);
      setStep(4);
      try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#E63946', '#111111', '#10b981', '#ffffff'] }); } catch (e) {}
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if (step !== 4) setCheckoutModalOpen(false); }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-white rounded shadow-2xl z-10 my-8 overflow-hidden">
        <div className="p-4 border-b border-liban-border flex items-center justify-between bg-liban-dark text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-red" />
            <h2 className="font-bold">{step === 4 ? 'Order Confirmed!' : 'Secure Checkout'}</h2>
          </div>
          <button onClick={() => setCheckoutModalOpen(false)} className="p-1.5 text-gray-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        {step !== 4 && (
          <div className="px-6 py-2 bg-gray-50 border-b border-liban-border flex items-center gap-3 text-xs font-semibold">
            {['Shipping', 'Payment', 'Review'].map((label, i) => (
              <React.Fragment key={label}>
                <span className={step === i + 1 ? 'text-brand-red font-bold' : 'text-liban-muted'}>{i + 1}. {label}</span>
                {i < 2 && <span className="text-liban-border">/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-bold text-liban-dark">Delivery Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[['fullName','Full Name','text'],['email','Email Address','email'],['phone','Phone Number','tel'],['street','Street Address','text']].map(([field, label, type]) => (
                  <div key={field} className={field === 'street' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-semibold text-liban-muted block mb-1">{label}</label>
                    <input type={type} value={address[field]} onChange={(e) => setAddress({ ...address, [field]: e.target.value })} className="w-full px-3 py-2 border border-liban-border rounded text-sm focus:outline-none focus:border-brand-red" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-liban-muted block mb-1">City / Town</label>
                  <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-3 py-2 border border-liban-border rounded text-sm focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-liban-muted block mb-1">County</label>
                  <input type="text" value={address.county} onChange={(e) => setAddress({ ...address, county: e.target.value })} className="w-full px-3 py-2 border border-liban-border rounded text-sm focus:outline-none focus:border-brand-red" />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-liban-muted uppercase tracking-wider mb-3">Delivery Speed</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SHIPPING_METHODS.map((m) => (
                    <div key={m.id} onClick={() => setShippingMethod(m)} className={'p-3 rounded border-2 cursor-pointer transition-all ' + (shippingMethod.id === m.id ? 'border-brand-red bg-red-50' : 'border-liban-border hover:border-brand-red')}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-liban-dark">{m.name}</span>
                        <span className="text-xs font-bold font-mono text-brand-red">{m.price === 0 ? 'FREE' : formatPrice(m.price)}</span>
                      </div>
                      <span className="text-xs text-liban-muted">{m.estimatedDays}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => { if (!address.fullName.trim() || !address.email.trim() || !address.phone.trim() || !address.street.trim()) { alert('Please fill in all delivery fields before continuing.'); return; } setStep(2); }} className="px-6 py-2.5 bg-brand-red text-white rounded font-semibold text-sm hover:bg-brand-redDark transition-colors flex items-center gap-2 cursor-pointer">
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-bold text-liban-dark">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                {[['mpesa','M-Pesa'],['card','Card'],['cod','Cash on Delivery']].map(([method, label]) => (
                  <button key={method} onClick={() => setPaymentMethod(method)} className={'p-3 rounded border-2 text-xs font-bold text-center transition-all cursor-pointer ' + (paymentMethod === method ? 'border-brand-red bg-red-50 text-brand-red' : 'border-liban-border text-liban-muted hover:border-brand-red')}>
                    {label}
                  </button>
                ))}
              </div>
              {paymentMethod === 'mpesa' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded space-y-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-700" />
                    <h4 className="font-bold text-green-900">M-Pesa STK Push</h4>
                  </div>
                  <p className="text-xs text-green-700">Enter your Safaricom number. You will receive a payment prompt on your phone.</p>
                  <input type="tel" placeholder="e.g. 0712 345 678" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} className="w-full px-3 py-2 border border-green-300 rounded text-sm focus:outline-none focus:border-green-600 bg-white" />
                </div>
              )}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-gray-50 border border-liban-border rounded space-y-3">
                  <h4 className="font-bold text-liban-dark text-sm">Card Details</h4>
                  <input type="text" placeholder="Card number" className="w-full px-3 py-2 border border-liban-border rounded text-sm focus:outline-none focus:border-brand-red font-mono" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-liban-border rounded text-sm focus:outline-none focus:border-brand-red font-mono" />
                    <input type="password" placeholder="CVC" maxLength={4} className="w-full px-3 py-2 border border-liban-border rounded text-sm focus:outline-none focus:border-brand-red font-mono" />
                  </div>
                </div>
              )}
              {paymentMethod === 'cod' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <p className="font-bold mb-1">Cash on Delivery</p>
                  <p>Pay cash to the delivery rider upon receiving your order. Available within Nairobi and major towns.</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm font-semibold text-liban-muted hover:text-liban-dark cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-brand-red text-white rounded font-semibold text-sm hover:bg-brand-redDark transition-colors flex items-center gap-2 cursor-pointer">
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-bold text-liban-dark">Order Review</h3>
              <div className="border border-liban-border rounded overflow-hidden divide-y divide-liban-border max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 text-xs">
                    <img src={item.product.images?.[0]} alt={item.product.name} className="w-10 h-10 rounded object-cover bg-gray-50" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <p className="font-semibold text-liban-dark">{item.product.name}</p>
                      <p className="text-liban-muted">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono font-bold text-liban-dark">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 border border-liban-border rounded">
                  <p className="text-liban-muted font-bold mb-1 uppercase text-xs">Delivering to</p>
                  <p className="font-bold text-liban-dark">{address.fullName || 'Not set'}</p>
                  <p className="text-liban-muted">{address.street}</p>
                  <p className="text-liban-muted">{address.city}, {address.county}</p>
                </div>
                <div className="p-3 bg-gray-50 border border-liban-border rounded">
                  <p className="text-liban-muted font-bold mb-1 uppercase text-xs">Payment</p>
                  <p className="font-bold text-liban-dark uppercase">{paymentMethod}</p>
                  <p className="text-liban-muted">{shippingMethod.name}</p>
                  <p className="text-green-700 font-semibold">{shippingMethod.estimatedDays}</p>
                </div>
              </div>
              <div className="p-4 bg-liban-dark text-white rounded space-y-2 text-xs">
                <div className="flex justify-between text-gray-300"><span>Subtotal</span><span className="font-mono">{formatPrice(cartSubtotal)}</span></div>
                {cartDiscount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span className="font-mono">-{formatPrice(cartDiscount)}</span></div>}
                <div className="flex justify-between text-gray-300"><span>Delivery</span><span className="font-mono">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between text-gray-300"><span>VAT (16%)</span><span className="font-mono">{formatPrice(cartTax)}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-700 text-sm font-bold">
                  <span>Grand Total</span><span className="font-mono text-brand-red text-base">{formatPrice(finalTotal)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button onClick={() => { if (!address.fullName.trim() || !address.email.trim() || !address.phone.trim() || !address.street.trim()) { alert('Please fill in all delivery fields before continuing.'); return; } setStep(2); }} className="flex items-center gap-1.5 text-sm font-semibold text-liban-muted hover:text-liban-dark cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={handlePlaceOrder} disabled={isProcessing} className="px-8 py-3 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                  <ShieldCheck className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Confirm & Place Order'}
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-liban-dark">Order Placed!</h3>
                <p className="text-sm text-liban-muted mt-1">Thank you! We are preparing your order now.</p>
              </div>
              <div className="p-4 bg-gray-50 border border-liban-border rounded max-w-sm mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-liban-border pb-2"><span className="text-liban-muted">Order Number</span><span className="font-mono font-bold text-liban-dark">{placedOrderNumber}</span></div>
                <div className="flex justify-between border-b border-liban-border pb-2"><span className="text-liban-muted">Address</span><span className="text-liban-dark">{address.street}, {address.city}</span></div>
                <div className="flex justify-between"><span className="text-liban-muted">Contact</span><span className="text-liban-dark">{address.email}</span></div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => { setCheckoutModalOpen(false); setOrderTrackerOpen(true); }} className="px-6 py-2.5 bg-brand-red text-white rounded font-bold text-sm hover:bg-brand-redDark flex items-center gap-2 cursor-pointer">
                  <Package className="w-4 h-4" /> Track Order
                </button>
                <button onClick={() => setCheckoutModalOpen(false)} className="px-6 py-2.5 border border-liban-border text-liban-dark rounded font-bold text-sm hover:bg-gray-50 cursor-pointer">Continue Shopping</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};


