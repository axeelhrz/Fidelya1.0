import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';

export interface RegisteredUser {
  id: string;
  uid: string;
  nombre: string;
  email: string;
  telefono?: string;
  dni?: string;
  role: string;
  estado: string;
  creadoEn: Date;
  ultimoAcceso?: Date;
  avatar?: string;
  metadata?: Record<string, unknown>;
}

export interface UserSearchFilters {
  search?: string;
  role?: string;
  estado?: string;
  excludeAsociacionId?: string;
}

export interface UserSearchResult {
  users: RegisteredUser[];
  total: number;
  hasMore: boolean;
}

class UserSearchService {
  private readonly usersCollection = COLLECTIONS.USERS;
  private readonly sociosCollection = COLLECTIONS.SOCIOS;

  /**
   * Search for registered users that can be added as socios
   */
  async searchRegisteredUsers(
    filters: UserSearchFilters = {},
    pageSize = 10
  ): Promise<UserSearchResult> {
    try {
      console.log('🔍 Searching users with filters:', filters);

      // First, get existing socios for the association to exclude them
      const existingSociosEmails = await this.getExistingSociosEmails(filters.excludeAsociacionId);
      console.log('📧 Existing socios emails:', existingSociosEmails);

      // Build base query for users collection
      let q = query(
        collection(db, this.usersCollection),
        where('estado', '==', 'activo'),
        orderBy('nombre', 'asc'),
        limit(pageSize + 1) // Get one extra to check if there are more
      );

      // If searching for socios specifically, filter by role
      if (filters.role === 'socio') {
        q = query(
          collection(db, this.usersCollection),
          where('role', '==', 'socio'),
          where('estado', '==', 'activo'),
          orderBy('nombre', 'asc'),
          limit(pageSize + 1)
        );
      }

      console.log('🔍 Executing Firestore query...');
      
      // Execute query
      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      
      console.log(`📊 Found ${docs.length} users in Firestore`);
      
      const hasMore = docs.length > pageSize;

      if (hasMore) {
        docs.pop(); // Remove the extra document
      }

      let users = docs.map(doc => {
        const data = doc.data();
        console.log('👤 Processing user:', { id: doc.id, nombre: data.nombre, email: data.email, role: data.role });
        
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono,
          dni: data.dni,
          role: data.role || '',
          estado: data.estado || 'activo',
          creadoEn: data.creadoEn?.toDate() || new Date(),
          ultimoAcceso: data.ultimoAcceso?.toDate(),
          avatar: data.avatar,
          metadata: data.metadata,
        } as RegisteredUser;
      });

      console.log(`👥 Processed ${users.length} users`);

      // Filter out existing socios
      const usersBeforeFilter = users.length;
      users = users.filter(user => !existingSociosEmails.includes(user.email.toLowerCase()));
      console.log(`🚫 Filtered out ${usersBeforeFilter - users.length} existing socios`);

      // Apply client-side search filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        console.log('🔍 Applying search filter:', searchTerm);
        
        const usersBeforeSearch = users.length;
        users = users.filter(user =>
          user.nombre.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.dni && user.dni.toLowerCase().includes(searchTerm)) ||
          (user.telefono && user.telefono.includes(searchTerm))
        );
        console.log(`🔍 Search filtered: ${usersBeforeSearch} -> ${users.length} users`);
      }

      console.log(`✅ Final result: ${users.length} users found`);

      return {
        users,
        total: users.length,
        hasMore: hasMore && users.length === pageSize
      };
    } catch (error) {
      console.error('❌ Error in searchRegisteredUsers:', error);
      handleError(error, 'Search Registered Users');
      return {
        users: [],
        total: 0,
        hasMore: false
      };
    }
  }

  /**
   * Get user by ID for detailed information
   */
  async getUserById(userId: string): Promise<RegisteredUser | null> {
    try {
      console.log('🔍 Getting user by ID:', userId);
      
      // Try to get user by document ID first
      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('✅ Found user by document ID:', data.nombre);
        
        return {
          id: userDoc.id,
          uid: data.uid || userDoc.id,
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono,
          dni: data.dni,
          role: data.role || '',
          estado: data.estado || 'activo',
          creadoEn: data.creadoEn?.toDate() || new Date(),
          ultimoAcceso: data.ultimoAcceso?.toDate(),
          avatar: data.avatar,
          metadata: data.metadata,
        } as RegisteredUser;
      }

      // If not found by document ID, try by uid field
      const userQuery = query(
        collection(db, this.usersCollection),
        where('uid', '==', userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);
      
      if (snapshot.empty) {
        console.log('❌ User not found:', userId);
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      console.log('✅ Found user by uid field:', data.nombre);

      return {
        id: doc.id,
        uid: data.uid || doc.id,
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono,
        dni: data.dni,
        role: data.role || '',
        estado: data.estado || 'activo',
        creadoEn: data.creadoEn?.toDate() || new Date(),
        ultimoAcceso: data.ultimoAcceso?.toDate(),
        avatar: data.avatar,
        metadata: data.metadata,
      } as RegisteredUser;
    } catch (error) {
      console.error('❌ Error getting user by ID:', error);
      handleError(error, 'Get User By ID');
      return null;
    }
  }

  /**
   * Check if user can be added as socio
   */
  async canAddAsSocio(userId: string, asociacionId: string): Promise<{
    canAdd: boolean;
    reason?: string;
  }> {
    try {
      console.log('🔍 Checking if user can be added as socio:', { userId, asociacionId });
      
      // Check if user exists
      const user = await this.getUserById(userId);
      if (!user) {
        console.log('❌ User not found');
        return { canAdd: false, reason: 'Usuario no encontrado' };
      }

      // Check if user is active
      if (user.estado !== 'activo') {
        console.log('❌ User not active:', user.estado);
        return { canAdd: false, reason: 'El usuario no está activo' };
      }

      // Check if user is already a socio in this association
      const existingSocioQuery = query(
        collection(db, this.sociosCollection),
        where('email', '==', user.email.toLowerCase()),
        where('asociacionId', '==', asociacionId),
        limit(1)
      );

      const existingSocioSnapshot = await getDocs(existingSocioQuery);
      if (!existingSocioSnapshot.empty) {
        console.log('❌ User already is socio in this association');
        return { canAdd: false, reason: 'El usuario ya es socio de esta asociación' };
      }

      console.log('✅ User can be added as socio');
      return { canAdd: true };
    } catch (error) {
      console.error('❌ Error checking if user can be added as socio:', error);
      handleError(error, 'Can Add As Socio');
      return { canAdd: false, reason: 'Error al verificar el usuario' };
    }
  }

  /**
   * Get emails of existing socios for an association
   */
  private async getExistingSociosEmails(asociacionId?: string): Promise<string[]> {
    if (!asociacionId) {
      console.log('⚠️ No asociacionId provided for filtering existing socios');
      return [];
    }

    try {
      console.log('🔍 Getting existing socios emails for association:', asociacionId);
      
      const sociosQuery = query(
        collection(db, this.sociosCollection),
        where('asociacionId', '==', asociacionId)
      );

      const snapshot = await getDocs(sociosQuery);
      const emails = snapshot.docs.map(doc => doc.data().email?.toLowerCase() || '').filter(Boolean);
      
      console.log(`📧 Found ${emails.length} existing socios emails:`, emails);
      return emails;
    } catch (error) {
      console.error('❌ Error getting existing socios emails:', error);
      return [];
    }
  }

  /**
   * Search users by email specifically
   */
  async searchByEmail(email: string, excludeAsociacionId?: string): Promise<RegisteredUser[]> {
    try {
      console.log('🔍 Searching users by email:', email);
      
      const userQuery = query(
        collection(db, this.usersCollection),
        where('email', '==', email.toLowerCase()),
        where('estado', '==', 'activo'),
        limit(5)
      );

      const snapshot = await getDocs(userQuery);
      
      if (snapshot.empty) {
        console.log('❌ No users found with email:', email);
        return [];
      }

      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono,
          dni: data.dni,
          role: data.role || '',
          estado: data.estado || 'activo',
          creadoEn: data.creadoEn?.toDate() || new Date(),
          ultimoAcceso: data.ultimoAcceso?.toDate(),
          avatar: data.avatar,
          metadata: data.metadata,
        } as RegisteredUser;
      });

      console.log(`✅ Found ${users.length} users with email ${email}`);

      // Filter out existing socios if association ID is provided
      if (excludeAsociacionId) {
        const existingSociosEmails = await this.getExistingSociosEmails(excludeAsociacionId);
        const filteredUsers = users.filter(user => !existingSociosEmails.includes(user.email.toLowerCase()));
        console.log(`🚫 After filtering existing socios: ${filteredUsers.length} users`);
        return filteredUsers;
      }

      return users;
    } catch (error) {
      console.error('❌ Error searching by email:', error);
      handleError(error, 'Search By Email');
      return [];
    }
  }

  /**
   * Debug method to check collections and data
   */
  async debugCollections(): Promise<void> {
    try {
      console.log('🔍 DEBUG: Checking collections...');
      
      // Check users collection
      const usersQuery = query(collection(db, this.usersCollection), limit(5));
      const usersSnapshot = await getDocs(usersQuery);
      console.log(`👥 Users collection: ${usersSnapshot.docs.length} documents`);
      
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`  - User: ${data.nombre} (${data.email}) - Role: ${data.role} - Estado: ${data.estado}`);
      });

      // Check socios collection
      const sociosQuery = query(collection(db, this.sociosCollection), limit(5));
      const sociosSnapshot = await getDocs(sociosQuery);
      console.log(`👤 Socios collection: ${sociosSnapshot.docs.length} documents`);
      
      sociosSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`  - Socio: ${data.nombre} (${data.email}) - AsociacionId: ${data.asociacionId}`);
      });
      
    } catch (error) {
      console.error('❌ Error in debug:', error);
    }
  }
}

// Export singleton instance
export const userSearchService = new UserSearchService();
export default userSearchService;