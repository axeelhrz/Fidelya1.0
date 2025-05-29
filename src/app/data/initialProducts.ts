import { Product } from '../types';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Ensalada César',
    price: 8.99,
    description: 'Lechuga romana, crutones, queso parmesano y aderezo César',
    category: 'Entrada',
  },
  {
    id: '2',
    name: 'Sopa de Tomate',
    price: 6.50,
    description: 'Sopa casera de tomate con albahaca y crema',
    category: 'Entrada',
  },
  {
    id: '3',
    name: 'Filete de Salmón',
    price: 18.99,
    description: 'Filete de salmón a la parrilla con limón y hierbas',
    category: 'Principal',
  },
  {
    id: '4',
    name: 'Pasta Alfredo',
    price: 14.50,
    description: 'Fettuccine con salsa cremosa de queso parmesano',
    category: 'Principal',
  },
  {
    id: '5',
    name: 'Agua Mineral',
    price: 2.50,
    description: 'Botella de agua mineral de 500ml',
    category: 'Bebida',
  },
  {
    id: '6',
    name: 'Refresco',
    price: 3.00,
    description: 'Refresco de cola, naranja o limón',
    category: 'Bebida',
  },
  {
    id: '7',
    name: 'Tarta de Chocolate',
    price: 7.99,
    description: 'Tarta casera de chocolate con salsa de frambuesa',
    category: 'Postre',
  },
  {
    id: '8',
    name: 'Helado',
    price: 5.50,
    description: 'Tres bolas de helado a elegir: vainilla, chocolate o fresa',
    category: 'Postre',
  },
];