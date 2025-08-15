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
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'miembro',
    name: 'Miembro',
    description: 'Participa en actividades y competencias del club',
    icon: 'M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
  },
  {
    id: 'club',
    name: 'Club',
    description: 'Gestiona miembros y actividades deportivas del club',
    icon: 'M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM12 7C13.1 7 14 7.9 14 9S13.1 11 12 11 10 10.1 10 9 10.9 7 12 7ZM18 15C18 12.34 15.33 10.5 12 10.5S6 12.34 6 15V16H18V15Z',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  }
];

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
          Selecciona tu tipo de cuenta
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Elige el rol que mejor describa tu participación en Raquet Power
        </p>
      </div>
      
      <div className="space-y-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleSelect(role.id)}
            className={`
              role-card w-full p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md
              ${selectedRole === role.id 
                ? `${role.bgColor.split(' ')[0]} border-current shadow-lg ring-2 ring-opacity-20 ${role.color.replace('text-', 'ring-')}` 
                : `${role.bgColor} shadow-sm`
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200
                ${selectedRole === role.id 
                  ? `${role.color.replace('text-', 'bg-')} text-white shadow-md` 
                  : `bg-white ${role.color} shadow-sm`
                }
              `}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={role.icon} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-display font-semibold text-lg mb-2 ${
                  selectedRole === role.id ? role.color : 'text-gray-900'
                }`}>
                  {role.name}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
              <div className={`
                flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
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
          </button>
        ))}
      </div>
    </div>
  );
}