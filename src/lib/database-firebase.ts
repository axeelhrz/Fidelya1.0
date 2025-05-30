import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
  Firestore
} from 'firebase/firestore';
import { db } from './firebase';
import { Menu, Product, MenuData, ProductCategory } from '../app/types';

// Tipos para callbacks en tiempo real
type MenuCallback = (menu: MenuData | null) => void;
type MenusCallback = (menus: Menu[]) => void;
type ProductsCallback = (products: Product[]) => void;

class FirebaseDatabaseAPI {
  private menusCollection = 'menus';
  private productsCollection = 'products';
  private categoriesCollection = 'categories';

  // Verificar si Firebase está disponible
  private isFirebaseAvailable(): boolean {
    return !!db;
  }

  // Obtener instancia de Firestore con tipo seguro
  private getFirestore(): Firestore {
    if (!db) {
      throw new Error('Firebase no está configurado correctamente');
    }
    return db;
  }

  // Manejar errores de Firebase
  private handleError(error: unknown, operation: string) {
    console.error(`Error en ${operation}:`, error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`Error en ${operation}: ${message}`);
  }

  // Convertir timestamp de Firebase a string
  private convertTimestamp(timestamp: { toDate(): Date } | Date | string | number | null | undefined): string {
    if (!timestamp) return new Date().toISOString();
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) return timestamp.toDate().toISOString();
    if (timestamp instanceof Date) return timestamp.toISOString();
    if (typeof timestamp === 'string') return new Date(timestamp).toISOString();
    if (typeof timestamp === 'number') return new Date(timestamp).toISOString();
    return new Date().toISOString();
  }

  // ==================== FUNCIONES EN TIEMPO REAL ====================

  // Suscribirse a cambios en un menú específico con productos
  subscribeToMenu(menuId: string, callback: MenuCallback): Unsubscribe {
    if (!this.isFirebaseAvailable()) {
      callback(null);
      return () => {};
    }

    try {
      const firestore = this.getFirestore();
      const menuRef = doc(firestore, this.menusCollection, menuId);
      const productsQuery = query(
        collection(firestore, this.productsCollection),
        where('menuId', '==', menuId),
        orderBy('category'),
        orderBy('name')
      );

      let menuData: Menu | null = null;
      let products: Product[] = [];
      let unsubscribeCount = 0;

      const updateCallback = () => {
        if (menuData && unsubscribeCount === 2) {
          const menuWithProducts: MenuData = {
            ...menuData,
            products: products
          };
          callback(menuWithProducts);
        }
      };

      // Listener para el menú
      const unsubscribeMenu = onSnapshot(menuRef, (doc) => {
        if (doc.exists()) {
          menuData = {
            id: doc.id,
            ...doc.data(),
            createdAt: this.convertTimestamp(doc.data().createdAt),
            updatedAt: this.convertTimestamp(doc.data().updatedAt)
          } as Menu;
        } else {
          menuData = null;
        }
        unsubscribeCount = Math.max(unsubscribeCount, 1);
        updateCallback();
      });

      // Listener para los productos
      const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
        products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isAvailable: doc.data().isAvailable ?? true
        } as Product));
        unsubscribeCount = Math.max(unsubscribeCount, 2);
        updateCallback();
      });

      // Retornar función para cancelar ambas suscripciones
      return () => {
        unsubscribeMenu();
        unsubscribeProducts();
      };
    } catch (error) {
      console.error('Error suscribiéndose al menú:', error);
      callback(null);
      return () => {};
    }
  }

  // Suscribirse a cambios en todos los menús
  subscribeToMenus(callback: MenusCallback): Unsubscribe {
    if (!this.isFirebaseAvailable()) {
      callback([]);
      return () => {};
    }

    try {
      const firestore = this.getFirestore();
      const menusQuery = query(
        collection(firestore, this.menusCollection),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(menusQuery, (snapshot) => {
        const menus = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: this.convertTimestamp(doc.data().createdAt),
          updatedAt: this.convertTimestamp(doc.data().updatedAt)
        } as Menu));
        callback(menus);
      });
    } catch (error) {
      console.error('Error suscribiéndose a menús:', error);
      callback([]);
      return () => {};
    }
  }

  // Suscribirse a cambios en productos de un menú
  subscribeToProducts(menuId: string, callback: ProductsCallback): Unsubscribe {
    if (!this.isFirebaseAvailable()) {
      callback([]);
      return () => {};
    }

    try {
      const firestore = this.getFirestore();
      const productsQuery = query(
        collection(firestore, this.productsCollection),
        where('menuId', '==', menuId),
        orderBy('category'),
        orderBy('name')
      );

      return onSnapshot(productsQuery, (snapshot) => {
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isAvailable: doc.data().isAvailable ?? true
        } as Product));
        callback(products);
      });
    } catch (error) {
      console.error('Error suscribiéndose a productos:', error);
      callback([]);
      return () => {};
    }
  }

  // ==================== OPERACIONES CRUD MEJORADAS ====================

  async getMenus(): Promise<Menu[]> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const q = query(collection(firestore, this.menusCollection), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: this.convertTimestamp(doc.data().createdAt),
        updatedAt: this.convertTimestamp(doc.data().updatedAt)
      } as Menu));
    } catch (error) {
      this.handleError(error, 'obtener menús');
      return [];
    }
  }

  async getMenuWithProducts(id: string): Promise<MenuData | null> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const [menu, products] = await Promise.all([
        this.getMenu(id),
        this.getProductsByMenu(id)
      ]);

      if (!menu) return null;

      return {
        ...menu,
        products: products
      };
    } catch (error) {
      this.handleError(error, 'obtener menú con productos');
      return null;
    }
  }

  async getMenu(id: string): Promise<Menu | null> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const docRef = doc(firestore, this.menusCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: this.convertTimestamp(docSnap.data().createdAt),
          updatedAt: this.convertTimestamp(docSnap.data().updatedAt)
        } as Menu;
      }
      return null;
    } catch (error) {
      this.handleError(error, 'obtener menú');
      return null;
    }
  }

  async createMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const menuData = {
        ...menu,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: menu.isActive ?? true
      };
      
      const docRef = await addDoc(collection(firestore, this.menusCollection), menuData);
      
      return {
        id: docRef.id,
        ...menu,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: menu.isActive ?? true
      };
    } catch (error) {
      this.handleError(error, 'crear menú');
      throw error;
    }
  }

  async updateMenu(id: string, menu: Partial<Menu>): Promise<Menu> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const docRef = doc(firestore, this.menusCollection, id);
      const updateData = {
        ...menu,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: this.convertTimestamp(updatedDoc.data()?.createdAt),
        updatedAt: this.convertTimestamp(updatedDoc.data()?.updatedAt)
      } as Menu;
    } catch (error) {
      this.handleError(error, 'actualizar menú');
      throw error;
    }
  }

  async deleteMenu(id: string): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const batch = writeBatch(firestore);
      
      // Eliminar todos los productos del menú
      const productsQuery = query(
        collection(firestore, this.productsCollection),
        where('menuId', '==', id)
      );
      const productsSnapshot = await getDocs(productsQuery);
      
      productsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Eliminar el menú
      batch.delete(doc(firestore, this.menusCollection, id));
      
      await batch.commit();
    } catch (error) {
      this.handleError(error, 'eliminar menú');
    }
  }

  // ==================== OPERACIONES DE PRODUCTOS ====================

  async getProducts(): Promise<Product[]> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const q = query(
        collection(firestore, this.productsCollection),
        orderBy('category'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isAvailable: doc.data().isAvailable ?? true
      } as Product));
    } catch (error) {
      this.handleError(error, 'obtener productos');
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const docRef = doc(firestore, this.productsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          isAvailable: docSnap.data().isAvailable ?? true
        } as Product;
      }
      return null;
    } catch (error) {
      this.handleError(error, 'obtener producto');
      return null;
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const productData = {
        ...product,
        isAvailable: product.isAvailable ?? true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(firestore, this.productsCollection), productData);
      
      return {
        id: docRef.id,
        ...product,
        isAvailable: product.isAvailable ?? true
      };
    } catch (error) {
      this.handleError(error, 'crear producto');
      throw error;
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const docRef = doc(firestore, this.productsCollection, id);
      const updateData = {
        ...product,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        isAvailable: updatedDoc.data()?.isAvailable ?? true
      } as Product;
    } catch (error) {
      this.handleError(error, 'actualizar producto');
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      await deleteDoc(doc(firestore, this.productsCollection, id));
    } catch (error) {
      this.handleError(error, 'eliminar producto');
    }
  }

  async getProductsByMenu(menuId: string): Promise<Product[]> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const q = query(
        collection(firestore, this.productsCollection),
        where('menuId', '==', menuId),
        orderBy('category'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isAvailable: doc.data().isAvailable ?? true
      } as Product));
    } catch (error) {
      this.handleError(error, 'obtener productos por menú');
      return [];
    }
  }

  // ==================== OPERACIONES BATCH ====================

  async updateProductsAvailability(productIds: string[], isAvailable: boolean): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      const batch = writeBatch(firestore);
      
      productIds.forEach(productId => {
        const productRef = doc(firestore, this.productsCollection, productId);
        batch.update(productRef, {
          isAvailable,
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      this.handleError(error, 'actualizar disponibilidad de productos');
    }
  }

  async duplicateMenu(menuId: string, newName: string): Promise<Menu> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const originalMenu = await this.getMenu(menuId);
      if (!originalMenu) {
        throw new Error('Menú original no encontrado');
      }

      const products = await this.getProductsByMenu(menuId);
      
      // Crear nuevo menú
      const newMenu = await this.createMenu({
        name: newName,
        description: `Copia de ${originalMenu.description}`,
        isActive: false
      });

      // Crear productos duplicados
      const firestore = this.getFirestore();
      const batch = writeBatch(firestore);
      products.forEach(product => {
        const newProductRef = doc(collection(firestore, this.productsCollection));
        batch.set(newProductRef, {
          ...product,
          menuId: newMenu.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return newMenu;
    } catch (error) {
      this.handleError(error, 'duplicar menú');
      throw error;
    }
  }

  // ==================== GESTIÓN DE CATEGORÍAS ====================

  async getCategories(): Promise<ProductCategory[]> {
    if (!this.isFirebaseAvailable()) {
      return ['Entrada', 'Principal', 'Bebida', 'Postre'];
    }
    try {
      const firestore = this.getFirestore();
      const querySnapshot = await getDocs(collection(firestore, this.categoriesCollection));
      if (querySnapshot.empty) {
        return ['Entrada', 'Principal', 'Bebida', 'Postre'];
      }
      return querySnapshot.docs.map(doc => doc.data().name as ProductCategory);
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return ['Entrada', 'Principal', 'Bebida', 'Postre'];
    }
  }

  async createCategory(name: ProductCategory): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      await setDoc(doc(firestore, this.categoriesCollection, name), {
        name,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      this.handleError(error, 'crear categoría');
    }
  }

  // ==================== INICIALIZACIÓN Y UTILIDADES ====================

  async initializeDatabase(): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const firestore = this.getFirestore();
      
      // Datos iniciales para el restaurante
      const initialMenu = {
        name: 'Carta Principal',
        description: 'Nuestra selección completa de bebidas y comidas',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const menuRef = await addDoc(collection(firestore, this.menusCollection), initialMenu);
      
      // Productos iniciales más completos
      const initialProducts = [
        // Entradas
        {
          name: 'Tabla de Quesos',
          price: 3500,
          description: 'Selección de quesos artesanales con frutos secos y mermelada',
          category: 'Entrada',
          isRecommended: true,
          isVegan: false,
          isAvailable: true,
          menuId: menuRef.id
        },
        {
          name: 'Bruschetta Vegana',
          price: 2800,
          description: 'Pan tostado con tomate, albahaca y aceite de oliva',
          category: 'Entrada',
          isRecommended: false,
          isVegan: true,
          isAvailable: true,
          menuId: menuRef.id
        },
        // Principales
        {
          name: 'Hamburguesa Clásica',
          price: 4200,
          description: 'Carne, lechuga, tomate, queso y papas fritas',
          category: 'Principal',
          isRecommended: true,
          isVegan: false,
          isAvailable: true,
          menuId: menuRef.id
        },
        {
          name: 'Pasta Primavera',
          price: 3800,
          description: 'Pasta con vegetales frescos y salsa de tomate',
          category: 'Principal',
          isRecommended: false,
          isVegan: true,
          isAvailable: true,
          menuId: menuRef.id
        },
        // Bebidas
        {
          name: 'Cerveza Artesanal',
          price: 2800,
          description: 'Cerveza artesanal local, 500ml',
          category: 'Bebida',
          isRecommended: true,
          isVegan: true,
          isAvailable: true,
          menuId: menuRef.id
        },
        {
          name: 'Limonada Natural',
          price: 1800,
          description: 'Limonada fresca con menta',
          category: 'Bebida',
          isRecommended: false,
          isVegan: true,
          isAvailable: true,
          menuId: menuRef.id
        },
        // Postres
        {
          name: 'Tiramisú',
          price: 2500,
          description: 'Clásico postre italiano con café y mascarpone',
          category: 'Postre',
          isRecommended: true,
          isVegan: false,
          isAvailable: true,
          menuId: menuRef.id
        },
        {
          name: 'Helado Vegano',
          price: 2200,
          description: 'Helado de coco con frutas del bosque',
          category: 'Postre',
          isRecommended: false,
          isVegan: true,
          isAvailable: true,
          menuId: menuRef.id
        }
      ];

      const batch = writeBatch(firestore);
      initialProducts.forEach(product => {
        const productRef = doc(collection(firestore, this.productsCollection));
        batch.set(productRef, {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      // Inicializar categorías
      const categories: ProductCategory[] = ['Entrada', 'Principal', 'Bebida', 'Postre'];
      const categoryBatch = writeBatch(firestore);
      categories.forEach(category => {
        const categoryRef = doc(firestore, this.categoriesCollection, category);
        categoryBatch.set(categoryRef, {
          name: category,
          createdAt: serverTimestamp()
        });
      });

      await categoryBatch.commit();

      console.log('✅ Base de datos inicializada con datos completos del restaurante');
    } catch (error) {
      this.handleError(error, 'inicializar base de datos');
    }
  }

  async exportData(): Promise<{ menus: Menu[], products: Product[] }> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }

    try {
      const [menus, products] = await Promise.all([
        this.getMenus(),
        this.getProducts()
      ]);

      return { menus, products };
    } catch (error) {
      this.handleError(error, 'exportar datos');
      return { menus: [], products: [] };
    }
  }

  async getStatistics(): Promise<{
    totalMenus: number;
    totalProducts: number;
    productsByCategory: Record<string, number>;
    availableProducts: number;
    recommendedProducts: number;
    veganProducts: number;
  }> {
    if (!this.isFirebaseAvailable()) {
      return {
        totalMenus: 0,
        totalProducts: 0,
        productsByCategory: {},
        availableProducts: 0,
        recommendedProducts: 0,
        veganProducts: 0
      };
    }

    try {
      const [menus, products] = await Promise.all([
        this.getMenus(),
        this.getProducts()
      ]);

      const productsByCategory = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalMenus: menus.length,
        totalProducts: products.length,
        productsByCategory,
        availableProducts: products.filter(p => p.isAvailable).length,
        recommendedProducts: products.filter(p => p.isRecommended).length,
        veganProducts: products.filter(p => p.isVegan).length
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalMenus: 0,
        totalProducts: 0,
        productsByCategory: {},
        availableProducts: 0,
        recommendedProducts: 0,
        veganProducts: 0
      };
    }
  }

  getSchemaInfo(): {
    collections: Array<{
      name: string;
      fields: string[];
    }>;
    provider: string;
    status: string;
    realtime: boolean;
  } {
    return {
      collections: [
        {
          name: this.menusCollection,
          fields: ['name', 'description', 'isActive', 'createdAt', 'updatedAt']
        },
        {
          name: this.productsCollection,
          fields: ['name', 'price', 'description', 'category', 'isRecommended', 'isVegan', 'isAvailable', 'menuId', 'createdAt', 'updatedAt']
        },
        {
          name: this.categoriesCollection,
          fields: ['name', 'createdAt']
        }
      ],
      provider: 'Firebase Firestore',
      status: this.isFirebaseAvailable() ? 'Conectado' : 'Desconectado',
      realtime: true
    };
  }

  // Objeto con funciones de tiempo real para compatibilidad
  realtime = {
    subscribeToMenu: this.subscribeToMenu.bind(this),
    subscribeToMenus: this.subscribeToMenus.bind(this),
    subscribeToProducts: this.subscribeToProducts.bind(this)
  };

  // Objeto con funciones organizadas por entidad
  menus = {
    get: this.getMenu.bind(this),
    getAll: this.getMenus.bind(this),
    getWithProducts: this.getMenuWithProducts.bind(this),
    create: this.createMenu.bind(this),
    update: this.updateMenu.bind(this),
    delete: this.deleteMenu.bind(this),
    duplicate: this.duplicateMenu.bind(this)
  };

  products = {
    get: this.getProduct.bind(this),
    getAll: this.getProducts.bind(this),
    getByMenu: this.getProductsByMenu.bind(this),
    create: this.createProduct.bind(this),
    update: this.updateProduct.bind(this),
    delete: this.deleteProduct.bind(this),
    updateAvailability: this.updateProductsAvailability.bind(this)
  };

  categories = {
    getAll: this.getCategories.bind(this),
    create: this.createCategory.bind(this)
  };
}

export default new FirebaseDatabaseAPI();