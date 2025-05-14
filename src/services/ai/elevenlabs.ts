import axios from 'axios';

export interface TextToSpeechParams {
  text: string;
  voice_id?: string;
  language: string;
}

/**
 * Genera una respuesta de voz simulada cuando la API de ElevenLabs no está disponible
 */
function generarVozSimulada(): ArrayBuffer {
  // Devuelve un ArrayBuffer vacío como marcador de posición
  // En una implementación real, podrías devolver un archivo de audio predeterminado
  return new ArrayBuffer(0);
}

/**
 * Genera audio de voz a partir de texto usando la API de ElevenLabs
 */
export async function generateSpeech({
  text,
  voice_id = 'pNInz6obpgDQGcFmaJgB', // Voz femenina española predeterminada
  language,
}: TextToSpeechParams): Promise<ArrayBuffer> {
  // Verificar si debemos usar el respaldo
  if (!process.env.ELEVENLABS_API_KEY || 
      process.env.ELEVENLABS_API_KEY === "mock" || 
      process.env.USE_MOCK_AI === "true") {
    console.log("Usando generador de voz simulado (clave de API de ElevenLabs no disponible o modo simulado habilitado)");
    return generarVozSimulada();
  }

  // Seleccionar la voz apropiada según el idioma
  if (language === 'en') {
    voice_id = '21m00Tcm4TlvDq8ikWAM'; // Voz inglesa (Rachel)
  }

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error generando voz con ElevenLabs:", error);
    // Usar voz simulada como respaldo
    console.log("Usando generador de voz simulado debido a error de API");
    return generarVozSimulada();
  }
}