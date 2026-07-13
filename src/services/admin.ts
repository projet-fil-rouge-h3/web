import { api } from '@/services/api'
import type { Product } from '@/types'
import type { OrderResponse } from '@/services/orders'
import type { UserInfo } from '@/services/auth'

export interface AdminUser extends UserInfo {
  phone?: string
  createdAt?: string
}

export interface AdminStats {
  totalOrders: number
  totalRevenueHt: number
  activeSubscriptions: number
}

interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
}

export const adminApi = {
  getUsers: (page = 0, size = 20) =>
    api.get<Page<AdminUser>>(`/auth/users?page=${page}&size=${size}`),

  getAllOrders: (page = 0, size = 20) =>
    api.get<Page<OrderResponse>>(`/orders/all?page=${page}&size=${size}`),

  getStats: () => api.get<AdminStats>('/orders/stats'),

  getAllProducts: (page = 0, size = 50) =>
    api.get<Page<Product>>(`/products/admin?page=${page}&size=${size}`),

  /** Bascule actif/inactif : DELETE = soft delete, PUT complet pour réactiver. */
  toggleProduct: async (product: Product): Promise<void> => {
    if (product.active) {
      await api.delete<void>(`/products/${product.id}`)
      return
    }
    await api.put<Product>(`/products/${product.id}`, {
      categoryId: product.category?.id ?? product.categoryId,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      priceMonthly: product.priceMonthly,
      priceYearly: product.priceYearly,
      imageUrl: product.imageUrl,
      features: product.features,
      displayPriority: product.displayPriority,
      active: true,
    })
  },
}
