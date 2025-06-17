-- =====================================================
-- FUNCIONES DE AUTENTICACIÓN Y PERMISOS
-- =====================================================

-- Función para obtener el usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el email del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT AS $$
BEGIN
    RETURN auth.jwt() ->> 'email';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario tiene un permiso específico
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

-- Función para obtener permisos de un usuario
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

-- Función para obtener información completa del rol
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

-- Función para verificar si un usuario es admin
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

-- Función para obtener el rol de un usuario
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

-- Función para crear un usuario completo
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
BEGIN
    INSERT INTO public.users (id, email, full_name, phone, role)
    VALUES (p_user_id, p_email, p_full_name, p_phone, p_role)
    RETURNING id INTO user_id;
    
    -- Registrar actividad
    PERFORM public.log_activity(
        user_id, 
        'user_created', 
        'user', 
        user_id, 
        jsonb_build_object('email', p_email, 'role', p_role)
    );
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar último login
CREATE OR REPLACE FUNCTION public.update_last_login(user_email TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.users 
    SET 
        last_login = timezone('utc', now()),
        login_count = COALESCE(login_count, 0) + 1
    WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(
    total_orders BIGINT,
    orders_today BIGINT,
    pending_orders BIGINT,
    total_revenue DECIMAL,
    active_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.orders) as total_orders,
        (SELECT COUNT(*) FROM public.orders WHERE delivery_date = CURRENT_DATE) as orders_today,
        (SELECT COUNT(*) FROM public.orders WHERE status = 'pending') as pending_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE payment_status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM public.users WHERE is_active = true) as active_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
