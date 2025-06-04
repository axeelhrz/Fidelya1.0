// Database type definitions for the casino pedidos system
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guardians: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone: string | null
          is_staff: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone?: string | null
          is_staff?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone?: string | null
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
          dietary_restrictions: string | null
          allergies: string | null
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
          dietary_restrictions?: string | null
          allergies?: string | null
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
          dietary_restrictions?: string | null
          allergies?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      almuerzos: {
        Row: {
          id: string
          codigo: string
          descripcion: string
          dia: string
          fecha: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          descripcion: string
          dia: string
          fecha: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia?: string
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          descripcion?: string
          dia?: string
          fecha?: string
          precio_estudiante?: number
          precio_funcionario?: number
          tipo_dia?: string
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      colaciones: {
        Row: {
          id: string
          codigo: string
          descripcion: string
          dia: string
          fecha: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          descripcion: string
          dia: string
          fecha: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia?: string
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          descripcion?: string
          dia?: string
          fecha?: string
          precio_estudiante?: number
          precio_funcionario?: number
          tipo_dia?: string
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
          almuerzo_id: string | null
          colacion_id: string | null
          fecha_entrega: string
          dia_entrega: string
          total_amount: number
          estado_pago: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id: string
          student_id: string
          almuerzo_id?: string | null
          colacion_id?: string | null
          fecha_entrega: string
          dia_entrega: string
          total_amount: number
          estado_pago?: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string
          student_id?: string
          almuerzo_id?: string | null
          colacion_id?: string | null
          fecha_entrega?: string
          dia_entrega?: string
          total_amount?: number
          estado_pago?: 'PENDIENTE' | 'PAGADO' | 'CANCELADO'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          transaction_id: string
          amount: number
          status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
          payment_method: string | null
          gateway_response: Json | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          transaction_id: string
          amount: number
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
          payment_method?: string | null
          gateway_response?: Json | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          transaction_id?: string
          amount?: number
          status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
          payment_method?: string | null
          gateway_response?: Json | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniencia
export type Guardian = Database['public']['Tables']['guardians']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Almuerzo = Database['public']['Tables']['almuerzos']['Row']
export type Colacion = Database['public']['Tables']['colaciones']['Row']
export type Pedido = Database['public']['Tables']['pedidos']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Setting = Database['public']['Tables']['settings']['Row']
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']

export type GuardianUpdate = Database['public']['Tables']['guardians']['Update']
export type StudentUpdate = Database['public']['Tables']['students']['Update']
export type PedidoUpdate = Database['public']['Tables']['pedidos']['Update']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']
