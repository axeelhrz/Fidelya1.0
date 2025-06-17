-- =====================================================
-- ACTUALIZAR CONFIGURACIÓN DE SUPER ADMIN
-- =====================================================

-- 1. Actualizar la configuración para incluir admin@casino.cl
UPDATE public.system_config 
SET value = '["admin@casino.cl", "c.wevarh@gmail.com"]'
WHERE key = 'super_admin_emails';

-- 2. Verificar la actualización
SELECT key, value, description 
FROM public.system_config 
WHERE key = 'super_admin_emails';

-- 3. Crear función para verificar si un email es super admin
CREATE OR REPLACE FUNCTION public.is_super_admin_email(email_to_check TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    super_admin_emails JSONB;
    email_exists BOOLEAN := FALSE;
BEGIN
    -- Obtener la lista de emails de super admin
    SELECT value INTO super_admin_emails
    FROM public.system_config
    WHERE key = 'super_admin_emails';
    
    -- Verificar si el email está en la lista
    SELECT super_admin_emails ? email_to_check INTO email_exists;
    
    RETURN email_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Verificar que admin@casino.cl ahora es reconocido como super admin
SELECT public.is_super_admin_email('admin@casino.cl') as is_admin_super_admin;
SELECT public.is_super_admin_email('c.wevarh@gmail.com') as is_original_super_admin;

-- 5. Si el usuario admin@casino.cl ya existe en auth.users pero no en public.users,
-- necesitamos crear su perfil. Primero verificamos:
SELECT 
    au.email,
    pu.email as profile_email,
    pu.role
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = 'admin@casino.cl';
