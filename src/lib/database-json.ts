import fs from 'fs';
import path from 'path';
import { Product, MenuData } from '../app/types';

// Estructura de la base de datos
interface DatabaseStructure {
  menus: Record<string, MenuData>;
  lastUpdated: string;
}

// En producción, usaremos una variable de entorno para almacenar los datos
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Función para obtener datos desde variable de entorno o archivo
const getStoredData = (): DatabaseStructure => {
  // En Vercel, intentar leer desde variable de entorno
  if (isVercel && process.env.MENU_DATA) {
    try {
      return JSON.parse(process.env.MENU_DATA);
      } catch (error) {
      console.error('Error parsing MENU_DATA from environment:', error);
  }
  }

  // En desarrollo o si no hay variable de entorno, usar archivo
if (typeof window === 'undefined') {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const dbPath = path.join(dataDir, 'menu.json');
      
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
}
    } catch (error) {
      console.error('Error reading local database:', error);
    }
  }

  // Datos por defecto
  return {
    menus: {},
    lastUpdated: new Date().toISOString()
  };
};

// Función para guardar datos (solo funciona en desarrollo)
const saveData = (data: DatabaseStructure): boolean => {
  if (isVercel) {
    console.warn('Cannot save data in Vercel production environment');
    return false;
  }

  if (typeof window !== 'undefined') return false;

  try {
    const dataDir = path.join(process.cwd(), 'data');
    const dbPath = path.join(dataDir, 'menu.json');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// API de la base de datos
export const DatabaseAPI = {
  init: () => {
    console.log('Database API initialized for environment:', {
      isProduction,
      isVercel,
      hasMenuData: !!process.env.MENU_DATA
    });
    return true;
  },

  menus: {
    create: (menuData: MenuData): boolean => {
      if (isVercel) {
        console.warn('Cannot create menu in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        db.menus[menuData.id] = menuData;
        return saveData(db);
      } catch (error) {
        console.error('Error creating menu:', error);
        return false;
      }
    },

    get: (id: string): MenuData | null => {
      try {
        const db = getStoredData();
        return db.menus[id] || null;
      } catch (error) {
        console.error('Error getting menu:', error);
        return null;
      }
    },

    getAll: (): MenuData[] => {
      try {
        const db = getStoredData();
        return Object.values(db.menus);
      } catch (error) {
        console.error('Error getting all menus:', error);
        return [];
      }
    },

    update: (menuData: MenuData): boolean => {
      if (isVercel) {
        console.warn('Cannot update menu in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        if (db.menus[menuData.id]) {
          db.menus[menuData.id] = { ...db.menus[menuData.id], ...menuData };
          return saveData(db);
        }
        return false;
      } catch (error) {
        console.error('Error updating menu:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      if (isVercel) {
        console.warn('Cannot delete menu in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        if (db.menus[id]) {
          delete db.menus[id];
          return saveData(db);
        }
        return false;
      } catch (error) {
        console.error('Error deleting menu:', error);
        return false;
      }
    },
  },

  products: {
    create: (product: Product, menuId: string): boolean => {
      if (isVercel) {
        console.warn('Cannot create product in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        if (db.menus[menuId]) {
          db.menus[menuId].products.push(product);
          return saveData(db);
        }
        return false;
      } catch (error) {
        console.error('Error creating product:', error);
        return false;
      }
    },

    update: (product: Product, menuId: string): boolean => {
      if (isVercel) {
        console.warn('Cannot update product in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        if (db.menus[menuId]) {
          const productIndex = db.menus[menuId].products.findIndex(p => p.id === product.id);
          if (productIndex !== -1) {
            db.menus[menuId].products[productIndex] = product;
            return saveData(db);
          }
        }
        return false;
      } catch (error) {
        console.error('Error updating product:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      if (isVercel) {
        console.warn('Cannot delete product in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        for (const menuId in db.menus) {
          const productIndex = db.menus[menuId].products.findIndex(p => p.id === id);
          if (productIndex !== -1) {
            db.menus[menuId].products.splice(productIndex, 1);
            return saveData(db);
          }
        }
        return false;
      } catch (error) {
        console.error('Error deleting product:', error);
        return false;
      }
    },

    getByMenu: (menuId: string): Product[] => {
      try {
        const db = getStoredData();
        return db.menus[menuId]?.products || [];
      } catch (error) {
        console.error('Error getting products:', error);
        return [];
      }
    },
  },

  utils: {
    seedFromFile: async (): Promise<boolean> => {
      if (isVercel) {
        console.warn('Cannot seed database in production environment');
        return false;
      }
      
      try {
        const { menus } = await import('../data/menu');
        const db = getStoredData();
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          db.menus[menuId] = menuData;
        }
        
        return saveData(db);
      } catch (error) {
        console.error('Error seeding database:', error);
        return false;
      }
    },

    exportToJSON: (): string => {
      try {
        const db = getStoredData();
        return JSON.stringify(db.menus, null, 2);
      } catch (error) {
        console.error('Error exporting database:', error);
        return '{}';
      }
    },

    hasData: (): boolean => {
      try {
        const db = getStoredData();
        return Object.keys(db.menus).length > 0;
      } catch (error) {
        console.error('Error checking database data:', error);
        return false;
      }
    },

    clearAll: (): boolean => {
      if (isVercel) {
        console.warn('Cannot clear database in production environment');
        return false;
      }
      
      try {
        const db = getStoredData();
        db.menus = {};
        return saveData(db);
      } catch (error) {
        console.error('Error clearing database:', error);
        return false;
      }
    },

    getInfo: () => {
      try {
        const db = getStoredData();
        const menusCount = Object.keys(db.menus).length;
        const productsCount = Object.values(db.menus).reduce((total, menu) => total + menu.products.length, 0);
        
        return {
          menusCount,
          productsCount,
          environment: isVercel ? 'vercel' : 'development',
          hasMenuData: !!process.env.MENU_DATA,
          dbExists: !isVercel,
          lastUpdated: db.lastUpdated
        };
      } catch (error) {
        console.error('Error getting database info:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          environment: 'error',
          hasMenuData: false,
          dbExists: false,
          lastUpdated: null
        };
      }
    },
  },
};

// Inicializar la base de datos
if (typeof window === 'undefined') {
  DatabaseAPI.init();
}

export default DatabaseAPI;
