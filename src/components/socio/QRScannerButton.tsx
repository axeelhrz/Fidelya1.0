'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Camera, 
  X, 
  Flashlight, 
  RotateCcw, 
  Settings, 
  Eye, 
  EyeOff,
  Smartphone,
  Type,
  Zap,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useCamera } from '@/hooks/useCamera';
import { CameraDiagnostics } from './CameraDiagnostics';
import { ValidacionesService } from '@/services/validaciones.service';

interface QRScannerButtonProps {
  onScan: (qrData: string) => void;
  loading?: boolean;
}

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({ onScan, loading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleScan = (qrData: string) => {
    onScan(qrData);
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOpenModal}
        disabled={loading}
        className={`
          w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white 
          px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg
          hover:from-violet-600 hover:to-purple-700 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 flex items-center justify-center gap-3
        `}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <QrCode size={24} />
            </motion.div>
            Procesando...
          </>
        ) : (
          <>
            <QrCode size={24} />
            Escanear Código QR
          </>
        )}
      </motion.button>

      <EnhancedScannerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onScan={handleScan}
        loading={loading}
      />
    </>
  );
};

const EnhancedScannerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onScan: (qrData: string) => void;
  loading: boolean;
}> = ({ isOpen, onClose, onScan, loading }) => {
  const [scannerMode, setScannerMode] = useState<'camera' | 'manual' | 'demo'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showManualCode, setShowManualCode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    cameraState,
    retryCount,
    maxRetries,
    startCamera,
    stopCamera,
    retryCamera,
    toggleFlash,
    getErrorMessage,
  } = useCamera({
    maxRetries: 3,
    preferredFacingMode: 'environment'
  });

  // QR Code detection function - Enhanced to handle both formats
  const detectQRCode = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // In a real implementation, you would use a QR code detection library like jsQR
      // For now, we'll simulate detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Placeholder for actual QR detection
      // const code = jsQR(imageData.data, imageData.width, imageData.height);
      // if (code) {
      //   return code.data;
      // }
      
      return null;
    } catch (error) {
      console.error('Error detecting QR code:', error);
      return null;
    }
  }, []);

  // Start QR scanning when camera is ready
  useEffect(() => {
    if (cameraState.stream && videoRef.current && scannerMode === 'camera') {
      videoRef.current.srcObject = cameraState.stream;
      setIsScanning(true);

      scanIntervalRef.current = setInterval(async () => {
        const qrData = await detectQRCode();
        if (qrData) {
          setScanSuccess(true);
          setTimeout(() => {
            onScan(qrData);
          }, 500);
        }
      }, 500);
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [cameraState.stream, scannerMode, detectQRCode, onScan]);

  // Start camera when modal opens and camera mode is selected
  useEffect(() => {
    if (isOpen && scannerMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, scannerMode, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [stopCamera]);

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;

    // Validate QR format
    if (ValidacionesService.isValidQRFormat(manualCode)) {
      setScanSuccess(true);
      setTimeout(() => {
        onScan(manualCode);
      }, 500);
    } else {
      // Try to parse as web URL and convert to app format
      try {
        const url = new URL(manualCode);
        if (url.pathname === '/validar-beneficio') {
          const comercioId = url.searchParams.get('comercio');
          const beneficioId = url.searchParams.get('beneficio');
          
          if (comercioId) {
            const appQrData = ValidacionesService.generateDemoQR(comercioId, beneficioId || undefined);
            setScanSuccess(true);
            setTimeout(() => {
              onScan(appQrData);
            }, 500);
            return;
          }
        }
      } catch {
        // Not a valid URL
      }
      
      alert('Formato de QR inválido. Asegúrate de escanear un código QR válido de Fidelitá.');
    }
  };

  const handleDemoScan = () => {
    const demoQR = ValidacionesService.generateDemoQR();
    setScanSuccess(true);
    setTimeout(() => {
      onScan(demoQR);
    }, 500);
  };

  const handleFlashToggle = () => {
    setFlashEnabled(!flashEnabled);
    toggleFlash();
  };

  const resetScanner = () => {
    setScanSuccess(false);
    setIsScanning(false);
    setManualCode('');
    if (scannerMode === 'camera') {
      retryCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <QrCode size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Escanear QR</h2>
                <p className="text-sm text-gray-600">Valida tu beneficio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setScannerMode('camera')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  scannerMode === 'camera'
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Camera size={16} className="inline mr-2" />
                Cámara
              </button>
              <button
                onClick={() => setScannerMode('manual')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  scannerMode === 'manual'
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Type size={16} className="inline mr-2" />
                Manual
              </button>
              <button
                onClick={() => setScannerMode('demo')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  scannerMode === 'demo'
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Zap size={16} className="inline mr-2" />
                Demo
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {scannerMode === 'camera' && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Camera View */}
                  <div className="relative bg-black rounded-2xl overflow-hidden aspect-square max-w-sm mx-auto">
                    {cameraState.status === 'active' && (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Scanning Overlay */}
                        {isScanning && !scanSuccess && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white rounded-2xl relative">
                              <motion.div
                                animate={{ y: [0, 192, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-0.5 bg-violet-500 shadow-lg"
                              />
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                  Escaneando...
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Success Overlay */}
                        {scanSuccess && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-green-500/90 flex items-center justify-center"
                          >
                            <div className="text-center text-white">
                              <CheckCircle size={48} className="mx-auto mb-2" />
                              <p className="font-semibold">¡QR Detectado!</p>
                            </div>
                          </motion.div>
                        )}
                      </>
                    )}

                    {/* Camera Loading */}
                    {cameraState.status === 'requesting' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center text-white">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Camera size={32} className="mx-auto mb-2" />
                          </motion.div>
                          <p>Iniciando cámara...</p>
                        </div>
                      </div>
                    )}

                    {/* Camera Error */}
                    {cameraState.status === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-900">
                        <div className="text-center text-white p-4">
                          <AlertCircle size={32} className="mx-auto mb-2" />
                          <p className="font-semibold mb-2">Error de Cámara</p>
                          <p className="text-sm mb-4">{getErrorMessage()}</p>
                          <div className="space-y-2">
                            {retryCount < maxRetries && (
                              <button
                                onClick={retryCamera}
                                className="bg-white text-red-900 px-4 py-2 rounded-lg font-medium"
                              >
                                Reintentar ({retryCount + 1}/{maxRetries})
                              </button>
                            )}
                            <button
                              onClick={() => setShowDiagnostics(true)}
                              className="block w-full bg-red-800 text-white px-4 py-2 rounded-lg font-medium"
                            >
                              Diagnóstico
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  {cameraState.status === 'active' && (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleFlashToggle}
                        className={`p-3 rounded-xl transition-colors ${
                          flashEnabled
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Flashlight size={20} />
                      </button>
                      <button
                        onClick={resetScanner}
                        className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <RotateCcw size={20} />
                      </button>
                      <button
                        onClick={() => setShowDiagnostics(true)}
                        className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Settings size={20} />
                      </button>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-blue-800">
                        <p className="font-medium mb-1">Instrucciones:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Apunta la cámara al código QR del comercio</li>
                          <li>• Mantén el dispositivo estable</li>
                          <li>• Asegúrate de tener buena iluminación</li>
                          <li>• El código se detectará automáticamente</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {scannerMode === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Type size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingreso Manual</h3>
                    <p className="text-gray-600">Ingresa el código QR manualmente</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showManualCode ? 'text' : 'password'}
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="fidelya://comercio/... o https://..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowManualCode(!showManualCode)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showManualCode ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <Button
                      onClick={handleManualSubmit}
                      disabled={!manualCode.trim() || loading}
                      className="w-full"
                    >
                      {loading ? 'Validando...' : 'Validar Código'}
                    </Button>
                  </div>

                  {/* Manual Instructions */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-amber-800">
                        <p className="font-medium mb-1">¿Cómo obtener el código?</p>
                        <ul className="text-sm space-y-1">
                          <li>• Solicita al comercio que muestre su código QR</li>
                          <li>• Copia la URL que aparece debajo del código</li>
                          <li>• Pega la URL completa en el campo de arriba</li>
                          <li>• Acepta tanto URLs de aplicación como web</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {scannerMode === 'demo' && (
                <motion.div
                  key="demo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Zap size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Modo Demo</h3>
                    <p className="text-gray-600">Prueba la funcionalidad con datos de ejemplo</p>
                  </div>

                  {/* Demo QR Display */}
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <QrCode size={48} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Código QR de demostración</p>
                    <Button
                      onClick={handleDemoScan}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {loading ? 'Procesando...' : 'Usar Demo'}
                    </Button>
                  </div>

                  {/* Demo Info */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-green-800">
                        <p className="font-medium mb-1">Modo de Prueba:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Simula un escaneo exitoso</li>
                          <li>• Usa datos de comercio de ejemplo</li>
                          <li>• Perfecto para probar la funcionalidad</li>
                          <li>• No afecta datos reales</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Camera Diagnostics Modal */}
        <CameraDiagnostics
          isVisible={showDiagnostics}
          onClose={() => setShowDiagnostics(false)}
          cameraError={cameraState.error}
        />
      </div>
    </Dialog>
  );
};