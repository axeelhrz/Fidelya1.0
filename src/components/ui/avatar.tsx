"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
      },
      border: {
        none: "",
        default: "border-2 border-background",
        colored: "border-2 border-primary",
      },
      status: {
        none: "",
        online: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-green-500 after:ring-2 after:ring-background",
        offline: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-gray-400 after:ring-2 after:ring-background",
        busy: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-red-500 after:ring-2 after:ring-background",
        away: "after:absolute after:bottom-0 after:right-0 after:h-2 after:w-2 after:rounded-full after:bg-yellow-500 after:ring-2 after:ring-background",
      },
    },
    defaultVariants: {
      size: "default",
      border: "none",
      status: "none",
    },
  }
)

const avatarImageVariants = cva(
  "aspect-square h-full w-full",
  {
    variants: {
      fit: {
        cover: "object-cover",
        contain: "object-contain",
        fill: "object-fill",
      },
    },
    defaultVariants: {
      fit: "cover",
    },
  }
)

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-muted",
  {
    variants: {
      color: {
        default: "bg-muted",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        gray: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        error: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
        warning: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
        success: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  fit?: VariantProps<typeof avatarImageVariants>["fit"]
  fallbackColor?: VariantProps<typeof avatarFallbackVariants>["color"]
  showFallback?: boolean
  delayMs?: number
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({
  className,
  size,
  border,
  status,
  src,
  alt,
  fallback,
  fit,
  fallbackColor,
  showFallback = true,
  delayMs,
  onLoadingStatusChange,
  ...props
}, ref) => {
  const [imageLoadingStatus, setImageLoadingStatus] = React.useState<"loading" | "loaded" | "error">("loading")

  React.useEffect(() => {
    if (onLoadingStatusChange) {
      onLoadingStatusChange(imageLoadingStatus)
    }
  }, [imageLoadingStatus, onLoadingStatusChange])

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ size, border, status }), className)}
      {...props}
    >
      <AvatarImage
        src={src}
        alt={alt}
        fit={fit}
        onLoadingStatusChange={(status) => {
          if (status !== 'idle') {
            setImageLoadingStatus(status);
          }
        }}
        {...(delayMs && { delayMs })}
      />
      {showFallback && (
        <AvatarFallback color={fallbackColor}>
          {fallback || <User className="h-1/2 w-1/2" />}
        </AvatarFallback>
      )}
    </AvatarPrimitive.Root>
  )
})
Avatar.displayName = "Avatar"

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
    VariantProps<typeof avatarImageVariants> {}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, fit, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(avatarImageVariants({ fit }), className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

export interface AvatarFallbackProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>, 'color'>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, color, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(avatarFallbackVariants({ color }), className)}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }