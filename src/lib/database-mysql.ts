import mysql from 'mysql2/promise';
import { Product, MenuData } from '../app/types';

// Configuración optimizada para Vercel
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'menuqr',
      charset: 'utf8mb4',
      // Configuraciones específicas para Vercel
      ssl: process.env.MYSQL_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false,
      connectTimeout: 20000,
      acquireTimeout: 20000,
      timeout: 20000,
      // Importante: cerrar conexiones rápidamente en serverless
      idleTimeout: 1000,
      // Configuraciones para PlanetScale u otros proveedores cloud
      ...(process.env.MYSQL_SSL === 'true' && {
        ssl: {
          rejectUnauthorized: true
        }
      })
    });
      console.log('Conexión MySQL establecida correctamente');
      return connection;
    } catch (error) {
    console.error('Error conectando a MySQL:', error);
    throw error;
    }
};

// Función helper para manejar conexiones en Vercel
const withConnection = async <T>(
  operation: (connection: mysql.Connection) => Promise<T>
): Promise<T> => {
  let connection: mysql.Connection | null = null;
  try {
    connection = await createConnection();
    const result = await operation(connection);
    return result;
  } catch (error) {
    console.error('Error en operación de base de datos:', error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error cerrando conexión:', closeError);
  }
    }
  }
};

// Crear un pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'menuqr',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
    });
    
// Reemplazar createConnection() con:
const getConnection = async () => {
  return await pool.getConnection();
};

// Función para inicializar las tablas
const initializeTables = async (connection: mysql.Connection) => {
  try {
    // Crear tabla de menús
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menus (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla de productos
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        menu_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        description TEXT,
        category ENUM('Entrada', 'Principal', 'Bebida', 'Postre') NOT NULL,
        is_recommended BOOLEAN DEFAULT FALSE,
        is_vegan BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
        INDEX idx_menu_id (menu_id),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Tablas MySQL inicializadas correctamente');
    return true;
  } catch (error) {
    console.error('Error inicializando tablas MySQL:', error);
    return false;
  }
};

// API de la base de datos MySQL optimizada para Vercel
export const DatabaseAPI = {
  init: async (): Promise<boolean> => {
    console.log('Inicializando base de datos MySQL...');
    return withConnection(async (connection) => {
      return await initializeTables(connection);
    });
  },

  menus: {
    create: async (menuData: MenuData): Promise<boolean> => {
      console.log('Creando menú en MySQL:', menuData.id);
      return withConnection(async (connection) => {
        try {
          await connection.beginTransaction();

          // Insertar menú
          await connection.execute(
            'INSERT INTO menus (id, name, description) VALUES (?, ?, ?)',
            [menuData.id, menuData.name, menuData.description]
          );

          // Insertar productos
          if (menuData.products.length > 0) {
            for (const product of menuData.products) {
              await connection.execute(
                'INSERT INTO products (id, menu_id, name, price, description, category, is_recommended, is_vegan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                  product.id,
                  menuData.id,
                  product.name,
                  product.price,
                  product.description,
                  product.category,
                  product.isRecommended || false,
                  product.isVegan || false
                ]
              );
            }
          }

          await connection.commit();
          console.log('Menú creado exitosamente en MySQL');
          return true;
        } catch (error) {
          await connection.rollback();
          console.error('Error creando menú en MySQL:', error);
          return false;
        }
      });
    },

    get: async (id: string): Promise<MenuData | null> => {
      console.log('Obteniendo menú de MySQL:', id);
      return withConnection(async (connection) => {
        try {
          // Obtener menú
          const [menuRows]: any = await connection.execute(
            'SELECT * FROM menus WHERE id = ?',
            [id]
          );

          if (menuRows.length === 0) {
            return null;
          }

          const menu = menuRows[0];

          // Obtener productos
          const [productRows]: any = await connection.execute(
            'SELECT * FROM products WHERE menu_id = ? ORDER BY category, name',
            [id]
          );

          const menuData: MenuData = {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            products: productRows.map((product: any) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
              isRecommended: product.is_recommended,
              isVegan: product.is_vegan
            }))
          };

          return menuData;
        } catch (error) {
          console.error('Error obteniendo menú de MySQL:', error);
          return null;
        }
      });
    },

    getAll: async (): Promise<MenuData[]> => {
      console.log('Obteniendo todos los menús de MySQL...');
      return withConnection(async (connection) => {
        try {
          // Obtener todos los menús
          const [menuRows]: any = await connection.execute(
            'SELECT * FROM menus ORDER BY name'
          );

          if (menuRows.length === 0) {
            return [];
          }

          // Obtener todos los productos
          const [productRows]: any = await connection.execute(
            'SELECT * FROM products ORDER BY menu_id, category, name'
          );

          // Agrupar productos por menú
          const productsByMenu: Record<string, Product[]> = {};
          productRows.forEach((product: any) => {
            if (!productsByMenu[product.menu_id]) {
              productsByMenu[product.menu_id] = [];
            }
            productsByMenu[product.menu_id].push({
              id: product.id,
              name: product.name,
              price: product.price,
              description: product.description,
              category: product.category,
              isRecommended: product.is_recommended,
              isVegan: product.is_vegan
            });
          });

          // Construir menús completos
          const menus: MenuData[] = menuRows.map((menu: any) => ({
            id: menu.id,
            name: menu.name,
            description: menu.description,
            products: productsByMenu[menu.id] || []
          }));

          console.log('Encontrados', menus.length, 'menús en MySQL');
          return menus;
        } catch (error) {
          console.error('Error obteniendo menús de MySQL:', error);
          return [];
        }
      });
    },

    update: async (menuData: MenuData): Promise<boolean> => {
      console.log('Actualizando menú en MySQL:', menuData.id);
      return withConnection(async (connection) => {
        try {
          const [result]: any = await connection.execute(
            'UPDATE menus SET name = ?, description = ? WHERE id = ?',
            [menuData.name, menuData.description, menuData.id]
          );

          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error actualizando menú en MySQL:', error);
          return false;
        }
      });
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Eliminando menú de MySQL:', id);
      return withConnection(async (connection) => {
        try {
          const [result]: any = await connection.execute(
            'DELETE FROM menus WHERE id = ?',
            [id]
          );

          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error eliminando menú de MySQL:', error);
          return false;
        }
      });
    }
  },

  products: {
    create: async (product: Product, menuId: string): Promise<boolean> => {
      console.log('Creando producto en MySQL:', product.id);
      return withConnection(async (connection) => {
        try {
          await connection.execute(
            'INSERT INTO products (id, menu_id, name, price, description, category, is_recommended, is_vegan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [product.id, menuId, product.name, product.price, product.description, product.category, product.isRecommended || false, product.isVegan || false]
          );

          return true;
        } catch (error) {
          console.error('Error creando producto en MySQL:', error);
          return false;
        }
      });
    },

    update: async (product: Product): Promise<boolean> => {
      console.log('Actualizando producto en MySQL:', product.id);
      return withConnection(async (connection) => {
        try {
          const [result]: any = await connection.execute(
            'UPDATE products SET name = ?, price = ?, description = ?, category = ?, is_recommended = ?, is_vegan = ? WHERE id = ?',
            [product.name, product.price, product.description, product.category, product.isRecommended || false, product.isVegan || false, product.id]
          );

          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error actualizando producto en MySQL:', error);
          return false;
        }
      });
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Eliminando producto de MySQL:', id);
      return withConnection(async (connection) => {
        try {
          const [result]: any = await connection.execute(
            'DELETE FROM products WHERE id = ?',
            [id]
          );

          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error eliminando producto de MySQL:', error);
          return false;
        }
      });
    },

    getByMenu: async (menuId: string): Promise<Product[]> => {
      console.log('Obteniendo productos del menú de MySQL:', menuId);
      return withConnection(async (connection) => {
        try {
          const [rows]: any = await connection.execute(
            'SELECT * FROM products WHERE menu_id = ? ORDER BY category, name',
            [menuId]
          );

          const products: Product[] = rows.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            isRecommended: product.is_recommended,
            isVegan: product.is_vegan
          }));

          return products;
        } catch (error) {
          console.error('Error obteniendo productos de MySQL:', error);
          return [];
        }
      });
    }
  },

  utils: {
    seedFromFile: async (): Promise<boolean> => {
      console.log('Sembrando base de datos MySQL desde archivo...');
      try {
        const { menus } = await import('../data/menu');
        
        for (const [menuId, menuData] of Object.entries(menus)) {
          console.log('Sembrando menú:', menuId);
          
          // Verificar si el menú ya existe
          const existingMenu = await DatabaseAPI.menus.get(menuId);
          if (existingMenu) {
            console.log('El menú ya existe, omitiendo:', menuId);
            continue;
          }

          // Crear el menú
          const success = await DatabaseAPI.menus.create(menuData);
          if (!success) {
            console.error('Error sembrando menú:', menuId);
            return false;
          }
        }

        console.log('Base de datos MySQL sembrada exitosamente');
        return true;
      } catch (error) {
        console.error('Error sembrando base de datos MySQL:', error);
        return false;
      }
    },

    exportToJSON: async (): Promise<string> => {
      console.log('Exportando base de datos MySQL a JSON...');
      try {
        const menus = await DatabaseAPI.menus.getAll();
        const menusObject = menus.reduce((acc, menu) => {
          acc[menu.id] = menu;
          return acc;
        }, {} as Record<string, MenuData>);

        return JSON.stringify(menusObject, null, 2);
      } catch (error) {
        console.error('Error exportando base de datos MySQL:', error);
        return '{}';
      }
    },

    hasData: async (): Promise<boolean> => {
      console.log('Verificando si la base de datos MySQL tiene datos...');
      return withConnection(async (connection) => {
        try {
          const [rows]: any = await connection.execute(
            'SELECT COUNT(*) as count FROM menus'
          );

          const hasData = rows[0].count > 0;
          console.log('La base de datos tiene datos:', hasData);
          return hasData;
        } catch (error) {
          console.error('Error verificando datos en MySQL:', error);
          return false;
        }
      });
    },

    clearAll: async (): Promise<boolean> => {
      console.log('Limpiando todos los datos de MySQL...');
      return withConnection(async (connection) => {
        try {
          await connection.beginTransaction();
          
          // Eliminar productos primero (por la clave foránea)
          await connection.execute('DELETE FROM products');
          
          // Eliminar menús
          await connection.execute('DELETE FROM menus');
          
          await connection.commit();
          console.log('Base de datos MySQL limpiada exitosamente');
          return true;
        } catch (error) {
          await connection.rollback();
          console.error('Error limpiando base de datos MySQL:', error);
          return false;
        }
      });
    },

    getInfo: async () => {
      console.log('Obteniendo información de la base de datos MySQL...');
      return withConnection(async (connection) => {
        try {
          // Contar menús
          const [menuRows]: any = await connection.execute(
            'SELECT COUNT(*) as count FROM menus'
          );

          // Contar productos
          const [productRows]: any = await connection.execute(
            'SELECT COUNT(*) as count FROM products'
          );

          const info = {
            menusCount: menuRows[0].count,
            productsCount: productRows[0].count,
            dbType: 'mysql',
            environment: 'production',
            hasMenuData: true,
            dbExists: true,
            dbPath: 'mysql-database',
            lastUpdated: new Date().toISOString()
          };

          console.log('Información de la base de datos MySQL:', info);
          return info;
        } catch (error) {
          console.error('Error obteniendo información de MySQL:', error);
          return {
            menusCount: 0,
            productsCount: 0,
            dbType: 'mysql-error',
            environment: 'error',
            hasMenuData: false,
            dbExists: false,
            dbPath: 'error',
            lastUpdated: null
          };
        }
      });
    }
  }
};

export default DatabaseAPI;

const createConnectionWithRetry = async (retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('Conexión MySQL establecida correctamente');
      return connection;
    } catch (error) {
      console.error(`Intento ${i + 1} fallido:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

const validateSchema = async (connection: any): Promise<boolean> => {
  try {
    // Verificar que las tablas existen
    const [tables]: any = await connection.execute(
      "SHOW TABLES LIKE 'menus'"
    );
    
    if (tables.length === 0) {
      console.log('Esquema no encontrado, inicializando...');
      return await initializeTables(connection);
    }
    
    // Verificar estructura de columnas
    const [columns]: any = await connection.execute(
      "DESCRIBE menus"
    );
    
    const requiredColumns = ['id', 'name', 'description', 'created_at', 'updated_at'];
    const existingColumns = columns.map((col: any) => col.Field);
    
    for (const col of requiredColumns) {
      if (!existingColumns.includes(col)) {
        console.error(`Columna faltante: ${col}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error validando esquema:', error);
    return false;
  }
};