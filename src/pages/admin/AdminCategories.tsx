import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { AddOutlined as AddIcon, EditOutlined as EditIcon } from '@mui/icons-material'
import { adminApi } from '@/services/admin'
import type { CategoryPayload } from '@/services/admin'
import type { Category } from '@/types'

const EMPTY_FORM = { name: '', slug: '', description: '', imageUrl: '' }

export default function AdminCategories() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: adminApi.getAllCategories,
  })

  useEffect(() => {
    if (!dialogOpen) return
    setFormError(null)
    setForm(
      editing
        ? {
            name: editing.name,
            slug: editing.slug,
            description: editing.description ?? '',
            imageUrl: editing.imageUrl ?? '',
          }
        : EMPTY_FORM
    )
  }, [dialogOpen, editing])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  const saveCategory = useMutation({
    mutationFn: (payload: CategoryPayload) =>
      editing ? adminApi.updateCategory(editing.id, payload) : adminApi.createCategory(payload),
    onSuccess: () => {
      invalidate()
      setDialogOpen(false)
    },
    onError: () => setError("L'enregistrement de la catégorie a échoué."),
  })

  const toggleCategory = useMutation({
    mutationFn: adminApi.toggleCategory,
    onSuccess: invalidate,
    onError: () => setError('La modification de la catégorie a échoué.'),
  })

  const handleSubmit = () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError('Nom et slug sont obligatoires.')
      return
    }
    saveCategory.mutate({
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
    })
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Catégories ({categories?.length ?? 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          Nouvelle catégorie
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
                <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Active</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Modifier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(categories ?? []).map((c) => (
                <TableRow key={c.id} hover sx={{ opacity: c.active ? 1 : 0.5 }}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{c.slug}</TableCell>
                  <TableCell sx={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.description ?? '—'}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={c.active}
                      size="small"
                      onChange={() => toggleCategory.mutate(c)}
                      disabled={toggleCategory.isPending}
                      slotProps={{ input: { 'aria-label': `Activer/désactiver ${c.name}` } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      aria-label={`Modifier ${c.name}`}
                      onClick={() => {
                        setEditing(c)
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? `Modifier « ${editing.name} »` : 'Nouvelle catégorie'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Nom"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              required
              fullWidth
              helperText="Utilisé dans les filtres du catalogue (ex. soc, edr, xdr)"
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              minRows={2}
              fullWidth
            />
            <TextField
              label="URL de l'image"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saveCategory.isPending}>
            {editing ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
