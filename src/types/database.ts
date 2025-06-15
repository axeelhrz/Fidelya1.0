export interface Database {
  public: {
    Tables: {
      trabajadores: {
        Row: {
          id: number
          nombre: string
          apellido: string
          email: string
          telefono: string | null
          cargo: string | null
          departamento: string | null
          fecha_ingreso: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nombre: string
          apellido: string
          email: string
          telefono?: string | null
          cargo?: string | null
          departamento?: string | null
          fecha_ingreso?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nombre?: string
          apellido?: string
          email?: string
          telefono?: string | null
          cargo?: string | null
          departamento?: string | null
          fecha_ingreso?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shifts: {
        Row: {
          id: string
          name: string
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_time: string
          end_time: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          trabajador_id: number
          shift_id: string
          order_date: string
          menu_item: string
          status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trabajador_id: number
          shift_id: string
          order_date: string
          menu_item: string
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trabajador_id?: number
          shift_id?: string
          order_date?: string
          menu_item?: string
          status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Trabajador = Database['public']['Tables']['trabajadores']['Row']
export type Shift = Database['public']['Tables']['shifts']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

// Alias para compatibilidad
export type Profile = Trabajador
export type Funcionario = Trabajador