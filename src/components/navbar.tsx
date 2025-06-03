"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "@/components/user-nav"

const navigation = [
  { name: "Inicio", href: "/dashboard" },
  { name: "Hacer Pedido", href: "/pedidos/nuevo" },
  { name: "Reagendar", href: "/pedidos/reagendar" },
  { name: "Menú", href: "/menu" },
  { name: "Mis Datos", href: "/perfil" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8">
          <Link href="/dashboard" className="text-xl font-bold hover:text-primary transition-colors">
            Casino Pedidos
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-primary px-3 py-2 rounded-md ${
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="ml-auto">
          <UserNav />
        </div>
      </div>
    </nav>
  )
}
