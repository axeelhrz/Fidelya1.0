"use client"

import { useState, useCallback } from 'react'

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

interface ValidationState {
  [key: string]: {
    error: string | null
    success: string | null
    isValid: boolean
  }
}

export function useFormValidation(rules: ValidationRules) {
  const [validationState, setValidationState] = useState<ValidationState>({})
  const [isFormValid, setIsFormValid] = useState(false)


const validateField = useCallback((name: string, value: string): boolean => {
    const rule = rules[name]
    if (!rule) return true

    let error: string | null = null
    let success: string | null = null

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      error = 'Este campo es obligatorio'
    }
    // Min length validation
    else if (rule.minLength && value.length < rule.minLength) {
      error = `Debe tener al menos ${rule.minLength} caracteres`
    }
    // Max length validation
    else if (rule.maxLength && value.length > rule.maxLength) {
      error = `No puede exceder ${rule.maxLength} caracteres`
    }
    // Pattern validation
    else if (rule.pattern && !rule.pattern.test(value)) {
      error = getPatternErrorMessage(name, rule.pattern)
    }
    // Custom validation
    else if (rule.custom) {
      error = rule.custom(value)
    }
    // Success state
    else if (value && value.trim() !== '') {
      success = getSuccessMessage(name)
    }

    const isValid = !error
    
    setValidationState(prev => ({
      ...prev,
      [name]: { error, success, isValid }
    }))

    return isValid
  }, [rules])

  const validateForm = useCallback((formData: { [key: string]: string }): boolean => {
    let allValid = true
    
    Object.keys(rules).forEach(fieldName => {
      const isFieldValid = validateField(fieldName, formData[fieldName] || '')
      if (!isFieldValid) allValid = false
    })

    setIsFormValid(allValid)
    return allValid
  }, [rules, validateField])

  const clearValidation = useCallback((fieldName?: string) => {
    if (fieldName) {
      setValidationState(prev => ({
        ...prev,
        [fieldName]: { error: null, success: null, isValid: false }
      }))
    } else {
      setValidationState({})
      setIsFormValid(false)
    }
  }, [])

  const getFieldValidation = useCallback((fieldName: string) => {
    return validationState[fieldName] || { error: null, success: null, isValid: false }
  }, [validationState])

  return {
    validateField,
    validateForm,
    clearValidation,
    getFieldValidation,
    isFormValid,
    validationState
  }
}

function getPatternErrorMessage(fieldName: string, pattern: RegExp): string {
  switch (fieldName) {
    case 'email':
      return 'Ingresa un email válido'
    case 'phone':
      return 'Ingresa un número de teléfono válido (ej: +56912345678)'
    case 'password':
      return 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial'
    default:
      return 'El formato no es válido'
  }
}

function getSuccessMessage(fieldName: string): string {
  switch (fieldName) {
    case 'email':
      return 'Email válido'
    case 'phone':
      return 'Teléfono válido'
    case 'password':
      return 'Contraseña segura'
    case 'fullName':
      return 'Nombre válido'
    default:
      return 'Campo válido'
  }
}

// Validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+56)?[0-9]{8,9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
}

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    pattern: validationPatterns.email,
    maxLength: 255
  },
  password: {
    required: true,
    minLength: 8,
    pattern: validationPatterns.password
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: validationPatterns.name
  },
  phone: {
    required: true,
    pattern: validationPatterns.phone
  },
  confirmPassword: {
    required: true,
    custom: (value: string, formData?: { password: string }) => {
      if (formData && value !== formData.password) {
        return 'Las contraseñas no coinciden'
      }
      return null
    }
  }
}