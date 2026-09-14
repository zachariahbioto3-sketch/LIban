import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { useProductDetail } from '../../hooks/useCatalog';
import { X, Star, Heart, ShoppingBag, Zap, Truck, ShieldCheck, RefreshCw, Check, MessageSquarePlus, Share2, ChevronRight, Minus, Plus, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductRecommendations } from './ProductRecommendations';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, formatPrice, addToCart, quickBuyProduct, isInWishlist, toggleWishlist, addReview, showToast } = useStore();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(undefined);
  const [selectedSize, setSelectedSize] = useState(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const modalScrollRef = useRef(null);
  const recommendationsRef = useRef(null);

  // Fetch full product detail from API when modal opens
  const { data: fullProduct, isLoading } = useProductDetail(selectedProduct?.id);
  const product = fullProduct || selectedProduct;

  if (!selectedProduct) return null;

  const inWishlist = isInWishlist(product.id);

  // Normalise field names — detail endpoint returns full objects
  const images = product.images?.map((i) => i.url || i) ?? (product.primary_image ? [product.primary_image] : []);
  const price = parseFloat(product.price);
  const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
  const stockCount = product.stock_count ?? product.stockCount ?? 0;
  const reviewCount = product.review_count ?? product.reviewCount ?? 0;
  const shippingInfo = product.shipping_info ?? product.shippingInfo ?? '';
  const categoryName = product.category?.name ?? product.category ?? '';
  const features = product.features?.map((f) => f.text ?? f) ?? [];
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const currentColor = selectedColor || product.colors?.[0]?.name;
  const currentSize = selectedSize || product.sizes?.[0];

  const handleAddToCart = () => { addToCart(product, quantity, currentColor, currentSize); };
  const handleBuyNow = () => { quickBuyProduct(product, currentColor, currentSize); setSelectedProduct(null); };
  const handleShare = () => { if (navigator.clipboard) { navigator.clipboard.writeText(window.location.href); showToast('Link Copied', 'Product link copied!', 'info'); } };
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) { showToast('Incomplete', 'Please fill all fields.', 'error'); return; }
    addReview(product.id, { author: authorName, rating: ratingScore, title: reviewTitle, comment: reviewComment, verifiedPurchase: true });
    setAuthorName(''); setReviewTitle(''); setReviewComment(''); setShowReviewForm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-5xl bg-white rounded shadow-2xl z-10 my-6 overflow-hidden">
          <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 p-2 bg-white border border-liban-border rounded-full text-liban-muted hover:text-liban-dark hover:border-brand-red transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            </div>
          )}
          <div ref={modalScrollRef} className="max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 bg-gray-50 border-r border-liban-border">
                <div className="relative aspect-square rounded overflow-hidden bg-white border border-liban-border mb-4">
                  <img src={images[activeImg] || images[0] || 'https://placehold.co/600x600?text=No+Image'} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {discount > 0 && <div className="ribbon">{discount}% OFF</div>}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button key={idx} onClick={() => setActiveImg(idx)} className={'w-16 h-16 rounded border-2 overflow-hidden shrink-0 transition-all cursor-pointer ' + (activeImg === idx ? 'border-brand-red' : 'border-liban-border opacity-60 hover:opacity-100')}>
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-liban-border text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-brand-red" />
                    <span className="text-xs font-bold text-liban-dark">Free Delivery</span>
                    <span className="text-xs text-liban-muted">Nairobi & beyond</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-brand-red" />
                    <span className="text-xs font-bold text-liban-dark">2-Year Warranty</span>
                    <span className="text-xs text-liban-muted">Full coverage</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RefreshCw className="w-4 h-4 text-brand-red" />
                    <span className="text-xs font-bold text-liban-dark">30-Day Return</span>
                    <span className="text-xs text-liban-muted">No questions asked</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-red bg-red-50 px-2 py-0.5 rounded">{categoryName}</span>
                    <button onClick={handleShare} className="flex items-center gap-1 text-xs text-liban-muted hover:text-brand-red cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-liban-dark leading-tight">{product.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => <Star key={s} className={'w-4 h-4 ' + (s <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200')} />)}
                    </div>
                    <span className="text-xs font-bold text-liban-dark">{product.rating}</span>
                    <span className="text-xs text-liban-muted">({reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border border-liban-border rounded flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-brand-red font-mono">{formatPrice(price)}</span>
                      {originalPrice && <span className="text-sm text-liban-muted line-through font-mono">{formatPrice(originalPrice)}</span>}
                    </div>
                    <span className="text-xs text-liban-muted">VAT (16%) included</span>
                  </div>
                  <span className={'text-xs font-bold px-2 py-1 rounded ' + (stockCount > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                    {stockCount > 5 ? 'In Stock' : 'Only ' + stockCount + ' left!'}
                  </span>
                </div>
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-liban-dark mb-2">Color: <span className="font-normal text-liban-muted">{currentColor}</span></p>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((c) => (
                        <button key={c.name} onClick={() => setSelectedColor(c.name)} className={'flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition-all cursor-pointer ' + (currentColor === c.name ? 'border-brand-red bg-red-50 text-brand-red' : 'border-liban-border text-liban-muted hover:border-brand-red')}>
                          <span className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-liban-dark mb-2">Size: <span className="font-normal text-liban-muted">{currentSize}</span></p>
                    <div className="flex gap-2 flex-wrap">
                      {product.sizes.map((sz) => (
                        <button key={sz} onClick={() => setSelectedSize(sz)} className={'px-3 py-1.5 rounded border text-xs font-semibold transition-all cursor-pointer ' + (currentSize === sz ? 'bg-brand-red text-white border-brand-red' : 'border-liban-border text-liban-muted hover:border-brand-red hover:text-brand-red')}>
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-liban-border rounded overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-liban-muted hover:text-liban-dark hover:bg-gray-50 transition-colors cursor-pointer font-bold"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-10 text-center text-sm font-bold font-mono">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(stockCount, quantity + 1))} className="w-8 h-8 flex items-center justify-center text-liban-muted hover:text-liban-dark hover:bg-gray-50 transition-colors cursor-pointer font-bold"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 py-2.5 bg-brand-red text-white rounded font-bold text-sm hover:bg-brand-redDark transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button onClick={() => toggleWishlist(product)} className={'p-2.5 rounded border transition-all cursor-pointer ' + (inWishlist ? 'border-brand-red bg-red-50 text-brand-red' : 'border-liban-border text-liban-muted hover:border-brand-red hover:text-brand-red')}>
                    <Heart className={'w-4 h-4 ' + (inWishlist ? 'fill-current' : '')} />
                  </button>
                </div>
                <button onClick={handleBuyNow} className="w-full py-2.5 bg-liban-dark text-white rounded font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Zap className="w-4 h-4 text-brand-red fill-current" />
                  Buy Now - Pay via M-Pesa or Card
                </button>
                <div className="border-t border-liban-border pt-4">
                  <div className="flex gap-4 border-b border-liban-border mb-4">
                    {['details','specs','reviews'].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={'pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ' + (activeTab === tab ? 'border-brand-red text-brand-red' : 'border-transparent text-liban-muted hover:text-liban-dark')}>
                        {tab === 'reviews' ? 'Reviews (' + (product.reviews?.length || 0) + ')' : tab}
                      </button>
                    ))}
                  </div>
                  {activeTab === 'details' && (
                    <div className="space-y-3">
                      <p className="text-xs text-liban-muted leading-relaxed">{product.description}</p>
                      {features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-liban-dark">
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" /> {f}
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'specs' && (
                    <div className="space-y-2">
                      {product.specs && Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1.5 border-b border-liban-border text-xs">
                          <span className="text-liban-muted font-medium">{key}</span>
                          <span className="font-semibold text-liban-dark">{val}</span>
                        </div>
                      ))}
                      <p className="text-xs text-liban-muted pt-2 italic">{shippingInfo}</p>
                      <button
                        onClick={() => recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full mt-3 py-2 px-3 rounded bg-red-50 hover:bg-red-100 text-brand-red text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-red-200"
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Bundle and Save 10% with accessories</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-liban-dark">{product.reviews?.length || 0} Reviews</span>
                        <button onClick={() => setShowReviewForm(!showReviewForm)} className="flex items-center gap-1 text-xs font-bold text-brand-red hover:underline cursor-pointer">
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                      </div>
                      {showReviewForm && (
                        <form onSubmit={handleReviewSubmit} className="p-3 bg-gray-50 border border-liban-border rounded space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs font-semibold text-liban-muted block mb-1">Name</label>
                              <input type="text" required value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-2 py-1.5 border border-liban-border rounded text-xs focus:outline-none focus:border-brand-red" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-liban-muted block mb-1">Rating</label>
                              <select value={ratingScore} onChange={(e) => setRatingScore(Number(e.target.value))} className="w-full px-2 py-1.5 border border-liban-border rounded text-xs focus:outline-none focus:border-brand-red">
                                {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-liban-muted block mb-1">Review Title</label>
                            <input type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} className="w-full px-2 py-1.5 border border-liban-border rounded text-xs focus:outline-none focus:border-brand-red" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-liban-muted block mb-1">Comment</label>
                            <textarea required value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3} className="w-full px-2 py-1.5 border border-liban-border rounded text-xs focus:outline-none focus:border-brand-red resize-none" />
                          </div>
                          <button type="submit" className="w-full py-2 bg-brand-red text-white rounded text-xs font-bold hover:bg-brand-redDark transition-colors cursor-pointer">Submit Review</button>
                        </form>
                      )}
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {product.reviews?.map((rev) => (
                          <div key={rev.id} className="p-3 bg-gray-50 border border-liban-border rounded text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-liban-dark">{rev.author}</span>
                              <span className="text-liban-muted">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 my-1">
                              {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                              {rev.verifiedPurchase && <span className="text-green-700 ml-1 font-semibold text-xs">Verified</span>}
                            </div>
                            <p className="font-semibold text-liban-dark">{rev.title}</p>
                            <p className="text-liban-muted mt-0.5">{rev.comment}</p>
                          </div>
                        ))}
                        {(!product.reviews || product.reviews.length === 0) && <p className="text-xs text-liban-muted text-center py-4">No reviews yet. Be the first!</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div ref={recommendationsRef} className="p-6 bg-gray-50 border-t border-liban-border">
              <ProductRecommendations
                currentProduct={product}
                onSelectProduct={(newProduct) => {
                  setSelectedProduct(newProduct);
                  setActiveImg(0);
                  setSelectedColor(undefined);
                  setSelectedSize(undefined);
                  if (modalScrollRef.current) modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
