import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import type { ReactNode } from 'react'
import { api } from '@/services/api'

const schema = z.object({
  firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Adresse e-mail invalide'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Veuillez choisir un sujet'),
  message: z.string().min(10, 'Message trop court (min. 10 caractères)'),
})

type FormData = z.infer<typeof schema>

const SUBJECTS = [
  'Demande de démo',
  'Informations tarifaires',
  'Support technique',
  'Partenariat',
  'Autre',
]

interface ContactInfo {
  icon: ReactNode
  label: string
  value: string
}

const CONTACT_INFO: ContactInfo[] = [
  { icon: <EmailIcon />, label: 'E-mail', value: 'contact@cyna-it.fr' },
  { icon: <PhoneIcon />, label: 'Téléphone', value: '+33 1 23 45 67 89' },
  {
    icon: <LocationOnIcon />,
    label: 'Adresse',
    value: '42 Avenue de la Cybersécurité, 75001 Paris',
  },
]

export default function Contact() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await api.post<void>('/contact', data)
    setSuccess(true)
    reset()
  }

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <Box sx={{ mb: 8, maxWidth: 560 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}
          >
            Contactez-nous
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.5, mb: 2 }}>
            Parlons de vos besoins
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Notre équipe d&apos;experts répond dans les 24 heures ouvrées. Pour les urgences de
            sécurité, notre SOC est disponible 24h/24, 7j/7.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Formulaire */}
          <Grid size={{ xs: 12, md: 7 }}>
            {success && (
              <Alert
                severity="success"
                sx={{ mb: 4 }}
                onClose={() => setSuccess(false)}
              >
                Message envoyé ! Nous vous répondrons sous 24 heures ouvrées.
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
                    label="Adresse e-mail professionnelle"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    {...register('company')}
                    label="Entreprise (optionnel)"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="subject"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.subject}>
                        <InputLabel>Sujet</InputLabel>
                        <Select {...field} label="Sujet">
                          {SUBJECTS.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.subject && (
                          <FormHelperText>{errors.subject.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    {...register('message')}
                    label="Votre message"
                    multiline
                    rows={5}
                    fullWidth
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ py: 1.5 }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Envoyer le message'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Informations de contact */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {CONTACT_INFO.map((info) => (
                <Paper
                  key={info.label}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ color: 'primary.main', mt: 0.25 }}>{info.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {info.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {info.value}
                    </Typography>
                  </Box>
                </Paper>
              ))}

              {/* Urgence */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <HeadsetMicIcon />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Urgence sécurité ?
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85, mb: 2 }}>
                  Notre SOC traite les incidents critiques 24h/24, 7j/7. Réponse garantie en moins
                  de 15 minutes.
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  +33 1 23 45 67 99
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
