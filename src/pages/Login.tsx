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
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SecurityIcon from '@mui/icons-material/Security'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

const schema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      // Authentification simulée — remplacer par api.post('/auth/login', data) quand le backend est prêt
      await new Promise((resolve) => setTimeout(resolve, 700))
      setUser({ id: '1', email: data.email, firstName: 'Demo', lastName: 'User', role: 'USER' })
      navigate('/')
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.')
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 128px)',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
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
            Connexion
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Accédez à votre espace client CYNA
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <TextField
              {...register('email')}
              label="Adresse e-mail"
              type="email"
              fullWidth
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register('password')}
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
              <MuiLink
                component={Link}
                to="/forgot-password"
                variant="body2"
                underline="hover"
                sx={{ color: 'text.secondary' }}
              >
                Mot de passe oublié ?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSubmitting}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
            Pas encore de compte ?{' '}
            <MuiLink component={Link} to="/register" underline="hover" sx={{ fontWeight: 600 }}>
              Créer un compte
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
