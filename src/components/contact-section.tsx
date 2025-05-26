"use client";

import { useState, useRef } from "react";
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper,
  Alert,
  Snackbar,
  useTheme,
  InputAdornment,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  MenuItem,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconBrandWhatsapp, 
  IconBrandTelegram,
  IconBrandLinkedin, 
  IconBrandGithub, 
  IconBrandX,
  IconMail,
  IconArrowRight,
  IconCheck,
  IconRocket,
  IconBulb,
  IconCode,
  IconRobot,
  IconChartBar
} from "@tabler/icons-react";

// Opciones de servicios
const serviceOptions = [
  { value: "web", label: "Desarrollo Web", icon: <IconCode size={18} /> },
  { value: "saas", label: "SaaS", icon: <IconRocket size={18} /> },
  { value: "ai", label: "Inteligencia Artificial", icon: <IconRobot size={18} /> },
  { value: "automation", label: "Automatización", icon: <IconChartBar size={18} /> },
  { value: "consulting", label: "Consultoría", icon: <IconBulb size={18} /> },
  { value: "other", label: "Otro", icon: <IconCode size={18} /> },
];

export function ContactSection() {
  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
    projectType: "", // Campo oculto que puede ser prellenado
  });
  
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = "Por favor, ingresa tu nombre";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Por favor, ingresa tu email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Por favor, ingresa un email válido";
    }
    
    if (!formData.message.trim()) {
      errors.message = "Por favor, ingresa un mensaje";
    } else if (formData.message.length < 10) {
      errors.message = "Tu mensaje es demasiado corto";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormStatus("submitting");
    
    try {
      // Simulación de envío (aquí iría la integración real con EmailJS, Firebase, etc.)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de respuesta exitosa
      setFormStatus("success");
      setSnackbarMessage("¡Mensaje enviado con éxito! Te contactaré en menos de 24 horas.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      
      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        service: "",
        message: "",
        projectType: "",
      });
      
      // Mostrar animación de éxito
      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
      
    } catch {
      setFormStatus("error");
      setSnackbarMessage("Error al enviar el mensaje. Por favor, intenta nuevamente.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  const getWhatsAppLink = () => {
    const baseUrl = "https://wa.me/1234567890"; // Reemplazar con tu número real
    const text = `Hola Axel, me gustaría hablar sobre un proyecto de ${formData.service || "desarrollo"}. Mi nombre es ${formData.name || "[Tu nombre]"}.`;
    
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  };
  
  const getTelegramLink = () => {
    return "https://t.me/axeldev"; // Reemplazar con tu usuario de Telegram
  };
  
  // Animaciones con Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  
  const formSuccessVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10 
      }
    }
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.97 }
  };
  
  return (
    <Box 
      component="section" 
      id="contacto"
      sx={{ 
        py: { xs: 12, md: 20 },
        background: theme.palette.mode === "dark" 
          ? `linear-gradient(180deg, rgba(10,10,10,0.8) 0%, rgba(20,20,20,1) 100%), 
             url('/images/grid-pattern-dark.svg')`
          : `linear-gradient(180deg, rgba(250,250,250,0.8) 0%, rgba(255,255,255,1) 100%), 
             url('/images/grid-pattern-light.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box 
        sx={{
          position: "absolute",
          top: "5%",
          left: "5%",
          width: "40%",
          height: "40%",
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />
      
      <Box 
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "30%",
          height: "30%",
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ 
            textAlign: { xs: "center", md: "left" },
            mb: { xs: 8, md: 12 },
          }}
        >
          <Chip
            component={motion.div}
            variants={itemVariants}
            label="Contacto"
            color="primary"
            size="small"
            sx={{ 
              mb: 3, 
              fontWeight: 500,
              px: 1.5,
              py: 2.5,
              borderRadius: "100px",
              background: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          />
          
          <Typography 
            component={motion.h2}
            variants={itemVariants}
            variant="h2" 
            className="text-gradient"
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: 1.2,
              maxWidth: { md: "80%" },
            }}
          >
            ¿Listo para llevar tu idea al siguiente nivel?
          </Typography>
          
          <Typography 
            component={motion.p}
            variants={itemVariants}
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: { xs: "100%", md: "70%" },
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Estoy disponible para proyectos freelance, startups ambiciosas y colaboraciones creativas. 
            Juntos podemos transformar tu visión en una solución digital de alto impacto.
          </Typography>
          
          <Box 
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              display: "inline-flex",
              alignItems: "center",
              mb: { xs: 6, md: 0 },
            }}
          >
            <Chip
              label="Disponible para nuevos proyectos"
              icon={<IconCheck size={16} />}
              color="success"
              sx={{ 
                fontWeight: 500,
                px: 1.5,
                py: 2.5,
                borderRadius: "100px",
                background: theme.palette.mode === "dark" 
                  ? alpha("#4CAF50", 0.15)
                  : alpha("#4CAF50", 0.1),
                color: "#4CAF50",
                border: `1px solid ${alpha("#4CAF50", 0.2)}`,
              }}
            />
          </Box>
        </Box>
        
        {/* Contenedor de dos columnas usando flexbox */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 6 },
            alignItems: "stretch",
          }}
        >
          {/* Columna del formulario */}
          <Box 
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              flex: 1,
              width: "100%",
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                background: theme.palette.background.paper,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.palette.mode === "dark"
                    ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                    : "0 20px 40px rgba(0, 0, 0, 0.06)",
                  transform: "translateY(-5px)",
                }
              }}
            >
              {/* Decoración de fondo del formulario */}
              <Box 
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "150px",
                  height: "150px",
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
                  borderRadius: "0 0 0 100%",
                  zIndex: 0,
                }}
              />
              
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Envíame un mensaje
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  Cuéntame sobre tu proyecto y cómo puedo ayudarte a alcanzar tus objetivos.
                </Typography>
                
                <AnimatePresence mode="wait">
                  {formStatus === "success" ? (
                    <Box 
                      component={motion.div}
                      key="success"
                      initial="hidden"
                      animate="visible"
                      variants={formSuccessVariants}
                      sx={{ 
                        textAlign: "center", 
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: "50%", 
                          background: alpha(theme.palette.primary.main, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <IconCheck size={40} color={theme.palette.primary.main} />
                      </Box>
                      <Typography variant="h5" fontWeight={700} gutterBottom>
                        ¡Mensaje enviado!
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        Gracias por confiar en mí. Responderé a tu mensaje en menos de 24 horas.
                      </Typography>
                    </Box>
                  ) : (
                    <Box 
                      component={motion.form}
                      key="form"
                      ref={formRef}
                      onSubmit={handleSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      sx={{ mt: 4 }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <TextField
                          fullWidth
                          label="Nombre completo"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                          InputProps={{
                            sx: { 
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Correo electrónico"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          variant="outlined"
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          InputProps={{
                            sx: { 
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconMail size={20} color={theme.palette.text.secondary} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          select
                          label="¿En qué puedo ayudarte?"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          variant="outlined"
                          SelectProps={{
                            native: false,
                            sx: { textAlign: "left" }
                          }}
                          InputProps={{
                            sx: { 
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        >
                          {serviceOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                                  {option.icon}
                                </Box>
                                {option.label}
                              </Box>
                            </MenuItem>
                          ))}
                        </TextField>
                        
                        <TextField
                          fullWidth
                          label="Mensaje"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          multiline
                          rows={4}
                          variant="outlined"
                          error={!!formErrors.message}
                          helperText={formErrors.message}
                          InputProps={{
                            sx: { 
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          }}
                        />
                        
                        {/* Campo oculto para el tipo de proyecto */}
                        <input 
                          type="hidden" 
                          name="projectType" 
                          value={formData.projectType} 
                        />
                        
                        <Box sx={{ mt: 1 }}>
                          <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              size="large"
                              fullWidth
                              disabled={formStatus === "submitting"}
                              endIcon={formStatus === "submitting" ? null : <IconArrowRight size={18} />}
                              sx={{ 
                                py: 1.8,
                                fontWeight: 600,
                                fontSize: "1rem",
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              {formStatus === "submitting" ? (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      width: 20, 
                                      height: 20, 
                                      borderRadius: "50%", 
                                      border: "2px solid rgba(255,255,255,0.3)",
                                      borderTopColor: "white",
                                      animation: "spin 0.8s linear infinite",
                                      mr: 1,
                                      "@keyframes spin": {
                                        "0%": { transform: "rotate(0deg)" },
                                        "100%": { transform: "rotate(360deg)" }
                                      }
                                    }} 
                                  />
                                  Enviando...
                                </Box>
                              ) : "Iniciar conversación"}
                            </Button>
                          </motion.div>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
          </Box>
          
          {/* Columna de contacto directo */}
          <Box 
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              flex: 1,
              width: "100%",
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: theme.palette.mode === "dark" 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.2),
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.palette.mode === "dark"
                    ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`
                    : `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
                  transform: "translateY(-5px)",
                }
              }}
            >
              {/* Decoración de fondo */}
              <Box 
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "150px",
                  height: "150px",
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                  borderRadius: "0 100% 0 0",
                  zIndex: 0,
                }}
              />
              
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Conectemos
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Prefiero la comunicación directa y eficiente. Elige la opción que mejor se adapte a tus necesidades:
                </Typography>
                
                <Box sx={{ my: 4, flexGrow: 1 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Correo electrónico profesional
                    </Typography>
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        background: alpha(theme.palette.background.paper, 0.5),
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <IconMail size={20} color={theme.palette.primary.main} />
                      <Typography 
                        variant="body1" 
                        color="primary.main"
                        fontWeight={500}
                        sx={{ ml: 1 }}
                      >
                        axel@axel.dev
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Redes profesionales
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Tooltip title="LinkedIn">
                        <IconButton 
                          component="a"
                          href="https://linkedin.com/in/axeldev"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            background: alpha(theme.palette.background.paper, 0.5),
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: alpha(theme.palette.primary.main, 0.1),
                              transform: "translateY(-3px)",
                            }
                          }}
                        >
                          <IconBrandLinkedin size={22} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="GitHub">
                        <IconButton 
                          component="a"
                          href="https://github.com/axeldev"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            background: alpha(theme.palette.background.paper, 0.5),
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: alpha(theme.palette.primary.main, 0.1),
                              transform: "translateY(-3px)",
                            }
                          }}
                        >
                          <IconBrandGithub size={22} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Twitter / X">
                        <IconButton 
                          component="a"
                          href="https://twitter.com/axeldev"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            background: alpha(theme.palette.background.paper, 0.5),
                            border: "1px solid",
                            borderColor: "divider",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: alpha(theme.palette.primary.main, 0.1),
                              transform: "translateY(-3px)",
                            }
                          }}
                        >
                          <IconBrandX size={22} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Disponibilidad
                    </Typography>
                    <Typography variant="body2">
                      Respuesta garantizada en menos de 24 horas.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Horario preferente: Lunes a Viernes de 9:00 a 18:00 (GMT-3)
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Mensajería instantánea
                </Typography>
                
                <Box sx={{ 
                  display: "flex", 
                  gap: 2, 
                  flexDirection: { xs: "column", sm: "row" } 
                }}>
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    style={{ flex: 1 }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      fullWidth
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<IconBrandWhatsapp size={20} />}
                      sx={{ 
                        py: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      WhatsApp
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    style={{ flex: 1 }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      fullWidth
                      href={getTelegramLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<IconBrandTelegram size={20} />}
                      sx={{ 
                        py: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Telegram
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        
        {/* Mensaje final */}
        <Box 
          component={motion.div}
          variants={itemVariants}
          sx={{ 
            textAlign: "center", 
            mt: 8,
            opacity: 0.9,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Gracias por confiar en mí. Respondo en menos de 24 horas ✉️
          </Typography>
        </Box>
      </Container>
      
      {/* Botón flotante de contacto rápido (glassmorphism) */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 40 },
          right: { xs: 20, md: 40 },
          zIndex: 10,
          display: { xs: "none", md: "block" },
        }}
      >
        <Tooltip title="¿Necesitas ayuda con tu proyecto?">
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="#contacto"
            startIcon={<IconRocket size={20} />}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 100,
              background: theme.palette.mode === "dark"
                ? "rgba(20, 20, 30, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid",
              borderColor: theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
              color: theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.main,
              boxShadow: theme.palette.mode === "dark"
                ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                : "0 10px 30px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                background: theme.palette.mode === "dark"
                  ? "rgba(30, 30, 40, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
                transform: "translateY(-5px)",
                boxShadow: theme.palette.mode === "dark"
                  ? "0 15px 35px rgba(0, 0, 0, 0.4)"
                  : "0 15px 35px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            ¿Hablamos?
          </Button>
        </Tooltip>
      </Box>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}