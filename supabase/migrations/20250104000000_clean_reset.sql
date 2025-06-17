-- =====================================================
-- LIMPIEZA COMPLETA Y RESET DE LA BASE DE DATOS
-- =====================================================

-- Deshabilitar RLS temporalmente para limpieza
SET session_replication_role = replica;

-- Eliminar todas las tablas existentes que puedan causar conflictos
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.almuerzos CASCADE;
DROP TABLE IF EXISTS public.colaciones CASCADE;
DROP TABLE IF EXISTS public.pedidos CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Eliminar funciones que puedan causar conflictos
DROP FUNCTION IF EXISTS public.is_admin(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.user_has_permission(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_permissions(TEXT) CASCADE;

-- Eliminar tipos que puedan causar conflictos
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.menu_category CASCADE;
DROP TYPE IF EXISTS public.student_level CASCADE;
DROP TYPE IF EXISTS public.user_type CASCADE;

-- Restaurar configuración normal
SET session_replication_role = DEFAULT;

-- Mensaje de confirmación
SELECT 'Base de datos limpiada exitosamente' as status;
