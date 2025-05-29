import fs from 'fs';
import path from 'path';
import { Product, MenuData } from '../app/types';

// Ruta del archivo de base de datos JSON
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'menu.json');

console.log('Database path:', dbPath);

// Crear el directorio data si no existe
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
}

// Estructura de la base de datos
interface DatabaseStructure {
  menus: Record<string, MenuData>;
  lastUpdated: string;
}

// Inicializar la base de datos si no existe
const initDatabase = (): DatabaseStructure => {
  console.log('Initializing database...');
  const defaultData: DatabaseStructure = {
    menus: {},
    lastUpdated: new Date().toISOString()
  };

  if (!fs.existsSync(dbPath)) {
    console.log('Database file does not exist, creating...');
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }

  return defaultData;
};

// Leer la base de datos
const readDatabase = (): DatabaseStructure => {
  try {
    if (!fs.existsSync(dbPath)) {
      console.log('Database file not found, initializing...');
      return initDatabase();
    }
    
    console.log('Reading database from:', dbPath);
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    console.log('Database loaded, menus count:', Object.keys(parsed.menus || {}).length);
    return parsed;
  } catch (error) {
    console.error('Error reading database:', error);
    return initDatabase();
  }
};

// Escribir a la base de datos
const writeDatabase = (data: DatabaseStructure): boolean => {
  try {
    data.lastUpdated = new Date().toISOString();
    console.log('Writing database with', Object.keys(data.menus).length, 'menus');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('Database written successfully');
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
    try {
      initDatabase();
      console.log('Database API initialized successfully');
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
        console.log('Creating menu:', menuData.id);
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
      try {
        console.log('Getting menu:', id);
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
      try {
        console.log('Getting all menus...');
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
      try {
        console.log('Updating menu:', menuData.id);
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
      try {
        console.log('Deleting menu:', id);
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

  // Operaciones de productos
  products: {
    create: (product: Product, menuId: string): boolean => {
      try {
        console.log('Creating product:', product.id, 'in menu:', menuId);
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
      try {
        console.log('Updating product:', product.id, 'in menu:', menuId);
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
      try {
        console.log('Deleting product:', id);
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
      try {
        console.log('Getting products for menu:', menuId);
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

  // Utilidades
  utils: {
    // Importar datos iniciales desde el archivo menu.ts
    seedFromFile: async (): Promise<boolean> => {
      try {
        console.log('Seeding database from file...');
        const { menus } = await import('../data/menu');
        console.log('Loaded menus from file:', Object.keys(menus));
        
        const db = readDatabase();
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          console.log('Adding menu to database:', menuId);
          db.menus[menuId] = menuData;
        }
        
        const success = writeDatabase(db);
        if (success) {
          console.log('Database seeded successfully');
        }
        return success;
      } catch (error) {
        console.error('Error seeding database:', error);
        return false;
      }
    },

    // Exportar datos a formato JSON
    exportToJSON: (): string => {
      try {
        console.log('Exporting database to JSON...');
        const db = readDatabase();
        const exported = JSON.stringify(db.menus, null, 2);
        console.log('Database exported successfully');
        return exported;
      } catch (error) {
        console.error('Error exporting database:', error);
        return '{}';
      }
    },

    // Verificar si la base de datos tiene datos
    hasData: (): boolean => {
      try {
        console.log('Checking if database has data...');
        const db = readDatabase();
        const hasData = Object.keys(db.menus).length > 0;
        console.log('Database has data:', hasData);
        return hasData;
      } catch (error) {
        console.error('Error checking database data:', error);
        return false;
      }
    },

    // Limpiar toda la base de datos
    clearAll: (): boolean => {
      try {
        console.log('Clearing all database data...');
        const db = readDatabase();
        db.menus = {};
        const success = writeDatabase(db);
        if (success) {
          console.log('Database cleared successfully');
        }
        return success;
      } catch (error) {
        console.error('Error clearing database:', error);
        return false;
      }
    },

    // Obtener información de la base de datos
    getInfo: () => {
      try {
        console.log('Getting database info...');
        const db = readDatabase();
        const menusCount = Object.keys(db.menus).length;
        const productsCount = Object.values(db.menus).reduce((total, menu) => total + menu.products.length, 0);
        
        const info = {
          menusCount,
          productsCount,
          dbPath,
          dbExists: fs.existsSync(dbPath),
          lastUpdated: db.lastUpdated
};

        console.log('Database info:', info);
        return info;
      } catch (error) {
        console.error('Error getting database info:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbPath,
          dbExists: false,
          lastUpdated: null
        };
      }
    },
  },
};

// Inicializar la base de datos al importar el módulo
console.log('Initializing database on module load...');
DatabaseAPI.init();

export default DatabaseAPI;