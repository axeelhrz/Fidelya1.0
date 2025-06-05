"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"

export interface Student {
  id: string
  name: string
  grade: string
  section: string
  level: string
  tipo?: string // 'Estudiante' o 'Funcionario'
}

export interface Guardian {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  is_staff: boolean
  students: Student[]
}

interface UserContextType {
  guardian: Guardian | null
  loading: boolean
  refreshUser: () => Promise<void>
  setGuardian: (g: Guardian | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [guardian, setGuardian] = useState<Guardian | null>(null)
  const [loading, setLoading] = useState(true)
  
  const refreshUser = async () => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setGuardian(null)
      setLoading(false)
      return
    }
    // Fetch apoderado (cliente) usando el correo electrónico del usuario
    const { data: clienteData, error } = await supabase
      .from("clientes")
      .select("*, hijos")
      .eq("correo_apoderado", user.email)
      .maybeSingle();
    if (error && (error.code || error.message)) {
      console.error("Error al obtener cliente:", error)
    } else if (!clienteData) {
      console.warn("No se encontró un cliente para el usuario autenticado.");
      setGuardian(null);
      setLoading(false);
      return;
    }
    let hijos: any[] = [];
    if (clienteData) {
      // Si hijos viene como JSON string
      if (typeof clienteData.hijos === "string") {
        try {
          const hijosRaw = JSON.parse(clienteData.hijos);
          hijos = Array.isArray(hijosRaw)
            ? hijosRaw.map((hijo: any, idx: number) => ({
                id: `${clienteData.id}-${idx}`,
                name: hijo?.nombre ?? "",
                grade: hijo?.curso ?? "",
                section: hijo?.letra ?? "",
                level: hijo?.nivel ?? "",
                tipo: hijo?.tipo ?? "Estudiante",
              }))
            : [];
        } catch (e) {
          hijos = [];
        }
      } else if (Array.isArray(clienteData.hijos)) {
        hijos = clienteData.hijos.map((hijo: any, idx: number) => ({
          id: `${clienteData.id}-${idx}`,
          name: hijo?.nombre ?? "",
          grade: hijo?.curso ?? "",
          section: hijo?.letra ?? "",
          level: hijo?.nivel ?? "",
          tipo: hijo?.tipo ?? "Estudiante",
        }));
      } else if (clienteData.hijos && typeof clienteData.hijos === "object") {
        hijos = Object.values(clienteData.hijos).map((hijo: any, idx: number) => ({
          id: `${clienteData.id}-${idx}`,
          name: hijo?.nombre ?? "",
          grade: hijo?.curso ?? "",
          section: hijo?.letra ?? "",
          level: hijo?.nivel ?? "",
          tipo: hijo?.tipo ?? "Estudiante",
        }));
      }  
      console.log("Cliente hijos parseado:", hijos)
      // Mapear correctamente los campos de la base de datos a la interfaz
      setGuardian({
        id: clienteData.id,
        user_id: clienteData.user_id || "",
        full_name: clienteData.nombre_apoderado || "",
        email: clienteData.correo_apoderado || "",
        phone: clienteData.telefono_apoderado || "",
        is_staff: clienteData.tipo_usuario === "funcionario",
        students: hijos || [],
      })
    } else {
      setGuardian(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshUser()
    // eslint-disable-next-line
  }, [])

  return (
    <UserContext.Provider value={{ guardian, loading, refreshUser, setGuardian }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
