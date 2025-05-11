'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Container, 
  Box, 
  Typography, 
  useTheme, 
  alpha,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  IconButton
} from '@mui/material'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { 
  Search as SearchIcon,
  WhatsApp as WhatsAppIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { AuthProvider } from '@/context/auth-context';

// Mock data para los posts
const MOCK_POSTS = [
  {
    id: 1,
    title: 'Cómo automatizar la renovación de pólizas',
    excerpt: 'Descubre las mejores estrategias para automatizar el proceso de renovación y mejorar la retención de clientes.',
    image: '/blog/post1.jpg',
    category: 'Automatización',
    date: '2024-01-15',
    slug: 'como-automatizar-renovacion-polizas',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Estrategias de marketing digital para corredores',
    excerpt: 'Aprende a utilizar las redes sociales y el email marketing para atraer nuevos clientes y fidelizar a los existentes.',
    image: '/blog/post2.jpg',
    category: 'Marketing',
    date: '2024-01-18',
    slug: 'estrategias-marketing-digital-corredores',
    readTime: '7 min'
  },
  {
    id: 3,
    title: 'Optimiza tu productividad con herramientas digitales',
    excerpt: 'Las mejores herramientas y apps para gestionar tu tiempo y aumentar tu productividad como corredor de seguros.',
    image: '/blog/post3.jpg',
    category: 'Productividad',
    date: '2024-01-20',
    slug: 'optimiza-productividad-herramientas-digitales',
    readTime: '6 min'
  },
  {
    id: 4,
    title: 'Guía completa de cross-selling en seguros',
    excerpt: 'Aprende a identificar oportunidades de venta cruzada y aumentar tus ingresos con clientes existentes.',
    image: '/blog/post4.jpg',
    category: 'Crecimiento',
    date: '2024-01-22',
    slug: 'guia-completa-cross-selling-seguros',
    readTime: '8 min'
  },
  {
    id: 5,
    title: 'Tendencias en insurtech para 2024',
    excerpt: 'Las últimas innovaciones tecnológicas que están transformando el sector de los seguros.',
    image: '/blog/post5.jpg',
    category: 'Automatización',
    date: '2024-01-25',
    slug: 'tendencias-insurtech-2024',
    readTime: '5 min'
  },
  {
    id: 6,
    title: 'Cómo crear una experiencia cliente excepcional',
    excerpt: 'Estrategias probadas para mejorar la satisfacción del cliente y aumentar las recomendaciones.',
    image: '/blog/post6.jpg',
    category: 'Marketing',
    date: '2024-01-27',
    slug: 'crear-experiencia-cliente-excepcional',
    readTime: '6 min'
  },
  {
    id: 7,
    title: 'Gestión eficiente de reclamaciones',
    excerpt: 'Optimiza el proceso de gestión de reclamaciones para mejorar la satisfacción del cliente.',
    image: '/blog/post7.jpg',
    category: 'Productividad',
    date: '2024-01-29',
    slug: 'gestion-eficiente-reclamaciones',
    readTime: '4 min'
  },
  {
    id: 8,
    title: 'Estrategias de retención de clientes',
    excerpt: 'Tácticas efectivas para mantener a tus clientes satisfechos y reducir la tasa de cancelación.',
    image: '/blog/post8.jpg',
    category: 'Crecimiento',
    date: '2024-01-30',
    slug: 'estrategias-retencion-clientes',
    readTime: '7 min'
  },
  {
    id: 9,
    title: 'El futuro del trabajo remoto en seguros',
    excerpt: 'Cómo adaptar tu correduría al trabajo remoto y mantener la productividad del equipo.',
    image: '/blog/post9.jpg',
    category: 'Productividad',
    date: '2024-02-01',
    slug: 'futuro-trabajo-remoto-seguros',
    readTime: '5 min'
  }
]

const CATEGORIES = [
  'Automatización',
  'Crecimiento',
  'Marketing',
  'Productividad'
]

// Variantes de animación
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Metadata para SEO
export default function BlogPage() {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [showNewsletter, setShowNewsletter] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  // Mostrar newsletter popup después de 30 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletter(true)
    }, 30000)
    return () => clearTimeout(timer)
  }, [])

  // Monitorear scroll para newsletter
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent > 70 && !showNewsletter) {
        setShowNewsletter(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showNewsletter])

  // Filtrar posts
  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AuthProvider>
    <>
      <Header />
      
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.light, 0.05)})`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(249, 250, 251, 0.7) 0%, transparent 70%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontFamily: 'var(--font-plus-jakarta)',
                  fontSize: { xs: '2.75rem', md: '3.75rem' },
                  fontWeight: 800,
                  textAlign: 'center',
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Recursos para impulsar tu correduría
              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Typography
                variant="h2"
                component="p"
                sx={{
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  color: alpha(theme.palette.text.primary, 0.7),
                  textAlign: 'center',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 6,
                  lineHeight: 1.6
                }}
              >
                Descubre las últimas tendencias, consejos y estrategias para optimizar 
                tu negocio de seguros y destacar en el mercado.
              </Typography>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                <TextField
                  fullWidth
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'background.paper',
                      }
                    }
                  }}
                />
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>

      {/* Blog Content Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          background: theme.palette.background.default
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 4 }}>
            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              <motion.div ref={ref}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(2, 1fr)'
                    },
                    gap: 4
                  }}
                >
                  {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                    <motion.div
                      key={post.id}
                      variants={fadeInUp}
                      initial="initial"
                      animate={inView ? "animate" : "initial"}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          borderRadius: '20px',
                          boxShadow: theme.shadows[1],
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: theme.shadows[4]
                          },
                          '&:active': {
                            transform: 'scale(0.98)'
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={post.image}
                            alt={post.title}
                            sx={{
                              aspectRatio: '16/9',
                              objectFit: 'cover',
                              borderRadius: '16px 16px 0 0'
                            }}
                          />
                          {new Date(post.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <Chip
                              label="Nuevo"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16
                              }}
                            />
                          )}
                        </Box>
                        <CardContent>
                          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {post.readTime} de lectura
                            </Typography>
                          </Stack>
                          <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                              fontFamily: 'var(--font-plus-jakarta)',
                              fontWeight: 700,
                              mb: 1,
                              fontSize: '1.25rem'
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              height: '3em'
                            }}
                          >
                            {post.excerpt}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                            <Button
                              endIcon={<ArrowForwardIcon />}
                              component={Link}
                              href={`/blog/${post.slug}`}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }
                              }}
                            >
                              Leer más
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>

                {visiblePosts < filteredPosts.length && (
                  <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => setVisiblePosts(prev => prev + 6)}
                      sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Cargar más artículos
                    </Button>
                  </Box>
                )}
              </motion.div>
            </Box>

            {/* Sidebar */}
            <Box
              sx={{
                width: '320px',
                display: { xs: 'none', lg: 'block' }
              }}
            >
              <Box
                sx={{
                  position: 'sticky',
                  top: 120,
                  pb: 4
                }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    boxShadow: theme.shadows[1],
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-plus-jakarta)',
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    Categorías
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mb={4}>
                    {CATEGORIES.map(category => (
                      <Chip
                        key={category}
                        label={category}
                        onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                        sx={{
                          bgcolor: category === selectedCategory 
                            ? theme.palette.primary.main 
                            : alpha(theme.palette.primary.main, 0.1),
                          color: category === selectedCategory 
                            ? 'white' 
                            : theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: category === selectedCategory 
                              ? theme.palette.primary.dark 
                              : alpha(theme.palette.primary.main, 0.2)
                          }
                        }}
                      />
                    ))}
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-plus-jakarta)',
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    Posts Populares
                  </Typography>
                  <Stack spacing={2}>
                    {MOCK_POSTS.slice(0, 3).map(post => (
                      <Box key={post.id} sx={{ display: 'flex', gap: 2 }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={80}
                            height={80}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {post.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* WhatsApp Button */}
      <Box
        component="a"
        href="https://wa.me/+59892388748"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000
        }}
      >
        <IconButton
          sx={{
            bgcolor: '#25D366',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: '#128C7E'
            }
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>

      {/* Newsletter Popup */}
      <AnimatePresence>
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              maxWidth: '90%',
              width: 400
            }}
          >
            <Card
              sx={{
                p: 3,
                borderRadius: '20px',
                boxShadow: theme.shadows[4]
              }}
            >
              <IconButton
                onClick={() => setShowNewsletter(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-plus-jakarta)',
                  fontWeight: 700,
                  mb: 2
                }}
              >
                ¡No te pierdas nuestras novedades!
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Suscribite para recibir tips exclusivos de crecimiento para tu correduría.
              </Typography>
              <TextField
                fullWidth
                placeholder="Tu email"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  borderRadius: '12px'
                }}
              >
                Suscribirme
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  </AuthProvider>
  )
}
