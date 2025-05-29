export type ProductCategory = 'Entrada' | 'Principal' | 'Bebida' | 'Postre';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended?: boolean;
  isVegan?: boolean;
}

export interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
}

export interface MenuData {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface AdminFormData {
  name: string;
  price: number;
  description: string;
  category: ProductCategory;
  isRecommended: boolean;
  isVegan: boolean;
}