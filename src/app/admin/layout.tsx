"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Calendar, 
  BarChart3, 
  Settings,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Inicio
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">
                  🛠️ Panel de Administración
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-red-100 px-2 py-1 rounded">
                  Modo sin autenticación
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-8 px-4">
              <div className="space-y-2">
                
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard Admin
                  </Button>
                </Link>

                <Link href="/admin/usuarios">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Usuarios
                  </Button>
                </Link>

                <Link href="/admin/pedidos">
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Pedidos
                  </Button>
                </Link>

                <Link href="/admin/menu">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Gestión de Menú
                  </Button>
                </Link>

                <Link href="/admin/estadisticas">
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Estadísticas
                  </Button>
                </Link>

                <Link href="/admin/configuracion">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Button>
                </Link>

              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>

        <Toaster />
      </div>
  );
}