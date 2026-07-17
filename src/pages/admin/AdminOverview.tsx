import { useQuery } from '@tanstack/react-query'
import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material'
import {
  EuroOutlined as EuroIcon,
  Inventory2Outlined as ProductsIcon,
  PeopleAltOutlined as UsersIcon,
  ShoppingBagOutlined as OrdersIcon,
} from '@mui/icons-material'
import { adminApi } from '@/services/admin'
import OrdersTable from './OrdersTable'
import type { ReactNode } from 'react'

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

export default function AdminOverview() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
  })

  const { data: ordersPage, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminApi.getAllOrders(0, 50),
  })

  return (
    <>
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
              icon={<UsersIcon />}
              label="Utilisateurs"
              value={String(stats?.totalUsers ?? 0)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={<ProductsIcon />}
              label="Produits actifs"
              value={String(stats?.activeProducts ?? 0)}
            />
          </Grid>
        </Grid>
      )}

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 5, mb: 2 }}>
        Dernières commandes
      </Typography>
      <OrdersTable orders={(ordersPage?.content ?? []).slice(0, 5)} loading={ordersLoading} />
    </>
  )
}
