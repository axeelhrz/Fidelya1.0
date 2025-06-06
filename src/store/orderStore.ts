import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OrderSelection, OrderSummary, UserType, PRICES } from '@/types/panel'

interface OrderState {
  selections: OrderSelection[]
  userType: UserType
  isLoading: boolean
  
  // Actions
  setUserType: (type: UserType) => void
  addSelection: (selection: OrderSelection) => void
  removeSelection: (date: string) => void
  updateSelection: (date: string, field: 'almuerzo' | 'colacion', item: any) => void
  clearSelections: () => void
  getOrderSummary: () => OrderSummary
  setLoading: (loading: boolean) => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      selections: [],
      userType: 'estudiante',
      isLoading: false,

      setUserType: (type: UserType) => set({ userType: type }),

      addSelection: (selection: OrderSelection) => {
        const { selections } = get()
        const existingIndex = selections.findIndex(s => s.date === selection.date)
        
        if (existingIndex >= 0) {
          const updated = [...selections]
          updated[existingIndex] = { ...updated[existingIndex], ...selection }
          set({ selections: updated })
        } else {
          set({ selections: [...selections, selection] })
        }
      },

      removeSelection: (date: string) => {
        const { selections } = get()
        set({ selections: selections.filter(s => s.date !== date) })
      },

      updateSelection: (date: string, field: 'almuerzo' | 'colacion', item: any) => {
        const { selections } = get()
        const existingIndex = selections.findIndex(s => s.date === date)
        
        if (existingIndex >= 0) {
          const updated = [...selections]
          updated[existingIndex] = { ...updated[existingIndex], [field]: item }
          set({ selections: updated })
        } else {
          set({ selections: [...selections, { date, [field]: item }] })
        }
      },

      clearSelections: () => set({ selections: [] }),

      getOrderSummary: (): OrderSummary => {
        const { selections, userType } = get()
        const prices = PRICES[userType]
        
        let totalAlmuerzos = 0
        let totalColaciones = 0
        
        selections.forEach(selection => {
          if (selection.almuerzo) totalAlmuerzos++
          if (selection.colacion) totalColaciones++
        })
        
        const subtotalAlmuerzos = totalAlmuerzos * prices.almuerzo
        const subtotalColaciones = totalColaciones * prices.colacion
        const total = subtotalAlmuerzos + subtotalColaciones
        
        return {
          selections,
          totalAlmuerzos,
          totalColaciones,
          subtotalAlmuerzos,
          subtotalColaciones,
          total
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'casino-escolar-order',
      partialize: (state) => ({ 
        selections: state.selections, 
        userType: state.userType 
      })
    }
  )
)
