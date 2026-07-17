import { api } from '@/services/api'
import type { CarouselSlide, Category, Product } from '@/types'
import type { OrderResponse, OrderStatus } from '@/services/orders'
import type { UserInfo } from '@/services/auth'

export interface AdminUser extends UserInfo {
  phone?: string
  createdAt?: string
  active: boolean
}

export interface AdminStats {
  totalOrders: number
  totalRevenueHt: number
  totalUsers: number
  activeProducts: number
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
}

/** Champs éditables d'un produit (create + update). */
export interface ProductPayload {
  name: string
  slug: string
  categoryId?: string
  shortDescription?: string
  description?: string
  priceMonthly: number
  priceYearly: number
  imageUrl?: string
  features?: Record<string, unknown>
  displayPriority: number
  active?: boolean
}

export interface CategoryPayload {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  active?: boolean
}

export interface CarouselSlidePayload {
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  displayOrder: number
  active?: boolean
}

export const adminApi = {
  // ── Utilisateurs ───────────────────────────────────────────────
  getUsers: (page = 0, size = 20) =>
    api.get<Page<AdminUser>>(`/auth/users?page=${page}&size=${size}`),

  updateUser: (id: string, payload: { active?: boolean; role?: 'USER' | 'ADMIN' }) =>
    api.put<AdminUser>(`/auth/users/${id}`, payload),

  // ── Commandes ──────────────────────────────────────────────────
  getAllOrders: (page = 0, size = 20) =>
    api.get<Page<OrderResponse>>(`/orders/all?page=${page}&size=${size}`),

  getStats: () => api.get<AdminStats>('/orders/stats'),

  updateOrderStatus: (id: number, status: OrderStatus) =>
    api.put<OrderResponse>(`/orders/${id}/status`, { status }),

  // ── Produits ───────────────────────────────────────────────────
  getAllProducts: (page = 0, size = 50) =>
    api.get<Page<Product>>(`/products/admin?page=${page}&size=${size}`),

  createProduct: (payload: ProductPayload) => api.post<Product>('/products', payload),

  updateProduct: (id: string, payload: ProductPayload) =>
    api.put<Product>(`/products/${id}`, payload),

  /** Bascule actif/inactif : DELETE = soft delete, PUT pour réactiver. */
  toggleProduct: async (product: Product): Promise<void> => {
    if (product.active) {
      await api.delete<void>(`/products/${product.id}`)
      return
    }
    await api.put<Product>(`/products/${product.id}`, { active: true })
  },

  // ── Catégories ─────────────────────────────────────────────────
  getAllCategories: () => api.get<Category[]>('/categories/admin'),

  createCategory: (payload: CategoryPayload) => api.post<Category>('/categories', payload),

  updateCategory: (id: string, payload: CategoryPayload) =>
    api.put<Category>(`/categories/${id}`, payload),

  toggleCategory: async (category: Category): Promise<void> => {
    if (category.active) {
      await api.delete<void>(`/categories/${category.id}`)
      return
    }
    await api.put<Category>(`/categories/${category.id}`, { active: true })
  },

  // ── Carousel ───────────────────────────────────────────────────
  getAllSlides: () => api.get<CarouselSlide[]>('/carousel/admin'),

  createSlide: (payload: CarouselSlidePayload) => api.post<CarouselSlide>('/carousel', payload),

  updateSlide: (id: string, payload: CarouselSlidePayload) =>
    api.put<CarouselSlide>(`/carousel/${id}`, payload),

  toggleSlide: async (slide: CarouselSlide): Promise<void> => {
    if (slide.active) {
      await api.delete<void>(`/carousel/${slide.id}`)
      return
    }
    await api.put<CarouselSlide>(`/carousel/${slide.id}`, { active: true })
  },
}
