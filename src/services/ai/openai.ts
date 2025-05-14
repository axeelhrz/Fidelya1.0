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
 * Generates a video script using OpenAI's GPT model
 */
export async function generateVideoScript({
  prompt,
  tone,
  duration,
  language,
}: ScriptGenerationParams): Promise<GeneratedScript> {
  // Calculate appropriate token length based on duration
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
    console.error("Error generating script with OpenAI:", error);
    throw new Error(`Failed to generate script: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}