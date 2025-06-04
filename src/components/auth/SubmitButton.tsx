"use client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubmitButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export default function SubmitButton({
  children,
  loading = false,
  disabled = false,
  variant = "default",
  size = "default",
  className,
  onClick,
  type = "submit"
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "w-full transition-all duration-200 font-medium",
        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        loading && "cursor-not-allowed",
        className
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}