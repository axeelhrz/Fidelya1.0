"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("123456")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testRegistration = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult("Iniciando registro...")
      
      // Test 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Usuario de Prueba"
          }
        }
      })
      
      if (authError) {
        addResult(`❌ Error en auth: ${authError.message}`)
        return
      }
      
      addResult(`✅ Usuario auth creado: ${authData.user?.id}`)
      
      // Test 2: Check if profile was created by trigger
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user!.id)
        .single()
      
      if (profileError) {
        addResult(`❌ Perfil no encontrado: ${profileError.message}`)
        
        // Test 3: Create profile manually
        const { error: manualError } = await supabase
          .rpc('create_user_profile_manual', {
            p_user_id: authData.user!.id,
            p_email: email,
            p_full_name: "Usuario de Prueba",
            p_phone: null,
            p_role: 'user'
          })
        
        if (manualError) {
          addResult(`❌ Error creando perfil manual: ${manualError.message}`)
        } else {
          addResult(`✅ Perfil creado manualmente`)
        }
      } else {
        addResult(`✅ Perfil encontrado: ${profileData.email}`)
      }
      
    } catch (error) {
      addResult(`❌ Error general: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult("Iniciando login...")
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (loginError) {
        addResult(`❌ Error en login: ${loginError.message}`)
        return
      }
      
      addResult(`✅ Login exitoso: ${loginData.user?.email}`)
      
      // Test profile loading
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (profileError) {
        addResult(`❌ Error cargando perfil: ${profileError.message}`)
      } else {
        addResult(`✅ Perfil cargado: ${profileData.full_name} (${profileData.role})`)
      }
      
      // Test permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .rpc('get_user_permissions', { user_email: email })
      
      if (permissionsError) {
        addResult(`❌ Error cargando permisos: ${permissionsError.message}`)
      } else {
        addResult(`✅ Permisos cargados: ${permissionsData?.length || 0} permisos`)
      }
      
    } catch (error) {
      addResult(`❌ Error general: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult("Probando conexión a base de datos...")
      
      // Test 1: Check tables
      const { data: usersCount, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
      
      if (usersError) {
        addResult(`❌ Error accediendo tabla users: ${usersError.message}`)
      } else {
        addResult(`✅ Tabla users accesible: ${usersCount?.length || 0} usuarios`)
      }
      
      // Test 2: Check permissions table
      const { data: permissionsCount, error: permissionsError } = await supabase
        .from('permissions')
        .select('id', { count: 'exact' })
      
      if (permissionsError) {
        addResult(`❌ Error accediendo tabla permissions: ${permissionsError.message}`)
      } else {
        addResult(`✅ Tabla permissions accesible: ${permissionsCount?.length || 0} permisos`)
      }
      
      // Test 3: Check RPC functions
      try {
        const { data: roleData, error: roleError } = await supabase
          .rpc('get_user_role', { user_email: 'test@test.com' })
        
        if (roleError) {
          addResult(`❌ Error en RPC get_user_role: ${roleError.message}`)
        } else {
          addResult(`✅ RPC get_user_role funciona: ${roleData}`)
        }
      } catch (error) {
        addResult(`❌ Error en RPC: ${error}`)
      }
      
    } catch (error) {
      addResult(`❌ Error general: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pruebas de Autenticación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={testDatabase} disabled={loading}>
                Probar Base de Datos
              </Button>
              <Button onClick={testRegistration} disabled={loading}>
                Probar Registro
              </Button>
              <Button onClick={testLogin} disabled={loading}>
                Probar Login
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="text-gray-500">Ejecuta una prueba para ver los resultados...</div>
              ) : (
                results.map((result, index) => (
                  <div key={index}>{result}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
