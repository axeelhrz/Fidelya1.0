"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, AlertCircle, Eye, Users, Target, DollarSign, Type, FileText, Utensils, Coffee, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
    almuerzo: { 
      icon: Utensils, 
      label: 'Almuerzo', 
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    colacion: { 
      icon: Coffee, 
      label: 'Colación', 
      color: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    }
  }

  const config = typeConfig[formData.type]
  const TypeIcon = config.icon

  return (
    <Dialog open={modalState.isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0 overflow-hidden">
        {/* Header fijo */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                  <TypeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {modalTitle}
                  </DialogTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {modalState.date && (
                      <Badge variant="outline" className="text-sm">
                        {modalState.day} • {modalState.date}
                      </Badge>
                    )}
                    <Badge className={`text-sm ${config.bgColor} ${config.color} border-0`}>
                      {config.label}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription className="text-base mt-2">
              {isEditMode 
                ? 'Modifica los detalles del menú. Los cambios se reflejarán inmediatamente para todos los usuarios.'
                : 'Crea un nuevo elemento del menú con título claro y descripción opcional para detalles adicionales.'
              }
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Vista Previa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>Vista Previa</span>
                    <Badge variant="outline" className="text-xs">
                      Cómo se verá para los usuarios
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    {/* Header de la preview */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                          <TypeIcon className="w-5 h-5 text-white" />
                        </div>
                        <Badge 
                          variant="outline"
                          className={`text-sm font-bold px-3 py-1 bg-${formData.type === 'almuerzo' ? 'blue' : 'emerald'}-100 text-${formData.type === 'almuerzo' ? 'blue' : 'emerald'}-700 border-${formData.type === 'almuerzo' ? 'blue' : 'emerald'}-200`}
                        >
                          {formData.code || 'Código'}
                        </Badge>
                      </div>
                    </div>

                    {/* Título */}
                    <div className="mb-4">
                      <h4 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">
                        {formData.title || 'Título del menú...'}
                      </h4>
                    </div>

                    {/* Descripción */}
                    {formData.description && (
                      <div className={`mb-5 p-4 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {formData.description}
                        </p>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-5">
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
                      <Badge variant="outline" className={`text-xs bg-${formData.type === 'almuerzo' ? 'blue' : 'emerald'}-50 text-${formData.type === 'almuerzo' ? 'blue' : 'emerald'}-700 border-${formData.type === 'almuerzo' ? 'blue' : 'emerald'}-200`}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Footer con precio */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Precio:
                        </span>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {getDisplayPrice()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Visible para todos los usuarios</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Disponible para pedidos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Separator />

            {/* Formulario */}
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-8"
            >
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Type className="w-5 h-5" />
                    <span>Información Básica</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tipo de menú */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Tipo de menú</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value as 'almuerzo' | 'colacion')}
                      className="grid grid-cols-2 gap-4"
                      disabled={isEditMode}
                    >
                      <div className="flex items-center space-x-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                        <RadioGroupItem value="almuerzo" id="almuerzo" />
                        <Label htmlFor="almuerzo" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Utensils className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <span className="font-medium">Almuerzo</span>
                            <Badge variant="outline" className="ml-2 text-xs">Principal</Badge>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors">
                        <RadioGroupItem value="colacion" id="colacion" />
                        <Label htmlFor="colacion" className="flex items-center space-x-3 cursor-pointer flex-1">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <Coffee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <span className="font-medium">Colación</span>
                            <Badge variant="outline" className="ml-2 text-xs">Snack</Badge>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Código */}
                    <div className="space-y-3">
                      <Label htmlFor="code" className="text-base font-medium">
                        Código *
                      </Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                        placeholder="Ej: A1, A2, C1, C2..."
                        className={`text-lg ${errors.code ? 'border-red-500' : ''}`}
                        maxLength={10}
                      />
                      {errors.code && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.code}</AlertDescription>
                        </Alert>
                      )}
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Código único para este día (A1, A2 para almuerzos o C1, C2 para colaciones)
                      </p>
                    </div>

                    {/* Estado */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Estado de disponibilidad</Label>
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                        <div>
                          <span className="font-medium">
                            {formData.active ? 'Disponible' : 'No disponible'}
                          </span>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {formData.active 
                              ? 'Los usuarios podrán ver y pedir este menú'
                              : 'Este menú no será visible para los usuarios'
                            }
                          </p>
                        </div>
                        <Switch
                          checked={formData.active}
                          onCheckedChange={(checked) => handleInputChange('active', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contenido del Menú */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Contenido del Menú</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Título */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-medium">
                      Título del menú *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ej: Pollo a la plancha, Ensalada César, Yogurt con granola..."
                      className={`text-lg ${errors.title ? 'border-red-500' : ''}`}
                      maxLength={100}
                    />
                    <div className="flex justify-between items-center">
                      {errors.title && (
                        <Alert variant="destructive" className="flex-1 mr-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.title}</AlertDescription>
                        </Alert>
                      )}
                      <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formData.title.length}/100
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Un título claro y atractivo que identifique el plato o colación
                    </p>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-medium">
                      Descripción adicional (opcional)
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Agrega detalles adicionales como ingredientes, acompañamientos, información nutricional, etc..."
                      className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                      maxLength={200}
                    />
                    <div className="flex justify-between items-center">
                      {errors.description && (
                        <Alert variant="destructive" className="flex-1 mr-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.description}</AlertDescription>
                        </Alert>
                      )}
                      <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formData.description?.length || 0}/200
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Información adicional que se mostrará en una sección separada del título
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración de Precio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Configuración de Precio</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Switch de precio personalizado */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Precio personalizado</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {useCustomPrice 
                          ? 'Este menú tendrá un precio específico diferente al precio base'
                          : `Se usará el precio base: $${(formData.type === 'almuerzo' ? PRICES.apoderado.almuerzo : PRICES.apoderado.colacion).toLocaleString('es-CL')}`
                        }
                      </p>
                    </div>
                    <Switch
                      checked={useCustomPrice}
                      onCheckedChange={setUseCustomPrice}
                    />
                  </div>

                  {/* Campo de precio personalizado */}
                  {useCustomPrice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <Label htmlFor="price" className="text-base font-medium">
                        Precio personalizado (CLP) *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                        placeholder="Ej: 3100"
                        className={`text-lg ${errors.price ? 'border-red-500' : ''}`}
                        min="1"
                        max="50000"
                      />
                      {errors.price && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.price}</AlertDescription>
                        </Alert>
                      )}
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Precio base de referencia:</strong> Almuerzo ${PRICES.apoderado.almuerzo.toLocaleString('es-CL')}, Colación ${PRICES.apoderado.colacion.toLocaleString('es-CL')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Información de impacto */}
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-base mb-2">
                        Impacto en usuarios
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
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
            </motion.form>
          </div>
        </div>

        {/* Footer fijo con botones */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              size="lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className={`flex items-center space-x-2 bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isEditMode ? 'Actualizar Menú' : 'Guardar Menú'}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}