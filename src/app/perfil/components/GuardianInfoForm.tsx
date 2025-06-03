"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
// Crear un componente Alert simple en línea en vez de importarlo
import { AlertCircle } from "lucide-react"
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
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 mt-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <h4 className="font-medium mb-1">Información para funcionarios</h4>
              <div className="text-sm">
                Como funcionario, debe agregarse a sí mismo como estudiante en la sección "Estudiantes" a continuación.
                Por favor, incluya su nombre y el curso donde da clases o cualquier curso válido.
                Esto es necesario para realizar pedidos de almuerzo y colación en el sistema.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
