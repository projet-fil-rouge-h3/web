import { Box, Container, Typography, Grid, Button } from '@mui/material'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import ShieldIcon from '@mui/icons-material/Shield'
import RadarIcon from '@mui/icons-material/Radar'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SpeedIcon from '@mui/icons-material/Speed'
import GroupsIcon from '@mui/icons-material/Groups'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@mui/material'
import HeroCarousel from '@/components/ui/HeroCarousel'
import CategoryCard from '@/components/ui/CategoryCard'
import ProductCard from '@/components/ui/ProductCard'
import { catalogApi } from '@/services/catalog'
import type { CarouselSlide } from '@/types'
import type { ReactNode } from 'react'

// Habillage purement visuel des catégories, indexé par slug (les données viennent de l'API)
const CATEGORY_STYLES: Record<string, { icon: ReactNode; accentColor: string }> = {
  soc: { icon: <MonitorHeartIcon fontSize="inherit" />, accentColor: '#1A73E8' },
  edr: { icon: <ShieldIcon fontSize="inherit" />, accentColor: '#6C63FF' },
  xdr: { icon: <RadarIcon fontSize="inherit" />, accentColor: '#00897B' },
  conseil: { icon: <SupportAgentIcon fontSize="inherit" />, accentColor: '#F4511E' },
}
const DEFAULT_STYLE = { icon: <ShieldIcon fontSize="inherit" />, accentColor: '#1A73E8' }

// Secours si l'API carrousel est vide ou indisponible : le hero ne doit jamais être blanc
const FALLBACK_SLIDES: CarouselSlide[] = [
  {
    id: 'fallback-1',
    title: 'SOC Managé 24/7 — Détection et réponse aux incidents en temps réel',
    subtitle:
      'Nos analystes surveillent votre infrastructure en continu. Réponse garantie en moins de 15 minutes.',
    imageUrl: '',
    linkUrl: '/catalog?cat=soc',
    displayOrder: 1,
    active: true,
  },
]

interface Stat {
  icon: ReactNode
  value: string
  label: string
}

const STATS: Stat[] = [
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 36, color: '#1A73E8' }} />,
    value: '99.9%',
    label: 'Disponibilité SLA',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 36, color: '#6C63FF' }} />,
    value: '< 15 min',
    label: 'Temps de réponse moyen',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 36, color: '#00897B' }} />,
    value: '500+',
    label: 'Entreprises protégées',
  },
]

// ──────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate()

  const { data: slides } = useQuery({
    queryKey: ['carousel'],
    queryFn: catalogApi.getCarouselSlides,
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getCategories,
  })

  const { data: topProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'top'],
    queryFn: catalogApi.getTopProducts,
  })

  return (
    <Box>
      {/* ── Hero carousel ──────────────────────────────────────── */}
      <HeroCarousel slides={slides?.length ? slides : FALLBACK_SLIDES} />

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#0A0E1A', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {STATS.map((stat) => (
              <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {stat.icon}
                  <Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Catégories ─────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}
            >
              Nos solutions
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
              Cybersécurité adaptée à vos besoins
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520 }}>
              Des solutions SaaS managées par nos experts, disponibles en quelques minutes.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Skeleton variant="rounded" height={220} />
                  </Grid>
                ))
              : categories.map((cat) => {
                  const style = CATEGORY_STYLES[cat.slug] ?? DEFAULT_STYLE
                  return (
                    <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <CategoryCard
                        name={cat.name}
                        description={cat.description ?? ''}
                        slug={cat.slug}
                        icon={style.icon}
                        accentColor={style.accentColor}
                      />
                    </Grid>
                  )
                })}
          </Grid>
        </Container>
      </Box>

      {/* ── Top produits ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              mb: 5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}
              >
                Les plus demandés
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5 }}>
                Top produits
              </Typography>
            </Box>
            <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/catalog')}>
              Voir tout le catalogue
            </Button>
          </Box>

          <Grid container spacing={3}>
            {productsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Skeleton variant="rounded" height={320} />
                  </Grid>
                ))
              : topProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA final ──────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0D1B2A 0%, #1A2F4A 100%)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Prêt à sécuriser votre entreprise ?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.65)', mb: 4, fontWeight: 400 }}>
            Démarrez gratuitement pendant 14 jours. Sans carte bancaire.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 5 }}
            >
              Commencer l&apos;essai gratuit
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.4)',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              Parler à un expert
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
