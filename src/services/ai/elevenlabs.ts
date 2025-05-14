import axios from 'axios';

export interface TextToSpeechParams {
  text: string;
  voice_id?: string;
  language: string;
}

/**
 * Generates speech audio from text using ElevenLabs API
 */
export async function generateSpeech({
  text,
  voice_id = 'pNInz6obpgDQGcFmaJgB', // Default Spanish female voice
  language,
}: TextToSpeechParams): Promise<ArrayBuffer> {
  // Select appropriate voice based on language
  if (language === 'en') {
    voice_id = '21m00Tcm4TlvDq8ikWAM'; // English voice (Rachel)
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
    console.error("Error generating speech with ElevenLabs:", error);
    throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}