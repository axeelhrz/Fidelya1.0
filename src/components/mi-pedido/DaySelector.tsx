"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Utensils, Coffee, Check } from 'lucide-react'
import { DayMenuOptions } from '@/types/order'
import { MenuItem } from '@/types/panel'
import { useOrderStore } from '@/store/orderStore'
import { MenuService } from '@/services/menuService'
import { cn } from '@/lib/utils'

interface DaySelectorProps {
  dayMenu: DayMenuOptions
  isReadOnly: boolean
}

export function DaySelector({ dayMenu, isReadOnly }: DaySelectorProps) {
  const { selections, updateSelection } = useOrderStore()
  
  const currentSelection = selections.find(s => s.date === dayMenu.date)
  const selectedAlmuerzo = currentSelection?.almuerzo?.id
  const selectedColacion = currentSelection?.colacion?.id

  const handleAlmuerzoChange = (itemId: string) => {
    if (isReadOnly) return
    
    const item = dayMenu.almuerzos.find(a => a.id === itemId)
    if (item) {
      updateSelection(dayMenu.date, 'almuerzo', item)
    }
  }

  const handleColacionChange = (itemId: string) => {
    if (isReadOnly) return
    
    const item = dayMenu.colaciones.find(c => c.id === itemId)
    if (item) {
      updateSelection(dayMenu.date, 'colacion', item)
    }
  }

  const dayDisplayName = MenuService.getDayDisplayName(dayMenu.date)
  const hasSelections = selectedAlmuerzo || selectedColacion

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      hasSelections && "ring-2 ring-emerald-500/20 border-emerald-200 dark:border-emerald-800",
      !dayMenu.isAvailable && "opacity-60"
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold capitalize">
            {dayDisplayName}
          </span>
          {hasSelections && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Check className="w-3 h-3 mr-1" />
              Seleccionado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!dayMenu.isAvailable ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Menú no disponible para este día</p>
          </div>
        ) : (
          <>
            {/* Sección de Almuerzos */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Almuerzo <span className="text-red-500">*</span>
                </h4>
              </div>
              
              {dayMenu.almuerzos.length > 0 ? (
                <RadioGroup
                  value={selectedAlmuerzo || ''}
                  onValueChange={handleAlmuerzoChange}
                  disabled={isReadOnly}
                  className="space-y-2"
                >
                  {dayMenu.almuerzos.map((item) => (
                    <MenuItemOption
                      key={item.id}
                      item={item}
                      isSelected={selectedAlmuerzo === item.id}
                      isReadOnly={isReadOnly}
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
            {dayMenu.colaciones.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Colación <span className="text-slate-400">(opcional)</span>
                  </h4>
                </div>
                
                <RadioGroup
                  value={selectedColacion || ''}
                  onValueChange={handleColacionChange}
                  disabled={isReadOnly}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                    <RadioGroupItem value="" id={`no-colacion-${dayMenu.date}`} />
                    <label 
                      htmlFor={`no-colacion-${dayMenu.date}`}
                      className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      Sin colación
                    </label>
                  </div>
                  {dayMenu.colaciones.map((item) => (
                    <MenuItemOption
                      key={item.id}
                      item={item}
                      isSelected={selectedColacion === item.id}
                      isReadOnly={isReadOnly}
                    />
                  ))}
                </RadioGroup>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface MenuItemOptionProps {
  item: MenuItem
  isSelected: boolean
  isReadOnly: boolean
}

function MenuItemOption({ item, isSelected, isReadOnly }: MenuItemOptionProps) {
  return (
    <div className={cn(
      "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
      isSelected 
        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
      !isReadOnly && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50",
      !item.available && "opacity-50 cursor-not-allowed"
    )}>
      <RadioGroupItem 
        value={item.id} 
        id={item.id}
        disabled={!item.available || isReadOnly}
      />
      <label 
        htmlFor={item.id} 
        className={cn(
          "flex-1 cursor-pointer",
          !item.available && "cursor-not-allowed"
        )}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {item.code}
            </span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              ${item.price.toLocaleString('es-CL')}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {item.description}
          </p>
          {!item.available && (
            <Badge variant="destructive" className="text-xs">
              No disponible
            </Badge>
          )}
        </div>
      </label>
    </div>
  )
}
