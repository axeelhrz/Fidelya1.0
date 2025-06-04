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
export type Almuerzo = Database['public']['Tables']['almuerzos']['Row']
export type Colacion = Database['public']['Tables']['colaciones']['Row']
export type Pedido = Database['public']['Tables']['pedidos']['Row']
export type Cliente = Database['public']['Tables']['clientes']['Row']

// Tipos para inserts
export type GuardianInsert = Database['public']['Tables']['guardians']['Insert']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type AlmuerzoInsert = Database['public']['Tables']['almuerzos']['Insert']
export type ColacionInsert = Database['public']['Tables']['colaciones']['Insert']
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert']
export type ClienteInsert = Database['public']['Tables']['clientes']['Insert']

// Enums útiles
export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'CANCELADO' | 'ENTREGADO'
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
export type StudentLevel = 'PREESCOLAR' | 'BASICA' | 'MEDIA'
export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES'