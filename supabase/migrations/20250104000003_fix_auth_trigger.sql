-- =====================================================
-- ARREGLAR TRIGGER DE AUTENTICACIÓN
-- =====================================================

-- Eliminar trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear una función más simple y robusta para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    is_super_admin BOOLEAN := FALSE;
    user_role_to_assign user_role := 'user';
BEGIN
    -- Verificar si ya existe el usuario en public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        RETURN NEW;
    END IF;

    -- Obtener la lista de emails de super admin de forma segura
    BEGIN
        SELECT value INTO super_admin_emails
        FROM public.system_config
        WHERE key = 'super_admin_emails';
        
        -- Verificar si el email está en la lista de super admins
        IF super_admin_emails IS NOT NULL AND super_admin_emails ? NEW.email THEN
            is_super_admin := TRUE;
            user_role_to_assign := 'super_admin';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Si hay error al obtener la configuración, continuar con rol user
        is_super_admin := FALSE;
        user_role_to_assign := 'user';
    END;
    
    -- Crear perfil de usuario automáticamente
    BEGIN
        INSERT INTO public.users (
            id, 
            email, 
            full_name, 
            role,
            is_active
        ) VALUES (
            NEW.id,
            NEW.email,
            COALESCE(
                NEW.raw_user_meta_data->>'full_name', 
                NEW.raw_user_meta_data->>'name',
                split_part(NEW.email, '@', 1)
            ),
            user_role_to_assign,
            true
        );
        
        -- Registrar actividad de forma segura
        BEGIN
            PERFORM public.log_activity(
                NEW.id, 
                'user_registered', 
                'user', 
                NEW.id, 
                jsonb_build_object(
                    'email', NEW.email, 
                    'role', user_role_to_assign,
                    'auto_assigned', is_super_admin
                )
            );
        EXCEPTION WHEN OTHERS THEN
            -- Si falla el log, continuar sin error
            NULL;
        END;
        
    EXCEPTION WHEN OTHERS THEN
        -- Si falla la inserción, registrar el error pero no fallar el trigger
        RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar que la configuración de super admins existe
INSERT INTO public.system_config (key, value, description, is_public) 
VALUES ('super_admin_emails', '["admin@casino.cl", "c.wevarh@gmail.com"]', 'Emails de super administradores', false)
ON CONFLICT (key) DO NOTHING;

-- Mensaje de confirmación
SELECT 'Trigger de autenticación arreglado' as status;
