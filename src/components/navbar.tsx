"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCart, 
  Calendar, 
  User, 
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Utensils,
  Menu,
  X,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock user data
const mockUser = {
  isAuthenticated: true,
  name: "María Rodríguez",
  email: "maria.rodriguez@email.com",
  avatar: "MR",
  role: "Apoderado"
}

const navigationItems = [
  {
    name: "Pedidos",
    href: "/pedidos/nuevo",
    icon: ShoppingCart,
    description: "Crear nuevo pedido"
  },
  {
    name: "Menú",
    href: "/menu",
    icon: Calendar,
    description: "Ver menú semanal"
  },
  {
    name: "Perfil",
    href: "/perfil",
    icon: User,
    description: "Mi información"
  }
]

const adminItems = [
  {
    name: "Administración",
    href: "/admin",
    icon: Settings,
    description: "Panel de control"
  }
]

// Animaciones optimizadas
const animations = {
  navbar: {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  },
  mobileMenu: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  },
  item: {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        <Utensils className="w-5 h-5 text-white" />
      </div>
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          Casino Escolar
        </h1>
        <p className="text-xs text-gray-500 -mt-1">Sistema de gestión</p>
      </div>
    </Link>
  )
}

function NavigationItem({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative px-4 py-2 rounded-2xl transition-all duration-300 group
          ${isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          }
        `}
      >
        <div className="flex items-center gap-2">
          <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
          <span className="font-medium text-sm">{item.name}</span>
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200"
            initial={false}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </motion.div>
    </Link>
  )
}

function UserMenu() {
  const router = useRouter()

  const handleSignOut = () => {
    // Mock sign out
    console.log("Signing out...")
    router.push('/')
  }

  if (!mockUser.isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/auth/login">
          <Button 
            variant="ghost" 
            size="sm"
            className="rounded-2xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/auth/registro">
          <Button 
            size="sm"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Registrarse
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="rounded-2xl hover:bg-gray-100 transition-all duration-300 p-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              {mockUser.avatar}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
              <p className="text-xs text-gray-500">{mockUser.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-xl">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              {mockUser.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{mockUser.name}</p>
              <p className="text-sm text-gray-500">{mockUser.email}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {mockUser.role}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
            <Link href="/perfil" className="flex items-center gap-3 p-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium">Mi Perfil</p>
                <p className="text-xs text-gray-500">Gestionar información personal</p>
              </div>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
            <Link href="/admin" className="flex items-center gap-3 p-3">
              <Settings className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-medium">Administración</p>
                <p className="text-xs text-gray-500">Panel de control del sistema</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator className="mx-2" />
        
        <div className="p-2">
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="rounded-xl cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <div className="flex items-center gap-3 p-3">
              <LogOut className="w-4 h-4" />
              <div>
                <p className="font-medium">Cerrar Sesión</p>
                <p className="text-xs opacity-70">Salir del sistema</p>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            variants={animations.mobileMenu}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-20 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 md:hidden"
          >
            <div className="p-6 space-y-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.name}
                    variants={animations.item}
                    onClick={onClose}
                  >
                    <Link href={item.href}>
                      <div className={`
                        flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                        ${isActive 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}>
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
              
              {mockUser.isAuthenticated && adminItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <motion.div
                    key={item.name}
                    variants={animations.item}
                    onClick={onClose}
                  >
                    <Link href={item.href}>
                      <div className={`
                        flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                        ${isActive 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}>
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.nav
        variants={animations.navbar}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Logo />
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <NavigationItem
                    key={item.name}
                    item={item}
                    isActive={isActive}
                  />
                )
              })}
              
              {mockUser.isAuthenticated && adminItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <NavigationItem
                    key={item.name}
                    item={item}
                    isActive={isActive}
                  />
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* User menu */}
              <UserMenu />
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden rounded-2xl p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}