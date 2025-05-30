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
    name: 'Xs Reset - Bar & Lounge',
    description: 'Experiencia gastronómica premium en el corazón de la ciudad',
    products: [
      // BEBIDAS ALCOHÓLICAS
      {
        id: '1',
        name: 'Gin Tonic Premium',
        price: 4500,
        description: 'Gin Bombay Sapphire, tónica Schweppes, pepino y enebro fresco',
        category: 'Beverages',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '2',
        name: 'Negroni Clásico',
        price: 4200,
        description: 'Gin, Campari, Vermouth rosso, twist de naranja',
        category: 'Cocktails',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '3',
        name: 'Aperol Spritz',
        price: 3800,
        description: 'Aperol, Prosecco, soda, naranja fresca',
        category: 'Cocktails & Gin',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '4',
        name: 'Moscow Mule',
        price: 4000,
        description: 'Vodka premium, ginger beer, lima, menta fresca',
        category: 'Cocktails',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '5',
        name: 'Old Fashioned',
        price: 5200,
        description: 'Bourbon whiskey, azúcar demerara, bitter de angostura',
        category: 'Cocktails',
        isRecommended: true,
        isVegan: true,
      },

      // WHISKIES & DESTILADOS
      {
        id: '6',
        name: 'Johnnie Walker Black',
        price: 4800,
        description: 'Whisky escocés 12 años, servido solo o con hielo',
        category: 'Spirits',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '7',
        name: 'Jameson Irish Whiskey',
        price: 4200,
        description: 'Whiskey irlandés suave, triple destilado',
        category: 'Whiskies & Destilados',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '8',
        name: 'Macallan 12 años',
        price: 7500,
        description: 'Single malt escocés, crianza en roble jerez',
        category: 'Whiskies & Destilados',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '9',
        name: 'Hennessy VS',
        price: 6200,
        description: 'Cognac francés, notas frutales y especiadas',
        category: 'Whiskies & Destilados',
        isRecommended: false,
        isVegan: true,
      },

      // VINOS & ESPUMANTES
      {
        id: '10',
        name: 'Malbec Reserva',
        price: 3200,
        description: 'Copa de Malbec mendocino, cuerpo medio, taninos suaves',
        category: 'Wine',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '11',
        name: 'Sauvignon Blanc',
        price: 2800,
        description: 'Vino blanco fresco, notas cítricas y herbales',
        category: 'Vinos & Espumantes',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '12',
        name: 'Champagne Moët & Chandon',
        price: 8500,
        description: 'Copa de champagne francés, burbujas finas y persistentes',
        category: 'Vinos & Espumantes',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '13',
        name: 'Prosecco Italiano',
        price: 3500,
        description: 'Espumante italiano, fresco y aromático',
        category: 'Vinos & Espumantes',
        isRecommended: false,
        isVegan: true,
      },

      // CERVEZAS
      {
        id: '14',
        name: 'Stella Artois',
        price: 2200,
        description: 'Cerveza belga premium, botella 330ml',
        category: 'Beer',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '15',
        name: 'Corona Extra',
        price: 2400,
        description: 'Cerveza mexicana con lima fresca',
        category: 'Cervezas',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '16',
        name: 'Heineken',
        price: 2300,
        description: 'Cerveza holandesa premium, botella 330ml',
        category: 'Cervezas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '17',
        name: 'IPA Artesanal',
        price: 3200,
        description: 'Cerveza artesanal local, lúpulo americano, notas cítricas',
        category: 'Cervezas',
        isRecommended: true,
        isVegan: true,
      },

      // BEBIDAS SIN ALCOHOL
      {
        id: '18',
        name: 'Agua San Pellegrino',
        price: 1500,
        description: 'Agua mineral italiana con gas, botella 500ml',
        category: 'Non-Alcoholic',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '19',
        name: 'Limonada Premium',
        price: 2200,
        description: 'Limones frescos, agua mineral, menta y jengibre',
        category: 'Sin Alcohol',
        isRecommended: true,
        isVegan: true,
      },
      {
        id: '20',
        name: 'Virgin Mojito',
        price: 2500,
        description: 'Menta fresca, lima, azúcar de caña y soda',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '21',
        name: 'Jugo Natural',
        price: 2000,
        description: 'Naranja, pomelo o limón recién exprimido',
        category: 'Sin Alcohol',
        isRecommended: false,
        isVegan: true,
      },

      // PICADAS & TAPAS
      {
        id: '22',
        name: 'Tabla de Fiambres Premium',
        price: 6500,
        description: 'Jamón crudo, salame, quesos importados, aceitunas, nueces y pan artesanal',
        category: 'Appetizers',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '23',
        name: 'Bruschetta Italiana',
        price: 3800,
        description: 'Pan tostado, tomate fresco, albahaca, mozzarella y aceite de oliva',
        category: 'Picadas & Tapas',
        isRecommended: false,
        isVegan: false,
      },
      {
        id: '24',
        name: 'Nachos Supremos',
        price: 4200,
        description: 'Nachos de maíz, queso cheddar, guacamole, pico de gallo y crema',
        category: 'Picadas & Tapas',
        isRecommended: true,
        isVegan: false,
      },
      {
        id: '25',
        name: 'Aceitunas Gourmet',
        price: 2500,
        description: 'Aceitunas verdes y negras marinadas con hierbas mediterráneas',
        category: 'Picadas & Tapas',
        isRecommended: false,
        isVegan: true,
      },
      {
        id: '26',
        name: 'Papas Bravas',
        price: 3200,
        description: 'Papas cortadas en cubos con salsa brava picante y alioli',
        category: 'Picadas & Tapas',
        isRecommended: false,
        isVegan: true,
      },

      // PLATOS PRINCIPALES
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