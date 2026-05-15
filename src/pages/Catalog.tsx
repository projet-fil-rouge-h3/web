import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ProductCard from '@/components/ui/ProductCard'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/data/mock'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const activeSlug = searchParams.get('cat') ?? 'all'

  const filtered = useMemo(() => {
    let list = MOCK_PRODUCTS

    if (activeSlug !== 'all') {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === activeSlug)
      if (cat) list = list.filter((p) => p.categoryId === cat.id)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      )
    }

    return list
  }, [activeSlug, search])

  const handleCategory = (slug: string) => {
    setSearch('')
    if (slug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ cat: slug })
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '60vh', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}
          >
            Nos solutions
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5, mb: 1 }}>
            Catalogue de produits
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520 }}>
            Toutes nos solutions de cybersécurité SaaS, déployables en quelques minutes.
          </Typography>
        </Box>

        {/* Filtres */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 5,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="Tout"
              onClick={() => handleCategory('all')}
              color={activeSlug === 'all' ? 'primary' : 'default'}
              variant={activeSlug === 'all' ? 'filled' : 'outlined'}
            />
            {MOCK_CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                onClick={() => handleCategory(cat.slug)}
                color={activeSlug === cat.slug ? 'primary' : 'default'}
                variant={activeSlug === cat.slug ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          <TextField
            size="small"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 240 }}
          />
        </Box>

        {/* Grille produits */}
        {filtered.length > 0 ? (
          <Grid container spacing={3}>
            {filtered.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              Aucun produit trouvé
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Essayez un autre terme ou sélectionnez une autre catégorie.
            </Typography>
          </Box>
        )}

        {/* Nombre de résultats */}
        {filtered.length > 0 && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 4 }}>
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} affiché
            {filtered.length > 1 ? 's' : ''}
          </Typography>
        )}
      </Container>
    </Box>
  )
}
