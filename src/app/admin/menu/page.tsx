"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  ChefHat,
  Coffee,
  Users,
  CheckCircle,
  XCircle,
  Copy,
  DollarSign,
  Clock,
  Sparkles,
  Utensils,
  Star,
  Eye,
  X,
  Check,
  AlertCircle,
  Info,
  Settings
} from 'lucide-react';

// Tipos simplificados para funcionar sin Supabase
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'almuerzo' | 'colacion';
  price_student: number;
  price_staff: number;
  available_date: string;
  day_name: string;
  day_type: string;
  code?: string;
  is_available: boolean;
  max_orders?: number;
  current_orders?: number;
}

type MenuCategory = 'almuerzo' | 'colacion';

interface MenuFormData {
  name: string;
  description: string;
  category: MenuCategory;
  price_student: number;
  price_staff: number;
  available_date: string;
  day_name: string;
  day_type: string;
  code: string;
  is_available: boolean;
  max_orders: number | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const formStepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3
    }
  }
};

const MetricCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color = "neutral",
  delay = 0 
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color?: "neutral" | "blue" | "green" | "amber" | "purple";
  delay?: number;
}) => {
  const colors = {
    neutral: "bg-white border-gray-100 text-gray-900",
    blue: "bg-blue-50/50 border-blue-100 text-blue-900",
    green: "bg-emerald-50/50 border-emerald-100 text-emerald-900",
    amber: "bg-amber-50/50 border-amber-100 text-amber-900",
    purple: "bg-purple-50/50 border-purple-100 text-purple-900"
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className={`${colors[color]} border backdrop-blur-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 opacity-60" />
                <span className="text-sm font-medium opacity-70">{label}</span>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MenuItemCard = ({ 
  item, 
  onEdit, 
  onDelete, 
  onToggle, 
  onDuplicate,
  delay = 0 
}: { 
  item: MenuItem; 
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, status: boolean) => void;
  onDuplicate: (item: MenuItem) => void;
  delay?: number;
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getCategoryColor = (category: MenuCategory) => {
    return category === 'almuerzo' 
      ? 'bg-orange-50 text-orange-700 border-orange-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getCategoryIcon = (category: MenuCategory) => {
    return category === 'almuerzo' ? <ChefHat className="w-3 h-3" /> : <Coffee className="w-3 h-3" />;
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable 
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className={`bg-white border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group ${!item.is_available ? 'opacity-75' : ''}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge className={`${getCategoryColor(item.category)} border text-xs font-medium`}>
                    {getCategoryIcon(item.category)}
                    <span className="ml-1 capitalize">{item.category}</span>
                  </Badge>
                  <Badge className={`${getAvailabilityColor(item.is_available)} border text-xs font-medium`}>
                    {item.is_available ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span className="ml-1">{item.is_available ? 'Activo' : 'Inactivo'}</span>
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onEdit(item)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Estudiante</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(item.price_student)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Funcionario</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(item.price_staff)}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Fecha</span>
                <span className="font-medium">
                  {new Date(item.available_date).toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {item.max_orders && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Capacidad</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="font-medium">
                      {item.current_orders || 0}/{item.max_orders}
                    </span>
                  </div>
                </div>
              )}

              {item.code && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Código</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.code}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(item)}
                className="flex-1 bg-white/50 border-gray-200 hover:bg-white"
              >
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDuplicate(item)}
                className="bg-white/50 border-gray-200 hover:bg-white"
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant={item.is_available ? "outline" : "default"}
                onClick={() => onToggle(item.id, item.is_available)}
                className={item.is_available ? "bg-white/50 border-gray-200 hover:bg-white" : "bg-green-500 hover:bg-green-600 text-white"}
              >
                {item.is_available ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/50 border-red-200 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que deseas eliminar &quot;{item.name}&quot;? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MenuForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  isEditing,
  onClose 
}: {
  formData: MenuFormData;
  setFormData: React.Dispatch<React.SetStateAction<MenuFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onClose: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 3;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        if (!formData.category) newErrors.category = 'La categoría es requerida';
        break;
      case 2:
        if (formData.price_student <= 0) newErrors.price_student = 'El precio debe ser mayor a 0';
        if (formData.price_staff <= 0) newErrors.price_staff = 'El precio debe ser mayor a 0';
        if (!formData.available_date) newErrors.available_date = 'La fecha es requerida';
        break;
      case 3:
        // Validaciones opcionales para el paso 3
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: keyof MenuFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: keyof MenuFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user selects
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(1) && validateStep(2) && validateStep(3)) {
      onSubmit(e);
    }
  };

  useEffect(() => {
    if (formData.available_date) {
      const date = new Date(formData.available_date);
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      setFormData(prev => ({ ...prev, day_name: dayNames[date.getDay()] }));
    }
  }, [formData.available_date, setFormData]);

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <Check className="w-4 h-4" />;
    if (step === currentStep) return step;
    return step;
  };

  const getStepColor = (step: number) => {
    if (step < currentStep) return 'bg-green-500 text-white border-green-500';
    if (step === currentStep) return 'bg-blue-500 text-white border-blue-500';
    return 'bg-gray-100 text-gray-400 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Editar Menú' : 'Crear Nuevo Menú'}
          </h2>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Modifica los detalles del menú' : 'Diseña una nueva experiencia culinaria'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 ${getStepColor(step)}`}>
              {getStepIcon(step)}
            </div>
            {step < totalSteps && (
              <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className={`text-xs font-medium transition-colors ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            Información Básica
          </div>
          <div className={`text-xs font-medium transition-colors ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            Precios y Fecha
          </div>
          <div className={`text-xs font-medium transition-colors ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            Configuración
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={formStepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto">
                    <Utensils className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Información del Menú</h3>
                  <p className="text-sm text-gray-600">Describe tu creación culinaria</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-500" />
                      Nombre del menú
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      placeholder="Ej: Pollo al horno con papas doradas y ensalada fresca"
                      className={`bg-white border-2 transition-all duration-200 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      Descripción
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      placeholder="Describe los ingredientes, preparación y lo que hace especial a este menú..."
                      rows={4}
                      className={`bg-white border-2 transition-all duration-200 resize-none ${errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                    {errors.description && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-purple-500" />
                      Categoría
                    </Label>
                    <Select value={formData.category} onValueChange={handleSelectChange('category')}>
                      <SelectTrigger className={`bg-white border-2 transition-all duration-200 ${errors.category ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="almuerzo">
                          <div className="flex items-center gap-3 py-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <ChefHat className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">Almuerzo</p>
                              <p className="text-xs text-gray-500">Comida principal del día</p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="colacion">
                          <div className="flex items-center gap-3 py-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Coffee className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Colación</p>
                              <p className="text-xs text-gray-500">Snack o merienda</p>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        {errors.category}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pricing and Date */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={formStepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto">
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Precios y Disponibilidad</h3>
                  <p className="text-sm text-gray-600">Define cuándo y a qué precio estará disponible</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price_student" className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Precio Estudiante
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <Input
                          id="price_student"
                          type="number"
                          value={formData.price_student}
                          onChange={handleInputChange('price_student')}
                          placeholder="3500"
                          min="0"
                          step="100"
                          className={`pl-8 bg-white border-2 transition-all duration-200 ${errors.price_student ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                        />
                      </div>
                      {errors.price_student && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors.price_student}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_staff" className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        Precio Funcionario
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <Input
                          id="price_staff"
                          type="number"
                          value={formData.price_staff}
                          onChange={handleInputChange('price_staff')}
                          placeholder="4500"
                          min="0"
                          step="100"
                          className={`pl-8 bg-white border-2 transition-all duration-200 ${errors.price_staff ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                        />
                      </div>
                      {errors.price_staff && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {errors.price_staff}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="available_date" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      Fecha disponible
                    </Label>
                    <Input
                      id="available_date"
                      type="date"
                      value={formData.available_date}
                      onChange={handleInputChange('available_date')}
                      className={`bg-white border-2 transition-all duration-200 ${errors.available_date ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                    />
                    {errors.available_date && (
                      <div className="flex items-center gap-1 text-red-600 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        {errors.available_date}
                      </div>
                    )}
                    {formData.day_name && (
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                        📅 Este menú estará disponible el día <strong>{formData.day_name}</strong>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Tipo de día
                    </Label>
                    <Select value={formData.day_type} onValueChange={handleSelectChange('day_type')}>
                      <SelectTrigger className="bg-white border-2 border-gray-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Día Normal
                          </div>
                        </SelectItem>
                        <SelectItem value="especial">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Día Especial
                          </div>
                        </SelectItem>
                        <SelectItem value="feriado">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Feriado
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={formStepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                    <Settings className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Configuración Final</h3>
                  <p className="text-sm text-gray-600">Ajustes adicionales y disponibilidad</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-sm font-medium">Código (opcional)</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={handleInputChange('code')}
                        placeholder="ALM001"
                        className="bg-white border-2 border-gray-200 focus:border-blue-500 font-mono"
                      />
                      <p className="text-xs text-gray-500">Código único para identificar el menú</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_orders" className="text-sm font-medium">Límite de pedidos</Label>
                      <Input
                        id="max_orders"
                        type="number"
                        value={formData.max_orders || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          max_orders: e.target.value ? parseInt(e.target.value) : null 
                        }))}
                        placeholder="50"
                        min="1"
                        className="bg-white border-2 border-gray-200 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500">Máximo número de pedidos permitidos</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="is_available"
                          checked={formData.is_available}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="is_available" className="text-sm font-medium">
                          Disponible para pedidos
                        </Label>
                      </div>
                      <Badge className={formData.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {formData.is_available ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      {formData.is_available 
                        ? 'Los usuarios podrán realizar pedidos de este menú' 
                        : 'Este menú no estará disponible para pedidos'
                      }
                    </p>
                  </div>

                  {/* Preview */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Vista previa del menú</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Nombre:</span>
                        <span className="font-medium text-blue-900">{formData.name || 'Sin nombre'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Categoría:</span>
                        <span className="font-medium text-blue-900 capitalize">{formData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Precio estudiante:</span>
                        <span className="font-medium text-blue-900">
                          {formData.price_student ? `$${formData.price_student.toLocaleString()}` : '$0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Fecha:</span>
                        <span className="font-medium text-blue-900">
                          {formData.available_date ? new Date(formData.available_date).toLocaleDateString('es-CL') : 'Sin fecha'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="bg-white border-gray-200 hover:bg-gray-50"
          >
            Anterior
          </Button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
              >
                <Check className="w-4 h-4 mr-2" />
                {isEditing ? 'Actualizar' : 'Crear'} Menú
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<MenuCategory | 'all'>('all');
  const [filterAvailable, setFilterAvailable] = useState<boolean | 'all'>('all');
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    description: '',
    category: 'almuerzo',
    price_student: 0,
    price_staff: 0,
    available_date: '',
    day_name: '',
    day_type: 'normal',
    code: '',
    is_available: true,
    max_orders: null,
  });

  const mockMenuItems: MenuItem[] = [];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setMenuItems(mockMenuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedItem) {
        setMenuItems(prev => prev.map(item => 
          item.id === selectedItem.id 
            ? { 
                ...item, 
                ...formData, 
                id: selectedItem.id,
                max_orders: formData.max_orders || undefined
              }
            : item
        ));
      } else {
        const newItem: MenuItem = {
          ...formData,
          id: Date.now().toString(),
          current_orders: 0,
          max_orders: formData.max_orders || undefined
        };
        setMenuItems(prev => [...prev, newItem]);
      }

      resetForm();
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, is_available: !currentStatus }
        : item
    ));
  };

  const duplicateItem = (item: MenuItem) => {
    setFormData({
      name: `${item.name} (Copia)`,
      description: item.description,
      category: item.category,
      price_student: item.price_student,
      price_staff: item.price_staff,
      available_date: '',
      day_name: '',
      day_type: item.day_type,
      code: '',
      is_available: true,
      max_orders: item.max_orders ?? null,
    });
    setSelectedItem(null);
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'almuerzo',
      price_student: 0,
      price_staff: 0,
      available_date: '',
      day_name: '',
      day_type: 'normal',
      code: '',
      is_available: true,
      max_orders: null,
    });
    setSelectedItem(null);
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price_student: item.price_student,
      price_staff: item.price_staff,
      available_date: item.available_date,
      day_name: item.day_name,
      day_type: item.day_type,
      code: item.code || '',
      is_available: item.is_available,
      max_orders: item.max_orders ?? null,
    });
    setIsEditDialogOpen(true);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesAvailable = filterAvailable === 'all' || item.is_available === filterAvailable;
    
    return matchesSearch && matchesCategory && matchesAvailable;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">Cargando menús</p>
            <p className="text-sm text-gray-500">Preparando las opciones gastronómicas</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <motion.div 
        className="max-w-7xl mx-auto p-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Gestión de Menús
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            Crea experiencias culinarias memorables, diseñando menús que nutren cuerpos y alimentan sueños.
          </p>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Total Menús"
            value={menuItems.length}
            icon={Utensils}
            color="neutral"
            delay={0.1}
          />
          <MetricCard
            label="Almuerzos"
            value={menuItems.filter(item => item.category === 'almuerzo').length}
            icon={ChefHat}
            color="amber"
            delay={0.15}
          />
          <MetricCard
            label="Colaciones"
            value={menuItems.filter(item => item.category === 'colacion').length}
            icon={Coffee}
            color="green"
            delay={0.2}
          />
          <MetricCard
            label="Activos"
            value={menuItems.filter(item => item.is_available).length}
            icon={CheckCircle}
            color="blue"
            delay={0.25}
          />
        </div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar menús por nombre o descripción..."
                    className="pl-10 bg-white/50 border-gray-200 focus:bg-white transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as MenuCategory | 'all')}>
                    <SelectTrigger className="w-40 bg-white/50 border-gray-200">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="almuerzo">Almuerzos</SelectItem>
                      <SelectItem value="colacion">Colaciones</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterAvailable.toString()} onValueChange={(value) => setFilterAvailable(value === 'all' ? 'all' : value === 'true')}>
                    <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Activos</SelectItem>
                      <SelectItem value="false">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={() => {
                      resetForm();
                      setIsCreateDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Menú
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <motion.div
              key="empty"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card className="bg-white/70 backdrop-blur-sm border border-gray-100">
                <CardContent className="p-12">
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-24 h-24">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                        <Utensils className="w-10 h-10 text-orange-400" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Tu lienzo culinario te espera
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                        Comienza creando menús que despierten sonrisas y nutran corazones. Cada plato es una oportunidad de crear momentos especiales.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        resetForm();
                        setIsCreateDialogOpen(true);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Menú
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="menus"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                  onToggle={toggleAvailability}
                  onDuplicate={duplicateItem}
                  delay={index * 0.05}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border border-gray-200 max-h-[90vh] overflow-y-auto">
            <MenuForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isEditing={false}
              onClose={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border border-gray-200 max-h-[90vh] overflow-y-auto">
            <MenuForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isEditing={true}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}