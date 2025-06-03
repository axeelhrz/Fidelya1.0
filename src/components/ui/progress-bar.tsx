"use client"

interface ProgressBarProps {
  paso: number
  totalPasos: number
  tipoUsuario: "apoderado" | "funcionario" | null
}

export function ProgressBar({ paso, totalPasos, tipoUsuario }: ProgressBarProps) {
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
