import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Stack,
    useTheme,
    Avatar,
    Divider
  } from '@mui/material';
  import { motion } from 'framer-motion';
  import { 
    MenuBook, 
    PictureAsPdf, 
    Code, 
    GitHub,
    Download,
    OpenInNew
  } from '@mui/icons-material';
  
  export default function AdvancedDocs() {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
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
                  bgcolor: theme.palette.success.main + '20', 
                  color: theme.palette.success.main,
                  mr: 2
                }}
              >
                <MenuBook />
              </Avatar>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600,
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                Documentación avanzada
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Accede a recursos técnicos detallados para aprovechar al máximo todas las funcionalidades de Assuriva.
              </Typography>
              
              <Stack spacing={2}>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.error.main + '20', 
                      color: theme.palette.error.main,
                      mr: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <PictureAsPdf sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      Manual de usuario completo
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      PDF • 8.5 MB • Actualizado hace 2 semanas
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<Download />}
                    size="small"
                    sx={{ 
                      minWidth: 'auto',
                      color: theme.palette.error.main,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: `${theme.palette.error.main}10`,
                      }
                    }}
                  >
                    Descargar
                  </Button>
                </Box>
                
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.info.main + '20', 
                      color: theme.palette.info.main,
                      mr: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <Code sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      API de integración
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      Documentación técnica para desarrolladores
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<OpenInNew />}
                    size="small"
                    sx={{ 
                      minWidth: 'auto',
                      color: theme.palette.info.main,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: `${theme.palette.info.main}10`,
                      }
                    }}
                  >
                    Abrir
                  </Button>
                </Box>
                
                <Box 
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    sx={{ 
                      bgcolor: theme.palette.secondary.main + '20', 
                      color: theme.palette.secondary.main,
                      mr: 2,
                      width: 40,
                      height: 40
                    }}
                  >
                    <GitHub sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 500,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      SDK y ejemplos de código
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      Repositorio con ejemplos de integración
                    </Typography>
                  </Box>
                  <Button
                    startIcon={<OpenInNew />}
                    size="small"
                    sx={{ 
                      minWidth: 'auto',
                      color: theme.palette.secondary.main,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: `${theme.palette.secondary.main}10`,
                      }
                    }}
                  >
                    Explorar
                  </Button>
                </Box>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="outlined"
                color="success"
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Ver toda la documentación técnica
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }