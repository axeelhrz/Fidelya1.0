"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AdminMenuItem } from '@/types/adminMenu'
import { getMenuTypeColor, getMenuItemStatusBadge } from '@/lib/adminMenuUtils'

interface MenuItemCardProps {
  item: AdminMenuItem
  onEdit: (item: AdminMenuItem) => void
  onDelete: (item: AdminMenuItem) => void
  isLoading?: boolean
}

export function MenuItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: MenuItemCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const typeColors = getMenuTypeColor(item.type)
  const statusBadge = getMenuItemStatusBadge(item.active)

  const handleEdit = () => {
    onEdit(item)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete(item)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`
          group relative p-3 rounded-lg border-2 transition-all duration-200
          hover:shadow-md hover:scale-[1.02] cursor-pointer
          ${typeColors.bg} ${typeColors.border}
          ${!item.active ? 'opacity-75' : ''}
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-md text-xs font-bold
                ${typeColors.bg} ${typeColors.text} border ${typeColors.border}
              `}>
                {item.code}
              </span>
              <Badge 
                variant={statusBadge.variant}
                className={statusBadge.className}
              >
                {statusBadge.text}
              </Badge>
            </div>
            
            <p className={`
              text-sm font-medium leading-relaxed
              ${typeColors.text}
            `}>
              {item.description}
            </p>
            
            {item.updatedAt && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Actualizado: {item.updatedAt.toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit} className="flex items-center space-x-2">
                  <Edit2 className="h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="flex items-center space-x-2 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar menú?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el menú "{item.code} - {item.description}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
