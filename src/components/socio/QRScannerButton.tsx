'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

interface QRScannerButtonProps {
  onScan: (qrData: string) => void;
  loading?: boolean;
}

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({
  onScan,
  loading = false
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Usar cámara trasera en móviles
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleOpenScanner = () => {
    setScannerOpen(true);
    startCamera();
  };

  const handleCloseScanner = () => {
    setScannerOpen(false);
    stopCamera();
    setError(null);
    setHasPermission(null);
  };

  // Simulación de escaneo QR (en producción usarías una librería como jsQR)
  const handleManualInput = () => {
    const mockQRData = 'fidelita://comercio/comercio123?beneficio=beneficio456&t=' + Date.now();
    onScan(mockQRData);
    handleCloseScanner();
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleOpenScanner}
          loading={loading}
          size="lg"
          className="w-full h-20 text-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          leftIcon={<QrCode size={24} />}
        >
          Escanear Código QR
        </Button>
      </motion.div>

      <Dialog open={scannerOpen} onClose={handleCloseScanner}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                  <QrCode size={16} className="text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Escanear QR</h3>
              </div>
              <button
                onClick={handleCloseScanner}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scanner Area */}
            <div className="relative bg-black aspect-square">
              {hasPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Iniciando cámara...</p>
                  </div>
                </div>
              )}

              {hasPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                    <p className="mb-4">No se pudo acceder a la cámara</p>
                    <Button
                      variant="outline"
                      onClick={startCamera}
                      className="bg-white text-gray-900"
                    >
                      Intentar de nuevo
                    </Button>
                  </div>
                </div>
              )}

              {hasPermission && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay de escaneo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
                        {/* Esquinas del marco */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-400 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-400 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-400 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-400 rounded-br-lg"></div>
                        
                        {/* Línea de escaneo animada */}
                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-violet-400 shadow-lg"
                          animate={{ y: [0, 256, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      
                      <p className="text-white text-center mt-4 text-sm">
                        Apunta la cámara al código QR
                      </p>
                    </div>
                  </div>
                </>
              )}

              {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseScanner}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleManualInput}
                  className="flex-1"
                >
                  Probar Demo
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Solicita al comercio que muestre su código QR
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
