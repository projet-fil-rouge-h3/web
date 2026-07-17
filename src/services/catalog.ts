import { api } from '@/services/api'
import type { Category, Product, CarouselSlide } from '@/types'

/** Réponse paginée Spring Data (Page<T>) */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface ProductSearchParams {
  q?: string
  categoryId?: string
  page?: number
  size?: number
}

export const catalogApi = {
  getCategories: () => api.get<Category[]>('/categories'),

  searchProducts: ({ q, categoryId, page = 0, size = 24 }: ProductSearchParams) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) })
    if (q) params.set('q', q)
    if (categoryId) params.set('categoryId', categoryId)
    return api.get<PageResponse<Product>>(`/products?${params}`)
  },

  getTopProducts: () => api.get<Product[]>('/products/top'),

  getProductBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),

  getCarouselSlides: () => api.get<CarouselSlide[]>('/carousel'),
}
