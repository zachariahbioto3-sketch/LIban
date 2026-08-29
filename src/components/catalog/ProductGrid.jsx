import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FilterBar } from './FilterBar';
import { PackageX } from 'lucide-react';

export const ProductGrid = () => {
  const { filteredProducts, resetFilters, filters } = useStore();
  const title = filters.primaryCategory === 'all' ? 'Featured Products' : filters.primaryCategory.charAt(0).toUpperCase() + filters.primaryCategory.slice(1);

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-liban-dark">{title}</h2>
      </div>
      <FilterBar />
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-liban-border rounded space-y-4">
          <PackageX className="w-12 h-12 text-liban-muted mx-auto" />
          <h3 className="font-bold text-liban-dark">No products found</h3>
          <p className="text-sm text-liban-muted">Try adjusting your filters.</p>
          <button onClick={resetFilters} className="px-6 py-2 bg-brand-red text-white rounded font-semibold text-sm hover:bg-brand-redDark transition-colors cursor-pointer">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
