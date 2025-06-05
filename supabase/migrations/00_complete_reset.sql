-- =====================================================
-- LIMPIEZA COMPLETA DE LA BASE DE DATOS
-- =====================================================

-- Deshabilitar RLS temporalmente
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_transactions DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas RLS
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Students policy" ON public.students;
DROP POLICY IF EXISTS "Menu items policy" ON public.menu_items;
DROP POLICY IF EXISTS "Orders policy" ON public.orders;

-- Eliminar todos los triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS trigger_students_updated_at ON public.students;

-- Eliminar todas las funciones
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile_manual() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_permissions() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role_info() CASCADE;
DROP FUNCTION IF EXISTS public.user_has_permission() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.update_last_login() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.log_activity() CASCADE;
DROP FUNCTION IF EXISTS public.get_dashboard_stats() CASCADE;

-- Eliminar todas las tablas
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.system_config CASCADE;

-- Eliminar tipos
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.menu_category CASCADE;
DROP TYPE IF EXISTS public.student_level CASCADE;
DROP TYPE IF EXISTS public.user_type CASCADE;

SELECT 'Base de datos completamente limpia' as status;
