"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Construction, Clock, ArrowRight } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
        
        <CardHeader className="text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
            <Construction className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Función en Desarrollo</CardTitle>
          <CardDescription className="text-base mt-2">
            Estamos trabajando para ofrecerte la mejor experiencia al reagendar tus pedidos
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="bg-blue-50 p-6 rounded-lg mt-4">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2 text-blue-700">
              <CalendarClock className="h-5 w-5" />
              Próximamente podrás:
            </h3>
            
            <ul className="space-y-3 pl-8 text-gray-700">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                <span>Reagendar tus pedidos de almuerzo y colación para otras fechas</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                <span>Cambiar opciones de menú de forma rápida y sencilla</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                <span>Gestionar múltiples pedidos a la vez</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Clock className="h-5 w-5" />
              <h4 className="font-medium">¿Cuándo estará disponible?</h4>
            </div>
            <p className="text-sm text-amber-700">
              Estamos trabajando para tener esta funcionalidad lista muy pronto. Mientras tanto, puedes realizar nuevos pedidos desde la sección "Nuevo Pedido".
            </p>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            Gracias por tu paciencia mientras mejoramos el sistema de pedidos del casino.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
