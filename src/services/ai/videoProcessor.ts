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
 * Main function to orchestrate the entire video generation process
 */
export async function createVideo(
  params: VideoGenerationRequest
): Promise<VideoGenerationResponse> {
  const videoId = uuidv4();
  
  try {
    // Step 1: Generate script using OpenAI
    console.log(`Generating script for video ${videoId}...`);
    const scriptData = await generateVideoScript({
      prompt: params.prompt,
      tone: params.tone,
      duration: params.duration,
      language: params.language,
    });
    
    // Step 2: Generate video using Replicate
    console.log(`Generating video for ${videoId}...`);
    const videoUrl = await generateVideo({
      prompt: params.prompt,
      scenes: scriptData.scenes,
      duration: params.duration,
    });
    
    // Step 3: Generate speech using ElevenLabs
    console.log(`Generating speech for ${videoId}...`);
    await generateSpeech({
      text: scriptData.script,
      language: params.language,
    });
    
    // Step 4: In a production environment, we would combine the video and audio
    // For this demo, we'll just return the video URL
    
    return {
      id: videoId,
      status: 'success',
      videoUrl,
      thumbnailUrl: `${videoUrl.split('.')[0]}_thumbnail.jpg`,
      script: scriptData.script,
      title: scriptData.title,
      description: scriptData.description,
    };
  } catch (error) {
    console.error(`Error creating video ${videoId}:`, error);
    return {
      id: videoId,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}