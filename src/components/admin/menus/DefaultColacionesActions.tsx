"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Coffee, 
  Calendar, 
  CalendarDays, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AdminMenuService } from '@/services/adminMenuService'
import { DefaultColacionesService } from '@/services/defaultColacionesService'
import { DefaultColacionesManager } from './DefaultColacionesManager'
import { ColacionesDiagnostic } from './ColacionesDiagnostic'
import { BulkColacionesDelete } from './BulkColacionesDelete'
import { useToast } from '@/hooks/use-toast'

interface DefaultColacion {
  code: string
  description: string
  price: number
  active: boolean
}

interface DefaultColacionesActionsProps {
  weekStart: string
  onMenuUpdated: () => void
}

export function DefaultColacionesActions({ 
  weekStart, 
  onMenuUpdated 
}: DefaultColacionesActionsProps) {
  const [isCreatingWeek, setIsCreatingWeek] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [defaultColaciones, setDefaultColaciones] = useState<DefaultColacion[]>([])
  const [isLoadingColaciones, setIsLoadingColaciones] = useState(false)
  const { toast } = useToast()

  // Cargar colaciones predeterminadas
  const loadDefaultColaciones = async () => {
    setIsLoadingColaciones(true)
    try {
      const colaciones = await DefaultColacionesService.getDefaultColaciones()
      setDefaultColaciones(colaciones.filter(c => c.active && c.description).map(c => ({
        ...c,
        description: c.description!
      })))
    } catch (error) {
      console.error('Error loading default colaciones:', error)
    } finally {
      setIsLoadingColaciones(false)
    }
  }

  const handleCreateWeekColaciones = async () => {
    setIsCreatingWeek(true)
    try {
      console.log('🔄 Creating default colaciones for week:', weekStart)
      
      const result = await AdminMenuService.createDefaultColacionesWeek(weekStart)
      
      if (result.success) {
        toast({
          title: "Colaciones creadas",
          description: result.message,
        })
        onMenuUpdated()
        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating default colaciones:', error)
      toast({
        title: "Error",
        description: "Error al crear las colaciones predeterminadas",
        variant: "destructive",
      })
    } finally {
      setIsCreatingWeek(false)
    }
  }

  // Cargar colaciones al abrir el diálogo
  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      loadDefaultColaciones()
    }
  }

  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        {/* Gestor de colaciones predeterminadas */}
        <DefaultColacionesManager 
          onConfigUpdated={() => {
            // Recargar colaciones cuando se actualice la configuración
            loadDefaultColaciones()
          }}
        />

        {/* Componente de diagnóstico */}
        <ColacionesDiagnostic 
          weekStart={weekStart}
          onDiagnosticComplete={onMenuUpdated}
        />

        {/* NUEVO: Componente de eliminación masiva */}
        <BulkColacionesDelete 
          weekStart={weekStart}
          onMenuUpdated={onMenuUpdated}
        />

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-200 text-emerald-700"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Aplicar Colaciones Predeterminadas</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Coffee className="w-5 h-5" />
                <span>Menú de Colaciones Predeterminado</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Información del menú */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Este menú se aplicará automáticamente de <strong>lunes a viernes</strong> para la semana seleccionada. 
                  Cada colación tendrá su precio personalizado y será <strong>publicada automáticamente</strong> para que aparezca en los pedidos.
                </AlertDescription>
              </Alert>

              {/* Vista previa de las colaciones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    Colaciones que se crearán:
                  </h4>
                  {isLoadingColaciones && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
                
                {defaultColaciones.length > 0 ? (
                  <div className="grid gap-3">
                    {defaultColaciones.map((colacion, index) => (
                      <motion.div
                        key={colacion.code}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="font-mono">
                            {colacion.code}
                          </Badge>
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-white">
                              {colacion.description}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              Se publicará automáticamente
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 dark:text-green-400">
                            ${colacion.price.toLocaleString('es-CL')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Coffee className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      No hay colaciones predeterminadas activas
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Configura las colaciones predeterminadas primero
                    </p>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              {defaultColaciones.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                          Después de crear el menú:
                        </h4>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                          <li>• Las colaciones estarán disponibles inmediatamente en los pedidos</li>
                          <li>• Podrás editar precios y descripciones individualmente</li>
                          <li>• Activar o desactivar colaciones específicas</li>
                          <li>• Eliminar colaciones que no necesites</li>
                          <li>• Agregar nuevas colaciones personalizadas</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreatingWeek}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateWeekColaciones}
                  disabled={isCreatingWeek || defaultColaciones.length === 0}
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {isCreatingWeek ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creando y Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Crear y Publicar Menú</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Información sobre las colaciones predeterminadas */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2 text-emerald-800 dark:text-emerald-200">
            <Coffee className="w-4 h-4" />
            <span>Menú de Colaciones Predeterminado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
            Aplica automáticamente un menú completo de colaciones con precios personalizados para toda la semana (lunes a viernes).
            Las colaciones se publican automáticamente y aparecen inmediatamente en los pedidos.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-white/50">
              {defaultColaciones.length} colaciones activas
            </Badge>
            {defaultColaciones.length > 0 && (
              <>
                <Badge variant="outline" className="text-xs bg-white/50">
                  Precios desde ${Math.min(...defaultColaciones.map(c => c.price)).toLocaleString('es-CL')}
                </Badge>
                <Badge variant="outline" className="text-xs bg-white/50">
                  Lunes a Viernes
                </Badge>
                <Badge variant="outline" className="text-xs bg-white/50">
                  Publicación automática
                </Badge>
                <Badge variant="outline" className="text-xs bg-white/50">
                  Totalmente editable
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}