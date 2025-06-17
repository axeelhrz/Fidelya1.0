"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Crear un componente Alert simple en línea en vez de importarlo
import { AlertCircle, Users, GraduationCap } from "lucide-react"
import type { GuardianData } from "../hooks/useProfileForm"

interface GuardianInfoFormProps {
  formData: GuardianData
  onChange: (data: Partial<GuardianData>) => void
}

export function GuardianInfoForm({ formData, onChange }: GuardianInfoFormProps) {
  // No usamos un estado interno para la alerta, sino que lo derivamos directamente
  // del prop formData.isStaff para evitar actualizaciones recursivas
  const showStaffAlert = formData.isStaff
  
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          value={formData.fullName || ""}
          onChange={(e) => onChange({ fullName: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          readOnly
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          No es posible cambiar el correo electrónico.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => onChange({ phone: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isStaff"
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          checked={formData.isStaff || false}
          onChange={(e) => {
            // Usar el evento directo en lugar del componente Switch
            onChange({ isStaff: e.target.checked })
          }}
        />
        <Label htmlFor="isStaff" className="ml-2">Soy funcionario del colegio</Label>
      </div>
      
      {/* Alerta para funcionarios */}
      {showStaffAlert && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-800 rounded-xl p-6 mt-4">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Información para funcionarios
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Como funcionario, usted puede:
                  </h5>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Agregarse a sí mismo</strong> como funcionario en la sección &quot;Estudiantes&quot; para realizar pedidos de almuerzo y colación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span><strong>Agregar a sus hijos</strong> como estudiantes normales si también es apoderado</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <h5 className="font-medium mb-2 text-emerald-800">💰 Precios diferenciados:</h5>
                  <ul className="space-y-1 ml-4 text-emerald-700">
                    <li>• <strong>Funcionarios:</strong> Precio especial para personal del colegio</li>
                    <li>• <strong>Estudiantes:</strong> Precio regular para alumnos</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-amber-800">
                    <strong>Importante:</strong> Al agregarse como funcionario, incluya su nombre completo y el curso/área donde trabaja (ej: &quot;Secretaría&quot;, &quot;1° Básico&quot;, &quot;Biblioteca&quot;, etc.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}