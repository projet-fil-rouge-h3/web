import { api } from '@/services/api'

export type BillingPeriod = 'MONTHLY' | 'YEARLY' | 'ONE_TIME'

export interface OrderItemPayload {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  billingPeriod: BillingPeriod
}

export interface OrderResponse {
  id: string
  userId: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  totalAmount: number
  currency: string
  items: Array<{
    id: string
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    billingPeriod: BillingPeriod
  }>
  createdAt: string
}

export const ordersApi = {
  createOrder: (items: OrderItemPayload[]) =>
    api.post<OrderResponse>('/orders', { items }),

  getMyOrders: (page = 0, size = 10) =>
    api.get<{ content: OrderResponse[]; totalElements: number }>(
      `/orders?page=${page}&size=${size}`
    ),
}
