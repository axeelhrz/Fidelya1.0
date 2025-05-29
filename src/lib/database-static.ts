import { Product, MenuData } from '../app/types';
import { menus } from '../data/menu';

// API de base de datos estática (solo lectura)
export const DatabaseAPI = {
  init: () => true,

  menus: {
    create: (): boolean => false, // No permitido en producción
    
    get: (id: string): MenuData | null => {
      return menus[id] || null;
    },

    getAll: (): MenuData[] => {
      return Object.values(menus);
    },

    update: (): boolean => false, // No permitido en producción
    delete: (): boolean => false, // No permitido en producción
  },

  products: {
    create: (): boolean => false,
    update: (): boolean => false,
    delete: (): boolean => false,
    
    getByMenu: (menuId: string): Product[] => {
      return menus[menuId]?.products || [];
    },
  },

  utils: {
    seedFromFile: async (): Promise<boolean> => false,
    exportToJSON: (): string => JSON.stringify(menus, null, 2),
    hasData: (): boolean => Object.keys(menus).length > 0,
    clearAll: (): boolean => false,
    
    getInfo: () => ({
      menusCount: Object.keys(menus).length,
      productsCount: Object.values(menus).reduce((total, menu) => total + menu.products.length, 0),
      environment: 'static',
      hasMenuData: true,
      dbExists: true,
      lastUpdated: new Date().toISOString()
    }),
  },
};

export default DatabaseAPI;