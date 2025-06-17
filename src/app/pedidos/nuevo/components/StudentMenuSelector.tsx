"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { WeekSelector } from '@/components/week-selector'
import { WeekView } from '@/components/week-view'
import { addWeeks } from 'date-fns'
import type { Hijo } from '../hooks/usePedidosForm'
import { MenuOption } from "@/components/day-cell"

interface StudentMenuSelectorProps {
  hijo: Hijo
  loadingMenu: boolean
  selectedWeekStart: Date
  setSelectedWeekStart: (date: Date) => void
  menuOptions: {
    almuerzos: Record<string, MenuOption[]>
    colaciones: Record<string, MenuOption[]>
  }
  selectedOptions: {
    [date: string]: {
      almuerzo?: string
      colacion?: string
    }
  }
  handleSelectAlmuerzo: (date: string, almuerzoId: string) => void
  handleSelectColacion: (date: string, colacionId: string) => void
}

export function StudentMenuSelector({
  hijo,
  loadingMenu,
  selectedWeekStart,
  setSelectedWeekStart,
  menuOptions,
  selectedOptions,
  handleSelectAlmuerzo,
  handleSelectColacion
}: StudentMenuSelectorProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Menú para {hijo.nombre}</h3>
        </div>
        
        {/* Selector de semana */}
        <div className="mb-4">
          <WeekSelector
            currentWeekStart={selectedWeekStart}
            onSelectWeek={setSelectedWeekStart}
          />
        </div>
        
        {/* Vista semanal */}
        <WeekView
          startDate={selectedWeekStart}
          menuOptions={menuOptions}
          selectedOptions={selectedOptions}
          onSelectOption={(date, type, optionId) => {
            if (type === 'almuerzo') {
              handleSelectAlmuerzo(date, optionId);
            } else if (type === 'colacion') {
              handleSelectColacion(date, optionId);
            }
          }}
          isDisabled={loadingMenu}
        />
      </CardContent>
    </Card>
  )
}
