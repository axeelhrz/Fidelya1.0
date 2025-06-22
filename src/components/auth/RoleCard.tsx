import Link from 'next/link';
import { Building2, Store, Users } from 'lucide-react';

interface RoleCardProps {
  role: 'asociacion' | 'socio' | 'comercio';
  title: string;
  description: string;
  href: string;
}

const roleIcons = {
  asociacion: Building2,
  socio: Users,
  comercio: Store
};

const roleColors = {
  asociacion: 'text-blue-600 bg-blue-50 border-blue-200',
  socio: 'text-green-600 bg-green-50 border-green-200',
  comercio: 'text-purple-600 bg-purple-50 border-purple-200'
};

export function RoleCard({ role, title, description, href }: RoleCardProps) {
  const Icon = roleIcons[role];
  const colorClasses = roleColors[role];

  return (
    <Link
      href={href}
      className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${colorClasses}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        </div>
        <div className="flex h-5 w-5 items-center justify-center">
          <svg
            className="h-4 w-4 text-gray-400 group-hover:text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
