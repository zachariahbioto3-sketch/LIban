import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { CURRENCIES } from '../data/products';
import { CATEGORIES } from '../data/categories';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [currency, setCurrency] = useState('KES');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderTrackerOpen, setOrderTrackerOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrderToTrack, setActiveOrderToTrack] = useState(null);
  const [activeCoupon, setActiveCoupon] = useState(null);

  const [filters, setFilters] = useState({
    primaryCategory: 'all',
    secondaryCategory: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 500000,
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  const formatPrice = useCallback((amount) => {
    const curr = CURRENCIES[currency];
    const converted = amount * curr.rate;
    if (currency === 'KES') return curr.symbol + ' ' + Math.round(converted).toLocaleString('en-KE');
    return curr.symbol + converted.toFixed(2);
  }, [currency]);

  const showToast = useCallback((title, message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback((product, quantity = 1, selectedColor, selectedSize) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { id: Date.now().toString(), product, quantity, selectedColor, selectedSize, unitPrice: product.price }];
    });
    showToast('Added to Cart', product.name + ' added to your bag.', 'success');
  }, [showToast]);

  const removeFromCart = useCallback((itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity } : i));
    }
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0), [cart]);
  const cartDiscount = useMemo(() => activeCoupon ? Math.round(cartSubtotal * activeCoupon.discountPercent / 100) : 0, [cartSubtotal, activeCoupon]);
  const freeShippingThreshold = 5000;
  const cartShipping = useMemo(() => cartSubtotal >= freeShippingThreshold ? 0 : 350, [cartSubtotal]);
  const cartTax = useMemo(() => Math.round((cartSubtotal - cartDiscount) * 0.16), [cartSubtotal, cartDiscount]);
  const cartTotal = useMemo(() => cartSubtotal - cartDiscount + cartShipping + cartTax, [cartSubtotal, cartDiscount, cartShipping, cartTax]);
  const freeShippingRemaining = useMemo(() => Math.max(0, freeShippingThreshold - cartSubtotal), [cartSubtotal]);

  const COUPONS = { 'LIBAN20': { code: 'LIBAN20', discountPercent: 20 }, 'SAVE10': { code: 'SAVE10', discountPercent: 10 } };

  const applyCoupon = useCallback((code) => {
    const coupon = COUPONS[code.toUpperCase()];
    if (!coupon) return { success: false, message: 'Invalid coupon code.' };
    setActiveCoupon(coupon);
    return { success: true, message: 'Coupon applied!' };
  }, []);

  const removeCoupon = useCallback(() => setActiveCoupon(null), []);

  const isInWishlist = useCallback((productId) => wishlist.some((p) => p.id === productId), [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('Removed', product.name + ' removed from wishlist.', 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      showToast('Saved', product.name + ' added to wishlist.', 'success');
      return [...prev, product];
    });
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.primaryCategory !== 'all') result = result.filter((p) => p.category === filters.primaryCategory);
    if (filters.secondaryCategory !== 'all') result = result.filter((p) => p.subcategory === filters.secondaryCategory);
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q));
    }
    if (filters.inStockOnly) result = result.filter((p) => p.stockCount > 0);
    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (filters.minRating > 0) result = result.filter((p) => p.rating >= filters.minRating);
    switch (filters.sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => b.id.localeCompare(a.id)); break;
      default: break;
    }
    return result;
  }, [products, filters]);

  const setPrimaryCategory = useCallback((id) => {
    setFilters((prev) => ({ ...prev, primaryCategory: id, secondaryCategory: 'all' }));
  }, []);

  const setSecondaryCategory = useCallback((id) => {
    setFilters((prev) => ({ ...prev, secondaryCategory: id }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ primaryCategory: 'all', secondaryCategory: 'all', searchQuery: '', minPrice: 0, maxPrice: 500000, minRating: 0, inStockOnly: false, sortBy: 'featured' });
  }, []);

  const createOrder = useCallback((orderData) => {
    const orderNumber = 'LIB-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      ...orderData, id: Date.now().toString(), orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      timeline: [
        { status: 'Order Placed', completed: true, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), description: 'Your order has been received.', location: 'Liban Warehouse, Nairobi' },
        { status: 'Processing', completed: false, date: '--', time: '--:--', description: 'Order is being packed.', location: 'Liban Fulfilment Centre' },
        { status: 'Shipped', completed: false, date: '--', time: '--:--', description: 'Package handed to courier.', location: 'In Transit' },
        { status: 'Out for Delivery', completed: false, date: '--', time: '--:--', description: 'Driver is on the way.', location: orderData.shippingAddress?.city || 'Nairobi' },
        { status: 'Delivered', completed: false, date: '--', time: '--:--', description: 'Package delivered successfully.', location: orderData.shippingAddress?.street || '' },
      ],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveCoupon(null);
    return newOrder;
  }, []);

  const lookupOrder = useCallback((query) => {
    return orders.find((o) => o.orderNumber.toLowerCase() === query.toLowerCase() || o.shippingAddress?.email?.toLowerCase() === query.toLowerCase());
  }, [orders]);

  const addReview = useCallback((productId, review) => {
    const newReview = { ...review, id: 'r' + Date.now(), date: new Date().toLocaleDateString('en-KE') };
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, reviews: [...(p.reviews || []), newReview], reviewCount: (p.reviewCount || 0) + 1 } : p));
    showToast('Review Submitted', 'Thank you for your feedback!', 'success');
  }, [showToast]);

  const quickBuyProduct = useCallback((product, selectedColor, selectedSize) => {
    addToCart(product, 1, selectedColor, selectedSize);
    setCheckoutModalOpen(true);
  }, [addToCart]);

  return (
    <StoreContext.Provider value={{
      products, filteredProducts, currency, setCurrency,
      cart, cartCount, cartSubtotal, cartDiscount, cartShipping, cartTax, cartTotal,
      freeShippingThreshold, freeShippingRemaining,
      addToCart, removeFromCart, updateQuantity,
      wishlist, isInWishlist, toggleWishlist,
      filters, setFilters, setPrimaryCategory, setSecondaryCategory, resetFilters,
      selectedProduct, setSelectedProduct,
      cartDrawerOpen, setCartDrawerOpen,
      wishlistDrawerOpen, setWishlistDrawerOpen,
      checkoutModalOpen, setCheckoutModalOpen,
      orderTrackerOpen, setOrderTrackerOpen,
      orders, activeOrderToTrack, setActiveOrderToTrack,
      activeCoupon, applyCoupon, removeCoupon,
      toasts, showToast, removeToast,
      formatPrice, createOrder, lookupOrder,
      addReview, quickBuyProduct,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};


