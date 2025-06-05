-- =====================================================
-- PRUEBA Y ARREGLO DEL SISTEMA
-- =====================================================

-- Verificar que las tablas existen
SELECT 'Verificando tablas...' as status;

-- Verificar usuarios existentes
SELECT 
    'Usuarios en auth.users: ' || COUNT(*)::text as info
FROM auth.users;

SELECT 
    'Usuarios en public.users: ' || COUNT(*)::text as info
FROM public.users;

-- Verificar configuración
SELECT 
    'Configuración super_admin_emails: ' || value::text as info
FROM public.system_config 
WHERE key = 'super_admin_emails';

-- Función para crear perfil de usuario de forma manual y segura
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS TEXT AS $$
DECLARE
    auth_user RECORD;
    profile_count INTEGER := 0;
BEGIN
    -- Buscar usuarios en auth.users que no tienen perfil en public.users
    FOR auth_user IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN public.users pu ON au.id = pu.id
        WHERE pu.id IS NULL
    LOOP
        BEGIN
            INSERT INTO public.users (
                id,
                email,
                full_name,
                role,
                is_active,
                created_at,
                updated_at
            ) VALUES (
                auth_user.id,
                auth_user.email,
                COALESCE(
                    auth_user.raw_user_meta_data->>'full_name',
                    auth_user.raw_user_meta_data->>'name',
                    split_part(auth_user.email, '@', 1)
                ),
                'user'::user_role,
                true,
                NOW(),
                NOW()
            );
            
            profile_count := profile_count + 1;
            
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Error creating profile for %: %', auth_user.email, SQLERRM;
        END;
    END LOOP;
    
    RETURN 'Perfiles creados: ' || profile_count::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la función para crear perfiles faltantes
SELECT public.create_missing_profiles() as resultado;

-- Verificar el resultado
SELECT 
    'Usuarios después de la corrección: ' || COUNT(*)::text as info
FROM public.users;

-- Mensaje final
SELECT 'Sistema verificado y corregido' as status;
