import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { ArrowRight, ChevronRight, ChevronLeft, Zap, Shield, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: 1,
    badge: 'UP TO 60% OFF',
    title: 'SMART TECH',
    subtitle: 'FOR KENYA',
    description: 'Premium electronics delivered across Kenya. M-Pesa accepted.',
    cta: 'SHOP ELECTRONICS',
    category: 'electronics',
    bg: 'from-gray-900 via-slate-900 to-gray-900',
    accent: '#E63946',
    glow: 'radial-gradient(ellipse at right, #E6394640, transparent)',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    badge: 'NEW ARRIVALS',
    title: 'FRESH FITS',
    subtitle: 'EVERY SEASON',
    description: 'Latest fashion for men, women & kids. Style meets affordability.',
    cta: 'SHOP FASHION',
    category: 'clothing',
    bg: 'from-indigo-950 via-purple-950 to-indigo-950',
    accent: '#6366F1',
    glow: 'radial-gradient(ellipse at right, #6366F140, transparent)',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    badge: 'BEST SELLERS',
    title: 'TOP RATED',
    subtitle: 'FOOTWEAR',
    description: 'Sneakers, formals & sandals. Free delivery on orders above KSh 5,000.',
    cta: 'SHOP FOOTWEAR',
    category: 'footwear',
    bg: 'from-emerald-950 via-teal-950 to-emerald-950',
    accent: '#10B981',
    glow: 'radial-gradient(ellipse at right, #10B98140, transparent)',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    badge: 'FLASH SALE',
    title: 'HOME',
    subtitle: 'APPLIANCES',
    description: 'Upgrade your home with top brands. Warranty included on all items.',
    cta: 'SHOP APPLIANCES',
    category: 'appliances',
    bg: 'from-orange-950 via-red-950 to-orange-950',
    accent: '#F4845F',
    glow: 'radial-gradient(ellipse at right, #F4845F40, transparent)',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&auto=format&fit=crop&q=80',
  },
];

const PERKS = [
  { icon: Truck, label: 'Free Delivery', sub: 'Orders above KSh 5,000' },
  { icon: Shield, label: '2-Year Warranty', sub: 'On all electronics' },
  { icon: Zap, label: 'M-Pesa Accepted', sub: 'Fast & secure payment' },
];

export const HeroBanner = () => {
  const { setPrimaryCategory } = useStore();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next, paused]);

  const slide = SLIDES[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const handleShopNow = () => {
    setPrimaryCategory(slide.category);
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-4 space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <div className="hidden lg:block lg:col-span-3 bg-white border border-liban-border rounded-xl overflow-hidden shadow-card">
          <div className="bg-brand-red text-white px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-sm">ALL CATEGORIES</span>
          </div>
          <ul className="divide-y divide-liban-border">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => { setPrimaryCategory(cat.id); document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-liban-dark hover:text-brand-red hover:bg-liban-accentLight transition-colors cursor-pointer group">
                  <span>{cat.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-liban-muted group-hover:text-brand-red transition-colors" />
                </button>
              </li>
            ))}
          </ul>
          <div className="p-3 space-y-2 border-t border-liban-border bg-liban-accentLight">
            {PERKS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-liban-border flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-bold text-liban-dark">{label}</p>
                  <p className="text-xs text-liban-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="lg:col-span-9 relative rounded-2xl overflow-hidden min-h-80 flex items-center shadow-soft"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={slide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={'absolute inset-0 bg-gradient-to-br ' + slide.bg}
            >
              <div className="absolute inset-0" style={{ background: slide.glow }} />

              <div className="relative z-10 px-8 py-10 max-w-lg space-y-4 h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="inline-block text-white text-xs font-black px-3 py-1.5 rounded-full border-2 w-fit"
                  style={{ borderColor: slide.accent, backgroundColor: slide.accent + '30' }}
                >
                  {slide.badge}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-4xl sm:text-6xl font-black text-white leading-none tracking-tight"
                >
                  {slide.title}<br />
                  <span style={{ color: slide.accent }}>{slide.subtitle}</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-gray-300 text-sm leading-relaxed max-w-xs"
                >
                  {slide.description}
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  onClick={handleShopNow}
                  className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-black text-sm transition-all cursor-pointer w-fit hover:scale-105 active:scale-95 shadow-glow"
                  style={{ backgroundColor: slide.accent }}
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="absolute right-6 bottom-0 hidden sm:block"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-72 object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i)}
                className={'transition-all cursor-pointer rounded-full ' + (i === current ? 'w-6 h-2' : 'w-2 h-2 bg-white/40 hover:bg-white/70')}
                style={i === current ? { backgroundColor: slide.accent, width: '24px', height: '8px' } : {}}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-xs font-bold">{current + 1} / {SLIDES.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
