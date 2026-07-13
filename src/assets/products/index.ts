import socStarter from './soc-starter.svg'
import socPremium from './soc-premium.svg'
import socEnterprise from './soc-enterprise.svg'
import edrStarter from './edr-starter.svg'
import edrPro from './edr-pro.svg'
import xdrEssential from './xdr-essential.svg'
import xdrUltimate from './xdr-ultimate.svg'
import auditSecurite from './audit-securite.svg'

/** Visuels produits embarqués, indexés par slug (fallback : dégradé neutre du composant). */
export const PRODUCT_IMAGES: Record<string, string> = {
  'soc-starter': socStarter,
  'soc-premium': socPremium,
  'soc-enterprise': socEnterprise,
  'edr-starter': edrStarter,
  'edr-pro': edrPro,
  'xdr-essential': xdrEssential,
  'xdr-ultimate': xdrUltimate,
  'audit-securite': auditSecurite,
}

/** L'image API (imageUrl) prime si présente ; sinon visuel embarqué par slug. */
export function productImage(product: { slug: string; imageUrl?: string }): string | undefined {
  return product.imageUrl || PRODUCT_IMAGES[product.slug]
}
