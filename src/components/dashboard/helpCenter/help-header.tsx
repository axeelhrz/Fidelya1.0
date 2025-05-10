import { Box, Typography, Stack, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { UserHelpStats } from '@/types/help-center';
import { School, Search, CheckCircle } from '@mui/icons-material';

interface HelpHeaderProps {
  userStats: UserHelpStats | null;
}

export default function HelpHeader({ userStats }: HelpHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          background: isDark 
            ? 'linear-gradient(to right, rgba(30, 30, 30, 0.8), rgba(20, 20, 20, 0.9))' 
            : 'linear-gradient(to right, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95))',
          backdropFilter: 'blur(10px)',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
            : '0 8px 32px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`,
          mb: 4
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              fontFamily="'Sora', sans-serif" 
              fontWeight="700"
              sx={{ 
                mb: 1,
                background: isDark 
                  ? 'linear-gradient(90deg, #fff 0%, #ccc 100%)' 
                  : 'linear-gradient(90deg, #333 0%, #666 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Centro de Ayuda
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              fontFamily="'Plus Jakarta Sans', sans-serif"
              sx={{ maxWidth: 600 }}
            >
              Encuentra respuestas, tutoriales y soluciones para aprovechar al máximo tu experiencia con Assuriva.
            </Typography>
          </Box>
          
          {userStats && (
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}
            >
              <Chip
                icon={<School sx={{ color: theme.palette.primary.main }} />}
                label={`${userStats.articlesRead} artículos leídos`}
                sx={{ 
                  bgcolor: isDark ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
                  borderRadius: '16px',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
              <Chip
                icon={<CheckCircle sx={{ color: theme.palette.success.main }} />}
                label={`${userStats.problemsSolved} problemas resueltos`}
                sx={{ 
                  bgcolor: isDark ? 'rgba(46, 125, 50, 0.1)' : 'rgba(46, 125, 50, 0.05)',
                  borderRadius: '16px',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
              <Chip
                icon={<Search sx={{ color: theme.palette.info.main }} />}
                label={`${userStats.searchCount} búsquedas`}
                sx={{ 
                  bgcolor: isDark ? 'rgba(2, 136, 209, 0.1)' : 'rgba(2, 136, 209, 0.05)',
                  borderRadius: '16px',
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            </Stack>
          )}
        </Stack>
      </Box>
    </motion.div>
  );
}