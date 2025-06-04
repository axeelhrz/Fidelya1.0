"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PdfUploader from "./components/pdf-uploader";
import MenuPreview, { MenuOption } from "./components/menu-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MenuPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [menuItems, setMenuItems] = useState<MenuOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setError(null);
    processFile(file);
  };

  const processFile = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/admin/process-menu-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error procesando el PDF');
      }

      setMenuItems(data.menuItems || []);
      toast({
        title: "PDF procesado correctamente",
        description: `Se detectaron ${data.menuItems.length} opciones de menú.`,
      });
    } catch (err: any) {
      console.error('Error procesando PDF:', err);
      setError(err.message || 'Error procesando el archivo');
      toast({
        variant: "destructive",
        title: "Error al procesar el PDF",
        description: err.message || "No se pudo procesar el archivo. Verifica el formato.",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMenuToDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/process-menu-pdf', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ menuItems })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error guardando el menú');
      }

      toast({
        title: "Menú guardado correctamente",
        description: `Se guardaron ${menuItems.length} opciones en la base de datos.`,
      });

      // Opcional: limpiar el estado después de guardar
      // setUploadedFile(null);
      // setMenuItems([]);
    } catch (err: any) {
      console.error('Error guardando menú:', err);
      toast({
        variant: "destructive",
        title: "Error al guardar el menú",
        description: err.message || "No se pudo guardar el menú en la base de datos.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Gestión de Menús</h1>
          <p className="text-gray-600">Sube minutas en PDF y actualiza los almuerzos del casino</p>
        </div>
      </div>
      
      <Tabs defaultValue="almuerzos" className="w-full">
        <TabsList>
          <TabsTrigger value="almuerzos">Almuerzos</TabsTrigger>
          <TabsTrigger value="colaciones">Colaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="almuerzos" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subir Minuta de Almuerzos</CardTitle>
              <CardDescription>
                Sube un PDF con el formato de minuta semanal para procesar automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PdfUploader onFileUpload={handleFileUpload} />
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {menuItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
                <CardDescription>
                  Revisa los datos extraídos antes de guardarlos en la base de datos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuPreview 
                  options={menuItems} 
                  onSave={saveMenuToDatabase} 
                  isLoading={loading} 
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Instrucciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Formato del PDF:</h4>
                  <p className="text-gray-600">El PDF debe seguir el formato de minuta como el ejemplo mostrado. Debe contener:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    <li>Encabezado con el mes y año</li>
                    <li>Días de la semana con sus fechas</li>
                    <li>Opciones de menú numeradas (OPCIÓN 1, OPCIÓN 2, etc.)</li>
                    <li>Descripción de cada opción para cada día</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Proceso:</h4>
                  <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                    <li>Sube el PDF con la minuta semanal</li>
                    <li>Revisa los datos extraídos en la vista previa</li>
                    <li>Confirma y guarda en la base de datos</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colaciones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Colaciones</CardTitle>
              <CardDescription>
                Esta funcionalidad estará disponible próximamente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">En desarrollo</h3>
                <p className="text-gray-500 max-w-md">
                  La gestión de colaciones a través de PDF estará disponible en una próxima versión.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
