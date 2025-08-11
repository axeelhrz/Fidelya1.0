// User types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// League types
export interface League {
  id: number;
  name: string;
  region?: string;
  status: 'active' | 'inactive';
  clubs_count?: number;
  created_at: string;
  updated_at: string;
  clubs?: Club[];
}

// Club types
export interface Club {
  id: number;
  league_id: number;
  name: string;
  city?: string;
  status: 'active' | 'inactive';
  members_count?: number;
  created_at: string;
  updated_at: string;
  league?: League;
  members?: Member[];
}

// Member types
export interface Member {
  id: number;
  club_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  doc_id?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  club?: Club;
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

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
}

export interface PaginatedResponse<T = any> {
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

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LeagueForm {
  name: string;
  region?: string;
  status?: 'active' | 'inactive';
}

export interface ClubForm {
  league_id: number;
  name: string;
  city?: string;
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