'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { getAllUsers, testSupabaseConnection, getFullName, generatePassword } from '@/lib/auth'
import { Funcionario } from '@/types/database'

export default function SupabaseTest() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('')

  const testConnection = async () => {
    setLoading(true)
    setError('')
    setConnectionStatus('Probando conexión...')

    try {
      // Test basic connection
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        throw new Error('No se pudo conectar con Supabase')
      }
      setConnectionStatus('✅ Conexión exitosa')

      // Test fetching funcionarios
      const funcionariosList = await getAllUsers()
      setFuncionarios(funcionariosList)
      setConnectionStatus(`✅ Conexión exitosa - ${funcionariosList.length} funcionarios encontrados`)

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setConnectionStatus('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const testDirectQuery = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('activo', true)
        .limit(10)

      if (error) throw error

      setFuncionarios(data || [])
      setConnectionStatus(`✅ Query directo exitoso - ${data?.length || 0} funcionarios`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setConnectionStatus('❌ Error en query directo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto m-8">
      <CardHeader>
        <CardTitle>Prueba de Conexión Supabase - Tabla Funcionarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <Button onClick={testConnection} disabled={loading}>
            Probar Conexión
          </Button>
          <Button onClick={testDirectQuery} disabled={loading} variant="outline">
            Query Directo
          </Button>
        </div>

        {connectionStatus && (
          <div className="p-3 bg-gray-100 rounded">
            <p className="font-medium">{connectionStatus}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {funcionarios.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Funcionarios encontrados:</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {funcionarios.map((funcionario) => (
                <div key={funcionario.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p><strong>Nombre:</strong> {getFullName(funcionario)}</p>
                  <p><strong>Email:</strong> {funcionario.email}</p>
                  <p><strong>Cargo:</strong> {funcionario.cargo || 'No especificado'}</p>
                  <p><strong>Departamento:</strong> {funcionario.departamento || 'No especificado'}</p>
                  <p><strong>Contraseña generada:</strong> <span className="font-mono font-bold text-green-700">{generatePassword(funcionario.nombre, funcionario.apellido)}</span></p>
                  <p><strong>ID:</strong> {funcionario.id}</p>
                  <p><strong>Activo:</strong> {funcionario.activo ? '✅ Sí' : '❌ No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
          <p><strong>Tabla:</strong> funcionarios</p>
        </div>
      </CardContent>
    </Card>
  )
}