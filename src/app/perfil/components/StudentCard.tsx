"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
// Reemplazamos la importación del Alert con un componente personalizado
import { InfoIcon } from "lucide-react"
import { GRADES, GRADE_SECTIONS } from "@/lib/constants"
import type { Student } from "@/context/UserContext"
import type { Grade } from "@/lib/constants"

interface StudentCardProps {
  student: Student
  index: number
  isEditMode: boolean
  canRemove: boolean
  onRemove: (index: number) => void
  onChange: (index: number, student: Partial<Student>) => void
  onGradeChange: (index: number, grade: Grade) => void
  isStaff?: boolean // Indicador de si el usuario es funcionario
}

export function StudentCard({
  student,
  index,
  isEditMode,
  canRemove,
  onRemove,
  onChange,
  onGradeChange,
  isStaff = false
}: StudentCardProps) {
  // Asignar tipo automáticamente según contexto
  React.useEffect(() => {
    // Verificar primero si es necesario actualizar para evitar actualizaciones infinitas
    const shouldUpdate = 
      (isStaff && index === 0 && student.tipo !== "Funcionario") || 
      (!student.tipo && !isStaff);
      
    if (shouldUpdate) {
      const newTipo = (isStaff && index === 0) ? "Funcionario" : "Estudiante";
      setTimeout(() => {
        onChange(index, { tipo: newTipo });
      }, 0);
    }
  }, [isStaff, index, student.tipo, onChange])
  
  return (
    <Card className={`overflow-hidden border-l-4 ${student.name ? 'border-l-green-600' : 'border-l-gray-300'}`}>
      <CardContent className="p-4">
        {!isEditMode ? (
          <div className="py-2">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="font-medium text-lg">{student.name || "(Sin nombre)"}</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pl-11">
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1 font-medium">Curso:</p>
                <p className="font-medium text-blue-700">{GRADES.find(g => g.value === student.grade)?.label || "No especificado"}</p>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1 font-medium">Sección:</p>
                <p className="font-medium text-blue-700">{student.section || "No especificada"}</p>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1 font-medium">Tipo:</p>
                <p className="font-medium text-blue-700">{student.tipo || "Estudiante"}</p>
              </div>
              <div className="p-2 bg-white rounded-md shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1 font-medium">Nivel:</p>
                <p className="font-medium text-blue-700">{student.level || "No especificado"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">
                {isStaff && index === 0 ? "Datos del Funcionario" : `Estudiante ${index + 1}`}
              </h4>
              {canRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-2 text-destructive"
                  onClick={() => onRemove(index)}
                >
                  Eliminar
                </Button>
              )}
            </div>
            
            {/* Mostrar guía específica para funcionarios */}
            {isStaff && index === 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 mb-3">
                <div className="flex">
                  <InfoIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="text-sm">
                    Como funcionario, debe ingresar sus propios datos aquí. Por favor, incluya su nombre y el curso donde da clases.
                    Su tipo de usuario se guardará como "Funcionario".
                  </div>
                </div>
              </div>
            )}
            
            {/* El tipo de usuario se asigna automáticamente según el rol */}

            <div className="grid gap-2">
              <Label>Nombre del Estudiante</Label>
              <Input
                value={student.name || ""}
                onChange={(e) => onChange(index, { name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Curso</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={student.grade}
                  onChange={(e) => onGradeChange(index, e.target.value as Grade)}
                  required
                >
                  <option value="">Seleccione un curso</option>
                  {GRADES.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label>Letra</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={student.section}
                  onChange={(e) => onChange(index, { section: e.target.value })}
                  required
                >
                  <option value="">Seleccione una letra</option>
                  {GRADE_SECTIONS.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {student.level && (
              <div className="bg-muted px-4 py-2 rounded-md">
                <Label>Nivel: {student.level}</Label>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
