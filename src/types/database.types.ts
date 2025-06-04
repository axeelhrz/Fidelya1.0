export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      guardians: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          role: 'guardian' | 'admin' | 'staff'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          role?: 'guardian' | 'admin' | 'staff'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          role?: 'guardian' | 'admin' | 'staff'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardians_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          id: string
          guardian_id: string | null
          name: string
          grade: string
          section: string
          level: 'preescolar' | 'basica' | 'media'
          dietary_restrictions: string | null
          allergies: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id?: string | null
          name: string
          grade: string
          section: string
          level: 'preescolar' | 'basica' | 'media'
          dietary_restrictions?: string | null
          allergies?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string | null
          name?: string
          grade?: string
          section?: string
          level?: 'preescolar' | 'basica' | 'media'
          dietary_restrictions?: string | null
          allergies?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          type: 'almuerzo' | 'colacion'
          price_student: number
          price_staff: number
          available_date: string
          day_of_week: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          type: 'almuerzo' | 'colacion'
          price_student: number
          price_staff: number
          available_date: string
          day_of_week: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          type?: 'almuerzo' | 'colacion'
          price_student?: number
          price_staff?: number
          available_date?: string
          day_of_week?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          guardian_id: string | null
          student_id: string | null
          order_number: string
          delivery_date: string
          day_of_week: string
          total_amount: number
          status: 'pending' | 'paid' | 'cancelled' | 'delivered'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id?: string | null
          student_id?: string | null
          order_number: string
          delivery_date: string
          day_of_week: string
          total_amount: number
          status?: 'pending' | 'paid' | 'cancelled' | 'delivered'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string | null
          student_id?: string | null
          order_number?: string
          delivery_date?: string
          day_of_week?: string
          total_amount?: number
          status?: 'pending' | 'paid' | 'cancelled' | 'delivered'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          unit_price: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          unit_price: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          unit_price?: number
          subtotal?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          transaction_id: string | null
          payment_method: string
          amount: number
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          gateway_response: Json | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          transaction_id?: string | null
          payment_method?: string
          amount: number
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          gateway_response?: Json | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          transaction_id?: string | null
          payment_method?: string
          amount?: number
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          gateway_response?: Json | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_place_order: {
        Args: {
          target_date: string
        }
        Returns: boolean
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_kitchen_report: {
        Args: {
          report_date?: string
        }
        Returns: {
          product_name: string
          product_type: 'almuerzo' | 'colacion'
          total_quantity: number
          orders_by_grade: Json
        }[]
      }
      get_orders_summary: {
        Args: {
          summary_date?: string
        }
        Returns: {
          total_orders: number
          total_amount: number
          pending_orders: number
          paid_orders: number
          orders_by_grade: Json
        }[]
      }
    }
    Enums: {
      grade_level: 'preescolar' | 'basica' | 'media'
      order_status: 'pending' | 'paid' | 'cancelled' | 'delivered'
      payment_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
      product_type: 'almuerzo' | 'colacion'
      user_role: 'guardian' | 'admin' | 'staff'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Guardian = Database['public']['Tables']['guardians']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Setting = Database['public']['Tables']['settings']['Row']

export type UserRole = Database['public']['Enums']['user_role']
export type OrderStatus = Database['public']['Enums']['order_status']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type ProductType = Database['public']['Enums']['product_type']
export type GradeLevel = Database['public']['Enums']['grade_level']