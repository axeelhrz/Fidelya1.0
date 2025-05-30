import { Product } from '../app/types';

export interface MenuData {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export const menus: Record<string, MenuData> = {
  'menu-bar': {
    id: 'menu-bar',
    name: 'Carta del Bar',
    description: 'Nuestra selección de bebidas, tapas y platos principales',
    products: [
      // Bebidas Alcohólicas
      {
        id: '1',
        name: 'Cerveza Artesanal IPA',
        price: 2800,
        description: 'Cerveza artesanal con lúpulo americano, notas cítricas y amargor balanceado',
        category: 'Bebidas',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '2',
        name: 'Gin Tonic Premium',
        price: 3500,
        description: 'Gin Bombay Sapphire, tónica Schweppes, pepino y enebro',
        category: 'Bebidas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '3',
        name: 'Whisky Escocés',
        price: 4200,
        description: 'Johnnie Walker Black Label, servido solo o con hielo',
        category: 'Bebidas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '4',
        name: 'Mojito Clásico',
        price: 3200,
        description: 'Ron blanco, menta fresca, lima, azúcar y soda',
        category: 'Bebidas',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '5',
        name: 'Vino Tinto Malbec',
        price: 2500,
        description: 'Copa de Malbec argentino, cuerpo medio, notas a frutos rojos',
        category: 'Bebidas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '6',
        name: 'Fernet con Cola',
        price: 2200,
        description: 'Fernet Branca con Coca Cola, servido con hielo y limón',
        category: 'Bebidas',
        isRecommended: true,
        isVegan: true,
      },

      // Bebidas Sin Alcohol
      {
        id: '7',
        name: 'Limonada Natural',
        price: 1500,
        description: 'Limones frescos, agua mineral, azúcar y menta',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '8',
        name: 'Agua Mineral',
        price: 800,
        description: 'Agua mineral sin gas o con gas, botella 500ml',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '9',
        name: 'Gaseosa Línea Coca Cola',
        price: 1200,
        description: 'Coca Cola, Sprite, Fanta, lata 350ml',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '10',
        name: 'Jugo Natural de Naranja',
        price: 1800,
        description: 'Jugo de naranja recién exprimido, sin azúcar agregada',
        category: 'Sin Alcohol',
        isRecommended: true,
        isVegan: true,
      },

      // Tapas y Picadas
      {
        id: '11',
        name: 'Tabla de Fiambres',
        price: 4500,
        description: 'Jamón crudo, salame, queso, aceitunas, nueces y pan tostado',
        category: 'Tapas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '12',
        name: 'Papas Bravas',
        price: 2800,
        description: 'Papas cortadas en cubos con salsa brava picante y alioli',
        category: 'Tapas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '13',
        name: 'Nachos con Cheddar',
        price: 3200,
        description: 'Nachos de maíz con queso cheddar derretido, jalapeños y guacamole',
        category: 'Tapas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '14',
        name: 'Aceitunas Mixtas',
        price: 1800,
        description: 'Aceitunas verdes y negras marinadas con hierbas mediterráneas',
        category: 'Tapas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '15',
        name: 'Empanadas Caseras',
        price: 2500,
        description: 'Empanadas de carne, pollo o verdura, horneadas al momento',
        category: 'Tapas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '16',
        name: 'Alitas de Pollo',
        price: 3800,
        description: 'Alitas de pollo glaseadas con salsa barbacoa y sésamo',
        category: 'Tapas',
        isRecommended: false,
        isVegan: false,
      },

      // Platos Principales
      {
        id: '17',
        name: 'Hamburguesa Clásica',
        price: 4200,
        description: 'Carne de res 150g, lechuga, tomate, cebolla, queso cheddar y papas fritas',
        category: 'Principales',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '18',
        name: 'Milanesa Napolitana',
        price: 4800,
        description: 'Milanesa de ternera con jamón, queso y salsa de tomate, con papas fritas',
        category: 'Principales',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '19',
        name: 'Sandwich de Bondiola',
        price: 3500,
        description: 'Bondiola de cerdo desmenuzada, cebolla caramelizada y chimichurri',
        category: 'Principales',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '20',
        name: 'Ensalada Caesar',
        price: 3200,
        description: 'Lechuga romana, pollo grillado, crutones, parmesano y aderezo caesar',
        category: 'Principales',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '21',
        name: 'Pizza Margherita',
        price: 3800,
        description: 'Masa artesanal, salsa de tomate, mozzarella fresca y albahaca',
        category: 'Principales',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '22',
        name: 'Wrap Vegano',
        price: 2800,
        description: 'Tortilla integral con hummus, vegetales asados y palta',
        category: 'Principales',
        isRecommended: true,
        isVegan: true,
      },

      // Postres
      {
        id: '23',
        name: 'Brownie con Helado',
        price: 2500,
        description: 'Brownie de chocolate tibio con helado de vainilla y salsa de chocolate',
        category: 'Postres',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '24',
        name: 'Flan Casero',
        price: 1800,
        description: 'Flan tradicional con dulce de leche y crema chantilly',
        category: 'Postres',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '25',
        name: 'Helado Artesanal',
        price: 2200,
        description: 'Dos bochas de helado artesanal, sabores a elección',
        category: 'Postres',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '26',
        name: 'Fruta de Estación',
        price: 1500,
        description: 'Selección de frutas frescas de estación cortadas',
        category: 'Postres',
        isRecommended: true,
        isVegan: true,
      },

      // Cafetería
      {
        id: '27',
        name: 'Café Espresso',
        price: 800,
        description: 'Café espresso italiano, granos de origen único',
        category: 'Café',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '28',
        name: 'Cappuccino',
        price: 1200,
        description: 'Espresso con leche vaporizada y espuma de leche',
        category: 'Café',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '29',
        name: 'Café con Leche',
        price: 1000,
        description: 'Café con leche caliente, azúcar a gusto',
        category: 'Café',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '30',
        name: 'Té Variado',
        price: 900,
        description: 'Selección de tés: negro, verde, manzanilla, menta',
        category: 'Café',
        isRecommended: false,
        isVegan: true,
      },
    ]
  },

  'menu-happy-hour': {
    id: 'menu-happy-hour',
    name: 'Happy Hour',
    description: 'Promociones especiales de 18:00 a 20:00 horas',
    products: [
      {
        id: '31',
        name: 'Cerveza Tirada',
        price: 1800,
        description: 'Cerveza tirada nacional, vaso de 500ml',
        category: 'Promociones',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '32',
        name: '2x1 en Tragos',
        price: 3000,
        description: 'Dos tragos clásicos por el precio de uno: Mojito, Daiquiri, Caipirinha',
        category: 'Promociones',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '33',
        name: 'Picada para Compartir',
        price: 3500,
        description: 'Tabla con fiambres, quesos, aceitunas y pan para 2 personas',
        category: 'Promociones',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '34',
        name: 'Combo Cerveza + Papas',
        price: 2500,
        description: 'Cerveza tirada + porción de papas fritas con salsas',
        category: 'Promociones',
        isRecommended: true,
        isVegan: true,
      },
    ]
  }
};

// Función para obtener un menú por ID
export const getMenuById = (id: string): MenuData | null => {
  return menus[id] || null;
};

// Función para obtener todos los IDs de menús disponibles
export const getAvailableMenuIds = (): string[] => {
  return Object.keys(menus);
};