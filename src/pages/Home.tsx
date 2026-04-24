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
import HeroCarousel from '@/components/ui/HeroCarousel'
import CategoryCard from '@/components/ui/CategoryCard'
import ProductCard from '@/components/ui/ProductCard'
import type { CarouselSlide, Category, Product } from '@/types'
import type { ReactNode } from 'react'

// ─── Mock data (remplacé par React Query une fois l'API connectée) ─────────────

const SLIDES: CarouselSlide[] = [
  {
    id: '1',
    title: 'SOC Managé 24/7 — Détection et réponse aux incidents en temps réel',
    subtitle:
      'Nos analystes surveillent votre infrastructure en continu. Réponse garantie en moins de 15 minutes.',
    imageUrl: '',
    linkUrl: '/catalog?cat=soc',
    displayOrder: 1,
    active: true,
  },
  {
    id: '2',
    title: 'EDR de nouvelle génération — Protégez chaque endpoint de votre parc',
    subtitle:
      'Détection comportementale, isolation automatique et forensics avancés sur tous vos terminaux.',
    imageUrl: '',
    linkUrl: '/catalog?cat=edr',
    displayOrder: 2,
    active: true,
  },
  {
    id: '3',
    title: "XDR — Vision unifiée des menaces sur l'ensemble de votre SI",
    subtitle:
      'Corrélation multi-sources : réseau, cloud, endpoints et identités. Un seul tableau de bord.',
    imageUrl: '',
    linkUrl: '/catalog?cat=xdr',
    displayOrder: 3,
    active: true,
  },
]

interface CategoryWithStyle extends Category {
  icon: ReactNode
  accentColor: string
}

const CATEGORIES: CategoryWithStyle[] = [
  {
    id: '1',
    name: 'SOC Managé',
    slug: 'soc',
    description:
      'Centre de surveillance opérationnel 24/7. Détection, investigation et réponse aux incidents de sécurité.',
    displayOrder: 1,
    active: true,
    icon: <MonitorHeartIcon fontSize="inherit" />,
    accentColor: '#1A73E8',
  },
  {
    id: '2',
    name: 'EDR',
    slug: 'edr',
    description:
      'Détection et réponse sur les endpoints. Protection comportementale contre les menaces avancées.',
    displayOrder: 2,
    active: true,
    icon: <ShieldIcon fontSize="inherit" />,
    accentColor: '#6C63FF',
  },
  {
    id: '3',
    name: 'XDR',
    slug: 'xdr',
    description:
      'Détection étendue multi-sources : endpoints, réseau, cloud et identités corrélés.',
    displayOrder: 3,
    active: true,
    icon: <RadarIcon fontSize="inherit" />,
    accentColor: '#00897B',
  },
  {
    id: '4',
    name: 'Consulting',
    slug: 'consulting',
    description:
      'Audit de sécurité, pentest, accompagnement RSSI et mise en conformité ISO 27001 / NIS2.',
    displayOrder: 4,
    active: true,
    icon: <SupportAgentIcon fontSize="inherit" />,
    accentColor: '#F4511E',
  },
]

const TOP_PRODUCTS: Product[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'SOC Starter',
    slug: 'soc-starter',
    description: 'Surveillance 24/7, 500 événements/jour, 1 analyste dédié.',
    shortDescription: 'Idéal pour les PME. Surveillance continue avec un analyste dédié.',
    priceMonthly: 299,
    priceYearly: 2990,
    features: { events_per_day: 500, analysts: 1, response_time_min: 30 },
    displayPriority: 1,
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    categoryId: '2',
    name: 'EDR Pro',
    slug: 'edr-pro',
    description: 'Protection comportementale, isolation automatique, forensics.',
    shortDescription: 'Protection avancée pour 100 endpoints avec isolation automatique.',
    priceMonthly: 199,
    priceYearly: 1990,
    features: { endpoints: 100, auto_isolation: true, forensics: true },
    displayPriority: 1,
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    categoryId: '3',
    name: 'XDR Ultimate',
    slug: 'xdr-ultimate',
    description: 'Corrélation réseau + cloud + endpoints + identités.',
    shortDescription: "Vision 360° de votre exposition aux menaces sur tout votre SI.",
    priceMonthly: 799,
    priceYearly: 7990,
    features: { sources: ['endpoint', 'network', 'cloud', 'identity'], ml_detection: true },
    displayPriority: 2,
    active: true,
    createdAt: '2026-01-01',
  },
  {
    id: '4',
    categoryId: '1',
    name: 'SOC Enterprise',
    slug: 'soc-enterprise',
    description: 'Volume illimité, SLA 15 min, équipe dédiée 3 analystes.',
    shortDescription: 'Pour les grandes organisations avec des exigences de réponse critiques.',
    priceMonthly: 999,
    priceYearly: 9990,
    features: { events_per_day: -1, analysts: 3, response_time_min: 15, siem_integration: true },
    displayPriority: 2,
    active: true,
    createdAt: '2026-01-01',
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

  return (
    <Box>
      {/* ── Hero carousel ──────────────────────────────────────── */}
      <HeroCarousel slides={SLIDES} />

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
            {CATEGORIES.map((cat) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <CategoryCard
                  name={cat.name}
                  description={cat.description}
                  slug={cat.slug}
                  icon={cat.icon}
                  accentColor={cat.accentColor}
                />
              </Grid>
            ))}
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
            {TOP_PRODUCTS.map((product) => (
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
