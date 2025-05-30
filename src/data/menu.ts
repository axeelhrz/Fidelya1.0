
export interface MenuData {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isRecommended?: boolean;
  isNew?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

export const menus: Record<string, MenuData> = {
  'xs-reset-menu': {
    id: 'xs-reset-menu',
    name: 'Xs Reset - Bar & Resto',
    description: 'Tragos de autor, picadas y buena onda en el corazón de la ciudad',
    products: [
      // TRAGOS CLÁSICOS
      {
        id: '1',
        name: 'Fernet con Cola',
        price: 2800,
        description: 'Fernet Branca con Coca Cola, hielo y limón',
        category: 'Tragos Clásicos',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '2',
        name: 'Gin Tonic',
        price: 3200,
        description: 'Gin Bombay, tónica Schweppes, pepino y lima',
        category: 'Tragos Clásicos',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '3',
        name: 'Negroni',
        price: 3500,
        description: 'Gin, Campari, vermouth rosso, twist de naranja',
        category: 'Tragos Clásicos',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '4',
        name: 'Old Fashioned',
        price: 4200,
        description: 'Bourbon, azúcar, bitter de angostura',
        category: 'Tragos Clásicos',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '5',
        name: 'Aperol Spritz',
        price: 3000,
        description: 'Aperol, prosecco, soda, naranja',
        category: 'Tragos Clásicos',
        isRecommended: false,
        isVegan: true,
      },

      // WHISKIES
      {
        id: '6',
        name: 'Johnnie Walker Black',
        price: 4500,
        description: 'Whisky escocés 12 años, solo o con hielo',
        category: 'Whiskies',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '7',
        name: 'Jameson',
        price: 4000,
        description: 'Whiskey irlandés suave, triple destilado',
        category: 'Whiskies',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '8',
        name: 'Jack Daniels',
        price: 4200,
        description: 'Whiskey americano Tennessee, suave y dulce',
        category: 'Whiskies',
        isRecommended: true,
        isVegan: true,
      },

      // VINOS
      {
        id: '9',
        name: 'Malbec Copa',
        price: 2200,
        description: 'Malbec mendocino, cuerpo medio, taninos suaves',
        category: 'Vinos',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '10',
        name: 'Sauvignon Blanc Copa',
        price: 2000,
        description: 'Blanco fresco, notas cítricas y herbales',
        category: 'Vinos',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '11',
        name: 'Champagne Copa',
        price: 3500,
        description: 'Espumante premium, burbujas finas',
        category: 'Vinos',
        isRecommended: false,
        isVegan: true,
      },
      // CERVEZAS
      {
        id: '12',
        name: 'Stella Artois',
        price: 1800,
        description: 'Cerveza belga premium, botella 330ml',
        category: 'Cervezas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '13',
        name: 'Corona',
        price: 2000,
        description: 'Cerveza mexicana con lima',
        category: 'Cervezas',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '14',
        name: 'Quilmes',
        price: 1500,
        description: 'Cerveza argentina clásica, botella 340ml',
        category: 'Cervezas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '15',
        name: 'IPA Artesanal',
        price: 2500,
        description: 'Cerveza artesanal local, lúpulo americano',
        category: 'Cervezas',
        isRecommended: true,
        isVegan: true,
      },

      // SIN ALCOHOL
      {
        id: '16',
        name: 'Agua Mineral',
        price: 800,
        description: 'Agua mineral con o sin gas, 500ml',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '17',
        name: 'Limonada',
        price: 1500,
        description: 'Limones frescos, agua mineral, menta',
        category: 'Sin Alcohol',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '18',
        name: 'Gaseosa',
        price: 1200,
        description: 'Coca Cola, Sprite, Fanta - lata 350ml',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '19',
        name: 'Jugo Natural',
        price: 1800,
        description: 'Naranja o pomelo recién exprimido',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },

      // PICADAS
      {
        id: '20',
        name: 'Tabla de Fiambres',
        price: 4500,
        description: 'Jamón crudo, salame, quesos, aceitunas, pan',
        category: 'Picadas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '21',
        name: 'Nachos',
        price: 3200,
        description: 'Nachos con cheddar, guacamole y crema',
        category: 'Picadas',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '22',
        name: 'Papas Bravas',
        price: 2500,
        description: 'Papas cortadas con salsa brava y alioli',
        category: 'Picadas',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '23',
        name: 'Aceitunas',
        price: 1800,
        description: 'Aceitunas verdes y negras marinadas',
        category: 'Picadas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '24',
        name: 'Empanadas',
        price: 2200,
        description: 'Empanadas caseras de carne o verdura (3 unidades)',
        category: 'Picadas',
        isRecommended: true,
        isVegan: false,
      },

      // COMIDAS
      {
        id: '25',
        name: 'Hamburguesa Completa',
        price: 3800,
        description: 'Carne 150g, lechuga, tomate, queso, papas',
        category: 'Comidas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '26',
        name: 'Milanesa Napolitana',
        price: 4200,
        description: 'Milanesa con jamón, queso, salsa, papas fritas',
        category: 'Comidas',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '27',
        name: 'Sandwich de Bondiola',
        price: 3500,
        description: 'Bondiola desmenuzada, cebolla, chimichurri',
        category: 'Comidas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '28',
        name: 'Ensalada Caesar',
        price: 3200,
        description: 'Lechuga, pollo, crutones, parmesano, aderezo caesar',
        category: 'Comidas',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '29',
        name: 'Wrap Veggie',
        price: 2800,
        description: 'Tortilla integral, hummus, vegetales, palta',
        category: 'Comidas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '30',
        name: 'Choripán',
        price: 2500,
        description: 'Chorizo a la parrilla, pan, chimichurri',
        category: 'Comidas',
        isRecommended: true,
        isVegan: false,
      },

      // POSTRES
      {
        id: '31',
        name: 'Brownie con Helado',
        price: 2800,
        description: 'Brownie tibio con helado de vainilla',
        category: 'Postres',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '32',
        name: 'Flan Casero',
        price: 2200,
        description: 'Flan tradicional con dulce de leche',
        category: 'Postres',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '33',
        name: 'Helado Artesanal',
        price: 2000,
        description: 'Dos bochas, sabores a elección',
        category: 'Postres',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '34',
        name: 'Fruta de Estación',
        price: 1800,
        description: 'Selección de frutas frescas cortadas',
        category: 'Postres',
        isRecommended: false,
        isVegan: true,
      },

      // CAFETERÍA
      {
        id: '35',
        name: 'Café Espresso',
        price: 800,
        description: 'Café espresso italiano, granos selectos',
        category: 'Cafetería',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '36',
        name: 'Cappuccino',
        price: 1200,
        description: 'Espresso con leche vaporizada y espuma',
        category: 'Cafetería',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '37',
        name: 'Café con Leche',
        price: 1000,
        description: 'Café con leche caliente, azúcar a gusto',
        category: 'Cafetería',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '38',
        name: 'Cortado',
        price: 900,
        description: 'Café cortado con leche, estilo porteño',
        category: 'Cafetería',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '39',
        name: 'Té',
        price: 800,
        description: 'Té negro, verde, manzanilla o menta',
        category: 'Cafetería',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '40',
        name: 'Mate Cocido',
        price: 700,
        description: 'Mate cocido tradicional argentino',
        category: 'Cafetería',
        isRecommended: false,
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