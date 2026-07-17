import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '@/components/ui/ProductCard'
import { catalogApi } from '@/services/catalog'
import { useDebounce } from '@/hooks/useDebounce'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const activeSlug = searchParams.get('cat') ?? 'all'

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.getCategories,
  })

  const activeCategory = categories.find((c) => c.slug === activeSlug)

  const {
    data: productsPage,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products', { q: debouncedSearch, categoryId: activeCategory?.id }],
    queryFn: () =>
      catalogApi.searchProducts({
        q: debouncedSearch || undefined,
        categoryId: activeCategory?.id,
      }),
  })

  const products = productsPage?.content ?? []

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
            {categories.map((cat) => (
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

        {/* Erreur API */}
        {isError && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Impossible de charger le catalogue. Vérifiez que le serveur est démarré puis réessayez.
          </Alert>
        )}

        {/* Grille produits */}
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={320} />
              </Grid>
            ))}
          </Grid>
        ) : products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          !isError && (
            <Box sx={{ textAlign: 'center', py: 12 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                Aucun produit trouvé
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                Essayez un autre terme ou sélectionnez une autre catégorie.
              </Typography>
            </Box>
          )
        )}

        {/* Nombre de résultats */}
        {products.length > 0 && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mt: 4 }}>
            {productsPage?.totalElements} produit{(productsPage?.totalElements ?? 0) > 1 ? 's' : ''} affiché
            {(productsPage?.totalElements ?? 0) > 1 ? 's' : ''}
          </Typography>
        )}
      </Container>
    </Box>
  )
}
