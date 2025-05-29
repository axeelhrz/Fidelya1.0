import fs from 'fs';
import path from 'path';
import { Product, MenuData } from '../app/types';

// Ruta del archivo de base de datos JSON
const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'menu.json');

// Crear el directorio data si no existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
  }

  return defaultData;
};

// Leer la base de datos
const readDatabase = (): DatabaseStructure => {
  try {
    if (!fs.existsSync(dbPath)) {
      return initDatabase();
    }
    
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo la base de datos:', error);
    return initDatabase();
  }
};

// Escribir a la base de datos
const writeDatabase = (data: DatabaseStructure): boolean => {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error escribiendo a la base de datos:', error);
    return false;
  }
};

// API de la base de datos
export const DatabaseAPI = {
  // Inicializar la base de datos
  init: () => {
    try {
      initDatabase();
      console.log('Base de datos JSON inicializada correctamente');
      return true;
    } catch (error) {
      console.error('Error inicializando la base de datos:', error);
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
        console.error('Error creando menú:', error);
        return false;
      }
    },

    get: (id: string): MenuData | null => {
      try {
        const db = readDatabase();
        return db.menus[id] || null;
      } catch (error) {
        console.error('Error obteniendo menú:', error);
        return null;
      }
    },

    getAll: (): MenuData[] => {
      try {
        const db = readDatabase();
        return Object.values(db.menus);
      } catch (error) {
        console.error('Error obteniendo todos los menús:', error);
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
        console.error('Error actualizando menú:', error);
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
        console.error('Error eliminando menú:', error);
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
        console.error('Error creando producto:', error);
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
        console.error('Error actualizando producto:', error);
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
        console.error('Error eliminando producto:', error);
        return false;
      }
    },

    getByMenu: (menuId: string): Product[] => {
      try {
        const db = readDatabase();
        return db.menus[menuId]?.products || [];
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
        const db = readDatabase();
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          db.menus[menuId] = menuData;
        }
        
        const success = writeDatabase(db);
        if (success) {
          console.log('Datos iniciales importados correctamente');
        }
        return success;
      } catch (error) {
        console.error('Error importando datos iniciales:', error);
        return false;
      }
    },

    // Exportar datos a formato JSON
    exportToJSON: (): string => {
      try {
        const db = readDatabase();
        return JSON.stringify(db.menus, null, 2);
      } catch (error) {
        console.error('Error exportando datos:', error);
        return '{}';
      }
    },

    // Verificar si la base de datos tiene datos
    hasData: (): boolean => {
      try {
        const db = readDatabase();
        return Object.keys(db.menus).length > 0;
      } catch (error) {
        console.error('Error verificando datos:', error);
        return false;
      }
    },

    // Limpiar toda la base de datos
    clearAll: (): boolean => {
      try {
        const db = readDatabase();
        db.menus = {};
        const success = writeDatabase(db);
        if (success) {
          console.log('Base de datos limpiada correctamente');
        }
        return success;
      } catch (error) {
        console.error('Error limpiando la base de datos:', error);
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
          dbPath,
          dbExists: fs.existsSync(dbPath),
          lastUpdated: db.lastUpdated
        };
      } catch (error) {
        console.error('Error obteniendo información de la base de datos:', error);
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

export default DatabaseAPI;