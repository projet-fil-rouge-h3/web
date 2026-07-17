import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import type { Category, Product } from '@/types'
import type { ProductPayload } from '@/services/admin'

interface ProductFormDialogProps {
  open: boolean
  /** null = création, sinon édition. */
  product: Product | null
  categories: Category[]
  submitting: boolean
  onClose: () => void
  onSubmit: (payload: ProductPayload) => void
}

/** Slug simple généré depuis le nom (accents retirés, tirets). */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const EMPTY_FORM = {
  name: '',
  slug: '',
  categoryId: '',
  shortDescription: '',
  description: '',
  priceMonthly: '',
  priceYearly: '',
  imageUrl: '',
  displayPriority: '1',
  features: '{}',
}

export default function ProductFormDialog({
  open,
  product,
  categories,
  submitting,
  onClose,
  onSubmit,
}: ProductFormDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Recharge le formulaire à chaque ouverture (création ou édition)
  useEffect(() => {
    if (!open) return
    setFormError(null)
    setSlugTouched(Boolean(product))
    setForm(
      product
        ? {
            name: product.name,
            slug: product.slug,
            categoryId: product.category?.id ? String(product.category.id) : '',
            shortDescription: product.shortDescription ?? '',
            description: product.description ?? '',
            priceMonthly: String(product.priceMonthly),
            priceYearly: String(product.priceYearly ?? ''),
            imageUrl: product.imageUrl ?? '',
            displayPriority: String(product.displayPriority),
            features: JSON.stringify(product.features ?? {}, null, 2),
          }
        : EMPTY_FORM
    )
  }, [open, product])

  const set = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = () => {
    if (!form.name.trim() || !form.slug.trim() || form.priceMonthly === '') {
      setFormError('Nom, slug et prix mensuel sont obligatoires.')
      return
    }

    let features: Record<string, unknown> = {}
    try {
      features = form.features.trim() ? JSON.parse(form.features) : {}
    } catch {
      setFormError('Le champ « features » doit être un JSON valide.')
      return
    }

    onSubmit({
      name: form.name.trim(),
      slug: form.slug.trim(),
      categoryId: form.categoryId || undefined,
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      priceMonthly: Number(form.priceMonthly),
      priceYearly: form.priceYearly === '' ? 0 : Number(form.priceYearly),
      imageUrl: form.imageUrl || undefined,
      features,
      displayPriority: Number(form.displayPriority) || 1,
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? `Modifier « ${product.name} »` : 'Nouveau produit'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Nom"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value
              setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }))
            }}
            required
            fullWidth
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setForm((f) => ({ ...f, slug: e.target.value }))
            }}
            required
            fullWidth
            helperText="Utilisé dans l'URL de la fiche produit"
          />
          <TextField
            select
            label="Catégorie"
            value={form.categoryId}
            onChange={set('categoryId')}
            fullWidth
          >
            <MenuItem value="">— Aucune —</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Prix mensuel HT (€)"
              type="number"
              value={form.priceMonthly}
              onChange={set('priceMonthly')}
              required
              fullWidth
            />
            <TextField
              label="Prix annuel HT (€)"
              type="number"
              value={form.priceYearly}
              onChange={set('priceYearly')}
              fullWidth
            />
          </Stack>
          <TextField
            label="Description courte"
            value={form.shortDescription}
            onChange={set('shortDescription')}
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={set('description')}
            multiline
            minRows={3}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="URL de l'image"
              value={form.imageUrl}
              onChange={set('imageUrl')}
              fullWidth
            />
            <TextField
              label="Priorité d'affichage"
              type="number"
              value={form.displayPriority}
              onChange={set('displayPriority')}
              sx={{ width: 180 }}
            />
          </Stack>
          <TextField
            label="Caractéristiques (JSON)"
            value={form.features}
            onChange={set('features')}
            multiline
            minRows={3}
            fullWidth
            slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: 13 } } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {product ? 'Enregistrer' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
