"use client"

import React, { useState, forwardRef } from 'react'
import { Eye, EyeOff, Mail, Lock, User, Phone, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: string
  loading?: boolean
  icon?: 'email' | 'password' | 'user' | 'phone'
  showPasswordToggle?: boolean
  strengthMeter?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success, 
    loading, 
    icon, 
    showPasswordToggle = false,
    strengthMeter = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const getIcon = () => {
      switch (icon) {
        case 'email':
          return <Mail className="h-5 w-5 text-gray-400" />
        case 'password':
          return <Lock className="h-5 w-5 text-gray-400" />
        case 'user':
          return <User className="h-5 w-5 text-gray-400" />
        case 'phone':
          return <Phone className="h-5 w-5 text-gray-400" />
        default:
          return null
      }
    }

    const getValidationIcon = () => {
      if (loading) {
        return <div className="animate-pulse w-5 h-5 bg-blue-200 rounded-full" />
      }
      if (success) {
        return <Check className="h-5 w-5 text-green-500" />
      }
      if (error) {
        return <X className="h-5 w-5 text-red-500" />
      }
      return null
    }

    const calculatePasswordStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password)) strength += 25
      if (/[^A-Za-z0-9]/.test(password)) strength += 25
      return strength
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (strengthMeter) {
        setPasswordStrength(calculatePasswordStrength(value))
      }
      props.onChange?.(e)
    }

    const getStrengthColor = () => {
      if (passwordStrength < 25) return 'bg-red-500'
      if (passwordStrength < 50) return 'bg-orange-500'
      if (passwordStrength < 75) return 'bg-yellow-500'
      return 'bg-green-500'
    }

    const getStrengthText = () => {
      if (passwordStrength < 25) return 'Débil'
      if (passwordStrength < 50) return 'Regular'
      if (passwordStrength < 75) return 'Buena'
      return 'Fuerte'
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getIcon()}
            </div>
          )}
          <input
            type={showPasswordToggle && showPassword ? 'text' : type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm",
              "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50 smooth-transition",
              icon && "pl-10",
              (showPasswordToggle || success || error || loading) && "pr-10",
              error && "border-red-300 bg-red-50",
              success && "border-green-300 bg-green-50",
              loading && "border-blue-300 bg-blue-50",
              className
            )}
            ref={ref}
            onChange={strengthMeter && type === 'password' ? handlePasswordChange : props.onChange}
            {...props}
          />
          
          {/* Password toggle or validation icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 smooth-transition"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            ) : (
              getValidationIcon()
            )}
          </div>
        </div>

        {/* Password strength meter */}
        {strengthMeter && type === 'password' && props.value && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Fortaleza de contraseña</span>
              <span className={cn(
                "text-xs font-medium",
                passwordStrength < 25 && "text-red-600",
                passwordStrength >= 25 && passwordStrength < 50 && "text-orange-600",
                passwordStrength >= 50 && passwordStrength < 75 && "text-yellow-600",
                passwordStrength >= 75 && "text-green-600"
              )}>
                {getStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn("h-2 rounded-full smooth-transition", getStrengthColor())}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1 animate-slideUp">
            <X className="h-4 w-4" />
            {error}
          </p>
        )}

        {/* Success message */}
        {success && (
          <p className="text-sm text-green-600 flex items-center gap-1 animate-slideUp">
            <Check className="h-4 w-4" />
            {success}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"