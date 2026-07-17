import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cartStore'

const socStarter = {
  productId: 'p1',
  name: 'SOC Starter',
  price: 299,
  quantity: 1,
  billingCycle: 'MONTHLY' as const,
}

const edrPro = {
  productId: 'p2',
  name: 'EDR Pro',
  price: 199,
  quantity: 2,
  billingCycle: 'MONTHLY' as const,
}

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('ajoute un article au panier', () => {
    useCartStore.getState().addItem(socStarter)

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].name).toBe('SOC Starter')
  })

  it('incrémente la quantité si le produit est déjà présent', () => {
    useCartStore.getState().addItem(socStarter)
    useCartStore.getState().addItem({ ...socStarter, quantity: 2 })

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(3)
  })

  it('supprime un article par productId', () => {
    useCartStore.getState().addItem(socStarter)
    useCartStore.getState().addItem(edrPro)

    useCartStore.getState().removeItem('p1')

    const { items } = useCartStore.getState()
    expect(items).toHaveLength(1)
    expect(items[0].productId).toBe('p2')
  })

  it('met à jour la quantité d’un article', () => {
    useCartStore.getState().addItem(socStarter)

    useCartStore.getState().updateQuantity('p1', 5)

    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('calcule le total (prix × quantité, tous articles)', () => {
    useCartStore.getState().addItem(socStarter) // 299 × 1
    useCartStore.getState().addItem(edrPro) // 199 × 2

    expect(useCartStore.getState().total()).toBe(299 + 398)
  })

  it('vide le panier', () => {
    useCartStore.getState().addItem(socStarter)
    useCartStore.getState().clearCart()

    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().total()).toBe(0)
  })
})
