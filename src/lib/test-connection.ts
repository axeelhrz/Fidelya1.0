import { supabase } from './supabase/client'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Probando conexión con Supabase...')
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error de conexión:', error)
      return false
    }
    
    console.log('✅ Conexión exitosa con Supabase')
    
    // Probar autenticación
    const { data: session } = await supabase.auth.getSession()
    console.log('📋 Sesión actual:', session.session?.user?.id || 'No hay sesión')
    
    return true
  } catch (error) {
    console.error('❌ Error inesperado:', error)
    return false
  }
}

export async function testRegistration(email: string, password: string, fullName: string) {
  try {
    console.log('🚀 Probando registro para:', email)
    
    // Paso 1: Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('guardians')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      console.log('⚠️ Usuario ya existe')
      return { success: false, error: 'Usuario ya existe' }
    }
    
    // Paso 2: Registrar en Auth
    console.log('📝 Registrando en Supabase Auth...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    if (authError) {
      console.error('❌ Error en Auth:', authError)
      return { success: false, error: authError.message }
    }
    
    if (!authData.user) {
      console.error('❌ No se recibió usuario')
      return { success: false, error: 'No se recibió usuario' }
    }
    
    console.log('✅ Usuario registrado en Auth:', authData.user.id)
    
    // Paso 3: Crear perfil
    console.log('👤 Creando perfil de guardian...')
    const { error: profileError } = await supabase
      .from('guardians')
      .insert({
        user_id: authData.user.id,
        email: email,
        full_name: fullName,
        is_staff: false
      })
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError)
      return { success: false, error: profileError.message }
    }
    
    console.log('✅ Perfil creado exitosamente')
    return { success: true }
    
  } catch (error: any) {
    console.error('❌ Error inesperado:', error)
    return { success: false, error: error.message }
  }
}