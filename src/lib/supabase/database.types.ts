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
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string
          category: Database["public"]["Enums"]["menu_category"]
          price_student: number
          price_staff: number
          available_date: string
          day_name: string
          day_type: string
          code: string | null
          is_available: boolean
          max_orders: number | null
          current_orders: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: Database["public"]["Enums"]["menu_category"]
          price_student: number
          price_staff: number
          available_date: string
          day_name: string
          day_type: string
          code?: string | null
          is_available?: boolean
          max_orders?: number | null
          current_orders?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: Database["public"]["Enums"]["menu_category"]
          price_student?: number
          price_staff?: number
          available_date?: string
          day_name?: string
          day_type?: string
          code?: string | null
          is_available?: boolean
          max_orders?: number | null
          current_orders?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_transactions: {
        Row: {
          id: string
          order_id: string
          transaction_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          transaction_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          transaction_id?: string
          amount?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          guardian_id: string
          student_id: string
          menu_item_id: string
          delivery_date: string
          quantity: number
          unit_price: number
          total_amount: number
          status: Database["public"]["Enums"]["order_status"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          payment_method: string | null
          payment_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id: string
          student_id: string
          menu_item_id: string
          delivery_date: string
          quantity?: number
          unit_price: number
          total_amount: number
          status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          payment_method?: string | null
          payment_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string
          student_id?: string
          menu_item_id?: string
          delivery_date?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          payment_method?: string | null
          payment_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          transaction_id: string
          guardian_id: string
          total_amount: number
          currency: string
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          gateway_response: Json | null
          gateway_transaction_id: string | null
          payment_url: string | null
          expires_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          guardian_id: string
          total_amount: number
          currency?: string
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          payment_url?: string | null
          expires_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          guardian_id?: string
          total_amount?: number
          currency?: string
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          payment_url?: string | null
          expires_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          module: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          module: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          module?: string
          action?: string
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          id: string
          role_name: Database["public"]["Enums"]["user_role"]
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role_name: Database["public"]["Enums"]["user_role"]
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role_name?: Database["public"]["Enums"]["user_role"]
          permission_id?: string
          created_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: Database["public"]["Enums"]["user_role"]
          display_name: string
          description: string | null
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Database["public"]["Enums"]["user_role"]
          display_name: string
          description?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Database["public"]["Enums"]["user_role"]
          display_name?: string
          description?: string | null
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          guardian_id: string
          name: string
          grade: string
          section: string
          level: Database["public"]["Enums"]["student_level"]
          user_type: Database["public"]["Enums"]["user_type"]
          rut: string | null
          dietary_restrictions: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id: string
          name: string
          grade: string
          section: string
          level: Database["public"]["Enums"]["student_level"]
          user_type?: Database["public"]["Enums"]["user_type"]
          rut?: string | null
          dietary_restrictions?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string
          name?: string
          grade?: string
          section?: string
          level?: Database["public"]["Enums"]["student_level"]
          user_type?: Database["public"]["Enums"]["user_type"]
          rut?: string | null
          dietary_restrictions?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      system_config: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          is_active: boolean
          last_login: string | null
          login_count: number
          role_assigned_by: string | null
          role_assigned_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          role_assigned_by?: string | null
          role_assigned_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          role_assigned_by?: string | null
          role_assigned_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: {
          p_user_id: string
          p_email: string
          p_full_name: string
          p_phone?: string
          p_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: string
      }
      get_current_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_orders: number
          orders_today: number
          pending_orders: number
          total_revenue: number
          active_users: number
        }[]
      }
      get_user_permissions: {
        Args: {
          user_email: string
        }
        Returns: {
          permission_name: string
          module: string
          action: string
        }[]
      }
      get_user_role: {
        Args: {
          user_email: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role_info: {
        Args: {
          user_email: string
        }
        Returns: {
          role_name: Database["public"]["Enums"]["user_role"]
          display_name: string
          description: string
          color: string
          permissions: string[]
        }[]
      }
      is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_user_id: string
          p_action: string
          p_entity_type: string
          p_entity_id?: string
          p_details?: Json
        }
        Returns: string
      }
      update_last_login: {
        Args: {
          user_email: string
        }
        Returns: undefined
      }
      user_has_permission: {
        Args: {
          user_email: string
          permission_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      menu_category: "almuerzo" | "colacion"
      order_status: "pending" | "confirmed" | "paid" | "cancelled" | "delivered"
      payment_status: "pending" | "processing" | "completed" | "failed" | "cancelled"
      student_level: "basica" | "media"
      user_role: "user" | "viewer" | "moderator" | "admin" | "super_admin"
      user_type: "estudiante" | "funcionario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never