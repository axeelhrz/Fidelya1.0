import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Menu, Product, Category } from '../app/types';

// Export db for use in other modules
export { db };

export class FirebaseDatabase {
  // Collections
  private static MENUS_COLLECTION = 'menus';
  private static PRODUCTS_COLLECTION = 'products';
  private static CATEGORIES_COLLECTION = 'categories';

  // Menu operations
  static async getMenus(): Promise<Menu[]> {
    try {
      const menusRef = collection(db, this.MENUS_COLLECTION);
      const q = query(menusRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
      })) as Menu[];
    } catch (error) {
      console.error('Error getting menus:', error);
      throw new Error('Failed to fetch menus');
    }
  }

  static async getMenu(id: string): Promise<Menu | null> {
    try {
      const menuRef = doc(db, this.MENUS_COLLECTION, id);
      const snapshot = await getDoc(menuRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date()
      } as Menu;
    } catch (error) {
      console.error('Error getting menu:', error);
      throw new Error('Failed to fetch menu');
    }
  }

  static async createMenu(menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const menusRef = collection(db, this.MENUS_COLLECTION);
      const docRef = await addDoc(menusRef, {
        ...menuData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw new Error('Failed to create menu');
    }
  }

  static async updateMenu(id: string, menuData: Partial<Menu>): Promise<void> {
    try {
      const menuRef = doc(db, this.MENUS_COLLECTION, id);
      await updateDoc(menuRef, {
        ...menuData,
          updatedAt: serverTimestamp() 
        });
    } catch (error) {
      console.error('Error updating menu:', error);
      throw new Error('Failed to update menu');
    }
  }

  static async deleteMenu(id: string): Promise<void> {
    try {
      const menuRef = doc(db, this.MENUS_COLLECTION, id);
      await deleteDoc(menuRef);
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw new Error('Failed to delete menu');
    }
  }

  // Product operations
  static async getProducts(menuId?: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.PRODUCTS_COLLECTION);
      let q = query(productsRef, orderBy('createdAt', 'desc'));
      
      if (menuId) {
        q = query(productsRef, where('menuId', '==', menuId), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  static async getProduct(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, this.PRODUCTS_COLLECTION, id);
      const snapshot = await getDoc(productRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate?.() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate?.() || new Date()
      } as Product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const productsRef = collection(db, this.PRODUCTS_COLLECTION);
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  static async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, this.PRODUCTS_COLLECTION, id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      const productRef = doc(db, this.PRODUCTS_COLLECTION, id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  // Batch operations
  static async initializeDatabase(initialData: { menus: Menu[], products: Product[] }): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Clear existing data
      const [menusSnapshot, productsSnapshot] = await Promise.all([
        getDocs(collection(db, this.MENUS_COLLECTION)),
        getDocs(collection(db, this.PRODUCTS_COLLECTION))
      ]);
      
      menusSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      productsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Add new data
      initialData.menus.forEach(menu => {
        const menuRef = doc(collection(db, this.MENUS_COLLECTION));
        batch.set(menuRef, {
          ...menu,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      initialData.products.forEach(product => {
        const productRef = doc(collection(db, this.PRODUCTS_COLLECTION));
        batch.set(productRef, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  static async exportData(): Promise<{ menus: Menu[], products: Product[] }> {
    try {
      const [menus, products] = await Promise.all([
        this.getMenus(),
        this.getProducts()
      ]);
      
      return { menus, products };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }
}
