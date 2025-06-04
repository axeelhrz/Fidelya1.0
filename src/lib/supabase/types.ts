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
          id: number
          fecha: string
          dia: string
          codigo: string
          descripcion: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
        }
        Insert: {
          id?: number
          fecha: string
          dia: string
          codigo: string
          descripcion: string
          precio_estudiante: number
          precio_funcionario: number
          tipo_dia: string
        }
        Update: {
          id?: number
          fecha?: string
          dia?: string
          codigo?: string
          descripcion?: string
          precio_estudiante?: number
          precio_funcionario?: number
          tipo_dia?: string
        }
      }
      clientes: {
        Row: {
          id: number
          uuid: string
          tipo_usuario: string
          nombre_apoderado: string
          correo_apoderado: string
          telefono_apoderado: string
          hijos: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          uuid: string
          tipo_usuario: string
          nombre_apoderado: string
          correo_apoderado: string
          telefono_apoderado?: string
          hijos?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          uuid?: string
          tipo_usuario?: string
          nombre_apoderado?: string
          correo_apoderado?: string
          telefono_apoderado?: string
          hijos?: Json
          created_at?: string
          updated_at?: string
        }
      }
      colaciones: {
        Row: {
          id: number
          codigo: string
          descripcion: string
          precio: number
        }
        Insert: {
          id?: number
          codigo: string
          descripcion: string
          precio: number
        }
        Update: {
          id?: number
          codigo?: string
          descripcion?: string
          precio?: number
        }
      }
      pedidos: {
        Row: {
          id: number
          id_cliente: number
          nombre_estudiante: string
          fecha_creacion: string
          dia_entrega: string
          opcion_elegida: string
          tipo_pedido: 'almuerzo' | 'colacion'
          estado: string
        }
        Insert: {
          id?: number
          id_cliente: number
          nombre_estudiante: string
          fecha_creacion: string
          dia_entrega: string
          opcion_elegida: string
          tipo_pedido: 'almuerzo' | 'colacion'
          estado: string
        }
        Update: {
          id?: number
          id_cliente?: number
          nombre_estudiante?: string
          fecha_creacion?: string
          dia_entrega?: string
          opcion_elegida?: string
          tipo_pedido?: 'almuerzo' | 'colacion'
          estado?: string
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
