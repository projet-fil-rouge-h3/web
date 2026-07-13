import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SecurityIcon from '@mui/icons-material/Security'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/auth'

const schema = z
  .object({
    firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
    lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
    email: z.string().email('Adresse e-mail invalide'),
    password: z
      .string()
      .min(8, 'Mot de passe trop court (min. 8 caractères)'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (e) {
      setError(
        e instanceof Error && e.message.includes('déjà utilisé')
          ? 'Un compte existe déjà avec cette adresse e-mail.'
          : 'Une erreur est survenue. Veuillez réessayer.'
      )
    }
  }

  const passwordToggle = (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword((v) => !v)}
        edge="end"
        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  )

  return (
    <Box sx={{ bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{ p: { xs: 3, sm: 5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <SecurityIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              CYNA
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Créer un compte
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Rejoignez CYNA et sécurisez votre entreprise dès aujourd&apos;hui
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Compte créé avec succès ! Redirection vers la connexion…
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('firstName')}
                  label="Prénom"
                  fullWidth
                  autoFocus
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...register('lastName')}
                  label="Nom"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register('email')}
                  label="Adresse e-mail"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register('password')}
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  slotProps={{ input: { endAdornment: passwordToggle } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register('confirmPassword')}
                  label="Confirmer le mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting || success}
                  sx={{ py: 1.5 }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Créer mon compte'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            Déjà un compte ?{' '}
            <MuiLink component={Link} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Se connecter
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
