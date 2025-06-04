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
          is_active: boolean
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
          is_active?: boolean
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
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      almuerzos: {
        Row: {
          id: string
          codigo: string
          descripcion: string
          fecha: string
          dia: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          descripcion: string
          fecha: string
          dia: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          descripcion?: string
          fecha?: string
          dia?: string
          precio_estudiante?: number
          precio_funcionario?: number
          tipo_dia?: string
          created_at?: string
          updated_at?: string
        }
      }
      colaciones: {
        Row: {
          id: string
          codigo: string
          descripcion: string
          fecha: string
          dia: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          descripcion: string
          fecha: string
          dia: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          descripcion?: string
          fecha?: string
          dia?: string
          precio_estudiante?: number
          precio_funcionario?: number
          tipo_dia?: string
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
          estado_pago: string
          total_amount: number
          payment_id: string | null
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
          estado_pago?: string
          total_amount: number
          payment_id?: string | null
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
          estado_pago?: string
          total_amount?: number
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Tabla legacy para compatibilidad (si existe)
      clientes: {
        Row: {
          id: string
          correo_apoderado: string
          nombre_apoderado: string
          hijos: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          correo_apoderado: string
          nombre_apoderado: string
          hijos: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          correo_apoderado?: string
          nombre_apoderado?: string
          hijos?: Json
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

// Tipos auxiliares para facilitar el uso
export type Guardian = Database['public']['Tables']['guardians']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Setting = Database['public']['Tables']['settings']['Row']

export type PedidoDetalle = Database['public']['Views']['pedidos_detalle']['Row']
export type PedidoAgrupado = Database['public']['Views']['pedidos_agrupados']['Row']

// Tipos para inserts
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']

// Enums útiles
export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'CANCELADO' | 'ENTREGADO'
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type StudentLevel = 'PREESCOLAR' | 'BASICA' | 'MEDIA'
export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES'