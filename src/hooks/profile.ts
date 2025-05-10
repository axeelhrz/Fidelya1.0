export interface ProfileData {
    id: string;
    displayName: string;
    email: string;
    bio: string;
    location: string;
    company: string;
    website: string;
    avatarUrl: string;
    coverPhotoUrl: string;
    statistics: {
      totalClients: number;
      activePolicies: number;
      successRate: number;
      lastUpdated: Date;
    };
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }