// This file defines the types for Supabase tables used in the project
export type Tables = {
  guardians: {
    id: string
    user_id: string
    full_name: string
    email: string
    phone: string
    is_staff: boolean
  }
  students: {
    id: string
    guardian_id: string
    name: string
    grade: string
    section: string
    level: string
  }
}

export type Database = {
  public: {
    Tables: Tables
  }
}
