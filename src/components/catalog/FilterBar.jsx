import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { RotateCcw, X } from 'lucide-react';

export const FilterBar = () => {
  const { filters, setFilters, setSecondaryCategory, resetFilters, filteredProducts, formatPrice } = useStore();
  const activeCategory = CATEGORIES.find((c) => c.id === filters.primaryCategory);

  return (
    <div className="space-y-3">
      <div className="bg-white border border-liban-border rounded p-3 flex flex-wrap items-center gap-3">
        <span className="text-xs text-liban-muted font-semibold">{filteredProducts.length} products found</span>
        {activeCategory && (
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-liban-dark shrink-0">Filter by:</span>
            {activeCategory.secondary.map((sub) => (
              <button key={sub.id} onClick={() => setSecondaryCategory(sub.id)} className={'px-3 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer whitespace-nowrap ' + (filters.secondaryCategory === sub.id ? 'bg-brand-red text-white border-brand-red' : 'border-liban-border text-liban-muted hover:border-brand-red hover:text-brand-red')}>
                {sub.label}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-1.5 text-xs font-medium text-liban-dark cursor-pointer">
            <input type="checkbox" checked={filters.inStockOnly} onChange={(e) => setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))} className="accent-brand-red" />
            In Stock
          </label>
          <select value={filters.sortBy} onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))} className="text-xs border border-liban-border rounded px-2 py-1 focus:outline-none focus:border-brand-red cursor-pointer">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
          {(filters.primaryCategory !== 'all' || filters.secondaryCategory !== 'all' || filters.searchQuery) && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-brand-red hover:underline cursor-pointer">
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
