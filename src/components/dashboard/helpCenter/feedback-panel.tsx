import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    LinearProgress, 
    Stack, 
    useTheme,
    Avatar,
    Rating,
    Button
  } from '@mui/material';
  import { motion } from 'framer-motion';
  import { 
    Feedback, 
    ThumbUp, 
    RemoveRedEye, 
    CheckCircle,
    EmojiEvents
  } from '@mui/icons-material';
  import { useHelpCenter } from '@/hooks/use-help-center';
  
  export default function FeedbackPanel() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { userStats } = useHelpCenter();
    
    // Calcular porcentaje de problemas resueltos
    const solvedPercentage = userStats 
      ? Math.round((userStats.problemsSolved / Math.max(userStats.articlesRead, 1)) * 100)
      : 0;
    
    return (
      <Box sx={{ mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              background: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center',
                borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              }}
            >
              <Avatar
                sx={{ 
                  bgcolor: theme.palette.info.main + '20', 
                  color: theme.palette.info.main,
                  mr: 2
                }}
              >
                <Feedback />
              </Avatar>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Tu experiencia
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={2}>
                {userStats && (
                  <>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          <RemoveRedEye fontSize="small" sx={{ mr: 1 }} />
                          Artículos leídos
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {userStats.articlesRead}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(userStats.articlesRead * 10, 100)} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.info.main
                          }
                        }} 
                      />
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
                          Problemas resueltos
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {userStats.problemsSolved} ({solvedPercentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={solvedPercentage} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.success.main
                          }
                        }} 
                      />
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          <ThumbUp fontSize="small" sx={{ mr: 1 }} />
                          Satisfacción general
                        </Typography>
                        <Typography 
                          variant="body2" 
                          fontWeight="600"
                          sx={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {userStats.satisfaction}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={userStats.satisfaction} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: theme.palette.warning.main
                          }
                        }} 
                      />
                    </Box>
                  </>
                )}
                
                <Box sx={{ mt: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    ¿Qué tan útil ha sido el Centro de Ayuda?
                  </Typography>
                  <Rating 
                    name="help-center-rating" 
                    defaultValue={4} 
                    precision={1} 
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    Enviar comentarios
                  </Button>
                </Box>
                
                {userStats && userStats.articlesRead >= 5 && (
                  <Box 
                    sx={{ 
                      mt: 1, 
                      p: 1.5, 
                      borderRadius: 2,
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Avatar
                      sx={{ 
                        bgcolor: theme.palette.warning.main + '20', 
                        color: theme.palette.warning.main,
                        mr: 2
                      }}
                    >
                      <EmojiEvents />
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="body2" 
                        fontWeight="600"
                        sx={{ 
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        ¡Insignia desbloqueada!
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        Explorador: Has leído más de 5 artículos
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }