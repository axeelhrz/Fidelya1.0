"use client"
import { useState, useCallback } from "react"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

interface ValidationRules {
  [key: string]: ValidationRule
}

interface ValidationErrors {
  [key: string]: string
}

export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const validateField = useCallback((name: string, value: string): string | null => {
    const rule = rules[name]
    if (!rule) return null

    // Required validation
    if (rule.required && (!value || value.trim() === "")) {
      return "Este campo es obligatorio"
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === "") {
      return null
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `No puede tener más de ${rule.maxLength} caracteres`
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      if (name === "email") {
        return "Ingresa un email válido"
      }
      if (name === "phone") {
        return "Ingresa un teléfono válido"
      }
      return "Formato inválido"
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }, [rules])

  const validateForm = useCallback((formData: { [key: string]: string }) => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || "")
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return { isValid, errors: newErrors }
  }, [rules, validateField])

  const validateSingleField = useCallback((name: string, value: string) => {
    const error = validateField(name, value)
    
    setErrors(prev => ({
      ...prev,
      [name]: error || ""
    }))

    return error
  }, [validateField])

  const markFieldAsTouched = useCallback((name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    markFieldAsTouched,
    clearErrors,
    clearFieldError
  }
}

// Reglas de validación predefinidas
export const authValidationRules: ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (!/(?=.*[a-z])/.test(value)) {
        return "Debe contener al menos una letra minúscula"
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return "Debe contener al menos una letra mayúscula"
      }
      if (!/(?=.*\d)/.test(value)) {
        return "Debe contener al menos un número"
      }
      return null
    }
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  studentName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  phone: {
    required: false,
    pattern: /^(\+?56)?[0-9]{8,9}$/
  }
}
