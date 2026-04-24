import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import type { CarouselSlide } from '@/types'

interface Props {
  slides: CarouselSlide[]
  autoPlayInterval?: number
}

const SLIDE_BACKGROUNDS = [
  'linear-gradient(135deg, #0A0E1A 0%, #0D2137 50%, #1A73E8 100%)',
  'linear-gradient(135deg, #0A0E1A 0%, #1A0D37 50%, #6C63FF 100%)',
  'linear-gradient(135deg, #0A0E1A 0%, #0D2137 40%, #00897B 100%)',
]

export default function HeroCarousel({ slides, autoPlayInterval = 5000 }: Props) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const navigate = useNavigate()

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return
      setAnimating(true)
      setCurrent((index + slides.length) % slides.length)
      setTimeout(() => setAnimating(false), 400)
    },
    [animating, current, slides.length]
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo])
  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  useEffect(() => {
    const id = setInterval(next, autoPlayInterval)
    return () => clearInterval(id)
  }, [next, autoPlayInterval])

  if (slides.length === 0) return null

  const slide = slides[current]

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 380, sm: 460, md: 540 },
        background: SLIDE_BACKGROUNDS[current % SLIDE_BACKGROUNDS.length],
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Decorative grid overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(26,115,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,115,232,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Slide content */}
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 3, md: 6 },
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          zIndex: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: '#1A73E8',
            letterSpacing: 3,
            fontWeight: 600,
            mb: 1,
            display: 'block',
          }}
        >
          Cybersécurité SaaS
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            maxWidth: 640,
            lineHeight: 1.2,
            mb: 2,
          }}
        >
          {slide.title}
        </Typography>
        {slide.subtitle && (
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 400,
              maxWidth: 520,
              mb: 4,
              fontSize: { xs: '1rem', md: '1.15rem' },
            }}
          >
            {slide.subtitle}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(slide.linkUrl ?? '/catalog')}
            sx={{ px: 4 }}
          >
            Découvrir
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.4)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
            }}
          >
            Demander une démo
          </Button>
        </Box>
      </Box>

      {/* Prev / Next */}
      <IconButton
        onClick={prev}
        aria-label="Slide précédente"
        sx={{
          position: 'absolute',
          left: { xs: 8, md: 24 },
          color: 'rgba(255,255,255,0.7)',
          bgcolor: 'rgba(255,255,255,0.08)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', color: 'white' },
          zIndex: 2,
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <IconButton
        onClick={next}
        aria-label="Slide suivante"
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 24 },
          color: 'rgba(255,255,255,0.7)',
          bgcolor: 'rgba(255,255,255,0.08)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.16)', color: 'white' },
          zIndex: 2,
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      {/* Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, i) => (
          <Box
            key={i}
            component="button"
            onClick={() => goTo(i)}
            aria-label={`Aller à la slide ${i + 1}`}
            sx={{
              width: i === current ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: i === current ? '#1A73E8' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              p: 0,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
