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
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Menu, Product, Category, ProductFilters, MenuFilters } from '../app/types';

// Export db for use in other modules
export { db };

export interface RealtimeCallbacks {
  onMenusChange?: (menus: Menu[]) => void;
  onProductsChange?: (products: Product[]) => void;
  onMenuChange?: (menu: Menu | null) => void;
  onProductChange?: (product: Product | null) => void;
  onCategoriesChange?: (categories: Category[]) => void;
  onError?: (error: Error) => void;
}

export class FirebaseDatabase {
  // Collections
  private static MENUS_COLLECTION = 'menus';
  private static PRODUCTS_COLLECTION = 'products';
  private static CATEGORIES_COLLECTION = 'categories';

  // Realtime listeners storage
  private static listeners: Map<string, Unsubscribe> = new Map();

  // Helper methods to convert Firestore documents
  private static docToMenu(doc: DocumentSnapshot<DocumentData>): Menu | null {
    if (!doc.exists()) return null;
    
    const data = doc.data();
    return {
        id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(),
      updatedAt: data?.updatedAt?.toDate?.() || new Date()
    } as Menu;
    }

  private static docToProduct(doc: DocumentSnapshot<DocumentData>): Product | null {
    if (!doc.exists()) return null;
    
    const data = doc.data();
      return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(),
      updatedAt: data?.updatedAt?.toDate?.() || new Date()
    } as Product;
    }

  private static docToCategory(doc: DocumentSnapshot<DocumentData>): Category | null {
    if (!doc.exists()) return null;
    
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(),
      updatedAt: data?.updatedAt?.toDate?.() || new Date()
    } as Category;
  }

  private static queryToMenus(snapshot: QuerySnapshot<DocumentData>): Menu[] {
    return snapshot.docs.map(doc => this.docToMenu(doc)).filter(Boolean) as Menu[];
  }

  private static queryToProducts(snapshot: QuerySnapshot<DocumentData>): Product[] {
    return snapshot.docs.map(doc => this.docToProduct(doc)).filter(Boolean) as Product[];
  }

  private static queryToCategories(snapshot: QuerySnapshot<DocumentData>): Category[] {
    return snapshot.docs.map(doc => this.docToCategory(doc)).filter(Boolean) as Category[];
  }

  // MENU OPERATIONS
  static async getMenus(filters?: MenuFilters): Promise<Menu[]> {
    try {
      const menusRef = collection(db, this.MENUS_COLLECTION);
      let q = query(menusRef, orderBy('createdAt', 'desc'));
      
      if (filters?.isActive !== undefined) {
        q = query(menusRef, where('isActive', '==', filters.isActive), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      let menus = this.queryToMenus(snapshot);
      
      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        menus = menus.filter(menu => 
          menu.name.toLowerCase().includes(searchTerm) ||
          menu.description.toLowerCase().includes(searchTerm)
        );
    }
      
      return menus;
    } catch (error) {
      console.error('Error getting menus:', error);
      throw new Error('Failed to fetch menus');
    }
  }

  static async getMenu(id: string): Promise<Menu | null> {
    try {
      const menuRef = doc(db, this.MENUS_COLLECTION, id);
      const snapshot = await getDoc(menuRef);
      return this.docToMenu(snapshot);
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
      // Delete menu and all associated products and categories
      const batch = writeBatch(db);
      
      // Delete menu
      const menuRef = doc(db, this.MENUS_COLLECTION, id);
      batch.delete(menuRef);
      
      // Delete associated products
      const productsSnapshot = await getDocs(
        query(collection(db, this.PRODUCTS_COLLECTION), where('menuId', '==', id))
      );
      productsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      // Delete associated categories
      const categoriesSnapshot = await getDocs(
        query(collection(db, this.CATEGORIES_COLLECTION), where('menuId', '==', id))
      );
      categoriesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw new Error('Failed to delete menu');
    }
  }

  // PRODUCT OPERATIONS
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const productsRef = collection(db, this.PRODUCTS_COLLECTION);
      let q = query(productsRef, orderBy('createdAt', 'desc'));
      
      // Apply filters
      if (filters?.menuId) {
        q = query(productsRef, where('menuId', '==', filters.menuId), orderBy('createdAt', 'desc'));
      }
      
      if (filters?.category) {
        const baseQuery = filters?.menuId 
          ? query(productsRef, where('menuId', '==', filters.menuId), where('category', '==', filters.category))
          : query(productsRef, where('category', '==', filters.category));
        q = query(baseQuery, orderBy('createdAt', 'desc'));
      }
      
      if (filters?.isAvailable !== undefined) {
        const baseQuery = filters?.menuId 
          ? query(productsRef, where('menuId', '==', filters.menuId), where('isAvailable', '==', filters.isAvailable))
          : query(productsRef, where('isAvailable', '==', filters.isAvailable));
        q = query(baseQuery, orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      let products = this.queryToProducts(snapshot);
      
      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply tags filter
      if (filters?.tags && filters.tags.length > 0) {
        products = products.filter(product => 
          product.tags?.some(tag => filters.tags!.includes(tag))
        );
    }
      
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to fetch products');
  }
}

  static async getProduct(id: string): Promise<Product | null> {
    try {
      const productRef = doc(db, this.PRODUCTS_COLLECTION, id);
      const snapshot = await getDoc(productRef);
      return this.docToProduct(snapshot);
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

  // CATEGORY OPERATIONS
  static async getCategories(menuId?: string): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, this.CATEGORIES_COLLECTION);
      let q = query(categoriesRef, orderBy('order', 'asc'));
      
      if (menuId) {
        q = query(categoriesRef, where('menuId', '==', menuId), orderBy('order', 'asc'));
      }
      
      const snapshot = await getDocs(q);
      return this.queryToCategories(snapshot);
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  static async getCategory(id: string): Promise<Category | null> {
    try {
      const categoryRef = doc(db, this.CATEGORIES_COLLECTION, id);
      const snapshot = await getDoc(categoryRef);
      return this.docToCategory(snapshot);
    } catch (error) {
      console.error('Error getting category:', error);
      throw new Error('Failed to fetch category');
    }
  }

  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const categoriesRef = collection(db, this.CATEGORIES_COLLECTION);
      const docRef = await addDoc(categoriesRef, {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  static async updateCategory(id: string, categoryData: Partial<Category>): Promise<void> {
    try {
      const categoryRef = doc(db, this.CATEGORIES_COLLECTION, id);
      await updateDoc(categoryRef, {
        ...categoryData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      const categoryRef = doc(db, this.CATEGORIES_COLLECTION, id);
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  // REALTIME SUBSCRIPTIONS
  static subscribeToMenus(
    callback: (menus: Menu[]) => void, 
    filters?: MenuFilters,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const menusRef = collection(db, this.MENUS_COLLECTION);
      let q = query(menusRef, orderBy('createdAt', 'desc'));
      
      if (filters?.isActive !== undefined) {
        q = query(menusRef, where('isActive', '==', filters.isActive), orderBy('createdAt', 'desc'));
      }
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          let menus = this.queryToMenus(snapshot);
          
          // Apply search filter
          if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            menus = menus.filter(menu => 
              menu.name.toLowerCase().includes(searchTerm) ||
              menu.description.toLowerCase().includes(searchTerm)
            );
          }
          
          callback(menus);
        },
        (error) => {
          console.error('Error in menus subscription:', error);
          onError?.(error);
        }
      );

      const listenerId = `menus_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);
      
      return () => {
        unsubscribe();
        this.listeners.delete(listenerId);
      };
    } catch (error) {
      console.error('Error setting up menus subscription:', error);
      onError?.(error as Error);
      return () => {};
    }
  }

  static subscribeToProducts(
    callback: (products: Product[]) => void, 
    filters?: ProductFilters,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const productsRef = collection(db, this.PRODUCTS_COLLECTION);
      let q = query(productsRef, orderBy('createdAt', 'desc'));
      
      if (filters?.menuId) {
        q = query(productsRef, where('menuId', '==', filters.menuId), orderBy('createdAt', 'desc'));
      }
      
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          let products = this.queryToProducts(snapshot);
          
          // Apply additional filters
          if (filters?.category) {
            products = products.filter(p => p.category === filters.category);
          }
          
          if (filters?.isAvailable !== undefined) {
            products = products.filter(p => p.isAvailable === filters.isAvailable);
          }
          
          if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            products = products.filter(product => 
              product.name.toLowerCase().includes(searchTerm) ||
              product.description?.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters?.tags && filters.tags.length > 0) {
            products = products.filter(product => 
              product.tags?.some(tag => filters.tags!.includes(tag))
            );
          }
          
          callback(products);
        },
        (error) => {
          console.error('Error in products subscription:', error);
          onError?.(error);
        }
      );

      const listenerId = `products_${filters?.menuId || 'all'}_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);
      
      return () => {
        unsubscribe();
        this.listeners.delete(listenerId);
      };
    } catch (error) {
      console.error('Error setting up products subscription:', error);
      onError?.(error as Error);
      return () => {};
    }
  }

  static subscribeToCategories(
    callback: (categories: Category[]) => void, 
    menuId?: string,
    onError?: (error: Error) => void
  ): Unsubscribe {
    try {
      const categoriesRef = collection(db, this.CATEGORIES_COLLECTION);
      let q = query(categoriesRef, orderBy('order', 'asc'));
      
      if (menuId) {
        q = query(categoriesRef, where('menuId', '==', menuId), orderBy('order', 'asc'));
      }
      
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const categories = this.queryToCategories(snapshot);
          callback(categories);
        },
        (error) => {
          console.error('Error in categories subscription:', error);
          onError?.(error);
        }
      );

      const listenerId = `categories_${menuId || 'all'}_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);
      
      return () => {
        unsubscribe();
        this.listeners.delete(listenerId);
      };
    } catch (error) {
      console.error('Error setting up categories subscription:', error);
      onError?.(error as Error);
      return () => {};
    }
  }

  static subscribeToMenu(id: string, callback: (menu: Menu | null) => void, onError?: (error: Error) => void): Unsubscribe {
    try {
      const menuRef = doc(db, this.MENUS_COLLECTION, id);
      
      const unsubscribe = onSnapshot(menuRef,
        (snapshot) => {
          const menu = this.docToMenu(snapshot);
          callback(menu);
        },
        (error) => {
          console.error('Error in menu subscription:', error);
          onError?.(error);
        }
      );

      const listenerId = `menu_${id}_${Date.now()}`;
      this.listeners.set(listenerId, unsubscribe);
      
      return () => {
        unsubscribe();
        this.listeners.delete(listenerId);
      };
    } catch (error) {
      console.error('Error setting up menu subscription:', error);
      onError?.(error as Error);
      return () => {};
    }
  }

  // BATCH OPERATIONS
  static async initializeDatabase(initialData: { 
    menus: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>[], 
    products: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[],
    categories?: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[]
  }): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Clear existing data
      const [menusSnapshot, productsSnapshot, categoriesSnapshot] = await Promise.all([
        getDocs(collection(db, this.MENUS_COLLECTION)),
        getDocs(collection(db, this.PRODUCTS_COLLECTION)),
        getDocs(collection(db, this.CATEGORIES_COLLECTION))
      ]);
      
      menusSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      productsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      categoriesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      
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
      
      if (initialData.categories) {
        initialData.categories.forEach(category => {
          const categoryRef = doc(collection(db, this.CATEGORIES_COLLECTION));
          batch.set(categoryRef, {
            ...category,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
      }
      
      await batch.commit();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  static async exportData(): Promise<{ menus: Menu[], products: Product[], categories: Category[] }> {
    try {
      const [menus, products, categories] = await Promise.all([
        this.getMenus(),
        this.getProducts(),
        this.getCategories()
      ]);
      
      return { menus, products, categories };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  // Cleanup all listeners
  static unsubscribeAll(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners.clear();
  }
}