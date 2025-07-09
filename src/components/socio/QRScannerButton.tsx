import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  Zap, 
  AlertCircle, 
  RefreshCw,
  Flashlight,
  FlashlightOff,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QRScannerButtonProps {
  onScan: (qrData: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({ 
  onScan, 
  loading = false,
  disabled = false 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scannerRef = useRef<import('@zxing/library').BrowserQRCodeReader | null>(null);

  // Initialize QR scanner when component mounts
  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Dynamically import QR scanner library
        const { BrowserQRCodeReader } = await import('@zxing/library');
        scannerRef.current = new BrowserQRCodeReader();
      } catch (error) {
        console.error('Failed to initialize QR scanner:', error);
        setError('Error al inicializar el escáner');
      }
    };

    initializeScanner();

    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Test if we can access the camera
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setError('Se requiere acceso a la cámara para escanear códigos QR');
      return false;
    }
  };

  const startScanning = async () => {
    if (!scannerRef.current) {
      setError('Escáner no inicializado');
      return;
    }

    try {
      setError(null);
      setIsScanning(true);

      // Request camera permission
      const hasAccess = await requestCameraPermission();
      if (!hasAccess) return;

      // Get video element
      const videoElement = videoRef.current;
      if (!videoElement) {
        throw new Error('Elemento de video no encontrado');
      }

      // Start scanning
      const result = await scannerRef.current.decodeOnceFromVideoDevice(
        undefined, // Use default camera
        videoElement
      );

      if (result) {
        const qrText = result.getText();
        console.log('QR Code detected:', qrText);
        
        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        onScan(qrText);
        stopScanning();
        toast.success('Código QR escaneado exitosamente');
      }
    } catch (error) {
      console.error('Scanning error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('NotFoundError')) {
          setError('No se encontró una cámara disponible');
        } else if (error.message.includes('NotAllowedError')) {
          setError('Acceso a la cámara denegado');
        } else if (error.message.includes('NotReadableError')) {
          setError('La cámara está siendo usada por otra aplicación');
        } else {
          setError('Error al escanear código QR');
        }
      } else {
        setError('Error desconocido al escanear');
      }
      
      stopScanning();
    }
  };

  const stopScanning = () => {
    try {
      // Stop the scanner
      if (scannerRef.current) {
        scannerRef.current.reset();
      }

      // Stop video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setIsScanning(false);
      setFlashEnabled(false);
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  const toggleFlash = async () => {
    try {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack && 'torch' in videoTrack.getCapabilities()) {
          await videoTrack.applyConstraints({
            advanced: [{ torch: !flashEnabled }] as MediaTrackConstraintSet[]
          });
          setFlashEnabled(!flashEnabled);
        } else {
          toast.error('Flash no disponible en este dispositivo');
        }
      }
    } catch (error) {
      console.error('Error toggling flash:', error);
      toast.error('Error al controlar el flash');
    }
  };

  const switchCamera = () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    if (isScanning) {
      stopScanning();
      setTimeout(() => startScanning(), 500);
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasPermission(null);
    startScanning();
  };

  if (!isScanning) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={startScanning}
        disabled={loading || disabled}
        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative overflow-hidden group"
      >
        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {loading ? (
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Validando...</span>
          </div>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            <span>Escanear Código QR</span>
          </>
        )}
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-violet-400" />
              <span className="font-semibold">Escanear QR</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Flash Toggle */}
              <button
                onClick={toggleFlash}
                className={`p-2 rounded-lg transition-colors ${
                  flashEnabled ? 'bg-yellow-500' : 'bg-white/20'
                }`}
              >
                {flashEnabled ? (
                  <Flashlight className="w-5 h-5" />
                ) : (
                  <FlashlightOff className="w-5 h-5" />
                )}
              </button>
              
              {/* Camera Switch */}
              <button
                onClick={switchCamera}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {/* Close Button */}
              <button
                onClick={stopScanning}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="relative w-full h-full flex items-center justify-center">
          {error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-white p-8"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Error de Cámara</h3>
              <p className="text-gray-300 mb-6 max-w-sm">{error}</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Intentar de nuevo
                </button>
                
                <button
                  onClick={stopScanning}
                  className="w-full border border-white/30 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Scanning Frame */}
                  <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-400 rounded-br-lg" />
                    
                    {/* Scanning line animation */}
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                      animate={{
                        y: [0, 256, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                  
                  {/* Instructions */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-white text-sm font-medium">
                      Coloca el código QR dentro del marco
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="text-center text-white">
            <p className="text-sm opacity-80 mb-2">
              Mantén el teléfono estable y asegúrate de que haya buena iluminación
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs opacity-60">
              <span>• Enfoque automático</span>
              <span>• Detección instantánea</span>
              <span>• Seguro y privado</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};