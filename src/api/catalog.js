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

const normalizeProduct = (p) => ({
  ...p,
  price: parseFloat(p.price),
  originalPrice: p.original_price ? parseFloat(p.original_price) : null,
  images: p.images?.length
    ? p.images.map(i => (typeof i === 'string' ? i : i.url))
    : p.primary_image ? [p.primary_image] : [],
  features: p.features?.length
    ? p.features.map(f => (typeof f === 'string' ? f : f.text))
    : [],
  category: typeof p.category === 'object' ? p.category?.slug : (p.category ?? p.category_slug ?? ''),
  reviewCount: p.review_count ?? p.reviewCount ?? 0,
  stockCount: p.stock_count ?? p.stockCount ?? 0,
  rating: parseFloat(p.rating) || 0,
  shippingInfo: p.shipping_info ?? p.shippingInfo ?? '',
  colors: p.colors ?? [],
  sizes: p.sizes ?? [],
  specs: p.specs ?? {},
  reviews: p.reviews ?? [],
  tags: p.tags ?? [],
});

export const catalogApi = {
  getCategories: () => api.get('/catalog/categories/'),
  getProducts: (filters) =>
    api.get(`/catalog/products/${buildProductParams(filters)}`)
      .then(r => ({ ...r, results: (r.results ?? []).map(normalizeProduct) })),
  getProduct: (id) =>
    api.get(`/catalog/products/${id}/`).then(normalizeProduct),
};
