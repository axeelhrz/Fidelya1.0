import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
  connectFirestoreEmulator
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Menu, 
  Product, 
  MenuData, 
  DatabaseAPI, 
  AdminStatistics,
  ProductCategory 
} from '../app/types';

class FirebaseDatabaseAPI implements DatabaseAPI {
  private menusCollection = collection(db, 'menus');
  private productsCollection = collection(db, 'products');

  // Métodos para Menús
  async getMenus(): Promise<Menu[]> {
    try {
      const querySnapshot = await getDocs(
        query(this.menusCollection, orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Menu[];
    } catch (error) {
      console.error('Error obteniendo menús:', error);
      throw new Error('Error al obtener los menús');
    }
  }

  async getMenu(id: string): Promise<Menu | null> {
    try {
      const docRef = doc(this.menusCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Menu;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo menú:', error);
      throw new Error('Error al obtener el menú');
    }
  }

  async createMenu(menu: Omit<Menu, 'id'>): Promise<Menu> {
    try {
      const menuData = {
        ...menu,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: menu.isActive ?? true
      };
      
      const docRef = await addDoc(this.menusCollection, menuData);
      
      return {
        id: docRef.id,
        ...menu,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: menu.isActive ?? true
      };
    } catch (error) {
      console.error('Error creando menú:', error);
      throw new Error('Error al crear el menú');
    }
  }

  async updateMenu(id: string, menu: Partial<Menu>): Promise<Menu> {
    try {
      const docRef = doc(this.menusCollection, id);
      const updateData = {
        ...menu,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedMenu = await this.getMenu(id);
      if (!updatedMenu) {
        throw new Error('Menú no encontrado después de la actualización');
      }
      
      return updatedMenu;
    } catch (error) {
      console.error('Error actualizando menú:', error);
      throw new Error('Error al actualizar el menú');
    }
  }

  async deleteMenu(id: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Eliminar el menú
      const menuRef = doc(this.menusCollection, id);
      batch.delete(menuRef);
      
      // Eliminar todos los productos asociados
      const productsQuery = query(this.productsCollection, where('menuId', '==', id));
      const productsSnapshot = await getDocs(productsQuery);
      
      productsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error eliminando menú:', error);
      throw new Error('Error al eliminar el menú');
    }
  }

  // Métodos para Productos
  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(
        query(this.productsCollection, orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Product[];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw new Error('Error al obtener los productos');
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(this.productsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw new Error('Error al obtener el producto');
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAvailable: product.isAvailable ?? true,
        isRecommended: product.isRecommended ?? false,
        isVegan: product.isVegan ?? false
      };
      
      const docRef = await addDoc(this.productsCollection, productData);
      
      return {
        id: docRef.id,
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAvailable: product.isAvailable ?? true,
        isRecommended: product.isRecommended ?? false,
        isVegan: product.isVegan ?? false
      };
    } catch (error) {
      console.error('Error creando producto:', error);
      throw new Error('Error al crear el producto');
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const docRef = doc(this.productsCollection, id);
      const updateData = {
        ...product,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      
      const updatedProduct = await this.getProduct(id);
      if (!updatedProduct) {
        throw new Error('Producto no encontrado después de la actualización');
      }
      
      return updatedProduct;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(this.productsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }

  async getProductsByMenu(menuId: string): Promise<Product[]> {
    try {
      const q = query(
        this.productsCollection, 
        where('menuId', '==', menuId),
        orderBy('category'),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as Product[];
    } catch (error) {
      console.error('Error obteniendo productos del menú:', error);
      throw new Error('Error al obtener los productos del menú');
    }
  }

  // Métodos avanzados
  async getMenuWithProducts(id: string): Promise<MenuData | null> {
    try {
      const menu = await this.getMenu(id);
      if (!menu) return null;
      
      const products = await this.getProductsByMenu(id);
      
      return {
        ...menu,
        products
      };
    } catch (error) {
      console.error('Error obteniendo menú con productos:', error);
      throw new Error('Error al obtener el menú con productos');
    }
  }

  async getStatistics(): Promise<AdminStatistics> {
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
      throw new Error('Error al obtener las estadísticas');
    }
  }

  async updateProductsAvailability(productIds: string[], isAvailable: boolean): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      productIds.forEach(id => {
        const productRef = doc(this.productsCollection, id);
        batch.update(productRef, { 
          isAvailable, 
          updatedAt: serverTimestamp() 
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
      throw new Error('Error al actualizar la disponibilidad de los productos');
    }
  }

  async duplicateMenu(menuId: string, newName: string): Promise<Menu> {
    try {
      const originalMenu = await this.getMenu(menuId);
      if (!originalMenu) {
        throw new Error('Menú original no encontrado');
      }

      const products = await this.getProductsByMenu(menuId);
      
      // Crear nuevo menú
      const newMenu = await this.createMenu({
        name: newName,
        description: originalMenu.description,
        isActive: false
      });

      // Duplicar productos
      const batch = writeBatch(db);
      products.forEach(product => {
        const newProductRef = doc(this.productsCollection);
        batch.set(newProductRef, {
          ...product,
          id: undefined,
          menuId: newMenu.id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return newMenu;
    } catch (error) {
      console.error('Error duplicando menú:', error);
      throw new Error('Error al duplicar el menú');
    }
  }

  // Métodos de utilidad
  async initializeDatabase(): Promise<void> {
    try {
      // Verificar si ya hay datos
      const menus = await this.getMenus();
      if (menus.length > 0) {
        console.log('La base de datos ya tiene datos');
        return;
      }

      // Crear menú de ejemplo
      const exampleMenu = await this.createMenu({
        name: 'Menú Principal',
        description: 'Nuestro delicioso menú principal',
        isActive: true
      });

      // Crear productos de ejemplo
      const exampleProducts = [
        {
          name: 'Café Americano',
          price: 2.50,
          description: 'Café negro tradicional',
          category: 'Café' as ProductCategory,
          isRecommended: true,
          isVegan: true,
          isAvailable: true,
          menuId: exampleMenu.id
        },
        {
          name: 'Tarta de Chocolate',
          price: 4.50,
          description: 'Deliciosa tarta casera',
          category: 'Postres' as ProductCategory,
          isRecommended: false,
          isVegan: false,
          isAvailable: true,
          menuId: exampleMenu.id
        }
      ];

      for (const product of exampleProducts) {
        await this.createProduct(product);
      }

      console.log('Base de datos inicializada con datos de ejemplo');
    } catch (error) {
      console.error('Error inicializando base de datos:', error);
      throw new Error('Error al inicializar la base de datos');
    }
  }

  async exportData(): Promise<{ menus: Menu[], products: Product[] }> {
    try {
      const [menus, products] = await Promise.all([
        this.getMenus(),
        this.getProducts()
      ]);
      
      return { menus, products };
    } catch (error) {
      console.error('Error exportando datos:', error);
      throw new Error('Error al exportar los datos');
    }
  }

  getSchemaInfo(): Record<string, unknown> {
    return {
      collections: ['menus', 'products'],
      menuFields: ['name', 'description', 'isActive', 'createdAt', 'updatedAt'],
      productFields: ['name', 'price', 'description', 'category', 'isRecommended', 'isVegan', 'isAvailable', 'menuId', 'createdAt', 'updatedAt'],
      categories: ['Bebidas', 'Sin Alcohol', 'Tapas', 'Principales', 'Postres', 'Café', 'Promociones']
    };
  }

  // Funcionalidad en tiempo real
  realtime = {
    subscribeToMenu: (menuId: string, callback: (menu: MenuData | null) => void) => {
      const menuRef = doc(this.menusCollection, menuId);
      
      return onSnapshot(menuRef, async (doc) => {
        if (doc.exists()) {
          const menu = {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
          } as Menu;
          
          const products = await this.getProductsByMenu(menuId);
          callback({ ...menu, products });
        } else {
          callback(null);
        }
      });
    },

    subscribeToMenus: (callback: (menus: Menu[]) => void) => {
      const q = query(this.menusCollection, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (querySnapshot) => {
        const menus = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as Menu[];
        
        callback(menus);
      });
    },

    subscribeToProducts: (menuId: string, callback: (products: Product[]) => void) => {
      const q = query(
        this.productsCollection,
        where('menuId', '==', menuId),
        orderBy('category'),
        orderBy('name')
      );
      
      return onSnapshot(q, (querySnapshot) => {
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        })) as Product[];
        
        callback(products);
      });
    }
  };

  // Métodos de conectividad
  async goOffline(): Promise<void> {
    await disableNetwork(db);
  }

  async goOnline(): Promise<void> {
    await enableNetwork(db);
  }
}

// Instancia singleton
export const firebaseDB = new FirebaseDatabaseAPI();
export default firebaseDB;