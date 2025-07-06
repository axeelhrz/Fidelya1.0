'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Camera, 
  X, 
  AlertCircle, 
  Zap, 
  Scan,
  RefreshCw,
  Flashlight,
  FlashlightOff,
  RotateCcw,
  Info,
  Settings,
  Smartphone,
  Monitor,
  CheckCircle,
  Copy,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { useCamera } from '@/hooks/useCamera';
import { CameraDiagnostics } from './CameraDiagnostics';

interface QRScannerButtonProps {
  onScan: (qrData: string) => void;
  loading?: boolean;
}

// Enhanced Scanner Modal Component
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

  // QR Code detection function (simplified - in production use a proper QR library)
  const detectQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context || video.videoWidth === 0 || video.videoHeight === 0) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // In a real implementation, you would use a QR code detection library here
    // For demo purposes, we'll simulate QR detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simulate QR detection (replace with actual QR library)
    // This is just for demonstration - use jsQR or similar library in production
    return null;
  }, []);

  // Start QR scanning
  const startQRScanning = useCallback(() => {
    if (scanIntervalRef.current) return;
    
    setIsScanning(true);
    scanIntervalRef.current = setInterval(() => {
      const qrData = detectQRCode();
      if (qrData) {
        setIsScanning(false);
        setScanSuccess(true);
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }
        setTimeout(() => {
          onScan(qrData);
          onClose();
          setScanSuccess(false);
        }, 1000);
      }
    }, 100);
  }, [detectQRCode, onScan, onClose]);

  // Stop QR scanning
  const stopQRScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen && scannerMode === 'camera') {
      handleStartCamera();
    }
    return () => {
      if (isOpen) {
        stopCamera();
        stopQRScanning();
      }
    };
  }, [isOpen, scannerMode]);

  const handleStartCamera = useCallback(async () => {
    const stream = await startCamera();
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      try {
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;
          const timeout = setTimeout(() => {
            reject(new Error('Timeout esperando que el video se cargue'));
          }, 10000);

          video.onloadedmetadata = () => {
            clearTimeout(timeout);
            video.play().then(() => {
              startQRScanning();
              resolve();
            }).catch(reject);
          };

          video.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Error cargando el video'));
          };
        });
      } catch (error) {
        console.error('Error setting up video element:', error);
      }
    }
  }, [startCamera, startQRScanning]);

  const handleRetryCamera = useCallback(async () => {
    stopQRScanning();
    const stream = await retryCamera();
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      startQRScanning();
    }
  }, [retryCamera, startQRScanning, stopQRScanning]);

  const handleToggleFlash = useCallback(async () => {
    const newFlashState = await toggleFlash(!flashEnabled);
    setFlashEnabled(newFlashState);
  }, [toggleFlash, flashEnabled]);

  const handleManualSubmit = useCallback(() => {
    if (manualCode.trim()) {
      setScanSuccess(true);
      setTimeout(() => {
        onScan(manualCode.trim());
        onClose();
        setScanSuccess(false);
        setManualCode('');
      }, 1000);
    }
  }, [manualCode, onScan, onClose]);

  const handleDemoScan = useCallback(() => {
    const mockQRData = 'fidelya://comercio/comercio123?beneficio=beneficio456&t=' + Date.now();
    setScanSuccess(true);
    setTimeout(() => {
      onScan(mockQRData);
      onClose();
      setScanSuccess(false);
    }, 1000);
  }, [onScan, onClose]);

  const handleModeChange = (mode: 'camera' | 'manual' | 'demo') => {
    stopQRScanning();
    setScannerMode(mode);
    if (mode === 'camera') {
      handleStartCamera();
    } else {
      stopCamera();
    }
  };

  const renderCameraMode = () => (
    <div className="relative bg-black rounded-2xl overflow-hidden aspect-square">
      {/* Hidden canvas for QR detection */}
      <canvas ref={canvasRef} className="hidden" />
      
      {cameraState.isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <RefreshCw size={24} className="animate-spin" />
          </div>
          <p className="text-lg font-semibold mb-2">Iniciando cámara...</p>
          <p className="text-sm opacity-80">
            {cameraState.deviceInfo.isMobile ? 'Configurando cámara trasera' : 'Configurando cámara'}
          </p>
        </div>
      )}

      {cameraState.hasPermission === false && cameraState.error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-10 p-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error de Cámara</h3>
          <p className="text-center mb-6 opacity-90">
            {getErrorMessage(cameraState.error)}
          </p>
          <div className="flex gap-3">
            {retryCount < maxRetries && (
              <Button
                variant="outline"
                onClick={handleRetryCamera}
                leftIcon={<RefreshCw size={16} />}
                className="bg-white text-gray-900"
                size="sm"
              >
                Reintentar ({retryCount + 1}/{maxRetries})
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              leftIcon={<Settings size={16} />}
              className="bg-white text-gray-900"
              size="sm"
            >
              Diagnóstico
            </Button>
          </div>
        </div>
      )}

      {cameraState.hasPermission && !cameraState.isLoading && cameraState.stream && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Scanner Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-64 h-64 border-2 border-white/80 rounded-2xl"
            >
              {/* Corner Indicators */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-violet-500 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-violet-500 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-violet-500 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-violet-500 rounded-br-xl" />
              
              {/* Scanning Line */}
              {isScanning && (
                <motion.div
                  animate={{ y: [0, 256, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent shadow-lg"
                  style={{ boxShadow: '0 0 20px #8b5cf6' }}
                />
              )}

              {/* Success indicator */}
              {scanSuccess && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl"
                >
                  <CheckCircle size={48} className="text-green-500" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white">
            <motion.p
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg font-semibold mb-2 drop-shadow-lg"
            >
              {isScanning ? 'Escaneando...' : 'Apunta la cámara al código QR'}
            </motion.p>
            <p className="text-sm opacity-90 drop-shadow-lg">
              Mantén el código dentro del marco
            </p>
          </div>
        </>
      )}
    </div>
  );

  const renderManualMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Smartphone size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ingreso Manual</h3>
        <p className="text-gray-600">
          Ingresa el código QR proporcionado por el comercio
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código QR
          </label>
          <div className="relative">
            <input
              type={showManualCode ? "text" : "password"}
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Ej: fidelya://comercio/abc123?beneficio=xyz789"
              className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowManualCode(!showManualCode)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showManualCode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {manualCode && (
                <button
                  onClick={() => setManualCode('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleManualSubmit}
          disabled={!manualCode.trim() || loading}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
          size="lg"
          leftIcon={scanSuccess ? <CheckCircle size={20} /> : <Scan size={20} />}
        >
          {scanSuccess ? 'Código Validado' : loading ? 'Validando...' : 'Validar Código'}
        </Button>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">
                ¿Cómo obtener el código?
              </p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Solicita al comercio que muestre su código QR</li>
                <li>• Pide el código de validación manual</li>
                <li>• Verifica que el código sea válido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemoMode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Modo Demo</h3>
        <p className="text-gray-600">
          Prueba la funcionalidad con datos de ejemplo
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="w-32 h-32 bg-white rounded-xl border-2 border-emerald-300 flex items-center justify-center mx-auto">
            <QrCode size={48} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-2">Código QR Demo</h4>
            <p className="text-sm text-emerald-700 mb-4">
              Este es un código de ejemplo para probar la funcionalidad
            </p>
            <div className="bg-white rounded-lg p-3 border border-emerald-200">
              <code className="text-xs text-emerald-800 break-all">
                fidelya://comercio/demo123?beneficio=demo456
              </code>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDemoScan}
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        size="lg"
        leftIcon={scanSuccess ? <CheckCircle size={20} /> : <Zap size={20} />}
      >
        {scanSuccess ? 'Demo Ejecutado' : loading ? 'Procesando...' : 'Probar Demo'}
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">
              Acerca del modo demo
            </p>
            <p className="text-xs text-blue-700">
              Este modo simula un escaneo exitoso con datos de prueba. 
              Úsalo para familiarizarte con el proceso de validación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose}>
          <DialogContent className="max-w-lg p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Scan size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Escanear QR</h2>
                      <p className="text-sm text-gray-600">Validar beneficio</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-white rounded-xl p-1 mt-4">
                  {[
                    { id: 'camera', label: 'Cámara', icon: <Camera size={16} /> },
                    { id: 'manual', label: 'Manual', icon: <Smartphone size={16} /> },
                    { id: 'demo', label: 'Demo', icon: <Zap size={16} /> }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleModeChange(mode.id as any)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200
                        ${scannerMode === mode.id 
                          ? 'bg-violet-500 text-white shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {mode.icon}
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {scannerMode === 'camera' && renderCameraMode()}
                {scannerMode === 'manual' && renderManualMode()}
                {scannerMode === 'demo' && renderDemoMode()}
              </div>

              {/* Camera Controls */}
              {scannerMode === 'camera' && cameraState.hasPermission && cameraState.stream && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToggleFlash}
                        leftIcon={flashEnabled ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
                        disabled={!('torch' in (cameraState.deviceInfo.supportedConstraints ?? {}))}
                      >
                        {flashEnabled ? 'Apagar' : 'Flash'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetryCamera}
                        leftIcon={<RotateCcw size={16} />}
                      >
                        Reiniciar
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDiagnostics(!showDiagnostics)}
                      leftIcon={<Settings size={16} />}
                    >
                      Diagnóstico
                    </Button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <Info size={12} />
                      Solicita al comercio que muestre su código QR oficial
                    </p>
                  </div>
                </div>
              )}

              {/* Diagnostics */}
              <CameraDiagnostics
                isVisible={showDiagnostics}
                onClose={() => setShowDiagnostics(false)}
                cameraError={cameraState.error}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({
  onScan,
  loading = false
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleOpenScanner = useCallback(() => {
    setScannerOpen(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setScannerOpen(false);
  }, []);

  const handleScan = useCallback((qrData: string) => {
    onScan(qrData);
    setScannerOpen(false);
  }, [onScan]);

  return (
    <>
      <motion.button
        onClick={handleOpenScanner}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full h-20 bg-gradient-to-r from-violet-500 to-purple-600 
          hover:from-violet-600 hover:to-purple-700 
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-bold text-lg rounded-2xl 
          flex items-center justify-center gap-3
          shadow-lg hover:shadow-xl transition-all duration-300
          relative overflow-hidden group
        `}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            {loading ? <RefreshCw size={24} /> : <QrCode size={24} />}
          </motion.div>
          <span>{loading ? 'Procesando...' : 'Escanear Código QR'}</span>
        </div>

        {/* Pulse Effect */}
        {!loading && (
          <div className="absolute inset-0 rounded-2xl bg-violet-400 opacity-0 group-hover:opacity-20 animate-pulse" />
        )}
      </motion.button>

      <EnhancedScannerModal
        isOpen={scannerOpen}
        onClose={handleCloseScanner}
        onScan={handleScan}
        loading={loading}
      />
    </>
  );
};