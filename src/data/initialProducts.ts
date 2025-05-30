import { Product } from '../app/types';

export const initialProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // ENTRADAS
  {
    name: 'Tabla de Fiambres y Quesos',
    description: 'Selección de fiambres artesanales, quesos de estación y frutos secos. Acompañada con pan casero.',
    price: 3500,
    category: 'APPETIZER',
    menuId: '', // Se asignará dinámicamente
    isAvailable: true,
    tags: ['recomendado', 'para compartir'],
    preparationTime: 10,
    nutritionalInfo: {
      calories: 450,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Empanadas Artesanales',
    description: 'Empanadas caseras de carne cortada a cuchillo, pollo y verdura. Masa madre tradicional.',
    price: 450,
    category: 'APPETIZER',
    menuId: '',
    isAvailable: true,
    tags: ['tradicional'],
    preparationTime: 15,
    nutritionalInfo: {
      calories: 280,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Provoleta a la Parrilla',
    description: 'Queso provolone grillado con oregano, aceite de oliva y chimichurri casero.',
    price: 2200,
    category: 'APPETIZER',
    menuId: '',
    isAvailable: true,
    tags: ['vegetariano'],
    preparationTime: 8,
    nutritionalInfo: {
      calories: 320,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },

  // PLATOS PRINCIPALES
  {
    name: 'Bife de Chorizo',
    description: 'Corte premium de 400g a la parrilla, acompañado con papas rústicas y ensalada mixta.',
    price: 6800,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    tags: ['recomendado', 'parrilla'],
    preparationTime: 25,
    nutritionalInfo: {
      calories: 650,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Milanesa Napolitana',
    description: 'Milanesa de ternera con jamón, queso y salsa de tomate. Con papas fritas caseras.',
    price: 4200,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    tags: ['clásico'],
    preparationTime: 20,
    nutritionalInfo: {
      calories: 580,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Pasta con Salsa Bolognesa',
    description: 'Tallarines caseros con salsa bolognesa tradicional, queso parmesano y albahaca fresca.',
    price: 3800,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    tags: ['casero'],
    preparationTime: 18,
    nutritionalInfo: {
      calories: 520,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Hamburguesa de la Casa',
    description: 'Medallón de carne 200g, queso cheddar, lechuga, tomate, cebolla caramelizada y papas.',
    price: 3200,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    tags: ['popular'],
    preparationTime: 15,
    nutritionalInfo: {
      calories: 680,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false
    }
  },

  // POSTRES
  {
    name: 'Flan Casero',
    description: 'Flan tradicional con dulce de leche y crema chantilly. Receta de la abuela.',
    price: 1800,
    category: 'DESSERT',
    menuId: '',
    isAvailable: true,
    tags: ['casero', 'tradicional'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 280,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Tiramisu',
    description: 'Postre italiano con café, mascarpone, cacao y un toque de amaretto.',
    price: 2200,
    category: 'DESSERT',
    menuId: '',
    isAvailable: true,
    tags: ['especial'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 350,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Brownie con Helado',
    description: 'Brownie tibio de chocolate con helado de vainilla y salsa de chocolate caliente.',
    price: 2000,
    category: 'DESSERT',
    menuId: '',
    isAvailable: true,
    tags: ['chocolate'],
    preparationTime: 8,
    nutritionalInfo: {
      calories: 420,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  },

  // BEBIDAS
  {
    name: 'Cerveza Artesanal IPA',
    description: 'Cerveza artesanal estilo IPA, lupulada y refrescante. 500ml.',
    price: 1500,
    category: 'BEER',
    menuId: '',
    isAvailable: true,
    tags: ['artesanal'],
    preparationTime: 2,
    nutritionalInfo: {
      calories: 180,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false
    }
  },
  {
    name: 'Vino Malbec',
    description: 'Vino tinto Malbec de Mendoza, cosecha 2021. Copa o botella.',
    price: 800,
    category: 'WINE',
    menuId: '',
    isAvailable: true,
    tags: ['mendoza'],
    preparationTime: 2,
    nutritionalInfo: {
      calories: 125,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Limonada Casera',
    description: 'Limonada natural con menta fresca, jengibre y un toque de miel.',
    price: 900,
    category: 'NON_ALCOHOLIC',
    menuId: '',
    isAvailable: true,
    tags: ['natural', 'refrescante'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 80,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },

  // CÓCTELES
  {
    name: 'Negroni',
    description: 'Gin, Campari y vermut rojo. Servido con hielo y cáscara de naranja.',
    price: 2500,
    category: 'COCKTAIL',
    menuId: '',
    isAvailable: true,
    tags: ['clásico', 'amargo'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 190,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Mojito',
    description: 'Ron blanco, menta fresca, lima, azúcar y soda. Refrescante y aromático.',
    price: 2200,
    category: 'COCKTAIL',
    menuId: '',
    isAvailable: true,
    tags: ['refrescante', 'menta'],
    preparationTime: 6,
    nutritionalInfo: {
      calories: 150,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Old Fashioned',
    description: 'Whisky bourbon, azúcar, bitter de angostura y cáscara de naranja.',
    price: 2800,
    category: 'COCKTAIL',
    menuId: '',
    isAvailable: true,
    tags: ['whisky', 'clásico'],
    preparationTime: 4,
    nutritionalInfo: {
      calories: 220,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },

  // CAFETERÍA
  {
    name: 'Café Espresso',
    description: 'Café espresso tradicional, blend de la casa. Intenso y aromático.',
    price: 600,
    category: 'COFFEE',
    menuId: '',
    isAvailable: true,
    tags: ['tradicional'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 5,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Cappuccino',
    description: 'Espresso con leche vaporizada y espuma cremosa. Con cacao en polvo.',
    price: 950,
    category: 'COFFEE',
    menuId: '',
    isAvailable: true,
    tags: ['cremoso'],
    preparationTime: 4,
    nutritionalInfo: {
      calories: 120,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Café con Leche',
    description: 'Café con leche tradicional argentino. Servido en taza grande.',
    price: 800,
    category: 'COFFEE',
    menuId: '',
    isAvailable: true,
    tags: ['tradicional', 'argentino'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 100,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },

  // ACOMPAÑAMIENTOS
  {
    name: 'Papas Fritas',
    description: 'Papas cortadas en bastón, fritas y condimentadas con sal marina.',
    price: 1200,
    category: 'SIDE_DISH',
    menuId: '',
    isAvailable: true,
    tags: ['clásico'],
    preparationTime: 8,
    nutritionalInfo: {
      calories: 280,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Ensalada Mixta',
    description: 'Lechuga, tomate, cebolla, zanahoria y aceitunas con vinagreta de la casa.',
    price: 1500,
    category: 'SIDE_DISH',
    menuId: '',
    isAvailable: true,
    tags: ['saludable', 'fresco'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 120,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },

  // SNACKS
  {
    name: 'Maní Salado',
    description: 'Maní tostado y salado, ideal para acompañar las bebidas.',
    price: 800,
    category: 'SNACK',
    menuId: '',
    isAvailable: true,
    tags: ['aperitivo'],
    preparationTime: 1,
    nutritionalInfo: {
      calories: 180,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Aceitunas Mixtas',
    description: 'Selección de aceitunas verdes y negras marinadas con hierbas.',
    price: 1000,
    category: 'SNACK',
    menuId: '',
    isAvailable: true,
    tags: ['mediterráneo'],
    preparationTime: 2,
    nutritionalInfo: {
      calories: 150,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  }
];