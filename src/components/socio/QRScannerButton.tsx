'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
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
  Monitor,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

interface QRScannerButtonProps {
  onScan: (qrData: string) => void;
  loading?: boolean;
}

interface CameraError {
  name: string;
  message: string;
  constraint?: string;
}

interface CameraState {
  hasPermission: boolean | null;
  isLoading: boolean;
  error: CameraError | null;
  stream: MediaStream | null;
  deviceInfo: {
    isMobile: boolean;
    hasCamera: boolean;
    supportedConstraints: MediaTrackSupportedConstraints | null;
  };
}

const ScannerButton = styled(motion.button)<{ loading: boolean }>`
  width: 100%;
  height: 5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 1.5rem;
  color: white;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(99, 102, 241, 0.4);
    background: linear-gradient(135deg, #5b21b6, #7c3aed);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${({ loading }) => loading && css`
    pointer-events: none;
    opacity: 0.8;
  `}
`;

const ScannerModal = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 80px -20px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .icon-container {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1e293b;
  }
  
  .close-button {
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    
    &:hover {
      background: #e2e8f0;
    }
  }
`;

const ScannerArea = styled.div`
  position: relative;
  background: #000;
  aspect-ratio: 1;
  overflow: hidden;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const ScannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
`;

const ScanFrame = styled(motion.div)`
  position: relative;
  width: 16rem;
  height: 16rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 1.5rem;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 2rem;
    height: 2rem;
    border: 4px solid #6366f1;
  }
  
  &::before {
    top: -4px;
    left: -4px;
    border-right: none;
    border-bottom: none;
    border-radius: 1rem 0 0 0;
  }
  
  &::after {
    top: -4px;
    right: -4px;
    border-left: none;
    border-bottom: none;
    border-radius: 0 1rem 0 0;
  }
`;

const ScanFrameCorners = styled.div`
  position: absolute;
  inset: 0;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 2rem;
    height: 2rem;
    border: 4px solid #6366f1;
  }
  
  &::before {
    bottom: -4px;
    left: -4px;
    border-right: none;
    border-top: none;
    border-radius: 0 0 0 1rem;
  }
  
  &::after {
    bottom: -4px;
    right: -4px;
    border-left: none;
    border-top: none;
    border-radius: 0 0 1rem 0;
  }
`;

const ScanLine = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #6366f1, transparent);
  box-shadow: 0 0 20px #6366f1;
`;

const ScannerInstructions = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  
  .main-text {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
  
  .sub-text {
    font-size: 0.875rem;
    opacity: 0.9;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
`;

const ErrorState = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 2rem;
  
  .error-icon {
    width: 4rem;
    height: 4rem;
    background: #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .error-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .error-message {
    margin-bottom: 1.5rem;
    opacity: 0.9;
    line-height: 1.5;
  }
  
  .error-details {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    font-family: monospace;
  }
`;

const LoadingState = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  
  .loading-icon {
    width: 4rem;
    height: 4rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .loading-text {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .loading-details {
    font-size: 0.875rem;
    opacity: 0.8;
  }
`;

const ControlsSection = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e2e8f0;
  
  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .help-text {
    font-size: 0.75rem;
    color: #64748b;
    text-align: center;
    font-weight: 500;
  }
  
  .debug-info {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f1f5f9;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
    
    .debug-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const DiagnosticSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 0.75rem;
  
  .diagnostic-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .diagnostic-list {
    font-size: 0.75rem;
    color: #92400e;
    
    .diagnostic-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      
      .status {
        font-weight: 600;
        
        &.success { color: #059669; }
        &.error { color: #dc2626; }
        &.warning { color: #d97706; }
      }
    }
  }
`;

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({
  onScan,
  loading = false
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const [cameraState, setCameraState] = useState<CameraState>({
    hasPermission: null,
    isLoading: false,
    error: null,
    stream: null,
    deviceInfo: {
      isMobile: false,
      hasCamera: false,
      supportedConstraints: null
    }
  });

  const detectDeviceInfo = useCallback(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const supportedConstraints = navigator.mediaDevices?.getSupportedConstraints() || null;

    setCameraState(prev => ({
      ...prev,
      deviceInfo: {
        isMobile,
        hasCamera,
        supportedConstraints
      }
    }));

    console.log('🔍 Device Detection:', {
      isMobile,
      hasCamera,
      supportedConstraints,
      userAgent: navigator.userAgent
    });
  }, []);

  const getCameraConfigurations = useCallback(() => {
    const { isMobile } = cameraState.deviceInfo;
    
    const configs: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        }
      },
      {
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      },
      {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        }
      },
      {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      },
      {
        video: true
      }
    ];

    return isMobile ? configs : configs.slice(2);
  }, [cameraState.deviceInfo]);

  const startCamera = useCallback(async () => {
    console.log('🎥 Starting camera...');
    setCameraState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }

      const configurations = getCameraConfigurations();
      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (let i = 0; i < configurations.length; i++) {
        try {
          console.log(`🔄 Trying camera config ${i + 1}/${configurations.length}:`, configurations[i]);
          stream = await navigator.mediaDevices.getUserMedia(configurations[i]);
          console.log('✅ Camera started successfully with config:', configurations[i]);
          break;
        } catch (error) {
          console.warn(`❌ Config ${i + 1} failed:`, error);
          lastError = error as Error;
          continue;
        }
      }

      if (!stream) {
        throw lastError || new Error('No se pudo acceder a la cámara con ninguna configuración');
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current!;
          const timeout = setTimeout(() => {
            reject(new Error('Timeout esperando que el video se cargue'));
          }, 10000);

          video.onloadedmetadata = () => {
            clearTimeout(timeout);
            console.log('✅ Video metadata loaded');
            resolve();
          };

          video.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Error cargando el video'));
          };
        });
      }

      setCameraState(prev => ({
        ...prev,
        hasPermission: true,
        isLoading: false,
        error: null,
        stream
      }));

      retryCountRef.current = 0;
      console.log('🎉 Camera setup completed successfully');

    } catch (error) {
      console.error('❌ Camera error:', error);
      
      const cameraError: CameraError = {
        name: (error as Error).name || 'UnknownError',
        message: (error as Error).message || 'Error desconocido',
        constraint: (error as any).constraint
      };

      setCameraState(prev => ({
        ...prev,
        hasPermission: false,
        isLoading: false,
        error: cameraError,
        stream: null
      }));
    }
  }, [getCameraConfigurations]);

  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🔇 Stopped track:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraState(prev => ({
      ...prev,
      hasPermission: null,
      error: null,
      stream: null
    }));

    setFlashEnabled(false);
  }, []);

  const toggleFlash = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      console.log('💡 Flash capabilities:', capabilities);
      
      if ('torch' in capabilities) {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any]
        });
        setFlashEnabled(!flashEnabled);
        console.log('💡 Flash toggled:', !flashEnabled);
      } else {
        console.warn('💡 Flash not supported on this device');
      }
    } catch (error) {
      console.error('💡 Error toggling flash:', error);
    }
  }, [flashEnabled]);

  const handleOpenScanner = useCallback(() => {
    console.log('🚀 Opening scanner...');
    setScannerOpen(true);
    detectDeviceInfo();
    startCamera();
  }, [detectDeviceInfo, startCamera]);

  const handleCloseScanner = useCallback(() => {
    console.log('🔒 Closing scanner...');
    setScannerOpen(false);
    stopCamera();
    setShowDiagnostics(false);
    retryCountRef.current = 0;
  }, [stopCamera]);

  const handleRetryCamera = useCallback(() => {
    retryCountRef.current++;
    console.log(`🔄 Retrying camera (attempt ${retryCountRef.current}/${maxRetries})`);
    startCamera();
  }, [startCamera]);

  const handleManualInput = useCallback(() => {
    const mockQRData = 'fidelya://comercio/comercio123?beneficio=beneficio456&t=' + Date.now();
    console.log('🧪 Using demo QR data:', mockQRData);
    onScan(mockQRData);
    handleCloseScanner();
  }, [onScan, handleCloseScanner]);

  const getErrorMessage = (error: CameraError): string => {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en tu navegador.';
      case 'NotFoundError':
        return 'No se encontró ninguna cámara en tu dispositivo.';
      case 'NotReadableError':
        return 'La cámara está siendo usada por otra aplicación.';
      case 'OverconstrainedError':
        return 'La configuración de cámara solicitada no es compatible con tu dispositivo.';
      case 'SecurityError':
        return 'Error de seguridad. Asegúrate de estar usando HTTPS.';
      case 'AbortError':
        return 'Acceso a la cámara cancelado.';
      default:
        return error.message || 'Error desconocido al acceder a la cámara.';
    }
  };

  const getErrorSolution = (error: CameraError): string => {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Haz clic en el ícono de cámara en la barra de direcciones y permite el acceso.';
      case 'NotFoundError':
        return 'Conecta una cámara a tu dispositivo o usa un dispositivo con cámara integrada.';
      case 'NotReadableError':
        return 'Cierra otras aplicaciones que puedan estar usando la cámara.';
      case 'SecurityError':
        return 'Asegúrate de estar accediendo desde una conexión segura (HTTPS).';
      default:
        return 'Intenta recargar la página o usar un navegador diferente.';
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    detectDeviceInfo();
  }, [detectDeviceInfo]);

  return (
    <>
      <ScannerButton
        loading={loading}
        onClick={handleOpenScanner}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          {loading ? <RefreshCw size={24} /> : <QrCode size={24} />}
        </motion.div>
        {loading ? 'Procesando...' : 'Escanear Código QR'}
      </ScannerButton>

      <AnimatePresence>
        {scannerOpen && (
          <Dialog open={scannerOpen} onClose={handleCloseScanner}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
              <ScannerModal
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <ModalHeader>
                  <div className="title-section">
                    <div className="icon-container">
                      <Scan size={16} />
                    </div>
                    <h3>Escanear QR</h3>
                  </div>
                  <button
                    onClick={handleCloseScanner}
                    className="close-button"
                  >
                    <X size={16} />
                  </button>
                </ModalHeader>

                <ScannerArea>
                  {cameraState.isLoading && (
                    <LoadingState
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="loading-icon">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Camera size={24} />
                        </motion.div>
                      </div>
                      <div className="loading-text">Iniciando cámara...</div>
                      <div className="loading-details">
                        {cameraState.deviceInfo.isMobile ? 'Configurando cámara trasera' : 'Configurando cámara'}
                      </div>
                    </LoadingState>
                  )}

                  {cameraState.hasPermission === false && cameraState.error && (
                    <ErrorState
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="error-icon">
                        <AlertCircle size={24} />
                      </div>
                      <div className="error-title">Error de Cámara</div>
                      <div className="error-message">
                        {getErrorMessage(cameraState.error)}
                      </div>
                      <div className="error-details">
                        {cameraState.error.name}: {cameraState.error.message}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {retryCountRef.current < maxRetries && (
                          <Button
                            variant="outline"
                            onClick={handleRetryCamera}
                            leftIcon={<RefreshCw size={16} />}
                            className="bg-white text-gray-900"
                            size="sm"
                          >
                            Reintentar ({retryCountRef.current + 1}/{maxRetries})
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
                    </ErrorState>
                  )}

                  {cameraState.hasPermission && !cameraState.isLoading && cameraState.stream && (
                    <>
                      <VideoElement
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                      />
                      
                      <ScannerOverlay>
                        <ScanFrame
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <ScanFrameCorners />
                          <ScanLine
                            animate={{ y: [0, 256, 0] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              ease: "linear" 
                            }}
                          />
                        </ScanFrame>
                        
                        <ScannerInstructions>
                          <motion.div
                            className="main-text"
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Apunta la cámara al código QR
                          </motion.div>
                          <div className="sub-text">
                            Mantén el código dentro del marco
                          </div>
                        </ScannerInstructions>
                      </ScannerOverlay>
                    </>
                  )}
                </ScannerArea>

                <ControlsSection>
                  <div className="controls-grid">
                    <Button
                      variant="outline"
                      onClick={handleCloseScanner}
                      leftIcon={<X size={16} />}
                      size="sm"
                    >
                      Cancelar
                    </Button>
                    
                    <Button
                      onClick={handleManualInput}
                      leftIcon={<Zap size={16} />}
                      size="sm"
                    >
                      Probar Demo
                    </Button>
                    
                    {cameraState.hasPermission && cameraState.stream && (
                      <>
                        <Button
                          variant="outline"
                          onClick={toggleFlash}
                          leftIcon={flashEnabled ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
                          size="sm"
                          disabled={!cameraState.deviceInfo.supportedConstraints?.torch}
                        >
                          {flashEnabled ? 'Apagar Flash' : 'Encender Flash'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={handleRetryCamera}
                          leftIcon={<RotateCcw size={16} />}
                          size="sm"
                        >
                          Reiniciar
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div className="help-text">
                    <Info size={12} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Solicita al comercio que muestre su código QR oficial
                  </div>

                  <div className="debug-info">
                    <div className="debug-item">
                      <span>Dispositivo:</span>
                      <span>{cameraState.deviceInfo.isMobile ? 'Móvil' : 'Desktop'}</span>
                    </div>
                    <div className="debug-item">
                      <span>Soporte cámara:</span>
                      <span>{cameraState.deviceInfo.hasCamera ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="debug-item">
                      <span>Estado:</span>
                      <span>
                        {cameraState.isLoading ? 'Cargando' : 
                         cameraState.hasPermission === true ? 'Activa' :
                         cameraState.hasPermission === false ? 'Error' : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  {showDiagnostics && (
                    <DiagnosticSection>
                      <div className="diagnostic-title">
                        <Settings size={14} />
                        Información de Diagnóstico
                      </div>
                      <div className="diagnostic-list">
                        <div className="diagnostic-item">
                          <span>HTTPS:</span>
                          <span className={location.protocol === 'https:' ? 'status success' : 'status error'}>
                            {location.protocol === 'https:' ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div className="diagnostic-item">
                          <span>MediaDevices API:</span>
                          <span className={navigator.mediaDevices ? 'status success' : 'status error'}>
                            {navigator.mediaDevices ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>
                        <div className="diagnostic-item">
                          <span>getUserMedia:</span>
                          <span className={navigator.mediaDevices?.getUserMedia ? 'status success' : 'status error'}>
                            {navigator.mediaDevices?.getUserMedia ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>
                        <div className="diagnostic-item">
                          <span>Navegador:</span>
                          <span className="status">{navigator.userAgent.split(' ').pop()}</span>
                        </div>
                        {cameraState.error && (
                          <div className="diagnostic-item">
                            <span>Último error:</span>
                            <span className="status error">{cameraState.error.name}</span>
                          </div>
                        )}
                      </div>
                    </DiagnosticSection>
                  )}
                </ControlsSection>
              </ScannerModal>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};