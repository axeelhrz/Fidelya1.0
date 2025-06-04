"use client"
import { useState } from "react"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import AuthLayout from "@/components/auth/AuthLayout"
import FormInput from "@/components/auth/FormInput"
import SubmitButton from "@/components/auth/SubmitButton"
import { useAuth } from "@/hooks/useAuth"
import { useFormValidation, authValidationRules } from "@/hooks/useFormValidation"
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const { signIn, loading } = useAuth()
  const { errors, validateForm, validateSingleField, markFieldAsTouched } = useFormValidation({
    email: authValidationRules.email,
    password: { required: true, minLength: 1 } // Simplified for login
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate field on change if it was previously touched
    if (formData[field as keyof typeof formData] !== "") {
      validateSingleField(field, value)
    }
  }

  const handleInputBlur = (field: string) => {
    markFieldAsTouched(field)
    validateSingleField(field, formData[field as keyof typeof formData])
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { isValid } = validateForm(formData)
    if (!isValid) return

    await signIn(formData.email, formData.password)
    }

  return (
    <AuthLayout 
      title="Iniciar Sesión"
      subtitle="Accede a tu cuenta para gestionar los pedidos"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(value) => handleInputChange("email", value)}
          error={errors.email}
          success={!errors.email && formData.email !== ""}
          required
          icon={<Mail size={18} />}
        />

        <FormInput
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={formData.password}
          onChange={(value) => handleInputChange("password", value)}
          error={errors.password}
          required
          icon={<Lock size={18} />}
        />
        <div className="flex items-center justify-between">
          <Link 
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <SubmitButton loading={loading}>
          Ingresar
        </SubmitButton>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link 
              href="/auth/registro"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}