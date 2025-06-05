"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from "@mui/icons-material"
import { MenuSelector } from "./MenuSelector"

interface StudentCardProps {
  student: {
    id: string
    name: string
    grade: string
    section: string
    level: string
  }
  selectedOptions: {
    [date: string]: {
      almuerzo?: string
      colacion?: string
    }
  }
  menuOptions: {
    almuerzos: Record<string, any[]>
    colaciones: Record<string, any[]>
  }
  onSelectOption: (studentId: string, date: string, type: 'almuerzo' | 'colacion', optionId: string) => void
  weekDates: string[]
  isExpanded: boolean
  onToggleExpand: () => void
}

export function StudentCard({
  student,
  selectedOptions,
  menuOptions,
  onSelectOption,
  weekDates,
  isExpanded,
  onToggleExpand
}: StudentCardProps) {
  // Calcular estado de completitud
  const getCompletionStatus = () => {
    let totalSlots = 0
    let completedSlots = 0
    
    weekDates.forEach(date => {
      if (menuOptions.almuerzos[date]?.length > 0) {
        totalSlots++
        if (selectedOptions[date]?.almuerzo) completedSlots++
      }
      if (menuOptions.colaciones && Object.keys(menuOptions.colaciones).length > 0) {
        totalSlots++
        if (selectedOptions[date]?.colacion) completedSlots++
      }
    })
    
    if (completedSlots === 0) return 'pending'
    if (completedSlots === totalSlots) return 'completed'
    return 'partial'
  }

  const status = getCompletionStatus()
  
  const statusConfig = {
    completed: {
      color: 'success' as const,
      icon: <CheckCircleIcon />,
      label: 'Completado',
      bgColor: 'rgba(46, 125, 50, 0.08)',
      borderColor: 'rgba(46, 125, 50, 0.3)'
    },
    partial: {
      color: 'warning' as const,
      icon: <ScheduleIcon />,
      label: 'Pendiente',
      bgColor: 'rgba(237, 108, 2, 0.08)',
      borderColor: 'rgba(237, 108, 2, 0.3)'
    },
    pending: {
      color: 'error' as const,
      icon: <ErrorIcon />,
      label: 'Sin completar',
      bgColor: 'rgba(211, 47, 47, 0.08)',
      borderColor: 'rgba(211, 47, 47, 0.3)'
    }
  }

  const currentStatus = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card
        sx={{
          borderRadius: 4,
          border: `2px solid ${currentStatus.borderColor}`,
          background: `linear-gradient(135deg, ${currentStatus.bgColor} 0%, rgba(255,255,255,0.95) 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)'
          }
        }}
      >
        <Accordion
          expanded={isExpanded}
          onChange={onToggleExpand}
          sx={{
            background: 'transparent',
            boxShadow: 'none',
            '&:before': { display: 'none' },
            '& .MuiAccordionSummary-root': {
              padding: '20px 24px',
              minHeight: 'auto',
              '&.Mui-expanded': {
                minHeight: 'auto'
              }
            }
          }}
        >
          <AccordionSummary
            expandIcon={
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpandMoreIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              </motion.div>
            }
            sx={{
              '& .MuiAccordionSummary-content': {
                margin: 0,
                alignItems: 'center'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
              {/* Avatar del estudiante */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {student.name.charAt(0).toUpperCase()}
                </Box>
              </motion.div>

              {/* Información del estudiante */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'text.primary',
                    mb: 0.5
                  }}
                >
                  {student.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  {student.grade}° {student.section} • {student.level}
                </Typography>
              </Box>

              {/* Estado y tooltip */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip
                  title={`Estado del pedido: ${currentStatus.label}`}
                  arrow
                  placement="top"
                >
                  <Chip
                    icon={currentStatus.icon}
                    label={currentStatus.label}
                    color={currentStatus.color}
                    variant="filled"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 32,
                      '& .MuiChip-icon': {
                        fontSize: '1rem'
                      }
                    }}
                  />
                </Tooltip>
                
                <Tooltip
                  title="Haz clic para expandir y seleccionar menús"
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails sx={{ padding: '0 24px 24px' }}>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MenuSelector
                    studentId={student.id}
                    selectedOptions={selectedOptions}
                    menuOptions={menuOptions}
                    onSelectOption={onSelectOption}
                    weekDates={weekDates}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </AccordionDetails>
        </Accordion>
      </Card>
    </motion.div>
  )
}
