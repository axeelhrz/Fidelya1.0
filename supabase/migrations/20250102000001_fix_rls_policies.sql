-- =====================================================
-- FIX RLS POLICIES FOR REGISTRATION
-- =====================================================

-- Drop existing user policies
DROP POLICY IF EXISTS "users_insert_admin" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;

-- Allow users to insert their own profile during registration
CREATE POLICY "users_insert_self_or_admin" ON public.users
    FOR INSERT WITH CHECK (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.create')
    );

-- Users can view their own information or admins can view all
CREATE POLICY "users_select_own_or_admin" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.read')
    );

-- Users can update their own information or admins can update any
CREATE POLICY "users_update_own_or_admin" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.update')
    );

-- Drop and recreate student policies to allow self-insertion
DROP POLICY IF EXISTS "students_insert_own" ON public.students;

CREATE POLICY "students_insert_own_or_admin" ON public.students
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.create')
    );

-- Allow anonymous access to system_config for super admin emails check
DROP POLICY IF EXISTS "system_config_select_public" ON public.system_config;

CREATE POLICY "system_config_select_public_or_registration" ON public.system_config
    FOR SELECT USING (
        is_public = true OR
        key = 'super_admin_emails' OR
        public.user_has_permission(public.get_current_user_email(), 'configuracion.read')
    );

-- Allow activity logs to be inserted during registration
DROP POLICY IF EXISTS "activity_logs_insert_system" ON public.activity_logs;

CREATE POLICY "activity_logs_insert_system_or_registration" ON public.activity_logs
    FOR INSERT WITH CHECK (true);
