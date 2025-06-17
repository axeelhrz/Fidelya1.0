-- =====================================================
-- SETUP COMPLETO DE LA BASE DE DATOS
-- =====================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tipos ENUM
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'viewer', 'moderator', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('estudiante', 'funcionario');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE student_level AS ENUM ('basica', 'media');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE menu_category AS ENUM ('almuerzo', 'colacion');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'paid', 'cancelled', 'delivered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER NOT NULL DEFAULT 0,
    role_assigned_by UUID REFERENCES public.users(id),
    role_assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 4. Crear tabla de estudiantes
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    level student_level NOT NULL,
    user_type user_type NOT NULL DEFAULT 'estudiante',
    rut TEXT,
    dietary_restrictions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. Crear tabla de items de menú
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category menu_category NOT NULL,
    price_student DECIMAL(10,2) NOT NULL,
    price_staff DECIMAL(10,2) NOT NULL,
    available_date DATE NOT NULL,
    day_name TEXT NOT NULL,
    day_type TEXT NOT NULL,
    code TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    max_orders INTEGER,
    current_orders INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 6. Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    delivery_date DATE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    transaction_id TEXT,
    payment_method TEXT,
    payment_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 7. Crear tabla de transacciones de pago
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id TEXT NOT NULL UNIQUE,
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'CLP',
    payment_method TEXT,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    gateway_response JSONB,
    gateway_transaction_id TEXT,
    payment_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 8. Crear tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 9. Insertar configuración inicial
INSERT INTO public.system_config (key, value, description, is_public) 
VALUES 
    ('super_admin_emails', '["admin@casino.cl", "c.wevarh@gmail.com"]', 'Emails que automáticamente reciben rol super_admin', false),
    ('app_name', '"Casino Escolar"', 'Nombre de la aplicación', true),
    ('currency', '"CLP"', 'Moneda utilizada', true),
    ('max_orders_per_day', '100', 'Máximo de pedidos por día', true)
ON CONFLICT (key) DO NOTHING;

-- 10. Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- 11. Crear políticas RLS para users
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 12. Crear políticas RLS para students
DROP POLICY IF EXISTS "Users can view their own students" ON public.students;
CREATE POLICY "Users can view their own students" ON public.students
    FOR SELECT USING (auth.uid() = guardian_id);

DROP POLICY IF EXISTS "Users can create students" ON public.students;
CREATE POLICY "Users can create students" ON public.students
    FOR INSERT WITH CHECK (auth.uid() = guardian_id);

DROP POLICY IF EXISTS "Users can update their own students" ON public.students;
CREATE POLICY "Users can update their own students" ON public.students
    FOR UPDATE USING (auth.uid() = guardian_id);

-- 13. Crear políticas RLS para menu_items
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
CREATE POLICY "Anyone can view menu items" ON public.menu_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify menu items" ON public.menu_items;
CREATE POLICY "Only admins can modify menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- 14. Crear políticas RLS para orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = guardian_id);

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = guardian_id);

DROP POLICY IF EXISTS "Users can update their own pending orders" ON public.orders;
CREATE POLICY "Users can update their own pending orders" ON public.orders
    FOR UPDATE USING (
        auth.uid() = guardian_id AND 
        status = 'pending' AND
        delivery_date > CURRENT_DATE
    );

-- 15. Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_full_name TEXT;
    user_role_to_assign user_role := 'user';
    super_admin_emails TEXT[];
BEGIN
    -- Verificar si ya existe
    IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        RETURN NEW;
    END IF;

    -- Obtener emails de super admin
    SELECT value::jsonb INTO super_admin_emails 
    FROM public.system_config 
    WHERE key = 'super_admin_emails';
    
    IF super_admin_emails IS NULL THEN
        super_admin_emails := ARRAY['admin@casino.cl', 'c.wevarh@gmail.com'];
    END IF;

    -- Obtener nombre completo
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Verificar si es super admin
    IF NEW.email = ANY(super_admin_emails) THEN
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
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Crear trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Crear función de diagnóstico
CREATE OR REPLACE FUNCTION public.diagnose_auth_system()
RETURNS TABLE(
    component TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    RETURN QUERY SELECT 
        'users_table'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Public users table'::TEXT;
    
    RETURN QUERY SELECT 
        'trigger'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
             THEN 'OK' ELSE 'MISSING' END,
        'Auth user creation trigger'::TEXT;
    
    RETURN QUERY SELECT 
        'user_counts'::TEXT,
        'INFO'::TEXT,
        ('Auth users: ' || (SELECT COUNT(*) FROM auth.users)::TEXT || 
         ', Public users: ' || (SELECT COUNT(*) FROM public.users)::TEXT)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Mensaje final
SELECT 'Base de datos configurada exitosamente' as status;
