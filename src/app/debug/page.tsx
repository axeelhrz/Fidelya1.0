"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/context/UserContext'

export default function DebugPage() {
  const { user, session, guardian, loading } = useUser()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')

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
      const { data: guardianData, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', user.id)
        .single()

      console.log('👤 Guardian en DB:', guardianData)
      console.log('❌ Error:', error)
    } catch (error) {
      console.error('Error verificando usuario en DB:', error)
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
            
            <Button onClick={loadDebugInfo} className="w-full">
              Actualizar Info
            </Button>
            
            {user && (
              <Button onClick={checkUserInDB} variant="outline" className="w-full">
                Verificar Usuario en DB
              </Button>
            )}
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}