import { createTheme } from '@mui/material/styles'
import { tokens } from './tokens'

export const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary,
    },
    secondary: {
      main: tokens.colors.secondary,
    },
    background: {
      default: tokens.colors.backgroundDefault,
      paper: tokens.colors.backgroundPaper,
    },
    error: {
      main: tokens.colors.error,
    },
    success: {
      main: tokens.colors.success,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
})
