import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '../api/catalog';

export const catalogKeys = {
  categories: ['categories'],
  products: (filters) => ['products', filters],
  product: (id) => ['product', id],
};

export function useCategories() {
  return useQuery({
    queryKey: catalogKeys.categories,
    queryFn: catalogApi.getCategories,
    staleTime: Infinity,
  });
}

export function useProducts(filters) {
  return useQuery({
    queryKey: catalogKeys.products(filters),
    queryFn: () => catalogApi.getProducts(filters),
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
  });
}

export function useProductDetail(id) {
  return useQuery({
    queryKey: catalogKeys.product(id),
    queryFn: () => catalogApi.getProduct(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
