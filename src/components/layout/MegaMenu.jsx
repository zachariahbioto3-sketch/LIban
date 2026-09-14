import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronDown, Menu } from 'lucide-react';

export const MegaMenu = () => {
  const { setPrimaryCategory, setSecondaryCategory, filters, categories } = useStore();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-white border-b border-liban-border relative z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-3 font-semibold text-sm mr-2 hover:bg-brand-redDark transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline">CATEGORIES</span>
        </button>
        <nav className="flex items-center overflow-x-auto scrollbar-none">
          <button
            onClick={() => setPrimaryCategory('all')}
            className={'px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 ' + (filters.primaryCategory === 'all' ? 'border-brand-red text-brand-red' : 'border-transparent text-liban-dark hover:text-brand-red')}
          >
            HOME
          </button>
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setHoveredCategory(cat.slug)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => setPrimaryCategory(cat.slug)}
                className={'flex items-center gap-1 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer border-b-2 ' + (filters.primaryCategory === cat.slug ? 'border-brand-red text-brand-red' : 'border-transparent text-liban-dark hover:text-brand-red')}
              >
                {cat.name}
                <ChevronDown className="w-3 h-3" />
              </button>
              {hoveredCategory === cat.slug && cat.subcategories?.length > 0 && (
                <div className="absolute top-full left-0 bg-white border border-liban-border shadow-lg rounded-b min-w-48 py-2 z-50">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => { setPrimaryCategory(cat.slug); setSecondaryCategory(sub.slug); setHoveredCategory(null); }}
                      className="w-full text-left px-4 py-2 text-sm text-liban-dark hover:bg-gray-50 hover:text-brand-red transition-colors cursor-pointer"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      {mobileOpen && (
        <div className="border-t border-liban-border bg-white px-4 py-3 space-y-2 lg:hidden">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <button onClick={() => { setPrimaryCategory(cat.slug); setMobileOpen(false); }} className="w-full text-left px-3 py-2 font-semibold text-sm text-liban-dark hover:text-brand-red transition-colors cursor-pointer">
                {cat.name}
              </button>
              <div className="pl-4 grid grid-cols-2 gap-1">
                {cat.subcategories?.map((sub) => (
                  <button key={sub.slug} onClick={() => { setPrimaryCategory(cat.slug); setSecondaryCategory(sub.slug); setMobileOpen(false); }} className="text-left px-2 py-1 text-xs text-liban-muted hover:text-brand-red transition-colors cursor-pointer">
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
