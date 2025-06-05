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
      almuerzos: {
        Row: {
          id: string
          descripcion: string
          precio_estudiante: number
          precio_funcionario: number
          fecha: string
          dia: string
          tipo_dia: string
          codigo: string | null
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          descripcion: string
          precio_estudiante: number
          precio_funcionario: number
          fecha: string
          dia: string
          tipo_dia: string
          codigo?: string | null
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          descripcion?: string
          precio_estudiante?: number
          precio_funcionario?: number
          fecha?: string
          dia?: string
          tipo_dia?: string
          codigo?: string | null
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          user_id: string | null
          correo_apoderado: string
          nombre_apoderado: string
          telefono: string | null
          hijos: Json
          rol: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          correo_apoderado: string
          nombre_apoderado: string
          telefono?: string | null
          hijos?: Json
          rol?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          correo_apoderado?: string
          nombre_apoderado?: string
          telefono?: string | null
          hijos?: Json
          rol?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      colaciones: {
        Row: {
          id: string
          descripcion: string
          precio: number
          codigo: string | null
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          descripcion: string
          precio: number
          codigo?: string | null
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          descripcion?: string
          precio?: number
          codigo?: string | null
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pedidos: {
        Row: {
          id: string
          cliente_id: string
          nombre_estudiante: string
          curso: string
          letra: string
          nivel: string
          tipo_pedido: string
          opcion_elegida: string
          precio: number
          dia_entrega: string
          estado_pago: string
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          nombre_estudiante: string
          curso: string
          letra: string
          nivel: string
          tipo_pedido: string
          opcion_elegida: string
          precio: number
          dia_entrega: string
          estado_pago?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          nombre_estudiante?: string
          curso?: string
          letra?: string
          nivel?: string
          tipo_pedido?: string
          opcion_elegida?: string
          precio?: number
          dia_entrega?: string
          estado_pago?: string
          transaction_id?: string | null
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
