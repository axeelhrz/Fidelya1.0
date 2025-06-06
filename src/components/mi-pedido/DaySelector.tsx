"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DayMenuDisplay, MenuItem } from '@/types/menu'
import { Child, User } from '@/types/panel'
import { useOrderStore } from '@/store/orderStore'
import { Utensils, Coffee, Clock, CheckCircle2, Circle, User as UserIcon, AlertCircle } from 'lucide-react'
import { format, isToday, isBefore, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DaySelectorProps {
  dayMenu: DayMenuDisplay
  user: User
  isReadOnly: boolean
}

interface MenuItemOptionProps {
  item: MenuItem
  isSelected: boolean
  isReadOnly: boolean
  isPastDay: boolean
}

function MenuItemOption({ item, isSelected, isReadOnly, isPastDay }: MenuItemOptionProps) {
  const isDisabled = isReadOnly || !item.available || isPastDay

  return (
    <div className="flex items-center space-x-3">
      <RadioGroupItem 
        value={item.id} 
        id={item.id}
        disabled={isDisabled}
        className="mt-1"
      />
      <Label 
        htmlFor={item.id} 
        className={cn(
          "flex-1 cursor-pointer",
          isDisabled ? "cursor-not-allowed opacity-50" : ""
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {item.name}
              </span>
              <Badge variant="outline" className="text-xs">
                {item.code}
              </Badge>
              {isSelected && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              {isPastDay && (
                <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  Día pasado
                </Badge>
              )}
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              ${item.price.toLocaleString('es-CL')}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          )}
          {!item.available && !isPastDay && (
            <p className="text-xs text-red-500">No disponible</p>
          )}
          {isPastDay && (
            <p className="text-xs text-red-500">No se pueden hacer pedidos para días pasados</p>
          )}
        </div>
      </Label>
    </div>
  )
}

export function DaySelector({ dayMenu, user, isReadOnly }: DaySelectorProps) {
  const { 
    selectionsByChild, 
    currentChild, 
    updateSelectionByChild,
    children 
  } = useOrderStore()

  // Verificar si es día pasado
  const dayDate = new Date(dayMenu.date)
  const today = new Date()
  const isTodayCheck = isToday(dayDate)
  const isPastDay = isBefore(dayDate, today) && !isTodayCheck
  const isFutureDay = isAfter(dayDate, today)

  // Obtener selecciones actuales para este día y hijo
  const getCurrentSelection = () => {
    if (user.tipoUsuario === 'funcionario') {
      return selectionsByChild.find(s => s.date === dayMenu.date && !s.hijo)
    } else {
      return selectionsByChild.find(s => 
        s.date === dayMenu.date && s.hijo?.id === currentChild?.id
      )
    }
  }

  const currentSelection = getCurrentSelection()
  const selectedAlmuerzo = currentSelection?.almuerzo?.id || ''
  const selectedColacion = currentSelection?.colacion?.id || ''

  const handleAlmuerzoChange = (itemId: string) => {
    if (isReadOnly || isPastDay) return
    
    const selectedItem = dayMenu.almuerzos.find(item => item.id === itemId)
    const targetChild = user.tipoUsuario === 'funcionario' ? null : currentChild
    
    updateSelectionByChild(
      dayMenu.date,
      'almuerzo',
      selectedItem,
      targetChild
    )
  }

  const handleColacionChange = (itemId: string) => {
    if (isReadOnly || isPastDay) return
    
    const selectedItem = dayMenu.colaciones.find(item => item.id === itemId)
    const targetChild = user.tipoUsuario === 'funcionario' ? null : currentChild
    
    updateSelectionByChild(
      dayMenu.date,
      'colacion',
      selectedItem,
      targetChild
    )
  }

  const removeAlmuerzo = () => {
    if (isReadOnly || isPastDay) return
    
    const targetChild = user.tipoUsuario === 'funcionario' ? null : currentChild
    updateSelectionByChild(dayMenu.date, 'almuerzo', undefined, targetChild)
  }

  const removeColacion = () => {
    if (isReadOnly || isPastDay) return
    
    const targetChild = user.tipoUsuario === 'funcionario' ? null : currentChild
    updateSelectionByChild(dayMenu.date, 'colacion', undefined, targetChild)
  }

  // Para apoderados, verificar que haya un hijo seleccionado
  const canMakeSelection = (user.tipoUsuario === 'funcionario' || currentChild) && !isPastDay

  // Determinar el color del card según el estado del día
  const getCardClassName = () => {
    if (isPastDay) {
      return "h-full opacity-60 bg-slate-50 dark:bg-slate-900/50"
    }
    if (isTodayCheck) {
      return "h-full border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10"
    }
    return "h-full"
  }

  return (
    <Card className={getCardClassName()}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="capitalize">{dayMenu.dayLabel}</span>
            <Badge variant="outline" className="text-xs">
              {format(new Date(dayMenu.date), 'd MMM', { locale: es })}
            </Badge>
            {isPastDay && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                <Clock className="w-3 h-3 mr-1" />
                Pasado
              </Badge>
            )}
            {isTodayCheck && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Hoy
              </Badge>
            )}
            {isFutureDay && (
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Disponible
              </Badge>
            )}
          </div>
          {currentSelection && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Seleccionado
            </Badge>
          )}
        </CardTitle>
        
        {/* Mostrar para qué hijo es la selección */}
        {user.tipoUsuario === 'apoderado' && currentChild && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <UserIcon className="w-4 h-4" />
            <span>Pedido para: <strong>{currentChild.name}</strong></span>
          </div>
        )}
        
        {user.tipoUsuario === 'funcionario' && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <UserIcon className="w-4 h-4" />
            <span>Pedido personal</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {!canMakeSelection && !isPastDay ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Selecciona un hijo para hacer el pedido</p>
          </div>
        ) : isPastDay ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No se pueden hacer pedidos para días pasados</p>
            {currentSelection && (
              <p className="text-xs mt-2">
                Tienes un pedido existente para este día
              </p>
            )}
          </div>
        ) : !dayMenu.isAvailable ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Menú no disponible para este día</p>
          </div>
        ) : (
          <>
            {/* Sección de Almuerzos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Almuerzo <span className="text-red-500">*</span>
                  </h4>
                </div>
                {selectedAlmuerzo && !isReadOnly && !isPastDay && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeAlmuerzo}
                    className="text-red-500 hover:text-red-700 h-auto p-1"
                  >
                    Quitar
                  </Button>
                )}
              </div>
              
              {dayMenu.almuerzos.length > 0 ? (
                <RadioGroup
                  value={selectedAlmuerzo || ''}
                  onValueChange={handleAlmuerzoChange}
                  disabled={isReadOnly || isPastDay}
                  className="space-y-2"
                >
                  {dayMenu.almuerzos.map((item) => (
                    <MenuItemOption
                      key={item.id}
                      item={item}
                      isSelected={selectedAlmuerzo === item.id}
                      isReadOnly={isReadOnly}
                      isPastDay={isPastDay}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No hay opciones de almuerzo disponibles
                </p>
              )}
            </div>

            {/* Sección de Colaciones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Colación
                  </h4>
                </div>
                {selectedColacion && !isReadOnly && !isPastDay && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeColacion}
                    className="text-red-500 hover:text-red-700 h-auto p-1"
                  >
                    Quitar
                  </Button>
                )}
              </div>
              
              {dayMenu.colaciones.length > 0 ? (
                <RadioGroup
                  value={selectedColacion || ''}
                  onValueChange={handleColacionChange}
                  disabled={isReadOnly || isPastDay}
                  className="space-y-2"
                >
                  {dayMenu.colaciones.map((item) => (
                    <MenuItemOption
                      key={item.id}
                      item={item}
                      isSelected={selectedColacion === item.id}
                      isReadOnly={isReadOnly}
                      isPastDay={isPastDay}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No hay opciones de colación disponibles
                </p>
              )}
            </div>

            {/* Resumen del día */}
            {(selectedAlmuerzo || selectedColacion) && (
              <div className={cn(
                "mt-4 p-3 rounded-lg border",
                isPastDay 
                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              )}>
                <h5 className={cn(
                  "text-sm font-medium mb-2",
                  isPastDay 
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-blue-900 dark:text-blue-100"
                )}>
                  Resumen del día
                </h5>
                <div className="space-y-1 text-sm">
                  {selectedAlmuerzo && (
                    <div className={cn(
                      "flex justify-between",
                      isPastDay 
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-blue-800 dark:text-blue-200"
                    )}>
                      <span>Almuerzo</span>
                      <span>${dayMenu.almuerzos.find(a => a.id === selectedAlmuerzo)?.price.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  {selectedColacion && (
                    <div className={cn(
                      "flex justify-between",
                      isPastDay 
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-blue-800 dark:text-blue-200"
                    )}>
                      <span>Colación</span>
                      <span>${dayMenu.colaciones.find(c => c.id === selectedColacion)?.price.toLocaleString('es-CL')}</span>
                    </div>
                  )}
                  <div className={cn(
                    "border-t pt-1 mt-2",
                    isPastDay 
                      ? "border-slate-200 dark:border-slate-700"
                      : "border-blue-200 dark:border-blue-700"
                  )}>
                    <div className={cn(
                      "flex justify-between font-medium",
                      isPastDay 
                        ? "text-slate-700 dark:text-slate-300"
                        : "text-blue-900 dark:text-blue-100"
                    )}>
                      <span>Total día</span>
                      <span>
                        ${((dayMenu.almuerzos.find(a => a.id === selectedAlmuerzo)?.price || 0) + 
                           (dayMenu.colaciones.find(c => c.id === selectedColacion)?.price || 0)).toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}