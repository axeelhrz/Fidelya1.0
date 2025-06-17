"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Divider,
  Switch,
  FormGroup
} from "@mui/material"
import {
  Restaurant as RestaurantIcon,
  Coffee as CoffeeIcon,
  CheckCircle as CheckCircleIcon,
  LocalDining as LocalDiningIcon
} from "@mui/icons-material"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface MenuSelectorProps {
  studentId: string
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
}

export function MenuSelector({
  studentId,
  selectedOptions,
  menuOptions,
  onSelectOption,
  weekDates
}: MenuSelectorProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [preferences, setPreferences] = useState({
    sinCarne: false,
    sinGluten: false,
    vegetariano: false
  })

  const currentDate = weekDates[selectedDay]
  const almuerzosDelDia = menuOptions.almuerzos[currentDate] || []
  const colacionesDelDia = menuOptions.colaciones || {}

  const getDayName = (date: string) => {
    try {
      return format(parseISO(date), 'EEEE', { locale: es })
    } catch {
      return 'Día'
    }
  }

  const getDayNumber = (date: string) => {
    try {
      return format(parseISO(date), 'd', { locale: es })
    } catch {
      return '1'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Selector de días */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <LocalDiningIcon color="primary" />
          Seleccionar día de la semana
        </Typography>
        
        <Tabs
          value={selectedDay}
          onChange={(_, newValue) => setSelectedDay(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              borderRadius: 2,
              margin: '0 4px',
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            },
            '& .Mui-selected': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white !important',
              transform: 'scale(1.05)'
            }
          }}
        >
          {weekDates.map((date, index) => (
            <Tab
              key={date}
              label={
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                    {getDayName(date)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {getDayNumber(date)}
                  </Typography>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Preferencias alimentarias */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(63, 81, 181, 0.05) 100%)',
          border: '1px solid rgba(103, 58, 183, 0.1)'
        }}
      >
        <CardContent sx={{ py: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Preferencias alimentarias
          </Typography>
          <FormGroup row>
            {Object.entries(preferences).map(([key, value]) => (
              <FormControlLabel
                key={key}
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                    size="small"
                  />
                }
                label={
                  key === 'sinCarne' ? 'Sin carne' :
                  key === 'sinGluten' ? 'Sin gluten' : 'Vegetariano'
                }
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Selección de Almuerzo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flex: 1 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)',
              border: '2px solid rgba(255, 152, 0, 0.2)',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ color: 'orange', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Almuerzo
                </Typography>
                {selectedOptions[currentDate]?.almuerzo && (
                  <CheckCircleIcon sx={{ color: 'success.main', ml: 'auto' }} />
                )}
              </Box>

              {almuerzosDelDia.length > 0 ? (
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    value={selectedOptions[currentDate]?.almuerzo || ''}
                    onChange={(e) => onSelectOption(studentId, currentDate, 'almuerzo', e.target.value)}
                  >
                    {almuerzosDelDia.map((almuerzo, index) => (
                      <motion.div
                        key={almuerzo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <FormControlLabel
                          value={almuerzo.id}
                          control={<Radio />}
                          label={
                            <Box sx={{ py: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {almuerzo.descripcion}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip
                                  label={formatPrice(almuerzo.precio)}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  label={almuerzo.codigo}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                          sx={{
                            width: '100%',
                            margin: 0,
                            padding: 1,
                            borderRadius: 2,
                            border: '1px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 152, 0, 0.08)',
                              border: '1px solid rgba(255, 152, 0, 0.3)'
                            },
                            '& .Mui-checked + .MuiFormControlLabel-label': {
                              color: 'primary.main'
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No hay opciones de almuerzo disponibles para este día
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Selección de Colación */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ flex: 1 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
              border: '2px solid rgba(76, 175, 80, 0.2)',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CoffeeIcon sx={{ color: 'green', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Colación
                </Typography>
                {selectedOptions[currentDate]?.colacion && (
                  <CheckCircleIcon sx={{ color: 'success.main', ml: 'auto' }} />
                )}
              </Box>

              {Object.keys(colacionesDelDia).length > 0 ? (
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    value={selectedOptions[currentDate]?.colacion || ''}
                    onChange={(e) => onSelectOption(studentId, currentDate, 'colacion', e.target.value)}
                  >
                    {Object.values(colacionesDelDia).flat().map((colacion: any, index) => (
                      <motion.div
                        key={colacion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <FormControlLabel
                          value={colacion.id}
                          control={<Radio />}
                          label={
                            <Box sx={{ py: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {colacion.descripcion}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Chip
                                  label={formatPrice(colacion.precio)}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                                <Chip
                                  label={colacion.codigo}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                          sx={{
                            width: '100%',
                            margin: 0,
                            padding: 1,
                            borderRadius: 2,
                            border: '1px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.08)',
                              border: '1px solid rgba(76, 175, 80, 0.3)'
                            },
                            '& .Mui-checked + .MuiFormControlLabel-label': {
                              color: 'success.main'
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No hay opciones de colación disponibles
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  )
}
