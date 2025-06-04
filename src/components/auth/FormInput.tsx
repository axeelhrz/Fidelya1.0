"use client"
import { forwardRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormInputProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  success?: boolean
  required?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    id, 
    label, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error, 
    success, 
    required, 
    icon, 
    disabled,
    className 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    const getInputState = () => {
      if (error) return "error"
      if (success && value) return "success"
      return "default"
    }

    const inputState = getInputState()

    return (
      <div className={cn("space-y-2", className)}>
        <Label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
          
        <div className="relative">
          {/* Ícono izquierdo */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
          </div>
          )}

          <Input
            ref={ref}
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={cn(
              "transition-all duration-200",
              icon && "pl-10",
              isPassword && "pr-10",
              inputState === "error" && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              inputState === "success" && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
              inputState === "default" && "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
        )}
          />

          {/* Botón mostrar/ocultar contraseña */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        )}

          {/* Ícono de estado */}
          {!isPassword && (
            <>
              {inputState === "error" && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
        )}
              {inputState === "success" && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={18} />
              )}
            </>
          )}
      </div>
        
        {/* Mensaje de error */}
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = "FormInput"

export default FormInput