"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
    showCloseButton?: boolean
  }
>(({ className, children, size = "lg", showCloseButton = true, ...props }, ref) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]"
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200/80 bg-white/95 backdrop-blur-xl p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-2xl",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-white transition-all hover:opacity-100 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
    icon?: React.ReactNode
    gradient?: boolean
  }
>(({ className, children, icon, gradient = false, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight flex items-center gap-3",
      gradient && "bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent",
      className
    )}
    {...props}
  >
    {icon && (
      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
        {icon}
      </div>
    )}
    {children}
  </DialogPrimitive.Title>
))
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Componentes adicionales para mejorar la experiencia

const DialogSection = ({
  className,
  title,
  description,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
}) => (
  <div
    className={cn("space-y-4", className)}
    {...props}
  >
    {(title || description) && (
      <div className="space-y-1">
        {title && (
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
    )}
    {children}
  </div>
)

const DialogSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent", className)}
    {...props}
  />
)

// Dialog con animaciones mejoradas usando Framer Motion
const AnimatedDialog = ({ 
  children, 
  isOpen, 
  onClose,
  size = "lg",
  className,
  ...props 
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
  className?: string
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-[95vw] max-h-[95vh]"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-6 border border-gray-200/80 bg-white/95 backdrop-blur-xl p-8 shadow-2xl rounded-2xl",
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {children}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-white transition-all hover:opacity-100 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Progress Dialog para formularios multi-paso
const ProgressDialog = ({
  children,
  isOpen,
  onClose,
  currentStep,
  totalSteps,
  stepLabels,
  size = "2xl",
  className,
  ...props
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  currentStep: number
  totalSteps: number
  stepLabels?: string[]
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
  className?: string
}) => {
  const progress = (currentStep / totalSteps) * 100

  return (
    <AnimatedDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      size={size}
      className={className}
      {...props}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-2xl overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 pt-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300",
                step < currentStep
                  ? "bg-green-500 text-white border-green-500"
                  : step === currentStep
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-400 border-gray-200"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  ✓
                </motion.div>
              ) : (
                step
              )}
            </motion.div>
            {step < totalSteps && (
              <div className={cn(
                "w-12 h-0.5 mx-2 transition-all duration-300",
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      {stepLabels && (
        <div className="flex justify-center">
          <div className={cn("grid gap-8 text-center", `grid-cols-${totalSteps}`)}>
            {stepLabels.map((label, index) => (
              <div
                key={index}
                className={cn(
                  "text-xs font-medium transition-colors",
                  currentStep >= index + 1 ? "text-blue-600" : "text-gray-400"
                )}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {children}
    </AnimatedDialog>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogSection,
  DialogSeparator,
  AnimatedDialog,
  ProgressDialog,
};