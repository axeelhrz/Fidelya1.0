"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Save, 
  AlertCircle,
  Bell,
  Mail,
  Shield,
  Globe,
  DollarSign,
  Clock,
  AlertTriangle,
  Palette,
  Database,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface ConfiguracionSistema {
  nombre_sistema: string;
  email_contacto: string;
  telefono_contacto: string;
  direccion: string;
  precio_almuerzo_estudiante: number;
  precio_almuerzo_funcionario: number;
  precio_colacion: number;
  horario_pedidos_inicio: string;
  horario_pedidos_fin: string;
  dias_anticipacion: number;
  notificaciones_email: boolean;
  notificaciones_sms: boolean;
  modo_mantenimiento: boolean;
  mensaje_mantenimiento: string;
  tema_color: string;
  idioma: string;
  zona_horaria: string;
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<ConfiguracionSistema>({
    nombre_sistema: "Casino Escolar",
    email_contacto: "admin@casino.cl",
    telefono_contacto: "+56 9 1234 5678",
    direccion: "Colegio XYZ, Santiago, Chile",
    precio_almuerzo_estudiante: 3500,
    precio_almuerzo_funcionario: 4500,
    precio_colacion: 1500,
    horario_pedidos_inicio: "08:00",
    horario_pedidos_fin: "14:00",
    dias_anticipacion: 1,
    notificaciones_email: true,
    notificaciones_sms: false,
    modo_mantenimiento: false,
    mensaje_mantenimiento: "El sistema está en mantenimiento. Volveremos pronto.",
    tema_color: "green",
    idioma: "es",
    zona_horaria: "America/Santiago"
  });
  
  const [guardando, setGuardando] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      // En un caso real, cargarías esto desde una tabla de configuración
      // Por ahora usamos valores por defecto
      toast({
        title: "Configuración cargada",
        description: "Se han cargado los valores de configuración actuales",
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error al cargar configuración",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };
  const guardarConfiguracion = async () => {
    try {
      setGuardando(true);
      
      // Aquí guardarías la configuración en la base de datos
      // await supabase.from('configuracion_sistema').upsert(config);
      
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado exitosamente",
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setGuardando(false);
    }
  };

  const resetearConfiguracion = () => {
    setConfig({
      nombre_sistema: "Casino Escolar",
      email_contacto: "admin@casino.cl",
      telefono_contacto: "+56 9 1234 5678",
      direccion: "Colegio XYZ, Santiago, Chile",
      precio_almuerzo_estudiante: 3500,
      precio_almuerzo_funcionario: 4500,
      precio_colacion: 1500,
      horario_pedidos_inicio: "08:00",
      horario_pedidos_fin: "14:00",
      dias_anticipacion: 1,
      notificaciones_email: true,
      notificaciones_sms: false,
      modo_mantenimiento: false,
      mensaje_mantenimiento: "El sistema está en mantenimiento. Volveremos pronto.",
      tema_color: "green",
      idioma: "es",
      zona_horaria: "America/Santiago"
    });
    
    toast({
      title: "Configuración restablecida",
      description: "Se han restaurado los valores por defecto",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600">Ajusta la configuración general del casino escolar</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Configuración General</span>
          </CardTitle>
          <CardDescription>
            Ajustes básicos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre-sistema">Nombre del Sistema</Label>
              <Input id="nombre-sistema" defaultValue="Casino Escolar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-contacto">Email de Contacto</Label>
              <Input id="email-contacto" defaultValue="admin@casino.escolar" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permitir registro de usuarios</Label>
                <p className="text-sm text-gray-600">Los usuarios pueden registrarse automáticamente</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo mantenimiento</Label>
                <p className="text-sm text-gray-600">Deshabilita el acceso al sistema</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notificaciones</span>
          </CardTitle>
          <CardDescription>
            Configurar alertas y notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificaciones por email</Label>
              <p className="text-sm text-gray-600">Enviar notificaciones importantes por correo</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertas de pedidos</Label>
              <p className="text-sm text-gray-600">Notificar cuando hay nuevos pedidos</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recordatorios de pago</Label>
              <p className="text-sm text-gray-600">Enviar recordatorios de pagos pendientes</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Seguridad</span>
          </CardTitle>
          <CardDescription>
            Configuración de seguridad del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Tiempo de sesión (minutos)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attempts">Máximo intentos de login</Label>
              <Input id="max-attempts" type="number" defaultValue="5" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Autenticación de dos factores</Label>
              <p className="text-sm text-gray-600">Requerir verificación adicional</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Configuración en modo desarrollo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Actualmente el sistema está funcionando sin autenticación. 
                Estas configuraciones se aplicarán cuando se implemente la autenticación.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetearConfiguracion}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Restablecer
        </Button>
        <Button onClick={guardarConfiguracion} disabled={guardando}>
          <Save className="w-4 h-4 mr-2" />
          {guardando ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>

      {/* Configuration Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="precios">Precios</TabsTrigger>
            <TabsTrigger value="horarios">Horarios</TabsTrigger>
            <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
            <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
            <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="nombre_sistema">Nombre del Sistema</Label>
                    <Input
                      id="nombre_sistema"
                      value={config.nombre_sistema}
                      onChange={(e) => setConfig({...config, nombre_sistema: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email_contacto">Email de Contacto</Label>
                    <Input
                      id="email_contacto"
                      type="email"
                      value={config.email_contacto}
                      onChange={(e) => setConfig({...config, email_contacto: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono_contacto">Teléfono de Contacto</Label>
                    <Input
                      id="telefono_contacto"
                      value={config.telefono_contacto}
                      onChange={(e) => setConfig({...config, telefono_contacto: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Textarea
                      id="direccion"
                      value={config.direccion}
                      onChange={(e) => setConfig({...config, direccion: e.target.value})}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Configuración Regional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="idioma">Idioma del Sistema</Label>
                    <Select value={config.idioma} onValueChange={(value) => setConfig({...config, idioma: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="zona_horaria">Zona Horaria</Label>
                    <Select value={config.zona_horaria} onValueChange={(value) => setConfig({...config, zona_horaria: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                        <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                        <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Estado del Sistema</h4>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Modo Mantenimiento</Label>
                        <p className="text-sm text-slate-500">
                          Desactiva el acceso público al sistema
                        </p>
                      </div>
                      <Switch
                        checked={config.modo_mantenimiento}
                        onCheckedChange={(checked) => setConfig({...config, modo_mantenimiento: checked})}
                      />
                    </div>
                    
                    {config.modo_mantenimiento && (
                      <div>
                        <Label htmlFor="mensaje_mantenimiento">Mensaje de Mantenimiento</Label>
                        <Textarea
                          id="mensaje_mantenimiento"
                          value={config.mensaje_mantenimiento}
                          onChange={(e) => setConfig({...config, mensaje_mantenimiento: e.target.value})}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="precios">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Configuración de Precios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h3 className="font-semibold text-green-800 dark:text-green-200">
                        Almuerzo Estudiante
                      </h3>
                      <div className="mt-2">
                        <Label htmlFor="precio_almuerzo_estudiante">Precio (CLP)</Label>
                        <Input
                          id="precio_almuerzo_estudiante"
                          type="number"
                          value={config.precio_almuerzo_estudiante}
                          onChange={(e) => setConfig({...config, precio_almuerzo_estudiante: parseInt(e.target.value)})}
                          className="text-center text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                        Almuerzo Funcionario
                      </h3>
                      <div className="mt-2">
                        <Label htmlFor="precio_almuerzo_funcionario">Precio (CLP)</Label>
                        <Input
                          id="precio_almuerzo_funcionario"
                          type="number"
                          value={config.precio_almuerzo_funcionario}
                          onChange={(e) => setConfig({...config, precio_almuerzo_funcionario: parseInt(e.target.value)})}
                          className="text-center text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                        Colación
                      </h3>
                      <div className="mt-2">
                        <Label htmlFor="precio_colacion">Precio (CLP)</Label>
                        <Input
                          id="precio_colacion"
                          type="number"
                          value={config.precio_colacion}
                          onChange={(e) => setConfig({...config, precio_colacion: parseInt(e.target.value)})}
                          className="text-center text-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        Importante
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Los cambios de precios afectarán solo a los nuevos pedidos. 
                        Los pedidos existentes mantendrán sus precios originales.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Settings */}
          <TabsContent value="horarios">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Configuración de Horarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="horario_pedidos_inicio">Hora de Inicio de Pedidos</Label>
                    <Input
                      id="horario_pedidos_inicio"
                      type="time"
                      value={config.horario_pedidos_inicio}
                      onChange={(e) => setConfig({...config, horario_pedidos_inicio: e.target.value})}
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Hora desde la cual los usuarios pueden hacer pedidos
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="horario_pedidos_fin">Hora de Fin de Pedidos</Label>
                    <Input
                      id="horario_pedidos_fin"
                      type="time"
                      value={config.horario_pedidos_fin}
                      onChange={(e) => setConfig({...config, horario_pedidos_fin: e.target.value})}
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      Hora límite para realizar pedidos
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dias_anticipacion">Días de Anticipación</Label>
                  <Select 
                    value={config.dias_anticipacion.toString()} 
                    onValueChange={(value) => setConfig({...config, dias_anticipacion: parseInt(value)})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Mismo día</SelectItem>
                      <SelectItem value="1">1 día de anticipación</SelectItem>
                      <SelectItem value="2">2 días de anticipación</SelectItem>
                      <SelectItem value="3">3 días de anticipación</SelectItem>
                      <SelectItem value="7">1 semana de anticipación</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-slate-500 mt-1">
                    Tiempo mínimo requerido para realizar un pedido
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Horario Actual Configurado
                  </h4>
                  <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <p>• Pedidos disponibles de {config.horario_pedidos_inicio} a {config.horario_pedidos_fin}</p>
                    <p>• Se requieren {config.dias_anticipacion} día(s) de anticipación</p>
                    <p>• Zona horaria: {config.zona_horaria}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notificaciones">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Configuración de Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <Label>Notificaciones por Email</Label>
                      </div>
                      <p className="text-sm text-slate-500">
                        Enviar confirmaciones y recordatorios por correo electrónico
                      </p>
                    </div>
                    <Switch
                      checked={config.notificaciones_email}
                      onCheckedChange={(checked) => setConfig({...config, notificaciones_email: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-green-500" />
                        <Label>Notificaciones SMS</Label>
                        <Badge variant="secondary">Próximamente</Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        Enviar notificaciones importantes por mensaje de texto
                      </p>
                    </div>
                    <Switch
                      checked={config.notificaciones_sms}
                      onCheckedChange={(checked) => setConfig({...config, notificaciones_sms: checked})}
                      disabled
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Tipos de Notificaciones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Para Usuarios
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Confirmación de pedido</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Recordatorio de pago</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Cambios en el menú</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Para Administradores
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Nuevos pedidos</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Pagos recibidos</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Errores del sistema</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="apariencia">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Configuración de Apariencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Tema de Color Principal</Label>
                  <div className="grid grid-cols-6 gap-3 mt-2">
                    {[
                      { name: 'green', color: 'bg-green-500', label: 'Verde' },
                      { name: 'blue', color: 'bg-blue-500', label: 'Azul' },
                      { name: 'purple', color: 'bg-purple-500', label: 'Morado' },
                      { name: 'red', color: 'bg-red-500', label: 'Rojo' },
                      { name: 'orange', color: 'bg-orange-500', label: 'Naranja' },
                      { name: 'pink', color: 'bg-pink-500', label: 'Rosa' },
                    ].map((tema) => (
                      <button
                        key={tema.name}
                        onClick={() => setConfig({...config, tema_color: tema.name})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          config.tema_color === tema.name 
                            ? 'border-slate-900 dark:border-white' 
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className={`w-full h-8 ${tema.color} rounded mb-2`}></div>
                        <p className="text-xs font-medium">{tema.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Vista Previa del Tema</h4>
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                    <div className="space-y-4">
                      <div className={`p-4 bg-${config.tema_color}-500 text-white rounded-lg`}>
                        <h3 className="font-semibold">Elemento Principal</h3>
                        <p className="text-sm opacity-90">
                          Así se verán los elementos principales con el tema seleccionado
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className={`p-3 bg-${config.tema_color}-100 dark:bg-${config.tema_color}-900/20 rounded`}>
                          <div className={`w-full h-2 bg-${config.tema_color}-500 rounded mb-2`}></div>
                          <p className="text-xs">Elemento secundario</p>
                        </div>
                        <div className={`p-3 bg-${config.tema_color}-100 dark:bg-${config.tema_color}-900/20 rounded`}>
                          <div className={`w-full h-2 bg-${config.tema_color}-500 rounded mb-2`}></div>
                          <p className="text-xs">Elemento secundario</p>
                        </div>
                        <div className={`p-3 bg-${config.tema_color}-100 dark:bg-${config.tema_color}-900/20 rounded`}>
                          <div className={`w-full h-2 bg-${config.tema_color}-500 rounded mb-2`}></div>
                          <p className="text-xs">Elemento secundario</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="avanzado">
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Configuración Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Base de Datos</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Database className="h-4 w-4 mr-2" />
                          Respaldar Base de Datos
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Limpiar Caché
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Seguridad</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Revisar Logs de Seguridad
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Generar Reporte de Sistema
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">
                          Zona de Peligro
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-3">
                          Estas acciones son irreversibles y pueden afectar el funcionamiento del sistema.
                        </p>
                        <div className="space-y-2">
                          <Button variant="destructive" size="sm">
                            Resetear Todas las Configuraciones
                          </Button>
                          <Button variant="destructive" size="sm">
                            Eliminar Todos los Datos de Prueba
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}