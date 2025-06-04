"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/context/UserContext'

export default function DebugPage() {
  const { user, session, guardian, loading, refreshUserData } = useUser()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')
  const [guardianInfo, setGuardianInfo] = useState<any>(null)

  useEffect(() => {
    loadDebugInfo()
  }, [])

  const loadDebugInfo = async () => {
    try {
      // Obtener información de la sesión
      const { data: sessionData } = await supabase.auth.getSession()
      
      // Obtener información del usuario
      const { data: userData } = await supabase.auth.getUser()
      
      // Verificar conexión a la base de datos
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .limit(1)

      setDebugInfo({
        session: sessionData.session,
        user: userData.user,
        dbConnection: settingsError ? 'Error' : 'OK',
        dbError: settingsError?.message,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error cargando debug info:', error)
    }
  }

  const testLogin = async () => {
    if (!testEmail || !testPassword) return

    console.log('🧪 Probando login con:', testEmail)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      console.log('📊 Resultado del login:')
      console.log('- Data:', data)
      console.log('- Error:', error)
      console.log('- Usuario:', data?.user?.id)
      console.log('- Email verificado:', !!data?.user?.email_confirmed_at)
      
      await loadDebugInfo()
    } catch (error) {
      console.error('Error en test login:', error)
    }
  }

  const checkUserInDB = async () => {
    if (!user?.id) return

    try {
      console.log('🔍 Buscando usuario en DB:', user.id)
      
      const { data: guardianData, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('👤 Guardian en DB:', guardianData)
      console.log('❌ Error:', error)
      
      setGuardianInfo({ data: guardianData, error: error })
    } catch (error) {
      console.error('Error verificando usuario en DB:', error)
      setGuardianInfo({ error: error })
    }
  }

  const createGuardianProfile = async () => {
    if (!user) return

    try {
      console.log('👤 Creando perfil de guardian para:', user.id)
      
      const { data, error } = await supabase
        .from('guardians')
        .insert({
          user_id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || 'Usuario',
          is_staff: false
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Error creando guardian:', error)
        alert(`Error: ${error.message}`)
      } else {
        console.log('✅ Guardian creado:', data)
        alert('Guardian creado exitosamente!')
        
        // Refrescar datos del usuario
        await refreshUserData()
        await checkUserInDB()
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      alert(`Error inesperado: ${error}`)
    }
  }

  const fixGuardianProfile = async () => {
    if (!user) return

    try {
      console.log('🔧 Intentando reparar perfil de guardian...')
      
      // Primero verificar si existe
      const { data: existingGuardian, error: checkError } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (checkError && checkError.code === 'PGRST116') {
        // No existe, crear uno nuevo
        console.log('📝 Guardian no existe, creando...')
        await createGuardianProfile()
      } else if (existingGuardian) {
        console.log('✅ Guardian ya existe:', existingGuardian)
        alert('El guardian ya existe. Refrescando datos...')
        await refreshUserData()
      } else {
        console.error('❌ Error verificando guardian:', checkError)
        alert(`Error verificando guardian: ${checkError?.message}`)
      }
    } catch (error) {
      console.error('Error en fixGuardianProfile:', error)
      alert(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Debug de Autenticación</h1>
        
        {/* Estado actual */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Loading:</strong> {loading ? 'Sí' : 'No'}
              </div>
              <div>
                <strong>User ID:</strong> {user?.id || 'No autenticado'}
              </div>
              <div>
                <strong>Email:</strong> {user?.email || 'N/A'}
              </div>
              <div>
                <strong>Email verificado:</strong> {user?.email_confirmed_at ? 'Sí' : 'No'}
              </div>
              <div>
                <strong>Guardian:</strong> {guardian?.full_name || 'No cargado'}
              </div>
              <div>
                <strong>Session:</strong> {session ? 'Activa' : 'No activa'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button onClick={loadDebugInfo} variant="outline">
              Actualizar Info
            </Button>
            
            {user && (
                <Button onClick={checkUserInDB} variant="outline">
                Verificar Usuario en DB
              </Button>
            )}
              
              {user && (
                <Button onClick={fixGuardianProfile} className="bg-green-600 hover:bg-green-700">
                  Reparar Perfil
            </Button>
              )}
              </div>
          </CardContent>
        </Card>

        {/* Información del Guardian en DB */}
        {guardianInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Guardian en Base de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
                {JSON.stringify(guardianInfo, null, 2)}
              </pre>
              
              {guardianInfo.error && guardianInfo.error.code === 'PGRST116' && (
                <div className="mt-4">
                  <p className="text-red-600 mb-2">❌ El guardian no existe en la base de datos</p>
                  <Button onClick={createGuardianProfile} className="bg-blue-600 hover:bg-blue-700">
                    Crear Perfil de Guardian
                  </Button>
      </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test de Login */}
        <Card>
          <CardHeader>
            <CardTitle>Test de Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Email</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@ejemplo.com"
              />
    </div>
            
            <div className="space-y-2">
              <Label htmlFor="testPassword">Contraseña</Label>
              <Input
                id="testPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="contraseña"
              />
            </div>
            
            <Button onClick={testLogin} className="w-full">
              Probar Login
            </Button>
          </CardContent>
        </Card>

        {/* Información de Debug */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Variables de Entorno */}
        <Card>
          <CardHeader>
            <CardTitle>Variables de Entorno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </div>
              <div>
                <strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}
              </div>
              <div>
                <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => window.location.href = '/dashboard'} 
              className="w-full"
            >
              Ir al Dashboard
            </Button>
            <Button 
              onClick={() => window.location.href = '/auth/login'} 
              variant="outline" 
              className="w-full"
            >
              Ir al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}