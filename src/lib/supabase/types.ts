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
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          is_staff: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          is_staff?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
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
          guardian_id: string | null
          name: string
          grade: string
          section: string
          level: string
          tipo: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id?: string | null
          name: string
          grade: string
          section: string
          level: string
          tipo?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string | null
          name?: string
          grade?: string
          section?: string
          level?: string
          tipo?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          codigo: string
          descripcion: string
          dia: string
          fecha: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string | null
          is_active: boolean
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
          tipo_dia?: string | null
          is_active?: boolean
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
          tipo_dia?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          guardian_id: string | null
          student_id: string | null
          fecha_pedido: string
          dia_entrega: string
          total_amount: number
          status: string
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id?: string | null
          student_id?: string | null
          fecha_pedido: string
          dia_entrega: string
          total_amount: number
          status?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string | null
          student_id?: string | null
          fecha_pedido?: string
          dia_entrega?: string
          total_amount?: number
          status?: string
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number | null
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          getnet_transaction_id: string | null
          amount: number
          status: string
          payment_method: string | null
          processed_at: string | null
          getnet_response: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          getnet_transaction_id?: string | null
          amount: number
          status?: string
          payment_method?: string | null
          processed_at?: string | null
          getnet_response?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          getnet_transaction_id?: string | null
          amount?: number
          status?: string
          payment_method?: string | null
          processed_at?: string | null
          getnet_response?: Json | null
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
      pedidos_detalle: {
        Row: {
          id: string | null
          nombre_estudiante: string | null
          nivel: string | null
          letra: string | null
          opcion_elegida: string | null
          tipo_pedido: string | null
          dia_entrega: string | null
          estado_pago: string | null
          fecha_pedido: string | null
          total_amount: number | null
          nombre_guardian: string | null
          email_guardian: string | null
        }
      }
      pedidos_agrupados: {
        Row: {
          dia: string | null
          fecha: string | null
          opcion: string | null
          cantidad: number | null
          nivel: string | null
        }
      }
    }
    Functions: {
      get_pedidos_agrupados: {
        Args: {
          fecha_inicio: string
          fecha_fin: string
          nivel_filtro?: string
        }
        Returns: {
          dia: string
          fecha: string
          opcion: string
          cantidad: number
          nivel: string
        }[]
      }
      can_make_order: {
        Args: {
          delivery_date: string
        }
        Returns: boolean
      }
    }
    Enums: {
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