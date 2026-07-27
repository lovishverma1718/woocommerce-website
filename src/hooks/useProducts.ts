import { useQuery } from '@tanstack/react-query';
import { CommerceService } from '../services/commerceService';
import { FilterState } from '../types';

export function useProducts(filters?: Partial<FilterState>) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => CommerceService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => slug ? CommerceService.getProductBySlug(slug) : null,
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CommerceService.getCategories(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useFAQs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: () => CommerceService.getFAQs(),
  });
}
