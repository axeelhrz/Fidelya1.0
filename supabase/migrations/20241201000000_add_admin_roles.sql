-- Crear tabla para roles de usuario
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Agregar columna de rol a la tabla clientes
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'user' CHECK (rol IN ('admin', 'super_admin', 'user'));

-- Crear función para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM clientes 
    WHERE correo_apoderado = user_email 
    AND rol IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para obtener el rol de un usuario
CREATE OR REPLACE FUNCTION get_user_role(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT rol INTO user_role 
  FROM clientes 
  WHERE correo_apoderado = user_email;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Habilitar RLS en user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política para que solo admins puedan ver roles
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clientes 
      WHERE correo_apoderado = auth.jwt() ->> 'email' 
      AND rol IN ('admin', 'super_admin')
    )
  );

-- Política para que solo super_admins puedan modificar roles
CREATE POLICY "Super admins can manage roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clientes 
      WHERE correo_apoderado = auth.jwt() ->> 'email' 
      AND rol = 'super_admin'
    )
  );

-- Insertar rol de admin para el usuario inicial (Pascal Letelier)
INSERT INTO clientes (correo_apoderado, nombre_apoderado, rol, hijos)
VALUES ('admin@casino.cl', 'Administrador Sistema', 'super_admin', '[]'::jsonb)
ON CONFLICT (correo_apoderado) 
DO UPDATE SET rol = 'super_admin';

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_rol ON clientes(rol);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
