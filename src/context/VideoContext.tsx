'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VideoData, VideoGenerationParams } from '@/types/video';

// Definir la forma del contexto
interface VideoContextType {
  videos: VideoData[];
  isGenerating: boolean;
  generationProgress: {
    script: boolean;
    video: boolean;
    audio: boolean;
    final: boolean;
  };
  activeStep: number;
  generateVideo: (params: VideoGenerationParams) => Promise<void>;
  addVideo: (video: VideoData) => void;
  deleteVideo: (id: string) => void;
}

// Crear el contexto
const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Datos de ejemplo para videos iniciales
const initialVideos: VideoData[] = [
  { 
    id: '1', 
    title: 'Tips de productividad', 
    description: 'Consejos para maximizar tu tiempo diario',
    thumbnailUrl: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg', 
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    script: 'Este es un script generado basado en tu prompt.',
    duration: 15, 
    createdAt: '2023-10-15',
    views: 245,
    status: 'success'
  },
  { 
    id: '2', 
    title: 'Receta rápida', 
    description: 'Pasta al pesto en menos de 10 minutos',
    thumbnailUrl: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg', 
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    script: 'Este es un script generado basado en tu prompt.',
    duration: 30, 
    createdAt: '2023-10-14',
    views: 189,
    status: 'success'
  }
];

// Proveedor del contexto
export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<VideoData[]>(initialVideos);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState({
    script: false,
    video: false,
    audio: false,
    final: false,
  });
      
  // Simular la progresión de la generación de video
  const simulateProgress = () => {
    setActiveStep(0);
    setGenerationProgress({ script: false, video: false, audio: false, final: false });
    setIsGenerating(true);
      setTimeout(() => {
      setGenerationProgress(prev => ({ ...prev, script: true }));
      setActiveStep(1);
      
      setTimeout(() => {
        setGenerationProgress(prev => ({ ...prev, video: true }));
        setActiveStep(2);
        
        setTimeout(() => {
          setGenerationProgress(prev => ({ ...prev, audio: true }));
          setActiveStep(3);
          
          setTimeout(() => {
            setGenerationProgress(prev => ({ ...prev, final: true }));
            
            setTimeout(() => {
      setIsGenerating(false);
              // Reiniciar el estado de progreso
              setGenerationProgress({ script: false, video: false, audio: false, final: false });
            }, 1000);
          }, 2000);
        }, 3000);
      }, 3000);
    }, 2000);
  };

  // Función para generar un nuevo video
  const generateVideo = async (params: VideoGenerationParams) => {
    setIsGenerating(true);
    
    try {
      // Iniciar la simulación de progreso
      simulateProgress();
      
      // Realizar la solicitud a la API
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar el video');
      }
      
      const videoData = await response.json();
      console.log("Video generado:", videoData);
      
      // Crear un nuevo objeto de video con los datos recibidos
      const newVideo: VideoData = {
        id: videoData.id || `video-${Date.now()}`,
        title: videoData.title || `Video sobre ${params.prompt.substring(0, 20)}...`,
        description: videoData.description || params.prompt,
        thumbnailUrl: videoData.thumbnailUrl || 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
        videoUrl: videoData.videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        script: videoData.script || params.prompt,
        duration: params.duration,
        createdAt: new Date().toLocaleDateString(),
        views: 0,
        status: 'success',
  };

      // Agregar el nuevo video a la lista después de que termine la simulación
      setTimeout(() => {
        addVideo(newVideo);
      }, 10000); // Tiempo total aproximado de la simulación
      
    } catch (error) {
      console.error('Error al generar el video:', error);
      setIsGenerating(false);
      throw error;
    }
  };

  // Función para agregar un nuevo video a la lista
  const addVideo = (video: VideoData) => {
    setVideos(prevVideos => [video, ...prevVideos]);
};

  // Función para eliminar un video de la lista
  const deleteVideo = (id: string) => {
    setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
};

  return (
    <VideoContext.Provider
      value={{
        videos,
        isGenerating,
        generationProgress,
        activeStep,
        generateVideo,
        addVideo,
        deleteVideo,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo debe ser usado dentro de un VideoProvider');
  }
  return context;
};