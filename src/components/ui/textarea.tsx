"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const textareaVariants = cva(
  "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "resize-none",
        resizable: "resize-y",
        both: "resize",
      },
      error: {
        default: "",
        true: "border-red-500 focus-visible:ring-red-500",
      },
      size: {
        default: "min-h-[60px]",
        sm: "min-h-[40px] text-xs",
        lg: "min-h-[80px] text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      error: "default",
      size: "default",
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'error'>,
    Omit<VariantProps<typeof textareaVariants>, 'error'> {
  error?: boolean | string
  helperText?: string
  label?: string
  maxLength?: number
  showCount?: boolean
  autoGrow?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  helperClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    variant,
    error,
    size,
    helperText,
    label,
    maxLength,
    showCount = false,
    autoGrow = false,
    containerClassName,
    labelClassName,
    errorClassName,
    helperClassName,
    onChange,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = React.useState(0)
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    // Combinar refs
    React.useImperativeHandle(ref, () => textareaRef.current!)

    // Manejar el autoGrow
    const handleAutoGrow = React.useCallback((element: HTMLTextAreaElement) => {
      if (autoGrow) {
        element.style.height = 'auto'
        element.style.height = `${element.scrollHeight}px`
      }
    }, [autoGrow])

    // Manejar cambios
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setCharCount(value.length)
      
      if (autoGrow) {
        handleAutoGrow(e.target)
      }

      if (onChange) {
        onChange(e)
      }
    }

    // Efecto inicial para autoGrow
    React.useEffect(() => {
      if (autoGrow && textareaRef.current) {
        handleAutoGrow(textareaRef.current)
      }
    }, [autoGrow, handleAutoGrow])

    // Calcular si debe mostrar error
    const showError = error && (typeof error === 'boolean' ? true : error.length > 0)

    return (
      <div className={cn("space-y-1", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            onChange={handleChange}
            maxLength={maxLength}
            className={cn(
              textareaVariants({ variant, error: !!error, size }),
              className
            )}
            {...props}
          />
          
          {(showCount || maxLength) && (
            <div className="absolute bottom-1.5 right-2 text-xs text-gray-400">
              {charCount}
              {maxLength && `/${maxLength}`}
            </div>
          )}
        </div>

        {helperText && (
          <p
            className={cn(
              "text-sm text-muted-foreground",
              helperClassName
            )}
          >
            {helperText}
          </p>
        )}

        {showError && (
          <p
            className={cn(
              "text-sm font-medium text-red-500",
              errorClassName
            )}
          >
            {typeof error === 'string' ? error : 'Este campo es requerido'}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }