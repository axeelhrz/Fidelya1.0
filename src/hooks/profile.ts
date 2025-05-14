/**
 * Interface for user profile data
 */
export interface ProfileData {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * The user's display name
   */
  displayName: string;
  
  /**
   * The user's email address
   */
  email: string;
  
  /**
   * A short biography or description of the user
   */
  bio: string;
  
  /**
   * The user's location or address
   */
  location: string;
  
  /**
   * The user's company or organization
   */
  company: string;
  
  /**
   * The URL of the user's website
   */
  website: string;
  
  /**
   * The URL of the user's avatar image
   */
  avatarUrl: string;
  
  /**
   * The URL of the user's cover photo
   */
  coverPhotoUrl: string;
  
  /**
   * Statistical data about the user
   */
  statistics: {
    /**
     * The total number of clients the user has
     */
    totalClients: number;
    
    /**
     * The number of active policies the user has
     */
    activePolicies: number;
    
    /**
     * The user's success rate
     */
    successRate: number;
    
    /**
     * The date when the statistics were last updated
     */
    lastUpdated: Date;
  };
  
  /**
   * Links to the user's social media profiles
   */
  socialLinks?: {
    /**
     * The URL of the user's LinkedIn profile
     */
    linkedin?: string;
    
    /**
     * The URL of the user's Twitter profile
     */
    twitter?: string;
    
    /**
     * The URL of the user's Facebook profile
     */
    facebook?: string;
  };
  
  /**
   * The date when the profile was created
   */
  createdAt: Date;
  
  /**
   * The date when the profile was last updated
   */
  updatedAt: Date;
}