"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper, 
  Avatar, 
  useTheme,
  Fab,
  Zoom,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { IconSend, IconRobot, IconX, IconMessageCircle } from "@tabler/icons-react";

// Respuestas predefinidas del chatbot
const botResponses = [
  {
    keywords: ["hola", "buenas", "saludos", "hey"],
    response: "¡Hola! Soy el asistente virtual de Axel. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre sus servicios, proyectos o experiencia."
  },
  {
    keywords: ["servicios", "ofreces", "haces"],
    response: "Axel ofrece servicios de desarrollo web, aplicaciones móviles, e-commerce, y consultoría digital. Todos enfocados en maximizar conversiones y resultados de negocio. ¿Te gustaría saber más sobre alguno en particular?"
  },
  {
    keywords: ["precio", "costo", "tarifa", "cobras", "cobro"],
    response: "Los precios varían según las necesidades específicas de cada proyecto. Axel ofrece planes desde $1,500 USD para sitios web básicos hasta $5,000+ USD para plataformas completas. ¿Te gustaría agendar una llamada para discutir tu proyecto?"
  },
  {
    keywords: ["tiempo", "plazo", "duración", "cuánto tarda", "cuánto tiempo"],
    response: "El tiempo de desarrollo depende de la complejidad del proyecto. Generalmente, un sitio web puede estar listo en 2-3 semanas, mientras que plataformas más complejas pueden tomar 1-3 meses. Axel siempre cumple con los plazos acordados."
  },
  {
    keywords: ["portafolio", "proyectos", "trabajos", "clientes"],
    response: "Axel ha trabajado en diversos proyectos como Assuriva (plataforma para seguros), TuVeterinaria (e-commerce), FinTrack (app financiera) y EduLearn (plataforma educativa). Puedes ver más detalles en la sección de Portafolio."
  },
  {
    keywords: ["contacto", "contactar", "hablar", "comunicar"],
    response: "Puedes contactar a Axel a través del formulario en la sección de Contacto, por WhatsApp o enviando un email a contacto@axel.dev. ¿Te gustaría que te proporcione alguno de estos medios específicamente?"
  },
  {
    keywords: ["tecnologías", "stack", "herramientas", "lenguajes"],
    response: "Axel trabaja principalmente con React, Next.js, Node.js, Firebase, MongoDB, y AWS. También tiene experiencia con TypeScript, GraphQL, y diversas APIs de pago y marketing. ¿Hay alguna tecnología específica que te interese?"
  },
  {
    keywords: ["experiencia", "años", "trayectoria"],
    response: "Axel cuenta con más de 7 años de experiencia en desarrollo web y móvil. Ha trabajado con startups, empresas establecidas y como freelance para clientes internacionales. Su enfoque siempre ha sido crear soluciones que generen resultados medibles."
  },
  {
    keywords: ["gracias", "thank", "ok", "entendido"],
    response: "¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas en el futuro, no dudes en volver a consultarme. ¿Hay algo más en lo que pueda asistirte hoy?"
  }
];

// Respuesta por defecto
const defaultResponse = "No tengo información específica sobre eso, pero puedo ayudarte a contactar directamente con Axel. ¿Te gustaría agendar una llamada o enviar un mensaje?";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function AIChatbot() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de Axel. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const handleSend = () => {
    if (input.trim() === "") return;
    
    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Simular tiempo de respuesta
    setTimeout(() => {
      // Buscar respuesta en las predefinidas
      const lowerInput = input.toLowerCase();
      let foundResponse = false;
      
      for (const item of botResponses) {
        if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
          const botMessage: Message = {
            id: messages.length + 2,
            text: item.response,
            sender: "bot",
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, botMessage]);
          foundResponse = true;
          break;
        }
      }
      
      // Si no se encontró respuesta, usar la predeterminada
      if (!foundResponse) {
        const botMessage: Message = {
          id: messages.length + 2,
          text: defaultResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, botMessage]);
      }
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
            boxShadow: "0 4px 20px rgba(93, 95, 239, 0.3)",
          }}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconMessageCircle />
        </Fab>
      </Zoom>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
              width: 350,
              maxWidth: "calc(100vw - 40px)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                height: 500,
                maxHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" 
                  ? "rgba(255, 255, 255, 0.1)" 
                  : "rgba(0, 0, 0, 0.05)",
              }}
              className="glass"
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <IconRobot size={18} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Asistente de Axel
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={toggleChat}
                  sx={{ color: "white" }}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconX size={18} />
                </IconButton>
              </Box>
              
              {/* Messages */}
              <Box
                sx={{
                  p: 2,
                  flexGrow: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: "flex",
                      flexDirection: message.sender === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    {message.sender === "bot" && (
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <IconRobot size={18} />
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        maxWidth: "75%",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: message.sender === "user"
                          ? "primary.main"
                          : theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)",
                        color: message.sender === "user"
                          ? "white"
                          : "text.primary",
                      }}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  gap: 1,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Escribe tu mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 100,
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={input.trim() === ""}
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                >
                  <IconSend size={18} />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}