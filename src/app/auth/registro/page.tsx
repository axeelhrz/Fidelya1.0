"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormInput } from '@/components/auth/FormInput'
import { SubmitButton } from '@/components/auth/SubmitButton'
import { useAuth } from '@/hooks/useAuth'
import { useFormValidation, commonValidationRules } from '@/hooks/useFormValidation'
import { Checkbox } from '@/components/ui/checkbox'
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  const { register, loading, error } = useAuth()

  const validationRules = {
    fullName: commonValidationRules.fullName,
    email: commonValidationRules.email,
    phone: commonValidationRules.phone,
    password: commonValidationRules.password,
    confirmPassword: {
      required: true,
      custom: (value: string) => {
        if (value !== formData.password) {
          return 'Las contraseñas no coinciden'
        }
        return null
      }
    }
  }

  const { validateField, validateForm, getFieldValidation, isFormValid } = useFormValidation(validationRules)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({ ...prev, [name]: newValue }))

    // Validate field on change (except checkbox)
    if (type !== 'checkbox') {
      validateField(name, value)
      
      // Re-validate confirm password when password changes
      if (name === 'password' && formData.confirmPassword) {
        validateField('confirmPassword', formData.confirmPassword)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { acceptTerms, ...validationData } = formData
    if (!validateForm(validationData)) {
      return
    }

    if (!formData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones')
      return
    }

    const success = await register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone
    })

    if (success) {
      // Reset form on successful registration
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      })
    }
  }

  const fullNameValidation = getFieldValidation('fullName')
  const emailValidation = getFieldValidation('email')
  const phoneValidation = getFieldValidation('phone')
  const passwordValidation = getFieldValidation('password')
  const confirmPasswordValidation = getFieldValidation('confirmPassword')

  const isFormCompleteAndValid = isFormValid && formData.acceptTerms
  return (
    <AuthLayout 
      title="Crear Cuenta"
      subtitle="Casino Escolar"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          name="fullName"
          type="text"
          label="Nombre Completo"
          placeholder="Ingresa tu nombre completo"
          value={formData.fullName}
          onChange={handleInputChange}
          icon="user"
          error={fullNameValidation.error || undefined}
          success={fullNameValidation.success || undefined}
          autoComplete="name"
          required
        />

        <FormInput
          name="email"
          type="email"
          label="Correo Electrónico"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleInputChange}
          icon="email"
          error={emailValidation.error || undefined}
          success={emailValidation.success || undefined}
          autoComplete="email"
          required
        />

        <FormInput
          name="phone"
          type="tel"
          label="Teléfono"
          placeholder="+56912345678"
          value={formData.phone}
          onChange={handleInputChange}
          icon="phone"
          error={phoneValidation.error || undefined}
          success={phoneValidation.success || undefined}
          autoComplete="tel"
          required
        />

        <FormInput
          name="password"
          type="password"
          label="Contraseña"
          placeholder="Crea una contraseña segura"
          value={formData.password}
          onChange={handleInputChange}
          icon="password"
          showPasswordToggle
          strengthMeter
          error={passwordValidation.error || undefined}
          success={passwordValidation.success || undefined}
          autoComplete="new-password"
          required
        />

        <FormInput
          name="confirmPassword"
          type="password"
          label="Confirmar Contraseña"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          icon="password"
          showPasswordToggle
          error={confirmPasswordValidation.error || undefined}
          success={confirmPasswordValidation.success || undefined}
          autoComplete="new-password"
          required
        />

        <div className="flex items-start space-x-2">
          <Checkbox
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
            }
            className="mt-1"
          />
          <label 
            htmlFor="acceptTerms" 
            className="text-sm text-gray-700 cursor-pointer leading-relaxed"
          >
            Acepto los{' '}
            <Link 
              href="/terms" 
              className="font-medium text-blue-600 hover:text-blue-500 smooth-transition"
              target="_blank"
            >
              términos y condiciones
            </Link>
            {' '}y la{' '}
            <Link 
              href="/privacy" 
              className="font-medium text-blue-600 hover:text-blue-500 smooth-transition"
              target="_blank"
            >
              política de privacidad
            </Link>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-slideUp">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <SubmitButton
          type="submit"
          loading={loading}
          loadingText="Creando cuenta..."
          disabled={!isFormCompleteAndValid}
          className="w-full"
        >
          Crear Cuenta
        </SubmitButton>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 smooth-transition"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
