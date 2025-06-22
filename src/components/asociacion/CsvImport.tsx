'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import Papa from 'papaparse';
import { SocioFormData } from '@/types/socio';
import { csvSocioSchema } from '@/lib/validations/socio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface CsvImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (socios: SocioFormData[]) => Promise<void>;
  loading?: boolean;
}

interface ParsedSocio extends SocioFormData {
  _index: number;
  _errors?: string[];
}

export const CsvImport: React.FC<CsvImportProps> = ({
  open,
  onClose,
  onImport,
  loading = false
}) => {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [parsedData, setParsedData] = useState<ParsedSocio[]>([]);
  const [validData, setValidData] = useState<SocioFormData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      ['nombre', 'email', 'estado', 'telefono', 'dni'],
      ['Juan Pérez', 'juan@email.com', 'activo', '123456789', '12345678'],
      ['María García', 'maria@email.com', 'vencido', '987654321', '87654321']
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_socios.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed: ParsedSocio[] = [];
        const validSocios: SocioFormData[] = [];
        const parseErrors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          try {
            const validated = csvSocioSchema.parse(row);
            const socio: ParsedSocio = {
              ...validated,
              _index: index + 1
            };
            parsed.push(socio);
            validSocios.push(validated);
          } catch (error: any) {
            const socio: ParsedSocio = {
              nombre: row.nombre || '',
              email: row.email || '',
              estado: row.estado || 'activo',
              telefono: row.telefono || '',
              dni: row.dni || '',
              _index: index + 1,
              _errors: error.errors?.map((e: any) => e.message) || ['Error de validación']
            };
            parsed.push(socio);
            parseErrors.push(`Fila ${index + 1}: ${error.errors?.map((e: any) => e.message).join(', ')}`);
          }
        });

        setParsedData(parsed);
        setValidData(validSocios);
        setErrors(parseErrors);
        setStep('preview');
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setErrors(['Error al procesar el archivo CSV']);
      }
    });
  };

  const handleImport = async () => {
    if (validData.length === 0) return;

    try {
      await onImport(validData);
      handleClose();
    } catch (error) {
      console.error('Error importing socios:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setStep('upload');
      setParsedData([]);
      setValidData([]);
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-4xl">
      <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Socios desde CSV</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Upload size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sube tu archivo CSV
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Selecciona un archivo CSV con la información de los socios
                  </p>

                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<FileText size={16} />}
                      size="lg"
                    >
                      Seleccionar Archivo CSV
                    </Button>

                    <div className="text-sm text-gray-500">
                      <p>¿No tienes un archivo CSV? 
                        <button
                          onClick={downloadTemplate}
                          className="text-indigo-600 hover:text-indigo-700 ml-1 underline"
                        >
                          Descarga la plantilla
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Formato requerido:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>nombre:</strong> Nombre completo (requerido)</li>
                    <li>• <strong>email:</strong> Dirección de email (requerido)</li>
                    <li>• <strong>estado:</strong> activo o vencido (opcional, por defecto: activo)</li>
                    <li>• <strong>telefono:</strong> Número de teléfono (opcional)</li>
                    <li>• <strong>dni:</strong> Documento de identidad (opcional)</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Vista previa de importación
                    </h3>
                    <p className="text-sm text-gray-600">
                      {validData.length} socios válidos, {errors.length} errores encontrados
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setStep('upload')}
                    leftIcon={<X size={16} />}
                  >
                    Cambiar archivo
                  </Button>
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} className="text-red-600" />
                      <h4 className="font-medium text-red-900">Errores encontrados:</h4>
                    </div>
                    <ul className="text-sm text-red-800 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validData.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <h4 className="font-medium text-green-900">
                        {validData.length} socios listos para importar
                      </h4>
                    </div>
                  </div>
                )}

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-900">Fila</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-900">Nombre</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-900">Email</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-900">Estado</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-900">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedData.map((socio) => (
                          <tr key={socio._index} className={socio._errors ? 'bg-red-50' : 'bg-white'}>
                            <td className="px-4 py-2">{socio._index}</td>
                            <td className="px-4 py-2">{socio.nombre}</td>
                            <td className="px-4 py-2">{socio.email}</td>
                            <td className="px-4 py-2">{socio.estado}</td>
                            <td className="px-4 py-2">
                              {socio._errors ? (
                                <div className="flex items-center gap-1 text-red-600">
                                  <AlertCircle size={14} />
                                  <span className="text-xs">Error</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle size={14} />
                                  <span className="text-xs">Válido</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          {step === 'upload' && (
            <Button
              onClick={downloadTemplate}
              leftIcon={<Download size={16} />}
              variant="outline"
            >
              Descargar Plantilla
            </Button>
          )}
          {step === 'preview' && validData.length > 0 && (
            <Button
              onClick={handleImport}
              loading={loading}
              disabled={loading || validData.length === 0}
              leftIcon={<Upload size={16} />}
            >
              Importar {validData.length} Socios
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
