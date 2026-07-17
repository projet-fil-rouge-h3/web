import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonIcon from '@mui/icons-material/Person'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const NAV_LINKS = [
  { label: 'Catalogue', href: '/catalog' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const cartItems = useCartStore((s) => s.items)
  const { isAuthenticated, user } = useAuthStore()
  const isAdmin = isAuthenticated && user?.role === 'ADMIN'

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(10, 14, 26, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'white',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <SecurityIcon sx={{ color: '#1A73E8', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              CYNA
            </Typography>
          </Box>

          {/* Navigation desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, ml: 4, flexGrow: 1 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  to={link.href}
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <IconButton
              sx={{ color: 'rgba(255,255,255,0.8)' }}
              onClick={() => navigate('/cart')}
              aria-label={`Panier (${cartCount} articles)`}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {!isMobile && isAdmin && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/admin')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.4)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                }}
              >
                Admin
              </Button>
            )}

            {!isMobile && (
              isAuthenticated ? (
                <IconButton
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                  onClick={() => navigate('/account')}
                >
                  <PersonIcon />
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate('/login')}
                  sx={{ ml: 1 }}
                >
                  Connexion
                </Button>
              )
            )}

            {isMobile && (
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => setDrawerOpen(true)}
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 260, bgcolor: '#0A0E1A' } } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.href}
              component={Link}
              to={link.href}
              onClick={() => setDrawerOpen(false)}
              sx={{ color: 'white' }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
          {!isAuthenticated && (
            <ListItemButton
              component={Link}
              to="/login"
              onClick={() => setDrawerOpen(false)}
              sx={{ color: '#1A73E8', mt: 2 }}
            >
              <ListItemText primary="Connexion" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  )
}
