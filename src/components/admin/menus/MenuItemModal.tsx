"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, AlertCircle, Eye, Users, Target, DollarSign, Type, FileText, Utensils, Coffee } from 'lucide-react'
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
        
        // Manejar título y descripción correctamente
        const title = modalState.item.title || modalState.item.description || ''
        const description = modalState.item.title && modalState.item.description && modalState.item.title !== modalState.item.description 
          ? modalState.item.description 
          : ''

        setFormData({
          type: modalState.item.type,
          code: modalState.item.code,
          title: title,
          description: description,
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
          description: formData.title, // Usar título como descripción para compatibilidad
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
          description: formData.title, // Usar título como descripción para compatibilidad
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

  // Configuración de iconos por tipo
  const typeConfig = {
    almuerzo: { icon: Utensils, label: 'Almuerzo', color: 'text-blue-600' },
    colacion: { icon: Coffee, label: 'Colación', color: 'text-emerald-600' }
  }

  const TypeIcon = typeConfig[formData.type].icon

  return (
    <Dialog open={modalState.isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${
              formData.type === 'almuerzo' 
                ? 'from-blue-500 to-indigo-600' 
                : 'from-emerald-500 to-teal-600'
            }`}>
              <TypeIcon className="w-5 h-5 text-white" />
            </div>
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
              : 'Crea un nuevo elemento del menú con título claro y descripción opcional para detalles adicionales.'
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
          {/* Preview Card Mejorada */}
          <Card className={`bg-gradient-to-r ${
            formData.type === 'almuerzo' 
              ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800' 
              : 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Vista Previa - Cómo se verá para los usuarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                {/* Header de la preview */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${
                      formData.type === 'almuerzo' 
                        ? 'from-blue-500 to-indigo-600' 
                        : 'from-emerald-500 to-teal-600'
                    } shadow-lg`}>
                      <TypeIcon className="w-4 h-4 text-white" />
                    </div>
                    <Badge 
                      variant="outline"
                      className={`text-sm font-bold px-3 py-1 ${
                        formData.type === 'almuerzo' 
                          ? 'bg-blue-100 text-blue-700 border-blue-200' 
                          : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {formData.code || 'Código'}
                    </Badge>
                  </div>
                </div>

                {/* Título */}
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                    {formData.title || 'Título del menú...'}
                  </h4>
                </div>

                {/* Descripción */}
                {formData.description && (
                  <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${
                    formData.type === 'almuerzo' 
                      ? 'from-blue-50 to-indigo-50 border-blue-200' 
                      : 'from-emerald-50 to-teal-50 border-emerald-200'
                  } border`}>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {formData.description}
                    </p>
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {formData.active && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <Eye className="w-3 h-3 mr-1" />
                      Disponible
                    </Badge>
                  )}
                  {useCustomPrice && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Precio especial
                    </Badge>
                  )}
                  <Badge variant="outline" className={`text-xs ${
                    formData.type === 'almuerzo' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {typeConfig[formData.type].label}
                  </Badge>
                </div>

                {/* Footer con precio */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Precio:
                    </span>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
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

          {/* Resto del formulario permanece igual pero con mejor organización visual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-6">
              {/* Tipo de menú */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tipo de menú</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value as 'almuerzo' | 'colacion')}
                  className="flex space-x-6"
                  disabled={isEditMode}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="almuerzo" id="almuerzo" />
                    <Label htmlFor="almuerzo" className="flex items-center space-x-2">
                      <Utensils className="w-4 h-4 text-blue-600" />
                      <span>Almuerzo</span>
                      <Badge variant="outline" className="text-xs">Principal</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="colacion" id="colacion" />
                    <Label htmlFor="colacion" className="flex items-center space-x-2">
                      <Coffee className="w-4 h-4 text-emerald-600" />
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
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
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

              {/* Estado activo */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Estado de disponibilidad</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Los menús inactivos no serán visibles para los usuarios
                  </p>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', checked)}
                />
              </div>
            </div>
          </div>

          {/* Descripción - Ancho completo */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Descripción adicional (opcional)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Agrega detalles adicionales como ingredientes, acompañamientos, información nutricional, etc..."
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
              Información adicional que ayude a los usuarios a conocer mejor el menú. Se mostrará en una sección separada del título.
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
              className={`flex items-center space-x-2 bg-gradient-to-r ${
                formData.type === 'almuerzo' 
                  ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                  : 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              }`}
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