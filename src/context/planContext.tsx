'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// Tipos
interface Plan {
  id: 'basic' | 'pro' | 'enterprise'
  name: string
  description: string
  priceMonthly: number
  priceAnnual: number
  originalPriceMonthly?: number
  originalPriceAnnual?: number
  features: Array<{
    title: string
    icon: ReactNode
    tooltip?: string
    description?: string
    isNew?: boolean
    isPro?: boolean
  }>
  highlighted?: boolean
  buttonText: string
  icon: ReactNode
  trialDays?: number
  paypalPlanId?: string
  color?: string
  badge?: string
  discount?: string
  maxUsers?: number | string
  storage?: string
  support?: string
  additionalPerks?: string[]
  roi?: string
  guaranteedSavings?: string
}

interface PlanContextType {
  selectedPlan: Plan | null
  selectPlan: (plan: Plan) => void
  startTrial: (plan: Plan) => void
  scheduleDemoPlan: (plan: Plan) => void
  calculateROI: (clients: number, hoursPerClient: number, hourlyRate: number) => {
    timeSaved: number
    moneySaved: number
    efficiency: number
  }
}

// Crear el contexto
const PlanContext = createContext<PlanContextType | undefined>(undefined)

// Provider del contexto
export function PlanProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const router = useRouter()

  // Seleccionar un plan
  const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    // Tracking del evento
    window.gtag?.('event', 'select_plan', {
      event_category: 'Engagement',
      event_label: plan.id,
      value: plan.priceMonthly,
      plan_name: plan.name,
      plan_type: plan.id
    })
  }

  // Iniciar prueba gratuita
  const startTrial = (plan: Plan) => {
    selectPlan(plan)
    // Tracking del evento
    window.gtag?.('event', 'start_trial', {
      event_category: 'Conversion',
      event_label: plan.id,
      value: plan.priceMonthly,
      plan_name: plan.name,
      plan_type: plan.id
    })
    // Guardar el plan seleccionado en localStorage
    localStorage.setItem('selectedPlan', JSON.stringify(plan))
    // Redirigir a registro
    router.push('/auth/sign-up')
  }

  // Agendar demo (para plan Enterprise)
  const scheduleDemoPlan = (plan: Plan) => {
    selectPlan(plan)
    // Tracking del evento
    window.gtag?.('event', 'schedule_demo', {
      event_category: 'Conversion',
      event_label: plan.id,
      value: plan.priceMonthly,
      plan_name: plan.name,
      plan_type: plan.id
    })
    // Guardar el plan seleccionado en localStorage
    localStorage.setItem('selectedPlan', JSON.stringify(plan))
    // Redirigir a página de contacto con parámetro de demo
    router.push('/contact?type=demo')
  }

  // Calcular ROI
  const calculateROI = (clients: number, hoursPerClient: number, hourlyRate: number) => {
    const timeSaved = clients * hoursPerClient * 0.4 // 40% ahorro de tiempo
    const moneySaved = timeSaved * hourlyRate
    const efficiency = 40 // 40% mejora en eficiencia

    // Tracking del cálculo
    window.gtag?.('event', 'calculate_roi', {
      event_category: 'Engagement',
      event_label: 'ROI Calculator',
      value: moneySaved,
      clients: clients,
      hours_per_client: hoursPerClient,
      hourly_rate: hourlyRate,
      time_saved: timeSaved,
      money_saved: moneySaved,
      efficiency_improvement: efficiency
    })

    return {
      timeSaved,
      moneySaved,
      efficiency
    }
  }

  // Recuperar plan seleccionado al cargar la página
  useEffect(() => {
    const storedPlan = localStorage.getItem('selectedPlan')
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan))
    }
  }, [])

  return (
    <PlanContext.Provider 
      value={{ 
        selectedPlan, 
        selectPlan, 
        startTrial, 
        scheduleDemoPlan,
        calculateROI 
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function usePlan() {
  const context = useContext(PlanContext)
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider')
  }
  return context
}

// Tipos para exportar
export type { Plan }