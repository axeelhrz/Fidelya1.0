-- =====================================================
-- FIX ALL REFERENCES TO CLIENTES TABLE
-- =====================================================

-- First, drop any existing tables that reference clientes
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;

-- Drop any functions that reference clientes
DROP FUNCTION IF EXISTS public.is_admin(TEXT);
DROP FUNCTION IF EXISTS public.get_user_role(TEXT);
DROP FUNCTION IF EXISTS public.user_has_permission(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.get_user_permissions(TEXT);
DROP FUNCTION IF EXISTS public.get_user_role_info(TEXT);
DROP FUNCTION IF EXISTS public.update_role_timestamp();

-- Ensure users table exists with correct structure
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

-- Recreate all functions to use users table instead of clientes
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE email = user_email 
        AND role IN ('admin', 'super_admin')
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role(user_email TEXT)
RETURNS user_role AS $$
DECLARE
    user_role_result user_role;
BEGIN
    SELECT role INTO user_role_result 
    FROM public.users 
    WHERE email = user_email
    AND is_active = true;
    
    RETURN COALESCE(user_role_result, 'user'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_has_permission(user_email TEXT, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM public.users u
        JOIN public.role_permissions rp ON u.role = rp.role_name
        JOIN public.permissions p ON rp.permission_id = p.id
        WHERE u.email = user_email 
        AND p.name = permission_name
        AND u.is_active = true
    ) INTO has_perm;
    
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_email TEXT)
RETURNS TABLE(permission_name TEXT, module TEXT, action TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT p.name, p.module, p.action
    FROM public.users u
    JOIN public.role_permissions rp ON u.role = rp.role_name
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE u.email = user_email
    AND u.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role_info(user_email TEXT)
RETURNS TABLE(
    role_name user_role,
    display_name TEXT,
    description TEXT,
    color TEXT,
    permissions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.name,
        r.display_name,
        r.description,
        r.color,
        ARRAY_AGG(p.name) as permissions
    FROM public.users u
    JOIN public.roles r ON u.role = r.name
    LEFT JOIN public.role_permissions rp ON r.name = rp.role_name
    LEFT JOIN public.permissions p ON rp.permission_id = p.id
    WHERE u.email = user_email
    AND u.is_active = true
    GROUP BY r.name, r.display_name, r.description, r.color;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate create_user_profile function
CREATE OR REPLACE FUNCTION public.create_user_profile(
    p_user_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_role user_role DEFAULT 'user'
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
    is_super_admin BOOLEAN := FALSE;
    super_admin_emails JSONB;
BEGIN
    -- Check if this email is in the super admin list
    BEGIN
        SELECT value INTO super_admin_emails 
        FROM public.system_config 
        WHERE key = 'super_admin_emails';
        
        IF super_admin_emails IS NOT NULL THEN
            IF super_admin_emails ? p_email THEN
                is_super_admin := TRUE;
                p_role := 'super_admin';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            NULL;
    END;
    
    -- Insert the user profile
    INSERT INTO public.users (id, email, full_name, phone, role, is_active)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role, true)
    RETURNING id INTO user_id;
    
    -- Log the activity if possible
    BEGIN
        IF user_id IS NOT NULL AND EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs') THEN
            INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
            VALUES (
                user_id, 
                'user_created', 
                'user', 
                user_id, 
                jsonb_build_object('email', p_email, 'role', p_role, 'is_super_admin', is_super_admin)
            );
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            NULL;
    END;
    
    RETURN user_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error creating user profile for %: %', p_email, SQLERRM;
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to functions
GRANT EXECUTE ON FUNCTION public.is_admin(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.user_has_permission(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_role_info(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT, user_role) TO authenticated, anon;

-- Drop all existing policies on users table
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.users';
    END LOOP;
END $$;

-- Create simple policies for users table
CREATE POLICY "users_insert_registration" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
            AND u.is_active = true
        )
    );

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
            AND u.is_active = true
        )
    );

-- Update RLS policies for other tables that might reference clientes
-- Drop and recreate policies that reference clientes

-- For permissions table
DROP POLICY IF EXISTS "Super admins manage permissions" ON public.permissions;
CREATE POLICY "super_admins_manage_permissions" ON public.permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'super_admin'
            AND u.is_active = true
        )
    );

-- For roles table  
DROP POLICY IF EXISTS "Super admins manage roles" ON public.roles;
CREATE POLICY "super_admins_manage_roles" ON public.roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'super_admin'
            AND u.is_active = true
        )
    );

-- For role_permissions table
DROP POLICY IF EXISTS "Super admins manage role permissions" ON public.role_permissions;
CREATE POLICY "super_admins_manage_role_permissions" ON public.role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'super_admin'
            AND u.is_active = true
        )
    );

-- Create initial super admin user if it doesn't exist
INSERT INTO public.users (id, email, full_name, role, is_active, role_assigned_at)
SELECT 
    gen_random_uuid(),
    'admin@casino.cl',
    'Super Administrador',
    'super_admin'::user_role,
    true,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'admin@casino.cl'
);

-- Also add c.wevarh@gmail.com as super admin
INSERT INTO public.users (id, email, full_name, role, is_active, role_assigned_at)
SELECT 
    gen_random_uuid(),
    'c.wevarh@gmail.com',
    'Super Administrador',
    'super_admin'::user_role,
    true,
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'c.wevarh@gmail.com'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);
