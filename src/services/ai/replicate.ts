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
 * Generates a video using Replicate's text-to-video model
 */
export async function generateVideo({
  scenes,
  duration,
}: VideoGenerationParams): Promise<string> {
  try {
    // Use Zeroscope XL for text-to-video generation
    // Model: https://replicate.com/anotherjesse/zeroscope-v2-xl
    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:71996d331e8ede8ef7bd76eba9fae076d31792e4ddf4ad057779b443d6aea62f",
      {
        input: {
          prompt: scenes.map(scene => scene.visualDescription).join(" "),
          fps: 24,
          model: "xl",
          width: 1024,
          height: 576,
          num_frames: duration * 24, // Convert seconds to frames at 24fps
          guidance_scale: 17.5,
        }
      }
    );

    // The output is typically an array with the video URL as the last item
    if (Array.isArray(output) && output.length > 0) {
      return output[output.length - 1] as string;
    }

    throw new Error("Failed to generate video: Invalid output format");
  } catch (error) {
    console.error("Error generating video with Replicate:", error);
    throw new Error(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}