-- =====================================================
-- FIX TABLE REFERENCES AND ENSURE CORRECT SCHEMA
-- =====================================================

-- First, let's check if clientes table exists and migrate data if needed
DO $$
BEGIN
    -- Check if clientes table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') THEN
        -- Migrate data from clientes to users if users table exists but is empty
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
            -- Check if users table is empty
            IF NOT EXISTS (SELECT 1 FROM public.users LIMIT 1) THEN
                -- Migrate data from clientes to users
                INSERT INTO public.users (id, email, full_name, phone, role, is_active, created_at, updated_at)
                SELECT 
                    user_id as id,
                    correo_apoderado as email,
                    nombre_apoderado as full_name,
                    telefono as phone,
                    CASE 
                        WHEN rol = 'super_admin' THEN 'super_admin'::user_role
                        WHEN rol = 'admin' THEN 'admin'::user_role
                        ELSE 'user'::user_role
                    END as role,
                    is_active,
                    created_at,
                    updated_at
                FROM public.clientes
                WHERE user_id IS NOT NULL;
                
                RAISE NOTICE 'Migrated data from clientes to users table';
            END IF;
        END IF;
        
        -- Drop clientes table after migration
        DROP TABLE IF EXISTS public.clientes CASCADE;
        RAISE NOTICE 'Dropped clientes table';
    END IF;
END $$;

-- Ensure all functions reference the correct tables
-- Update any functions that might reference clientes

-- Drop and recreate functions that might reference old table names
DROP FUNCTION IF EXISTS public.is_admin(TEXT);
DROP FUNCTION IF EXISTS public.get_user_role(TEXT);

-- Recreate is_admin function to use users table
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

-- Recreate get_user_role function to use users table
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(TEXT) TO anon;

-- Ensure the create_user_profile function works correctly
DROP FUNCTION IF EXISTS public.create_user_profile(UUID, TEXT, TEXT, TEXT, user_role);

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
            -- Check if email is in the super admin list
            IF super_admin_emails ? p_email THEN
                is_super_admin := TRUE;
                p_role := 'super_admin';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- If system_config doesn't exist or has issues, continue with default role
            NULL;
    END;
    
    -- Insert the user profile
    INSERT INTO public.users (id, email, full_name, phone, role, is_active)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role, true)
    RETURNING id INTO user_id;
    
    -- Log the activity (only if user was created successfully and activity_logs table exists)
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
            -- If activity logging fails, don't fail the user creation
            NULL;
    END;
    
    RETURN user_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error for debugging
        RAISE LOG 'Error creating user profile for %: %', p_email, SQLERRM;
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT, user_role) TO anon;

-- Ensure RLS policies are correctly set for users table
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "users_insert_self_or_admin" ON public.users;
DROP POLICY IF EXISTS "users_select_own_or_admin" ON public.users;
DROP POLICY IF EXISTS "users_update_own_or_admin" ON public.users;

-- Create simplified policies for registration
CREATE POLICY "users_insert_during_registration" ON public.users
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

-- Ensure students table policies work with users table
DROP POLICY IF EXISTS "students_insert_own_or_admin" ON public.students;
DROP POLICY IF EXISTS "students_select_own" ON public.students;
DROP POLICY IF EXISTS "students_update_own" ON public.students;

CREATE POLICY "students_insert_own" ON public.students
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id
    );

CREATE POLICY "students_select_own" ON public.students
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
            AND u.is_active = true
        )
    );

CREATE POLICY "students_update_own" ON public.students
    FOR UPDATE USING (
        auth.uid() = guardian_id OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role IN ('admin', 'super_admin')
            AND u.is_active = true
        )
    );

-- Ensure system_config is accessible for super admin check
DROP POLICY IF EXISTS "system_config_select_public_or_registration" ON public.system_config;

CREATE POLICY "system_config_select_public" ON public.system_config
    FOR SELECT USING (
        is_public = true OR
        key = 'super_admin_emails'
    );

-- Ensure activity_logs can be inserted
DROP POLICY IF EXISTS "activity_logs_insert_system_or_registration" ON public.activity_logs;

CREATE POLICY "activity_logs_insert_all" ON public.activity_logs
    FOR INSERT WITH CHECK (true);
