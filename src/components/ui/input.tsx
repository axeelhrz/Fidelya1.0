import * as React from "react"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
  label?: string
  helperText?: string
  showPasswordToggle?: boolean
  containerClassName?: string
  labelClassName?: string
  errorClassName?: string
  helperClassName?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onLeftIconClick?: () => void
  onRightIconClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    type,
    error,
    label,
    helperText,
    showPasswordToggle = false,
    containerClassName,
    labelClassName,
    errorClassName,
    helperClassName,
    leftIcon,
    rightIcon,
    onLeftIconClick,
    onRightIconClick,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = showPasswordToggle 
      ? (showPassword ? 'text' : 'password')
      : type

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
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",
                onLeftIconClick && "cursor-pointer hover:text-gray-700"
              )}
              onClick={onLeftIconClick}
            >
              {leftIcon}
            </div>
          )}

          <input
            type={inputType}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle) && "pr-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {showPasswordToggle && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </div>
          )}

          {rightIcon && !showPasswordToggle && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                onRightIconClick && "cursor-pointer hover:text-gray-700"
              )}
              onClick={onRightIconClick}
            >
              {rightIcon}
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

        {error && (
          <p
            className={cn(
              "text-sm font-medium text-red-500",
              errorClassName
            )}
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }