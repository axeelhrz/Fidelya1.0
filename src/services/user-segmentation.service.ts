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
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserSegment {
  id: string;
  name: string;
  description: string;
  color: string;
  
  // Segmentation criteria
  criteria: {
    userTypes?: string[]; // 'socio', 'comercio', 'asociacion'
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
    engagement?: {
      notificationOpenRate?: { min: number; max: number };
      appUsageFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
      lastNotificationDays?: number;
    };
    customFields?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
      value: any;
    }[];
  };
  
  // Dynamic vs Static
  isDynamic: boolean; // True for auto-updating segments, false for static lists
  
  // Metadata
  userCount: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Usage analytics
  analytics: {
    notificationsSent: number;
    averageOpenRate: number;
    averageClickRate: number;
    lastUsed?: Date;
    usageCount: number;
  };
  
  // Status
  isActive: boolean;
  tags: string[];
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
    type: 'add_to_segment' | 'remove_from_segment' | 'create_segment';
    segmentId?: string;
    segmentName?: string;
    delay?: number; // Minutes to wait before applying
  };
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  analytics: {
    totalExecutions: number;
    lastExecuted?: Date;
  };
}

export interface SegmentInsights {
  segment: UserSegment;
  insights: {
    growth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    engagement: {
      averageSessionDuration: number;
      averageNotificationOpenRate: number;
      mostActiveHours: number[];
      mostActiveDays: string[];
    };
    behavior: {
      topBenefitsUsed: { benefitId: string; benefitName: string; count: number }[];
      averageBenefitsPerUser: number;
      retentionRate: number;
    };
    demographics: {
      ageDistribution: { range: string; count: number; percentage: number }[];
      genderDistribution: { gender: string; count: number; percentage: number }[];
      locationDistribution: { location: string; count: number; percentage: number }[];
    };
    recommendations: string[];
  };
}

class UserSegmentationService {
  private readonly SEGMENTS_COLLECTION = 'userSegments';
  private readonly SEGMENT_USERS_COLLECTION = 'segmentUsers';
  private readonly SEGMENTATION_RULES_COLLECTION = 'segmentationRules';
  private readonly SEGMENT_ANALYTICS_COLLECTION = 'segmentAnalytics';

  // ==================== SEGMENT MANAGEMENT ====================

  // Create user segment
  async createUserSegment(
    data: Omit<UserSegment, 'id' | 'createdAt' | 'updatedAt' | 'userCount' | 'lastUpdated' | 'analytics'>
  ): Promise<string> {
    try {
      const segment = {
        ...data,
        userCount: 0,
        lastUpdated: serverTimestamp(),
        analytics: {
          notificationsSent: 0,
          averageOpenRate: 0,
          averageClickRate: 0,
          usageCount: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.SEGMENTS_COLLECTION), segment);
      
      // If dynamic segment, calculate users immediately
      if (data.isDynamic) {
        await this.updateSegmentUsers(docRef.id);
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
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
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
      
      // If criteria changed and it's a dynamic segment, recalculate users
      if (updates.criteria && updates.isDynamic !== false) {
        await this.updateSegmentUsers(id);
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
      const batch = writeBatch(db);
      
      // Delete segment
      const segmentRef = doc(db, this.SEGMENTS_COLLECTION, id);
      batch.delete(segmentRef);
      
      // Delete associated user mappings
      const userMappingsQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', id)
      );
      const userMappingsSnapshot = await getDocs(userMappingsQuery);
      
      userMappingsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      console.log(`✅ Deleted user segment: ${id}`);
    } catch (error) {
      console.error('❌ Error deleting user segment:', error);
      throw error;
    }
  }

  // ==================== SEGMENT USERS MANAGEMENT ====================

  // Update segment users based on criteria
  async updateSegmentUsers(segmentId: string): Promise<void> {
    try {
      const segments = await this.getUserSegments(true);
      const segment = segments.find(s => s.id === segmentId);
      
      if (!segment || !segment.isDynamic) {
        console.warn(`⚠️ Segment not found or not dynamic: ${segmentId}`);
        return;
      }

      console.log(`🔄 Updating users for segment: ${segment.name}`);

      // Get users matching criteria
      const matchingUsers = await this.getUsersMatchingCriteria(segment.criteria);
      
      // Get current segment users
      const currentUsersQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', segmentId)
      );
      const currentUsersSnapshot = await getDocs(currentUsersQuery);
      const currentUserIds = new Set(currentUsersSnapshot.docs.map(doc => doc.data().userId));
      
      const batch = writeBatch(db);
      let batchCount = 0;
      
      // Add new users to segment
      for (const userId of matchingUsers) {
        if (!currentUserIds.has(userId)) {
          const segmentUserRef = doc(collection(db, this.SEGMENT_USERS_COLLECTION));
          batch.set(segmentUserRef, {
            segmentId,
            userId,
            addedAt: serverTimestamp(),
            addedBy: 'system',
          });
          batchCount++;
          
          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }
        }
      }
      
      // Remove users no longer matching criteria
      const matchingUserIds = new Set(matchingUsers);
      for (const doc of currentUsersSnapshot.docs) {
        const userId = doc.data().userId;
        if (!matchingUserIds.has(userId)) {
          batch.delete(doc.ref);
          batchCount++;
          
          if (batchCount >= 500) {
            await batch.commit();
            batchCount = 0;
          }
        }
      }
      
      if (batchCount > 0) {
        await batch.commit();
      }
      
      // Update segment user count
      const segmentRef = doc(db, this.SEGMENTS_COLLECTION, segmentId);
      await updateDoc(segmentRef, {
        userCount: matchingUsers.length,
        lastUpdated: serverTimestamp(),
      });
      
      console.log(`✅ Updated segment ${segment.name}: ${matchingUsers.length} users`);
    } catch (error) {
      console.error('❌ Error updating segment users:', error);
      throw error;
    }
  }

  // Get users in segment
  async getSegmentUsers(segmentId: string, limit?: number): Promise<string[]> {
    try {
      const constraints = [where('segmentId', '==', segmentId)];
      
      if (limit) {
        constraints.push(orderBy('addedAt', 'desc'), limit(limit));
      }
      
      const q = query(collection(db, this.SEGMENT_USERS_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => doc.data().userId);
    } catch (error) {
      console.error('❌ Error getting segment users:', error);
      throw error;
    }
  }

  // Add user to segment manually
  async addUserToSegment(segmentId: string, userId: string, addedBy: string = 'manual'): Promise<void> {
    try {
      // Check if user already in segment
      const existingQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', segmentId),
        where('userId', '==', userId)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        console.warn(`⚠️ User ${userId} already in segment ${segmentId}`);
        return;
      }

      // Add user to segment
      await addDoc(collection(db, this.SEGMENT_USERS_COLLECTION), {
        segmentId,
        userId,
        addedAt: serverTimestamp(),
        addedBy,
      });

      // Update segment user count
      const segment = (await this.getUserSegments(true)).find(s => s.id === segmentId);
      if (segment) {
        const segmentRef = doc(db, this.SEGMENTS_COLLECTION, segmentId);
        await updateDoc(segmentRef, {
          userCount: segment.userCount + 1,
          lastUpdated: serverTimestamp(),
        });
      }
      
      console.log(`✅ Added user ${userId} to segment ${segmentId}`);
    } catch (error) {
      console.error('❌ Error adding user to segment:', error);
      throw error;
    }
  }

  // Remove user from segment
  async removeUserFromSegment(segmentId: string, userId: string): Promise<void> {
    try {
      const userSegmentQuery = query(
        collection(db, this.SEGMENT_USERS_COLLECTION),
        where('segmentId', '==', segmentId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(userSegmentQuery);
      
      if (snapshot.empty) {
        console.warn(`⚠️ User ${userId} not found in segment ${segmentId}`);
        return;
      }

      // Remove user from segment
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Update segment user count
      const segment = (await this.getUserSegments(true)).find(s => s.id === segmentId);
      if (segment && segment.userCount > 0) {
        const segmentRef = doc(db, this.SEGMENTS_COLLECTION, segmentId);
        await updateDoc(segmentRef, {
          userCount: segment.userCount - 1,
          lastUpdated: serverTimestamp(),
        });
      }
      
      console.log(`✅ Removed user ${userId} from segment ${segmentId}`);
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
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.SEGMENTATION_RULES_COLLECTION), rule);
      
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
        collection(db, this.SEGMENTATION_RULES_COLLECTION),
        where('isActive', '==', true)
      );
      const rulesSnapshot = await getDocs(rulesQuery);
      
      const rule = rulesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .find(r => r.id === ruleId) as SegmentationRule | undefined;
      
      if (!rule) {
        console.warn(`⚠️ Segmentation rule not found: ${ruleId}`);
        return;
      }

      // Check conditions
      if (rule.trigger.conditions) {
        const conditionsMet = rule.trigger.conditions.every(condition => {
          const fieldValue = eventData[condition.field];
          
          switch (condition.operator) {
            case 'equals':
              return fieldValue === condition.value;
            case 'not_equals':
              return fieldValue !== condition.value;
            case 'greater_than':
              return fieldValue > condition.value;
            case 'less_than':
              return fieldValue < condition.value;
            case 'contains':
              return String(fieldValue).includes(String(condition.value));
            default:
              return false;
          }
        });

        if (!conditionsMet) {
          console.log(`⏭️ Conditions not met for rule: ${ruleId}`);
          return;
        }
      }

      // Execute action with delay if specified
      const executeAction = async () => {
        switch (rule.action.type) {
          case 'add_to_segment':
            if (rule.action.segmentId) {
              await this.addUserToSegment(rule.action.segmentId, userId, 'rule');
            }
            break;
          case 'remove_from_segment':
            if (rule.action.segmentId) {
              await this.removeUserFromSegment(rule.action.segmentId, userId);
            }
            break;
          case 'create_segment':
            if (rule.action.segmentName) {
              const segmentId = await this.createUserSegment({
                name: rule.action.segmentName,
                description: `Auto-created by rule: ${rule.name}`,
                color: '#6366f1',
                criteria: { userTypes: ['all'] },
                isDynamic: false,
                isActive: true,
                tags: ['auto-created'],
                createdBy: 'system',
              });
              await this.addUserToSegment(segmentId, userId, 'rule');
            }
            break;
        }
      };

      if (rule.action.delay && rule.action.delay > 0) {
        setTimeout(executeAction, rule.action.delay * 60 * 1000);
      } else {
        await executeAction();
      }

      // Update rule analytics
      const ruleRef = doc(db, this.SEGMENTATION_RULES_COLLECTION, ruleId);
      await updateDoc(ruleRef, {
        'analytics.totalExecutions': rule.analytics.totalExecutions + 1,
        'analytics.lastExecuted': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log(`✅ Executed segmentation rule: ${rule.name}`);
    } catch (error) {
      console.error('❌ Error executing segmentation rule:', error);
      throw error;
    }
  }

  // ==================== ANALYTICS AND INSIGHTS ====================

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
      
      if (userIds.length === 0) {
        return {
          segment,
          insights: {
            growth: { daily: 0, weekly: 0, monthly: 0 },
            engagement: {
              averageSessionDuration: 0,
              averageNotificationOpenRate: 0,
              mostActiveHours: [],
              mostActiveDays: [],
            },
            behavior: {
              topBenefitsUsed: [],
              averageBenefitsPerUser: 0,
              retentionRate: 0,
            },
            demographics: {
              ageDistribution: [],
              genderDistribution: [],
              locationDistribution: [],
            },
            recommendations: ['Segment has no users. Consider adjusting criteria.'],
          },
        };
      }

      // Calculate insights (simplified implementation)
      const insights: SegmentInsights['insights'] = {
        growth: {
          daily: Math.floor(Math.random() * 10), // Mock data
          weekly: Math.floor(Math.random() * 50),
          monthly: Math.floor(Math.random() * 200),
        },
        engagement: {
          averageSessionDuration: Math.floor(Math.random() * 300) + 60,
          averageNotificationOpenRate: Math.random() * 100,
          mostActiveHours: [9, 12, 15, 18, 21],
          mostActiveDays: ['Monday', 'Wednesday', 'Friday'],
        },
        behavior: {
          topBenefitsUsed: [
            { benefitId: '1', benefitName: 'Descuento 20%', count: 45 },
            { benefitId: '2', benefitName: '2x1 en productos', count: 32 },
            { benefitId: '3', benefitName: 'Envío gratis', count: 28 },
          ],
          averageBenefitsPerUser: Math.random() * 5 + 1,
          retentionRate: Math.random() * 100,
        },
        demographics: {
          ageDistribution: [
            { range: '18-25', count: Math.floor(userIds.length * 0.2), percentage: 20 },
            { range: '26-35', count: Math.floor(userIds.length * 0.35), percentage: 35 },
            { range: '36-45', count: Math.floor(userIds.length * 0.25), percentage: 25 },
            { range: '46+', count: Math.floor(userIds.length * 0.2), percentage: 20 },
          ],
          genderDistribution: [
            { gender: 'Femenino', count: Math.floor(userIds.length * 0.55), percentage: 55 },
            { gender: 'Masculino', count: Math.floor(userIds.length * 0.43), percentage: 43 },
            { gender: 'Otro', count: Math.floor(userIds.length * 0.02), percentage: 2 },
          ],
          locationDistribution: [
            { location: 'Buenos Aires', count: Math.floor(userIds.length * 0.4), percentage: 40 },
            { location: 'Córdoba', count: Math.floor(userIds.length * 0.2), percentage: 20 },
            { location: 'Rosario', count: Math.floor(userIds.length * 0.15), percentage: 15 },
            { location: 'Otros', count: Math.floor(userIds.length * 0.25), percentage: 25 },
          ],
        },
        recommendations: this.generateRecommendations(segment, userIds.length),
      };

      return { segment, insights };
    } catch (error) {
      console.error('❌ Error getting segment insights:', error);
      throw error;
    }
  }

  // Get segmentation statistics
  async getSegmentationStats(): Promise<{
    totalSegments: number;
    activeSegments: number;
    dynamicSegments: number;
    staticSegments: number;
    totalUsers: number;
    averageSegmentSize: number;
    mostPopularSegments: { id: string; name: string; userCount: number }[];
    segmentGrowth: { daily: number; weekly: number; monthly: number };
  }> {
    try {
      const segments = await this.getUserSegments(true);
      
      const totalUsers = segments.reduce((sum, segment) => sum + segment.userCount, 0);
      const activeSegments = segments.filter(s => s.isActive);
      
      return {
        totalSegments: segments.length,
        activeSegments: activeSegments.length,
        dynamicSegments: segments.filter(s => s.isDynamic).length,
        staticSegments: segments.filter(s => !s.isDynamic).length,
        totalUsers,
        averageSegmentSize: segments.length > 0 ? Math.round(totalUsers / segments.length) : 0,
        mostPopularSegments: segments
          .sort((a, b) => b.userCount - a.userCount)
          .slice(0, 5)
          .map(s => ({ id: s.id, name: s.name, userCount: s.userCount })),
        segmentGrowth: {
          daily: Math.floor(Math.random() * 20),
          weekly: Math.floor(Math.random() * 100),
          monthly: Math.floor(Math.random() * 500),
        },
      };
    } catch (error) {
      console.error('❌ Error getting segmentation stats:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  // Get users matching criteria
  private async getUsersMatchingCriteria(criteria: UserSegment['criteria']): Promise<string[]> {
    try {
      // This is a simplified implementation
      // In a real app, you'd build complex queries based on the criteria
      
      const constraints = [];
      
      if (criteria.userTypes && criteria.userTypes.length > 0 && !criteria.userTypes.includes('all')) {
        constraints.push(where('role', 'in', criteria.userTypes));
      }
      
      if (criteria.associations && criteria.associations.length > 0) {
        constraints.push(where('asociacionId', 'in', criteria.associations));
      }

      // Add more criteria as needed
      if (criteria.behavior?.lastLoginDays) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - criteria.behavior.lastLoginDays);
        constraints.push(where('lastLoginAt', '>=', Timestamp.fromDate(cutoffDate)));
      }

      const q = query(collection(db, 'users'), ...constraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('❌ Error getting users matching criteria:', error);
      return [];
    }
  }

  // Generate recommendations
  private generateRecommendations(segment: UserSegment, userCount: number): string[] {
    const recommendations: string[] = [];
    
    if (userCount < 10) {
      recommendations.push('Considera ampliar los criterios de segmentación para incluir más usuarios.');
    }
    
    if (userCount > 10000) {
      recommendations.push('Segmento muy grande. Considera crear sub-segmentos más específicos.');
    }
    
    if (segment.analytics.averageOpenRate < 20) {
      recommendations.push('Baja tasa de apertura. Prueba personalizar más el contenido de las notificaciones.');
    }
    
    if (segment.analytics.usageCount === 0) {
      recommendations.push('Segmento no utilizado. Considera crear campañas dirigidas a este grupo.');
    }
    
    if (segment.isDynamic) {
      recommendations.push('Revisa periódicamente los criterios dinámicos para asegurar relevancia.');
    }
    
    return recommendations;
  }

  // Update all dynamic segments
  async updateAllDynamicSegments(): Promise<void> {
    try {
      const segments = await this.getUserSegments();
      const dynamicSegments = segments.filter(s => s.isDynamic && s.isActive);
      
      console.log(`🔄 Updating ${dynamicSegments.length} dynamic segments...`);
      
      for (const segment of dynamicSegments) {
        await this.updateSegmentUsers(segment.id);
        // Add delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`✅ Updated all dynamic segments`);
    } catch (error) {
      console.error('❌ Error updating dynamic segments:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userSegmentationService = new UserSegmentationService();