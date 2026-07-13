import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from '@mui/material'
import {
  Logout as LogoutIcon,
  Add as AddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  HomeOutlined as HomeIcon,
  ShoppingBagOutlined as ShoppingBagIcon,
  PersonOutlined as PersonIcon,
  ReceiptLongOutlined as ReceiptIcon,
  DownloadOutlined as DownloadIcon,
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/auth'
import { ordersApi } from '@/services/orders'
import { addressesApi, type AddressPayload } from '@/services/addresses'
import { invoicesApi, type Invoice } from '@/services/invoices'

// ── Schémas Zod ───────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
})

const addressSchema = z.object({
  label: z.string().min(1, 'Libellé requis'),
  street: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(4, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis'),
})

type ProfileData = z.infer<typeof profileSchema>
type AddressData = z.infer<typeof addressSchema>

// ── Libellés ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  CONFIRMED: 'success',
  COMPLETED: 'success',
  PENDING: 'warning',
  PROCESSING: 'warning',
  CANCELLED: 'error',
  REFUNDED: 'default',
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Confirmée',
  COMPLETED: 'Terminée',
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
}

const BILLING_LABEL: Record<string, string> = {
  MONTHLY: 'Mensuel',
  YEARLY: 'Annuel',
  ONE_TIME: 'Unique',
}

/** Masque la partie locale de l'e-mail : merlin.cdl@gmail.com → m•••@gmail.com */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  return `${local[0]}•••@${domain}`
}

// ── Composant panneau d'onglet ────────────────────────────────────────────────

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function Account() {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [tab, setTab] = useState(0)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)

  // ── Données serveur (chargées seulement si connecté) ───────────
  const { data: ordersPage, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'mine'],
    queryFn: () => ordersApi.getMyOrders(0, 20),
    enabled: isAuthenticated,
  })

  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressesApi.getAll,
    enabled: isAuthenticated,
  })

  const { data: invoicesPage, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoicesApi.getAll(),
    enabled: isAuthenticated,
  })

  // ── Mutations adresses ──────────────────────────────────────────
  const invalidateAddresses = () => queryClient.invalidateQueries({ queryKey: ['addresses'] })

  const createAddress = useMutation({
    mutationFn: (payload: AddressPayload) => addressesApi.create(payload),
    onSuccess: () => {
      invalidateAddresses()
      setAddressDialogOpen(false)
      addressForm.reset({ country: 'France' })
    },
    onError: () => setActionError("L'ajout de l'adresse a échoué."),
  })

  const setDefaultAddress = useMutation({
    mutationFn: (id: string) => {
      const address = addresses.find((a) => a.id === id)!
      return addressesApi.update(id, { ...address, isDefault: true })
    },
    onSuccess: invalidateAddresses,
    onError: () => setActionError('Impossible de définir cette adresse par défaut.'),
  })

  const removeAddress = useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: invalidateAddresses,
    onError: () => setActionError('La suppression a échoué.'),
  })

  // ── Formulaires ─────────────────────────────────────────────────
  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  })

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'France' },
  })

  // Redirection si non connecté (après les hooks)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const orders = ordersPage?.content ?? []
  const invoices = invoicesPage?.content ?? []

  const onProfileSubmit = async (data: ProfileData) => {
    setActionError(null)
    try {
      await authApi.updateProfile(data)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3500)
    } catch {
      setActionError('La mise à jour du profil a échoué.')
    }
  }

  const onAddressSubmit = (data: AddressData) => {
    setActionError(null)
    createAddress.mutate({ ...data, isDefault: addresses.length === 0 })
  }

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setActionError(null)
    try {
      await invoicesApi.downloadPdf(invoice)
    } catch {
      setActionError('Le téléchargement de la facture a échoué.')
    }
  }

  const handleLogout = async () => {
    await authApi.logout()
    navigate('/')
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">

        {/* ── Carte identité ──────────────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: 'primary.main',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  {user.role === 'ADMIN' && (
                    <Chip label="Admin" size="small" color="primary" />
                  )}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {maskEmail(user.email)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Se déconnecter
            </Button>
          </Box>
        </Paper>

        {actionError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setActionError(null)}>
            {actionError}
          </Alert>
        )}

        {/* ── Onglets ─────────────────────────────────────────────────── */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
            <Tab icon={<PersonIcon />} iconPosition="start" label="Mon profil" />
            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="Mes commandes" />
            <Tab icon={<HomeIcon />} iconPosition="start" label="Mes adresses" />
            <Tab icon={<ReceiptIcon />} iconPosition="start" label="Mes factures" />
          </Tabs>
        </Box>

        {/* ── Onglet : Profil ──────────────────────────────────────────── */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Informations personnelles
              </Typography>

              {profileSuccess && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setProfileSuccess(false)}>
                  Profil mis à jour avec succès.
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                noValidate
              >
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...profileForm.register('firstName')}
                      label="Prénom"
                      fullWidth
                      error={!!profileForm.formState.errors.firstName}
                      helperText={profileForm.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...profileForm.register('lastName')}
                      label="Nom"
                      fullWidth
                      error={!!profileForm.formState.errors.lastName}
                      helperText={profileForm.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Adresse e-mail"
                      value={maskEmail(user.email)}
                      fullWidth
                      disabled
                      helperText="L'adresse e-mail ne peut pas être modifiée ici."
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={profileForm.formState.isSubmitting}
                      sx={{ px: 4 }}
                    >
                      {profileForm.formState.isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* ── Onglet : Commandes ───────────────────────────────────────── */}
        <TabPanel value={tab} index={1}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Historique des commandes
          </Typography>

          {ordersLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={120} />
              ))}
            </Box>
          ) : orders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ShoppingBagIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                Aucune commande pour l&apos;instant.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/catalog')}>
                Découvrir le catalogue
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orders.map((order) => (
                <Paper
                  key={order.id}
                  elevation={0}
                  sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Commande {order.id.slice(0, 8).toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={STATUS_LABEL[order.status] ?? order.status}
                        color={STATUS_COLOR[order.status] ?? 'default'}
                        size="small"
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: 'primary.main' }}
                      >
                        {order.totalAmount.toLocaleString('fr-FR')} € HT
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {order.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.productName} × {item.quantity}{' '}
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          ({BILLING_LABEL[item.billingPeriod] ?? item.billingPeriod})
                        </Box>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(item.unitPrice * item.quantity).toLocaleString('fr-FR')} €
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              ))}
            </Box>
          )}
        </TabPanel>

        {/* ── Onglet : Adresses ────────────────────────────────────────── */}
        <TabPanel value={tab} index={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Mes adresses
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddressDialogOpen(true)}
            >
              Ajouter
            </Button>
          </Box>

          {addressesLoading ? (
            <Grid container spacing={2}>
              {Array.from({ length: 2 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rounded" height={180} />
                </Grid>
              ))}
            </Grid>
          ) : addresses.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <HomeIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography sx={{ color: 'text.secondary' }}>
                Aucune adresse enregistrée.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {addresses.map((address) => (
                <Grid key={address.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '2px solid',
                      borderColor: address.isDefault ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {address.label}
                      </Typography>
                      {address.isDefault && (
                        <Chip label="Par défaut" size="small" color="primary" />
                      )}
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {address.street}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {address.postalCode} {address.city}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 'auto', pb: 2 }}>
                      {address.country}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      {!address.isDefault && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setDefaultAddress.mutate(address.id)}
                          disabled={setDefaultAddress.isPending}
                          sx={{ flexGrow: 1 }}
                        >
                          Définir par défaut
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeAddress.mutate(address.id)}
                        disabled={address.isDefault || removeAddress.isPending}
                        aria-label="Supprimer l'adresse"
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* ── Onglet : Factures ────────────────────────────────────────── */}
        <TabPanel value={tab} index={3}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Mes factures
          </Typography>

          {invoicesLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={72} />
              ))}
            </Box>
          ) : invoices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <ReceiptIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography sx={{ color: 'text.secondary' }}>
                Aucune facture — elles apparaissent après votre première commande.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {invoices.map((invoice) => (
                <Paper
                  key={invoice.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <ReceiptIcon sx={{ color: 'primary.main' }} />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {invoice.invoiceNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Émise le{' '}
                      {new Date(invoice.issuedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {invoice.amountTtc.toLocaleString('fr-FR')} € TTC
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    PDF
                  </Button>
                </Paper>
              ))}
            </Box>
          )}
        </TabPanel>
      </Container>

      {/* ── Dialog ajout d'adresse ──────────────────────────────────── */}
      <Dialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Ajouter une adresse</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="address-form"
            onSubmit={addressForm.handleSubmit(onAddressSubmit)}
            noValidate
            sx={{ pt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...addressForm.register('label')}
                  label="Libellé (ex : Siège social)"
                  fullWidth
                  autoFocus
                  error={!!addressForm.formState.errors.label}
                  helperText={addressForm.formState.errors.label?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...addressForm.register('street')}
                  label="Adresse"
                  fullWidth
                  error={!!addressForm.formState.errors.street}
                  helperText={addressForm.formState.errors.street?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  {...addressForm.register('postalCode')}
                  label="Code postal"
                  fullWidth
                  error={!!addressForm.formState.errors.postalCode}
                  helperText={addressForm.formState.errors.postalCode?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  {...addressForm.register('city')}
                  label="Ville"
                  fullWidth
                  error={!!addressForm.formState.errors.city}
                  helperText={addressForm.formState.errors.city?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...addressForm.register('country')}
                  label="Pays"
                  fullWidth
                  error={!!addressForm.formState.errors.country}
                  helperText={addressForm.formState.errors.country?.message}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setAddressDialogOpen(false)}>Annuler</Button>
          <Button
            type="submit"
            form="address-form"
            variant="contained"
            disabled={createAddress.isPending}
          >
            {createAddress.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Ajouter'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
