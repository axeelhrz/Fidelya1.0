import { Menu, Product, Category } from '../app/types/index';

// Datos iniciales para Firebase (sin IDs, createdAt, updatedAt)
export const initialFirebaseData = {
  menus: [
    {
      name: 'Xs Reset - Bar & Resto',
      description: 'Tragos de autor, picadas y buena onda en el corazón de la ciudad',
      isActive: true,
      categories: [
        'Tragos Clásicos',
        'Whiskies',
        'Vinos',
        'Cervezas',
        'Sin Alcohol',
        'Picadas',
        'Comidas',
        'Postres',
        'Cafetería'
      ],
      restaurantInfo: {
        name: 'Xs Reset',
        address: 'Av. Principal 123, Ciudad',
        phone: '+54 11 1234-5678',
        hours: 'Lun-Dom 18:00-02:00'
      },
      theme: {
        primaryColor: '#D4AF37',
        secondaryColor: '#B8941F',
        backgroundColor: '#0A0A0A'
      }
    }
  ] as Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>[],

  products: [
    // TRAGOS CLÁSICOS
    {
      name: 'Fernet con Cola',
      price: 2800,
      description: 'Fernet Branca con Coca Cola, hielo y limón',
      category: 'COCKTAIL',
      menuId: '', // Se asignará dinámicamente
      isAvailable: true,
      tags: ['clásico', 'popular'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 3
    },
    {
      name: 'Gin Tonic',
      price: 3200,
      description: 'Gin Bombay, tónica Schweppes, pepino y lima',
      category: 'COCKTAIL',
      menuId: '',
      isAvailable: true,
      tags: ['refrescante', 'premium'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 4
    },
    {
      name: 'Negroni',
      price: 3500,
      description: 'Gin, Campari, vermouth rosso, twist de naranja',
      category: 'COCKTAIL',
      menuId: '',
      isAvailable: true,
      tags: ['clásico', 'amargo', 'recomendado'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 5
    },
    {
      name: 'Old Fashioned',
      price: 4200,
      description: 'Bourbon, azúcar, bitter de angostura',
      category: 'COCKTAIL',
      menuId: '',
      isAvailable: true,
      tags: ['clásico', 'whiskey'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 6
    },
    {
      name: 'Aperol Spritz',
      price: 3000,
      description: 'Aperol, prosecco, soda, naranja',
      category: 'COCKTAIL',
      menuId: '',
      isAvailable: true,
      tags: ['refrescante', 'verano'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 3
    },

    // WHISKIES
    {
      name: 'Johnnie Walker Black',
      price: 4500,
      description: 'Whisky escocés 12 años, solo o con hielo',
      category: 'BEVERAGE',
      menuId: '',
      isAvailable: true,
      tags: ['whisky', 'premium', 'escocés'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },
    {
      name: 'Jameson',
      price: 4000,
      description: 'Whiskey irlandés suave, triple destilado',
      category: 'BEVERAGE',
      menuId: '',
      isAvailable: true,
      tags: ['whisky', 'irlandés', 'suave'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },
    {
      name: 'Jack Daniels',
      price: 4200,
      description: 'Whiskey americano Tennessee, suave y dulce',
      category: 'BEVERAGE',
      menuId: '',
      isAvailable: true,
      tags: ['whisky', 'americano', 'recomendado'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },

    // VINOS
    {
      name: 'Malbec Copa',
      price: 2200,
      description: 'Malbec mendocino, cuerpo medio, taninos suaves',
      category: 'WINE',
      menuId: '',
      isAvailable: true,
      tags: ['vino', 'tinto', 'argentino', 'recomendado'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },
    {
      name: 'Sauvignon Blanc Copa',
      price: 2000,
      description: 'Blanco fresco, notas cítricas y herbales',
      category: 'WINE',
      menuId: '',
      isAvailable: true,
      tags: ['vino', 'blanco', 'fresco'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },
    {
      name: 'Champagne Copa',
      price: 3500,
      description: 'Espumante premium, burbujas finas',
      category: 'WINE',
      menuId: '',
      isAvailable: true,
      tags: ['espumante', 'premium', 'celebración'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },

    // CERVEZAS
    {
      name: 'Stella Artois',
      price: 1800,
      description: 'Cerveza belga premium, botella 330ml',
      category: 'BEER',
      menuId: '',
      isAvailable: true,
      tags: ['cerveza', 'belga', 'premium'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 1
    },
    {
      name: 'Corona',
      price: 2000,
      description: 'Cerveza mexicana con lima',
      category: 'BEER',
      menuId: '',
      isAvailable: true,
      tags: ['cerveza', 'mexicana', 'recomendado'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 2
    },
    {
      name: 'Quilmes',
      price: 1500,
      description: 'Cerveza argentina clásica, botella 340ml',
      category: 'BEER',
      menuId: '',
      isAvailable: true,
      tags: ['cerveza', 'argentina', 'clásica'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 1
    },
    {
      name: 'IPA Artesanal',
      price: 2500,
      description: 'Cerveza artesanal local, lúpulo americano',
      category: 'BEER',
      menuId: '',
      isAvailable: true,
      tags: ['cerveza', 'artesanal', 'IPA', 'recomendado'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true
      },
      preparationTime: 1
    },

    // SIN ALCOHOL
    {
      name: 'Agua Mineral',
      price: 800,
      description: 'Agua mineral con o sin gas, 500ml',
      category: 'NON_ALCOHOLIC',
      menuId: '',
      isAvailable: true,
      tags: ['agua', 'sin alcohol'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 0
      },
      preparationTime: 1
    },
    {
      name: 'Limonada',
      price: 1500,
      description: 'Limones frescos, agua mineral, menta',
      category: 'NON_ALCOHOLIC',
      menuId: '',
      isAvailable: true,
      tags: ['refrescante', 'natural', 'recomendado'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 45
      },
      preparationTime: 4
    },
    {
      name: 'Gaseosa',
      price: 1200,
      description: 'Coca Cola, Sprite, Fanta - lata 350ml',
      category: 'NON_ALCOHOLIC',
      menuId: '',
      isAvailable: true,
      tags: ['gaseosa', 'sin alcohol'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 140
      },
      preparationTime: 1
    },
    {
      name: 'Jugo Natural',
      price: 1800,
      description: 'Naranja o pomelo recién exprimido',
      category: 'NON_ALCOHOLIC',
      menuId: '',
      isAvailable: true,
      tags: ['natural', 'fresco', 'vitaminas'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 110
      },
      preparationTime: 3
    },

    // PICADAS
    {
      name: 'Tabla de Fiambres',
      price: 4500,
      description: 'Jamón crudo, salame, quesos, aceitunas, pan',
      category: 'APPETIZER',
      menuId: '',
      isAvailable: true,
      tags: ['picada', 'compartir', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 650
      },
      preparationTime: 8
    },
    {
      name: 'Nachos',
      price: 3200,
      description: 'Nachos con cheddar, guacamole y crema',
      category: 'APPETIZER',
      menuId: '',
      isAvailable: true,
      tags: ['picada', 'mexicano', 'compartir'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 580
      },
      preparationTime: 6
    },
    {
      name: 'Papas Bravas',
      price: 2500,
      description: 'Papas cortadas con salsa brava y alioli',
      category: 'SIDE_DISH',
      menuId: '',
      isAvailable: true,
      tags: ['papas', 'picante', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 420
      },
      preparationTime: 10
    },
    {
      name: 'Aceitunas',
      price: 1800,
      description: 'Aceitunas verdes y negras marinadas',
      category: 'APPETIZER',
      menuId: '',
      isAvailable: true,
      tags: ['aceitunas', 'mediterráneo'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 150
      },
      preparationTime: 2
    },
    {
      name: 'Empanadas',
      price: 2200,
      description: 'Empanadas caseras de carne o verdura (3 unidades)',
      category: 'APPETIZER',
      menuId: '',
      isAvailable: true,
      tags: ['empanadas', 'caseras', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 480
      },
      preparationTime: 12
    },

    // COMIDAS
    {
      name: 'Hamburguesa Completa',
      price: 3800,
      description: 'Carne 150g, lechuga, tomate, queso, papas',
      category: 'MAIN_COURSE',
      menuId: '',
      isAvailable: true,
      tags: ['hamburguesa', 'completa', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 850
      },
      preparationTime: 15
    },
    {
      name: 'Milanesa Napolitana',
      price: 4200,
      description: 'Milanesa con jamón, queso, salsa, papas fritas',
      category: 'MAIN_COURSE',
      menuId: '',
      isAvailable: true,
      tags: ['milanesa', 'napolitana', 'clásico'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 920
      },
      preparationTime: 18
    },
    {
      name: 'Sandwich de Bondiola',
      price: 3500,
      description: 'Bondiola desmenuzada, cebolla, chimichurri',
      category: 'MAIN_COURSE',
      menuId: '',
      isAvailable: true,
      tags: ['sandwich', 'bondiola', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 680
      },
      preparationTime: 12
    },
    {
      name: 'Ensalada Caesar',
      price: 3200,
      description: 'Lechuga, pollo, crutones, parmesano, aderezo caesar',
      category: 'MAIN_COURSE',
      menuId: '',
      isAvailable: true,
      tags: ['ensalada', 'pollo', 'saludable'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 520
      },
      preparationTime: 8
    },
    {
      name: 'Wrap Veggie',
      price: 2800,
      description: 'Tortilla integral, hummus, vegetales, palta',
      category: 'MAIN_COURSE',
      menuId: '',
      isAvailable: true,
      tags: ['wrap', 'vegetariano', 'saludable'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 380
      },
      preparationTime: 6
    },
    {
      name: 'Choripán',
      price: 2500,
      description: 'Chorizo a la parrilla, pan, chimichurri',
      category: 'MAIN_COURSE',
      menuId: '',
      isAvailable: true,
      tags: ['choripán', 'parrilla', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: false,
        calories: 550
      },
      preparationTime: 10
    },

    // POSTRES
    {
      name: 'Brownie con Helado',
      price: 2800,
      description: 'Brownie tibio con helado de vainilla',
      category: 'DESSERT',
      menuId: '',
      isAvailable: true,
      tags: ['brownie', 'helado', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 480
      },
      preparationTime: 5
    },
    {
      name: 'Flan Casero',
      price: 2200,
      description: 'Flan tradicional con dulce de leche',
      category: 'DESSERT',
      menuId: '',
      isAvailable: true,
      tags: ['flan', 'casero', 'tradicional'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 320
      },
      preparationTime: 3
    },
    {
      name: 'Helado Artesanal',
      price: 2000,
      description: 'Dos bochas, sabores a elección',
      category: 'DESSERT',
      menuId: '',
      isAvailable: true,
      tags: ['helado', 'artesanal'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 280
      },
      preparationTime: 2
    },
    {
      name: 'Fruta de Estación',
      price: 1800,
      description: 'Selección de frutas frescas cortadas',
      category: 'DESSERT',
      menuId: '',
      isAvailable: true,
      tags: ['fruta', 'fresco', 'saludable'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 120
      },
      preparationTime: 4
    },

    // CAFETERÍA
    {
      name: 'Café Espresso',
      price: 800,
      description: 'Café espresso italiano, granos selectos',
      category: 'COFFEE',
      menuId: '',
      isAvailable: true,
      tags: ['café', 'espresso', 'italiano'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 5
      },
      preparationTime: 3
    },
    {
      name: 'Cappuccino',
      price: 1200,
      description: 'Espresso con leche vaporizada y espuma',
      category: 'COFFEE',
      menuId: '',
      isAvailable: true,
      tags: ['café', 'cappuccino', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 80
      },
      preparationTime: 4
    },
    {
      name: 'Café con Leche',
      price: 1000,
      description: 'Café con leche caliente, azúcar a gusto',
      category: 'COFFEE',
      menuId: '',
      isAvailable: true,
      tags: ['café', 'leche', 'clásico'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 90
      },
      preparationTime: 3
    },
    {

      name: 'Cortado',
      price: 900,
      description: 'Café cortado con leche, estilo porteño',
      category: 'COFFEE',
      menuId: '',
      isAvailable: true,
      tags: ['café', 'cortado', 'argentino', 'recomendado'],
      nutritionalInfo: {
        isVegan: false,
        isVegetarian: true,
        calories: 60
      },
      preparationTime: 3
    },
    {
      name: 'Té',
      price: 800,
      description: 'Té negro, verde, manzanilla o menta',
      category: 'COFFEE',
      menuId: '',
      isAvailable: true,
      tags: ['té', 'infusión', 'variedad'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 2
      },
      preparationTime: 5
    },
    {
      name: 'Mate Cocido',
      price: 700,
      description: 'Mate cocido tradicional argentino',
      category: 'COFFEE',
      menuId: '',
      isAvailable: true,
      tags: ['mate', 'argentino', 'tradicional'],
      nutritionalInfo: {
        isVegan: true,
        isVegetarian: true,
        calories: 3
      },
      preparationTime: 4
    }
  ] as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[],

  categories: [
    {
      name: 'Tragos Clásicos',
      description: 'Cócteles tradicionales y populares',
      menuId: '', // Se asignará dinámicamente
      order: 1,
      isActive: true,
      icon: '🍸'
    },
    {
      name: 'Whiskies',
      description: 'Selección premium de whiskies',
      menuId: '',
      order: 2,
      isActive: true,
      icon: '🥃'
    },
    {
      name: 'Vinos',
      description: 'Vinos tintos, blancos y espumantes',
      menuId: '',
      order: 3,
      isActive: true,
      icon: '🍷'
    },
    {
      name: 'Cervezas',
      description: 'Cervezas nacionales e importadas',
      menuId: '',
      order: 4,
      isActive: true,
      icon: '🍺'
    },
    {
      name: 'Sin Alcohol',
      description: 'Bebidas refrescantes sin alcohol',
      menuId: '',
      order: 5,
      isActive: true,
      icon: '🥤'
    },
    {
      name: 'Picadas',
      description: 'Para compartir y acompañar',
      menuId: '',
      order: 6,
      isActive: true,
      icon: '🧀'
    },
    {
      name: 'Comidas',
      description: 'Platos principales y sustanciosos',
      menuId: '',
      order: 7,
      isActive: true,
      icon: '🍽️'
    },
    {
      name: 'Postres',
      description: 'Dulces tentaciones para cerrar',
      menuId: '',
      order: 8,
      isActive: true,
      icon: '🍰'
    },
    {
      name: 'Cafetería',
      description: 'Café, té y bebidas calientes',
      menuId: '',
      order: 9,
      isActive: true,
      icon: '☕'
    }
  ] as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[]
};

// Función para preparar los datos con el menuId correcto
export const prepareInitialData = (menuId: string) => {
  return {
    menus: initialFirebaseData.menus,
    products: initialFirebaseData.products.map(product => ({
      ...product,
      menuId
    })),
    categories: initialFirebaseData.categories.map(category => ({
      ...category,
      menuId
    }))
  };
};