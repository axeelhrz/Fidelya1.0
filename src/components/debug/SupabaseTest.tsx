'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { getAllUsers, testSupabaseConnection, getFullName, generatePassword } from '@/lib/auth'
import { Trabajador } from '@/types/database'

export default function SupabaseTest() {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('')
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const testConnection = async () => {
    setLoading(true)
    setError('')
    setConnectionStatus('Probando conexión...')
    setDebugInfo(null)

    try {
      // Test basic connection
      const isConnected = await testSupabaseConnection()
      if (!isConnected) {
        throw new Error('No se pudo conectar con Supabase')
      }
      setConnectionStatus('✅ Conexión exitosa')

      // Test fetching trabajadores
      const trabajadoresList = await getAllUsers()
      setTrabajadores(trabajadoresList)
      setConnectionStatus(`✅ Conexión exitosa - ${trabajadoresList.length} trabajadores encontrados`)

    } catch (err: any) {
      setError(err.message)
      setConnectionStatus('❌ Error de conexión')
      setDebugInfo(err)
    } finally {
      setLoading(false)
    }
  }

  const testDirectQuery = async () => {
    setLoading(true)
    setError('')
    setDebugInfo(null)

    try {
      console.log('Testing direct query to trabajadores table...')
      
      const { data, error, status, statusText } = await supabase
        .from('trabajadores')
        .select('*')
        .limit(10)

      console.log('Query result:', { data, error, status, statusText })

      setDebugInfo({
        status,
        statusText,
        error,
        dataLength: data?.length || 0,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/trabajadores`,
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...`
        }
      })

      if (error) {
        throw new Error(`Error ${status}: ${error.message || statusText}`)
      }

      setTrabajadores(data || [])
      setConnectionStatus(`✅ Query directo exitoso - ${data?.length || 0} trabajadores`)
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus('❌ Error en query directo')
      console.error('Direct query error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSampleData = async () => {
    setLoading(true)
    setError('')

    try {
      // Try to insert a sample trabajador
      const { data, error } = await supabase
        .from('trabajadores')
        .insert([
          {
            nombre: 'Test',
            apellido: 'Usuario',
            email: 'test@empresa.com',
            cargo: 'Tester',
            departamento: 'IT',
            activo: true
          }
        ])
        .select()

      if (error) {
        throw error
      }

      setConnectionStatus('✅ Datos de prueba creados exitosamente')
      setDebugInfo({ inserted: data })
      
      // Refresh the list
      testDirectQuery()
    } catch (err: any) {
      setError(err.message)
      setConnectionStatus('❌ Error creando datos de prueba')
      setDebugInfo({ insertError: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-6xl mx-auto m-8">
      <CardHeader>
        <CardTitle>Diagnóstico Completo de Supabase - Tabla Trabajadores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Botones de prueba */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button onClick={testConnection} disabled={loading} variant="default">
            Probar Conexión
          </Button>
          <Button onClick={testDirectQuery} disabled={loading} variant="outline">
            Query Directo
          </Button>
          <Button onClick={createSampleData} disabled={loading} variant="secondary">
            Crear Datos Prueba
          </Button>
        </div>

        {/* Estado de conexión */}
        {connectionStatus && (
          <div className={`p-4 rounded-lg ${
            connectionStatus.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="font-medium">{connectionStatus}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Información de debug */}
        {debugInfo && (
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <p className="font-medium mb-2">Información de Debug:</p>
            <pre className="text-xs overflow-auto bg-white p-2 rounded border max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Configuración actual */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium mb-2">Configuración Supabase</h3>
            <div className="text-sm space-y-1">
              <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              <p><strong>Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
              <p><strong>Tabla objetivo:</strong> trabajadores</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium mb-2">Pasos para solucionar</h3>
            <div className="text-sm space-y-1">
              <p>1. Ejecutar el script SQL en Supabase</p>
              <p>2. Verificar que la tabla existe</p>
              <p>3. Configurar políticas RLS</p>
              <p>4. Insertar datos de prueba</p>
            </div>
          </div>
        </div>

        {/* Trabajadores encontrados */}
        {trabajadores.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Trabajadores encontrados ({trabajadores.length}):</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trabajadores.map((trabajador) => (
                <div key={trabajador.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p><strong>Nombre:</strong> {getFullName(trabajador)}</p>
                  <p><strong>Email:</strong> {trabajador.email}</p>
                  <p><strong>Cargo:</strong> {trabajador.cargo || 'No especificado'}</p>
                  <p><strong>Departamento:</strong> {trabajador.departamento || 'No especificado'}</p>
                  <p><strong>Contraseña:</strong> <span className="font-mono font-bold text-green-700">{generatePassword(trabajador.nombre, trabajador.apellido)}</span></p>
                  <p><strong>ID:</strong> {trabajador.id}</p>
                  <p><strong>Activo:</strong> {trabajador.activo ? '✅ Sí' : '❌ No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Script SQL */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">Script SQL para ejecutar en Supabase:</h3>
          <div className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
            <code>
              {`-- Ejecutar este script en el SQL Editor de Supabase
CREATE TABLE IF NOT EXISTS public.trabajadores (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  cargo TEXT,
  departamento TEXT,
  fecha_ingreso DATE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.trabajadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON public.trabajadores
  FOR ALL USING (true);

-- Insertar datos de ejemplo
INSERT INTO public.trabajadores (nombre, apellido, email, cargo, departamento, activo) VALUES
  ('Juan', 'Pérez', 'juan.perez@empresa.com', 'Desarrollador', 'IT', true),
  ('María', 'García', 'maria.garcia@empresa.com', 'Diseñadora', 'Marketing', true),
  ('Carlos', 'López', 'carlos.lopez@empresa.com', 'Analista', 'Finanzas', true)
ON CONFLICT (email) DO NOTHING;`}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}