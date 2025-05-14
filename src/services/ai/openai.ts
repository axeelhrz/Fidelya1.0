import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ScriptGenerationParams {
  prompt: string;
  tone: string;
  duration: number;
  language: string;
}

export interface GeneratedScript {
  script: string;
  title: string;
  description: string;
  scenes: SceneDescription[];
}

export interface SceneDescription {
  text: string;
  visualDescription: string;
}

/**
 * Genera un guión simulado cuando la API de OpenAI no está disponible
 */
function generarGuionSimulado(params: ScriptGenerationParams): GeneratedScript {
  const { prompt, tone, duration, language } = params;
  const esEspanol = language === 'es';
  
  // Crear un título basado en el prompt (primeras palabras)
  const palabrasPrompt = prompt.split(' ');
  const palabrasTitulo = palabrasPrompt.slice(0, 4);
  const titulo = palabrasTitulo.join(' ') + (esEspanol ? ' - Video' : ' - Video');
  
  // Crear una descripción simple
  let tonoTexto = '';
  if (esEspanol) {
    switch (tone) {
      case 'funny': tonoTexto = 'divertido'; break;
      case 'informative': tonoTexto = 'informativo'; break;
      case 'promotional': tonoTexto = 'promocional'; break;
      case 'emotional': tonoTexto = 'emotivo'; break;
      case 'educational': tonoTexto = 'educativo'; break;
      case 'inspirational': tonoTexto = 'inspirador'; break;
      default: tonoTexto = 'interesante';
    }
  } else {
    tonoTexto = tone;
  }
  
  const descripcion = esEspanol 
    ? `Un video ${tonoTexto} sobre ${palabrasPrompt.slice(0, 8).join(' ')}...`
    : `A ${tonoTexto} video about ${palabrasPrompt.slice(0, 8).join(' ')}...`;
  
  // Crear un guión simple
  const guion = esEspanol
    ? `Este es un video generado automáticamente sobre ${prompt}. Creado con ReelGenius para mostrar las capacidades de nuestra plataforma.`
    : `This is an automatically generated video about ${prompt}. Created with ReelGenius to showcase our platform's capabilities.`;
  
  // Crear escenas basadas en la duración
  const numeroEscenas = duration <= 10 ? 2 : duration <= 15 ? 3 : 5;
  const escenas: SceneDescription[] = [];
  
  for (let i = 0; i < numeroEscenas; i++) {
    const textoEscena = esEspanol 
      ? `Escena ${i + 1}: ${palabrasPrompt.slice(i * 3, (i + 1) * 3).join(' ')}...` 
      : `Scene ${i + 1}: ${palabrasPrompt.slice(i * 3, (i + 1) * 3).join(' ')}...`;
      
    const descripcionVisual = `${prompt} - ${esEspanol ? 'escena' : 'scene'} ${i + 1}, ${tonoTexto} style, high quality, professional, 4k, cinematic`;
    
    escenas.push({
      text: textoEscena,
      visualDescription: descripcionVisual
    });
  }
  
  return {
    title: titulo,
    description: descripcion,
    script: guion,
    scenes: escenas
  };
}

/**
 * Genera un guión de video usando el modelo GPT de OpenAI
 */
export async function generateVideoScript({
  prompt,
  tone,
  duration,
  language,
}: ScriptGenerationParams): Promise<GeneratedScript> {
  // Calcular la longitud de tokens apropiada según la duración
  const targetWordCount = duration <= 10 ? 30 : duration <= 15 ? 45 : 90;
  
  const systemPrompt = `You are an expert video script writer for short-form social media videos.
Create a compelling script for a ${duration}-second video with approximately ${targetWordCount} words.
The script should be in ${language === 'es' ? 'Spanish' : 'English'} and have a ${tone} tone.
Format your response as JSON with the following structure:
{
  "title": "Catchy title for the video",
  "description": "Brief description of the video content",
  "script": "The full narration script",
  "scenes": [
    {
      "text": "Text for this scene",
      "visualDescription": "Description of what should be shown visually"
    }
  ]
}
Divide the script into 3-5 scenes depending on video length.`;

  try {
    // Intentar usar la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Failed to generate script: Empty response from OpenAI");
    }

    return JSON.parse(responseContent) as GeneratedScript;
  } catch (error) {
    console.error("Error generando guión con OpenAI:", error);
    
    // Si hay un error de cuota o cualquier otro error, usar el generador simulado
    console.log("Usando generador de guiones simulado debido a error de API");
    return generarGuionSimulado({ prompt, tone, duration, language });
  }
}