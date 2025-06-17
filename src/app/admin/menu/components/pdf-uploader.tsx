"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function PdfUploader({ onFileUpload }: { onFileUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        onFileUpload(droppedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Tipo de archivo no válido",
          description: "Por favor sube un archivo PDF",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        onFileUpload(selectedFile);
      } else {
        toast({
          variant: "destructive",
          title: "Tipo de archivo no válido",
          description: "Por favor sube un archivo PDF",
        });
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragging ? "border-primary bg-primary/5" : "border-gray-300"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">
                {file ? (
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {file.name}
                  </span>
                ) : (
                  "Arrastra y suelta un PDF aquí"
                )}
              </p>
              <p className="text-sm text-gray-500">O haz clic para seleccionar</p>
            </div>
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="pdf-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Seleccionar PDF</span>
              </Button>
            </label>
            
            {file && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>PDF listo para procesar</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
