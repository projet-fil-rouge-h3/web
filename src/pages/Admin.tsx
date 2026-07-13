import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Skeleton,
  Alert,
} from '@mui/material'
import {
  DashboardOutlined as DashboardIcon,
  ShoppingBagOutlined as OrdersIcon,
  PeopleAltOutlined as UsersIcon,
  Inventory2Outlined as ProductsIcon,
  EuroOutlined as EuroIcon,
  AutorenewOutlined as SubscriptionIcon,
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'
import { adminApi } from '@/services/admin'
import type { OrderResponse } from '@/services/orders'
import type { ReactNode } from 'react'

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Confirmée',
  COMPLETED: 'Terminée',
  PENDING: 'En attente',
  PROCESSING: 'En cours',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
}

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  CONFIRMED: 'success',
  COMPLETED: 'success',
  PENDING: 'warning',
  PROCESSING: 'warning',
  CANCELLED: 'error',
  REFUNDED: 'default',
}

function TabPanel({ children, value, index }: { children: ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Box>
    </Paper>
  )
}

export default function Admin() {
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = isAuthenticated && user?.role === 'ADMIN'

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
    enabled: isAdmin,
  })

  const { data: ordersPage, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminApi.getAllOrders(0, 50),
    enabled: isAdmin,
  })

  const { data: usersPage, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(0, 50),
    enabled: isAdmin,
  })

  const { data: productsPage, isLoading: productsLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => adminApi.getAllProducts(0, 50),
    enabled: isAdmin,
  })

  const toggleProduct = useMutation({
    mutationFn: adminApi.toggleProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => setError('La modification du produit a échoué.'),
  })

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const orders = ordersPage?.content ?? []
  const users = usersPage?.content ?? []
  const products = productsPage?.content ?? []

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}>
            Back-office
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Administration
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Vue d'ensemble" />
            <Tab icon={<OrdersIcon />} iconPosition="start" label="Commandes" />
            <Tab icon={<UsersIcon />} iconPosition="start" label="Utilisateurs" />
            <Tab icon={<ProductsIcon />} iconPosition="start" label="Produits" />
          </Tabs>
        </Box>

        {/* ── Vue d'ensemble ─────────────────────────────────────── */}
        <TabPanel value={tab} index={0}>
          {statsLoading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Skeleton variant="rounded" height={100} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<EuroIcon />}
                  label="Chiffre d'affaires HT"
                  value={`${(stats?.totalRevenueHt ?? 0).toLocaleString('fr-FR')} €`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<OrdersIcon />}
                  label="Commandes"
                  value={String(stats?.totalOrders ?? 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<SubscriptionIcon />}
                  label="Abonnements actifs"
                  value={String(stats?.activeSubscriptions ?? 0)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  icon={<UsersIcon />}
                  label="Utilisateurs"
                  value={String(usersPage?.totalElements ?? '—')}
                />
              </Grid>
            </Grid>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700, mt: 5, mb: 2 }}>
            Dernières commandes
          </Typography>
          <OrdersTable orders={orders.slice(0, 5)} loading={ordersLoading} />
        </TabPanel>

        {/* ── Commandes ──────────────────────────────────────────── */}
        <TabPanel value={tab} index={1}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Toutes les commandes ({ordersPage?.totalElements ?? 0})
          </Typography>
          <OrdersTable orders={orders} loading={ordersLoading} />
        </TabPanel>

        {/* ── Utilisateurs ───────────────────────────────────────── */}
        <TabPanel value={tab} index={2}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Utilisateurs ({usersPage?.totalElements ?? 0})
          </Typography>
          {usersLoading ? (
            <Skeleton variant="rounded" height={240} />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>E-mail</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rôle</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Inscription</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.firstName} {u.lastName}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          size="small"
                          color={u.role === 'ADMIN' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('fr-FR')
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* ── Produits ───────────────────────────────────────────── */}
        <TabPanel value={tab} index={3}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Produits ({productsPage?.totalElements ?? 0})
          </Typography>
          {productsLoading ? (
            <Skeleton variant="rounded" height={240} />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Produit</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Catégorie</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Prix/mois HT</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Actif</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id} hover sx={{ opacity: p.active ? 1 : 0.5 }}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category?.name ?? '—'}</TableCell>
                      <TableCell align="right">{p.priceMonthly.toLocaleString('fr-FR')} €</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={p.active}
                          size="small"
                          onChange={() => toggleProduct.mutate(p)}
                          disabled={toggleProduct.isPending}
                          slotProps={{ input: { 'aria-label': `Activer/désactiver ${p.name}` } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Container>
    </Box>
  )
}

// ── Table des commandes (partagée entre les onglets) ─────────────────────────

function OrdersTable({ orders, loading }: { orders: OrderResponse[]; loading: boolean }) {
  if (loading) return <Skeleton variant="rounded" height={240} />
  if (orders.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
        Aucune commande.
      </Typography>
    )
  }
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Commande</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Articles</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">Total HT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell sx={{ fontFamily: 'monospace' }}>
                {order.id.slice(0, 8).toUpperCase()}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
              </TableCell>
              <TableCell>
                <Chip
                  label={STATUS_LABEL[order.status] ?? order.status}
                  color={STATUS_COLOR[order.status] ?? 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {order.totalAmount.toLocaleString('fr-FR')} €
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
