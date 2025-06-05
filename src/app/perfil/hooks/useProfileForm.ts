"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/UserContext"
import { supabase } from "@/lib/supabase/client"
import type { Guardian, Student } from "@/context/UserContext"
import { getLevelForGrade, type Grade } from "@/lib/constants"

// Función auxiliar para generar ID único temporal
const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export interface GuardianData {
  id?: string
  fullName: string
  email: string
  phone: string
  isStaff: boolean
  students: Student[]
}

export function useProfileForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { guardian, loading: userLoading, refreshUser } = useUser()
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<GuardianData>(() => ({
    fullName: "",
    email: "",
    phone: "",
    isStaff: false,
    students: [{ 
      id: generateTempId(), 
      name: "", 
      grade: "", 
      section: "", 
      level: "" 
    }],
  }))
  
  // Cargar datos del contexto al montar
  useEffect(() => {
    if (guardian) {
      setFormData({
        id: guardian.id,
        fullName: guardian.full_name,
        email: guardian.email,
        phone: guardian.phone,
        isStaff: guardian.is_staff,
        students: guardian.students.length > 0 ? guardian.students : [{ 
          id: generateTempId(), 
          name: "", 
          grade: "", 
          section: "", 
          level: "" 
        }],
      })
      // Por defecto, empezamos en modo visualización si hay datos
      setIsEditMode(false)
    } else {
      // Si no hay datos, activamos el modo edición directamente
      setIsEditMode(true)
    }
  }, [guardian])

  // Mostrar toast si es primera vez (sin datos)
  useEffect(() => {
    if (!userLoading && !guardian) {
      toast({
        title: "Bienvenido",
        description: "Por favor, complete sus datos para continuar.",
      })
    }
  }, [userLoading, guardian, toast])

  // Función para actualizar el curso basado en el nivel
  const handleStudentGradeChange = (index: number, grade: Grade) => {
    const level = getLevelForGrade(grade)
    updateStudent(index, { grade, level })
  }

  const updateStudent = (index: number, studentData: Partial<Student>) => {
    setFormData(prev => {
      const newStudents = [...prev.students];
      newStudents[index] = {
        ...newStudents[index],
        ...studentData
      };
      return { ...prev, students: newStudents };
    });
  }

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [...prev.students, { 
        id: generateTempId(), 
        name: "", 
        grade: "", 
        section: "", 
        level: "" 
      }],
    }));
  }

  const removeStudent = (index: number) => {
    if (formData.students.length > 1) {
      setFormData(prev => {
        const newStudents = prev.students.filter((_, i) => i !== index);
        return { ...prev, students: newStudents };
      });
    }
  }

  const updateFormData = (data: Partial<GuardianData>) => {
    // Usar función de actualización para evitar problemas de cierres y stale state
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  const resetForm = () => {
    if (guardian) {
      setFormData(prev => ({
        ...prev,
        id: guardian.id,
        fullName: guardian.full_name,
        email: guardian.email,
        phone: guardian.phone,
        isStaff: guardian.is_staff,
        students: guardian.students.length > 0 ? guardian.students : [{ id: generateTempId(), name: "", grade: "", section: "", level: "" }],
      }));
      setIsEditMode(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Obtener usuario autenticado
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user || !user.email) throw new Error("No autenticado")

      // Guardar/actualizar datos en la tabla clientes según el email
      const { error: upsertError } = await supabase
        .from("clientes")
        .upsert({
          correo_apoderado: user.email,
          nombre_apoderado: formData.fullName,
          telefono_apoderado: formData.phone,
          tipo_usuario: formData.isStaff ? "funcionario" : "apoderado",
          hijos: formData.students.map((s, index) => ({
            nombre: s.name,
            curso: s.grade,
            letra: s.section,
            nivel: s.level,
            tipo: s.tipo || (formData.isStaff && index === 0 ? "Funcionario" : "Estudiante")
          }))
        }, { onConflict: "correo_apoderado" })
        
      if (upsertError) throw upsertError
      
      await refreshUser()
      
      toast({
        title: "Datos guardados",
        description: "La información se ha actualizado correctamente.",
      })
      
      setIsEditMode(false)
    } catch (error: any) {
      console.error("Error saving data:", error?.message || error, error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los datos. Intente nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    loading,
    userLoading,
    isEditMode,
    setIsEditMode,
    updateFormData,
    handleStudentGradeChange,
    updateStudent,
    addStudent,
    removeStudent,
    resetForm,
    handleSubmit,
    guardian
  }
}
