"use client";

import { useState } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Grid, 
  Typography, 
  Tabs,
  Tab,
  useTheme,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";

// Datos de proyectos
const projects = [
  {
    id: 1,
    title: "Assuriva",
    category: "Web App",
    description: "Plataforma de gestión para compañías de seguros que automatiza procesos y mejora la experiencia del cliente.",
    image: "/images/portfolio/assuriva.jpg",
    problem: "La compañía necesitaba digitalizar sus procesos manuales y ofrecer una mejor experiencia a sus clientes.",
    solution: "Desarrollé una plataforma web completa con panel de administración, gestión de pólizas y área de clientes.",
    result: "Reducción del 70% en tiempo de gestión y aumento del 45% en satisfacción del cliente.",
    technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
    link: "https://assuriva.com",
  },
  {
    id: 2,
    title: "TuVeterinaria",
    category: "E-commerce",
    description: "Tienda online para clínica veterinaria con sistema de citas, historial médico y venta de productos.",
    image: "/images/portfolio/tuveterinaria.jpg",
    problem: "La clínica necesitaba centralizar sus servicios y ofrecer una experiencia digital completa a sus clientes.",
    solution: "Implementé una plataforma con e-commerce, sistema de citas y acceso a historial médico de mascotas.",
    result: "Incremento del 120% en ventas online y reducción del 30% en carga administrativa.",
    technologies: ["Next.js", "Strapi", "MongoDB", "Vercel"],
    link: "https://tuveterinaria.com",
  },
  {
    id: 3,
    title: "FinTrack",
    category: "Mobile App",
    description: "Aplicación móvil para seguimiento de finanzas personales con análisis de gastos e inversiones.",
    image: "/images/portfolio/fintrack.jpg",
    problem: "Los usuarios necesitaban una herramienta simple pero potente para gestionar sus finanzas personales.",
    solution: "Diseñé y desarrollé una app intuitiva con visualización de datos, categorización automática y alertas.",
    result: "Más de 50,000 descargas en 3 meses y calificación promedio de 4.8/5 en tiendas de aplicaciones.",
    technologies: ["React Native", "Firebase", "TensorFlow", "Google Cloud"],
    link: "https://fintrack.app",
  },
  {
    id: 4,
    title: "EduLearn",
    category: "Web App",
    description: "Plataforma educativa para cursos online con sistema de evaluación y certificación automática.",
    image: "/images/portfolio/edulearn.jpg",
    problem: "La institución educativa necesitaba digitalizar sus cursos y ofrecer una experiencia de aprendizaje moderna.",
    solution: "Desarrollé una plataforma LMS completa con contenido multimedia, evaluaciones y certificaciones.",
    result: "Aumento del 200% en inscripciones y expansión a mercados internacionales.",
    technologies: ["Vue.js", "Laravel", "MySQL", "Digital Ocean"],
    link: "https://edulearn.org",
  },
];

export function PortfolioSection() {
  const theme = useTheme();
  const [filter, setFilter] = useState("all");
  
  const handleFilterChange = (event: React.SyntheticEvent, newValue: string) => {
    setFilter(newValue);
  };
  
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.category.toLowerCase() === filter.toLowerCase());
  
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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };
  
  return (
    <Box 
      component="section" 
      id="portafolio"
      sx={{ 
        py: { xs: 10, md: 16 },
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
            mb: { xs: 6, md: 8 },
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
            Portafolio
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
            Proyectos destacados que han generado resultados excepcionales para mis clientes.
          </Typography>
          
          <Box 
            component={motion.div}
            variants={itemVariants}
            sx={{ 
              display: "flex",
              justifyContent: "center",
              mb: 6,
            }}
          >
            <Tabs 
              value={filter} 
              onChange={handleFilterChange}
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minWidth: 100,
                  '&.Mui-selected': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <Tab label="Todos" value="all" />
              <Tab label="Web App" value="web app" />
              <Tab label="E-commerce" value="e-commerce" />
              <Tab label="Mobile App" value="mobile app" />
            </Tabs>
          </Box>
        </Box>
        
        <AnimatePresence mode="wait">
          <Grid 
            container 
            spacing={4}
            component={motion.div}
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProjects.map((project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <Card 
                  component={motion.div}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.1 }}
                  sx={{ 
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={project.image}
                    alt={project.title}
                    sx={{ 
                      objectFit: "cover",
                    }}
                  />
                  
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h5" component="h3" fontWeight={700}>
                        {project.title}
                      </Typography>
                      <Chip 
                        label={project.category} 
                        size="small"
                        sx={{ 
                          background: theme.palette.mode === "dark" 
                            ? "rgba(0, 112, 243, 0.15)" 
                            : "rgba(0, 112, 243, 0.1)",
                          color: "primary.main",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Problema:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.problem}
                      </Typography>
                      
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Solución:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.solution}
                      </Typography>
                      
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Resultado:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {project.result}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3, mb: 3 }}>
                      {project.technologies.map((tech) => (
                        <Chip 
                          key={tech} 
                          label={tech} 
                          size="small"
                          sx={{ 
                            background: theme.palette.mode === "dark" 
                              ? "rgba(255, 255, 255, 0.1)" 
                              : "rgba(0, 0, 0, 0.05)",
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<IconArrowRight size={18} />}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        mt: 1,
                        fontWeight: 500,
                      }}
                    >
                      Ver proyecto
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      </Container>
    </Box>
  );
}