import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { formatPrice, addToCart, isInWishlist, toggleWishlist, setSelectedProduct } = useStore();
  const [added, setAdded] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const price = parseFloat(product.price);
  const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const image = product.primary_image || 'https://placehold.co/400x400?text=No+Image';

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0]?.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="bg-white border border-liban-border rounded group cursor-pointer hover:border-brand-red hover:shadow-card transition-all relative overflow-hidden flex flex-col"
    >
      {discount > 0 && <div className="ribbon">{discount}%</div>}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          referrerPolicy="no-referrer"
        />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className={'absolute top-2 right-2 p-1.5 rounded-full bg-white border border-liban-border shadow-sm transition-all cursor-pointer ' + (inWishlist ? 'text-brand-red' : 'text-liban-muted hover:text-brand-red')}
        >
          <Heart className={'w-4 h-4 ' + (inWishlist ? 'fill-current' : '')} />
        </button>
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
            className="w-full py-2 bg-liban-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 rounded hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-liban-muted mb-1">{product.subcategory_slug}</p>
          <h3 className="text-sm font-semibold text-liban-dark group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-liban-dark">{product.rating}</span>
            <span className="text-xs text-liban-muted">({product.review_count})</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-liban-border flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-brand-red font-mono">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-xs text-liban-muted line-through font-mono ml-1.5">{formatPrice(originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={'p-2 rounded transition-all cursor-pointer shadow-sm ' + (added ? 'bg-green-600 text-white' : 'bg-brand-red text-white hover:bg-brand-redDark')}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
