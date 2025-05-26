export type ProductCategory = 'Entrada' | 'Principal' | 'Bebida' | 'Postre';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
}