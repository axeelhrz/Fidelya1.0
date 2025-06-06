"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AdminMenuItem, MenuFormData, MenuModalState, MenuOperationResult } from '@/types/adminMenu'
import { AdminMenuService } from '@/services/adminMenuService'
import { generateMenuCode, validateMenuCode, getMenuTypeLabel } from '@/lib/adminMenuUtils'

interface MenuItemModalProps {
  modalState: MenuModalState
  onClose: () => void
  onSave: (itemData: Omit<AdminMenuItem, 'id'>) => Promise<MenuOperationResult>
  onUpdate: (id: string, updates: Partial<AdminMenuItem>) => Promise<MenuOperationResult>
  existingCodes: string[]
  weekStart: string
}

export function MenuItemModal({ 
  modalState, 
  onClose, 
  onSave, 
  onUpdate,
  existingCodes,
  weekStart
}: MenuItemModalProps) {
  const [formData, setFormData] = useState<MenuFormData>({
    type: 'almuerzo',
    code: '',
    description: '',
    active: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (modalState.isOpen) {
      if (modalState.mode === 'edit' && modalState.item) {
        setFormData({
          type: modalState.item.type,
          code: modalState.item.code,
          description: modalState.item.description,
          active: modalState.item.active
        })
      } else {
        // Modo crear
        const suggestedCode = generateMenuCode(
          modalState.type || 'almuerzo', 
          existingCodes
        )
        setFormData({
          type: modalState.type || 'almuerzo',
          code: suggestedCode,
          description: '',
          active: true
        })
      }
      setErrors({})
    }
  }, [modalState, existingCodes])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar código
    if (!formData.code.trim()) {
      newErrors.code = 'El código es obligatorio'
    } else if (!validateMenuCode(formData.code)) {
      newErrors.code = 'El código debe tener el formato A1, A2, C1, C2, etc.'
    } else if (
      modalState.mode === 'create' && 
      existingCodes.includes(formData.code)
    ) {
      newErrors.code = 'Este código ya existe para este día'
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria'
    } else if (formData.description.length > 200) {
      newErrors.description = 'La descripción no puede tener más de 200 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      let result: MenuOperationResult

      if (modalState.mode === 'edit' && modalState.item?.id) {
        result = await onUpdate(modalState.item.id, formData)
      } else {
        const itemData: Omit<AdminMenuItem, 'id'> = {
          ...formData,
          date: modalState.date,
          day: modalState.day,
          weekStart
        }
        result = await onSave(itemData)
      }

      if (result.success) {
        onClose()
      } else if (result.errors) {
        const formErrors: Record<string, string> = {}
        result.errors.forEach(error => {
          formErrors[error.field] = error.message
        })
        setErrors(formErrors)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof MenuFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isEditMode = modalState.mode === 'edit'
  const modalTitle = isEditMode ? 'Editar Menú' : 'Agregar Nuevo Menú'

  return (
    <Dialog open={modalState.isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{modalTitle}</span>
            {modalState.date && (
              <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                - {modalState.day} {modalState.date}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Tipo de menú */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de menú</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value as 'almuerzo' | 'colacion')}
              className="flex space-x-6"
              disabled={isEditMode} // No permitir cambiar tipo en edición
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="almuerzo" id="almuerzo" />
                <Label htmlFor="almuerzo">Almuerzo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="colacion" id="colacion" />
                <Label htmlFor="colacion">Colación</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium">
              Código *
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
              placeholder="Ej: A1, A2, C1, C2..."
              className={errors.code ? 'border-red-500' : ''}
              maxLength={10}
            />
            {errors.code && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{errors.code}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el plato o colación..."
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between items-center">
              {errors.description && (
                <Alert variant="destructive" className="py-2 flex-1 mr-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{errors.description}</AlertDescription>
                </Alert>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formData.description.length}/200
              </span>
            </div>
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Estado</Label>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Los menús inactivos no serán visibles para los usuarios
              </p>
            </div>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isEditMode ? 'Actualizar' : 'Guardar'}</span>
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
