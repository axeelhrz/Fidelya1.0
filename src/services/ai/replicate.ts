import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Type for Replicate output with 'output' property
interface ReplicateOutput {
  output: string;
}

export interface VideoGenerationParams {
  prompt: string;
  scenes: {
    text: string;
    visualDescription: string;
  }[];
  duration: number;
}

/**
 * Genera una URL de video simulada cuando la API de Replicate no está disponible
 */
function generarUrlVideoSimulado(): string {
  // Devuelve una URL de video de marcador de posición
  const videosSimulados = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ];
  
  return videosSimulados[Math.floor(Math.random() * videosSimulados.length)];
}

/**
 * Genera un video usando el modelo de texto a video de Replicate
 */
export async function generateVideo({
  prompt,
  scenes,
  duration,
}: VideoGenerationParams): Promise<string> {
  try {
    // Verificar si debemos usar el respaldo (si REPLICATE_API_TOKEN no está configurado o es "mock")
    if (!process.env.REPLICATE_API_TOKEN || 
        process.env.REPLICATE_API_TOKEN === "mock" || 
        process.env.USE_MOCK_AI === "true") {
      console.log("Usando generador de videos simulado (token de API de Replicate no disponible o modo simulado habilitado)");
      return generarUrlVideoSimulado();
    }
    
    console.log("Generando video con Replicate usando el token:", process.env.REPLICATE_API_TOKEN);
    
    // Usar un modelo más simple y accesible para la generación de video
    // Modelo: https://replicate.com/cjwbw/damo-text-to-video
    const output = await replicate.run(
      "cjwbw/damo-text-to-video:1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755",
      {
        input: {
          prompt: scenes[0].visualDescription,
          negative_prompt: "blurry, low quality, low resolution, bad anatomy",
          num_frames: 16,
          num_inference_steps: 50
        }
      }
    );

    console.log("Resultado de Replicate:", output);

    // La salida es la URL del video generado
    if (typeof output === 'string') {
      return output;
    } else if (Array.isArray(output) && output.length > 0) {
      return output[output.length - 1] as string;
    } else if (typeof output === 'object' && output !== null) {
      if ('output' in output) {
        return (output as any).output;
      } else if ('video' in output) {
        return (output as any).video;
    }
    }

    console.log("Formato de salida no reconocido, usando video simulado");
    return generarUrlVideoSimulado();
  } catch (error) {
    console.error("Error generando video con Replicate:", error);
    // Usar URL de video simulado como respaldo
    console.log("Usando generador de videos simulado debido a error de API");
    return generarUrlVideoSimulado();
  }
}