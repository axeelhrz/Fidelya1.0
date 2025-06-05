"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminGuard } from "@/components/admin/AdminGuard";
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Copy
} from 'lucide-react';
import type { MenuItem, MenuCategory } from '@/lib/supabase/types';

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

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<MenuCategory | 'all'>('all');
  const [filterDate, setFilterDate] = useState('');
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
  const { toast } = useToast();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('available_date', { ascending: true });

      if (error) throw error;

      setMenuItems(data || []);
    } catch (error: unknown) {
      console.error('Error loading menu items:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar menús",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedItem) {
        // Actualizar item existente
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', selectedItem.id);

        if (error) throw error;

        toast({
          title: "Menú actualizado",
          description: "El elemento del menú ha sido actualizado exitosamente.",
        });
      } else {
        // Crear nuevo item
        const { error } = await supabase
          .from('menu_items')
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Menú creado",
          description: "El nuevo elemento del menú ha sido creado exitosamente.",
        });
      }

      await loadMenuItems();
      resetForm();
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error: unknown) {
      console.error('Error saving menu item:', error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Menú eliminado",
        description: "El elemento del menú ha sido eliminado exitosamente.",
      });

      await loadMenuItems();
    } catch (error: unknown) {
      console.error('Error deleting menu item:', error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Menú desactivado" : "Menú activado",
        description: `El elemento ha sido ${currentStatus ? 'desactivado' : 'activado'} exitosamente.`,
      });

      await loadMenuItems();
    } catch (error: unknown) {
      console.error('Error toggling availability:', error);
      toast({
        variant: "destructive",
        title: "Error al cambiar estado",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
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
      max_orders: item.max_orders,
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
      max_orders: item.max_orders,
    });
    setIsEditDialogOpen(true);
  };

  const generateWeekMenu = async () => {
    try {
      const startDate = new Date();
      const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      const almuerzoOptions = [
        'Pollo al horno con papas',
        'Pescado a la plancha con arroz',
        'Carne mechada con puré',
        'Lasaña de verduras',
        'Cazuela de pollo'
      ];
      const colacionOptions = [
        'Sándwich de palta y tomate',
        'Yogurt con frutas',
        'Galletas con leche',
        'Fruta de estación',
        'Queque casero'
      ];

      const menuItems = [];

      for (let i = 0; i < 5; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        // Almuerzo
        menuItems.push({
          name: almuerzoOptions[i],
          description: 'Almuerzo nutritivo y balanceado',
          category: 'almuerzo' as MenuCategory,
          price_student: 3500,
          price_staff: 4500,
          available_date: dateString,
          day_name: weekDays[i],
          day_type: 'normal',
          is_available: true,
          max_orders: 50,
        });

        // Colación
        menuItems.push({
          name: colacionOptions[i],
          description: 'Colación saludable para media mañana',
          category: 'colacion' as MenuCategory,
          price_student: 2000,
          price_staff: 2500,
          available_date: dateString,
          day_name: weekDays[i],
          day_type: 'normal',
          is_available: true,
          max_orders: 30,
        });
      }

      const { error } = await supabase
        .from('menu_items')
        .insert(menuItems);

      if (error) throw error;

      toast({
        title: "Menú semanal generado",
        description: "Se ha creado el menú para la próxima semana exitosamente.",
      });

      await loadMenuItems();
    } catch (error: unknown) {
      console.error('Error generating week menu:', error);
      toast({
        variant: "destructive",
        title: "Error al generar menú",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesDate = !filterDate || item.available_date === filterDate;
    const matchesAvailable = filterAvailable === 'all' || item.is_available === filterAvailable;
    
    return matchesSearch && matchesCategory && matchesDate && matchesAvailable;
  });

  const getCategoryIcon = (category: MenuCategory) => {
    return category === 'almuerzo' ? <ChefHat className="w-4 h-4" /> : <Coffee className="w-4 h-4" />;
  };

  const getCategoryColor = (category: MenuCategory) => {
    return category === 'almuerzo' 
      ? 'bg-orange-100 text-orange-800 border-orange-200'
      : 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <AdminGuard requiredPermission="menu.read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Menús</h1>
            <p className="text-gray-600 mt-1">
              Administra los menús diarios de almuerzos y colaciones
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {menuItems.length} elementos
            </Badge>
            <Button onClick={generateWeekMenu} variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Generar Semana
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Menú
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Menú</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo elemento al menú del casino
                  </DialogDescription>
                </DialogHeader>
                <MenuForm 
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  isEditing={false}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as MenuCategory | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value="almuerzo">Almuerzo</SelectItem>
                    <SelectItem value="colacion">Colación</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Disponibilidad</Label>
                <Select value={filterAvailable.toString()} onValueChange={(value) => setFilterAvailable(value === 'all' ? 'all' : value === 'true')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Disponibles</SelectItem>
                    <SelectItem value="false">No disponibles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Menús */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    !item.is_available ? 'opacity-60' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {item.is_available ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getCategoryColor(item.category)} flex items-center gap-1`}>
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(item.available_date).toLocaleDateString('es-CL')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Estudiante:</span>
                            <p className="font-medium">${item.price_student.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Funcionario:</span>
                            <p className="font-medium">${item.price_staff.toLocaleString()}</p>
                          </div>
                        </div>

                        {item.max_orders && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Límite:</span>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{item.current_orders}/{item.max_orders}</span>
                            </div>
                          </div>
                        )}

                        {item.day_name && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Día:</span>
                            <span className="font-medium">{item.day_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateItem(item)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>

                        <Button
                          variant={item.is_available ? "destructive" : "default"}
                          size="sm"
                          onClick={() => toggleAvailability(item.id, item.is_available)}
                        >
                          {item.is_available ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente
                                el elemento &quot;{item.name}&quot; del menú.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron elementos del menú
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar los filtros de búsqueda o crea un nuevo elemento
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Menú
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dialog de Edición */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Menú</DialogTitle>
              <DialogDescription>
                Modifica los detalles del elemento del menú
              </DialogDescription>
            </DialogHeader>
            <MenuForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}

// Componente del formulario de menú
function MenuForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  isEditing 
}: {
  formData: MenuFormData;
  setFormData: React.Dispatch<React.SetStateAction<MenuFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}) {
  const handleInputChange = (field: keyof MenuFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof MenuFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof MenuFormData) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  // Generar día de la semana automáticamente cuando se selecciona una fecha
  useEffect(() => {
    if (formData.available_date) {
      const date = new Date(formData.available_date);
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      setFormData(prev => ({ ...prev, day_name: dayNames[date.getDay()] }));
    }
  }, [formData.available_date, setFormData]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Menú</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Ej: Pollo al horno con papas"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder="Descripción detallada del menú"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={formData.category} onValueChange={handleSelectChange('category')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="almuerzo">Almuerzo</SelectItem>
                <SelectItem value="colacion">Colación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Día</Label>
            <Select value={formData.day_type} onValueChange={handleSelectChange('day_type')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="especial">Especial</SelectItem>
                <SelectItem value="feriado">Feriado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_student">Precio Estudiante</Label>
            <Input
              id="price_student"
              type="number"
              value={formData.price_student}
              onChange={handleInputChange('price_student')}
              placeholder="3500"
              min="0"
              step="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price_staff">Precio Funcionario</Label>
            <Input
              id="price_staff"
              type="number"
              value={formData.price_staff}
              onChange={handleInputChange('price_staff')}
              placeholder="4500"
              min="0"
              step="100"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_date">Fecha Disponible</Label>
          <Input
            id="available_date"
            type="date"
            value={formData.available_date}
            onChange={handleInputChange('available_date')}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código (Opcional)</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={handleInputChange('code')}
              placeholder="ALM001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_orders">Límite de Pedidos</Label>
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
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_available"
            checked={formData.is_available}
            onChange={(e) => handleCheckboxChange('is_available')(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="is_available">Disponible para pedidos</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {isEditing ? 'Actualizar' : 'Crear'} Menú
        </Button>
      </div>
    </form>
  );
}