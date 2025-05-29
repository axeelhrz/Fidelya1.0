import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Product, MenuData } from '../app/types';

interface MenuRow {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Crear el directorio data si no existe
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Crear la base de datos en el directorio del proyecto
const dbPath = path.join(dataDir, 'menu.db');
const db = new Database(dbPath);

// Habilitar WAL mode para mejor concurrencia
db.pragma('journal_mode = WAL');

// Crear las tablas si no existen
const initDatabase = () => {
  try {
    // Tabla de menús
    db.exec(`
      CREATE TABLE IF NOT EXISTS menus (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de productos
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

    // Índices para mejor rendimiento
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_menu_id ON products (menu_id);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
    `);
      console.log('Base de datos inicializada correctamente');
      return true;
    } catch (error) {
      console.error('Error inicializando la base de datos:', error);
      return false;
    }
        };

// Preparar statements para mejor rendimiento
const statements = {
  // Menús
  insertMenu: db.prepare(`
    INSERT OR REPLACE INTO menus (id, name, description, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `),
  
  getMenu: db.prepare(`
    SELECT * FROM menus WHERE id = ?
  `),
  
  getAllMenus: db.prepare(`
    SELECT * FROM menus ORDER BY created_at ASC
  `),
  
  deleteMenu: db.prepare(`
    DELETE FROM menus WHERE id = ?
  `),

  // Productos
  insertProduct: db.prepare(`
    INSERT OR REPLACE INTO products 
    (id, menu_id, name, price, description, category, is_recommended, is_vegan, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `),
  
  getProductsByMenu: db.prepare(`
    SELECT * FROM products WHERE menu_id = ? ORDER BY category, name
  `),
  
  getProduct: db.prepare(`
    SELECT * FROM products WHERE id = ?
  `),
  
  deleteProduct: db.prepare(`
    DELETE FROM products WHERE id = ?
  `),
  
  deleteProductsByMenu: db.prepare(`
    DELETE FROM products WHERE menu_id = ?
  `),
          };

// Funciones de la API de base de datos
export const DatabaseAPI = {
  // Inicializar la base de datos
  init: () => {
    return initDatabase();
    },

  // Operaciones de menús
  menus: {
    create: (menuData: MenuData): boolean => {
      try {
        statements.insertMenu.run(menuData.id, menuData.name, menuData.description);
        return true;
      } catch (error) {
        console.error('Error creando menú:', error);
        return false;
      }
    },

    get: (id: string): MenuData | null => {
      try {
        const menu = statements.getMenu.get(id) as any;
        if (!menu) return null;
        const products = statements.getProductsByMenu.all(id) as any[];
        return {
          id: menu.id,
          name: menu.name,
          description: menu.description,
          products: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          category: p.category as any,
          isRecommended: Boolean(p.is_recommended),
          isVegan: Boolean(p.is_vegan),
          }))
        };
      } catch (error) {
        console.error('Error obteniendo menú:', error);
        return null;
      }
    },

    getAll: (): MenuData[] => {
      try {
        const menus = statements.getAllMenus.all() as any[];
        return menus.map(menu => {
          const products = statements.getProductsByMenu.all(menu.id) as any[];
          return {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            products: products.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description,
              category: p.category as any,
              isRecommended: Boolean(p.is_recommended),
              isVegan: Boolean(p.is_vegan),
            }))
};
        });
      } catch (error) {
        console.error('Error obteniendo todos los menús:', error);
        return [];
      }
    },

    update: (menuData: MenuData): boolean => {
      try {
        statements.insertMenu.run(menuData.id, menuData.name, menuData.description);
        return true;
      } catch (error) {
        console.error('Error actualizando menú:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      try {
        statements.deleteProductsByMenu.run(id);
        statements.deleteMenu.run(id);
        return true;
      } catch (error) {
        console.error('Error eliminando menú:', error);
        return false;
      }
    },
  },

  // Operaciones de productos
  products: {
    create: (product: Product, menuId: string): boolean => {
      try {
        statements.insertProduct.run(
          product.id,
          menuId,
          product.name,
          product.price,
          product.description,
          product.category,
          product.isRecommended ? 1 : 0,
          product.isVegan ? 1 : 0
        );
        return true;
      } catch (error) {
        console.error('Error creando producto:', error);
        return false;
      }
    },

    update: (product: Product, menuId: string): boolean => {
      try {
        statements.insertProduct.run(
          product.id,
          menuId,
          product.name,
          product.price,
          product.description,
          product.category,
          product.isRecommended ? 1 : 0,
          product.isVegan ? 1 : 0
        );
        return true;
      } catch (error) {
        console.error('Error actualizando producto:', error);
        return false;
      }
    },

    delete: (id: string): boolean => {
      try {
        statements.deleteProduct.run(id);
        return true;
      } catch (error) {
        console.error('Error eliminando producto:', error);
        return false;
      }
    },

    getByMenu: (menuId: string): Product[] => {
      try {
        const products = statements.getProductsByMenu.all(menuId) as any[];
        return products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          category: p.category as any,
          isRecommended: Boolean(p.is_recommended),
          isVegan: Boolean(p.is_vegan),
        }));
      } catch (error) {
        console.error('Error obteniendo productos:', error);
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
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          // Crear el menú
          DatabaseAPI.menus.create(menuData);
          
          // Crear los productos
          for (const product of menuData.products) {
            DatabaseAPI.products.create(product, menuId);
          }
        }
        
        console.log('Datos iniciales importados correctamente');
        return true;
      } catch (error) {
        console.error('Error importando datos iniciales:', error);
        return false;
      }
    },

    // Exportar datos a formato JSON
    exportToJSON: (): string => {
      try {
        const menus = DatabaseAPI.menus.getAll();
        const exportData: Record<string, MenuData> = {};
        
        menus.forEach(menu => {
          exportData[menu.id] = menu;
        });
        
        return JSON.stringify(exportData, null, 2);
      } catch (error) {
        console.error('Error exportando datos:', error);
        return '{}';
      }
    },

    // Verificar si la base de datos tiene datos
    hasData: (): boolean => {
      try {
        const menus = statements.getAllMenus.all();
        return menus.length > 0;
      } catch (error) {
        console.error('Error verificando datos:', error);
        return false;
      }
    },

    // Limpiar toda la base de datos
    clearAll: (): boolean => {
      try {
        db.exec('DELETE FROM products');
        db.exec('DELETE FROM menus');
        console.log('Base de datos limpiada correctamente');
        return true;
      } catch (error) {
        console.error('Error limpiando la base de datos:', error);
        return false;
      }
    },

    // Cerrar la conexión de la base de datos
    close: (): void => {
      try {
        db.close();
        console.log('Conexión de base de datos cerrada');
      } catch (error) {
        console.error('Error cerrando la base de datos:', error);
      }
    },

    // Obtener información de la base de datos
    getInfo: () => {
      try {
        const menusCount = statements.getAllMenus.all().length;
        const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
        
        return {
          menusCount,
          productsCount: productsCount.count,
          dbPath,
          dbExists: fs.existsSync(dbPath)
        };
      } catch (error) {
        console.error('Error obteniendo información de la base de datos:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbPath,
          dbExists: false
        };
      }
    },
  },
};

// Inicializar la base de datos al importar el módulo
DatabaseAPI.init();

export default DatabaseAPI;