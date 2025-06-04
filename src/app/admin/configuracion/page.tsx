"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Clock, Mail, DollarSign, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/context/UserContext'
import { redirect } from 'next/navigation'

interface SystemSettings {
  order_cutoff_time: string
  system_name: string
  contact_email: string
  precio_estudiante_default: string
  precio_funcionario_default: string
  email_notifications_enabled: string
  maintenance_mode: string
  welcome_message: string
}

export default function ConfiguracionPage() {
  const { guardian } = useUser()
  const [settings, setSettings] = useState<SystemSettings>({
    order_cutoff_time: '10:00:00',
    system_name: 'Casino Escolar',
    contact_email: 'casino@colegio.cl',
    precio_estudiante_default: '4500',
    precio_funcionario_default: '5500',
    email_notifications_enabled: 'true',
    maintenance_mode: 'false',
    welcome_message: 'Bienvenido al sistema de pedidos del casino escolar'
  })
  const [saving, setSaving] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const { toast } = useToast()

  // Verificar permisos de admin
  useEffect(() => {
    if (!guardian || (guardian.role !== 'admin' && guardian.role !== 'staff')) {
      redirect('/dashboard')
    }
  }, [guardian])

  useEffect(() => {
    if (guardian && (guardian.role === 'admin' || guardian.role === 'staff')) {
      loadSettings()
    }
  }, [guardian])

  const loadSettings = async () => {
    try {
      setLoadingSettings(true)

      const { data: settingsData, error } = await supabase
        .from('settings')
        .select('key, value')

      if (error) {
        console.error('Error loading settings:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar las configuraciones'
        })
        return
      }

      // Convertir array a objeto
      const settingsObject = settingsData?.reduce((acc, setting) => {
        acc[setting.key as keyof SystemSettings] = setting.value
        return acc
      }, {} as SystemSettings)

      setSettings(prev => ({ ...prev, ...settingsObject }))

    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoadingSettings(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)

      // Convertir objeto a array para upsert
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
        description: getSettingDescription(key)
      }))

      const { error } = await supabase
        .from('settings')
        .upsert(settingsArray, { onConflict: 'key' })

      if (error) {
        console.error('Error saving settings:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron guardar las configuraciones'
        })
        return
      }

      toast({
        title: 'Configuraciones guardadas',
        description: 'Los cambios se han aplicado correctamente'
      })

    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error interno guardando configuraciones'
      })
    } finally {
      setSaving(false)
    }
  }

  const getSettingDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      order_cutoff_time: 'Hora límite para realizar pedidos',
      system_name: 'Nombre del sistema',
      contact_email: 'Email de contacto',
      precio_estudiante_default: 'Precio por defecto para estudiantes (en centavos)',
      precio_funcionario_default: 'Precio por defecto para funcionarios (en centavos)',
      email_notifications_enabled: 'Habilitar notificaciones por email',
      maintenance_mode: 'Modo mantenimiento',
      welcome_message: 'Mensaje de bienvenida'
    }
    return descriptions[key] || ''
  }

  const updateSetting = (key: keyof SystemSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loadingSettings) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!guardian || (guardian.role !== 'admin' && guardian.role !== 'staff')) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">
            Gestiona las configuraciones generales del casino escolar
          </p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Configuración de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cutoff-time">Hora límite para pedidos</Label>
              <Input
                id="cutoff-time"
                type="time"
                value={settings.order_cutoff_time.substring(0, 5)}
                onChange={(e) => updateSetting('order_cutoff_time', e.target.value + ':00')}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Los pedidos no se podrán realizar después de esta hora
              </p>
            </div>

            <div>
              <Label htmlFor="precio-estudiante">Precio por defecto - Estudiantes</Label>
              <Input
                id="precio-estudiante"
                type="number"
                value={settings.precio_estudiante_default}
                onChange={(e) => updateSetting('precio_estudiante_default', e.target.value)}
                placeholder="4500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Precio en centavos (4500 = $4.500)
              </p>
            </div>

            <div>
              <Label htmlFor="precio-funcionario">Precio por defecto - Funcionarios</Label>
              <Input
                id="precio-funcionario"
                type="number"
                value={settings.precio_funcionario_default}
                onChange={(e) => updateSetting('precio_funcionario_default', e.target.value)}
                placeholder="5500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Precio en centavos (5500 = $5.500)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configuración General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="system-name">Nombre del sistema</Label>
              <Input
                id="system-name"
                value={settings.system_name}
                onChange={(e) => updateSetting('system_name', e.target.value)}
                placeholder="Casino Escolar"
              />
            </div>

            <div>
              <Label htmlFor="contact-email">Email de contacto</Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contact_email}
                onChange={(e) => updateSetting('contact_email', e.target.value)}
                placeholder="casino@colegio.cl"
              />
            </div>

            <div>
              <Label htmlFor="welcome-message">Mensaje de bienvenida</Label>
              <Textarea
                id="welcome-message"
                value={settings.welcome_message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSetting('welcome_message', e.target.value)}
                placeholder="Bienvenido al sistema de pedidos del casino escolar"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notificaciones por email</Label>
                <p className="text-xs text-muted-foreground">
                  Enviar confirmaciones de pago por email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications_enabled === 'true'}
                onCheckedChange={(checked) => 
                  updateSetting('email_notifications_enabled', checked ? 'true' : 'false')
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode">Modo mantenimiento</Label>
                <p className="text-xs text-muted-foreground">
                  Deshabilitar temporalmente el sistema para usuarios
                </p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={settings.maintenance_mode === 'true'}
                onCheckedChange={(checked) => 
                  updateSetting('maintenance_mode', checked ? 'true' : 'false')
                }
              />
            </div>

            {settings.maintenance_mode === 'true' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ El modo mantenimiento está activado. Los usuarios no podrán realizar pedidos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Versión</Label>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Última actualización</Label>
              <p className="font-medium">{new Date().toLocaleDateString('es-CL')}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Base de datos</Label>
              <p className="font-medium">Supabase</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}