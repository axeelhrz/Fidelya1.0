import fs from 'fs';
import path from 'path';
import { Product, MenuData } from '../app/types';

// Estructura de la base de datos JSON
interface DatabaseStructure {
  menus: Record<string, MenuData>;
  lastUpdated: string;
}

// Variables para el sistema de archivos
      const dataDir = path.join(process.cwd(), 'data');
      const dbPath = path.join(dataDir, 'menu.json');
      
// Función para asegurar que el directorio existe
const ensureDataDir = () => {
  if (typeof window !== 'undefined') return;
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('Data directory created:', dataDir);
    }
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
};

// Leer la base de datos
const readDatabase = (): DatabaseStructure => {
  if (typeof window !== 'undefined') {
    return { menus: {}, lastUpdated: new Date().toISOString() };
  }

  // En Vercel, usar variable de entorno
  if (process.env.VERCEL === '1' && process.env.MENU_DATA) {
      try {
      console.log('Reading from MENU_DATA environment variable');
      return JSON.parse(process.env.MENU_DATA);
      } catch (error) {
      console.error('Error parsing MENU_DATA:', error);
      }
  }
      try {
    ensureDataDir();
    
    if (fs.existsSync(dbPath)) {
      console.log('Reading database from file:', dbPath);
      const data = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(data);
      console.log('Database loaded, menus:', Object.keys(parsed.menus || {}));
      return parsed;
    } else {
      console.log('Database file does not exist, creating default');
    }
      } catch (error) {
    console.error('Error reading database:', error);
      }

  // Datos por defecto
  const defaultData: DatabaseStructure = {
    menus: {},
    lastUpdated: new Date().toISOString()
        };
  
  // Intentar crear el archivo por defecto
  if (typeof window === 'undefined' && process.env.VERCEL !== '1') {
    try {
      ensureDataDir();
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
      console.log('Default database file created');
      } catch (error) {
      console.error('Error creating default database file:', error);
    }
  }
  
  return defaultData;
        };

// Escribir a la base de datos
const writeDatabase = (data: DatabaseStructure): boolean => {
  if (typeof window !== 'undefined') {
    console.warn('Cannot write database on client side');
    return false;
}

  if (process.env.VERCEL === '1') {
    console.warn('Cannot write database in Vercel production environment');
    return false;
  }

  try {
    ensureDataDir();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('Database written successfully, menus:', Object.keys(data.menus));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// API de la base de datos
export const DatabaseAPI = {
  init: () => {
    console.log('Initializing JSON database...');
    try {
      ensureDataDir();
      const data = readDatabase();
      console.log('Database initialized with', Object.keys(data.menus).length, 'menus');
      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
    }
  },

  menus: {
    create: (menuData: MenuData): boolean => {
      console.log('Creating menu:', menuData.id);
      try {
        const db = readDatabase();
        db.menus[menuData.id] = menuData;
        const success = writeDatabase(db);
        console.log('Menu created:', success);
        return success;
      } catch (error) {
        console.error('Error creating menu:', error);
        return false;
      }
    },

    get: (id: string): MenuData | null => {
      console.log('Getting menu:', id);
      try {
        const db = readDatabase();
        const menu = db.menus[id] || null;
        console.log('Menu found:', !!menu);
        return menu;
      } catch (error) {
        console.error('Error getting menu:', error);
        return null;
      }
    },

    getAll: (): MenuData[] => {
      console.log('Getting all menus...');
      try {
        const db = readDatabase();
        const menus = Object.values(db.menus);
        console.log('Found', menus.length, 'menus');
        return menus;
      } catch (error) {
        console.error('Error getting all menus:', error);
        return [];
      }
    },

    update: (menuData: MenuData): boolean => {
      console.log('Updating menu:', menuData.id);
      try {
        const db = readDatabase();
        if (db.menus[menuData.id]) {
          db.menus[menuData.id] = { ...db.menus[menuData.id], ...menuData };
          const success = writeDatabase(db);
          console.log('Menu updated:', success);
          return success;
        }
        console.log('Menu not found for update');
        return false;
      } catch (error) {
        console.error('Error updating menu:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      console.log('Deleting menu:', id);
      try {
        const db = readDatabase();
        if (db.menus[id]) {
          delete db.menus[id];
          const success = writeDatabase(db);
          console.log('Menu deleted:', success);
          return success;
        }
        console.log('Menu not found for deletion');
        return false;
      } catch (error) {
        console.error('Error deleting menu:', error);
        return false;
      }
    },
  },

  products: {
    create: (product: Product, menuId: string): boolean => {
      console.log('Creating product:', product.id, 'in menu:', menuId);
      try {
        const db = readDatabase();
        if (db.menus[menuId]) {
          db.menus[menuId].products.push(product);
          const success = writeDatabase(db);
          console.log('Product created:', success);
          return success;
        }
        console.log('Menu not found for product creation');
        return false;
      } catch (error) {
        console.error('Error creating product:', error);
        return false;
      }
    },

    update: (product: Product, menuId: string): boolean => {
      console.log('Updating product:', product.id, 'in menu:', menuId);
      try {
        const db = readDatabase();
        if (db.menus[menuId]) {
          const productIndex = db.menus[menuId].products.findIndex(p => p.id === product.id);
          if (productIndex !== -1) {
            db.menus[menuId].products[productIndex] = product;
            const success = writeDatabase(db);
            console.log('Product updated:', success);
            return success;
          }
          console.log('Product not found for update');
        }
        console.log('Menu not found for product update');
        return false;
      } catch (error) {
        console.error('Error updating product:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      console.log('Deleting product:', id);
      try {
        const db = readDatabase();
        for (const menuId in db.menus) {
          const productIndex = db.menus[menuId].products.findIndex(p => p.id === id);
          if (productIndex !== -1) {
            db.menus[menuId].products.splice(productIndex, 1);
            const success = writeDatabase(db);
            console.log('Product deleted:', success);
            return success;
          }
        }
        console.log('Product not found for deletion');
        return false;
      } catch (error) {
        console.error('Error deleting product:', error);
        return false;
      }
    },

    getByMenu: (menuId: string): Product[] => {
      console.log('Getting products for menu:', menuId);
      try {
        const db = readDatabase();
        const products = db.menus[menuId]?.products || [];
        console.log('Found', products.length, 'products');
        return products;
      } catch (error) {
        console.error('Error getting products:', error);
        return [];
      }
    },
  },

  utils: {
    seedFromFile: async (): Promise<boolean> => {
      console.log('Seeding database from file...');
      try {
        const { menus } = await import('../data/menu');
        console.log('Loaded menus from file:', Object.keys(menus));
        
        const db = readDatabase();
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          console.log('Adding menu to database:', menuId);
          db.menus[menuId] = menuData;
        }
        
        const success = writeDatabase(db);
        console.log('Database seeded successfully:', success);
        return success;
      } catch (error) {
        console.error('Error seeding database:', error);
        return false;
      }
    },

    exportToJSON: (): string => {
      console.log('Exporting database to JSON...');
      try {
        const db = readDatabase();
        const exported = JSON.stringify(db.menus, null, 2);
        console.log('Database exported successfully');
        return exported;
      } catch (error) {
        console.error('Error exporting database:', error);
        return '{}';
      }
    },

    hasData: (): boolean => {
      console.log('Checking if database has data...');
      try {
        const db = readDatabase();
        const hasData = Object.keys(db.menus).length > 0;
        console.log('Database has data:', hasData);
        return hasData;
      } catch (error) {
        console.error('Error checking database data:', error);
        return false;
      }
    },

    clearAll: (): boolean => {
      console.log('Clearing all database data...');
      try {
        const db = readDatabase();
        db.menus = {};
        const success = writeDatabase(db);
        console.log('Database cleared successfully:', success);
        return success;
      } catch (error) {
        console.error('Error clearing database:', error);
        return false;
      }
    },

    getInfo: () => {
      console.log('Getting database info...');
      try {
        const db = readDatabase();
        const menusCount = Object.keys(db.menus).length;
        const productsCount = Object.values(db.menus).reduce((total, menu) => total + menu.products.length, 0);
        
        const info = {
          menusCount,
          productsCount,
          dbType: 'json',
          environment: process.env.VERCEL === '1' ? 'vercel' : 'development',
          hasMenuData: !!process.env.MENU_DATA,
          dbExists: typeof window === 'undefined' ? fs.existsSync(dbPath) : false,
          dbPath: typeof window === 'undefined' ? dbPath : 'client-side',
          lastUpdated: db.lastUpdated
        };
        
        console.log('Database info:', info);
        return info;
      } catch (error) {
        console.error('Error getting database info:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbType: 'error',
          environment: 'error',
          hasMenuData: false,
          dbExists: false,
          dbPath: 'error',
          lastUpdated: null
        };
      }
    },
  },
};

// Inicializar la base de datos al importar el módulo
if (typeof window === 'undefined') {
  console.log('Initializing database on module load...');
  DatabaseAPI.init();
}

export default DatabaseAPI;