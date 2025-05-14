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
  scenes,
}: VideoGenerationParams): Promise<string> {
  try {
    // Verificar si debemos usar el respaldo (si REPLICATE_API_TOKEN no está configurado o es "mock")
    if (!process.env.REPLICATE_API_TOKEN || 
        process.env.REPLICATE_API_TOKEN === "mock" || 
        process.env.USE_MOCK_AI === "true") {
      console.log("Usando generador de videos simulado (token de API de Replicate no disponible o modo simulado habilitado)");
      return generarUrlVideoSimulado();
    }
    
    // Usar un modelo más simple y accesible para la generación de video
    // Modelo: https://replicate.com/lucataco/animate-diff
    const output = await replicate.run(
      "lucataco/animate-diff:b51abdc3bd0e8f89b2c6f6d0fc2d3984245fa56f98d2e56b3426663c4f0daddb",
      {
        input: {
          prompt: scenes[0].visualDescription,
          negative_prompt: "blurry, low quality, low resolution, bad anatomy",
          fps: 8,
          num_frames: 24,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 10000000),
        }
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[output.length - 1] as string;
    } else if (typeof output === 'object' && output !== null && 'output' in output) {
      return (output as ReplicateOutput).output;
    }

    throw new Error("Error al generar video: Formato de salida inválido");
  } catch (error) {
    console.error("Error generando video con Replicate:", error);
    // Usar URL de video simulado como respaldo
    console.log("Usando generador de videos simulado debido a error de API");
    return generarUrlVideoSimulado();
  }
}