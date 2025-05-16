"use client";

import { useState } from "react";
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  TextField, 
  Typography, 
  MenuItem,
  Paper,
  Alert,
  Snackbar,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { IconBrandWhatsapp, IconSend } from "@tabler/icons-react";

// Opciones de servicios
const serviceOptions = [
  { value: "web", label: "Desarrollo Web" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "app", label: "Aplicación Móvil" },
  { value: "ui", label: "Diseño UI/UX" },
  { value: "otro", label: "Otro" },
];

export function ContactSection() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aquí iría la lógica para enviar el formulario a un servicio como Resend o FormSubmit
      // Por ahora, simulamos una respuesta exitosa
      
      // Simulación de envío exitoso
      setSnackbarMessage("¡Mensaje enviado con éxito! Te contactaré pronto.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      
      // Resetear formulario
      setFormData({
        name: "",
        email: "",
        service: "",
        message: "",
      });
    } catch (error) {
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
  
  return (
    <Box 
      component="section" 
      id="contacto"
      sx={{ 
        py: { xs: 10, md: 16 },
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(20,20,20,1) 100%)"
          : "linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ 
            textAlign: "center",
            mb: { xs: 8, md: 12 },
          }}
        >
          <Typography 
            component={motion.h2}
            variants={itemVariants}
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Hablemos de tu proyecto
          </Typography>
          
          <Typography 
            component={motion.p}
            variants={itemVariants}
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: "700px",
              mx: "auto",
              mb: 4,
              fontWeight: 400,
            }}
          >
            Cuéntame sobre tu idea y juntos la convertiremos en una solución digital de alto impacto.
          </Typography>
        </Box>
        
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box 
              component={motion.div}
              variants={itemVariants}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Envíame un mensaje
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Completa el formulario y me pondré en contacto contigo lo antes posible.
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Servicio requerido"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      >
                        {serviceOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12}>
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
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        endIcon={<IconSend size={18} />}
                        sx={{ 
                          py: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        Enviar mensaje
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box 
              component={motion.div}
              variants={itemVariants}
              sx={{ height: "100%" }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: theme.palette.mode === "dark" 
                    ? "linear-gradient(135deg, rgba(0, 112, 243, 0.2) 0%, rgba(0, 112, 243, 0.05) 100%)"
                    : "linear-gradient(135deg, rgba(0, 112, 243, 0.1) 0%, rgba(0, 112, 243, 0.02) 100%)",
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderWidth: "1px",
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Contacto directo
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Si prefieres una comunicación más directa, puedes contactarme a través de los siguientes medios:
                </Typography>
                
                <Box sx={{ my: 4, flexGrow: 1 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Correo electrónico
                    </Typography>
                    <Typography variant="body1" color="primary.main">
                      contacto@axel.dev
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Horario de atención
                    </Typography>
                    <Typography variant="body2">
                      Lunes a Viernes: 9:00 - 18:00 (GMT-3)
                    </Typography>
                    <Typography variant="body2">
                      Respuesta garantizada en menos de 24 horas.
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
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
                    mt: "auto",
                  }}
                >
                  Habla conmigo ahora mismo
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
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