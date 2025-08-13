'use client';

import { Role } from '@/types';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: 'liga' | 'miembro' | 'club') => void;
}

const roles: Role[] = [
  {
    id: 'liga',
    name: 'Liga',
    description: 'Administra múltiples clubes y competencias deportivas a nivel regional',
    icon: 'M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z',
    color: 'text-violet-600',
    bgColor: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border-violet-200 hover:from-violet-100 hover:via-purple-100 hover:to-fuchsia-100'
  },
  {
    id: 'miembro',
    name: 'Miembro',
    description: 'Participa activamente en competencias y actividades deportivas del club',
    icon: 'M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 11.5C15.8 11.5 16.5 12.2 16.5 13S15.8 14.5 15 14.5 13.5 13.8 13.5 13 14.2 11.5 15 11.5ZM5 7V9L11 8.5V7L5 7ZM11 11.5C11.8 11.5 12.5 12.2 12.5 13S11.8 14.5 11 14.5 9.5 13.8 9.5 13 10.2 11.5 11 11.5ZM12 7.5C12.8 7.5 13.5 8.2 13.5 9S12.8 10.5 12 10.5 10.5 9.8 10.5 9 11.2 7.5 12 7.5ZM12 15L13.5 20H10.5L12 15Z',
    color: 'text-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-cyan-200 hover:from-cyan-100 hover:via-blue-100 hover:to-indigo-100'
  },
  {
    id: 'club',
    name: 'Club',
    description: 'Gestiona y coordina todas las actividades deportivas y administrativas del club',
    icon: 'M12 1L21.5 6.5V11.5C21.5 17.19 17.68 22.63 12 24C6.32 22.63 2.5 17.19 2.5 11.5V6.5L12 1ZM12 7C10.9 7 10 7.9 10 9S10.9 11 12 11 14 10.1 14 9 13.1 7 12 7ZM18 15C18 12.34 15.33 10.5 12 10.5S6 12.34 6 15V16H18V15Z',
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 border-emerald-200 hover:from-emerald-100 hover:via-teal-100 hover:to-green-100'
  }
];

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="font-display text-2xl font-bold text-gradient-primary mb-4 tracking-tight">
          Selecciona tu tipo de cuenta
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed font-medium">
          Elige el rol que mejor describa tu participación en{' '}
          <span className="font-display font-semibold text-gradient-secondary">Raquet Power</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleSelect(role.id)}
            className={`
              role-card group relative p-7 rounded-3xl border-2 transition-all duration-500 text-left transform hover:scale-[1.03] hover:shadow-strong
              ${selectedRole === role.id 
                ? `${role.bgColor.split(' ')[0]} ${role.bgColor.split(' ')[1]} ${role.bgColor.split(' ')[2]} border-current shadow-strong ring-4 ring-opacity-20 ${role.color.replace('text-', 'ring-')} animate-glow` 
                : `${role.bgColor} border-gray-200 shadow-soft hover:shadow-medium`
              }
            `}
          >
            <div className="flex items-start space-x-5">
              <div className={`
                flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden
                ${selectedRole === role.id 
                  ? `${role.color.replace('text-', 'bg-')} text-white shadow-strong animate-float` 
                  : `bg-white ${role.color} shadow-medium group-hover:shadow-strong group-hover:scale-110`
                }
              `}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                <svg className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d={role.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-display font-bold text-xl mb-3 tracking-tight transition-colors duration-300 ${
                  selectedRole === role.id ? role.color : 'text-gray-900 group-hover:text-gray-800'
                }`}>
                  {role.name}
                </div>
                <p className="text-gray-600 leading-relaxed font-medium group-hover:text-gray-700 transition-colors duration-300">
                  {role.description}
                </p>
              </div>
              <div className={`
                flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500
                ${selectedRole === role.id 
                  ? `${role.color.replace('text-', 'border-')} ${role.color.replace('text-', 'bg-')} shadow-lg animate-pulse` 
                  : 'border-gray-300 bg-white group-hover:border-gray-400 group-hover:scale-110'
                }
              `}>
                {selectedRole === role.id && (
                  <svg className="w-4 h-4 text-white animate-fade-in-up" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent transform rotate-12 scale-150"></div>
            </div>
            
            {/* Hover glow effect */}
            <div className={`
              absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none
              ${role.color.replace('text-', 'bg-')} blur-xl
            `}></div>
          </button>
        ))}
      </div>
    </div>
  );
}