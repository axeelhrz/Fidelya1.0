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
  
  // Related entities
  leagueEntity?: League;
  clubEntity?: Club;
  memberEntity?: Member;
  parentClub?: Club;
  rubber_type?: string;
  parent_club?: Club;
}

// League types
export interface League {
  id: number;
  name: string;
  province: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
  clubs?: Club[];
  tournaments?: Tournament[];
  clubs_count?: number;
  status?: 'active' | 'inactive';
  region?: string;
}

// Club types
export interface Club {
  id: number;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  user_id: number;
  league_id?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  league?: League;
  members?: Member[];
  members_count?: number;
}

// Member types
export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  user_id: number;
  club_id: number;
  created_at: string;
  updated_at: string;
  user?: User;
  club?: Club;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  doc_id?: string;
}

// Sport types
export interface Sport {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
  parameters?: SportParameter[];
  tournaments?: Tournament[];
  parameters_count?: number;
}

export interface SportParameter {
  id: number;
  sport_id: number;
  parameter_name: string;
  parameter_value: string;
  parameter_type: 'string' | 'number' | 'boolean' | 'select';
  options?: string;
  created_at: string;
  updated_at: string;
  sport?: Sport;
  param_key: string;
  param_value: string;
  param_type: 'text' | 'number' | 'boolean' | 'select';
  description: string;
  unit: string;
  category: string;
  typed_value: string;
}

// Tournament types
export interface Tournament {
  id: number;
  name: string;
  description?: string;
  league_id: number;
  sport_id: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_participants: number;
  current_participants: number;
  entry_fee: number;
  prize_pool: number;
  tournament_format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss_system';
  location?: string;
  rules?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  matches_played: number;
  matches_total: number;
  created_at: string;
  updated_at: string;
  league?: League;
  sport?: Sport;
  participants?: TournamentParticipant[];
}

export interface TournamentParticipant {
  id: number;
  tournament_id: number;
  participant_type: 'member' | 'club';
  participant_id: number;
  registration_date: string;
  status: 'registered' | 'confirmed' | 'withdrawn';
  created_at: string;
  updated_at: string;
  tournament?: Tournament;
}

// Invitation types
export interface Invitation {
  id: number;
  sender_id: number;
  sender_type: string;
  receiver_id: number;
  receiver_type: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  type: 'league_to_club' | 'club_to_league' | 'club_to_member' | 'member_to_club';
  metadata?: Record<string, unknown>;
  expires_at?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  
  // Populated relations
  sender?: League | Club | Member;
  receiver?: League | Club | Member;
  
  // Additional computed fields
  is_sender?: boolean;
  sender_name?: string;
  receiver_name?: string;
  sender_details?: {
    id: number;
    name: string;
    type: string;
    province?: string;
    city?: string;
  };
  receiver_details?: {
    id: number;
    name: string;
    type: string;
    province?: string;
    city?: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
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
  role: 'liga' | 'club' | 'miembro';
  phone?: string;
  country?: string;
  
  // Role-specific fields
  province?: string; // For liga
  city?: string; // For club
  address?: string; // For club
  birth_date?: string; // For miembro
  gender?: 'male' | 'female' | 'other'; // For miembro
}

export interface LeagueForm {
  name: string;
  province: string;
}

export interface ClubForm {
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  league_id?: number;
}

export interface MemberForm {
  name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  club_id: number;
}

export interface SportForm {
  name: string;
  code: string;
}

export interface SportParameterForm {
  sport_id: number;
  parameter_name: string;
  parameter_value: string;
  parameter_type: 'string' | 'number' | 'boolean' | 'select';
  options?: string;
}

export interface TournamentForm {
  name: string;
  description?: string;
  league_id: number;
  sport_id: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_participants: number;
  entry_fee: number;
  prize_pool: number;
  tournament_format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss_system';
  location?: string;
  rules?: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

// Invitation form types
export interface InvitationForm {
  receiver_id: number;
  receiver_type: 'App\\Models\\Club' | 'App\\Models\\League';
  message?: string;
  type: 'league_to_club' | 'club_to_league';
  expires_at?: string;
}

export interface SendInvitationForm {
  club_id?: number;
  club_name?: string;
  league_id?: number;
  league_name?: string;
  message: string;
  expires_at?: string;
}

// Available entities response
export interface AvailableEntitiesResponse {
  data: PaginatedResponse<Club | League>;
  entity_type: 'clubs' | 'leagues';
}

// Statistics types
export interface LeagueStats {
  totalClubs: number;
  activeClubs: number;
  inactiveClubs: number;
  totalMembers: number;
  averageMembersPerClub: number;
  totalTournaments: number;
  upcomingTournaments: number;
  activeTournaments: number;
  completedTournaments: number;
  totalParticipants: number;
  totalPrizePool: number;
}

export interface ClubStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  maleMembers: number;
  femaleMembers: number;
  averageAge: number;
  tournamentsParticipated: number;
  wins: number;
  losses: number;
}

// Filter and search types
export interface FilterOptions {
  search?: string;
  status?: string;
  sport?: string;
  city?: string;
  league?: string;
  club?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InvitationFilters {
  type?: 'sent' | 'received' | 'all';
  status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'all';
  search?: string;
}

// Modal and UI types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  count?: number;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  errors?: ValidationError[];
  status?: number;
}