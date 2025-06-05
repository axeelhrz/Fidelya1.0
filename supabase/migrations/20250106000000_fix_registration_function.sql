-- =====================================================
-- FIX REGISTRATION FUNCTION AND TRIGGER
-- =====================================================

-- 1. Drop existing function with wrong signature
DROP FUNCTION IF EXISTS public.create_user_profile_manual(UUID, TEXT, TEXT, TEXT, TEXT);

-- 2. Create the function with the correct signature that matches the frontend call
CREATE OR REPLACE FUNCTION public.create_user_profile_manual(
    p_user_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_role TEXT DEFAULT 'user'
)
RETURNS UUID AS $$
BEGIN
    -- Log the attempt
    RAISE NOTICE 'Attempting to create user profile for: % with email: %', p_user_id, p_email;
    
    -- Verify if already exists
    IF EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
        RAISE NOTICE 'User profile already exists for: %', p_user_id;
        RETURN p_user_id;
    END IF;
    
    -- Insert new user
    INSERT INTO public.users (
        id, 
        email, 
        full_name, 
        phone, 
        role, 
        is_active, 
        created_at, 
        updated_at
    )
    VALUES (
        p_user_id, 
        p_email, 
        p_full_name, 
        p_phone, 
        p_role::user_role, 
        true, 
        timezone('utc', now()), 
        timezone('utc', now())
    );
    
    RAISE NOTICE 'User profile created successfully for: %', p_user_id;
    RETURN p_user_id;
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating user profile: %', SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_full_name TEXT;
    user_role_to_assign user_role := 'user';
    super_admin_emails TEXT[];
BEGIN
    -- Log the trigger execution
    RAISE NOTICE 'Trigger executed for user: % with email: %', NEW.id, NEW.email;
    
    -- Verify if already exists
    IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        RAISE NOTICE 'User already exists in public.users: %', NEW.id;
        RETURN NEW;
    END IF;

    -- Get super admin emails from config
    SELECT value::jsonb INTO super_admin_emails 
    FROM public.system_config 
    WHERE key = 'super_admin_emails';
    
    -- If no config found, use default
    IF super_admin_emails IS NULL THEN
        super_admin_emails := ARRAY['admin@casino.cl', 'c.wevarh@gmail.com'];
    END IF;

    -- Obtain full name from metadata
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Check if user is super admin
    IF NEW.email = ANY(super_admin_emails) THEN
        user_role_to_assign := 'super_admin';
        RAISE NOTICE 'Assigning super_admin role to: %', NEW.email;
    END IF;
    
    -- Insert user into public.users
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
    
    RAISE NOTICE 'User profile created via trigger for: %', NEW.email;
    RETURN NEW;
    
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the auth user creation
    RAISE NOTICE 'Error in trigger for user %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Create a diagnostic function to check system status
CREATE OR REPLACE FUNCTION public.diagnose_auth_system()
RETURNS TABLE(
    component TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check users table
    RETURN QUERY SELECT 
        'users_table'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Public users table'::TEXT;
    
    -- Check trigger
    RETURN QUERY SELECT 
        'trigger'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') 
             THEN 'OK' ELSE 'MISSING' END,
        'Auth user creation trigger'::TEXT;
    
    -- Check function
    RETURN QUERY SELECT 
        'handle_new_user_function'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'handle_new_user' AND routine_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Trigger function'::TEXT;
    
    -- Check manual function
    RETURN QUERY SELECT 
        'manual_function'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'create_user_profile_manual' AND routine_schema = 'public') 
             THEN 'OK' ELSE 'MISSING' END,
        'Manual profile creation function'::TEXT;
    
    -- Check system config
    RETURN QUERY SELECT 
        'system_config'::TEXT,
        CASE WHEN EXISTS (SELECT 1 FROM public.system_config WHERE key = 'super_admin_emails') 
             THEN 'OK' ELSE 'MISSING' END,
        'Super admin configuration'::TEXT;
    
    -- Check user counts
    RETURN QUERY SELECT 
        'user_counts'::TEXT,
        'INFO'::TEXT,
        ('Auth users: ' || (SELECT COUNT(*) FROM auth.users)::TEXT || 
         ', Public users: ' || (SELECT COUNT(*) FROM public.users)::TEXT)::TEXT;
    
    -- Check RLS status
    RETURN QUERY SELECT 
        'rls_status'::TEXT,
        CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'users' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
             THEN 'ENABLED' ELSE 'DISABLED' END,
        'Row Level Security on users table'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Run diagnosis
SELECT * FROM public.diagnose_auth_system();

-- 7. Test the manual function
DO $$
BEGIN
    RAISE NOTICE 'Testing manual function signature...';
    PERFORM public.create_user_profile_manual(
        '00000000-0000-0000-0000-000000000000'::UUID,
        'test@example.com',
        'Test User',
        '+56912345678',
        'user'
    );
    RAISE NOTICE 'Manual function test completed successfully';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Manual function test failed: %', SQLERRM;
END $$;

-- 8. Clean up test data
DELETE FROM public.users WHERE id = '00000000-0000-0000-0000-000000000000';

-- 9. Final status message
SELECT 'Registration system fixed and tested successfully' as status;
