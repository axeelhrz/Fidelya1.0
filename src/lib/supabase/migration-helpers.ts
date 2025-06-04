import { supabase } from './client'
import type { Database } from './types'

type Guardian = Database['public']['Tables']['guardians']['Row']
type Student = Database['public']['Tables']['students']['Row']

/**
 * Buscar guardian por email (compatible con esquema antiguo y nuevo)
 */
export async function findGuardianByEmail(email: string): Promise<Guardian | null> {
  try {
    // Intentar con la tabla nueva primero
    const { data: guardian, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('email', email)
      .single()

    if (!error && guardian) {
      return guardian
    }

    // Si no existe en guardians, intentar migrar desde clientes (tabla legacy)
    console.log('Buscando en tabla legacy clientes...')
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select('*')
      .eq('correo_apoderado', email)
      .single()

    if (!clienteError && cliente) {
      console.log('Cliente encontrado en tabla legacy, migrando...')
      return await migrateClienteToGuardian(cliente)
    }

    return null
  } catch (error) {
    console.error('Error buscando guardian:', error)
    return null
  }
}

/**
 * Migrar datos de cliente legacy a guardian
 */
async function migrateClienteToGuardian(cliente: any): Promise<Guardian | null> {
  try {
    // Crear guardian desde datos de cliente
    const guardianData = {
      user_id: cliente.id, // Usar ID del cliente como user_id temporal
      full_name: cliente.nombre_apoderado,
      email: cliente.correo_apoderado,
      phone: null,
      is_staff: false
    }

    const { data: newGuardian, error } = await supabase
      .from('guardians')
      .insert([guardianData])
      .select()
      .single()

    if (error) {
      console.error('Error creando guardian:', error)
      return null
    }

    // Migrar hijos si existen
    if (cliente.hijos && Array.isArray(cliente.hijos)) {
      for (const hijo of cliente.hijos) {
        await migrateHijoToStudent(newGuardian.id, hijo)
      }
    }

    return newGuardian
  } catch (error) {
    console.error('Error en migración:', error)
    return null
  }
}

/**
 * Migrar hijo a student
 */
async function migrateHijoToStudent(guardianId: string, hijo: any): Promise<Student | null> {
  try {
    const studentData = {
      guardian_id: guardianId,
      name: hijo.nombre || hijo.name || 'Estudiante',
      grade: hijo.curso || hijo.grade || 'PRIMERO_BASICO',
      section: hijo.letra || hijo.section || 'A',
      level: hijo.nivel || hijo.level || 'BASICA',
      is_active: true
    }

    const { data: newStudent, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single()

    if (error) {
      console.error('Error creando student:', error)
      return null
    }

    return newStudent
  } catch (error) {
    console.error('Error migrando hijo:', error)
    return null
  }
}

/**
 * Obtener menú de almuerzos para fechas específicas
 */
export async function getAlmuerzosForDates(dates: string[]) {
  try {
    const { data, error } = await supabase
      .from('almuerzos')
      .select('id, descripcion, fecha, dia, codigo, precio_estudiante, tipo_dia')
      .in('fecha', dates)
      .order('fecha')

    if (error) {
      console.error('Error cargando almuerzos:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en getAlmuerzosForDates:', error)
    return []
  }
}

/**
 * Obtener menú de colaciones para fechas específicas
 */
export async function getColacionesForDates(dates: string[]) {
  try {
    const { data, error } = await supabase
      .from('colaciones')
      .select('id, descripcion, fecha, dia, codigo, precio_estudiante, tipo_dia')
      .in('fecha', dates)
      .order('fecha')

    if (error) {
      console.error('Error cargando colaciones:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en getColacionesForDates:', error)
    return []
  }
}

/**
 * Crear pedido
 */
export async function createPedido(pedidoData: {
  guardian_id: string
  student_id: string
  almuerzo_id?: string
  colacion_id?: string
  fecha_entrega: string
  dia_entrega: string
  total_amount: number
}) {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        ...pedidoData,
        estado_pago: 'PENDIENTE'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creando pedido:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error en createPedido:', error)
    throw error
  }
}