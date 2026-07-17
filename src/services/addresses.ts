import { api } from '@/services/api'

/** Adresse telle que renvoyée par user-service (champ postalCode, pas zipCode). */
export interface Address {
  id: string
  userId: string
  label: string
  street: string
  street2?: string
  city: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface AddressPayload {
  label: string
  street: string
  street2?: string
  city: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export const addressesApi = {
  getAll: () => api.get<Address[]>('/addresses'),
  create: (payload: AddressPayload) => api.post<Address>('/addresses', payload),
  update: (id: string, payload: AddressPayload) => api.put<Address>(`/addresses/${id}`, payload),
  remove: (id: string) => api.delete<void>(`/addresses/${id}`),
}
