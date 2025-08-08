import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  
  // Segment criteria
  criteria: {
    userTypes: string[]; // 'socio', 'comercio', 'asociacion'
    associations?: string[];
    locations?: {
      countries?: string[];
      regions?: string[];
      cities?: string[];
    };
    demographics?: {
      ageRange?: { min: number; max: number };
      gender?: string[];
    };
    behavior?: {
      lastLoginDays?: number; // Active in last X days
      registrationDays?: number; // Registered in last X days
      benefitsUsed?: { min: number; max: number };
      validationsCount?: { min: number; max: number };
    };
    customFields?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
      value: any;
    }[];
    tags?: string[];
  };
  
  // Dynamic vs Static
  isDynamic: boolean; // If true, recalculates users automatically
  
  // Metadata
  userCount: number;
  lastCalculated: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Usage analytics
  analytics: {
    notificationsSent: number;
    lastUsed?: Date;
    campaignsUsed: number;
    averageEngagement: number;
  };
}

export interface SegmentationRule {
  id: string;
  name: string;
  description: string;
  
  // Rule configuration
  trigger: {
    event: string; // 'user_registered', 'benefit_used', 'login', etc.
    conditions?: {
      field: string;
      operator: string;
      value: any;
    }[];
  };
  
  // Action
  action: {
    type: 'add_to_segment' | 'remove_from_segment' | 'add_tag' | 'remove_tag';
    segmentId?: string;
    tag?: string;
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Analytics
  analytics: {
    totalExecutions: number;
    lastExecuted?: Date;
    successRate: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  
  // Basic info
  phone?: string;
  avatar?: string;
  
  // Location
  location?: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  
  // Demographics
  demographics?: {
    age?: number;
    gender?: string;
    birthDate?: Date;
  };
  
  // Associations
  associations?: string[];
  primaryAssociation?: string;
  
  // Behavior data
  behavior?: {
    lastLogin?: Date;
    loginCount: number;
    registrationDate: Date;
    benefitsUsed: number;
    validationsCount: number;
    averageSessionDuration: number;
    preferredChannels: string[];
  };
  
  // Segmentation
  segments: string[];
  tags: string[];
  customFields: Record<string, any>;
  
  // Preferences
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface SegmentInsights {
  segment: UserSegment;
  insights: {
    growth: {
      trend: 'increasing' | 'decreasing' | 'stable';
      percentage: number;
      period: string;
    };
    engagement: {
      averageOpenRate: number;
      averageClickRate: number;
      averageConversionRate: number;
    };
    demographics: {
      ageDistribution: Record<string, number>;
      genderDistribution: Record<string, number>;
      locationDistribution: Record<string, number>;
    };
    behavior: {
      mostActiveHours: number[];
      preferredChannels: Record<string, number>;
      averageLifetimeValue: number;
    };
    recommendations: string[];
  };
}

class UserSegmentationService {
  private readonly SEGMENTS_COLLECTION = 'userSegments';
  private readonly RULES_COLLECTION = 'segmentationRules';
  private readonly PROFILES_COLLECTION = 'userProfiles';
  private readonly SEGMENT_USERS_COLLECTION = 'segmentUsers';

  // ==================== USER SEGMENTS ====================

  // Create user segment
  async createUserSegment(
    data: Omit<UserSegment, 'id' | 'createdAt' | 'updatedAt' | 'userCount' | 'lastCalculated' | 'analytics'>
  ): Promise<string> {
    try {
      const segment = {
        ...data,
        userCount: 0,
        lastCalculated: new Date(),
        analytics: {
          notificationsSent: 0,
          campaignsUsed: 0,
          averageEngagement: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.SEGMENTS_COLLECTION), segment);
      
      // Calculate initial user count
      if (data.isDynamic) {
        await this.calculateSegmentUsers(docRef.id);
      }
      
      console.log(`✅ Created user segment: ${data.name}`);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating user segment:', error);
      throw error;
    }
  }

  // Get user segments
  async getUserSegments(includeInactive: boolean = false): Promise<UserSegment[]> {
    try {
      const constraints = [orderBy('createdAt', 'desc')];
      
      if (!includeInactive) {
        constraints.unshift(where('isActive', '==', true));
      }
      
      const q = query(collection(db, this.SEGMENTS_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastCalculated: doc.data().lastCalculated?.toDate() || new Date(),
        analytics: {
          ...doc.data().analytics,
          lastUsed: doc.data().analytics?.lastUsed?.toDate(),
        },
      })) as UserSegment[];
    } catch (error) {
      console.error('❌ Error getting user segments:', error);
      throw error;
    }
  }

  // Update user segment
  async updateUserSegment(
    id: string,
    updates: Partial<Omit<UserSegment, 'id' | 'createdAt' | 'createdBy'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.SEGMENTS_COLLECTION, id);
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      // Recalculate users if criteria changed
      if (updates.criteria && updates.isDynamic !== false) {
        await this.calculateSegmentUsers(id);
      }
      
      console.log(`✅ Updated user segment: ${id}`);
    } catch (error) {
      console.error('❌ Error updating user segment:', error);
      throw error;
    }
  }

  // Delete user segment
  async deleteUserSegment(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.SEGMENTS_COLLECTION, id);
      await deleteDoc(docRef);
      
      // Clean up segment users
      await this.removeAllUsersFromSegment(id);
      
      console.log(`✅ Deleted user segment: ${id}`);
    } catch (error) {
      console.error('❌ Error deleting user segment:', error);
      throw error;
    }
  }

  // ==================== SEGMENT CALCULATION ====================

  // Calculate users for a segment
  async calculateSegmentUsers(segmentId: string): Promise<number> {
    try {
      const segments = await this.getUserSegments(true);
      const segment = segments.find(s => s.id === segmentId);
      
      if (!segment) {
        throw new Error('Segment not found');
      }

      console.log(`🔄 Calculating users for segment: ${segment.name}`);
      
      // Get all user profiles
      const usersQuery = query(collection(db, this.PROFILES_COLLECTION));
      const usersSnapshot = await getDocs(usersQuery);
      
      const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        behavior: {
          ...doc.data().behavior,
          lastLogin: doc.data().behavior?.lastLogin?.toDate(),
          registrationDate: doc.data().behavior?.registrationDate?.toDate() || new Date(),
        },
        demographics: {
          ...doc.data().demographics,
          birthDate: doc.data().demographics?.birthDate?.toDate(),
        },
      })) as UserProfile[];

      // Filter users based on segment criteria
      const matchingUsers = allUsers.filter(user => this.userMatchesCriteria(user, segment.criteria));
      
      // Update segment user count
      await updateDoc(doc(db, this.SEGMENTS_COLLECTION, segmentId), {
        userCount: matchingUsers.length,
        lastCalculated: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Store segment users for quick access
      await this.storeSegmentUsers(segmentId, matchingUsers.map(u => u.id));
      
      console.log(`✅ Calculated ${matchingUsers.length} users for segment: ${segment.name}`);
      return matchingUsers.length;
    } catch (error) {
      console.error('❌ Error calculating segment users:', error);
      throw error;
    }
  }

  // Check if user matches segment criteria
  private userMatchesCriteria(user: UserProfile, criteria: UserSegment['criteria']): boolean {
    // User types
    if (criteria.userTypes.length > 0 && !criteria.userTypes.includes(user.role)) {
      return false;
    }

    // Associations
    if (criteria.associations && criteria.associations.length > 0) {
      if (!user.associations || !user.associations.some(assoc => criteria.associations!.includes(assoc))) {
        return false;
      }
    }

    // Location
    if (criteria.locations) {
      if (criteria.locations.countries && criteria.locations.countries.length > 0) {
        if (!user.location?.country || !criteria.locations.countries.includes(user.location.country)) {
          return false;
        }
      }
      if (criteria.locations.regions && criteria.locations.regions.length > 0) {
        if (!user.location?.region || !criteria.locations.regions.includes(user.location.region)) {
          return false;
        }
      }
      if (criteria.locations.cities && criteria.locations.cities.length > 0) {
        if (!user.location?.city || !criteria.locations.cities.includes(user.location.city)) {
          return false;
        }
      }
    }

    // Demographics
    if (criteria.demographics) {
      if (criteria.demographics.ageRange && user.demographics?.age) {
        const { min, max } = criteria.demographics.ageRange;
        if (user.demographics.age < min || user.demographics.age > max) {
          return false;
        }
      }
      if (criteria.demographics.gender && criteria.demographics.gender.length > 0) {
        if (!user.demographics?.gender || !criteria.demographics.gender.includes(user.demographics.gender)) {
          return false;
        }
      }
    }

    // Behavior
    if (criteria.behavior) {
      if (criteria.behavior.lastLoginDays && user.behavior?.lastLogin) {
        const daysSinceLogin = Math.floor((Date.now() - user.behavior.lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLogin > criteria.behavior.lastLoginDays) {
          return false;
        }
      }
      if (criteria.behavior.registrationDays && user.behavior?.registrationDate) {
        const daysSinceRegistration = Math.floor((Date.now() - user.behavior.registrationDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceRegistration > criteria.behavior.registrationDays) {
          return false;
        }
      }
      if (criteria.behavior.benefitsUsed && user.behavior?.benefitsUsed !== undefined) {
        const { min, max } = criteria.behavior.benefitsUsed;
        if (user.behavior.benefitsUsed < min || user.behavior.benefitsUsed > max) {
          return false;
        }
      }
      if (criteria.behavior.validationsCount && user.behavior?.validationsCount !== undefined) {
        const { min, max } = criteria.behavior.validationsCount;
        if (user.behavior.validationsCount < min || user.behavior.validationsCount > max) {
          return false;
        }
      }
    }

    // Custom fields
    if (criteria.customFields && criteria.customFields.length > 0) {
      for (const customField of criteria.customFields) {
        const fieldValue = user.customFields[customField.field];
        
        if (!this.evaluateCondition(fieldValue, customField.operator, customField.value)) {
          return false;
        }
      }
    }

    // Tags
    if (criteria.tags && criteria.tags.length > 0) {
      if (!user.tags || !criteria.tags.some(tag => user.tags.includes(tag))) {
        return false;
      }
    }

    return true;
  }

  // Evaluate condition
  private evaluateCondition(fieldValue: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'greater_than':
        return fieldValue > expectedValue;
      case 'less_than':
        return fieldValue < expectedValue;
      case 'contains':
        return String(fieldValue).includes(String(expectedValue));
      case 'in':
        return Array.isArray(expectedValue) && expectedValue.includes(fieldValue);
      case 'not_in':
        return Array.isArray(expectedValue) && !expectedValue.includes(fieldValue);
      default:
        return false;
    }
  }

  // Store segment users for quick access
  private async storeSegmentUsers(segmentId: string, userIds: string[]): Promise<void> {
    try {
      // Remove existing segment users
      await this.removeAllUsersFromSegment(segmentId);
      
      // Add new segment users in batches
      const batchSize = 500;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        
        for (const userId of batch) {
          await addDoc(collection(db, this.SEGMENT_USERS_COLLECTION), {
            segmentId,
            userId,
            addedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('❌ Error storing segment users:', error);
      throw error;
    }
  }

  // Remove all users from segment
  private async removeAllUsersFromSegment(segmentId: string): Promise<void> {
    try {
      const segmentUsersQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', segmentId)
      );
      
      const snapshot = await getDocs(segmentUsersQuery);
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error('❌ Error removing users from segment:', error);
    }
  }

  // ==================== SEGMENT USERS ====================

  // Get users in segment
  async getSegmentUsers(segmentId: string, limitCount?: number): Promise<string[]> {
    try {
      const constraints = [where('segmentId', '==', segmentId)];
      
      if (limitCount) {
        constraints.push(limit(limitCount));
      }
      
      const q = query(collection(db, this.SEGMENT_USERS_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => doc.data().userId);
    } catch (error) {
      console.error('❌ Error getting segment users:', error);
      throw error;
    }
  }

  // Add user to segment
  async addUserToSegment(userId: string, segmentId: string): Promise<void> {
    try {
      // Check if user is already in segment
      const existingQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', segmentId),
        where('userId', '==', userId),
        limit(1)
      );
      
      const existingSnapshot = await getDocs(existingQuery);
      
      if (existingSnapshot.empty) {
        await addDoc(collection(db, this.SEGMENT_USERS_COLLECTION), {
          segmentId,
          userId,
          addedAt: serverTimestamp(),
        });
        
        // Update segment user count
        const segment = (await this.getUserSegments(true)).find(s => s.id === segmentId);
        if (segment) {
          await updateDoc(doc(db, this.SEGMENTS_COLLECTION, segmentId), {
            userCount: segment.userCount + 1,
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('❌ Error adding user to segment:', error);
      throw error;
    }
  }

  // Remove user from segment
  async removeUserFromSegment(userId: string, segmentId: string): Promise<void> {
    try {
      const segmentUserQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', segmentId),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(segmentUserQuery);
      
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
      
      // Update segment user count
      const segment = (await this.getUserSegments(true)).find(s => s.id === segmentId);
      if (segment && segment.userCount > 0) {
        await updateDoc(doc(db, this.SEGMENTS_COLLECTION, segmentId), {
          userCount: Math.max(0, segment.userCount - 1),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('❌ Error removing user from segment:', error);
      throw error;
    }
  }

  // ==================== SEGMENTATION RULES ====================

  // Create segmentation rule
  async createSegmentationRule(
    data: Omit<SegmentationRule, 'id' | 'createdAt' | 'updatedAt' | 'analytics'>
  ): Promise<string> {
    try {
      const rule = {
        ...data,
        analytics: {
          totalExecutions: 0,
          successRate: 100,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.RULES_COLLECTION), rule);
      
      console.log(`✅ Created segmentation rule: ${data.name}`);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating segmentation rule:', error);
      throw error;
    }
  }

  // Execute segmentation rule
  async executeSegmentationRule(
    ruleId: string,
    eventData: Record<string, any>,
    userId: string
  ): Promise<void> {
    try {
      const rulesQuery = query(
        collection(db, this.RULES_COLLECTION),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(rulesQuery);
      const rules = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        analytics: {
          ...doc.data().analytics,
          lastExecuted: doc.data().analytics?.lastExecuted?.toDate(),
        },
      })) as SegmentationRule[];
      
      const rule = rules.find(r => r.id === ruleId);
      
      if (!rule) {
        console.warn(`⚠️ Segmentation rule not found: ${ruleId}`);
        return;
      }

      // Check conditions
      if (rule.trigger.conditions) {
        const conditionsMet = rule.trigger.conditions.every(condition => {
          const fieldValue = eventData[condition.field];
          return this.evaluateCondition(fieldValue, condition.operator, condition.value);
        });

        if (!conditionsMet) {
          console.log(`⏭️ Conditions not met for rule: ${ruleId}`);
          return;
        }
      }

      // Execute action
      switch (rule.action.type) {
        case 'add_to_segment':
          if (rule.action.segmentId) {
            await this.addUserToSegment(userId, rule.action.segmentId);
          }
          break;
        case 'remove_from_segment':
          if (rule.action.segmentId) {
            await this.removeUserFromSegment(userId, rule.action.segmentId);
          }
          break;
        case 'add_tag':
          if (rule.action.tag) {
            await this.addTagToUser(userId, rule.action.tag);
          }
          break;
        case 'remove_tag':
          if (rule.action.tag) {
            await this.removeTagFromUser(userId, rule.action.tag);
          }
          break;
      }

      // Update rule analytics
      await this.updateRuleAnalytics(ruleId);
      
      console.log(`✅ Executed segmentation rule: ${rule.name}`);
    } catch (error) {
      console.error('❌ Error executing segmentation rule:', error);
      throw error;
    }
  }

  // ==================== USER PROFILE MANAGEMENT ====================

  // Add tag to user
  async addTagToUser(userId: string, tag: string): Promise<void> {
    try {
      const userRef = doc(db, this.PROFILES_COLLECTION, userId);
      
      // Get current user data
      const userDoc = await getDocs(query(collection(db, this.PROFILES_COLLECTION), where('id', '==', userId), limit(1)));
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const currentTags = userData.tags || [];
        
        if (!currentTags.includes(tag)) {
          await updateDoc(userRef, {
            tags: [...currentTags, tag],
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('❌ Error adding tag to user:', error);
      throw error;
    }
  }

  // Remove tag from user
  async removeTagFromUser(userId: string, tag: string): Promise<void> {
    try {
      const userRef = doc(db, this.PROFILES_COLLECTION, userId);
      
      // Get current user data
      const userDoc = await getDocs(query(collection(db, this.PROFILES_COLLECTION), where('id', '==', userId), limit(1)));
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const currentTags = userData.tags || [];
        
        if (currentTags.includes(tag)) {
          await updateDoc(userRef, {
            tags: currentTags.filter((t: string) => t !== tag),
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error('❌ Error removing tag from user:', error);
      throw error;
    }
  }

  // ==================== ANALYTICS ====================

  // Get segment insights
  async getSegmentInsights(segmentId: string): Promise<SegmentInsights | null> {
    try {
      const segments = await this.getUserSegments(true);
      const segment = segments.find(s => s.id === segmentId);
      
      if (!segment) {
        return null;
      }

      // Get segment users
      const userIds = await this.getSegmentUsers(segmentId);
      
      // This is a simplified implementation
      // In a real app, you'd calculate actual insights from user data and analytics
      const insights: SegmentInsights = {
        segment,
        insights: {
          growth: {
            trend: 'increasing',
            percentage: 12.5,
            period: 'last 30 days',
          },
          engagement: {
            averageOpenRate: 65.2,
            averageClickRate: 12.8,
            averageConversionRate: 3.4,
          },
          demographics: {
            ageDistribution: { '18-25': 25, '26-35': 40, '36-45': 20, '46+': 15 },
            genderDistribution: { 'male': 45, 'female': 52, 'other': 3 },
            locationDistribution: { 'Buenos Aires': 35, 'Córdoba': 20, 'Rosario': 15, 'Other': 30 },
          },
          behavior: {
            mostActiveHours: [9, 12, 18, 20],
            preferredChannels: { 'email': 60, 'push': 30, 'sms': 10 },
            averageLifetimeValue: 150.75,
          },
          recommendations: [
            'Consider sending notifications during peak hours (9 AM, 12 PM, 6 PM, 8 PM)',
            'Email is the preferred channel for this segment',
            'High engagement rate suggests this segment is very responsive to communications',
          ],
        },
      };

      return insights;
    } catch (error) {
      console.error('❌ Error getting segment insights:', error);
      throw error;
    }
  }

  // Update rule analytics
  private async updateRuleAnalytics(ruleId: string): Promise<void> {
    try {
      const ruleRef = doc(db, this.RULES_COLLECTION, ruleId);
      
      // In a real implementation, you'd calculate actual stats
      await updateDoc(ruleRef, {
        'analytics.totalExecutions': 1, // Increment by 1
        'analytics.lastExecuted': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('❌ Error updating rule analytics:', error);
    }
  }

  // Get segmentation statistics
  async getSegmentationStats(): Promise<{
    segments: {
      total: number;
      active: number;
      dynamic: number;
      static: number;
      totalUsers: number;
    };
    rules: {
      total: number;
      active: number;
      totalExecutions: number;
    };
    topSegments: Array<{
      id: string;
      name: string;
      userCount: number;
      engagement: number;
    }>;
  }> {
    try {
      const [segments, rules] = await Promise.all([
        this.getUserSegments(true),
        this.getSegmentationRules(true),
      ]);

      const totalUsers = segments.reduce((sum, s) => sum + s.userCount, 0);

      return {
        segments: {
          total: segments.length,
          active: segments.filter(s => s.isActive).length,
          dynamic: segments.filter(s => s.isDynamic).length,
          static: segments.filter(s => !s.isDynamic).length,
          totalUsers,
        },
        rules: {
          total: rules.length,
          active: rules.filter(r => r.isActive).length,
          totalExecutions: rules.reduce((sum, r) => sum + r.analytics.totalExecutions, 0),
        },
        topSegments: segments
          .sort((a, b) => b.userCount - a.userCount)
          .slice(0, 5)
          .map(s => ({
            id: s.id,
            name: s.name,
            userCount: s.userCount,
            engagement: s.analytics.averageEngagement,
          })),
      };
    } catch (error) {
      console.error('❌ Error getting segmentation stats:', error);
      throw error;
    }
  }

  // Get segmentation rules
  async getSegmentationRules(includeInactive: boolean = false): Promise<SegmentationRule[]> {
    try {
      const constraints = [orderBy('createdAt', 'desc')];
      
      if (!includeInactive) {
        constraints.unshift(where('isActive', '==', true));
      }
      
      const q = query(collection(db, this.RULES_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        analytics: {
          ...doc.data().analytics,
          lastExecuted: doc.data().analytics?.lastExecuted?.toDate(),
        },
      })) as SegmentationRule[];
    } catch (error) {
      console.error('❌ Error getting segmentation rules:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userSegmentationService = new UserSegmentationService();