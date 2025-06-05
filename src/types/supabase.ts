// This file defines the types for Supabase tables used in the project
export type Tables = {
  clientes: {
    id: string
    user_id: string
    nombre_apoderado: string
    correo_apoderado: string
    telefono_apoderado: string
    es_funcionario: boolean
    hijos: any // Puede ser JSON o relación a estudiantes
  }
  estudiantes: {
    id: string
    user_id: string
    nombre: string
    grado: string
    restricciones_alimentarias?: string | null
    alergias?: string | null
    creado_el?: string
    actualizado_el?: string
  }
}

export type Database = {
  public: {
    Tables: Tables
  }
}
