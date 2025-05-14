import { NextRequest, NextResponse } from 'next/server';
import { createVideo } from '@/services/ai/videoProcessor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, tone, duration, language } = body;

    // Validate input
    if (!prompt || !tone || !duration || !language) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Start the video generation process
    const videoResponse = await createVideo({
      prompt,
      tone,
      duration,
      language,
    });

    // If there was an error during processing
    if (videoResponse.status === 'error') {
    return NextResponse.json(
        { error: videoResponse.error || 'Failed to generate video' },
      { status: 500 }
    );
  }

    return NextResponse.json(videoResponse);
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
}
}