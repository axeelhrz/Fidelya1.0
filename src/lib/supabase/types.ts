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
      clientes: {
        Row: {
          id: string
          correo_apoderado: string
          nombre_apoderado: string
          hijos: Json
          created_at?: string
          updated_at?: string
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
      almuerzos: {
        Row: {
          id: string
          descripcion: string
          fecha: string
          dia: string
          codigo: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
          created_at?: string
        }
        Insert: {
          id?: string
          descripcion: string
          fecha: string
          dia: string
          codigo: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
          created_at?: string
        }
        Update: {
          id?: string
          descripcion?: string
          fecha?: string
          dia?: string
          codigo?: string
          precio_estudiante?: number
          precio_funcionario?: number
          tipo_dia?: string
          created_at?: string
        }
      }
      colaciones: {
        Row: {
          id: string
          codigo: string
          descripcion: string
          precio: number
          created_at?: string
        }
        Insert: {
          id?: string
          codigo: string
          descripcion: string
          precio: number
          created_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          descripcion?: string
          precio?: number
          created_at?: string
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
          dia_entrega: string
          estado_pago: string
          transaction_id?: string
          created_at?: string
          updated_at?: string
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
          dia_entrega: string
          estado_pago: string
          transaction_id?: string
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
          dia_entrega?: string
          estado_pago?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}