import fs from 'fs';
import path from 'path';
import { Product, MenuData } from '../app/types';

// Ruta del archivo de base de datos JSON
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'menu.json');

console.log('Database path:', dbPath);

// Crear el directorio data si no existe (solo en servidor)
if (typeof window === 'undefined') {
  try {
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}
// Estructura de la base de datos
interface DatabaseStructure {
  menus: Record<string, MenuData>;
  lastUpdated: string;
}

// Inicializar la base de datos si no existe
const initDatabase = (): DatabaseStructure => {
  const defaultData: DatabaseStructure = {
    menus: {},
    lastUpdated: new Date().toISOString()
  };

  if (typeof window === 'undefined') {
    try {
      if (!fs.existsSync(dbPath)) {
        console.log('Database file does not exist, creating...');
        fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  return defaultData;
};

// Leer la base de datos
const readDatabase = (): DatabaseStructure => {
  if (typeof window !== 'undefined') {
    // En el cliente, retornar datos vacíos
    return { menus: {}, lastUpdated: new Date().toISOString() };
  }

  try {
    if (!fs.existsSync(dbPath)) {
      console.log('Database file not found, initializing...');
      return initDatabase();
    }
    
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    return parsed;
      } catch (error) {
    console.error('Error reading database:', error);
    return initDatabase();
  }
        };

// Escribir a la base de datos
const writeDatabase = (data: DatabaseStructure): boolean => {
  if (typeof window !== 'undefined') {
    // No escribir en el cliente
    return false;
      }

  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// API de la base de datos
export const DatabaseAPI = {
  // Inicializar la base de datos
  init: () => {
    if (typeof window !== 'undefined') return true;
    
    try {
      initDatabase();
      return true;
    } catch (error) {
      console.error('Error initializing database API:', error);
      return false;
    }
  },

  // Operaciones de menús
  menus: {
    create: (menuData: MenuData): boolean => {
      try {
        const db = readDatabase();
        db.menus[menuData.id] = menuData;
        return writeDatabase(db);
      } catch (error) {
        console.error('Error creating menu:', error);
        return false;
      }
    },

    get: (id: string): MenuData | null => {
      try {
        const db = readDatabase();
        return db.menus[id] || null;
      } catch (error) {
        console.error('Error getting menu:', error);
        return null;
      }
    },

    getAll: (): MenuData[] => {
      try {
        const db = readDatabase();
        return Object.values(db.menus);
      } catch (error) {
        console.error('Error getting all menus:', error);
        return [];
      }
    },

    update: (menuData: MenuData): boolean => {
      try {
        const db = readDatabase();
        if (db.menus[menuData.id]) {
          db.menus[menuData.id] = { ...db.menus[menuData.id], ...menuData };
          return writeDatabase(db);
        }
        return false;
      } catch (error) {
        console.error('Error updating menu:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      try {
        const db = readDatabase();
        if (db.menus[id]) {
          delete db.menus[id];
          return writeDatabase(db);
        }
        return false;
      } catch (error) {
        console.error('Error deleting menu:', error);
        return false;
      }
    },
  },

  // Operaciones de productos
  products: {
    create: (product: Product, menuId: string): boolean => {
      try {
        const db = readDatabase();
        if (db.menus[menuId]) {
          db.menus[menuId].products.push(product);
          return writeDatabase(db);
        }
        return false;
      } catch (error) {
        console.error('Error creating product:', error);
        return false;
      }
    },

    update: (product: Product, menuId: string): boolean => {
      try {
        const db = readDatabase();
        if (db.menus[menuId]) {
          const productIndex = db.menus[menuId].products.findIndex(p => p.id === product.id);
          if (productIndex !== -1) {
            db.menus[menuId].products[productIndex] = product;
            return writeDatabase(db);
          }
        }
        return false;
      } catch (error) {
        console.error('Error updating product:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      try {
        const db = readDatabase();
        for (const menuId in db.menus) {
          const productIndex = db.menus[menuId].products.findIndex(p => p.id === id);
          if (productIndex !== -1) {
            db.menus[menuId].products.splice(productIndex, 1);
            return writeDatabase(db);
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
        const db = readDatabase();
        return db.menus[menuId]?.products || [];
      } catch (error) {
        console.error('Error getting products:', error);
        return [];
      }
    },
  },

  // Utilidades
  utils: {
    // Importar datos iniciales desde el archivo menu.ts
    seedFromFile: async (): Promise<boolean> => {
      try {
        const { menus } = await import('../data/menu');
        const db = readDatabase();
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          db.menus[menuId] = menuData;
        }
        
        return writeDatabase(db);
      } catch (error) {
        console.error('Error seeding database:', error);
        return false;
      }
    },

    // Exportar datos a formato JSON
    exportToJSON: (): string => {
      try {
        const db = readDatabase();
        return JSON.stringify(db.menus, null, 2);
      } catch (error) {
        console.error('Error exporting database:', error);
        return '{}';
      }
    },

    // Verificar si la base de datos tiene datos
    hasData: (): boolean => {
      try {
        const db = readDatabase();
        return Object.keys(db.menus).length > 0;
      } catch (error) {
        console.error('Error checking database data:', error);
        return false;
      }
    },

    // Limpiar toda la base de datos
    clearAll: (): boolean => {
      try {
        const db = readDatabase();
        db.menus = {};
        return writeDatabase(db);
      } catch (error) {
        console.error('Error clearing database:', error);
        return false;
      }
    },

    // Obtener información de la base de datos
    getInfo: () => {
      try {
        const db = readDatabase();
        const menusCount = Object.keys(db.menus).length;
        const productsCount = Object.values(db.menus).reduce((total, menu) => total + menu.products.length, 0);
        
        return {
          menusCount,
          productsCount,
          dbPath: typeof window === 'undefined' ? dbPath : 'client-side',
          dbExists: typeof window === 'undefined' ? fs.existsSync(dbPath) : false,
          lastUpdated: db.lastUpdated
        };
      } catch (error) {
        console.error('Error getting database info:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbPath: 'error',
          dbExists: false,
          lastUpdated: null
        };
      }
    },
  },
};

// Inicializar la base de datos al importar el módulo (solo en servidor)
if (typeof window === 'undefined') {
DatabaseAPI.init();
}

export default DatabaseAPI;