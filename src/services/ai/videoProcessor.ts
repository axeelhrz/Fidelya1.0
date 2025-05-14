import { generateVideoScript } from './openai';
import { generateVideo } from './replicate';
import { generateSpeech } from './elevenlabs';
import { v4 as uuidv4 } from 'uuid';

export interface VideoGenerationRequest {
  prompt: string;
  tone: string;
  duration: number;
  language: string;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'processing' | 'success' | 'error';
  videoUrl?: string;
  thumbnailUrl?: string;
  script?: string;
  title?: string;
  description?: string;
  error?: string;
}

/**
 * Función principal para orquestar todo el proceso de generación de video
 */
export async function createVideo(
  params: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  const videoId = uuidv4();
  
  try {
    // Paso 1: Generar guión usando OpenAI
    console.log(`Generando guión para video ${videoId}...`);
    const scriptData = await generateVideoScript({
      prompt: params.prompt,
      tone: params.tone,
      duration: params.duration,
      language: params.language,
    });
    
    // Paso 2: Generar video usando Replicate
    console.log(`Generando video para ${videoId}...`);
    const videoUrl = await generateVideo({
      prompt: params.prompt,
      scenes: scriptData.scenes,
      duration: params.duration,
    });
    
    console.log(`Video generado: ${videoUrl}`);
    
    // Paso 3: Generar voz usando ElevenLabs
    console.log(`Generando voz para ${videoId}...`);
    try {
    await generateSpeech({
      text: scriptData.script,
      language: params.language,
    });
  } catch (error) {
      console.error(`Error en la generación de voz para video ${videoId}:`, error);
      // Continuamos sin audio si hay un error
    }
    
    // Generar una URL de miniatura basada en la URL del video
    // En un entorno de producción, generaríamos una miniatura real
    const thumbnailUrl = 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg';
    
    return {
      id: videoId,
      status: 'success',
      videoUrl,
      thumbnailUrl,
      script: scriptData.script,
      title: scriptData.title,
      description: scriptData.description,
    };
  } catch (error) {
    console.error(`Error creando video ${videoId}:`, error);
    return {
      id: videoId,
      status: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}