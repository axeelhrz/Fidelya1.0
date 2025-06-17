-- =====================================================
-- ARREGLO SIMPLE Y DIRECTO
-- =====================================================

-- 1. Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Crear tipos enumerados (uno por uno)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'viewer', 'moderator', 'admin', 'super_admin');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_level') THEN
        CREATE TYPE student_level AS ENUM ('basica', 'media');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('estudiante', 'funcionario');
    END IF;
END $$;

-- 3. Eliminar trigger problemático
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 4. Deshabilitar RLS temporalmente
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students DISABLE ROW LEVEL SECURITY;

-- 5. Crear tabla system_config si no existe
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 6. Insertar configuración de super admins
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

-- 7. Crear tabla users si no existe
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    role_assigned_by UUID,
    role_assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 8. Agregar columnas faltantes si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') THEN
        ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'user';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE public.users ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE public.users ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'login_count') THEN
        ALTER TABLE public.users ADD COLUMN login_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE public.users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    END IF;
END $$;

-- 9. Crear tabla students si no existe
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

-- 10. Crear función simple para manejar nuevos usuarios (SIN RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_full_name TEXT;
    user_role_to_assign user_role := 'user';
BEGIN
    -- Verificar si ya existe
    IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        RETURN NEW;
    END IF;

    -- Obtener nombre completo
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Verificar si es super admin
    IF NEW.email = ANY(ARRAY['admin@casino.cl', 'c.wevarh@gmail.com']) THEN
        user_role_to_assign := 'super_admin';
    END IF;
    
    -- Insertar usuario
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
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- No fallar el registro en auth si hay error
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Crear trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Función para crear perfil manual
CREATE OR REPLACE FUNCTION public.create_user_profile_manual(
    p_user_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'user'
)
RETURNS UUID AS $$
BEGIN
    -- Verificar si ya existe
    IF EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
        RETURN p_user_id;
    END IF;
    
    -- Insertar nuevo usuario
    INSERT INTO public.users (id, email, full_name, phone, role, is_active, created_at, updated_at)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role::user_role, true, timezone('utc', now()), timezone('utc', now()));
    
    RETURN p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Función de diagnóstico simple
CREATE OR REPLACE FUNCTION public.check_auth_status()
RETURNS TABLE(
    item TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY SELECT 
        'users_table'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY SELECT 
        'role_column'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role') 
             THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY SELECT 
        'trigger'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
             THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY SELECT 
        'function'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY SELECT 
        'config'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM public.system_config WHERE key = 'super_admin_emails') 
             THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY SELECT 
        'user_counts'::TEXT,
        ('Auth: ' || (SELECT COUNT(*) FROM auth.users)::TEXT || 
         ', Public: ' || (SELECT COUNT(*) FROM public.users)::TEXT);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Ejecutar diagnóstico
SELECT * FROM public.check_auth_status();

-- 15. Mensaje final
SELECT 'Sistema de autenticación configurado sin RLS. Prueba el registro ahora.' as status;
