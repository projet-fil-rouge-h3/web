export interface CategorySummary {
  id: string
  name: string
  slug: string
}

export interface Product {
  id: string
  /** Présent dans les données mock ; l'API renvoie `category` à la place. */
  categoryId?: string
  category?: CategorySummary
  name: string
  slug: string
  description: string
  shortDescription?: string
  priceMonthly: number
  priceYearly?: number
  imageUrl?: string
  features: Record<string, unknown>
  displayPriority: number
  active: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  displayOrder: number
  active: boolean
}

export interface Order {
  id: string
  userId: string
  addressId: string
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  createdAt: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  billingCycle: 'MONTHLY' | 'YEARLY' | 'ONE_TIME'
}

export interface Address {
  id: string
  userId: string
  label: string
  street: string
  city: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface CarouselSlide {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  displayOrder: number
  active: boolean
}
