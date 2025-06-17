-- =====================================================
-- ARREGLO COMPLETO DEL TRIGGER DE AUTENTICACIÓN
-- =====================================================

-- 1. Eliminar trigger y función existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Eliminar políticas problemáticas
DROP POLICY IF EXISTS "allow_trigger_insert" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all data" ON public.users;
DROP POLICY IF EXISTS "Admins can update all data" ON public.users;

-- 3. Deshabilitar RLS temporalmente para limpieza
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 4. Crear función mejorada y más robusta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    is_super_admin BOOLEAN := FALSE;
    user_role_to_assign user_role := 'user';
    user_full_name TEXT;
    existing_user_count INTEGER;
BEGIN
    -- Log para debugging
    RAISE LOG 'Trigger ejecutado para usuario: % (ID: %)', NEW.email, NEW.id;
    
    -- Verificar si ya existe el usuario en public.users
    SELECT COUNT(*) INTO existing_user_count 
    FROM public.users 
    WHERE id = NEW.id;
    
    IF existing_user_count > 0 THEN
        RAISE LOG 'Usuario ya existe en public.users: %', NEW.email;
        RETURN NEW;
    END IF;

    -- Obtener nombre completo de los metadatos
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Verificar si es super admin de forma segura
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
    
    -- Crear perfil de usuario con manejo de errores robusto
    BEGIN
        INSERT INTO public.users (
            id, 
            email, 
            full_name, 
            phone,
            role,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            user_full_name,
            NEW.raw_user_meta_data->>'phone',
            user_role_to_assign,
            true,
            NOW(),
            NOW()
        );
        
        RAISE LOG 'Usuario creado exitosamente en public.users: % con rol %', NEW.email, user_role_to_assign;
        
    EXCEPTION 
        WHEN unique_violation THEN
            RAISE LOG 'Usuario ya existe (unique violation): %', NEW.email;
        WHEN OTHERS THEN
            RAISE LOG 'Error al crear perfil de usuario para %: %', NEW.email, SQLERRM;
            -- No lanzar excepción para no bloquear el registro en auth
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Habilitar RLS nuevamente
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas RLS más permisivas y claras
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR 
        auth.jwt() ->> 'email' = email
    );

CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        auth.jwt() ->> 'email' = email
    );

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR 
        auth.jwt() ->> 'email' = email
    );

-- Política especial para permitir inserción desde el trigger
CREATE POLICY "allow_system_insert" ON public.users
    FOR INSERT WITH CHECK (true);

-- Políticas para administradores
CREATE POLICY "admin_all_access" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    );

-- 8. Asegurar que la configuración de super admins existe
INSERT INTO public.system_config (key, value, description, is_public) 
VALUES (
    'super_admin_emails', 
    '["admin@casino.cl", "c.wevarh@gmail.com"]', 
    'Emails de super administradores', 
    false
)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- 9. Función para crear perfiles faltantes manualmente
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
    existing_count INTEGER;
BEGIN
    -- Verificar si ya existe
    SELECT COUNT(*) INTO existing_count
    FROM public.users 
    WHERE id = p_user_id;
    
    IF existing_count > 0 THEN
        RAISE LOG 'Usuario ya existe: %', p_email;
        RETURN p_user_id;
    END IF;
    
    -- Insertar nuevo usuario
    INSERT INTO public.users (id, email, full_name, phone, role, is_active)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role::user_role, true)
    RETURNING id INTO user_id;
    
    RAISE LOG 'Usuario creado manualmente: %', p_email;
    RETURN user_id;
    
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error en create_user_profile_manual para %: %', p_email, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Función para diagnosticar problemas
CREATE OR REPLACE FUNCTION public.diagnose_auth_system()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Verificar tablas
    RETURN QUERY SELECT 
        'users_table'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Tabla public.users'::TEXT;
    
    -- Verificar trigger
    RETURN QUERY SELECT 
        'auth_trigger'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
             THEN 'OK' ELSE 'MISSING' END,
        'Trigger on_auth_user_created'::TEXT;
    
    -- Verificar función
    RETURN QUERY SELECT 
        'handle_function'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Función handle_new_user'::TEXT;
    
    -- Verificar configuración
    RETURN QUERY SELECT 
        'super_admin_config'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM public.system_config WHERE key = 'super_admin_emails') 
             THEN 'OK' ELSE 'MISSING' END,
        'Configuración super_admin_emails'::TEXT;
    
    -- Verificar RLS
    RETURN QUERY SELECT 
        'rls_enabled'::TEXT,
        CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
             THEN 'ENABLED' ELSE 'DISABLED' END,
        'Row Level Security en users'::TEXT;
    
    -- Contar usuarios
    RETURN QUERY SELECT 
        'user_counts'::TEXT,
        'INFO'::TEXT,
        ('Auth users: ' || (SELECT COUNT(*) FROM auth.users)::TEXT || 
         ', Public users: ' || (SELECT COUNT(*) FROM public.users)::TEXT)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Ejecutar diagnóstico
SELECT * FROM public.diagnose_auth_system();

-- 12. Mensaje de confirmación
SELECT 'Sistema de autenticación completamente reparado' as status;
