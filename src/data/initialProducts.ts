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
    isRecommended: true,
    isVegan: false,
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
    isRecommended: false,
    isVegan: false,
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
    isRecommended: false,
    isVegan: false,
    tags: ['vegetariano'],
    preparationTime: 8,
    nutritionalInfo: {
      calories: 320,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Bife de Chorizo',
    description: 'Corte premium de 400g a la parrilla, acompañado con papas rústicas y ensalada mixta.',
    price: 6800,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    nutritionalInfo: {
      calories: 650,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Milanesa Napolitana',
    description: 'Milanesa de ternera con jamón, queso y salsa de tomate. Acompañada con papas fritas.',
    price: 4200,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['popular'],
    preparationTime: 15,
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
    isRecommended: false,
    isVegan: false,
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
    name: 'Ensalada Caesar',
    description: 'Lechuga romana, crutones, queso parmesano y aderezo caesar casero.',
    price: 2800,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
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
    name: 'Risotto de Hongos',
    description: 'Arroz arborio con hongos de estación, queso parmesano y vino blanco.',
    price: 4200,
    category: 'MAIN_COURSE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['especial'],
    preparationTime: 25,
    nutritionalInfo: {
      calories: 350,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Flan Casero',
    description: 'Flan tradicional con dulce de leche y crema chantilly.',
    price: 1800,
    category: 'DESSERT',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['dulce'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 280,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Tiramisú',
    description: 'Postre italiano tradicional con café, mascarpone y cacao en polvo.',
    price: 2200,
    category: 'DESSERT',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['chocolate'],
    preparationTime: 8,
    nutritionalInfo: {
      calories: 420,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false
    }
  },
  {
    name: 'Cerveza Artesanal IPA',
    description: 'Cerveza artesanal IPA de producción local, con notas cítricas y amargor balanceado.',
    price: 1200,
    category: 'ALCOHOLIC',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: true,
    tags: ['artesanal'],
    preparationTime: 2,
    nutritionalInfo: {
      calories: 125,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Vino Malbec',
    description: 'Vino tinto Malbec de Mendoza, con cuerpo y taninos balanceados.',
    price: 2800,
    category: 'ALCOHOLIC',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: true,
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
    isRecommended: false,
    isVegan: true,
    tags: ['natural'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 80,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Jugo Natural',
    description: 'Jugo natural de frutas de estación, exprimido al momento.',
    price: 800,
    category: 'NON_ALCOHOLIC',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: true,
    tags: ['natural'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 60,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Negroni',
    description: 'Gin, Campari y vermut rojo. Servido con hielo y cáscara de naranja.',
    price: 2500,
    category: 'COCKTAIL',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: true,
    tags: ['clásico'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 160,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Mojito',
    description: 'Ron blanco, menta fresca, limón y agua con gas.',
    price: 2200,
    category: 'COCKTAIL',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: true,
    tags: ['refrescante'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 180,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
  },
  {
    name: 'Pisco Sour',
    description: 'Cóctel tradicional peruano con pisco, limón, jarabe y clara de huevo.',
    price: 2400,
    category: 'COCKTAIL',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['tradicional'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 200,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Cappuccino',
    description: 'Café espresso con leche vaporizada y espuma. Servido en taza grande.',
    price: 950,
    category: 'COFFEE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['tradicional'],
    preparationTime: 5,
    nutritionalInfo: {
      calories: 200,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Café con Leche',
    description: 'Café con leche tradicional argentino. Servido en taza grande.',
    price: 850,
    category: 'COFFEE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: false,
    tags: ['tradicional', 'argentino'],
    preparationTime: 3,
    nutritionalInfo: {
      calories: 100,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true
    }
  },
  {
    name: 'Té con Leche de Almendras',
    description: 'Té negro con leche de almendras y un toque de canela.',
    price: 900,
    category: 'COFFEE',
    menuId: '',
    isAvailable: true,
    isRecommended: false,
    isVegan: true,
    tags: ['vegano'],
    preparationTime: 4,
    nutritionalInfo: {
      calories: 60,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true
    }
},
{
  name: 'Papas Fritas',
  description: 'Papas fritas caseras cortadas a mano, crocantes y doradas.',
  price: 1500,
  category: 'SIDE_DISH',
  menuId: '',
  isAvailable: true,
  isRecommended: false,
  isVegan: true,
  tags: ['crocante'],
  preparationTime: 8,
  nutritionalInfo: {
    calories: 280,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  }
},
{
  name: 'Maní Salado',
  description: 'Maní tostado y salado, ideal para acompañar las bebidas.',
  price: 800,
  category: 'SNACK',
  menuId: '',
  isAvailable: true,
  isRecommended: false,
  isVegan: true,
  tags: ['aperitivo'],
  preparationTime: 1,
  nutritionalInfo: {
    calories: 180,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  }
}
];
