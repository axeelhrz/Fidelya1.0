-- =====================================================
-- DATOS INICIALES DEL SISTEMA
-- =====================================================

-- =====================================================
-- PERMISOS DEL SISTEMA
-- =====================================================

INSERT INTO public.permissions (name, description, module, action) VALUES
-- Permisos de pedidos
('pedidos.create', 'Crear nuevos pedidos', 'pedidos', 'create'),
('pedidos.read', 'Ver pedidos', 'pedidos', 'read'),
('pedidos.update', 'Modificar pedidos', 'pedidos', 'update'),
('pedidos.delete', 'Eliminar pedidos', 'pedidos', 'delete'),
('pedidos.export', 'Exportar datos de pedidos', 'pedidos', 'export'),

-- Permisos de usuarios
('usuarios.create', 'Crear nuevos usuarios', 'usuarios', 'create'),
('usuarios.read', 'Ver usuarios', 'usuarios', 'read'),
('usuarios.update', 'Modificar usuarios', 'usuarios', 'update'),
('usuarios.delete', 'Eliminar usuarios', 'usuarios', 'delete'),
('usuarios.manage_roles', 'Gestionar roles de usuarios', 'usuarios', 'manage'),

-- Permisos de menú
('menu.create', 'Crear elementos de menú', 'menu', 'create'),
('menu.read', 'Ver menú', 'menu', 'read'),
('menu.update', 'Modificar menú', 'menu', 'update'),
('menu.delete', 'Eliminar elementos de menú', 'menu', 'delete'),

-- Permisos de estadísticas
('estadisticas.read', 'Ver estadísticas', 'estadisticas', 'read'),
('estadisticas.export', 'Exportar reportes', 'estadisticas', 'export'),

-- Permisos de configuración
('configuracion.read', 'Ver configuración', 'configuracion', 'read'),
('configuracion.update', 'Modificar configuración', 'configuracion', 'update'),

-- Permisos de sistema
('sistema.backup', 'Realizar respaldos', 'sistema', 'backup'),
('sistema.maintenance', 'Modo mantenimiento', 'sistema', 'maintenance');

-- =====================================================
-- ROLES DEL SISTEMA
-- =====================================================

INSERT INTO public.roles (name, display_name, description, color) VALUES
('user', 'Usuario', 'Usuario estándar del sistema', '#10b981'),
('viewer', 'Visualizador', 'Solo puede ver información', '#6b7280'),
('moderator', 'Moderador', 'Puede gestionar pedidos y usuarios básicos', '#3b82f6'),
('admin', 'Administrador', 'Acceso completo excepto configuración crítica', '#f59e0b'),
('super_admin', 'Super Administrador', 'Acceso total al sistema', '#ef4444');

-- =====================================================
-- ASIGNACIÓN DE PERMISOS A ROLES
-- =====================================================

-- Usuario: solo sus propios pedidos
INSERT INTO public.role_permissions (role_name, permission_id)
SELECT 'user'::user_role, id FROM public.permissions WHERE name IN (
    'pedidos.create', 'pedidos.read', 'menu.read'
);

-- Visualizador: solo lectura
INSERT INTO public.role_permissions (role_name, permission_id)
SELECT 'viewer'::user_role, id FROM public.permissions WHERE name IN (
    'pedidos.read', 'menu.read', 'usuarios.read', 'estadisticas.read'
);

-- Moderador: gestión básica
INSERT INTO public.role_permissions (role_name, permission_id)
SELECT 'moderator'::user_role, id FROM public.permissions WHERE name IN (
    'pedidos.create', 'pedidos.read', 'pedidos.update', 'pedidos.export',
    'menu.read', 'menu.update',
    'usuarios.read', 'usuarios.update',
    'estadisticas.read'
);

-- Administrador: casi todo
INSERT INTO public.role_permissions (role_name, permission_id)
SELECT 'admin'::user_role, id FROM public.permissions WHERE name NOT IN (
    'sistema.backup', 'sistema.maintenance', 'usuarios.manage_roles'
);

-- Super Admin: todo
INSERT INTO public.role_permissions (role_name, permission_id)
SELECT 'super_admin'::user_role, id FROM public.permissions;

-- =====================================================
-- CONFIGURACIÓN INICIAL DEL SISTEMA
-- =====================================================

INSERT INTO public.system_config (key, value, description, is_public) VALUES
('app_name', '"Casino Escolar"', 'Nombre de la aplicación', true),
('app_version', '"1.0.0"', 'Versión de la aplicación', true),
('maintenance_mode', 'false', 'Modo de mantenimiento', false),
('max_orders_per_day', '100', 'Máximo de pedidos por día', false),
('order_deadline_hours', '24', 'Horas límite para hacer pedidos', true),
('payment_methods', '["getnet", "transferencia"]', 'Métodos de pago disponibles', true),
('default_prices', '{"almuerzo_estudiante": 3500, "almuerzo_funcionario": 4500, "colacion": 2000}', 'Precios por defecto', false),
('business_hours', '{"start": "08:00", "end": "17:00"}', 'Horario de atención', true),
('contact_info', '{"email": "casino@escuela.cl", "phone": "+56912345678"}', 'Información de contacto', true);

-- =====================================================
-- USUARIO SUPER ADMINISTRADOR INICIAL
-- =====================================================

-- Nota: Este usuario se creará cuando se registre por primera vez
-- Aquí solo preparamos la configuración para reconocerlo

INSERT INTO public.system_config (key, value, description, is_public) VALUES
('super_admin_emails', '["admin@casino.cl", "c.wevarh@gmail.com"]', 'Emails de super administradores', false);

-- =====================================================
-- MENÚ DE EJEMPLO PARA LA SEMANA
-- =====================================================

-- Generar menú para los próximos 7 días
DO $$
DECLARE
    current_date DATE := CURRENT_DATE;
    day_counter INTEGER := 0;
    day_names TEXT[] := ARRAY['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    almuerzo_options TEXT[] := ARRAY[
        'Pollo al horno con papas', 
        'Pescado a la plancha con arroz', 
        'Carne mechada con puré', 
        'Lasaña de verduras', 
        'Cazuela de pollo'
    ];
    colacion_options TEXT[] := ARRAY[
        'Sándwich de palta y tomate', 
        'Yogurt con frutas', 
        'Galletas con leche', 
        'Fruta de estación', 
        'Queque casero'
    ];
BEGIN
    WHILE day_counter < 7 LOOP
        -- Solo agregar menú para días de semana (lunes a viernes)
        IF EXTRACT(DOW FROM current_date + day_counter) BETWEEN 1 AND 5 THEN
            -- Almuerzo
            INSERT INTO public.menu_items (
                name, 
                description, 
                category, 
                price_student, 
                price_staff, 
                available_date, 
                day_name, 
                day_type,
                is_available,
                max_orders
            ) VALUES (
                almuerzo_options[(day_counter % array_length(almuerzo_options, 1)) + 1],
                'Almuerzo nutritivo y balanceado',
                'almuerzo',
                3500,
                4500,
                current_date + day_counter,
                day_names[EXTRACT(DOW FROM current_date + day_counter)],
                'normal',
                true,
                50
            );
            
            -- Colación
            INSERT INTO public.menu_items (
                name, 
                description, 
                category, 
                price_student, 
                price_staff, 
                available_date, 
                day_name, 
                day_type,
                is_available,
                max_orders
            ) VALUES (
                colacion_options[(day_counter % array_length(colacion_options, 1)) + 1],
                'Colación saludable para media mañana',
                'colacion',
                2000,
                2500,
                current_date + day_counter,
                day_names[EXTRACT(DOW FROM current_date + day_counter)],
                'normal',
                true,
                30
            );
        END IF;
        
        day_counter := day_counter + 1;
    END LOOP;
END $$;
