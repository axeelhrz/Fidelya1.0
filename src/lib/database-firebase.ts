import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, MenuData, FirebaseMenuItem, FirebaseMenu } from '../app/types';

// Función para convertir producto de Firebase a formato de la app
const convertFirebaseProductToProduct = (fbProduct: FirebaseMenuItem): Product => ({
  id: fbProduct.id,
  name: fbProduct.name,
  price: fbProduct.price,
  description: fbProduct.description,
  category: fbProduct.category,
  isRecommended: fbProduct.isRecommended ?? false,
  isVegan: fbProduct.isVegan ?? false,
});

// Función para convertir producto de la app a formato de Firebase
const convertProductToFirebaseProduct = (product: Product): Omit<FirebaseMenuItem, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: product.name,
  price: product.price,
  description: product.description,
  category: product.category,
  isRecommended: product.isRecommended ?? false,
  isVegan: product.isVegan ?? false,
});

// API de la base de datos Firebase
export const DatabaseAPI = {
  init: async (): Promise<boolean> => {
    console.log('Inicializando base de datos Firebase...');
    try {
      // Verificar conexión intentando leer un documento
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      console.log('Base de datos Firebase inicializada correctamente');
      return true;
    } catch (error) {
      console.error('Error inicializando Firebase:', error);
      return false;
    }
  },

  menus: {
    create: async (menuData: MenuData): Promise<boolean> => {
      console.log('Creando menú en Firebase:', menuData.id);
      try {
        const batch = writeBatch(db);
        
        // Crear el documento del menú
        const menuRef = doc(db, 'menus', menuData.id);
        const menuDoc: FirebaseMenu = {
          id: menuData.id,
          name: menuData.name,
          description: menuData.description,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        batch.set(menuRef, menuDoc);

        // Crear los productos del menú
        for (const product of menuData.products) {
          const productRef = doc(db, 'menus', menuData.id, 'items', product.id);
          const productDoc: Omit<FirebaseMenuItem, 'id'> = {
            ...convertProductToFirebaseProduct(product),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          batch.set(productRef, productDoc);
        }

        await batch.commit();
        console.log('Menú creado exitosamente en Firebase');
        return true;
      } catch (error) {
        console.error('Error creando menú en Firebase:', error);
        return false;
      }
    },

    get: async (id: string): Promise<MenuData | null> => {
      console.log('Obteniendo menú de Firebase:', id);
      try {
        // Obtener el menú
        const menuRef = doc(db, 'menus', id);
        const menuSnap = await getDoc(menuRef);

        if (!menuSnap.exists()) {
          console.log('Menú no encontrado:', id);
          return null;
        }

        const menuData = menuSnap.data() as FirebaseMenu;

        // Obtener los productos del menú
        const itemsRef = collection(db, 'menus', id, 'items');
        const itemsQuery = query(itemsRef, orderBy('category'), orderBy('name'));
        const itemsSnap = await getDocs(itemsQuery);

        const products: Product[] = itemsSnap.docs.map(doc => {
          const data = doc.data() as Omit<FirebaseMenuItem, 'id'>;
          return convertFirebaseProductToProduct({ ...data, id: doc.id });
        });
        const menu: MenuData = {
          id: menuData.id,
          name: menuData.name,
          description: menuData.description,
          products,
          createdAt: menuData.createdAt instanceof Timestamp ? menuData.createdAt.toDate().toISOString() : undefined,
          updatedAt: menuData.updatedAt instanceof Timestamp ? menuData.updatedAt.toDate().toISOString() : undefined,
        };

        console.log('Menú obtenido exitosamente:', menu.id);
        return menu;
      } catch (error) {
        console.error('Error obteniendo menú de Firebase:', error);
        return null;
      }
    },

    getAll: async (): Promise<MenuData[]> => {
      console.log('Obteniendo todos los menús de Firebase...');
      try {
        const menusRef = collection(db, 'menus');
        const menusQuery = query(menusRef, orderBy('name'));
        const menusSnap = await getDocs(menusQuery);

        const menus: MenuData[] = [];

        for (const menuDoc of menusSnap.docs) {
          const menuData = menuDoc.data() as FirebaseMenu;
          
          // Obtener productos para cada menú
          const itemsRef = collection(db, 'menus', menuDoc.id, 'items');
          const itemsQuery = query(itemsRef, orderBy('category'), orderBy('name'));
          const itemsSnap = await getDocs(itemsQuery);

          const products: Product[] = itemsSnap.docs.map(doc => {
            const data = doc.data() as Omit<FirebaseMenuItem, 'id'>;
            return convertFirebaseProductToProduct({ ...data, id: doc.id });
          });
          menus.push({
            id: menuData.id,
            name: menuData.name,
            description: menuData.description,
            products,
            createdAt: menuData.createdAt instanceof Timestamp ? menuData.createdAt.toDate().toISOString() : undefined,
            updatedAt: menuData.updatedAt instanceof Timestamp ? menuData.updatedAt.toDate().toISOString() : undefined,
          });
        }

        console.log('Encontrados', menus.length, 'menús');
        return menus;
      } catch (error) {
        console.error('Error obteniendo menús de Firebase:', error);
        return [];
      }
    },

    update: async (menuData: MenuData): Promise<boolean> => {
      console.log('Actualizando menú en Firebase:', menuData.id);
      try {
        const menuRef = doc(db, 'menus', menuData.id);
        await updateDoc(menuRef, {
          name: menuData.name,
          description: menuData.description,
          updatedAt: serverTimestamp(),
        });

        console.log('Menú actualizado exitosamente');
        return true;
      } catch (error) {
        console.error('Error actualizando menú en Firebase:', error);
        return false;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Eliminando menú de Firebase:', id);
      try {
        const batch = writeBatch(db);

        // Eliminar todos los productos del menú
        const itemsRef = collection(db, 'menus', id, 'items');
        const itemsSnap = await getDocs(itemsRef);
        
        itemsSnap.docs.forEach(doc => {
          batch.delete(doc.ref);
        });

        // Eliminar el menú
        const menuRef = doc(db, 'menus', id);
        batch.delete(menuRef);

        await batch.commit();
        console.log('Menú eliminado exitosamente');
        return true;
      } catch (error) {
        console.error('Error eliminando menú de Firebase:', error);
        return false;
      }
    },
  },

  products: {
    create: async (product: Product, menuId: string): Promise<boolean> => {
      console.log('Creando producto en Firebase:', product.id, 'en menú:', menuId);
      try {
        const productRef = doc(db, 'menus', menuId, 'items', product.id);
        const productDoc: Omit<FirebaseMenuItem, 'id'> = {
          ...convertProductToFirebaseProduct(product),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(productRef, productDoc);
        console.log('Producto creado exitosamente');
        return true;
      } catch (error) {
        console.error('Error creando producto en Firebase:', error);
        return false;
      }
    },

    update: async (product: Product, menuId: string): Promise<boolean> => {
      console.log('Actualizando producto en Firebase:', product.id);
      try {
        const productRef = doc(db, 'menus', menuId, 'items', product.id);
        await updateDoc(productRef, {
          ...convertProductToFirebaseProduct(product),
          updatedAt: serverTimestamp(),
        });

        console.log('Producto actualizado exitosamente');
        return true;
      } catch (error) {
        console.error('Error actualizando producto en Firebase:', error);
        return false;
      }
    },

    delete: async (productId: string, menuId?: string): Promise<boolean> => {
      console.log('Eliminando producto de Firebase:', productId);
      try {
        if (menuId) {
          const productRef = doc(db, 'menus', menuId, 'items', productId);
          await deleteDoc(productRef);
        } else {
          // Si no se proporciona menuId, buscar en todos los menús
          const menusRef = collection(db, 'menus');
          const menusSnap = await getDocs(menusRef);
          
          for (const menuDoc of menusSnap.docs) {
            const productRef = doc(db, 'menus', menuDoc.id, 'items', productId);
            const productSnap = await getDoc(productRef);
            
            if (productSnap.exists()) {
              await deleteDoc(productRef);
              break;
            }
          }
        }

        console.log('Producto eliminado exitosamente');
        return true;
      } catch (error) {
        console.error('Error eliminando producto de Firebase:', error);
        return false;
      }
    },

    getByMenu: async (menuId: string): Promise<Product[]> => {
      console.log('Obteniendo productos del menú:', menuId);
      try {
        const itemsRef = collection(db, 'menus', menuId, 'items');
        const itemsQuery = query(itemsRef, orderBy('category'), orderBy('name'));
        const itemsSnap = await getDocs(itemsQuery);

        const products: Product[] = itemsSnap.docs.map(doc => {
          const data = doc.data() as Omit<FirebaseMenuItem, 'id'>;
          return convertFirebaseProductToProduct({ ...data, id: doc.id });
        });

        console.log('Encontrados', products.length, 'productos');
        return products;
      } catch (error) {
        console.error('Error obteniendo productos de Firebase:', error);
        return [];
      }
    },
  },

  utils: {
    seedFromFile: async (): Promise<boolean> => {
      console.log('Sembrando base de datos Firebase desde archivo...');
      try {
        const { menus } = await import('../data/menu');
        console.log('Menús cargados desde archivo:', Object.keys(menus));

        for (const [menuId, menuData] of Object.entries(menus)) {
          console.log('Sembrando menú:', menuId);
          
          // Verificar si el menú ya existe
          const existingMenu = await DatabaseAPI.menus.get(menuId);
          if (existingMenu) {
            console.log('Menú ya existe, omitiendo:', menuId);
            continue;
          }

          // Crear el menú
          const success = await DatabaseAPI.menus.create(menuData);
          if (!success) {
            console.error('Error sembrando menú:', menuId);
            return false;
          }
        }

        console.log('Base de datos Firebase sembrada exitosamente');
        return true;
      } catch (error) {
        console.error('Error sembrando base de datos Firebase:', error);
        return false;
      }
    },

    exportToJSON: async (): Promise<string> => {
      console.log('Exportando base de datos Firebase a JSON...');
      try {
        const menus = await DatabaseAPI.menus.getAll();
        const menusObject = menus.reduce((acc, menu) => {
          acc[menu.id] = menu;
          return acc;
        }, {} as Record<string, MenuData>);

        const exported = JSON.stringify(menusObject, null, 2);
        console.log('Base de datos exportada exitosamente');
        return exported;
      } catch (error) {
        console.error('Error exportando base de datos Firebase:', error);
        return '{}';
      }
    },

    hasData: async (): Promise<boolean> => {
      console.log('Verificando si Firebase tiene datos...');
      try {
        const menusRef = collection(db, 'menus');
        const menusSnap = await getDocs(query(menusRef, orderBy('name')));
        
        const hasData = !menusSnap.empty;
        console.log('Firebase tiene datos:', hasData);
        return hasData;
      } catch (error) {
        console.error('Error verificando datos en Firebase:', error);
        return false;
      }
    },

    clearAll: async (): Promise<boolean> => {
      console.log('Limpiando todos los datos de Firebase...');
      try {
        const batch = writeBatch(db);
        
        // Obtener todos los menús
        const menusRef = collection(db, 'menus');
        const menusSnap = await getDocs(menusRef);

        // Eliminar todos los productos de cada menú
        for (const menuDoc of menusSnap.docs) {
          const itemsRef = collection(db, 'menus', menuDoc.id, 'items');
          const itemsSnap = await getDocs(itemsRef);
          
          itemsSnap.docs.forEach(doc => {
            batch.delete(doc.ref);
          });

          // Eliminar el menú
          batch.delete(menuDoc.ref);
        }

        await batch.commit();
        console.log('Base de datos Firebase limpiada exitosamente');
        return true;
      } catch (error) {
        console.error('Error limpiando base de datos Firebase:', error);
        return false;
      }
    },

    getInfo: async () => {
      console.log('Obteniendo información de Firebase...');
      try {
        // Contar menús
        const menusRef = collection(db, 'menus');
        const menusSnap = await getDocs(menusRef);
        const menusCount = menusSnap.size;

        // Contar productos
        let productsCount = 0;
        for (const menuDoc of menusSnap.docs) {
          const itemsRef = collection(db, 'menus', menuDoc.id, 'items');
          const itemsSnap = await getDocs(itemsRef);
          productsCount += itemsSnap.size;
        }

        const info = {
          menusCount,
          productsCount,
          dbType: 'firebase',
          environment: 'production',
          hasMenuData: true,
          dbExists: true,
          dbPath: 'firebase-firestore',
          lastUpdated: new Date().toISOString(),
        };

        console.log('Información de Firebase:', info);
        return info;
      } catch (error) {
        console.error('Error obteniendo información de Firebase:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbType: 'firebase-error',
          environment: 'error',
          hasMenuData: false,
          dbExists: false,
          dbPath: 'error',
          lastUpdated: null,
        };
      }
    },
  },

  // Funciones específicas para tiempo real
  realtime: {
    subscribeToMenu: (menuId: string, callback: (menu: MenuData | null) => void) => {
      console.log('Suscribiéndose a cambios del menú:', menuId);
      
      const menuRef = doc(db, 'menus', menuId);
      const itemsRef = collection(db, 'menus', menuId, 'items');
      const itemsQuery = query(itemsRef, orderBy('category'), orderBy('name'));

      // Suscribirse a cambios en el menú
      const unsubscribeMenu = onSnapshot(menuRef, async (menuSnap) => {
        if (!menuSnap.exists()) {
          callback(null);
          return;
        }

        const menuData = menuSnap.data() as FirebaseMenu;

        // Obtener productos actualizados
        const itemsSnap = await getDocs(itemsQuery);
        const products: Product[] = itemsSnap.docs.map(doc => {
          const data = doc.data() as Omit<FirebaseMenuItem, 'id'>;
          return convertFirebaseProductToProduct({ ...data, id: doc.id });
        });
        const menu: MenuData = {
          id: menuData.id,
          name: menuData.name,
          description: menuData.description,
          products,
          createdAt: menuData.createdAt instanceof Timestamp ? menuData.createdAt.toDate().toISOString() : undefined,
          updatedAt: menuData.updatedAt instanceof Timestamp ? menuData.updatedAt.toDate().toISOString() : undefined,
        };

        callback(menu);
        callback(menu);
      });

      // Suscribirse a cambios en los productos
      const unsubscribeItems = onSnapshot(itemsQuery, async () => {
        // Cuando cambien los productos, volver a obtener el menú completo
        const menuSnap = await getDoc(menuRef);
        if (menuSnap.exists()) {
          const menuData = menuSnap.data() as FirebaseMenu;
          const itemsSnap = await getDocs(itemsQuery);
          
          const products: Product[] = itemsSnap.docs.map(doc => {
            const data = doc.data() as Omit<FirebaseMenuItem, 'id'>;
            return convertFirebaseProductToProduct({ ...data, id: doc.id });
          });

          const menu: MenuData = {
            id: menuData.id,
            name: menuData.name,
            description: menuData.description,
            products,
            createdAt: menuData.createdAt instanceof Timestamp ? menuData.createdAt.toDate().toISOString() : undefined,
            updatedAt: menuData.updatedAt instanceof Timestamp ? menuData.updatedAt.toDate().toISOString() : undefined,
          };

          callback(menu);
        }
      });

      // Retornar función para cancelar suscripciones
      return () => {
        unsubscribeMenu();
        unsubscribeItems();
      };
    },

    subscribeToMenus: (callback: (menus: MenuData[]) => void) => {
      console.log('Suscribiéndose a cambios de todos los menús');
      
      const menusRef = collection(db, 'menus');
      const menusQuery = query(menusRef, orderBy('name'));

      return onSnapshot(menusQuery, async (menusSnap) => {
        const menus: MenuData[] = [];

        for (const menuDoc of menusSnap.docs) {
          const menuData = menuDoc.data() as FirebaseMenu;
          
          // Obtener productos para cada menú
          const itemsRef = collection(db, 'menus', menuDoc.id, 'items');
          const itemsQuery = query(itemsRef, orderBy('category'), orderBy('name'));
          const itemsSnap = await getDocs(itemsQuery);

          const products: Product[] = itemsSnap.docs.map(doc => {
            const data = doc.data() as Omit<FirebaseMenuItem, 'id'>;
            return convertFirebaseProductToProduct({ ...data, id: doc.id });
          });

          menus.push({
            id: menuData.id,
            name: menuData.name,
            description: menuData.description,
            products,
            createdAt: menuData.createdAt instanceof Timestamp ? menuData.createdAt.toDate().toISOString() : undefined,
            updatedAt: menuData.updatedAt instanceof Timestamp ? menuData.updatedAt.toDate().toISOString() : undefined,
          });
        }

        callback(menus);
      });
    },
  },
};

export default DatabaseAPI;