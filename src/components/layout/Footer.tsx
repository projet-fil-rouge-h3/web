import { Box, Container, Grid, Typography, Link as MuiLink, Divider } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Solutions',
    links: [
      { label: 'SOC Managé', href: '/catalog?cat=soc' },
      { label: 'EDR', href: '/catalog?cat=edr' },
      { label: 'XDR', href: '/catalog?cat=xdr' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', href: '/legal' },
      { label: 'Politique de confidentialité', href: '/privacy' },
      { label: 'CGU', href: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0A0E1A',
        color: 'rgba(255,255,255,0.7)',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Brand */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SecurityIcon sx={{ color: '#1A73E8' }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                CYNA
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 280 }}>
              Solutions de cybersécurité SaaS pour les entreprises. SOC, EDR et XDR managés par
              nos experts.
            </Typography>
          </Grid>

          {/* Links columns */}
          {COLUMNS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                {col.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {col.links.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    to={link.href}
                    underline="hover"
                    sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} CYNA — Tous droits réservés
        </Typography>
      </Container>
    </Box>
  )
}
