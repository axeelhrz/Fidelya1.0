'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { getAllUsers, testSupabaseConnection } from '@/lib/auth'
import { Profile } from '@/types/database'

export default function SupabaseTest() {
  const [users, setUsers] = useState<Profile[]>([])
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

      // Test fetching users
      const usersList = await getAllUsers()
      setUsers(usersList)
      setConnectionStatus(`✅ Conexión exitosa - ${usersList.length} usuarios encontrados`)

    } catch (err: any) {
      setError(err.message)
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
        .from('profiles')
        .select('*')
        .limit(10)

      if (error) throw error

      setUsers(data || [])
      setConnectionStatus(`✅ Query directo exitoso - ${data?.length || 0} usuarios`)
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus('❌ Error en query directo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto m-8">
      <CardHeader>
        <CardTitle>Prueba de Conexión Supabase</CardTitle>
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

        {users.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Usuarios encontrados:</h3>
            {users.map((user) => (
              <div key={user.id} className="p-2 bg-green-50 border border-green-200 rounded">
                <p><strong>Nombre:</strong> {user.full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
        </div>
      </CardContent>
    </Card>
  )
}
