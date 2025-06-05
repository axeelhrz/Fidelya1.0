"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  ShoppingCart, 
  Calendar, 
  BarChart3, 
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Gestiona todos los aspectos del sistema casino escolar
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Pendientes
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$185,231</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menús Activos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Para esta semana
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Gestión de Usuarios</span>
            </CardTitle>
            <CardDescription>
              Administrar usuarios y permisos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/usuarios">
              <Button className="w-full">
                Ver Usuarios
              </Button>
            </Link>
            <p className="text-sm text-gray-600">
              156 usuarios registrados
            </p>
          </CardContent>
        </Card>

        {/* Gestión de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-green-600" />
              <span>Gestión de Pedidos</span>
            </CardTitle>
            <CardDescription>
              Revisar y procesar pedidos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/pedidos">
              <Button className="w-full">
                Ver Pedidos
              </Button>
            </Link>
            <p className="text-sm text-gray-600">
              23 pedidos pendientes
            </p>
          </CardContent>
        </Card>

        {/* Gestión de Menú */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>Gestión de Menú</span>
            </CardTitle>
            <CardDescription>
              Crear y editar menús semanales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/menu">
              <Button className="w-full">
                Gestionar Menú
              </Button>
            </Link>
            <p className="text-sm text-gray-600">
              12 menús activos
            </p>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Estadísticas</span>
            </CardTitle>
            <CardDescription>
              Reportes y análisis detallados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/estadisticas">
              <Button className="w-full">
                Ver Reportes
              </Button>
            </Link>
            <p className="text-sm text-gray-600">
              Datos actualizados
            </p>
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Configuración</span>
            </CardTitle>
            <CardDescription>
              Ajustes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/configuracion">
              <Button className="w-full" variant="outline">
                Configurar
              </Button>
            </Link>
            <p className="text-sm text-gray-600">
              Sistema configurado
            </p>
          </CardContent>
        </Card>

        {/* Estado del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Estado del Sistema</span>
            </CardTitle>
            <CardDescription>
              Monitoreo en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Sistema operativo</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Base de datos OK</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Sin autenticación</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas acciones en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nuevo pedido creado</p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Usuario registrado</p>
                <p className="text-xs text-gray-500">Hace 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Menú actualizado</p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Modo de desarrollo activo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                El sistema está funcionando sin autenticación. Todas las funciones administrativas están disponibles.
                Recuerda implementar la autenticación antes de producción.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}