-- =====================================================
-- CREAR PERFIL PARA USUARIO ADMIN EXISTENTE
-- =====================================================

-- Verificar si el usuario existe en auth.users pero no en public.users
WITH auth_user AS (
    SELECT id, email, raw_user_meta_data
    FROM auth.users 
    WHERE email = 'admin@casino.cl'
),
existing_profile AS (
    SELECT id 
    FROM public.users 
    WHERE email = 'admin@casino.cl'
)
-- Crear el perfil si el usuario existe en auth pero no en public
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Administrador'),
    'super_admin'::user_role,
    true,
    NOW(),
    NOW()
FROM auth_user au
WHERE NOT EXISTS (SELECT 1 FROM existing_profile)
ON CONFLICT (id) DO UPDATE SET
    role = 'super_admin',
    updated_at = NOW();

-- Verificar el resultado
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.is_active
FROM public.users u
WHERE u.email = 'admin@casino.cl';
