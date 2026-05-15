import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
} from '@mui/material'
import {
  Logout as LogoutIcon,
  Add as AddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  HomeOutlined as HomeIcon,
  ShoppingBagOutlined as ShoppingBagIcon,
  PersonOutlined as PersonIcon,
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'

// ── Schémas Zod ───────────────────────────────────────────────────────────────

const profileSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
})

const addressSchema = z.object({
  label: z.string().min(1, 'Libellé requis'),
  street: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  zipCode: z.string().min(4, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis'),
})

type ProfileData = z.infer<typeof profileSchema>
type AddressData = z.infer<typeof addressSchema>

// ── Types & données mock ──────────────────────────────────────────────────────

interface MockOrderItem {
  name: string
  price: number
  quantity: number
  billingCycle: string
}

interface MockOrder {
  id: string
  date: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  total: number
  items: MockOrderItem[]
}

interface MockAddress {
  id: string
  label: string
  street: string
  city: string
  zipCode: string
  country: string
  isDefault: boolean
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ORD-2026-001',
    date: '2026-03-15',
    status: 'CONFIRMED',
    total: 498,
    items: [
      { name: 'SOC Starter', price: 299, quantity: 1, billingCycle: 'MONTHLY' },
      { name: 'EDR Pro', price: 199, quantity: 1, billingCycle: 'MONTHLY' },
    ],
  },
  {
    id: 'ORD-2026-002',
    date: '2026-04-01',
    status: 'CONFIRMED',
    total: 799,
    items: [{ name: 'XDR Ultimate', price: 799, quantity: 1, billingCycle: 'MONTHLY' }],
  },
  {
    id: 'ORD-2026-003',
    date: '2026-04-20',
    status: 'PENDING',
    total: 999,
    items: [{ name: 'SOC Enterprise', price: 999, quantity: 1, billingCycle: 'MONTHLY' }],
  },
]

const INITIAL_ADDRESSES: MockAddress[] = [
  {
    id: '1',
    label: 'Siège social',
    street: '42 Rue de la Paix',
    city: 'Paris',
    zipCode: '75001',
    country: 'France',
    isDefault: true,
  },
]

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error'> = {
  CONFIRMED: 'success',
  PENDING: 'warning',
  CANCELLED: 'error',
}

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Confirmée',
  PENDING: 'En attente',
  CANCELLED: 'Annulée',
}

const BILLING_LABEL: Record<string, string> = {
  MONTHLY: 'Mensuel',
  YEARLY: 'Annuel',
  ONE_TIME: 'Unique',
}

// ── Composant panneau d'onglet ────────────────────────────────────────────────

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function Account() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const [tab, setTab] = useState(0)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [addresses, setAddresses] = useState<MockAddress[]>(INITIAL_ADDRESSES)
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)

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

  const onProfileSubmit = async (data: ProfileData) => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    setUser({ ...user, ...data })
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3500)
  }

  const onAddressSubmit = async (data: AddressData) => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    const newAddress: MockAddress = {
      id: String(Date.now()),
      ...data,
      isDefault: addresses.length === 0,
    }
    setAddresses((prev) => [...prev, newAddress])
    setAddressDialogOpen(false)
    addressForm.reset({ country: 'France' })
  }

  const removeAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  const handleLogout = () => {
    logout()
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
                  {user.email}
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

        {/* ── Onglets ─────────────────────────────────────────────────── */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab icon={<PersonIcon />} iconPosition="start" label="Mon profil" />
            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="Mes commandes" />
            <Tab icon={<HomeIcon />} iconPosition="start" label="Mes adresses" />
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
                      value={user.email}
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

          {MOCK_ORDERS.length === 0 ? (
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
              {MOCK_ORDERS.map((order) => (
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
                        {order.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={STATUS_LABEL[order.status]}
                        color={STATUS_COLOR[order.status]}
                        size="small"
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: 'primary.main' }}
                      >
                        {order.total.toLocaleString('fr-FR')} €/mois
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {order.items.map((item, i) => (
                    <Box
                      key={i}
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.name} × {item.quantity}{' '}
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          ({BILLING_LABEL[item.billingCycle] ?? item.billingCycle})
                        </Box>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {(item.price * item.quantity).toLocaleString('fr-FR')} €
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

          {addresses.length === 0 ? (
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
                      {address.zipCode} {address.city}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 'auto', pb: 2 }}>
                      {address.country}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      {!address.isDefault && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setDefaultAddress(address.id)}
                          sx={{ flexGrow: 1 }}
                        >
                          Définir par défaut
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeAddress(address.id)}
                        disabled={address.isDefault}
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
                  {...addressForm.register('zipCode')}
                  label="Code postal"
                  fullWidth
                  error={!!addressForm.formState.errors.zipCode}
                  helperText={addressForm.formState.errors.zipCode?.message}
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
            disabled={addressForm.formState.isSubmitting}
          >
            {addressForm.formState.isSubmitting ? (
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
