import React from "react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r px-6 py-8 flex flex-col gap-6 shadow-sm">
        <div className="text-2xl font-bold mb-8 text-green-700">Panel Casino</div>
        <nav className="flex flex-col gap-4">
          <Link href="/admin" className="hover:text-green-600 font-medium">Dashboard</Link>
          <Link href="/admin/pedidos" className="hover:text-green-600 font-medium">Pedidos</Link>
          <Link href="/admin/menu" className="hover:text-green-600 font-medium">Menús y Colaciones</Link>
          <Link href="/admin/estadisticas" className="hover:text-green-600 font-medium">Estadísticas</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
