"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { RoleManager } from "@/components/admin/RoleManager";

export default function UsuariosPage() {
  return (
    <AdminGuard requiredPermission="usuarios.read">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
        </div>
        
        <RoleManager />
      </div>
    </AdminGuard>
  );
}