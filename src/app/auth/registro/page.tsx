"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, User, GraduationCap, Phone } from "lucide-react"
import AuthLayout from '@/components/auth/AuthLayout'
import FormInput from '@/components/auth/FormInput'
import SubmitButton from '@/components/auth/SubmitButton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/useAuth'
import { useFormValidation, authValidationRules } from '@/hooks/useFormValidation'

// Cursos disponibles
const GRADES = [
  { value: "PRE_KINDER", label: "Pre Kinder", level: "PREESCOLAR" },
  { value: "KINDER", label: "Kinder", level: "PREESCOLAR" },
  { value: "PRIMERO_BASICO", label: "1° Básico", level: "BASICA" },
  { value: "SEGUNDO_BASICO", label: "2° Básico", level: "BASICA" },
  { value: "TERCERO_BASICO", label: "3° Básico", level: "BASICA" },
  { value: "CUARTO_BASICO", label: "4° Básico", level: "BASICA" },
  { value: "QUINTO_BASICO", label: "5° Básico", level: "BASICA" },
  { value: "SEXTO_BASICO", label: "6° Básico", level: "BASICA" },
  { value: "SEPTIMO_BASICO", label: "7° Básico", level: "BASICA" },
  { value: "OCTAVO_BASICO", label: "8° Básico", level: "BASICA" },
  { value: "PRIMERO_MEDIO", label: "1° Medio", level: "MEDIA" },
  { value: "SEGUNDO_MEDIO", label: "2° Medio", level: "MEDIA" },
  { value: "TERCERO_MEDIO", label: "3° Medio", level: "MEDIA" },
  { value: "CUARTO_MEDIO", label: "4° Medio", level: "MEDIA" }
]
export default function RegistroPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    studentName: "",
    studentGrade: "",
    phone: "",
    acceptTerms: false
  })

  const [formErrors, setFormErrors] = useState({
    studentGrade: "",
    acceptTerms: ""
  })
  const { signUp, loading } = useAuth()
  const { errors, validateForm, validateSingleField, markFieldAsTouched } = useFormValidation({
    fullName: authValidationRules.fullName,
    email: authValidationRules.email,
    password: authValidationRules.password,
    studentName: authValidationRules.studentName,
    phone: authValidationRules.phone
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear form errors when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
    
    // Validate field on change if it was previously touched
    if (typeof value === 'string' && formData[field as keyof typeof formData] !== "") {
      validateSingleField(field, value)
    }
  }

  const handleInputBlur = (field: string) => {
    markFieldAsTouched(field)
    const value = formData[field as keyof typeof formData]
    if (typeof value === 'string') {
      validateSingleField(field, value)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form fields
    const { isValid } = validateForm({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      studentName: formData.studentName,
      phone: formData.phone
    })
    
    // Additional validations
    let hasErrors = false
    const newFormErrors = { studentGrade: "", acceptTerms: "" }
    
    if (!formData.studentGrade) {
      newFormErrors.studentGrade = "Selecciona el curso del estudiante"
      hasErrors = true
    }

    if (!formData.acceptTerms) {
      newFormErrors.acceptTerms = "Debes aceptar los términos y condiciones"
      hasErrors = true
    }

    setFormErrors(newFormErrors)
    
    if (!isValid || hasErrors) return

    // Preparar datos adicionales para el registro
    const additionalData = {
      phone: formData.phone,
      studentName: formData.studentName,
      studentGrade: formData.studentGrade
    }

    await signUp(formData.email, formData.password, formData.fullName, additionalData)
  }
  return (
    <AuthLayout 
      title="Crear Cuenta"
      subtitle="Regístrate para gestionar los pedidos de tu hijo/a"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del apoderado */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Información del Apoderado
          </h3>
          
        <FormInput
            id="fullName"
            label="Nombre completo"
            type="text"
            placeholder="Juan Pérez González"
            value={formData.fullName}
            onChange={(value) => handleInputChange("fullName", value)}
            onBlur={() => handleInputBlur("fullName")}
            error={errors.fullName}
            success={!errors.fullName && formData.fullName !== ""}
            required
            icon={<User size={18} />}
        />

        <FormInput
            id="email"
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            onBlur={() => handleInputBlur("email")}
            error={errors.email}
            success={!errors.email && formData.email !== ""}
            required
            icon={<Mail size={18} />}
        />

        <FormInput
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            onBlur={() => handleInputBlur("password")}
            error={errors.password}
            required
            icon={<Lock size={18} />}
        />

        <FormInput
            id="phone"
            label="Teléfono de contacto"
            type="tel"
            placeholder="+56 9 1234 5678 (opcional)"
            value={formData.phone}
            onChange={(value) => handleInputChange("phone", value)}
            onBlur={() => handleInputBlur("phone")}
            error={errors.phone}
            success={!errors.phone && formData.phone !== ""}
            icon={<Phone size={18} />}
        />
        </div>

        {/* Información del estudiante */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Información del Estudiante
          </h3>
          
          <FormInput
            id="studentName"
            label="Nombre completo del estudiante"
            type="text"
            placeholder="María Pérez López"
            value={formData.studentName}
            onChange={(value) => handleInputChange("studentName", value)}
            onBlur={() => handleInputBlur("studentName")}
            error={errors.studentName}
            success={!errors.studentName && formData.studentName !== ""}
            required
            icon={<GraduationCap size={18} />}
          />

          <div className="space-y-2">
        <Label htmlFor="studentGrade" className="text-sm font-medium text-gray-700">
          Curso del estudiante
          <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.studentGrade} 
          onValueChange={(value) => handleInputChange("studentGrade", value)}
        >
          <SelectTrigger className={`transition-all duration-200 ${
                formErrors.studentGrade 
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
                  : formData.studentGrade 
                    ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
              }`}>
                <SelectValue placeholder="Selecciona el curso" />
              </SelectTrigger>
              <SelectContent>
                {GRADES.map((grade) => (
                  <SelectItem key={grade.value} value={grade.value}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.studentGrade && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <GraduationCap size={14} />
                {formErrors.studentGrade}
          </p>
            )}
          </div>
        </div>

        {/* Términos y condiciones */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => 
                handleInputChange("acceptTerms", checked === true)
}
              className={`mt-1 ${
                formErrors.acceptTerms ? "border-red-500" : ""
              }`}
            />
            <div className="space-y-1">
              <Label 
                htmlFor="acceptTerms" 
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                Acepto los{" "}
                <Link 
                  href="/terminos" 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                >
                  términos y condiciones
                </Link>{" "}
                del servicio de casino escolar
              </Label>
              {formErrors.acceptTerms && (
                <p className="text-sm text-red-600">
                  {formErrors.acceptTerms}
                </p>
              )}
            </div>
          </div>
        </div>

        <SubmitButton loading={loading}>
          Registrarme
        </SubmitButton>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}