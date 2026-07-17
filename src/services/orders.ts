import { api } from '@/services/api'

export type BillingPeriod = 'MONTHLY' | 'YEARLY' | 'ONE_TIME'

export interface OrderItemPayload {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  billingPeriod: BillingPeriod
}

/** Statuts posés par le backend Symfony (VALIDATED = statut par défaut à la création). */
export type OrderStatus =
  | 'PENDING'
  | 'VALIDATED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface OrderResponse {
  /** id numérique côté Symfony — passer par String() pour l'affichage. */
  id: number
  status: OrderStatus
  /** Client de la commande (affiché dans le back-office). */
  user?: {
    id: number
    email: string
    firstName: string
    lastName: string
  }
  totalAmount: number
  currency: string
  items: Array<{
    id: number
    productName: string
    quantity: number
    unitPrice: number
    billingPeriod: string
  }>
  createdAt: string
}

export const ordersApi = {
  createOrder: (items: OrderItemPayload[]) =>
    api.post<OrderResponse>('/orders', { items }),

  /** Le backend renvoie un tableau nu (pas de pagination sur cette route). */
  getMyOrders: () => api.get<OrderResponse[]>('/orders'),
}
