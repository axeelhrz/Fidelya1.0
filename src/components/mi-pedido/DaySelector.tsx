"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DayMenuDisplay, MenuItem } from '@/types/menu'
import { User } from '@/types/panel'
import { useOrderStore } from '@/store/orderStore'
import { MenuService } from '@/services/menuService'
import { MenuType } from './MenuTypeSelector'
import { 
  Utensils, 
  Coffee, 
  Clock, 
  CheckCircle2, 
  User as UserIcon, 
  AlertCircle,
  Calendar,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface DaySelectorProps {
  dayMenu: DayMenuDisplay
  user: User
  isReadOnly: boolean
  menuType: MenuType
}

interface MenuItemOptionProps {
  item: MenuItem
  isSelected: boolean
  isReadOnly: boolean
  isPastDay: boolean
  isWeekend: boolean
}

function MenuItemOption({ item, isSelected, isReadOnly, isPastDay, isWeekend }: MenuItemOptionProps) {
  const isDisabled = isReadOnly || !item.available || isPastDay || isWeekend

  return (
    <div className="flex items-center space-x-3">
      <RadioGroupItem 
        value={item.id} 
        id={item.id}
        disabled={isDisabled}
        className="mt-1 flex-shrink-0"
      />
      <Label 
        htmlFor={item.id} 
        className={cn(
          "flex-1 cursor-pointer min-w-0",
          isDisabled ? "cursor-not-allowed opacity-50" : ""
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {item.name}
              </span>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                {item.code}
              </Badge>
              {isSelected && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              )}
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 flex-shrink-0">
              ${item.price.toLocaleString('es-CL')}
            </span>
          </div>
          {item.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {item.description}
            </p>
          )}
          {!item.available && !isPastDay && !isWeekend && (
            <p className="text-xs text-red-500">No disponible</p>
          )}
        </div>
      </Label>
    </div>
  )
}

export function DaySelector({ dayMenu, user, isReadOnly, menuType }: DaySelectorProps) {
  const { 
    selectionsByChild, 
    currentChild, 
    updateSelectionByChild,
    removeSelectionByChild,
  } = useOrderStore()

  // Usar el servicio mejorado para verificar el estado del día
  const dayDate = MenuService.createLocalDate(dayMenu.date)
  const isPastDay = MenuService.isPastDay(dayMenu.date)
  const isWeekend = MenuService.isWeekend(dayMenu.date)
  const isCurrentDay = !isPastDay && !isWeekend && MenuService.formatToDateString(new Date()) === dayMenu.date
  const isFutureDay = !isPastDay && !isCurrentDay

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

  // Filtrar items según el tipo de menú
  const menuItems = menuType === 'almuerzo' ? dayMenu.almuerzos : dayMenu.colaciones
  const selectedItemId = menuType === 'almuerzo' ? selectedAlmuerzo : selectedColacion
  const hasItems = menuItems.length > 0

  const handleItemChange = (itemId: string) => {
    if (isReadOnly || isPastDay || isWeekend) return
    
    const selectedItem = menuItems.find(item => item.id === itemId)
    const targetChild = user.tipoUsuario === 'funcionario' ? null : currentChild
    
    updateSelectionByChild(
      dayMenu.date,
      menuType,
      selectedItem,
      targetChild
    )
  }

  // Función corregida para remover item específico
  const removeItem = () => {
    if (isReadOnly || isPastDay || isWeekend) return
    
    const targetChild = user.tipoUsuario === 'funcionario' ? null : currentChild
    
    // Usar la función específica para remover solo el tipo de menú actual
    updateSelectionByChild(dayMenu.date, menuType, undefined, targetChild)
  }

  // Función para remover toda la selección del día (icono de basurero)
  const removeEntireSelection = () => {
    if (isReadOnly || isPastDay || isWeekend) return
    
    const targetChildId = user.tipoUsuario === 'funcionario' ? undefined : currentChild?.id
    removeSelectionByChild(dayMenu.date, targetChildId)
  }

  // Para apoderados, verificar que haya un hijo seleccionado
  const canMakeSelection = (user.tipoUsuario === 'funcionario' || currentChild) && !isPastDay && !isWeekend

  // Determinar el color y estilo del card según el estado del día
  const getCardClassName = () => {
    if (isPastDay) {
      return "h-full opacity-60 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
    }
    if (isWeekend) {
      return "h-full bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800"
    }
    if (isCurrentDay) {
      return "h-full border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800"
    }
    if (selectedItemId) {
      return "h-full border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20"
    }
    return "h-full hover:shadow-md transition-shadow duration-200"
  }

  // Obtener icono según el día
  const getDayIcon = () => {
    if (isPastDay) return <Clock className="w-4 h-4" />
    if (isCurrentDay) return <Sun className="w-4 h-4" />
    if (isWeekend) return <Moon className="w-4 h-4" />
    return <Calendar className="w-4 h-4" />
  }

  // Obtener badge del estado
  const getDayStatusBadge = () => {
    if (isPastDay) {
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Pasado
        </Badge>
      )
    }
    if (isWeekend) {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
          <Moon className="w-3 h-3 mr-1" />
          Fin de semana
        </Badge>
      )
    }
    if (isCurrentDay) {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
          <Sun className="w-3 h-3 mr-1" />
          Hoy
        </Badge>
      )
    }
    if (isFutureDay && hasItems) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Disponible
        </Badge>
      )
    }
    return null
  }

  // Obtener el icono del tipo de menú
  const getMenuTypeIcon = () => {
    return menuType === 'almuerzo' ? <Utensils className="w-4 h-4" /> : <Coffee className="w-4 h-4" />
  }

  // Obtener el precio del item seleccionado
  const getSelectedItemPrice = () => {
    const selectedItem = menuItems.find(item => item.id === selectedItemId)
    return selectedItem?.price || 0
  }

  return (
    <Card className={getCardClassName()}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getDayIcon()}
            <span className="capitalize font-bold truncate">{dayMenu.dayLabel}</span>
            <Badge variant="outline" className="text-xs font-medium flex-shrink-0">
              {format(dayDate, 'd \'de\' MMM', { locale: es })}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {getDayStatusBadge()}
            {selectedItemId && (
              <div className="flex items-center gap-1">
                <Badge 
                  variant="secondary" 
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs px-2 py-1"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Seleccionado</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
                {/* Icono de basurero para eliminar toda la selección del día */}
                {!isReadOnly && !isPastDay && !isWeekend && (currentSelection?.almuerzo || currentSelection?.colacion) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeEntireSelection}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-auto p-1"
                    title="Eliminar toda la selección del día"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardTitle>
        
        {/* Mostrar fecha completa mejorada */}
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {MenuService.getDayDisplayName(dayMenu.date)}
        </div>
        
        {/* Mostrar para qué hijo es la selección */}
        {user.tipoUsuario === 'apoderado' && currentChild && !isWeekend && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <UserIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Pedido para: <strong>{currentChild.name}</strong></span>
          </div>
        )}
        
        {user.tipoUsuario === 'funcionario' && !isWeekend && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <UserIcon className="w-4 h-4 flex-shrink-0" />
            <span>Pedido personal</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {isWeekend ? (
          <div className="text-center py-8 text-purple-600 dark:text-purple-400">
            <Moon className="w-12 h-12 mx-auto mb-3 opacity-60" />
            <h3 className="font-medium text-lg mb-2">Fin de Semana</h3>
            <p className="text-sm opacity-80">
              No hay servicio de casino los fines de semana
            </p>
          </div>
        ) : !canMakeSelection && !isPastDay ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Selecciona un hijo para hacer el pedido</p>
          </div>
        ) : isPastDay ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No se pueden hacer pedidos para días pasados</p>
            {selectedItemId && (
              <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="text-xs font-medium mb-2">Pedido existente:</p>
                <div className="flex items-center gap-2 text-xs justify-center">
                  {getMenuTypeIcon()}
                  <span className="truncate">{menuItems.find(item => item.id === selectedItemId)?.name}</span>
                </div>
              </div>
            )}
          </div>
        ) : !dayMenu.isAvailable ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            {getMenuTypeIcon()}
            <div className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Menú no disponible para este día</p>
          </div>
        ) : (
          <>
            {/* Sección del tipo de menú actual */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getMenuTypeIcon()}
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {menuType === 'almuerzo' ? 'Almuerzo' : 'Colación'}
                    {menuType === 'almuerzo' && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                </div>
                {selectedItemId && !isReadOnly && !isPastDay && !isWeekend && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeItem}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-auto px-3 py-1.5 flex-shrink-0"
                    title={`Quitar ${menuType}`}
                  >
                    <span className="text-xs font-medium">Quitar</span>
                  </Button>
                )}
              </div>
              
              {hasItems ? (
                <RadioGroup
                  value={selectedItemId || ''}
                  onValueChange={handleItemChange}
                  disabled={isReadOnly || isPastDay || isWeekend}
                  className="space-y-2"
                >
                  {menuItems.map((item) => (
                    <MenuItemOption
                      key={item.id}
                      item={item}
                      isSelected={selectedItemId === item.id}
                      isReadOnly={isReadOnly}
                      isPastDay={isPastDay}
                      isWeekend={isWeekend}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No hay opciones de {menuType === 'almuerzo' ? 'almuerzo' : 'colación'} disponibles
                </p>
              )}
            </div>

            {/* Resumen del día para el tipo de menú actual */}
            {selectedItemId && (
              <div className={cn(
                "mt-4 p-4 rounded-lg border",
                isPastDay 
                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  : isCurrentDay
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              )}>
                <h5 className={cn(
                  "text-sm font-medium mb-3 flex items-center gap-2",
                  isPastDay 
                    ? "text-slate-700 dark:text-slate-300"
                    : isCurrentDay
                    ? "text-blue-900 dark:text-blue-100"
                    : "text-emerald-900 dark:text-emerald-100"
                )}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Selección del día</span>
                </h5>
                <div className="space-y-2 text-sm">
                  <div className={cn(
                    "flex justify-between items-center gap-2",
                    isPastDay 
                      ? "text-slate-600 dark:text-slate-400"
                      : isCurrentDay
                      ? "text-blue-800 dark:text-blue-200"
                      : "text-emerald-800 dark:text-emerald-200"
                  )}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getMenuTypeIcon()}
                      <span className="truncate">{menuType === 'almuerzo' ? 'Almuerzo' : 'Colación'}</span>
                    </div>
                    <span className="font-medium flex-shrink-0">
                      ${getSelectedItemPrice().toLocaleString('es-CL')}
                    </span>
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