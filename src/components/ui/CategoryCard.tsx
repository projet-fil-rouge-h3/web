import { Box, Typography, Card, CardActionArea } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  name: string
  description?: string
  slug: string
  icon: ReactNode
  accentColor: string
}

export default function CategoryCard({ name, description, slug, icon, accentColor }: Props) {
  const navigate = useNavigate()

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          borderColor: accentColor,
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/catalog?cat=${slug}`)}
        sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
        {/* Icon badge */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            bgcolor: `${accentColor}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            color: accentColor,
            fontSize: 28,
          }}
        >
          {icon}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {name}
        </Typography>

        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: accentColor,
            fontSize: '0.875rem',
            fontWeight: 600,
            mt: 'auto',
          }}
        >
          Voir les offres
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </CardActionArea>
    </Card>
  )
}
