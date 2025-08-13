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
    description: 'Administra múltiples clubes y competencias deportivas',
    icon: 'M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150'
  },
  {
    id: 'miembro',
    name: 'Miembro',
    description: 'Participa en actividades y competencias del club',
    icon: 'M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150'
  },
  {
    id: 'club',
    name: 'Club',
    description: 'Gestiona miembros y actividades deportivas del club',
    icon: 'M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 15C18 12.34 15.33 10.5 12 10.5S6 12.34 6 15V16H18V15Z',
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-150'
  }
];

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Selecciona tu tipo de cuenta
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Elige el rol que mejor describa tu participación en Raquet Power
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleSelect(role.id)}
            className={`
              group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] hover:shadow-xl
              ${selectedRole === role.id 
                ? `${role.bgColor.split(' ')[0]} ${role.bgColor.split(' ')[1]} border-current shadow-lg ring-4 ring-opacity-20 ${role.color.replace('text-', 'ring-')}` 
                : `${role.bgColor} border-gray-200`
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                ${selectedRole === role.id 
                  ? `${role.color.replace('text-', 'bg-')} text-white shadow-lg` 
                  : `bg-white ${role.color} shadow-md group-hover:shadow-lg`
                }
              `}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={role.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-lg mb-2 ${selectedRole === role.id ? role.color : 'text-gray-900'}`}>
                  {role.name}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {role.description}
                </p>
              </div>
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${selectedRole === role.id 
                  ? `${role.color.replace('text-', 'border-')} ${role.color.replace('text-', 'bg-')}` 
                  : 'border-gray-300 bg-white'
                }
              `}>
                {selectedRole === role.id && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}