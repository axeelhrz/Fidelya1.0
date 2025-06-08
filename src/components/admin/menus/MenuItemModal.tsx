"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, AlertCircle, Eye, Users, Target, DollarSign, Type, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AdminMenuItem, MenuFormData, MenuModalState, MenuOperationResult } from '@/types/adminMenu'
import { generateMenuCode, validateMenuCode } from '@/lib/adminMenuUtils'
import { PRICES } from '@/types/panel'

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
    title: '',
    description: '',
    active: true,
    price: undefined
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useCustomPrice, setUseCustomPrice] = useState(false)

  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (modalState.isOpen) {
      if (modalState.mode === 'edit' && modalState.item) {
        const hasCustomPrice = modalState.item.price !== undefined && modalState.item.price > 0
        setFormData({
          type: modalState.item.type,
          code: modalState.item.code,
          title: modalState.item.title,
          description: modalState.item.description || '',
          active: modalState.item.active,
          price: modalState.item.price
        })
        setUseCustomPrice(hasCustomPrice)
      } else {
        // Modo crear
        const suggestedCode = generateMenuCode(
          modalState.type || 'almuerzo', 
          existingCodes
        )
        setFormData({
          type: modalState.type || 'almuerzo',
          code: suggestedCode,
          title: '',
          description: '',
          active: true,
          price: undefined
        })
        setUseCustomPrice(false)
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

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    } else if (formData.title.length > 100) {
      newErrors.title = 'El título no puede tener más de 100 caracteres'
    }

    // Validar descripción (opcional)
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'La descripción no puede tener más de 200 caracteres'
    }

    // Validar precio personalizado si está habilitado
    if (useCustomPrice) {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'El precio debe ser mayor a 0'
      } else if (formData.price > 50000) {
        newErrors.price = 'El precio no puede ser mayor a $50.000'
      }
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
        // Preparar datos del item para actualización
        const itemData: Partial<AdminMenuItem> = {
          code: formData.code,
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          active: formData.active
        }

        // Solo incluir precio si se usa precio personalizado y tiene valor válido
        if (useCustomPrice && formData.price && formData.price > 0) {
          itemData.price = formData.price
        }

        result = await onUpdate(modalState.item.id, itemData)
      } else {
        const fullItemData: Omit<AdminMenuItem, 'id'> = {
          code: formData.code,
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          active: formData.active,
          published: true,
          date: modalState.date,
          day: modalState.day,
          weekStart,
          ...(useCustomPrice && formData.price && formData.price > 0 && { price: formData.price })
        }
        result = await onSave(fullItemData)
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

  const handleInputChange = (field: keyof MenuFormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getDisplayPrice = (): string => {
    if (useCustomPrice && formData.price) {
      return `$${formData.price.toLocaleString('es-CL')}`
    }
    
    // Mostrar precio base según tipo
    const basePrice = formData.type === 'almuerzo' 
      ? PRICES.apoderado.almuerzo 
      : PRICES.apoderado.colacion
    
    return `$${basePrice.toLocaleString('es-CL')} (precio base)`
  }

  const isEditMode = modalState.mode === 'edit'
  const modalTitle = isEditMode ? 'Editar Menú' : 'Agregar Nuevo Menú'

  return (
    <Dialog open={modalState.isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{modalTitle}</span>
            {modalState.date && (
              <Badge variant="outline" className="text-sm font-normal">
                {modalState.day} {modalState.date}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Modifica los detalles del menú. Los cambios se reflejarán inmediatamente para todos los usuarios.'
              : 'Crea un nuevo elemento del menú con título y descripción opcional.'
            }
          </DialogDescription>
        </DialogHeader>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Preview Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Vista Previa del Usuario</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  {/* Header de la preview */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={formData.type === 'almuerzo' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {formData.code || 'Código'}
                      </Badge>
                      {formData.active && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          Disponible
                        </Badge>
                      )}
                      {useCustomPrice && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                          Precio especial
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Título */}
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      {formData.title || 'Título del menú...'}
                    </h4>
                  </div>

                  {/* Descripción */}
                  {formData.description && (
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {formData.description}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        formData.type === 'almuerzo' 
                          ? 'text-blue-600 border-blue-200 bg-blue-50' 
                          : 'text-emerald-600 border-emerald-200 bg-emerald-50'
                      }`}
                    >
                      {formData.type === 'almuerzo' ? 'Almuerzo' : 'Colación'}
                    </Badge>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      {getDisplayPrice()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Visible para todos los usuarios</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>Disponible para pedidos</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <Label htmlFor="almuerzo" className="flex items-center space-x-2">
                  <span>Almuerzo</span>
                  <Badge variant="outline" className="text-xs">Principal</Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="colacion" id="colacion" />
                <Label htmlFor="colacion" className="flex items-center space-x-2">
                  <span>Colación</span>
                  <Badge variant="outline" className="text-xs">Snack</Badge>
                </Label>
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              El código debe ser único para este día y seguir el formato A1, A2 para almuerzos o C1, C2 para colaciones.
            </p>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span>Título *</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ej: Pollo a la plancha, Ensalada César, Yogurt con granola..."
              className={errors.title ? 'border-red-500' : ''}
              maxLength={100}
            />
            <div className="flex justify-between items-center">
              {errors.title && (
                <Alert variant="destructive" className="py-2 flex-1 mr-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{errors.title}</AlertDescription>
                </Alert>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formData.title.length}/100
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Un título claro y atractivo que identifique el plato o colación.
            </p>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Descripción (opcional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Agrega detalles adicionales como ingredientes, acompañamientos, etc..."
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
                {formData.description?.length || 0}/200
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Información adicional que ayude a los usuarios a conocer mejor el menú.
            </p>
          </div>

          {/* Precio personalizado */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="space-y-1">
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Precio personalizado</span>
                </Label>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {useCustomPrice 
                    ? 'Este menú tendrá un precio específico diferente al precio base'
                    : 'Se usará el precio base según el tipo de usuario'
                  }
                </p>
              </div>
              <Switch
                checked={useCustomPrice}
                onCheckedChange={setUseCustomPrice}
              />
            </div>

            {useCustomPrice && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Precio (CLP) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  placeholder="Ej: 3100"
                  className={errors.price ? 'border-red-500' : ''}
                  min="1"
                  max="50000"
                />
                {errors.price && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.price}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Este precio se aplicará a todos los tipos de usuario. Precio base: Almuerzo ${PRICES.apoderado.almuerzo.toLocaleString('es-CL')}, Colación ${PRICES.apoderado.colacion.toLocaleString('es-CL')}
                </p>
              </div>
            )}
          </div>

          {/* Estado activo */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Estado de disponibilidad</Label>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Los menús inactivos no serán visibles para los usuarios y no podrán realizar pedidos
              </p>
            </div>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
          </div>

          {/* Impact Information */}
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                    Impacto en usuarios
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    {isEditMode 
                      ? 'Los cambios se reflejarán inmediatamente en el menú público y en la sección "Mi Pedido" de todos los usuarios.'
                      : 'Este nuevo menú estará disponible inmediatamente para todos los usuarios una vez guardado.'
                    }
                    {useCustomPrice && ' El precio personalizado se aplicará a todos los usuarios.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
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
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
              <span>{isEditMode ? 'Actualizar Menú' : 'Guardar Menú'}</span>
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}