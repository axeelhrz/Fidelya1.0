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
    
    // Usar Zeroscope XL para la generación de video a partir de texto
    // Modelo: https://replicate.com/anotherjesse/zeroscope-v2-xl
    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt: scenes.map(scene => scene.visualDescription).join(" "),
          fps: 24,
          model: "xl",
          width: 1024,
          height: 576,
          num_frames: duration * 24, // Convertir segundos a frames a 24fps
          guidance_scale: 17.5,
        }
      }
    );

    // La salida es típicamente un array con la URL del video como último elemento
    if (Array.isArray(output) && output.length > 0) {
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