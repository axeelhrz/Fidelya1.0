"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Container,
  InputAdornment,
  IconButton,
  Fade,
  Backdrop,
  CircularProgress
} from "@mui/material"
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon
} from "@mui/icons-material"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const { email, password } = formData

      if (!email || !password) {
        throw new Error("Por favor complete todos los campos")
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta al Sistema Casino Escolar.",
      })

      // Redirigir a /admin si es c.wevarh@gmail.com
      if (email.toLowerCase() === "c.wevarh@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Error signing in:", error)
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error.message || "No se pudo iniciar sesión. Verifique sus credenciales.",
      })
    } finally {
      setLoading(false)
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card
              elevation={24}
              sx={{
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                },
                '@keyframes shimmer': {
                  '0%': { backgroundPosition: '-200% 0' },
                  '100%': { backgroundPosition: '200% 0' }
                }
              }}
            >
              <CardContent sx={{ p: 6 }}>
                {/* Logo/Brand Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box textAlign="center" mb={4}>
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 24px',
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
                      </Box>
                    </motion.div>
                    
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                        fontFamily: '"Inter", sans-serif'
                      }}
                    >
                      Bienvenido
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontFamily: '"Inter", sans-serif'
                      }}
                    >
                      Sistema Casino Escolar
                    </Typography>
                  </Box>
                </motion.div>

                {/* Form Section */}
                <motion.form
                  onSubmit={handleSubmit}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        label="Correo Electrónico"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
                            }
                          }
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        required
                        disabled={loading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: 'action.active' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                disabled={loading}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
                            }
                          }
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          fontWeight: 600,
                          fontSize: '1rem',
                          textTransform: 'none',
                          fontFamily: '"Inter", sans-serif',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                            background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                          },
                          '&:disabled': {
                            background: 'linear-gradient(135deg, #a0aec0, #718096)',
                            transform: 'none',
                            boxShadow: 'none'
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transition: 'left 0.5s',
                          },
                          '&:hover::before': {
                            left: '100%',
                          }
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                            Iniciando sesión...
                          </Box>
                        ) : (
                          'Iniciar Sesión'
                        )}
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          color: 'text.secondary',
                          fontFamily: '"Inter", sans-serif'
                        }}
                      >
                        ¿No tienes una cuenta?{' '}
                        <Link
                          href="/auth/registro"
                          style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#764ba2'
                            e.currentTarget.style.textDecoration = 'underline'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#667eea'
                            e.currentTarget.style.textDecoration = 'none'
                          }}
                        >
                          Regístrate aquí
                        </Link>
                      </Typography>
                    </motion.div>
                  </Box>
                </motion.form>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)'
        }}
        open={loading}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ fontFamily: '"Inter", sans-serif' }}>
            Verificando credenciales...
          </Typography>
        </Box>
      </Backdrop>
    </>
  )
}