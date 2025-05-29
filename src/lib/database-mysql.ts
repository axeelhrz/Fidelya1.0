import mysql from 'mysql2/promise';
import { Product, MenuData } from '../app/types';

// Configuración de la conexión MySQL
const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'menuqr',
      charset: 'utf8mb4'
    });
    
    console.log('Conexión MySQL establecida correctamente');
    return connection;
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    throw error;
  }
};

// Función para inicializar las tablas
const initializeTables = async (connection: any) => {
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

// API de la base de datos MySQL
export const DatabaseAPI = {
  init: async (): Promise<boolean> => {
    console.log('Inicializando base de datos MySQL...');
    try {
      const connection = await createConnection();
      const success = await initializeTables(connection);
      await connection.end();
      return success;
    } catch (error) {
      console.error('Error inicializando MySQL:', error);
      return false;
    }
  },

  menus: {
    create: async (menuData: MenuData): Promise<boolean> => {
      console.log('Creando menú en MySQL:', menuData.id);
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
    },

    get: async (id: string): Promise<MenuData | null> => {
      console.log('Obteniendo menú de MySQL:', id);
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
    },

    getAll: async (): Promise<MenuData[]> => {
      console.log('Obteniendo todos los menús de MySQL...');
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
    },

    update: async (menuData: MenuData): Promise<boolean> => {
      console.log('Actualizando menú en MySQL:', menuData.id);
      const connection = await createConnection();
      
      try {
        const [result]: any = await connection.execute(
          'UPDATE menus SET name = ?, description = ? WHERE id = ?',
          [menuData.name, menuData.description, menuData.id]
        );

        return result.affectedRows > 0;
      } catch (error) {
        console.error('Error actualizando menú en MySQL:', error);
        return false;
      } finally {
        await connection.end();
      }
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Eliminando menú de MySQL:', id);
      const connection = await createConnection();
      
      try {
        const [result]: any = await connection.execute(
          'DELETE FROM menus WHERE id = ?',
          [id]
        );

        return result.affectedRows > 0;
      } catch (error) {
        console.error('Error eliminando menú de MySQL:', error);
        return false;
      } finally {
        await connection.end();
      }
    }
  },

  products: {
    create: async (product: Product, menuId: string): Promise<boolean> => {
      console.log('Creando producto en MySQL:', product.id);
      const connection = await createConnection();
      
      try {
        await connection.execute(
          'INSERT INTO products (id, menu_id, name, price, description, category, is_recommended, is_vegan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [product.id, menuId, product.name, product.price, product.description, product.category, product.isRecommended || false, product.isVegan || false]
        );

        return true;
      } catch (error) {
        console.error('Error creando producto en MySQL:', error);
        return false;
      } finally {
        await connection.end();
      }
    },

    update: async (product: Product): Promise<boolean> => {
      console.log('Actualizando producto en MySQL:', product.id);
      const connection = await createConnection();
      
      try {
        const [result]: any = await connection.execute(
          'UPDATE products SET name = ?, price = ?, description = ?, category = ?, is_recommended = ?, is_vegan = ? WHERE id = ?',
          [product.name, product.price, product.description, product.category, product.isRecommended || false, product.isVegan || false, product.id]
        );

        return result.affectedRows > 0;
      } catch (error) {
        console.error('Error actualizando producto en MySQL:', error);
        return false;
      } finally {
        await connection.end();
      }
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Eliminando producto de MySQL:', id);
      const connection = await createConnection();
      
      try {
        const [result]: any = await connection.execute(
          'DELETE FROM products WHERE id = ?',
          [id]
        );

        return result.affectedRows > 0;
      } catch (error) {
        console.error('Error eliminando producto de MySQL:', error);
        return false;
      } finally {
        await connection.end();
      }
    },

    getByMenu: async (menuId: string): Promise<Product[]> => {
      console.log('Obteniendo productos del menú de MySQL:', menuId);
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
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
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
    },

    clearAll: async (): Promise<boolean> => {
      console.log('Limpiando todos los datos de MySQL...');
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
    },

    getInfo: async () => {
      console.log('Obteniendo información de la base de datos MySQL...');
      const connection = await createConnection();
      
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
      } finally {
        await connection.end();
      }
    }
  }
};

export default DatabaseAPI;