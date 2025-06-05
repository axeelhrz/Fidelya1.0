-- =====================================================
-- ESQUEMA COMPLETO CASINO ESCOLAR
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TIPOS ENUMERADOS
-- =====================================================

CREATE TYPE user_role AS ENUM ('user', 'viewer', 'moderator', 'admin', 'super_admin');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'paid', 'cancelled', 'delivered');
CREATE TYPE menu_category AS ENUM ('almuerzo', 'colacion');
CREATE TYPE student_level AS ENUM ('basica', 'media');
CREATE TYPE user_type AS ENUM ('estudiante', 'funcionario');

-- =====================================================
-- TABLA PRINCIPAL DE USUARIOS
-- =====================================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    role_assigned_by UUID REFERENCES public.users(id),
    role_assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- TABLA DE ESTUDIANTES
-- =====================================================

CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    level student_level NOT NULL,
    user_type user_type DEFAULT 'estudiante',
    rut TEXT,
    dietary_restrictions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT unique_student_per_guardian UNIQUE(guardian_id, name, grade, section)
);

-- =====================================================
-- TABLA DE ELEMENTOS DEL MENÚ
-- =====================================================

CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category menu_category NOT NULL,
    price_student DECIMAL(10,2) NOT NULL,
    price_staff DECIMAL(10,2) NOT NULL,
    available_date DATE NOT NULL,
    day_name TEXT NOT NULL,
    day_type TEXT NOT NULL, -- 'normal', 'especial', 'feriado'
    code TEXT,
    is_available BOOLEAN DEFAULT true,
    max_orders INTEGER,
    current_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT valid_prices CHECK (price_student > 0 AND price_staff > 0),
    CONSTRAINT valid_orders CHECK (current_orders >= 0 AND (max_orders IS NULL OR current_orders <= max_orders))
);

-- =====================================================
-- TABLA DE PEDIDOS
-- =====================================================

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    delivery_date DATE NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    transaction_id TEXT,
    payment_method TEXT,
    payment_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    CONSTRAINT valid_amounts CHECK (unit_price > 0 AND total_amount > 0),
    CONSTRAINT valid_total CHECK (total_amount = unit_price * quantity)
);

-- =====================================================
-- TABLA DE TRANSACCIONES DE PAGO
-- =====================================================

CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id TEXT NOT NULL UNIQUE,
    guardian_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'CLP',
    payment_method TEXT,
    payment_status payment_status DEFAULT 'pending',
    gateway_response JSONB,
    gateway_transaction_id TEXT,
    payment_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT valid_amount CHECK (total_amount > 0)
);

-- =====================================================
-- TABLA DE RELACIÓN PEDIDOS-TRANSACCIONES
-- =====================================================

CREATE TABLE public.order_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id UUID NOT NULL REFERENCES public.payment_transactions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT unique_order_transaction UNIQUE(order_id, transaction_id)
);

-- =====================================================
-- SISTEMA DE PERMISOS
-- =====================================================

CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name user_role NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6b7280',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name user_role NOT NULL REFERENCES public.roles(name) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    
    CONSTRAINT unique_role_permission UNIQUE(role_name, permission_id)
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =====================================================

CREATE TABLE public.system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- TABLA DE LOGS DE ACTIVIDAD
-- =====================================================

CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- ÍNDICES PARA RENDIMIENTO
-- =====================================================

-- Usuarios
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_active ON public.users(is_active);

-- Estudiantes
CREATE INDEX idx_students_guardian ON public.students(guardian_id);
CREATE INDEX idx_students_active ON public.students(is_active);
CREATE INDEX idx_students_level ON public.students(level);

-- Elementos del menú
CREATE INDEX idx_menu_items_date ON public.menu_items(available_date);
CREATE INDEX idx_menu_items_category ON public.menu_items(category);
CREATE INDEX idx_menu_items_available ON public.menu_items(is_available);

-- Pedidos
CREATE INDEX idx_orders_guardian ON public.orders(guardian_id);
CREATE INDEX idx_orders_student ON public.orders(student_id);
CREATE INDEX idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_transaction ON public.orders(transaction_id);

-- Transacciones
CREATE INDEX idx_transactions_guardian ON public.payment_transactions(guardian_id);
CREATE INDEX idx_transactions_status ON public.payment_transactions(payment_status);
CREATE INDEX idx_transactions_created ON public.payment_transactions(created_at);

-- Logs
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);

-- =====================================================
-- FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar actividad
CREATE OR REPLACE FUNCTION public.log_activity(
    p_user_id UUID,
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)
    VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Triggers para updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_payment_transactions_updated_at
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_system_config_updated_at
    BEFORE UPDATE ON public.system_config
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- HABILITAR RLS
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- POLÍTICAS PARA USUARIOS
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.read')
    );

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.update')
    );

CREATE POLICY "users_insert_admin" ON public.users
    FOR INSERT WITH CHECK (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.create')
    );

CREATE POLICY "users_delete_super_admin" ON public.users
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.delete')
    );

-- POLÍTICAS PARA ESTUDIANTES
CREATE POLICY "students_select_own" ON public.students
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.read')
    );

CREATE POLICY "students_insert_own" ON public.students
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.create')
    );

CREATE POLICY "students_update_own" ON public.students
    FOR UPDATE USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.update')
    );

CREATE POLICY "students_delete_admin" ON public.students
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.delete')
    );

-- POLÍTICAS PARA ELEMENTOS DEL MENÚ
CREATE POLICY "menu_items_select_all" ON public.menu_items
    FOR SELECT USING (true);

CREATE POLICY "menu_items_insert_admin" ON public.menu_items
    FOR INSERT WITH CHECK (
        public.user_has_permission(public.get_current_user_email(), 'menu.create')
    );

CREATE POLICY "menu_items_update_admin" ON public.menu_items
    FOR UPDATE USING (
        public.user_has_permission(public.get_current_user_email(), 'menu.update')
    );

CREATE POLICY "menu_items_delete_admin" ON public.menu_items
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'menu.delete')
    );

-- POLÍTICAS PARA PEDIDOS
CREATE POLICY "orders_select_own" ON public.orders
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.read')
    );

CREATE POLICY "orders_insert_own" ON public.orders
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.create')
    );

CREATE POLICY "orders_update_own" ON public.orders
    FOR UPDATE USING (
        (auth.uid() = guardian_id AND status = 'pending') OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.update')
    );

CREATE POLICY "orders_delete_admin" ON public.orders
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'pedidos.delete')
    );

-- POLÍTICAS PARA TRANSACCIONES DE PAGO
CREATE POLICY "payment_transactions_select_own" ON public.payment_transactions
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.read')
    );

CREATE POLICY "payment_transactions_insert_own" ON public.payment_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.create')
    );

CREATE POLICY "payment_transactions_update_system" ON public.payment_transactions
    FOR UPDATE USING (
        public.user_has_permission(public.get_current_user_email(), 'pedidos.update')
    );

-- POLÍTICAS PARA RELACIONES PEDIDOS-TRANSACCIONES
CREATE POLICY "order_transactions_select_own" ON public.order_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.guardian_id = auth.uid()
        ) OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.read')
    );

CREATE POLICY "order_transactions_insert_system" ON public.order_transactions
    FOR INSERT WITH CHECK (
        public.user_has_permission(public.get_current_user_email(), 'pedidos.create')
    );

-- POLÍTICAS PARA SISTEMA DE PERMISOS
CREATE POLICY "permissions_select_all" ON public.permissions
    FOR SELECT USING (true);

CREATE POLICY "roles_select_all" ON public.roles
    FOR SELECT USING (true);

CREATE POLICY "role_permissions_select_all" ON public.role_permissions
    FOR SELECT USING (true);

CREATE POLICY "permissions_modify_super_admin" ON public.permissions
    FOR ALL USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.manage_roles')
    );

CREATE POLICY "roles_modify_super_admin" ON public.roles
    FOR ALL USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.manage_roles')
    );

CREATE POLICY "role_permissions_modify_super_admin" ON public.role_permissions
    FOR ALL USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.manage_roles')
    );

-- POLÍTICAS PARA CONFIGURACIÓN DEL SISTEMA
CREATE POLICY "system_config_select_public" ON public.system_config
    FOR SELECT USING (
        is_public = true OR
        public.user_has_permission(public.get_current_user_email(), 'configuracion.read')
    );

CREATE POLICY "system_config_modify_admin" ON public.system_config
    FOR ALL USING (
        public.user_has_permission(public.get_current_user_email(), 'configuracion.update')
    );

-- POLÍTICAS PARA LOGS DE ACTIVIDAD
CREATE POLICY "activity_logs_select_own" ON public.activity_logs
    FOR SELECT USING (
        auth.uid() = user_id OR
        public.user_has_permission(public.get_current_user_email(), 'estadisticas.read')
    );

CREATE POLICY "activity_logs_insert_system" ON public.activity_logs
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- DATOS INICIALES DEL SISTEMA
-- =====================================================

-- PERMISOS DEL SISTEMA
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

-- ROLES DEL SISTEMA
INSERT INTO public.roles (name, display_name, description, color) VALUES
('user', 'Usuario', 'Usuario estándar del sistema', '#10b981'),
('viewer', 'Visualizador', 'Solo puede ver información', '#6b7280'),
('moderator', 'Moderador', 'Puede gestionar pedidos y usuarios básicos', '#3b82f6'),
('admin', 'Administrador', 'Acceso completo excepto configuración crítica', '#f59e0b'),
('super_admin', 'Super Administrador', 'Acceso total al sistema', '#ef4444');

-- ASIGNACIÓN DE PERMISOS A ROLES
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

-- CONFIGURACIÓN INICIAL DEL SISTEMA
INSERT INTO public.system_config (key, value, description, is_public) VALUES
('app_name', '"Casino Escolar"', 'Nombre de la aplicación', true),
('app_version', '"1.0.0"', 'Versión de la aplicación', true),
('maintenance_mode', 'false', 'Modo de mantenimiento', false),
('max_orders_per_day', '100', 'Máximo de pedidos por día', false),
('order_deadline_hours', '24', 'Horas límite para hacer pedidos', true),
('payment_methods', '["getnet", "transferencia"]', 'Métodos de pago disponibles', true),
('default_prices', '{"almuerzo_estudiante": 3500, "almuerzo_funcionario": 4500, "colacion": 2000}', 'Precios por defecto', false),
('business_hours', '{"start": "08:00", "end": "17:00"}', 'Horario de atención', true),
('contact_info', '{"email": "casino@escuela.cl", "phone": "+56912345678"}', 'Información de contacto', true),
('super_admin_emails', '["admin@casino.cl", "c.wevarh@gmail.com"]', 'Emails de super administradores', false);

-- MENÚ DE EJEMPLO PARA LA SEMANA
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

-- =====================================================
-- FUNCIÓN PARA AUTO-ASIGNAR SUPER ADMIN
-- =====================================================

-- Función que se ejecuta cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    super_admin_emails JSONB;
    is_super_admin BOOLEAN := FALSE;
BEGIN
    -- Obtener la lista de emails de super admin
    SELECT value INTO super_admin_emails
    FROM public.system_config
    WHERE key = 'super_admin_emails';
    
    -- Verificar si el email está en la lista de super admins
    IF super_admin_emails ? NEW.email THEN
        is_super_admin := TRUE;
    END IF;
    
    -- Crear perfil de usuario automáticamente
    INSERT INTO public.users (
        id, 
        email, 
        full_name, 
        role,
        is_active
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE WHEN is_super_admin THEN 'super_admin'::user_role ELSE 'user'::user_role END,
        true
    );
    
    -- Registrar actividad
    PERFORM public.log_activity(
        NEW.id, 
        'user_registered', 
        'user', 
        NEW.id, 
        jsonb_build_object(
            'email', NEW.email, 
            'role', CASE WHEN is_super_admin THEN 'super_admin' ELSE 'user' END,
            'auto_assigned', is_super_admin
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para nuevos usuarios
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para verificar si un email es super admin
CREATE OR REPLACE FUNCTION public.is_super_admin_email(email_to_check TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    super_admin_emails JSONB;
    email_exists BOOLEAN := FALSE;
BEGIN
    -- Obtener la lista de emails de super admin
    SELECT value INTO super_admin_emails
    FROM public.system_config
    WHERE key = 'super_admin_emails';
    
    -- Verificar si el email está en la lista
    SELECT super_admin_emails ? email_to_check INTO email_exists;
    
    RETURN email_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensaje de confirmación
SELECT 'Esquema completo aplicado exitosamente' as status;
