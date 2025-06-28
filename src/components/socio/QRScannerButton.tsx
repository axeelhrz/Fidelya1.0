'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Settings,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';

interface QRScannerButtonProps {
  onScan: (qrData: string) => void;
  loading?: boolean;
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
  
  /* Esquinas del marco */
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
`;

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({
  onScan,
  loading = false
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraLoading(true);
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
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
    } finally {
      setCameraLoading(false);
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

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'torch' in track.getCapabilities()) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any]
          });
          setFlashEnabled(!flashEnabled);
        } catch (err) {
          console.error('Error toggling flash:', err);
        }
      }
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
    setFlashEnabled(false);
  };

  const handleManualInput = () => {
    const mockQRData = 'fidelita://comercio/comercio123?beneficio=beneficio456&t=' + Date.now();
    onScan(mockQRData);
    handleCloseScanner();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
                  {cameraLoading && (
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
                    </LoadingState>
                  )}

                  {hasPermission === false && (
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
                        No se pudo acceder a la cámara. Verifica los permisos.
                      </div>
                      <Button
                        variant="outline"
                        onClick={startCamera}
                        leftIcon={<RefreshCw size={16} />}
                        className="bg-white text-gray-900"
                      >
                        Intentar de nuevo
                      </Button>
                    </ErrorState>
                  )}

                  {hasPermission && !cameraLoading && (
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

                  {error && (
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg text-sm font-medium"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={16} />
                        {error}
                      </div>
                    </motion.div>
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
                    
                    {hasPermission && (
                      <>
                        <Button
                          variant="outline"
                          onClick={toggleFlash}
                          leftIcon={flashEnabled ? <FlashlightOff size={16} /> : <Flashlight size={16} />}
                          size="sm"
                        >
                          {flashEnabled ? 'Apagar Flash' : 'Encender Flash'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            stopCamera();
                            startCamera();
                          }}
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
                </ControlsSection>
              </ScannerModal>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};
