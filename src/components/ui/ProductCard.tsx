import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      price: product.priceMonthly,
      quantity: 1,
      billingCycle: 'MONTHLY',
    })
  }

  const yearlyDiscount = product.priceYearly
    ? Math.round((1 - product.priceYearly / (product.priceMonthly * 12)) * 100)
    : 0

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/product/${product.slug}`)}
        sx={{ flexGrow: 1 }}
      >
        {/* Image placeholder colorée */}
        <Box
          sx={{
            height: 140,
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E8F0FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ opacity: 0.12, userSelect: 'none', fontWeight: 700 }}>
            {product.name.slice(0, 3).toUpperCase()}
          </Typography>
        </Box>

        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              {product.name}
            </Typography>
            {product.displayPriority > 0 && (
              <Chip label="Populaire" size="small" color="primary" sx={{ ml: 1, flexShrink: 0 }} />
            )}
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, minHeight: 40 }}>
            {product.shortDescription}
          </Typography>

          {/* Pricing */}
          <Box>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {product.priceMonthly.toLocaleString('fr-FR')} €
              <Box component="span" sx={{ ml: 0.5, fontSize: '0.875rem', color: 'text.secondary', fontWeight: 400 }}>
                /mois
              </Box>
            </Typography>
            {product.priceYearly && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                ou {product.priceYearly.toLocaleString('fr-FR')} €/an{' '}
                <Box component="span" sx={{ color: 'success.main', fontWeight: 600 }}>
                  {yearlyDiscount}% économie
                </Box>
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
        >
          Ajouter
        </Button>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          Détails
        </Button>
      </CardActions>
    </Card>
  )
}
