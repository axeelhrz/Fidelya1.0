-- =====================================================
-- FIX AUTHENTICATION AND REGISTRATION ISSUES
-- =====================================================

-- Drop and recreate the create_user_profile function with proper permissions
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
    super_admin_emails TEXT[];
BEGIN
    -- Check if this email is in the super admin list
    SELECT value::jsonb INTO super_admin_emails 
    FROM public.system_config 
    WHERE key = 'super_admin_emails';
    
    IF super_admin_emails IS NOT NULL AND p_email = ANY(SELECT jsonb_array_elements_text(super_admin_emails)) THEN
        is_super_admin := TRUE;
        p_role := 'super_admin';
    END IF;
    
    -- Insert the user profile
    INSERT INTO public.users (id, email, full_name, phone, role)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role)
    RETURNING id INTO user_id;
    
    -- Log the activity (only if user was created successfully)
    IF user_id IS NOT NULL THEN
        INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
        VALUES (
            user_id, 
            'user_created', 
            'user', 
            user_id, 
            jsonb_build_object('email', p_email, 'role', p_role, 'is_super_admin', is_super_admin)
        );
    END IF;
    
    RETURN user_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error for debugging
        RAISE LOG 'Error creating user profile for %: %', p_email, SQLERRM;
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT, user_role) TO anon;
