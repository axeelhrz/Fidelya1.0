-- Crear enum para roles del sistema
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin', 'moderator', 'viewer');

-- Crear tabla de permisos
CREATE TABLE IF NOT EXISTS permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  module VARCHAR(50) NOT NULL, -- 'pedidos', 'usuarios', 'menu', 'estadisticas', etc.
  action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'export'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de roles con permisos
CREATE TABLE IF NOT EXISTS roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name user_role NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6b7280', -- Color hex para UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de relación roles-permisos
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  role_name user_role NOT NULL REFERENCES roles(name) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_name, permission_id)
);

-- Actualizar tabla clientes para usar el nuevo sistema de roles
ALTER TABLE clientes 
DROP COLUMN IF EXISTS rol,
ADD COLUMN role user_role DEFAULT 'user',
ADD COLUMN role_assigned_by UUID REFERENCES clientes(id),
ADD COLUMN role_assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN login_count INTEGER DEFAULT 0;

-- Insertar permisos básicos del sistema
INSERT INTO permissions (name, description, module, action) VALUES
-- Permisos de pedidos
('pedidos.create', 'Crear nuevos pedidos', 'pedidos', 'create'),
('pedidos.read', 'Ver pedidos', 'pedidos', 'read'),
('pedidos.update', 'Modificar pedidos', 'pedidos', 'update'),
('pedidos.delete', 'Eliminar pedidos', 'pedidos', 'delete'),
('pedidos.export', 'Exportar datos de pedidos', 'pedidos', 'export'),

-- Permisos de usuarios
('usuarios.create', 'Crear nuevos usuarios', 'usuarios', 'create'),
('usuarios.read', 'Ver usuarios', 'usuarios', 'read'),
('usuarios.update', 'Modificar usuarios', 'usuarios', 'update'),
('usuarios.delete', 'Eliminar usuarios', 'usuarios', 'delete'),
('usuarios.manage_roles', 'Gestionar roles de usuarios', 'usuarios', 'manage'),

-- Permisos de menú
('menu.create', 'Crear elementos de menú', 'menu', 'create'),
('menu.read', 'Ver menú', 'menu', 'read'),
('menu.update', 'Modificar menú', 'menu', 'update'),
('menu.delete', 'Eliminar elementos de menú', 'menu', 'delete'),

-- Permisos de estadísticas
('estadisticas.read', 'Ver estadísticas', 'estadisticas', 'read'),
('estadisticas.export', 'Exportar reportes', 'estadisticas', 'export'),

-- Permisos de configuración
('configuracion.read', 'Ver configuración', 'configuracion', 'read'),
('configuracion.update', 'Modificar configuración', 'configuracion', 'update'),

-- Permisos de sistema
('sistema.backup', 'Realizar respaldos', 'sistema', 'backup'),
('sistema.maintenance', 'Modo mantenimiento', 'sistema', 'maintenance');

-- Insertar roles predefinidos
INSERT INTO roles (name, display_name, description, color) VALUES
('user', 'Usuario', 'Usuario estándar del sistema', '#10b981'),
('viewer', 'Visualizador', 'Solo puede ver información', '#6b7280'),
('moderator', 'Moderador', 'Puede gestionar pedidos y usuarios básicos', '#3b82f6'),
('admin', 'Administrador', 'Acceso completo excepto configuración crítica', '#f59e0b'),
('super_admin', 'Super Administrador', 'Acceso total al sistema', '#ef4444');

-- Asignar permisos a roles

-- Usuario: solo sus propios pedidos
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'user', id FROM permissions WHERE name IN (
  'pedidos.create', 'pedidos.read', 'menu.read'
);

-- Visualizador: solo lectura
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'viewer', id FROM permissions WHERE name IN (
  'pedidos.read', 'menu.read', 'usuarios.read', 'estadisticas.read'
);

-- Moderador: gestión básica
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'moderator', id FROM permissions WHERE name IN (
  'pedidos.create', 'pedidos.read', 'pedidos.update', 'pedidos.export',
  'menu.read', 'menu.update',
  'usuarios.read', 'usuarios.update',
  'estadisticas.read'
);

-- Administrador: casi todo
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'admin', id FROM permissions WHERE name NOT IN (
  'sistema.backup', 'sistema.maintenance', 'usuarios.manage_roles'
);

-- Super Admin: todo
INSERT INTO role_permissions (role_name, permission_id)
SELECT 'super_admin', id FROM permissions;

-- Funciones para verificar permisos
CREATE OR REPLACE FUNCTION user_has_permission(user_email TEXT, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM clientes c
    JOIN role_permissions rp ON c.role = rp.role_name
    JOIN permissions p ON rp.permission_id = p.id
    WHERE c.correo_apoderado = user_email 
    AND p.name = permission_name
    AND c.is_active = true
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener permisos de un usuario
CREATE OR REPLACE FUNCTION get_user_permissions(user_email TEXT)
RETURNS TABLE(permission_name TEXT, module TEXT, action TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.name, p.module, p.action
  FROM clientes c
  JOIN role_permissions rp ON c.role = rp.role_name
  JOIN permissions p ON rp.permission_id = p.id
  WHERE c.correo_apoderado = user_email
  AND c.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener información completa del rol
CREATE OR REPLACE FUNCTION get_user_role_info(user_email TEXT)
RETURNS TABLE(
  role_name user_role,
  display_name TEXT,
  description TEXT,
  color TEXT,
  permissions TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.name,
    r.display_name,
    r.description,
    r.color,
    ARRAY_AGG(p.name) as permissions
  FROM clientes c
  JOIN roles r ON c.role = r.name
  LEFT JOIN role_permissions rp ON r.name = rp.role_name
  LEFT JOIN permissions p ON rp.permission_id = p.id
  WHERE c.correo_apoderado = user_email
  AND c.is_active = true
  GROUP BY r.name, r.display_name, r.description, r.color;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar timestamp de rol
CREATE OR REPLACE FUNCTION update_role_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    NEW.role_assigned_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_role_timestamp
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_role_timestamp();

-- Políticas RLS actualizadas
DROP POLICY IF EXISTS "Users can view own data" ON clientes;
DROP POLICY IF EXISTS "Users can update own data" ON clientes;

-- Política para que usuarios vean solo sus datos
CREATE POLICY "Users can view own data" ON clientes
  FOR SELECT USING (
    correo_apoderado = auth.jwt() ->> 'email' OR
    user_has_permission(auth.jwt() ->> 'email', 'usuarios.read')
  );

-- Política para que usuarios actualicen solo sus datos
CREATE POLICY "Users can update own data" ON clientes
  FOR UPDATE USING (
    correo_apoderado = auth.jwt() ->> 'email' OR
    user_has_permission(auth.jwt() ->> 'email', 'usuarios.update')
  );

-- Política para crear usuarios (solo admins)
CREATE POLICY "Admins can create users" ON clientes
  FOR INSERT WITH CHECK (
    user_has_permission(auth.jwt() ->> 'email', 'usuarios.create')
  );

-- Política para eliminar usuarios (solo super admins)
CREATE POLICY "Super admins can delete users" ON clientes
  FOR DELETE USING (
    user_has_permission(auth.jwt() ->> 'email', 'usuarios.delete')
  );

-- Habilitar RLS en nuevas tablas
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas para las nuevas tablas
CREATE POLICY "Anyone can view permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Anyone can view roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Anyone can view role permissions" ON role_permissions FOR SELECT USING (true);

-- Solo super admins pueden modificar roles y permisos
CREATE POLICY "Super admins manage permissions" ON permissions
  FOR ALL USING (user_has_permission(auth.jwt() ->> 'email', 'usuarios.manage_roles'));

CREATE POLICY "Super admins manage roles" ON roles
  FOR ALL USING (user_has_permission(auth.jwt() ->> 'email', 'usuarios.manage_roles'));

CREATE POLICY "Super admins manage role permissions" ON role_permissions
  FOR ALL USING (user_has_permission(auth.jwt() ->> 'email', 'usuarios.manage_roles'));

-- Crear usuario super admin inicial
INSERT INTO clientes (correo_apoderado, nombre_apoderado, role, hijos, is_active, role_assigned_at)
VALUES ('admin@casino.cl', 'Super Administrador', 'super_admin', '[]'::jsonb, true, NOW())
ON CONFLICT (correo_apoderado) 
DO UPDATE SET 
  role = 'super_admin',
  role_assigned_at = NOW(),
  is_active = true;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_role ON clientes(role);
CREATE INDEX IF NOT EXISTS idx_clientes_active ON clientes(is_active);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_name);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);
