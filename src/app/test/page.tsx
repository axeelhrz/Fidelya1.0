"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { testSupabaseConnection, testRegistration } from '@/lib/test-connection'

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('')
  const [registrationStatus, setRegistrationStatus] = useState<string>('')
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('123456')
  const [testName, setTestName] = useState('Usuario de Prueba')
  const [loading, setLoading] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    setConnectionStatus('Probando conexión...')
    
    const success = await testSupabaseConnection()
    setConnectionStatus(success ? '✅ Conexión exitosa' : '❌ Error de conexión')
    setLoading(false)
  }

  const handleTestRegistration = async () => {
    setLoading(true)
    setRegistrationStatus('Probando registro...')
    
    const result = await testRegistration(testEmail, testPassword, testName)
    setRegistrationStatus(
      result.success 
        ? '✅ Registro exitoso' 
        : `❌ Error: ${result.error}`
    )
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Página de Pruebas</h1>
        
        {/* Test de Conexión */}
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Conexión a Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleTestConnection} 
              disabled={loading}
              className="w-full"
            >
              Probar Conexión
            </Button>
            {connectionStatus && (
              <div className="p-3 bg-gray-100 rounded-md">
                <pre className="text-sm">{connectionStatus}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test de Registro */}
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Registro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Email de prueba</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testPassword">Contraseña</Label>
              <Input
                id="testPassword"
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testName">Nombre completo</Label>
              <Input
                id="testName"
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleTestRegistration} 
              disabled={loading}
              className="w-full"
            >
              Probar Registro
            </Button>
            
            {registrationStatus && (
              <div className="p-3 bg-gray-100 rounded-md">
                <pre className="text-sm">{registrationStatus}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No configurada'}
              </div>
              <div>
                <strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'No configurada'}
              </div>
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}