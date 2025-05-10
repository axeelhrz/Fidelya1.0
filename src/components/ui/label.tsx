"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        required: "after:content-['*'] after:text-red-500 after:ml-0.5",
        optional: "after:content-['(opcional)'] after:text-gray-400 after:ml-1 after:text-xs",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
      weight: {
        default: "font-medium",
        normal: "font-normal",
        bold: "font-bold",
      },
      error: {
        default: "",
        true: "text-red-500",
      },
      disabled: {
        default: "",
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "default",
      error: "default",
      disabled: "default",
    },
  }
)

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  optional?: boolean
  error?: boolean
  tooltip?: string
  helperText?: string
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  variant, 
  size, 
  weight,
  error,
  disabled,
  optional,
  tooltip,
  helperText,
  children,
  ...props 
}, ref) => {
  // Si optional está definido, sobreescribimos la variante
  const actualVariant = optional ? "optional" : variant

  return (
    <div className="space-y-1">
      <div className="relative inline-flex items-center group">
        <LabelPrimitive.Root
          ref={ref}
          className={cn(
            labelVariants({ 
              variant: actualVariant, 
              size, 
              weight,
              error,
              disabled,
              className 
            })
          )}
          {...props}
        >
          {children}
        </LabelPrimitive.Root>

        {tooltip && (
          <div className="relative">
            <div className="ml-1.5 text-gray-400 cursor-help">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})
Label.displayName = "Label"

export { Label }