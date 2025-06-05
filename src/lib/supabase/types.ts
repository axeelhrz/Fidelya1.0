import { Database } from './database.types'

export type { Database }

// Export specific table types for easier use
export type Cliente = Database['public']['Tables']['clientes']['Row']
export type ClienteInsert = Database['public']['Tables']['clientes']['Insert']
export type ClienteUpdate = Database['public']['Tables']['clientes']['Update']

export type Almuerzo = Database['public']['Tables']['almuerzos']['Row']
export type AlmuerzoInsert = Database['public']['Tables']['almuerzos']['Insert']
export type AlmuerzoUpdate = Database['public']['Tables']['almuerzos']['Update']

export type Colacion = Database['public']['Tables']['colaciones']['Row']
export type ColacionInsert = Database['public']['Tables']['colaciones']['Insert']
export type ColacionUpdate = Database['public']['Tables']['colaciones']['Update']

export type Pedido = Database['public']['Tables']['pedidos']['Row']
export type PedidoInsert = Database['public']['Tables']['pedidos']['Insert']
export type PedidoUpdate = Database['public']['Tables']['pedidos']['Update']

// Helper types for the application
export interface Hijo {
  id: string
  nombre: string
  curso: string
  letra: string
  nivel: string
  tipo: string
  rut?: string
}

export interface MenuOption {
  id: string
  descripcion: string
  precio: number
  codigo?: string
  tipo: 'almuerzo' | 'colacion'
  fecha?: string
  dia?: string
  tipo_dia?: string
}