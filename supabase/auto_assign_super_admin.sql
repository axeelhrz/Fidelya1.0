-- =====================================================
-- TRIGGER AUTOMÁTICO PARA ASIGNAR ROL SUPER ADMIN
-- =====================================================

-- Función que se ejecuta cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    user_role user_role := 'user';
BEGIN
    -- Obtener la lista de emails de super admin
    SELECT value INTO super_admin_emails
    FROM public.system_config
    WHERE key = 'super_admin_emails';
    
    -- Verificar si el email del nuevo usuario está en la lista de super admins
    IF super_admin_emails ? NEW.email THEN
        user_role := 'super_admin';
    END IF;
    
    -- Crear el perfil del usuario en public.users
    INSERT INTO public.users (
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        user_role,
        true,
        NOW(),
        NOW()
    );
    
    -- Registrar la actividad
    PERFORM public.log_activity(
        NEW.id,
        'user_registered',
        'user',
        NEW.id,
        jsonb_build_object(
            'email', NEW.email,
            'role', user_role,
            'auto_assigned', true
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger que se ejecuta cuando se inserta un nuevo usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar que el trigger se creó correctamente
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
