'use client'

import React, { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  alpha,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Import only the specific icons we need
import { Globe } from '@phosphor-icons/react/dist/ssr/Globe'
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown'
import { Check } from '@phosphor-icons/react/dist/ssr/Check'

// Types
interface Language {
  code: string
  name: string
  flag: string
}

// Available languages
const LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

const LanguageMenu = () => {
  const theme = useTheme()
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0])
  const [showLanguageName, setShowLanguageName] = useState(false)

  // Language menu handlers
  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null)
  }

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    handleLanguageMenuClose()
    // Save preference in localStorage for persistence
    localStorage.setItem('preferredLanguage', language.code)
  }

  // Load preferred language on start
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage) {
      const language = LANGUAGES.find(lang => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
      }
    }
  }, [])

  return (
    <Box 
      onMouseEnter={() => setShowLanguageName(true)}
      onMouseLeave={() => setShowLanguageName(false)}
    >
      <Button
        onClick={handleLanguageMenuOpen}
        endIcon={<CaretDown size={14} weight="bold" />}
        startIcon={<Globe size={18} weight="fill" />}
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          padding: '6px 12px',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'text.primary',
          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
          },
        }}
      >
        <Typography component="span" sx={{ mr: 0.5 }}>
          {currentLanguage.flag}
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, overflow: 'hidden' }}>
          {showLanguageName ? currentLanguage.name : currentLanguage.code.toUpperCase()}
        </Box>
      </Button>
      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={handleLanguageMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            minWidth: '180px',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            selected={currentLanguage.code === language.code}
            sx={{
              py: 1,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
              },
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <Typography component="span" sx={{ fontSize: '1.2rem', mr: 1 }}>
              {language.flag}
            </Typography>
            {language.name}
            {currentLanguage.code === language.code && (
              <Box sx={{ ml: 'auto' }}>
                <Check size={16} weight="bold" />
              </Box>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default LanguageMenu