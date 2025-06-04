"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type Product = Database["public"]["Tables"]["products"]["Row"]
type Order = Database["public"]["Tables"]["orders"]["Row"]

interface Stats {
  totalPedidos: number
  pedidosPendientes: number
  menuSemana: Product[]
  productosDisponibles: Product[]
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalPedidos: 0,
    pedidosPendientes: 0,
    menuSemana: [],
    productosDisponibles: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Cargar productos de la semana (menú)
        const { data: menuData } = await supabase
          .from("products")
          .select("*")
          .gte("available_date", new Date().toISOString().split("T")[0])
          .eq("is_active", true)
          .order("available_date")
          .limit(5)

        // Cargar todos los productos disponibles
        const { data: productosData } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)

        // Cargar estadísticas de pedidos
        const { count: totalPedidos } = await supabase
          .from("orders")
          .select("*", { count: "exact" })

        const { count: pedidosPendientes } = await supabase
          .from("orders")
          .select("*", { count: "exact" })
          .eq("status", "pending")

        setStats({
          totalPedidos: totalPedidos || 0,
          pedidosPendientes: pedidosPendientes || 0,
          menuSemana: menuData || [],
          productosDisponibles: productosData || [],
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
            <h3 className="text-lg font-medium text-gray-900">Productos</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.productosDisponibles.length}</p>
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
                      {new Date(menu.available_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {menu.day_of_week}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {menu.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${menu.price_student}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Productos Disponibles */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos Disponibles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.productosDisponibles.slice(0, 6).map((producto) => (
              <div key={producto.id} className="p-4 border rounded-lg">
                <h3 className="font-medium text-gray-900">{producto.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Código: {producto.code}</p>
                <p className="text-sm text-gray-600">Tipo: {producto.type}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">${producto.price_student}</p>
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