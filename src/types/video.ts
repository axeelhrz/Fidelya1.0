export interface VideoGenerationParams {
  prompt: string;
  tone: string;
  duration: number;
  language: string;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  script: string;
  duration: number;
  createdAt: string;
  views: number;
  status: 'processing' | 'success' | 'error';
}

export interface SceneDescription {
  text: string;
  visualDescription: string;
}

export interface GeneratedScript {
  title: string;
  description: string;
  script: string;
  scenes: SceneDescription[];
}