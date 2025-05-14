"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md bg-white dark:bg-gray-900",
        ghost: "border-none shadow-none hover:bg-accent/50",
        outline: "shadow-none border-2",
        premium: "bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-500/20 backdrop-blur-sm",
        destructive: "border-red-500/20 hover:border-red-500/40 bg-red-50 dark:bg-red-950/50",
        success: "border-green-500/20 hover:border-green-500/40 bg-green-50 dark:bg-green-950/50",
        warning: "border-yellow-500/20 hover:border-yellow-500/40 bg-yellow-50 dark:bg-yellow-950/50",
        info: "border-blue-500/20 hover:border-blue-500/40 bg-blue-50 dark:bg-blue-950/50",
        glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-white/20",
        gradient: "bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20 animate-gradient-x background-size-200",
      },
      size: {
        default: "p-0",
        sm: "p-0 gap-1",
        lg: "p-0 gap-3",
        xl: "p-0 gap-4",
      },
      hover: {
        default: "",
        raise: "hover:-translate-y-1 hover:shadow-xl",
        glow: "hover:shadow-lg hover:shadow-primary/20",
        scale: "hover:scale-[1.02] hover:shadow-xl",
        shine: "hover:before:absolute hover:before:inset-0 hover:before:bg-gradient-to-r hover:before:from-transparent hover:before:via-white/20 hover:before:to-transparent hover:before:animate-shine",
        none: "",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        gradient: "animate-gradient-x",
        shimmer: "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-shimmer",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "default",
      animation: "none",
    },
  }
)

const cardHeaderVariants = cva("flex flex-col space-y-1.5", {
  variants: {
    size: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
      xl: "p-10",
    },
    variant: {
      default: "",
      gradient: "bg-gradient-to-b from-primary/5 to-transparent",
      bordered: "border-b",
    }
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
})

const cardContentVariants = cva("", {
  variants: {
    size: {
      default: "p-6 pt-0",
      sm: "p-4 pt-0",
      lg: "p-8 pt-0",
      xl: "p-10 pt-0",
    },
    padding: {
      default: "",
      all: "pt-6 lg:pt-8",
      none: "p-0",
    }
  },
  defaultVariants: {
    size: "default",
    padding: "default",
  },
})

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean
  onClick?: () => void
  as?: React.ElementType
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant,
    size,
    hover,
    animation,
    loading,
    onClick,
    as: Component = "div",
    children,
    ...props
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          cardVariants({ variant, size, hover, animation }),
          "relative overflow-hidden",
          onClick && "cursor-pointer",
          loading && "animate-pulse",
          className
        )}
        onClick={onClick}
        {...props}
      >
        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-4 bg-muted rounded-full w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded-full"></div>
              <div className="h-3 bg-muted rounded-full w-5/6"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </Component>
    )
  }
)
Card.displayName = "Card"

interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  loading?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, variant, loading, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardHeaderVariants({ size, variant }), className)}
        {...props}
      >
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-full w-1/2"></div>
            <div className="h-3 bg-muted rounded-full w-4/5"></div>
          </div>
        ) : (
          children
        )}
      </div>
    )
  }
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { 
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    gradient?: boolean
  }
>(({ className, as: Component = "h3", gradient, children, ...props }, ref) => (
  <Component
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      gradient && "bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent",
      className
    )}
    {...props}
  >
    {children}
  </Component>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {
  loading?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, padding, loading, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardContentVariants({ size, padding }), className)}
        {...props}
      >
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full"></div>
            <div className="h-3 bg-muted rounded-full w-5/6"></div>
            <div className="h-3 bg-muted rounded-full w-4/6"></div>
          </div>
        ) : (
          children
        )}
      </div>
    )
  }
)
CardContent.displayName = "CardContent"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
}
