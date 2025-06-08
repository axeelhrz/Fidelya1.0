"use client"

import { useState, useEffect } from 'react'
import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/app/lib/firebase'
import { useAuth } from '@/hooks/useAuth'
import { Child } from '@/types/panel'

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface ExtendedChild extends Child {
  edad: number
  level: 'basico' | 'medio'
}

interface UseProfileFormReturn {
  formData: ProfileFormData
  children: ExtendedChild[]
  isLoading: boolean
  isSaving: boolean
  hasChanges: boolean
  emailVerified: boolean
  errors: Record<string, string>
  isResendingVerification: boolean
  canResendVerification: boolean
  resendCooldownTime: number
  updateFormData: (field: keyof ProfileFormData, value: string) => void
  addChild: () => void
  updateChild: (id: string, field: keyof ExtendedChild, value: string | number | boolean) => void
  removeChild: (id: string) => void
  saveChanges: () => Promise<boolean>
  resendEmailVerification: () => Promise<boolean>
  validateForm: () => boolean
}

const RESEND_COOLDOWN_SECONDS = 60 // 1 minute cooldown
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAYS = [1000, 3000, 5000] // Progressive delays in milliseconds

// Helper function to clean data for Firestore (remove undefined values)
function cleanDataForFirestore(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return null
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanDataForFirestore(item))
  }
  
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanDataForFirestore(value)
      }
    }
    return cleaned
  }
  
  return obj
}

export function useProfileForm(): UseProfileFormReturn {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [children, setChildren] = useState<ExtendedChild[]>([])
  const [originalData, setOriginalData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })
  const [originalChildren, setOriginalChildren] = useState<ExtendedChild[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [resendCooldownTime, setResendCooldownTime] = useState<number>(0)

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: (user as { phone?: string }).phone || ''
      }
      
      // Transform children to include edad and level properties
      const transformedChildren: ExtendedChild[] = (user.children || []).map(child => {
        const childWithAge = child as Child & { edad?: number; age?: number; level?: 'basico' | 'medio' }
        return {
          ...child,
          edad: childWithAge.edad || childWithAge.age || 0,
          level: childWithAge.level || 'basico'
        }
      })
      
      setFormData(userData)
      setOriginalData(userData)
      setChildren(transformedChildren)
      setOriginalChildren(transformedChildren)
      setEmailVerified(auth.currentUser?.emailVerified || false)
      setIsLoading(false)
    }
  }, [user])

  // Cooldown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (resendCooldownTime > 0) {
      interval = setInterval(() => {
        setResendCooldownTime(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendCooldownTime])

  // Check if user can resend verification
  const canResendVerification = resendCooldownTime === 0 && !isResendingVerification

  // Verificar si hay cambios
  const hasChanges = 
    JSON.stringify(formData) !== JSON.stringify(originalData) ||
    JSON.stringify(children) !== JSON.stringify(originalChildren)

  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addChild = () => {
    const newChild: ExtendedChild = {
      id: Date.now().toString(),
      name: '',
      curso: '',
      active: true,
      edad: 0,
      level: 'basico'
      // Note: rut is omitted instead of being undefined
    }
    setChildren(prev => [...prev, newChild])
  }

  const updateChild = (id: string, field: keyof ExtendedChild, value: string | number | boolean) => {
    setChildren(prev => prev.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ))
    
    // Clear error for this field
    const errorKey = `child_${id}_${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }))
    }
  }

  const removeChild = (id: string) => {
    setChildren(prev => prev.filter(child => child.id !== id))
    
    // Remove any errors for this child
    setErrors(prev => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`child_${id}_`)) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar campos requeridos
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido'
    }

    // Validar teléfono si se proporciona
    if (formData.phone && formData.phone.trim()) {
      // Basic phone validation - allow various formats
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Formato de teléfono inválido'
      }
    }

    // Validar hijos si es apoderado
    if (user?.tipoUsuario === 'apoderado' && children.length > 0) {
      children.forEach((child, index) => {
        if (!child.name.trim()) {
          newErrors[`child_${child.id}_name`] = `Nombre del hijo ${index + 1} es requerido`
        }
        if (!child.edad || child.edad < 1 || child.edad > 18) {
          newErrors[`child_${child.id}_edad`] = `Edad del hijo ${index + 1} debe estar entre 1 y 18 años`
        }
        if (!child.curso.trim()) {
          newErrors[`child_${child.id}_curso`] = `Curso del hijo ${index + 1} es requerido`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveChanges = async (): Promise<boolean> => {
    if (!validateForm() || !user || !auth.currentUser) {
      return false
    }

    setIsSaving(true)
    try {
      const currentUser = auth.currentUser
      const userDocRef = doc(db, 'users', user.id)

      // Actualizar perfil en Firebase Auth si cambió el nombre
      if (formData.firstName !== originalData.firstName || formData.lastName !== originalData.lastName) {
        await updateProfile(currentUser, {
          displayName: `${formData.firstName} ${formData.lastName}`
        })
      }

      // Actualizar email si cambió
      if (formData.email !== originalData.email) {
        await updateEmail(currentUser, formData.email)
        await sendEmailVerification(currentUser)
        setEmailVerified(false)
      }

      // Transform children back to the format expected by the database
      const transformedChildren = children.map(child => {
        const childData: {
          id: string
          name: string
          curso: string
          active: boolean
          age: number
          level: 'basico' | 'medio'
          rut?: string
        } = {
          id: child.id,
          name: child.name.trim(),
          curso: child.curso.trim(),
          active: child.active,
          age: child.edad, // Map edad back to age
          level: child.level
        }
        
        // Only include rut if it has a value
        if (child.rut && child.rut.trim()) {
          childData.rut = child.rut.trim()
        }
        
        return childData
      })

      // Prepare update data, ensuring no undefined values
      const updateData: {
        firstName: string
        lastName: string
        email: string
        children: Array<{
          id: string
          name: string
          curso: string
          active: boolean
          age: number
          level: 'basico' | 'medio'
          rut?: string
        }>
        updatedAt: Date
        phone?: string
      } = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        children: transformedChildren,
        updatedAt: new Date()
      }

      // Only include phone if it has a value
      if (formData.phone && formData.phone.trim()) {
        updateData.phone = formData.phone.trim()
      }

      // Clean the data to remove any undefined values
      const cleanedUpdateData = cleanDataForFirestore(updateData) as typeof updateData

      console.log('Saving data to Firestore:', cleanedUpdateData) // Debug log

      await updateDoc(userDocRef, cleanedUpdateData)

      // Actualizar datos originales
      setOriginalData(formData)
      setOriginalChildren([...children])

      // Clear any previous errors
      setErrors({})

      return true
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      const firebaseError = error as { code?: string; message?: string }
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Este correo electrónico ya está en uso' })
      } else if (firebaseError.code === 'auth/invalid-email') {
        setErrors({ email: 'Formato de correo electrónico inválido' })
      } else if (firebaseError.code === 'auth/requires-recent-login') {
        setErrors({ email: 'Debes volver a iniciar sesión para cambiar tu correo' })
      } else if (firebaseError.message?.includes('invalid data')) {
        setErrors({ general: 'Error en los datos proporcionados. Verifica que todos los campos estén completos correctamente.' })
      } else {
        setErrors({ general: 'Error al guardar los cambios. Intenta nuevamente.' })
      }
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const resendEmailVerification = async (): Promise<boolean> => {
    if (!auth.currentUser || !canResendVerification) {
      return false
    }

    setIsResendingVerification(true)
    setErrors(prev => ({ ...prev, verification: '' })) // Clear previous verification errors

    try {
      // Attempt to send verification with retry logic
      let lastError: { code?: string; message?: string } | null = null
      
      for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
        try {
          await sendEmailVerification(auth.currentUser)
          
          // Success - set cooldown
          setResendCooldownTime(RESEND_COOLDOWN_SECONDS)
          return true
        } catch (error) {
          lastError = error as { code?: string; message?: string }
          const firebaseError = error as { code?: string; message?: string }
          
          // If it's a rate limiting error, don't retry immediately
          if (firebaseError.code === 'auth/too-many-requests') {
            // Set a longer cooldown for rate limiting
            const cooldownTime = Math.min(RESEND_COOLDOWN_SECONDS * (attempt + 1), 300) // Max 5 minutes
            setResendCooldownTime(cooldownTime)
            setErrors(prev => ({ ...prev,
              verification: `Demasiadas solicitudes. Intenta nuevamente en ${cooldownTime} segundos.` 
            }))
            break // Don't retry for rate limiting
          }
          
          // Wait before retrying for other errors
          if (attempt < MAX_RETRY_ATTEMPTS - 1) {
            await sleep(RETRY_DELAYS[attempt])
          }
        }
      }
      
      // If we get here, all attempts failed
      const firebaseError = lastError as { code?: string; message?: string }
      
      if (firebaseError.code === 'auth/too-many-requests') {
        setErrors({ 
          verification: 'Se han enviado demasiadas solicitudes de verificación. Espera un momento antes de intentar nuevamente.' 
        })
      } else if (firebaseError.code === 'auth/user-not-found') {
        setErrors({ 
          verification: 'Usuario no encontrado. Intenta cerrar sesión e iniciar sesión nuevamente.' 
        })
      } else if (firebaseError.code === 'auth/invalid-email') {
        setErrors({ 
          verification: 'El correo electrónico no es válido.' 
        })
      } else {
        setErrors({ 
          verification: 'Error al enviar el correo de verificación. Verifica tu conexión a internet e intenta nuevamente.' 
        })
      }
      
      return false
    } catch (error) {
      console.error('Error al reenviar verificación:', error)
      setErrors({ 
        verification: 'Error inesperado. Intenta nuevamente más tarde.' 
      })
      return false
    } finally {
      setIsResendingVerification(false)
    }
  }

  return {
    formData,
    children,
    isLoading,
    isSaving,
    hasChanges,
    emailVerified,
    errors,
    isResendingVerification,
    canResendVerification,
    resendCooldownTime,
    updateFormData,
    addChild,
    updateChild,
    removeChild,
    saveChanges,
    resendEmailVerification,
    validateForm
  }
}