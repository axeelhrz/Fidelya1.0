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
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Menu, Product } from '../app/types';

class FirebaseDatabaseAPI {
  private menusCollection = 'menus';
  private productsCollection = 'products';

  // Verificar si Firebase está disponible
  private isFirebaseAvailable(): boolean {
    return !!db;
  }

  // Manejar errores de Firebase
  private handleError(error: any, operation: string) {
    console.error(`Error en ${operation}:`, error);
    throw new Error(`Error en ${operation}: ${error.message}`);
  }

  async getMenus(): Promise<Menu[]> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const querySnapshot = await getDocs(collection(db, this.menusCollection));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Menu));
    } catch (error) {
      this.handleError(error, 'obtener menús');
      return [];
    }
  }

  async getMenu(id: string): Promise<Menu | null> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
    try {
      const docRef = doc(db, this.menusCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Menu;
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
      const docRef = await addDoc(collection(db, this.menusCollection), menu);
      return { id: docRef.id, ...menu };
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
      const docRef = doc(db, this.menusCollection, id);
      await updateDoc(docRef, menu);
      
      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Menu;
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
      await deleteDoc(doc(db, this.menusCollection, id));
      } catch (error) {
      this.handleError(error, 'eliminar menú');
      }
  }

  async getProducts(): Promise<Product[]> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
      try {
      const querySnapshot = await getDocs(collection(db, this.productsCollection));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
      const docRef = doc(db, this.productsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
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
      const docRef = await addDoc(collection(db, this.productsCollection), product);
      return { id: docRef.id, ...product };
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
      const docRef = doc(db, this.productsCollection, id);
      await updateDoc(docRef, product);
      
      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
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
      await deleteDoc(doc(db, this.productsCollection, id));
      } catch (error) {
      this.handleError(error, 'eliminar producto');
      }
  }

  async getProductsByMenu(menuId: string): Promise<Product[]> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
      try {
      const q = query(
        collection(db, this.productsCollection), 
        where('menuId', '==', menuId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      } catch (error) {
      this.handleError(error, 'obtener productos por menú');
      return [];
      }
  }

  async initializeDatabase(): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      throw new Error('Firebase no está configurado');
    }
      try {
      // Datos iniciales para el bar
      const initialMenu = {
        name: 'Carta Principal',
        description: 'Nuestra selección completa de bebidas y comidas',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
        };

      const menuRef = await addDoc(collection(db, this.menusCollection), initialMenu);
      
      // Productos iniciales
      const initialProducts = [
        {
          name: 'Cerveza Artesanal',
          price: 2800,
          description: 'Cerveza artesanal local, 500ml',
          category: 'Bebidas',
          isRecommended: true,
          isVegan: true,
          isAvailable: true,
          menuId: menuRef.id
    },
        {
          name: 'Hamburguesa Clásica',
          price: 4200,
          description: 'Carne, lechuga, tomate, queso y papas fritas',
          category: 'Principales',
          isRecommended: true,
          isVegan: false,
          isAvailable: true,
          menuId: menuRef.id
        }
      ];

      for (const product of initialProducts) {
        await addDoc(collection(db, this.productsCollection), product);
      }

      console.log('✅ Base de datos inicializada con datos del bar');
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

  getSchemaInfo(): any {
    return {
      collections: [
        {
          name: this.menusCollection,
          fields: ['name', 'description', 'isActive', 'createdAt', 'updatedAt']
  },
        {
          name: this.productsCollection,
          fields: ['name', 'price', 'description', 'category', 'isRecommended', 'isVegan', 'isAvailable', 'menuId']
        }
      ],
      provider: 'Firebase Firestore',
      status: this.isFirebaseAvailable() ? 'Conectado' : 'Desconectado'
        };
  }
}

export default new FirebaseDatabaseAPI();
