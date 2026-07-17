import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  DeleteOutlined as DeleteOutlineIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import Alert from '@mui/material/Alert'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { ordersApi } from '@/services/orders'

const BILLING_LABEL: Record<string, string> = {
  MONTHLY: 'Mensuel',
  YEARLY: 'Annuel',
  ONE_TIME: 'Unique',
}

const VAT_RATE = 0.2

export default function Cart() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Les prix catalogue sont HT ; la TVA est ajoutée au moment de la commande
  const totalHT = total()
  const vat = Math.round(totalHT * VAT_RATE * 100) / 100
  const totalTTC = totalHT + vat

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setError(null)
    setConfirmOpen(true)
  }

  const handleOrder = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await ordersApi.createOrder(
        items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          billingPeriod: item.billingCycle,
        }))
      )
      setConfirmOpen(false)
      setOrdered(true)
      clearCart()
      // La nouvelle commande apparaît sans F5 dans le profil et le back-office
      void queryClient.invalidateQueries({ queryKey: ['orders', 'mine'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    } catch (e) {
      setConfirmOpen(false)
      setError(
        e instanceof Error && e.message !== 'Erreur inconnue'
          ? e.message
          : 'La commande a échoué. Vérifiez votre connexion puis réessayez.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (ordered) {
    return (
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 128px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Commande confirmée !
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Votre commande a bien été enregistrée. Vous recevrez un e-mail de confirmation sous peu.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/')}>
            Retour à l&apos;accueil
          </Button>
        </Container>
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 128px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 72, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Votre panier est vide
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Ajoutez des produits depuis notre catalogue pour commencer.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/catalog')}>
            Voir le catalogue
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 5 }}>
          Mon panier
        </Typography>

        <Grid container spacing={4}>
          {/* Liste des articles */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map((item) => (
                <Paper
                  key={item.productId}
                  elevation={0}
                  sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                >
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Miniature */}
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        flexShrink: 0,
                        background: 'linear-gradient(135deg, #EEF2FF 0%, #E8F0FE 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          opacity: 0.4,
                          fontSize: '0.65rem',
                          letterSpacing: 1,
                        }}
                      >
                        {item.name.slice(0, 3).toUpperCase()}
                      </Typography>
                    </Box>

                    {/* Détails */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {item.name}
                          </Typography>
                          <Chip
                            label={BILLING_LABEL[item.billingCycle] ?? item.billingCycle}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.productId)}
                          color="error"
                          aria-label="Supprimer l'article"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}
                      >
                        {/* Quantité */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            px: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{ color: 'primary.main', fontWeight: 700, ml: 'auto' }}
                        >
                          {(item.price * item.quantity).toLocaleString('fr-FR')} €
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Button
              variant="text"
              color="error"
              sx={{ mt: 2 }}
              onClick={clearCart}
            >
              Vider le panier
            </Button>
          </Grid>

          {/* Récapitulatif */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                position: 'sticky',
                top: 88,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Récapitulatif
              </Typography>

              {items.map((item) => (
                <Box
                  key={item.productId}
                  sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1, minWidth: 0 }} noWrap>
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ flexShrink: 0 }}>
                    {(item.price * item.quantity).toLocaleString('fr-FR')} €
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total HT
                </Typography>
                <Typography variant="body2">{totalHT.toLocaleString('fr-FR')} €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  TVA (20 %)
                </Typography>
                <Typography variant="body2">{vat.toLocaleString('fr-FR')} €</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total TTC
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {totalTTC.toLocaleString('fr-FR')} €
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={handleCheckoutClick}
                sx={{ mb: 1.5 }}
              >
                {isAuthenticated ? 'Passer la commande' : 'Se connecter pour commander'}
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={() => navigate('/catalog')}
              >
                Continuer les achats
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogue de confirmation */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la commande</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Vous allez commander {items.length} produit{items.length > 1 ? 's' : ''} pour un total
            de{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {totalTTC.toLocaleString('fr-FR')} € TTC
            </Box>{' '}
            ({totalHT.toLocaleString('fr-FR')} € HT). Paiement simulé — aucune carte bancaire
            requise.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={submitting}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleOrder} disabled={submitting}>
            {submitting ? 'Commande en cours…' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
