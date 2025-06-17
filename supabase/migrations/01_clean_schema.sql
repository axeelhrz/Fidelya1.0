-- =====================================================
-- ESQUEMA LIMPIO CASINO ESCOLAR
-- =====================================================

-- Crear extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos enumerados
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE student_level AS ENUM ('basica', 'media');
CREATE TYPE user_type AS ENUM ('estudiante', 'funcionario');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'paid', 'cancelled', 'delivered');
CREATE TYPE menu_category AS ENUM ('almuerzo', 'colacion');

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE ESTUDIANTES
-- =====================================================
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    level student_level NOT NULL,
    user_type user_type NOT NULL,
    rut TEXT,
    dietary_restrictions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_student_per_guardian UNIQUE(guardian_id, name, grade, section)
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =====================================================
CREATE TABLE public.system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración de super admins
INSERT INTO public.system_config (key, value, description) VALUES 
('super_admin_emails', '["c.wevarh@gmail.com"]', 'Lista de emails que son super administradores');

-- =====================================================
-- FUNCIÓN PARA MANEJAR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FUNCIÓN SIMPLE PARA CREAR USUARIOS
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    is_super_admin BOOLEAN := FALSE;
    user_role_to_assign user_role := 'user';
    user_full_name TEXT;
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
    SELECT value INTO super_admin_emails
    FROM public.system_config
    WHERE key = 'super_admin_emails';
    
    IF super_admin_emails ? NEW.email THEN
        user_role_to_assign := 'super_admin';
    END IF;

    -- Crear perfil de usuario
    INSERT INTO public.users (
        id,
        email,
        full_name,
        phone,
        role,
        is_active
    ) VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        user_role_to_assign,
        true
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Si hay error, continuar sin fallar
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCIÓN PARA ACTUALIZAR ÚLTIMO LOGIN
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_last_login(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users 
    SET 
        last_login = NOW(),
        login_count = COALESCE(login_count, 0) + 1
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POLÍTICAS RLS SIMPLES
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Políticas para students
CREATE POLICY "Users can manage own students" ON public.students
    FOR ALL USING (guardian_id = auth.uid());

CREATE POLICY "Admins can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

SELECT 'Esquema limpio creado exitosamente' as status;
