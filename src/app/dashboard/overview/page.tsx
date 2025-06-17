"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type AlmuerzoMenu = Database["public"]["Tables"]["almuerzos"]["Row"]
type Colacion = Database["public"]["Tables"]["colaciones"]["Row"]
type Pedido = Database["public"]["Tables"]["pedidos"]["Row"]

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosPendientes: 0,
    menuSemana: [] as AlmuerzoMenu[],
    colaciones: [] as Colacion[],
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Cargar menú de la semana
        const { data: menuData } = await supabase
          .from("almuerzos")
          .select("*")
          .gte("fecha", new Date().toISOString().split("T")[0])
          .order("fecha")
          .limit(5)

        // Cargar colaciones disponibles
        const { data: colacionesData } = await supabase
          .from("colaciones")
          .select("*")

        // Cargar estadísticas de pedidos
        const { count: totalPedidos } = await supabase
          .from("pedidos")
          .select("*", { count: "exact" })

        const { count: pedidosPendientes } = await supabase
          .from("pedidos")
          .select("*", { count: "exact" })
          .eq("estado_pago", "pendiente")

        setStats({
          totalPedidos: totalPedidos || 0,
          pedidosPendientes: pedidosPendientes || 0,
          menuSemana: menuData || [],
          colaciones: colacionesData || [],
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Vista General del Sistema</h1>

        {/* Estadísticas Generales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Pedidos</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalPedidos}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pedidosPendientes}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Menús Activos</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.menuSemana.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Colaciones</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.colaciones.length}</p>
          </div>
        </div>

        {/* Menú de la Semana */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Menú de la Semana</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Día
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Estudiante
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.menuSemana.map((menu) => (
                  <tr key={menu.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(menu.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {menu.dia}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {menu.descripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${menu.precio_estudiante}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Colaciones Disponibles */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Colaciones Disponibles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.colaciones.map((colacion) => (
              <div key={colacion.id} className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900">{colacion.descripcion}</h3>
                <p className="text-sm text-gray-600 mt-1">Código: {colacion.codigo}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">${colacion.precio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones Principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
            Crear Nuevo Pedido
          </button>
          <button className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            Gestionar Menú
          </button>
          <button className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  )
}
