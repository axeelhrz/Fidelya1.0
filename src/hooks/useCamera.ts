import { useState, useRef, useCallback, useEffect } from 'react';

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

interface UseCameraOptions {
  maxRetries?: number;
  preferredFacingMode?: 'user' | 'environment';
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const { maxRetries = 3, preferredFacingMode = 'environment' } = options;
  
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

  const streamRef = useRef<MediaStream | null>(null);
  const retryCountRef = useRef(0);

  // Detectar información del dispositivo
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

    return { isMobile, hasCamera, supportedConstraints };
  }, []);

  // Obtener configuraciones de cámara progresivas
  const getCameraConfigurations = useCallback((): MediaStreamConstraints[] => {
    const { isMobile } = cameraState.deviceInfo;
    
    const baseConfigs: MediaStreamConstraints[] = [
      // Configuración ideal
      {
        video: {
          facingMode: preferredFacingMode,
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        }
      },
      // Configuración media
      {
        video: {
          facingMode: preferredFacingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      },
      // Configuración básica sin facingMode
      {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        }
      },
      // Configuración simple
      {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      },
      // Configuración mínima
      {
        video: true
      }
    ];

    // Para móviles, priorizar configuraciones con facingMode
    return isMobile ? baseConfigs : baseConfigs.slice(2);
  }, [cameraState.deviceInfo, preferredFacingMode]);

  // Iniciar cámara
  const startCamera = useCallback(async (): Promise<MediaStream | null> => {
    console.log('🎥 Starting camera...');
    setCameraState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Verificar soporte básico
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }

      const configurations = getCameraConfigurations();
      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      // Intentar cada configuración
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
      setCameraState(prev => ({
        ...prev,
        hasPermission: true,
        isLoading: false,
        error: null,
        stream
      }));

      retryCountRef.current = 0;
      console.log('🎉 Camera setup completed successfully');
      return stream;

    } catch (error) {
      console.error('❌ Camera error:', error);
      
      type ErrorWithConstraint = Error & { constraint?: string };
      const err = error as ErrorWithConstraint;
      const cameraError: CameraError = {
        name: err.name || 'UnknownError',
        message: err.message || 'Error desconocido',
        constraint: err.constraint
      };

      setCameraState(prev => ({
        ...prev,
        hasPermission: false,
        isLoading: false,
        error: cameraError,
        stream: null
      }));

      return null;
    }
  }, [getCameraConfigurations]);

  // Detener cámara
  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🔇 Stopped track:', track.kind);
      });
      streamRef.current = null;
    }

    setCameraState(prev => ({
      ...prev,
      hasPermission: null,
      error: null,
      stream: null
    }));
  }, []);

  // Reintentar cámara
  const retryCamera = useCallback(async () => {
    if (retryCountRef.current >= maxRetries) {
      console.warn('🚫 Max retries reached');
      return null;
    }
    
    retryCountRef.current++;
    console.log(`🔄 Retrying camera (attempt ${retryCountRef.current}/${maxRetries})`);
    return await startCamera();
  }, [startCamera, maxRetries]);

  // Alternar flash
  const toggleFlash = useCallback(async (enabled: boolean): Promise<boolean> => {
    if (!streamRef.current) return false;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      console.log('💡 Flash capabilities:', capabilities);
      
      if ('torch' in capabilities) {
        await track.applyConstraints({
          advanced: [{ torch: enabled } as MediaTrackConstraintSet]
        });
        console.log('💡 Flash toggled:', enabled);
        return enabled;
      } else {
        console.warn('💡 Flash not supported on this device');
        return false;
      }
    } catch (error) {
      console.error('💡 Error toggling flash:', error);
      return false;
    }
  }, []);

  // Obtener información de la cámara
  const getCameraInfo = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return { cameras: [], hasMultipleCameras: false };
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      console.log('📹 Available cameras:', cameras);
      
      return {
        cameras,
        hasMultipleCameras: cameras.length > 1
      };
    } catch (error) {
      console.error('📹 Error getting camera info:', error);
      return { cameras: [], hasMultipleCameras: false };
    }
  }, []);

  // Obtener mensajes de error amigables
  const getErrorMessage = useCallback((error: CameraError): string => {
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
  }, []);

  // Obtener soluciones para errores
  const getErrorSolution = useCallback((error: CameraError): string => {
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
  }, []);

  // Detectar información del dispositivo al inicializar
  useEffect(() => {
    detectDeviceInfo();
  }, [detectDeviceInfo]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    // Estado
    cameraState,
    retryCount: retryCountRef.current,
    maxRetries,
    
    // Acciones
    startCamera,
    stopCamera,
    retryCamera,
    toggleFlash,
    detectDeviceInfo,
    getCameraInfo,
    
    // Utilidades
    getErrorMessage,
    getErrorSolution,
    
    // Referencias
    streamRef
  };
};
