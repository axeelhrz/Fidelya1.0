"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  ShoppingCart, 
  UserCircle, 
  Settings,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '@/context/UserContext'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Nuevo Pedido', href: '/pedidos/nuevo', icon: ShoppingCart },
  { name: 'Mi Perfil', href: '/perfil', icon: UserCircle },
]

const adminNavigation = [
  { name: 'Administración', href: '/admin', icon: Settings },
  { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
  { name: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3 },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, guardian, signOut } = useUser()
  const pathname = usePathname()

  if (!user) return null

  const isStaff = guardian?.is_staff || false
  const userInitials = guardian?.full_name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || 'U'

  const allNavigation = isStaff 
    ? [...navigation, ...adminNavigation]
    : navigation

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                Casino Escolar
              </Link>
            </div>
            
            {/* Navegación desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {allNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
              >
                    <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            )
          })}
        </div>
          </div>

          {/* Menú de usuario */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {guardian?.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {isStaff && (
                      <p className="text-xs leading-none text-blue-600 font-medium">
                        Administrador
                      </p>
                    )}
        </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
      </div>

          {/* Botón menú móvil */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {allNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
  )
            })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {guardian?.full_name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
                </div>
                {isStaff && (
                  <div className="text-xs font-medium text-blue-600">
                    Administrador
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/perfil"
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="mr-3 h-5 w-5" />
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
