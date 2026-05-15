import { useMemo } from 'react'
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
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/data/mock'
import { useCartStore } from '@/stores/cartStore'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const product = useMemo(
    () => MOCK_PRODUCTS.find((p) => p.slug === slug),
    [slug]
  )

  const category = useMemo(
    () => MOCK_CATEGORIES.find((c) => c.id === product?.categoryId),
    [product]
  )

  if (!product) {
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

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.priceMonthly,
      quantity: 1,
      billingCycle: 'MONTHLY',
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

            {/* Tarifs */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {product.priceMonthly.toLocaleString('fr-FR')} €
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  / mois
                </Typography>
              </Box>
              {product.priceYearly && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  ou {product.priceYearly.toLocaleString('fr-FR')} €/an —{' '}
                  <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>
                    {yearlyDiscount}% d&apos;économie
                  </Box>
                </Typography>
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
