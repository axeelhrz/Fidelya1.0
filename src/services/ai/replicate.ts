import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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
    
    // Usar un modelo más avanzado para la generación de video
    // Modelo: https://replicate.com/stability-ai/stable-video-diffusion
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          prompt: scenes.map(scene => scene.visualDescription).join(" "),
          video_length: "25_frames_with_svd_xt",
          sizing_strategy: "maintain_aspect_ratio",
          frames_per_second: 6,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          seed: Math.floor(Math.random() * 10000000),
        }
      }
    );

    // La salida es la URL del video generado
    if (typeof output === 'string') {
      return output;
    } else if (Array.isArray(output) && output.length > 0) {
      return output[output.length - 1] as string;
    }

    throw new Error("Error al generar video: Formato de salida inválido");
  } catch (error) {
    console.error("Error generando video con Replicate:", error);
    // Usar URL de video simulado como respaldo
    console.log("Usando generador de videos simulado debido a error de API");
    return generarUrlVideoSimulado();
  }
}