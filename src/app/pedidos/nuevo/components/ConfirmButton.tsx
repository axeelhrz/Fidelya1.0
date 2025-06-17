"use client"

import { motion } from "framer-motion"
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Chip
} from "@mui/material"
import {
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from "@mui/icons-material"

interface ConfirmButtonProps {
  isComplete: boolean
  isLoading: boolean
  completedCount: number
  totalCount: number
  onConfirm: () => void
  missingStudents: string[]
}

export function ConfirmButton({
  isComplete,
  isLoading,
  completedCount,
  totalCount,
  onConfirm,
  missingStudents
}: ConfirmButtonProps) {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          p: 3,
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.08)'
        }}
      >
        {/* Indicador de progreso */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Progreso del pedido
            </Typography>
            <Chip
              icon={isComplete ? <CheckCircleIcon /> : <WarningIcon />}
              label={`${completedCount}/${totalCount} estudiantes`}
              color={isComplete ? 'success' : 'warning'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: isComplete 
                  ? 'linear-gradient(90deg, #4caf50, #8bc34a)'
                  : 'linear-gradient(90deg, #ff9800, #ffc107)'
              }
            }}
          />
        </Box>

        {/* Mensaje de estado */}
        {!isComplete && missingStudents.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Faltan pedidos para: <strong>{missingStudents.join(', ')}</strong>
            </Typography>
          </Box>
        )}

        {/* Botón principal */}
        <motion.div
          whileHover={{ scale: isComplete ? 1.02 : 1 }}
          whileTap={{ scale: isComplete ? 0.98 : 1 }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onConfirm}
            disabled={!isComplete || isLoading}
            startIcon={
              isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ShoppingCartIcon />
                </motion.div>
              ) : (
                <ShoppingCartIcon />
              )
            }
            sx={{
              height: 56,
              borderRadius: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              background: isComplete 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)',
              boxShadow: isComplete 
                ? '0 8px 32px rgba(102, 126, 234, 0.4)'
                : '0 4px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: isComplete 
                  ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  : 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)',
                boxShadow: isComplete 
                  ? '0 12px 40px rgba(102, 126, 234, 0.5)'
                  : '0 4px 16px rgba(0,0,0,0.1)',
                transform: isComplete ? 'translateY(-2px)' : 'none'
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)',
                color: 'rgba(0,0,0,0.26)',
                boxShadow: 'none'
              }
            }}
          >
            {isLoading ? 'Procesando pedido...' : 
             isComplete ? 'Confirmar Pedido' : 
             'Completa todos los pedidos'}
          </Button>
        </motion.div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 1,
                color: 'text.secondary',
                fontStyle: 'italic'
              }}
            >
              ✨ ¡Perfecto! Todos los pedidos están completos
            </Typography>
          </motion.div>
        )}
      </Box>
    </motion.div>
  )
}
