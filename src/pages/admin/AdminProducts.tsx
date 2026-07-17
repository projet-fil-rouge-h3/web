import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { AddOutlined as AddIcon, EditOutlined as EditIcon } from '@mui/icons-material'
import { adminApi } from '@/services/admin'
import type { ProductPayload } from '@/services/admin'
import type { Product } from '@/types'
import ProductFormDialog from './ProductFormDialog'

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const { data: productsPage, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => adminApi.getAllProducts(0, 50),
  })

  const { data: categories } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminApi.getAllCategories,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const saveProduct = useMutation({
    mutationFn: (payload: ProductPayload) =>
      editing ? adminApi.updateProduct(editing.id, payload) : adminApi.createProduct(payload),
    onSuccess: () => {
      invalidate()
      setDialogOpen(false)
    },
    onError: () => setError("L'enregistrement du produit a échoué."),
  })

  const toggleProduct = useMutation({
    mutationFn: adminApi.toggleProduct,
    onSuccess: invalidate,
    onError: () => setError('La modification du produit a échoué.'),
  })

  const products = productsPage?.content ?? []

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Produits ({productsPage?.totalElements ?? 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          Nouveau produit
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {isLoading ? (
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
                <TableCell sx={{ fontWeight: 700 }} align="center">Modifier</TableCell>
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
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      aria-label={`Modifier ${p.name}`}
                      onClick={() => {
                        setEditing(p)
                        setDialogOpen(true)
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ProductFormDialog
        open={dialogOpen}
        product={editing}
        categories={categories ?? []}
        submitting={saveProduct.isPending}
        onClose={() => setDialogOpen(false)}
        onSubmit={(payload) => saveProduct.mutate(payload)}
      />
    </>
  )
}
