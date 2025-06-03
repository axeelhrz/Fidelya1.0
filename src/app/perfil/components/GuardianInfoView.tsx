"use client"

import React from "react"
import type { Guardian } from "@/context/UserContext"

interface GuardianInfoViewProps {
  guardian: Guardian
  onEditClick: () => void
}

export function GuardianInfoView({ guardian, onEditClick }: GuardianInfoViewProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-6">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">Nombre del Apoderado</h3>
          <p className="text-gray-700">{guardian.full_name || "No especificado"}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Correo Electrónico:</p>
          <p className="font-medium text-blue-600">{guardian.email}</p>
        </div>
        
        <div className="p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Teléfono:</p>
          <p className="font-medium">{guardian.phone || "No registrado"}</p>
        </div>
        
        <div className="p-3 bg-white rounded-md shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Tipo de usuario:</p>
          <p className="font-medium">{guardian.is_staff ? "Funcionario del colegio" : "Apoderado"}</p>
        </div>
      </div>
    </div>
  )
}
