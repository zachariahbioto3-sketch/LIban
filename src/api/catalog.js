import { api } from './client';

function buildProductParams(filters = {}) {
  const params = new URLSearchParams();
  if (filters.primaryCategory && filters.primaryCategory !== 'all')
    params.set('category', filters.primaryCategory);
  if (filters.secondaryCategory && filters.secondaryCategory !== 'all')
    params.set('subcategory', filters.secondaryCategory);
  if (filters.searchQuery?.trim())
    params.set('search', filters.searchQuery.trim());
  if (filters.minPrice != null && filters.minPrice > 0)
    params.set('min_price', filters.minPrice);
  if (filters.maxPrice != null && filters.maxPrice < 500000)
    params.set('max_price', filters.maxPrice);
  if (filters.minRating && filters.minRating > 0)
    params.set('min_rating', filters.minRating);
  if (filters.inStockOnly)
    params.set('in_stock', 'true');
  const sortMap = {
    'price-low': 'price',
    'price-high': '-price',
    'rating': '-rating',
    'newest': '-created_at',
    'featured': '-created_at',
  };
  if (filters.sortBy && sortMap[filters.sortBy])
    params.set('ordering', sortMap[filters.sortBy]);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const catalogApi = {
  getCategories: () => api.get('/catalog/categories/'),
  getProducts: (filters) => api.get(`/catalog/products/${buildProductParams(filters)}`),
  getProduct: (id) => api.get(`/catalog/products/${id}/`),
};
