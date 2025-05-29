import fs from 'fs';
import path from 'path';
import { Product, MenuData } from '../app/types';

// Estructura de la base de datos JSON
interface DatabaseStructure {
  menus: Record<string, MenuData>;
  lastUpdated: string;
}

// Interfaces para SQLite
interface MenuRow {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ProductRow {
  id: string;
  menu_id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  is_recommended: number;
  is_vegan: number;
  created_at: string;
  updated_at: string;
}

// Variables para SQLite
let Database: typeof import('better-sqlite3') | null = null;
let db: import('better-sqlite3').Database | null = null;
let statements: {
  insertMenu: import('better-sqlite3').Statement<[string, string, string]>;
  getMenu: import('better-sqlite3').Statement<[string]>;
  getAllMenus: import('better-sqlite3').Statement<[]>;
  deleteMenu: import('better-sqlite3').Statement<[string]>;
  insertProduct: import('better-sqlite3').Statement<[string, string, string, number, string, string, number, number]>;
  getProductsByMenu: import('better-sqlite3').Statement<[string]>;
  deleteProduct: import('better-sqlite3').Statement<[string]>;
  deleteProductsByMenu: import('better-sqlite3').Statement<[string]>;
} | null = null;

// Variables para JSON
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'menu.json');
const sqlitePath = path.join(dataDir, 'menu.db');

// Función para cargar SQLite dinámicamente
const loadSQLite = async () => {
  if (Database) return Database;
  try {
    const sqlite = await import('better-sqlite3');
    Database = sqlite.default;
    return Database;
    } catch {
    console.log('SQLite not available, using JSON database');
    return null;
    }
    };

// Inicializar base de datos
const initDatabase = async () => {
  if (typeof window !== 'undefined') return true;

  // Crear directorio si no existe
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Intentar usar SQLite si está disponible y no estamos en Vercel
  if (!process.env.VERCEL) {
    const SQLiteClass = await loadSQLite();
    
    if (SQLiteClass) {
    try {
        db = new SQLiteClass(sqlitePath);
        db.pragma('journal_mode = WAL');
        
        // Crear tablas
        db.exec(`
          CREATE TABLE IF NOT EXISTS menus (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        db.exec(`
          CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            menu_id TEXT NOT NULL,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL CHECK (category IN ('Entrada', 'Principal', 'Bebida', 'Postre')),
            is_recommended BOOLEAN DEFAULT FALSE,
            is_vegan BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (menu_id) REFERENCES menus (id) ON DELETE CASCADE
          )
        `);

        // Preparar statements
        statements = {
          insertMenu: db.prepare(`INSERT OR REPLACE INTO menus (id, name, description, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`),
          getMenu: db.prepare(`SELECT * FROM menus WHERE id = ?`),
          getAllMenus: db.prepare(`SELECT * FROM menus ORDER BY created_at ASC`),
          deleteMenu: db.prepare(`DELETE FROM menus WHERE id = ?`),
          insertProduct: db.prepare(`INSERT OR REPLACE INTO products (id, menu_id, name, price, description, category, is_recommended, is_vegan, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`),
          getProductsByMenu: db.prepare(`SELECT * FROM products WHERE menu_id = ? ORDER BY category, name`),
          deleteProduct: db.prepare(`DELETE FROM products WHERE id = ?`),
          deleteProductsByMenu: db.prepare(`DELETE FROM products WHERE menu_id = ?`),
};

        console.log('SQLite database initialized');
    return true;
  } catch (error) {
        console.error('Error initializing SQLite, falling back to JSON:', error);
        db = null;
        statements = null;
  }
    }
  }
      // Fallback a JSON
  if (!fs.existsSync(dbPath)) {
    const defaultData: DatabaseStructure = {
      menus: {},
          lastUpdated: new Date().toISOString()
        };
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }

  console.log('JSON database initialized');
  return true;
        };

// Funciones para JSON
const readJSONDatabase = (): DatabaseStructure => {
  if (typeof window !== 'undefined') {
    return { menus: {}, lastUpdated: new Date().toISOString() };
}

  // En Vercel, usar variable de entorno
  if (process.env.VERCEL === '1' && process.env.MENU_DATA) {
    try {
      return JSON.parse(process.env.MENU_DATA);
    } catch (error) {
      console.error('Error parsing MENU_DATA:', error);
    }
  }

  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading JSON database:', error);
  }

  return { menus: {}, lastUpdated: new Date().toISOString() };
};

const writeJSONDatabase = (data: DatabaseStructure): boolean => {
  if (typeof window !== 'undefined' || process.env.VERCEL === '1') {
    return false;
  }

  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing JSON database:', error);
    return false;
  }
};

// API unificada
export const DatabaseAPI = {
  init: async () => {
    return await initDatabase();
  },

  menus: {
    create: (menuData: MenuData): boolean => {
      if (db && statements) {
        try {
          statements.insertMenu.run(menuData.id, menuData.name, menuData.description);
          
          // Insert products
          for (const product of menuData.products) {
            statements.insertProduct.run(
              product.id, menuData.id, product.name, product.price, 
              product.description, product.category, 
              product.isRecommended ? 1 : 0, product.isVegan ? 1 : 0
            );
          }
          return true;
        } catch (error) {
          console.error('Error creating menu in SQLite:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        data.menus[menuData.id] = menuData;
        return writeJSONDatabase(data);
      } catch (error) {
        console.error('Error creating menu in JSON:', error);
        return false;
      }
    },

    get: (id: string): MenuData | null => {
      if (db && statements) {
        try {
          const menu = statements.getMenu.get(id) as MenuRow | undefined;
          if (menu) {
            const products = statements.getProductsByMenu.all(id) as ProductRow[];
            return {
              id: menu.id,
              name: menu.name,
              description: menu.description,
              products: products.map((p: ProductRow) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                category: p.category as Product['category'],
                isRecommended: Boolean(p.is_recommended),
                isVegan: Boolean(p.is_vegan),
              }))
            };
          }
          return null;
        } catch (error) {
          console.error('Error getting menu from SQLite:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        return data.menus[id] || null;
      } catch (error) {
        console.error('Error getting menu from JSON:', error);
        return null;
      }
    },

    getAll: (): MenuData[] => {
      if (db && statements) {
        try {
          const menus = statements.getAllMenus.all() as MenuRow[];
          return menus.map((menu: MenuRow) => {
            const products = statements!.getProductsByMenu.all(menu.id) as ProductRow[];
            return {
              id: menu.id,
              name: menu.name,
              description: menu.description,
              products: products.map((p: ProductRow) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                category: p.category as Product['category'],
                isRecommended: Boolean(p.is_recommended),
                isVegan: Boolean(p.is_vegan),
              }))
            };
          });
        } catch (error) {
          console.error('Error getting all menus from SQLite:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        return Object.values(data.menus);
      } catch (error) {
        console.error('Error getting all menus from JSON:', error);
        return [];
      }
    },

    update: (menuData: MenuData): boolean => {
      return DatabaseAPI.menus.create(menuData); // Usar la misma lógica
    },

    delete: (id: string): boolean => {
      if (db && statements) {
        try {
          statements.deleteProductsByMenu.run(id);
          statements.deleteMenu.run(id);
          return true;
        } catch (error) {
          console.error('Error deleting menu from SQLite:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        if (data.menus[id]) {
          delete data.menus[id];
          return writeJSONDatabase(data);
        }
        return false;
      } catch (error) {
        console.error('Error deleting menu from JSON:', error);
        return false;
      }
    },
  },

  products: {
    create: (product: Product, menuId: string): boolean => {
      if (db && statements) {
        try {
          statements.insertProduct.run(
            product.id, menuId, product.name, product.price, product.description,
            product.category, product.isRecommended ? 1 : 0, product.isVegan ? 1 : 0
          );
          return true;
        } catch (error) {
          console.error('Error creating product in SQLite:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        if (data.menus[menuId]) {
          data.menus[menuId].products.push(product);
          return writeJSONDatabase(data);
        }
        return false;
      } catch (error) {
        console.error('Error creating product in JSON:', error);
        return false;
      }
    },

    update: (product: Product, menuId: string): boolean => {
      return DatabaseAPI.products.create(product, menuId); // Usar la misma lógica
    },

    delete: (id: string): boolean => {
      if (db && statements) {
        try {
          statements.deleteProduct.run(id);
          return true;
        } catch (error) {
          console.error('Error deleting product from SQLite:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        for (const menuId in data.menus) {
          const productIndex = data.menus[menuId].products.findIndex(p => p.id === id);
          if (productIndex !== -1) {
            data.menus[menuId].products.splice(productIndex, 1);
            return writeJSONDatabase(data);
          }
        }
        return false;
      } catch (error) {
        console.error('Error deleting product from JSON:', error);
        return false;
      }
    },

    getByMenu: (menuId: string): Product[] => {
      const menu = DatabaseAPI.menus.get(menuId);
      return menu?.products || [];
    },
  },

  utils: {
    seedFromFile: async (): Promise<boolean> => {
      try {
        const { menus } = await import('../data/menu');
        
        for (const [, menuData] of Object.entries(menus)) {
          DatabaseAPI.menus.create(menuData);
        }
        
        return true;
      } catch (error) {
        console.error('Error seeding database:', error);
        return false;
      }
    },

    exportToJSON: (): string => {
      try {
        const menus = DatabaseAPI.menus.getAll();
        const exportData: Record<string, MenuData> = {};
        menus.forEach(menu => {
          exportData[menu.id] = menu;
        });
        return JSON.stringify(exportData, null, 2);
      } catch (error) {
        console.error('Error exporting database:', error);
        return '{}';
      }
    },

    hasData: (): boolean => {
      try {
        const menus = DatabaseAPI.menus.getAll();
        return menus.length > 0;
      } catch (error) {
        console.error('Error checking database data:', error);
        return false;
      }
    },

    clearAll: (): boolean => {
      if (db && statements) {
        try {
          db.exec('DELETE FROM products');
          db.exec('DELETE FROM menus');
          return true;
        } catch (error) {
          console.error('Error clearing SQLite database:', error);
        }
      }

      // Fallback a JSON
      try {
        const data = readJSONDatabase();
        data.menus = {};
        return writeJSONDatabase(data);
      } catch (error) {
        console.error('Error clearing JSON database:', error);
        return false;
      }
    },

    getInfo: () => {
      try {
        const menus = DatabaseAPI.menus.getAll();
        const menusCount = menus.length;
        const productsCount = menus.reduce((total, menu) => total + menu.products.length, 0);
        
        return {
          menusCount,
          productsCount,
          dbType: db ? 'sqlite' : 'json',
          environment: process.env.VERCEL === '1' ? 'vercel' : 'development',
          hasMenuData: !!process.env.MENU_DATA,
          dbExists: db ? true : (typeof window === 'undefined' ? fs.existsSync(dbPath) : false),
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error getting database info:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbType: 'error',
          environment: 'error',
          hasMenuData: false,
          dbExists: false,
          lastUpdated: null
        };
      }
    },
  },
};

// Inicializar (pero como init ahora es async, lo llamamos cuando sea necesario)
if (typeof window === 'undefined') {
  DatabaseAPI.init().catch(console.error);
}

export default DatabaseAPI;
