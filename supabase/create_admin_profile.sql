-- =====================================================
-- CREAR PERFIL DE ADMINISTRADOR INICIAL
-- =====================================================

-- Verificar si ya existe un usuario con el email admin
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'c.wevarh@gmail.com';
BEGIN
    -- Buscar si existe el usuario en auth.users
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    -- Si existe en auth pero no en public.users, crear el perfil
    IF admin_user_id IS NOT NULL THEN
        -- Verificar si ya existe en public.users
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = admin_user_id) THEN
            -- Crear perfil de super admin
            INSERT INTO public.users (
                id,
                email,
                full_name,
                role,
                is_active
            ) VALUES (
                admin_user_id,
                admin_email,
                'Administrador Sistema',
                'super_admin',
                true
            );
            
            RAISE NOTICE 'Perfil de super admin creado para: %', admin_email;
        ELSE
            -- Actualizar rol si ya existe
            UPDATE public.users 
            SET role = 'super_admin', is_active = true
            WHERE id = admin_user_id;
            
            RAISE NOTICE 'Rol actualizado a super_admin para: %', admin_email;
        END IF;
    ELSE
        RAISE NOTICE 'Usuario % no encontrado en auth.users', admin_email;
    END IF;
END $$;

-- Verificar el resultado
SELECT 
    u.email,
    u.full_name,
    u.role,
    u.is_active,
    u.created_at
FROM public.users u
WHERE u.email = 'c.wevarh@gmail.com';