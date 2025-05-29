export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  supplier: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  products: SaleItem[];
  total: number;
  subtotal: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  customerName?: string;
  customerPhone?: string;
  createdAt: Date;
  userId: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  products: PurchaseItem[];
  total: number;
  createdAt: Date;
  userId: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  cost: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  lastPurchase?: Date;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  address?: string;
  products: string[];
  createdAt: Date;
}

export interface DashboardStats {
  todaySales: number;
  monthSales: number;
  totalProducts: number;
  lowStockProducts: number;
  recentPurchases: number;
  netBalance: number;
}