import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface DatabaseMenu {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProduct {
  id: string;
  menu_id: string;
  name: string;
  price: number;
  description: string;
  category: 'Entrada' | 'Principal' | 'Bebida' | 'Postre';
  is_recommended: boolean;
  is_vegan: boolean;
  created_at: string;
  updated_at: string;
}