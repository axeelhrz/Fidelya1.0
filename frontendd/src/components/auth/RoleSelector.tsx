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
    description: 'Administra múltiples clubes y competencias',
    icon: '🏆',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'miembro',
    name: 'Miembro',
    description: 'Participa en actividades y competencias',
    icon: '👤',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'club',
    name: 'Club',
    description: 'Gestiona miembros y actividades del club',
    icon: '🏟️',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200 hover:bg-green-100'
  }
];

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Selecciona tu tipo de cuenta
        </h3>
        <p className="text-sm text-gray-600">
          Elige el rol que mejor describa tu participación en Raquet Power
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleSelect(role.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${selectedRole === role.id 
                ? `${role.bgColor.replace('hover:', '')} border-current ring-2 ring-offset-2 ring-current` 
                : `${role.bgColor} border-gray-200 hover:border-current`
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`text-2xl ${role.color}`}>
                {role.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold ${role.color}`}>
                  {role.name}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {role.description}
                </p>
              </div>
              {selectedRole === role.id && (
                <div className={`${role.color}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
