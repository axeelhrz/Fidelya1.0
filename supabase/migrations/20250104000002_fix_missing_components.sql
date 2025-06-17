-- =====================================================
-- ARREGLAR COMPONENTES FALTANTES
-- =====================================================

-- Verificar y crear funciones que puedan faltar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    is_super_admin BOOLEAN := FALSE;
BEGIN
    -- Obtener la lista de emails de super admin
    SELECT value INTO super_admin_emails
    FROM public.system_config
    WHERE key = 'super_admin_emails';
    
    -- Verificar si el email está en la lista de super admins
    IF super_admin_emails ? NEW.email THEN
        is_super_admin := TRUE;
    END IF;
    
    -- Crear perfil de usuario automáticamente solo si no existe
    INSERT INTO public.users (
        id, 
        email, 
        full_name, 
        role,
        is_active
    ) 
    SELECT 
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE WHEN is_super_admin THEN 'super_admin'::user_role ELSE 'user'::user_role END,
        true
    WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id);
    
    -- Registrar actividad solo si se creó el usuario
    IF FOUND THEN
        PERFORM public.log_activity(
            NEW.id, 
            'user_registered', 
            'user', 
            NEW.id, 
            jsonb_build_object(
                'email', NEW.email, 
                'role', CASE WHEN is_super_admin THEN 'super_admin' ELSE 'user' END,
                'auto_assigned', is_super_admin
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para nuevos usuarios (solo si no existe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para verificar si un email es super admin
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

-- Verificar si existe el usuario admin y crear perfil si es necesario
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'c.wevarh@gmail.com';
BEGIN
    -- Buscar si existe el usuario en auth.users
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    -- Si existe en auth pero no en public.users, crear el perfil
    IF admin_user_id IS NOT NULL THEN
        -- Verificar si ya existe en public.users
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = admin_user_id) THEN
            -- Crear perfil de super admin
            INSERT INTO public.users (
                id,
                email,
                full_name,
                role,
                is_active
            ) VALUES (
                admin_user_id,
                admin_email,
                'Administrador Sistema',
                'super_admin',
                true
            );
            
            RAISE NOTICE 'Perfil de super admin creado para: %', admin_email;
        ELSE
            -- Actualizar rol si ya existe
            UPDATE public.users 
            SET role = 'super_admin', is_active = true
            WHERE id = admin_user_id;
            
            RAISE NOTICE 'Rol actualizado a super_admin para: %', admin_email;
        END IF;
    ELSE
        RAISE NOTICE 'Usuario % no encontrado en auth.users', admin_email;
    END IF;
END $$;

-- Mensaje de confirmación
SELECT 'Componentes faltantes agregados exitosamente' as status;