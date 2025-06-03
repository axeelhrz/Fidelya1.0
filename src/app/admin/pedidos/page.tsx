"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PedidosPorNivel from "./components/pedidos-por-nivel";
import PedidosDetalle from "./components/pedidos-detalle";

export default function PedidosPage() {
  const [activeTab, setActiveTab] = useState<string>("resumen");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Administración de Pedidos</h1>
      
      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="resumen">Resumen por Nivel</TabsTrigger>
          <TabsTrigger value="detalle">Detalle por Estudiante</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="resumen" className="mt-0">
            <PedidosPorNivel />
          </TabsContent>
          
          <TabsContent value="detalle" className="mt-0">
            <PedidosDetalle />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
