-- =====================================================
-- ARREGLAR TRIGGER Y POLÍTICAS
-- =====================================================

-- Eliminar trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Crear función mejorada para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    is_super_admin BOOLEAN := FALSE;
    user_role_to_assign TEXT := 'user';
    user_full_name TEXT;
BEGIN
    -- Log para debugging
    RAISE LOG 'Trigger ejecutado para usuario: %', NEW.email;
    
    -- Verificar si ya existe el usuario en public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        RAISE LOG 'Usuario ya existe en public.users: %', NEW.email;
        RETURN NEW;
    END IF;

    -- Obtener nombre completo
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Obtener la lista de emails de super admin de forma segura
    BEGIN
        SELECT value INTO super_admin_emails
        FROM public.system_config
        WHERE key = 'super_admin_emails';
        
        -- Verificar si el email está en la lista de super admins
        IF super_admin_emails IS NOT NULL AND (super_admin_emails ? NEW.email) THEN
            is_super_admin := TRUE;
            user_role_to_assign := 'super_admin';
            RAISE LOG 'Usuario identificado como super admin: %', NEW.email;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Si hay error al obtener la configuración, continuar con rol user
        RAISE LOG 'Error al obtener configuración de super admins: %', SQLERRM;
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
            is_active,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            user_full_name,
            user_role_to_assign::user_role,
            true,
            NOW(),
            NOW()
        );
        
        RAISE LOG 'Usuario creado en public.users: % con rol %', NEW.email, user_role_to_assign;
        
    EXCEPTION WHEN OTHERS THEN
        -- Si falla la inserción, registrar el error
        RAISE LOG 'Error al crear perfil de usuario para %: %', NEW.email, SQLERRM;
        RAISE EXCEPTION 'Error al crear perfil de usuario: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Asegurar que las políticas RLS permitan la inserción automática
-- Política temporal para permitir inserción desde el trigger
CREATE POLICY "allow_trigger_insert" ON public.users
    FOR INSERT WITH CHECK (true);

-- Verificar que la configuración de super admins existe
INSERT INTO public.system_config (key, value, description, is_public) 
VALUES ('super_admin_emails', '["admin@casino.cl", "c.wevarh@gmail.com"]', 'Emails de super administradores', false)
ON CONFLICT (key) DO NOTHING;

-- Función para crear perfil manualmente (backup)
CREATE OR REPLACE FUNCTION public.create_user_profile_manual(
    p_user_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'user'
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Verificar si ya existe
    IF EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
        RETURN p_user_id;
    END IF;
    
    INSERT INTO public.users (id, email, full_name, phone, role, is_active)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role::user_role, true)
    RETURNING id INTO user_id;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensaje de confirmación
SELECT 'Trigger y políticas arreglados' as status;
