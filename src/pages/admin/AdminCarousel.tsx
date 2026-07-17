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
import type { CarouselSlidePayload } from '@/services/admin'
import type { CarouselSlide } from '@/types'

const EMPTY_FORM = { title: '', subtitle: '', imageUrl: '', linkUrl: '', displayOrder: '1' }

export default function AdminCarousel() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CarouselSlide | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: slides, isLoading } = useQuery({
    queryKey: ['admin', 'carousel'],
    queryFn: adminApi.getAllSlides,
  })

  useEffect(() => {
    if (!dialogOpen) return
    setFormError(null)
    setForm(
      editing
        ? {
            title: editing.title,
            subtitle: editing.subtitle ?? '',
            imageUrl: editing.imageUrl,
            linkUrl: editing.linkUrl ?? '',
            displayOrder: String(editing.displayOrder),
          }
        : EMPTY_FORM
    )
  }, [dialogOpen, editing])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'carousel'] })
    queryClient.invalidateQueries({ queryKey: ['carousel'] })
  }

  const saveSlide = useMutation({
    mutationFn: (payload: CarouselSlidePayload) =>
      editing ? adminApi.updateSlide(editing.id, payload) : adminApi.createSlide(payload),
    onSuccess: () => {
      invalidate()
      setDialogOpen(false)
    },
    onError: () => setError("L'enregistrement du slide a échoué."),
  })

  const toggleSlide = useMutation({
    mutationFn: adminApi.toggleSlide,
    onSuccess: invalidate,
    onError: () => setError('La modification du slide a échoué.'),
  })

  const handleSubmit = () => {
    if (!form.title.trim() || !form.imageUrl.trim()) {
      setFormError("Titre et URL de l'image sont obligatoires.")
      return
    }
    saveSlide.mutate({
      title: form.title.trim(),
      subtitle: form.subtitle || undefined,
      imageUrl: form.imageUrl.trim(),
      linkUrl: form.linkUrl || undefined,
      displayOrder: Number(form.displayOrder) || 1,
    })
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Slides du carousel ({slides?.length ?? 0})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          Nouveau slide
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
                <TableCell sx={{ fontWeight: 700 }} align="center">Ordre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Titre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sous-titre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Lien</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actif</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Modifier</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(slides ?? []).map((s) => (
                <TableRow key={s.id} hover sx={{ opacity: s.active ? 1 : 0.5 }}>
                  <TableCell align="center">{s.displayOrder}</TableCell>
                  <TableCell>{s.title}</TableCell>
                  <TableCell sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.subtitle ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{s.linkUrl ?? '—'}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={s.active}
                      size="small"
                      onChange={() => toggleSlide.mutate(s)}
                      disabled={toggleSlide.isPending}
                      slotProps={{ input: { 'aria-label': `Activer/désactiver ${s.title}` } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      aria-label={`Modifier ${s.title}`}
                      onClick={() => {
                        setEditing(s)
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
        <DialogTitle>{editing ? `Modifier « ${editing.title} »` : 'Nouveau slide'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Titre"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Sous-titre"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              fullWidth
            />
            <TextField
              label="URL de l'image"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Lien au clic"
                value={form.linkUrl}
                onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                fullWidth
                helperText="Ex. /catalog?cat=soc"
              />
              <TextField
                label="Ordre"
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))}
                sx={{ width: 140 }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saveSlide.isPending}>
            {editing ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
