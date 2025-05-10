/**
 * Subscription plan enum and constants
 */

/**
 * Plan enum - Can be used for type checking and value comparison
 */
export enum Plan {
    BASIC = 'basic',
    PROFESSIONAL = 'professional',
    ENTERPRISE = 'enterprise'
  }
  
  /**
   * PLAN constants - Alternative to enum, useful for object property access
   */
  export const PLAN = {
    BASIC: 'basic' as Plan.BASIC,
    PROFESSIONAL: 'professional' as Plan.PROFESSIONAL,
    ENTERPRISE: 'enterprise' as Plan.ENTERPRISE
  } as const;
  
  /**
   * Plan feature availability by plan type
   */
  export const PLAN_FEATURES = {
    // Basic plan features
    [Plan.BASIC]: {
      maxPolicies: 50,
      maxClients: 30,
      analytics: false,
      realtimeUpdates: false,
      recommendations: false,
      calendar: false,
      exportData: false,
      teamAccess: false
    },
    
    // Professional plan features
    [Plan.PROFESSIONAL]: {
      maxPolicies: 200,
      maxClients: 150,
      analytics: true,
      realtimeUpdates: true,
      recommendations: true,
      calendar: true,
      exportData: true,
      teamAccess: false
    },
    
    // Enterprise plan features
    [Plan.ENTERPRISE]: {
      maxPolicies: 'unlimited',
      maxClients: 'unlimited',
      analytics: true,
      realtimeUpdates: true,
      recommendations: true,
      calendar: true,
      exportData: true,
      teamAccess: true
    }
  };
  
  /**
   * Plan display names for UI presentation
   */
  export const PLAN_DISPLAY_NAMES = {
    [Plan.BASIC]: 'Básico',
    [Plan.PROFESSIONAL]: 'Profesional',
    [Plan.ENTERPRISE]: 'Empresarial'
  };
  
  /**
     * Check if a plan includes a specific feature
     * @param planType The plan type to check
     * @param feature The feature to check for
     * @returns Boolean indicating if the feature is available
     */
    export const planIncludesFeature = (
      planType: Plan | undefined, 
      feature: keyof typeof PLAN_FEATURES[Plan]
    ): boolean => {
      if (!planType || !PLAN_FEATURES[planType]) {
        return false;
      }
      
      const value = PLAN_FEATURES[planType][feature];
      return value === true || value === 'unlimited' || (typeof value === 'number' && value > 0);
    };
  
  /**
   * Check if a plan is premium (Professional or Enterprise)
   * @param planType The plan type to check
   * @returns Boolean indicating if the plan is premium
   */
  export const isPremiumPlan = (planType?: Plan): boolean => {
    if (!planType) return false;
    return planType === Plan.PROFESSIONAL || planType === Plan.ENTERPRISE;
  };
  
  /**
   * Check if a plan is enterprise level
   * @param planType The plan type to check
   * @returns Boolean indicating if the plan is enterprise level
   */
  export const isEnterprisePlan = (planType?: Plan): boolean => {
    if (!planType) return false;
    return planType === Plan.ENTERPRISE;
  };
  
  /**
   * Type for subscription object
   */
  export interface Subscription {
    id: string;
    plan: Plan;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  }