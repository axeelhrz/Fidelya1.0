import { supabase, DatabaseProduct } from './supabase';
import { Product, MenuData } from '../app/types';

// Función para convertir producto de DB a formato de la app
const convertDatabaseProductToProduct = (dbProduct: DatabaseProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.price,
  description: dbProduct.description,
  category: dbProduct.category,
  isRecommended: dbProduct.is_recommended,
  isVegan: dbProduct.is_vegan,
});

// Función para convertir producto de la app a formato de DB
const convertProductToDatabaseProduct = (product: Product, menuId: string): Omit<DatabaseProduct, 'created_at' | 'updated_at'> => ({
  id: product.id,
  menu_id: menuId,
  name: product.name,
  price: product.price,
  description: product.description,
  category: product.category,
  is_recommended: product.isRecommended ?? false,
  is_vegan: product.isVegan ?? false,
});

// API de la base de datos Supabase
export const DatabaseAPI = {
  init: async (): Promise<boolean> => {
    console.log('Initializing Supabase database...');
    try {
      // Verificar conexión
      const { error } = await supabase.from('menus').select('count').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        return false;
      }
      console.log('Supabase database initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Supabase database:', error);
      return false;
    }
  },

  menus: {
    create: async (menuData: MenuData): Promise<boolean> => {
      console.log('Creating menu in Supabase:', menuData.id);
      try {
        // Crear el menú
        const { error: menuError } = await supabase
          .from('menus')
          .insert({
            id: menuData.id,
            name: menuData.name,
            description: menuData.description,
          });

        if (menuError) {
          console.error('Error creating menu:', menuError);
          return false;
        }

        // Crear los productos
        if (menuData.products.length > 0) {
          const productsToInsert = menuData.products.map(product => 
            convertProductToDatabaseProduct(product, menuData.id)
          );

          const { error: productsError } = await supabase
            .from('products')
            .insert(productsToInsert);

          if (productsError) {
            console.error('Error creating products:', productsError);
            // Limpiar el menú si falló la creación de productos
            await supabase.from('menus').delete().eq('id', menuData.id);
            return false;
          }
        }

        console.log('Menu created successfully');
        return true;
      } catch (error) {
        console.error('Error creating menu:', error);
        return false;
      }
    },

    get: async (id: string): Promise<MenuData | null> => {
      console.log('Getting menu from Supabase:', id);
      try {
        // Obtener el menú
        const { data: menuData, error: menuError } = await supabase
          .from('menus')
          .select('*')
          .eq('id', id)
          .single();

        if (menuError || !menuData) {
          console.error('Error getting menu:', menuError);
          return null;
        }

        // Obtener los productos del menú
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('menu_id', id)
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (productsError) {
          console.error('Error getting products:', productsError);
          return null;
        }

        const menu: MenuData = {
          id: menuData.id,
          name: menuData.name,
          description: menuData.description,
          products: (productsData || []).map(convertDatabaseProductToProduct),
        };

        console.log('Menu retrieved successfully:', menu.id);
        return menu;
      } catch (error) {
        console.error('Error getting menu:', error);
        return null;
      }
    },

    getAll: async (): Promise<MenuData[]> => {
      console.log('Getting all menus from Supabase...');
      try {
        // Obtener todos los menús
        const { data: menusData, error: menusError } = await supabase
          .from('menus')
          .select('*')
          .order('name', { ascending: true });

        if (menusError) {
          console.error('Error getting menus:', menusError);
          return [];
        }

        if (!menusData || menusData.length === 0) {
          console.log('No menus found');
          return [];
        }

        // Obtener todos los productos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (productsError) {
          console.error('Error getting products:', productsError);
          return [];
        }

        // Agrupar productos por menú
        const productsByMenu = (productsData || []).reduce((acc, product) => {
          if (!acc[product.menu_id]) {
            acc[product.menu_id] = [];
          }
          acc[product.menu_id].push(convertDatabaseProductToProduct(product));
          return acc;
        }, {} as Record<string, Product[]>);

        // Construir los menús completos
        const menus: MenuData[] = menusData.map(menu => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          products: productsByMenu[menu.id] || [],
        }));

        console.log('Found', menus.length, 'menus');
        return menus;
      } catch (error) {
        console.error('Error getting all menus:', error);
        return [];
      }
    },

    update: async (menuData: MenuData): Promise<boolean> => {
      console.log('Updating menu in Supabase:', menuData.id);
      try {
        const { error } = await supabase
          .from('menus')
          .update({
            name: menuData.name,
            description: menuData.description,
          })
          .eq('id', menuData.id);

        if (error) {
          console.error('Error updating menu:', error);
          return false;
        }

        console.log('Menu updated successfully');
        return true;
      } catch (error) {
        console.error('Error updating menu:', error);
        return false;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Deleting menu from Supabase:', id);
      try {
        // Los productos se eliminan automáticamente por CASCADE
        const { error } = await supabase
          .from('menus')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting menu:', error);
          return false;
        }

        console.log('Menu deleted successfully');
        return true;
      } catch (error) {
        console.error('Error deleting menu:', error);
        return false;
      }
    },
  },

  products: {
    create: async (product: Product, menuId: string): Promise<boolean> => {
      console.log('Creating product in Supabase:', product.id);
      try {
        const productData = convertProductToDatabaseProduct(product, menuId);
        
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) {
          console.error('Error creating product:', error);
          return false;
        }

        console.log('Product created successfully');
        return true;
      } catch (error) {
        console.error('Error creating product:', error);
        return false;
      }
    },

    update: async (product: Product): Promise<boolean> => {
      console.log('Updating product in Supabase:', product.id);
      try {
        const { error } = await supabase
          .from('products')
          .update({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            is_recommended: product.isRecommended,
            is_vegan: product.isVegan,
          })
          .eq('id', product.id);

        if (error) {
          console.error('Error updating product:', error);
          return false;
        }

        console.log('Product updated successfully');
        return true;
      } catch (error) {
        console.error('Error updating product:', error);
        return false;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      console.log('Deleting product from Supabase:', id);
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting product:', error);
          return false;
        }

        console.log('Product deleted successfully');
        return true;
      } catch (error) {
        console.error('Error deleting product:', error);
        return false;
      }
    },

    getByMenu: async (menuId: string): Promise<Product[]> => {
      console.log('Getting products for menu from Supabase:', menuId);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('menu_id', menuId)
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (error) {
          console.error('Error getting products:', error);
          return [];
        }

        const products = (data || []).map(convertDatabaseProductToProduct);
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
      console.log('Seeding Supabase database from file...');
      try {
        const { menus } = await import('../data/menu');
        console.log('Loaded menus from file:', Object.keys(menus));

        for (const [menuId, menuData] of Object.entries(menus)) {
          console.log('Seeding menu:', menuId);
          
          // Verificar si el menú ya existe
          const existingMenu = await DatabaseAPI.menus.get(menuId);
          if (existingMenu) {
            console.log('Menu already exists, skipping:', menuId);
            continue;
          }

          // Crear el menú
          const success = await DatabaseAPI.menus.create(menuData);
          if (!success) {
            console.error('Failed to seed menu:', menuId);
            return false;
          }
        }

        console.log('Database seeded successfully');
        return true;
      } catch (error) {
        console.error('Error seeding database:', error);
        return false;
      }
    },

    exportToJSON: async (): Promise<string> => {
      console.log('Exporting Supabase database to JSON...');
      try {
        const menus = await DatabaseAPI.menus.getAll();
        const menusObject = menus.reduce((acc, menu) => {
          acc[menu.id] = menu;
          return acc;
        }, {} as Record<string, MenuData>);

        const exported = JSON.stringify(menusObject, null, 2);
        console.log('Database exported successfully');
        return exported;
      } catch (error) {
        console.error('Error exporting database:', error);
        return '{}';
      }
    },

    hasData: async (): Promise<boolean> => {
      console.log('Checking if Supabase database has data...');
      try {
        const { data, error } = await supabase
          .from('menus')
          .select('id')
          .limit(1);

        if (error) {
          console.error('Error checking database data:', error);
          return false;
        }

        const hasData = data && data.length > 0;
        console.log('Database has data:', hasData);
        return hasData;
      } catch (error) {
        console.error('Error checking database data:', error);
        return false;
      }
    },

    clearAll: async (): Promise<boolean> => {
      console.log('Clearing all Supabase database data...');
      try {
        // Eliminar todos los productos primero
        const { error: productsError } = await supabase
          .from('products')
          .delete()
          .neq('id', ''); // Eliminar todos

        if (productsError) {
          console.error('Error clearing products:', productsError);
          return false;
        }

        // Eliminar todos los menús
        const { error: menusError } = await supabase
          .from('menus')
          .delete()
          .neq('id', ''); // Eliminar todos

        if (menusError) {
          console.error('Error clearing menus:', menusError);
          return false;
        }

        console.log('Database cleared successfully');
        return true;
      } catch (error) {
        console.error('Error clearing database:', error);
        return false;
      }
    },

    getInfo: async () => {
      console.log('Getting Supabase database info...');
      try {
        // Contar menús
        const { count: menusCount, error: menusError } = await supabase
          .from('menus')
          .select('*', { count: 'exact', head: true });

        if (menusError) {
          console.error('Error counting menus:', menusError);
        }

        // Contar productos
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (productsError) {
          console.error('Error counting products:', productsError);
        }

        const info = {
          menusCount: menusCount || 0,
          productsCount: productsCount || 0,
          dbType: 'supabase',
          environment: 'production',
          hasMenuData: true,
          dbExists: true,
          dbPath: 'supabase-cloud',
          lastUpdated: new Date().toISOString(),
        };

        console.log('Database info:', info);
        return info;
      } catch (error) {
        console.error('Error getting database info:', error);
        return {
          menusCount: 0,
          productsCount: 0,
          dbType: 'supabase-error',
          environment: 'error',
          hasMenuData: false,
          dbExists: false,
          dbPath: 'error',
          lastUpdated: null,
        };
      }
    },
  },
};

export default DatabaseAPI;