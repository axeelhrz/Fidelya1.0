-- =====================================================
-- ARREGLAR ESTRUCTURA DE LA TABLA USERS
-- =====================================================

-- 1. Verificar estructura actual de la tabla users
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Verificar si la columna role existe
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'role'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        RAISE NOTICE 'La columna role no existe, será creada';
    ELSE
        RAISE NOTICE 'La columna role ya existe';
    END IF;
END $$;

-- 2. Crear tipos enumerados si no existen
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'viewer', 'moderator', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'paid', 'cancelled', 'delivered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE menu_category AS ENUM ('almuerzo', 'colacion');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE student_level AS ENUM ('basica', 'media');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('estudiante', 'funcionario');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear tabla users con estructura completa si no existe
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    role_assigned_by UUID REFERENCES public.users(id),
    role_assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 4. Agregar columnas faltantes si no existen
DO $$
BEGIN
    -- Agregar columna role si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'user';
        RAISE NOTICE 'Columna role agregada';
    END IF;
    
    -- Agregar columna is_active si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Columna is_active agregada';
    END IF;
    
    -- Agregar columna last_login si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE public.users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Columna last_login agregada';
    END IF;
    
    -- Agregar columna login_count si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'login_count') THEN
        ALTER TABLE public.users ADD COLUMN login_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Columna login_count agregada';
    END IF;
    
    -- Agregar columna role_assigned_by si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role_assigned_by') THEN
        ALTER TABLE public.users ADD COLUMN role_assigned_by UUID REFERENCES public.users(id);
        RAISE NOTICE 'Columna role_assigned_by agregada';
    END IF;
    
    -- Agregar columna role_assigned_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role_assigned_at') THEN
        ALTER TABLE public.users ADD COLUMN role_assigned_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Columna role_assigned_at agregada';
    END IF;
    
    -- Agregar columna created_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE public.users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
        RAISE NOTICE 'Columna created_at agregada';
    END IF;
    
    -- Agregar columna updated_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
        RAISE NOTICE 'Columna updated_at agregada';
    END IF;
END $$;

-- 5. Crear tabla students si no existe
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    level student_level NOT NULL,
    user_type user_type DEFAULT 'estudiante',
    rut TEXT,
    dietary_restrictions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT unique_student_per_guardian UNIQUE(guardian_id, name, grade, section)
);

-- 6. Crear tabla system_config si no existe
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 7. Insertar configuración inicial
INSERT INTO public.system_config (key, value, description, is_public) 
VALUES (
    'super_admin_emails', 
    '["admin@casino.cl", "c.wevarh@gmail.com"]', 
    'Emails de super administradores', 
    false
)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = timezone('utc', now());

-- 8. Crear función para manejar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Crear triggers para updated_at
DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_students_updated_at ON public.students;
CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Eliminar trigger y función existentes problemáticos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 11. Crear función mejorada para manejar nuevos usuarios
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
            timezone('utc', now()),
            timezone('utc', now())
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

-- 12. Crear el trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. Configurar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 14. Eliminar políticas existentes
DROP POLICY IF EXISTS "allow_trigger_insert" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_insert_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "allow_system_insert" ON public.users;
DROP POLICY IF EXISTS "admin_all_access" ON public.users;

-- 15. Crear políticas RLS más permisivas
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "users_insert_policy" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update_policy" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    );

-- 16. Políticas para students
DROP POLICY IF EXISTS "students_select_policy" ON public.students;
DROP POLICY IF EXISTS "students_insert_policy" ON public.students;
DROP POLICY IF EXISTS "students_update_policy" ON public.students;

CREATE POLICY "students_select_policy" ON public.students
    FOR SELECT USING (
        guardian_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    );

CREATE POLICY "students_insert_policy" ON public.students
    FOR INSERT WITH CHECK (
        guardian_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    );

CREATE POLICY "students_update_policy" ON public.students
    FOR UPDATE USING (
        guardian_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
            AND is_active = true
        )
    );

-- 17. Función para crear perfiles manualmente
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
    INSERT INTO public.users (id, email, full_name, phone, role, is_active, created_at, updated_at)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role::user_role, true, timezone('utc', now()), timezone('utc', now()))
    RETURNING id INTO user_id;
    
    RAISE LOG 'Usuario creado manualmente: %', p_email;
    RETURN user_id;
    
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error en create_user_profile_manual para %: %', p_email, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Función de diagnóstico
CREATE OR REPLACE FUNCTION public.diagnose_auth_system()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Verificar tabla users
    RETURN QUERY SELECT 
        'users_table'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Tabla public.users'::TEXT;
    
    -- Verificar columna role
    RETURN QUERY SELECT 
        'role_column'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') 
             THEN 'OK' ELSE 'MISSING' END,
        'Columna role en users'::TEXT;
    
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
    
    -- Contar usuarios
    RETURN QUERY SELECT 
        'user_counts'::TEXT,
        'INFO'::TEXT,
        ('Auth users: ' || (SELECT COUNT(*) FROM auth.users)::TEXT || 
         ', Public users: ' || (SELECT COUNT(*) FROM public.users)::TEXT)::TEXT;
         
    -- Mostrar estructura de la tabla users
    RETURN QUERY SELECT 
        'users_columns'::TEXT,
        'INFO'::TEXT,
        (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position) 
         FROM information_schema.columns 
         WHERE table_schema = 'public' AND table_name = 'users')::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 19. Ejecutar diagnóstico
SELECT * FROM public.diagnose_auth_system();

-- 20. Mensaje de confirmación
SELECT 'Estructura de tablas y sistema de autenticación completamente reparado' as status;
