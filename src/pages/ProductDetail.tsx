import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useQuery } from '@tanstack/react-query'
import { catalogApi } from '@/services/catalog'
import { useCartStore } from '@/stores/cartStore'
import { productImage } from '@/assets/products'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [billing, setBilling] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => catalogApi.getProductBySlug(slug!),
    enabled: !!slug,
  })

  const category = product?.category

  if (isLoading) {
    return (
      <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Skeleton variant="rounded" height={320} />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Skeleton width={120} height={32} />
              <Skeleton width="60%" height={56} sx={{ mb: 2 }} />
              <Skeleton height={96} sx={{ mb: 4 }} />
              <Skeleton width={200} height={48} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }

  if (isError || !product) {
    return (
      <Box sx={{ bgcolor: 'background.default', py: 10, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Produit introuvable
          </Typography>
          <Button variant="contained" onClick={() => navigate('/catalog')}>
            Retour au catalogue
          </Button>
        </Container>
      </Box>
    )
  }

  const yearlyDiscount = product.priceYearly
    ? Math.round((1 - product.priceYearly / (product.priceMonthly * 12)) * 100)
    : 0

  // Pas de tarif annuel = prestation ponctuelle (ex. audit) : facturation unique
  const isOneTime = !product.priceYearly
  const isYearly = billing === 'YEARLY' && !isOneTime
  const displayedPrice = isYearly ? product.priceYearly! : product.priceMonthly
  const priceSuffix = isOneTime ? '' : isYearly ? '/ an' : '/ mois'

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: displayedPrice,
      quantity: 1,
      billingCycle: isOneTime ? 'ONE_TIME' : billing,
    })
    navigate('/cart')
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          Retour
        </Button>

        <Grid container spacing={6}>
          {/* Image / visuel */}
          <Grid size={{ xs: 12, md: 5 }}>
            {productImage(product) ? (
              <Box
                component="img"
                src={productImage(product)}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 320,
                  objectFit: 'cover',
                  borderRadius: 3,
                  display: 'block',
                }}
              />
            ) : (
              <Box
                sx={{
                  height: 320,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #E8F0FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{ opacity: 0.12, fontWeight: 700, userSelect: 'none' }}
                >
                  {product.name.slice(0, 3).toUpperCase()}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Informations */}
          <Grid size={{ xs: 12, md: 7 }}>
            {category && (
              <Chip label={category.name} size="small" color="primary" sx={{ mb: 2 }} />
            )}

            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              {product.name}
            </Typography>

            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Tarifs + choix du cycle de facturation */}
            <Box sx={{ mb: 4 }}>
              {!isOneTime && (
                <ToggleButtonGroup
                  value={billing}
                  exclusive
                  onChange={(_, v: 'MONTHLY' | 'YEARLY' | null) => v && setBilling(v)}
                  size="small"
                  color="primary"
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="MONTHLY" sx={{ px: 3 }}>
                    Mensuel
                  </ToggleButton>
                  <ToggleButton value="YEARLY" sx={{ px: 3 }}>
                    Annuel
                    {yearlyDiscount > 0 && (
                      <Chip
                        label={`-${yearlyDiscount}%`}
                        size="small"
                        color="success"
                        sx={{ ml: 1, height: 20 }}
                      />
                    )}
                  </ToggleButton>
                </ToggleButtonGroup>
              )}

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {displayedPrice.toLocaleString('fr-FR')} €
                </Typography>
                {priceSuffix && (
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {priceSuffix}
                  </Typography>
                )}
              </Box>
              {isOneTime ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Prestation ponctuelle — facturation unique.
                </Typography>
              ) : (
                isYearly && (
                  <Typography variant="body2" sx={{ color: 'success.main', mt: 0.5, fontWeight: 600 }}>
                    {yearlyDiscount}% d&apos;économie par rapport au paiement mensuel
                  </Typography>
                )
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{ px: 4 }}
              >
                Ajouter au panier
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/contact')}
              >
                Demander une démo
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Caractéristiques */}
        {Object.keys(product.features).length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Caractéristiques
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(product.features).map(([key, val]) => (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {key.replace(/_/g, ' ')}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {Array.isArray(val)
                        ? val.join(', ')
                        : val === true
                        ? 'Inclus'
                        : val === false
                        ? 'Non inclus'
                        : val === -1
                        ? 'Illimité'
                        : String(val)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  )
}
