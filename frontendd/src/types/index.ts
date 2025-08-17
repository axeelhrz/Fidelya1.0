// User types with role-specific information
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'liga' | 'miembro' | 'club' | 'super_admin';
  phone?: string;
  country?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  
  // Polymorphic relation fields
  roleable_id?: number;
  roleable_type?: string;
  
  // Liga-specific fields
  league_name?: string;
  province?: string;
  logo_path?: string;
  
  // Club-specific fields
  club_name?: string;
  parent_league_id?: number;
  city?: string;
  address?: string;
  
  // Member-specific fields
  full_name?: string;
  parent_club_id?: number;
  birth_date?: string;
  gender?: 'masculino' | 'femenino';
  rubber_type?: 'liso' | 'pupo' | 'ambos';
  ranking?: string;
  photo_path?: string;
  
  // Relations
  parent_league?: League;
  parent_club?: Club;
  league_entity?: League;
  club_entity?: Club;
  member_entity?: Member;
  
  // Computed attributes
  role_info?: RoleInfo;
}

// Role-specific information
export interface RoleInfo {
  type: 'liga' | 'club' | 'miembro' | 'super_admin';
  name?: string;
  description?: string;
  province?: string;
  city?: string;
  address?: string;
  full_name?: string;
  birth_date?: string;
  gender?: string;
  rubber_type?: string;
  ranking?: string;
  logo_path?: string;
  photo_path?: string;
  parent_league?: League;
  parent_club?: Club;
  entity?: League | Club | Member;
}

// League types
export interface League {
  id: number;
  user_id?: number;
  name: string;
  region?: string;
  province?: string;
  logo_path?: string;
  status: 'active' | 'inactive';
  clubs_count?: number;
  members_count?: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: User;
  clubs?: Club[];
  club_users?: User[];
  
  // Computed attributes
  admin_info?: AdminInfo;
}

// Club types
export interface Club {
  id: number;
  user_id?: number;
  league_id: number;
  name: string;
  city?: string;
  address?: string;
  logo_path?: string;
  status: 'active' | 'inactive';
  members_count?: number;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: User;
  league?: League;
  members?: Member[];
  member_users?: User[];
  
  // Computed attributes
  admin_info?: AdminInfo;
  full_address?: string;
}

// Member types
export interface Member {
  id: number;
  user_id?: number;
  club_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  doc_id?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  rubber_type?: string;
  ranking?: string;
  photo_path?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: User;
  club?: Club;
  
  // Computed attributes
  age?: number;
  user_info?: UserInfo;
  hierarchy?: MemberHierarchy;
}

// Admin information for entities
export interface AdminInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
}

// User information for members
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  full_name?: string;
  birth_date?: string;
  gender?: string;
  rubber_type?: string;
  ranking?: string;
  photo_path?: string;
}

// Member hierarchy information
export interface MemberHierarchy {
  member: {
    id: number;
    name: string;
    user?: UserInfo;
  };
  club: {
    id: number;
    name: string;
    user?: AdminInfo;
  };
  league: {
    id: number;
    name: string;
    user?: AdminInfo;
  };
}

// Sport types
export interface Sport {
  id: number;
  name: string;
  code: string;
  parameters_count?: number;
  created_at: string;
  updated_at: string;
  parameters?: SportParameter[];
}

// Sport Parameter types
export interface SportParameter {
  id: number;
  sport_id: number;
  param_key: string;
  param_type: 'number' | 'string' | 'boolean';
  param_value: string;
  typed_value: number | string | boolean;
  created_at: string;
  updated_at: string;
  sport?: Sport;
}

// Role types for UI
export interface Role {
  id: 'liga' | 'miembro' | 'club' | 'super_admin';
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
}

export interface PaginatedResponse<T = unknown> {
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  message: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

// Updated register form with role-specific fields
export interface RegisterForm {
  // Common fields
  role: 'liga' | 'miembro' | 'club';
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  country: string;
  
  // Liga-specific fields
  league_name?: string;
  province?: string;
  logo_path?: string;
  
  // Club-specific fields
  club_name?: string;
  parent_league_id?: number;
  city?: string;
  address?: string;
  
  // Member-specific fields
  full_name?: string;
  parent_club_id?: number;
  birth_date?: string;
  gender?: 'masculino' | 'femenino';
  rubber_type?: 'liso' | 'pupo' | 'ambos';
  ranking?: string;
  photo_path?: string;
}

// Entity form types
export interface LeagueForm {
  name: string;
  region?: string;
  province?: string;
  logo_path?: string;
  status?: 'active' | 'inactive';
}

export interface ClubForm {
  league_id: number;
  name: string;
  city?: string;
  address?: string;
  logo_path?: string;
  status?: 'active' | 'inactive';
}

export interface MemberForm {
  club_id: number;
  first_name: string;
  last_name: string;
  doc_id?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  rubber_type?: string;
  ranking?: string;
  photo_path?: string;
  status?: 'active' | 'inactive';
}

export interface SportForm {
  name: string;
  code: string;
}

export interface SportParameterForm {
  param_key: string;
  param_type: 'number' | 'string' | 'boolean';
  param_value: string | number | boolean;
}

// Available options for registration
export interface AvailableLeague {
  id: number;
  name: string;
  region?: string;
  province?: string;
}

export interface AvailableClub {
  id: number;
  name: string;
  city?: string;
  league_id: number;
  league?: {
    id: number;
    name: string;
  };
}