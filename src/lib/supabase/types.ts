// Database type definitions for the casino pedidos system
export type Database = {
  public: {
    Tables: {
      guardians: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string
          is_staff: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone: string
          is_staff?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string
          is_staff?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          guardian_id: string
          name: string
          grade: string
          section: string
          level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id: string
          name: string
          grade: string
          section: string
          level: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string
          name?: string
          grade?: string
          section?: string
          level?: string
          created_at?: string
          updated_at?: string
        }
      }
      almuerzos: {
        Row: {
          id: string
          fecha: string
          opcion_1: string
          opcion_2: string
          opcion_3?: string
          precio: number
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fecha: string
          opcion_1: string
          opcion_2: string
          opcion_3?: string
          precio: number
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fecha?: string
          opcion_1?: string
          opcion_2?: string
          opcion_3?: string
          precio?: number
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      colaciones: {
        Row: {
          id: string
          fecha: string
          opcion_1: string
          opcion_2: string
          precio: number
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fecha: string
          opcion_1: string
          opcion_2: string
          precio: number
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fecha?: string
          opcion_1?: string
          opcion_2?: string
          precio?: number
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pedidos: {
        Row: {
          id: string
          guardian_id: string
          student_id: string
          fecha_entrega: string
          tipo_pedido: 'ALMUERZO' | 'COLACION'
          opcion_elegida: string
          precio: number
          estado_pago: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
          transaction_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id: string
          student_id: string
          fecha_entrega: string
          tipo_pedido: 'ALMUERZO' | 'COLACION'
          opcion_elegida: string
          precio: number
          estado_pago?: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
          transaction_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string
          student_id?: string
          fecha_entrega?: string
          tipo_pedido?: 'ALMUERZO' | 'COLACION'
          opcion_elegida?: string
          precio?: number
          estado_pago?: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
          transaction_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Student = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']
export type Guardian = Database['public']['Tables']['guardians']['Row']
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert']
export type GuardianUpdate = Database['public']['Tables']['guardians']['Update']

// Product types (representing menu items)
export type Product = Database['public']['Tables']['almuerzos']['Row'] | Database['public']['Tables']['colaciones']['Row']
export type AlmuerzoMenu = Database['public']['Tables']['almuerzos']['Row']
export type ColacionMenu = Database['public']['Tables']['colaciones']['Row']

// Order types
export type Order = Database['public']['Tables']['pedidos']['Row']
export type OrderInsert = Database['public']['Tables']['pedidos']['Insert']
export type OrderUpdate = Database['public']['Tables']['pedidos']['Update']

// For compatibility with your import
export type OrderItemInsert = OrderInsert

// Additional utility types
export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
export type OrderType = 'ALMUERZO' | 'COLACION'

export type Grade = 
  | 'PRE_KINDER'
  | 'KINDER'
  | 'PRIMERO_BASICO'
  | 'SEGUNDO_BASICO'
  | 'TERCERO_BASICO'
  | 'CUARTO_BASICO'
  | 'QUINTO_BASICO'
  | 'SEXTO_BASICO'
  | 'SEPTIMO_BASICO'
  | 'OCTAVO_BASICO'
  | 'PRIMERO_MEDIO'
  | 'SEGUNDO_MEDIO'
  | 'TERCERO_MEDIO'
  | 'CUARTO_MEDIO'
export type Level = 'PREESCOLAR' | 'BASICA' | 'MEDIA'
