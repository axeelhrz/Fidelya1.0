"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, showValue = false, size = "md", variant = "default", animated = true, ...props }, ref) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const variantClasses = {
    default: "bg-green-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
        {animated && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
            style={{ width: "30%" }}
          />
        )}
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-1">
          <span>{value}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
});

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

interface ProgressBarProps {
  paso: number
  totalPasos: number
  tipoUsuario: "apoderado" | "funcionario" | null
}

export function ProgressBar({ paso, totalPasos }: ProgressBarProps) {
  const porcentaje = (paso / totalPasos) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-primary">
          Paso {paso} de {totalPasos}
        </span>
        <span className="text-sm font-medium text-primary">{Math.round(porcentaje)}%</span>
      </div>
      <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}