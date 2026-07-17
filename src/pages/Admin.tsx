import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, Container, Tab, Tabs, Typography } from '@mui/material'
import {
  CollectionsOutlined as CarouselIcon,
  DashboardOutlined as DashboardIcon,
  Inventory2Outlined as ProductsIcon,
  LabelOutlined as CategoriesIcon,
  PeopleAltOutlined as UsersIcon,
  ShoppingBagOutlined as OrdersIcon,
} from '@mui/icons-material'
import { useAuthStore } from '@/stores/authStore'
import AdminOverview from './admin/AdminOverview'
import AdminOrders from './admin/AdminOrders'
import AdminUsers from './admin/AdminUsers'
import AdminProducts from './admin/AdminProducts'
import AdminCategories from './admin/AdminCategories'
import AdminCarousel from './admin/AdminCarousel'
import type { ReactNode } from 'react'

function TabPanel({ children, value, index }: { children: ReactNode; value: number; index: number }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null
}

/**
 * Back-office : accessible uniquement avec un compte ADMIN.
 * La vraie protection est côté backend (access_control ROLE_ADMIN → 401/403) ;
 * la garde ci-dessous évite simplement d'afficher une coquille vide.
 */
export default function Admin() {
  const { user, isAuthenticated } = useAuthStore()
  const [tab, setTab] = useState(0)

  const isAdmin = isAuthenticated && user?.role === 'ADMIN'

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

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

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile>
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Vue d'ensemble" />
            <Tab icon={<OrdersIcon />} iconPosition="start" label="Commandes" />
            <Tab icon={<UsersIcon />} iconPosition="start" label="Utilisateurs" />
            <Tab icon={<ProductsIcon />} iconPosition="start" label="Produits" />
            <Tab icon={<CategoriesIcon />} iconPosition="start" label="Catégories" />
            <Tab icon={<CarouselIcon />} iconPosition="start" label="Carousel" />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}><AdminOverview /></TabPanel>
        <TabPanel value={tab} index={1}><AdminOrders /></TabPanel>
        <TabPanel value={tab} index={2}><AdminUsers /></TabPanel>
        <TabPanel value={tab} index={3}><AdminProducts /></TabPanel>
        <TabPanel value={tab} index={4}><AdminCategories /></TabPanel>
        <TabPanel value={tab} index={5}><AdminCarousel /></TabPanel>
      </Container>
    </Box>
  )
}
