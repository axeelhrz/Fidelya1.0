import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleCard } from '@/components/auth/RoleCard';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Elige el tipo de cuenta que mejor se adapte a ti"
    >
      <div className="space-y-4">
        <RoleCard
          role="asociacion"
          title="Asociación"
          description="Para organizaciones y asociaciones que gestionan programas de fidelidad"
          href="/auth/register/asociacion"
        />
        
        <RoleCard
          role="socio"
          title="Socio"
          description="Para personas que quieren participar en programas de fidelidad"
          href="/auth/register/socio"
        />
        
        <RoleCard
          role="comercio"
          title="Comercio"
          description="Para negocios que quieren ofrecer beneficios a sus clientes"
          href="/auth/register/comercio"
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Iniciar sesión
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
