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
  icon?: string;
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

// Tournament types
export interface Tournament {
  id: number;
  league_id?: number;
  name: string;
  description?: string;
  sport: string;
  sport_id?: number;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  max_participants?: number;
  participants: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  format?: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  entry_fee?: number;
  prize_pool?: number;
  location?: string;
  rules?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  league?: League;
  sport_entity?: Sport;
  participants_list?: TournamentParticipant[];
}

// Tournament Participant types
export interface TournamentParticipant {
  id: number;
  tournament_id: number;
  member_id: number;
  club_id: number;
  registration_date: string;
  status: 'registered' | 'confirmed' | 'withdrawn';
  seed?: number;
  
  // Relations
  tournament?: Tournament;
  member?: Member;
  club?: Club;
}

// Invitation types
export interface Invitation {
  id: number;
  league_id?: number;
  club_id?: number;
  sender_id: number;
  receiver_id?: number;
  receiver_email?: string;
  type: 'league_to_club' | 'club_to_league' | 'club_to_member';
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expires_at?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  league?: League;
  club?: Club;
  sender?: User;
  receiver?: User;
  
  // Computed attributes
  sender_name?: string;
  receiver_name?: string;
  entity_name?: string;
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
  icon?: string;
}

export interface SportParameterForm {
  param_key: string;
  param_type: 'number' | 'string' | 'boolean';
  param_value: string | number | boolean;
}

export interface TournamentForm {
  name: string;
  description?: string;
  sport_id: number;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  max_participants?: number;
  format?: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  entry_fee?: number;
  prize_pool?: number;
  location?: string;
  rules?: string;
}

export interface InvitationForm {
  type: 'league_to_club' | 'club_to_league' | 'club_to_member';
  receiver_email?: string;
  club_id?: number;
  message?: string;
  expires_at?: string;
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

// Statistics types
export interface LeagueStats {
  total_clubs: number;
  total_members: number;
  active_clubs: number;
  active_members: number;
  pending_invitations: number;
  sent_invitations: number;
  total_tournaments: number;
  active_tournaments: number;
  total_sports: number;
  growth_this_month: number;
  average_members_per_club: number;
}

export interface ClubStats {
  total_members: number;
  active_members: number;
  tournaments_participated: number;
  tournaments_won: number;
  monthly_growth: number;
  average_member_age: number;
  sports_played: number;
}

export interface MemberStats {
  tournaments_played: number;
  tournaments_won: number;
  win_rate: number;
  current_ranking: string;
  matches_played: number;
  matches_won: number;
  favorite_sport: string;
}

// Sport configuration types
export interface SportConfig {
  sport_code: string;
  parameters: Record<string, SportParameterConfig>;
}

export interface SportParameterConfig {
  key: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  label: string;
  default_value: any;
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}