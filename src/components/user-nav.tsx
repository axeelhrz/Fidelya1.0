'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { 
  User, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  Calendar,
  Shield,
  Loader2
} from "lucide-react"

export function UserNav() {
  const { user, profile, signOut, loading, isAuthenticated, isAdmin } = useUser()
  const router = useRouter()

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      router.push('/')
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-red-600'
      case 'admin':
        return 'text-orange-600'
      case 'moderator':
        return 'text-blue-600'
      case 'viewer':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Administrador'
      case 'moderator':
        return 'Moderador'
      case 'viewer':
        return 'Visualizador'
      default:
        return 'Usuario'
    }
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (!isAuthenticated || !user || !profile) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/auth/login')}
        >
          Iniciar sesión
        </Button>
        <Button 
          size="sm"
          onClick={() => router.push('/auth/registro')}
        >
          Registrarse
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={profile.full_name} />
            <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className={`text-xs leading-none ${getRoleColor(profile.role)}`}>
              {getRoleLabel(profile.role)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/perfil')}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/pedidos')}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Mis Pedidos</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/menu')}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Menús</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/admin')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Administración</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/configuracion')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}