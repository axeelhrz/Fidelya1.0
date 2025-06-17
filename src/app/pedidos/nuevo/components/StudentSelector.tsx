"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Hijo } from '../hooks/usePedidosForm'

interface StudentSelectorProps {
  hijos: Hijo[]
  selectedStudents: string[]
  toggleStudentSelection: (studentId: string) => void
}

export function StudentSelector({ hijos, selectedStudents, toggleStudentSelection }: StudentSelectorProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="text-lg font-medium mb-3">Selecciona estudiantes:</div>
        <div className="space-y-3">
          {hijos?.map((hijo: Hijo) => (
            <div key={hijo.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`hijo-${hijo.id}`} 
                checked={selectedStudents.includes(hijo.id)}
                onCheckedChange={() => toggleStudentSelection(hijo.id)}
              />
              <Label 
                htmlFor={`hijo-${hijo.id}`}
                className="flex-1 cursor-pointer"
              >
                {hijo.nombre} - {hijo.curso}° {hijo.letra} ({hijo.nivel})
              </Label>
            </div>
          ))}
          
          {hijos?.length === 0 && (
            <div className="text-sm text-gray-500">
              No hay estudiantes registrados. Por favor, actualiza tu perfil para agregar estudiantes.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
