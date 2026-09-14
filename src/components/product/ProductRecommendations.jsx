import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Check, ShoppingBag, Sparkles, Zap, Star, Heart, Layers, Tag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductRecommendations = ({ currentProduct, onSelectProduct }) => {
  const { products, formatPrice, addToCart, isInWishlist, toggleWishlist, showToast, setCartDrawerOpen } = useStore();
  const [activeTab, setActiveTab] = useState('smart');
  const [selectedBundleItemIds, setSelectedBundleItemIds] = useState([]);
  const [bundleAdded, setBundleAdded] = useState(false);

  const bundleCompanionProducts = useMemo(() => {
    const pool = products.filter((p) => p.id !== currentProduct.id);
    const accessories = pool.filter((p) => p.category === 'accessories' || p.category === currentProduct.category);
    if (accessories.length >= 2) return accessories.slice(0, 2);
    return pool.slice(0, 2);
  }, [products, currentProduct]);

  useMemo(() => {
    setSelectedBundleItemIds(bundleCompanionProducts.map((p) => p.id));
    setBundleAdded(false);
  }, [currentProduct.id, bundleCompanionProducts]);

  const toggleBundleItem = (id) => {
    setSelectedBundleItemIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const activeBundleCompanions = useMemo(() => bundleCompanionProducts.filter((p) => selectedBundleItemIds.includes(p.id)), [bundleCompanionProducts, selectedBundleItemIds]);
  const bundleRawTotal = useMemo(() => currentProduct.price + activeBundleCompanions.reduce((acc, p) => acc + p.price, 0), [currentProduct.price, activeBundleCompanions]);
  const BUNDLE_DISCOUNT_PERCENT = 10;
  const bundleDiscountAmount = activeBundleCompanions.length > 0 ? (bundleRawTotal * BUNDLE_DISCOUNT_PERCENT) / 100 : 0;
  const bundleFinalTotal = bundleRawTotal - bundleDiscountAmount;

  const handleAddBundleToCart = () => {
    addToCart(currentProduct, 1);
    activeBundleCompanions.forEach((comp) => addToCart(comp, 1));
    setBundleAdded(true);
    showToast('Bundle Added!', `Added ${1 + activeBundleCompanions.length} items with ${BUNDLE_DISCOUNT_PERCENT}% bundle savings.`, 'success');
    setTimeout(() => setCartDrawerOpen(true), 400);
    setTimeout(() => setBundleAdded(false), 2500);
  };

  const tabRecommendations = useMemo(() => {
    const others = products.filter((p) => p.id !== currentProduct.id);
    switch (activeTab) {
      case 'smart':
        return [...others].map((item) => {
          let score = 0;
          if (item.category === currentProduct.category) score += 3;
          const sharedTags = (item.tags || []).filter((t) => (currentProduct.tags || []).includes(t));
          score += sharedTags.length * 2;
          if (item.rating >= 4.8) score += 1;
          return { item, score };
        }).sort((a, b) => b.score - a.score || b.item.rating - a.item.rating).map((e) => e.item).slice(0, 4);
      case 'accessories':
        const accs = others.filter((p) => p.category === 'accessories');
        return accs.length >= 2 ? accs.slice(0, 4) : others.slice(0, 4);
      case 'category':
        const catMatches = others.filter((p) => p.category === currentProduct.category);
        return catMatches.length >= 2 ? catMatches.slice(0, 4) : others.slice(0, 4);
      case 'deals':
        return others.filter((p) => p.originalPrice && p.originalPrice > p.price).sort((a, b) => {
          const dA = (a.originalPrice - a.price) / a.originalPrice;
          const dB = (b.originalPrice - b.price) / b.originalPrice;
          return dB - dA;
        }).slice(0, 4);
      default:
        return others.slice(0, 4);
    }
  }, [products, currentProduct, activeTab]);

  return (
    <div className="w-full pt-8 pb-4 space-y-8 border-t border-liban-border">
      <section className="bg-gray-50 rounded p-5 border border-liban-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-brand-red text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-liban-dark">Frequently Bought Together</h3>
              <p className="text-xs text-liban-muted">Bundle & unlock an instant <strong className="text-brand-red">{BUNDLE_DISCOUNT_PERCENT}% discount</strong></p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded bg-red-50 text-brand-red text-xs font-bold border border-red-200">Smart Match</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-1/3 p-3 bg-white rounded border-2 border-brand-red flex flex-col items-center text-center relative">
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-red text-white text-xs font-bold">Main</span>
              <div className="w-20 h-20 rounded overflow-hidden bg-gray-50 my-2">
                <img src={currentProduct.images?.[0]} alt={currentProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h4 className="text-xs font-bold text-liban-dark line-clamp-1 w-full">{currentProduct.name}</h4>
              <span className="text-xs font-bold text-brand-red font-mono mt-1">{formatPrice(currentProduct.price)}</span>
            </div>
            {bundleCompanionProducts.map((companion) => {
              const isSelected = selectedBundleItemIds.includes(companion.id);
              return (
                <React.Fragment key={companion.id}>
                  <div className="w-8 h-8 rounded-full bg-red-50 text-brand-red flex items-center justify-center font-bold shrink-0 border border-red-200">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div onClick={() => toggleBundleItem(companion.id)} className={'w-full sm:w-1/3 p-3 bg-white rounded border-2 transition-all flex flex-col items-center text-center relative cursor-pointer ' + (isSelected ? 'border-brand-red' : 'border-liban-border opacity-60 hover:opacity-100')}>
                    <div className="absolute top-2 right-2">
                      <input type="checkbox" checked={isSelected} onChange={(e) => { e.stopPropagation(); toggleBundleItem(companion.id); }} className="w-4 h-4 cursor-pointer" />
                    </div>
                    <div className="w-20 h-20 rounded overflow-hidden bg-gray-50 my-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelectProduct(companion); }}>
                      <img src={companion.images?.[0]} alt={companion.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <h4 className="text-xs font-bold text-liban-dark line-clamp-1 w-full cursor-pointer hover:text-brand-red" onClick={(e) => { e.stopPropagation(); onSelectProduct(companion); }}>{companion.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1 font-mono">
                      <span className="text-xs font-bold text-liban-dark">{formatPrice(companion.price)}</span>
                      {companion.originalPrice && <span className="text-xs text-liban-muted line-through">{formatPrice(companion.originalPrice)}</span>}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="lg:col-span-4 p-5 bg-white rounded border border-liban-border flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-liban-muted mb-1">
                <span>Total for {1 + activeBundleCompanions.length} items:</span>
                {bundleDiscountAmount > 0 && <span className="line-through font-mono">{formatPrice(bundleRawTotal)}</span>}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-brand-red font-mono">{formatPrice(bundleFinalTotal)}</span>
                {bundleDiscountAmount > 0 && <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-bold">Save {formatPrice(bundleDiscountAmount)}</span>}
              </div>
              <p className="text-xs text-liban-muted mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>All items under 2-Year LIBAN Warranty</span>
              </p>
            </div>
            <button onClick={handleAddBundleToCart} disabled={bundleAdded} className={'w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ' + (bundleAdded ? 'bg-green-600 text-white' : 'bg-brand-red hover:bg-brand-redDark text-white')}>
              {bundleAdded ? <><Check className="w-4 h-4" /><span>Bundle Added!</span></> : <><ShoppingBag className="w-4 h-4" /><span>Add Bundle � {formatPrice(bundleFinalTotal)}</span></>}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-liban-border">
          <div>
            <h3 className="text-base font-bold text-liban-dark">Recommended for You</h3>
            <p className="text-xs text-liban-muted">Hand-picked based on this product</p>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[['smart','Smart Picks',Sparkles,'text-yellow-400'],['accessories','Accessories',Zap,'text-brand-red'],['category','Similar',Layers,'text-green-600'],['deals','Deals',Tag,'text-brand-red']].map(([tab, label, Icon, iconClass]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={'px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ' + (activeTab === tab ? 'bg-liban-dark text-white' : 'bg-gray-100 text-liban-muted hover:bg-gray-200')}>
                <Icon className={'w-3 h-3 ' + iconClass} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {tabRecommendations.map((rec) => {
              const inWishlist = isInWishlist(rec.id);
              const discount = rec.originalPrice ? Math.round(((rec.originalPrice - rec.price) / rec.originalPrice) * 100) : 0;
              return (
                <motion.div key={rec.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="group bg-white rounded border border-liban-border overflow-hidden hover:shadow-card hover:border-brand-red transition-all flex flex-col relative">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img src={rec.images?.[0]} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {rec.tags?.[0] && <span className="px-2 py-0.5 rounded bg-liban-dark text-white text-xs font-bold">{rec.tags[0]}</span>}
                      {discount > 0 && <span className="px-2 py-0.5 rounded bg-brand-red text-white text-xs font-bold">-{discount}%</span>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(rec); }} className={'absolute top-2 right-2 p-1.5 rounded-full transition-all cursor-pointer ' + (inWishlist ? 'bg-red-50 text-brand-red' : 'bg-white text-liban-muted hover:text-brand-red opacity-0 group-hover:opacity-100')}>
                      <Heart className={'w-3.5 h-3.5 ' + (inWishlist ? 'fill-current' : '')} />
                    </button>
                  </div>
                  <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <span className="text-xs font-bold text-brand-red uppercase tracking-wider block mb-0.5">{rec.category}</span>
                      <h4 onClick={() => onSelectProduct(rec)} className="text-xs font-bold text-liban-dark line-clamp-1 group-hover:text-brand-red transition-colors cursor-pointer">{rec.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-bold text-liban-dark">{rec.rating}</span>
                        <span className="text-xs text-liban-muted">({rec.reviewCount})</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-liban-border flex items-center justify-between gap-2">
                      <div className="font-mono">
                        <span className="text-xs font-bold text-brand-red block">{formatPrice(rec.price)}</span>
                        {rec.originalPrice && <span className="text-xs text-liban-muted line-through block">{formatPrice(rec.originalPrice)}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => onSelectProduct(rec)} className="px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-liban-dark text-xs font-bold transition-colors cursor-pointer">View</button>
                        <button onClick={() => addToCart(rec, 1)} className="p-1.5 rounded bg-brand-red hover:bg-brand-redDark text-white transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};



