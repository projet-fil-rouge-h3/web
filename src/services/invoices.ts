import { api, getAccessToken } from '@/services/api'

export interface Invoice {
  id: string
  orderId: string
  invoiceNumber: string
  amountHt: number
  vatRate: number
  vatAmount: number
  amountTtc: number
  currency: string
  issuedAt: string
}

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const invoicesApi = {
  getAll: (page = 0, size = 20) =>
    api.get<{ content: Invoice[]; totalElements: number }>(
      `/invoices?page=${page}&size=${size}`
    ),

  /** Télécharge le PDF (endpoint authentifié → fetch blob + lien temporaire). */
  downloadPdf: async (invoice: Invoice) => {
    const response = await fetch(`${BASE_URL}/invoices/${invoice.id}/pdf`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })
    if (!response.ok) {
      throw new Error(`Téléchargement impossible (HTTP ${response.status})`)
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.invoiceNumber}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  },
}
