import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LIBAN_TELEMETRY, LIBAN_WAYPOINTS } from '../../data/tracking';
import { X, Package, Search, CheckCircle2, Clock, Truck, MapPin, ShieldCheck, Camera, Phone, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderTracker = () => {
  const { orderTrackerOpen, setOrderTrackerOpen, lookupOrder, formatPrice } = useStore();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  if (!orderTrackerOpen) return null;

  const telemetry = LIBAN_TELEMETRY.default;
  const waypoints = LIBAN_WAYPOINTS;

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

  const waypointColor = (status) => {
    if (status === 'completed') return 'bg-liban-success text-white';
    if (status === 'in-progress') return 'bg-brand-red text-white';
    return 'bg-gray-100 text-liban-muted';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOrderTrackerOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-2xl bg-white rounded-xl shadow-soft z-10 overflow-hidden max-h-[90vh] flex flex-col">

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
                <div className="p-4 bg-liban-accentLight border border-liban-border rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between border-b border-liban-border pb-2">
                    <span className="text-liban-muted">Order Number</span>
                    <span className="font-mono font-bold text-liban-dark">{result.orderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-liban-border pb-2">
                    <span className="text-liban-muted">Status</span>
                    <span className="font-bold text-liban-success">{result.status}</span>
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
                          <div className={'w-8 h-8 rounded-full flex items-center justify-center shrink-0 ' + (step.completed ? 'bg-liban-successLight text-liban-success' : 'bg-gray-100 text-liban-muted')}>
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

            <div className="border-t border-liban-border pt-5 space-y-5">
              <h4 className="text-xs font-bold text-liban-muted uppercase tracking-wider">Live Delivery Intelligence</h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Speed', value: telemetry.speed, icon: Truck, color: 'text-brand-red' },
                  { label: 'ETA', value: telemetry.etaMinutes + ' min', icon: Clock, color: 'text-liban-accent' },
                  { label: 'Distance', value: telemetry.distanceRemaining, icon: MapPin, color: 'text-liban-success' },
                  { label: 'Status', value: telemetry.status, icon: CheckCircle2, color: 'text-brand-yellow' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="p-3 bg-liban-accentLight rounded-xl border border-liban-border text-center">
                    <Icon className={'w-4 h-4 mx-auto mb-1 ' + color} />
                    <p className="text-xs font-black text-liban-dark">{value}</p>
                    <p className="text-xs text-liban-muted">{label}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border border-liban-border rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-brand-red">
                  <div className="w-full h-full flex items-center justify-center text-lg font-black text-liban-dark bg-liban-accentLight">
                    {telemetry.driver.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-liban-dark">{telemetry.driver.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-liban-dark">{telemetry.driver.rating}</span>
                    <span className="text-xs text-liban-muted">· {telemetry.driver.completedTrips.toLocaleString()} deliveries</span>
                  </div>
                  <p className="text-xs text-liban-muted mt-0.5">{telemetry.vehiclePlate} · {telemetry.model}</p>
                </div>
                <a href={'tel:' + telemetry.driver.phone} className="p-2.5 bg-liban-success text-white rounded-full hover:bg-green-700 transition-colors cursor-pointer shrink-0">
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              <div>
                <h4 className="text-xs font-bold text-liban-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Delivery Waypoints
                </h4>
                <div className="space-y-2">
                  {waypoints.map((wp, i) => (
                    <div key={wp.id} className="flex items-start gap-3">
                      <div className={'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black ' + waypointColor(wp.status)}>
                        {wp.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : wp.status === 'in-progress' ? <Truck className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                      </div>
                      <div className="flex-1 pb-3 border-b border-liban-border last:border-0">
                        <div className="flex items-center justify-between">
                          <span className={'text-xs font-bold ' + (wp.status === 'upcoming' ? 'text-liban-muted' : 'text-liban-dark')}>{wp.name}</span>
                          <span className="text-xs font-mono text-liban-muted">{wp.time}</span>
                        </div>
                        <p className="text-xs text-brand-red font-semibold">{wp.location}</p>
                        {wp.description && <p className="text-xs text-liban-muted mt-0.5">{wp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-liban-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Cargo Photo Reports
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {telemetry.cargoPhotos.map((photo, i) => (
                    <div key={photo.id} onClick={() => setPhotoIdx(i)} className={'shrink-0 w-32 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ' + (photoIdx === i ? 'border-brand-red' : 'border-liban-border')}>
                      <img src={photo.imageUrl} alt={photo.title} className="w-full h-20 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-1.5">
                        <span className="text-xs font-bold text-liban-dark block truncate">{photo.title}</span>
                        <span className="text-xs text-liban-muted">{photo.timestamp}</span>
                        <span className="block mt-0.5 px-1.5 py-0.5 rounded bg-liban-accentLight text-liban-accent text-xs font-bold w-fit">{photo.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-xl overflow-hidden border border-liban-border">
                  <img src={telemetry.cargoPhotos[photoIdx]?.imageUrl} alt="Cargo" className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-3 bg-liban-accentLight">
                    <p className="text-xs font-bold text-liban-dark">{telemetry.cargoPhotos[photoIdx]?.title}</p>
                    <p className="text-xs text-liban-muted">{telemetry.cargoPhotos[photoIdx]?.location} · {telemetry.cargoPhotos[photoIdx]?.timestamp}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-2 p-3 bg-liban-successLight border border-green-200 rounded-xl text-xs text-green-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-liban-success" />
              <span>Your order is protected under the <strong>LIBAN Buyer Guarantee</strong>. Contact support if anything seems wrong.</span>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
