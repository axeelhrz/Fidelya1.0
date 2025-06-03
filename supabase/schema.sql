-- =====================================================
-- ESQUEMA COMPLETO PARA SISTEMA DE CASINO ESCOLAR
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de usuarios (guardians/responsables)
CREATE TABLE IF NOT EXISTS public.guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50) NOT NULL, -- 'PRIMERO_BASICO', 'SEGUNDO_BASICO', etc.
    section VARCHAR(10) NOT NULL, -- 'A', 'B', 'C'
    level VARCHAR(50) NOT NULL, -- 'PREESCOLAR', 'BASICA', 'MEDIA'
    tipo VARCHAR(20) DEFAULT 'Estudiante', -- 'Estudiante' o 'Funcionario'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos/menús diarios
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- 'OP1', 'OP2', etc.
    descripcion TEXT NOT NULL,
    dia VARCHAR(20) NOT NULL, -- 'LUNES', 'MARTES', etc.
    fecha DATE NOT NULL,
    precio_estudiante INTEGER NOT NULL, -- En centavos
    precio_funcionario INTEGER NOT NULL, -- En centavos
    tipo_dia VARCHAR(20) DEFAULT 'NORMAL', -- 'NORMAL', 'ESPECIAL'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    fecha_pedido DATE NOT NULL,
    dia_entrega VARCHAR(20) NOT NULL, -- 'LUNES', 'MARTES', etc.
    total_amount INTEGER NOT NULL, -- En centavos
    status VARCHAR(20) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'PAGADO', 'CANCELADO', 'ENTREGADO'
    payment_id VARCHAR(255), -- ID de transacción GetNet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar pedidos duplicados el mismo día
    UNIQUE(student_id, fecha_pedido, dia_entrega)
  );

-- Tabla de items de pedidos
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price INTEGER NOT NULL, -- En centavos
    total_price INTEGER NOT NULL, -- En centavos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    getnet_transaction_id VARCHAR(255),
    amount INTEGER NOT NULL, -- En centavos
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
    payment_method VARCHAR(50),
    processed_at TIMESTAMP WITH TIME ZONE,
    getnet_response JSONB, -- Respuesta completa de GetNet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- VISTAS PARA REPORTES
-- =====================================================

-- Vista para pedidos con detalles completos
CREATE OR REPLACE VIEW public.pedidos_detalle AS
SELECT 
    o.id,
    s.name as nombre_estudiante,
    s.grade as nivel,
    s.section as letra,
    p.descripcion as opcion_elegida,
    s.tipo as tipo_pedido,
    o.dia_entrega,
    o.status as estado_pago,
    o.fecha_pedido,
    o.total_amount,
    g.full_name as nombre_guardian,
    g.email as email_guardian
FROM public.orders o
JOIN public.students s ON o.student_id = s.id
JOIN public.guardians g ON o.guardian_id = g.id
JOIN public.order_items oi ON o.id = oi.order_id
JOIN public.products p ON oi.product_id = p.id;

-- Vista para pedidos agrupados por nivel
CREATE OR REPLACE VIEW public.pedidos_agrupados AS
SELECT 
    o.dia_entrega as dia,
    o.fecha_pedido as fecha,
    p.descripcion as opcion,
    COUNT(*) as cantidad,
    s.level as nivel
FROM public.orders o
JOIN public.students s ON o.student_id = s.id
JOIN public.order_items oi ON o.id = oi.order_id
JOIN public.products p ON oi.product_id = p.id
WHERE o.status = 'PAGADO'
GROUP BY o.dia_entrega, o.fecha_pedido, p.descripcion, s.level
ORDER BY o.fecha_pedido, s.level, p.descripcion;

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener pedidos agrupados por fecha y nivel
CREATE OR REPLACE FUNCTION get_pedidos_agrupados(
    fecha_inicio DATE,
    fecha_fin DATE,
    nivel_filtro TEXT DEFAULT 'TODOS'
)
RETURNS TABLE (
    dia TEXT,
    fecha DATE,
    opcion TEXT,
    cantidad BIGINT,
    nivel TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pa.dia,
        pa.fecha,
        pa.opcion,
        pa.cantidad,
        pa.nivel
    FROM public.pedidos_agrupados pa
    WHERE pa.fecha BETWEEN fecha_inicio AND fecha_fin
    AND (nivel_filtro = 'TODOS' OR pa.nivel = nivel_filtro)
    ORDER BY pa.fecha, pa.nivel, pa.opcion;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar si se puede hacer pedido (horario de corte)
CREATE OR REPLACE FUNCTION can_make_order(
    delivery_date DATE
) RETURNS BOOLEAN AS $$
DECLARE
    cutoff_time TIME;
    current_time_chile TIME;
BEGIN
    -- Obtener hora de corte de configuración (default 10:00)
    SELECT value::TIME INTO cutoff_time 
    FROM public.settings 
    WHERE key = 'order_cutoff_time';
    
    IF cutoff_time IS NULL THEN
        cutoff_time := '10:00:00'::TIME;
    END IF;
    
    -- Convertir hora actual a hora de Chile (UTC-3 o UTC-4 según DST)
    current_time_chile := (NOW() AT TIME ZONE 'America/Santiago')::TIME;
    
    -- Si es para hoy y ya pasó la hora de corte, no se puede
    IF delivery_date = CURRENT_DATE AND current_time_chile > cutoff_time THEN
        RETURN FALSE;
    END IF;
    
    -- Si es para el pasado, no se puede
    IF delivery_date < CURRENT_DATE THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers a todas las tablas principales
CREATE TRIGGER update_guardians_updated_at BEFORE UPDATE ON public.guardians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas para guardians
CREATE POLICY "Guardians can view own data" ON public.guardians FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Guardians can update own data" ON public.guardians FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Staff can view all guardians" ON public.guardians FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- Políticas para students
CREATE POLICY "Guardians can view own students" ON public.students FOR SELECT USING (
    guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid())
);
CREATE POLICY "Guardians can update own students" ON public.students FOR UPDATE USING (
    guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can view all students" ON public.students FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- Políticas para products (todos pueden ver)
CREATE POLICY "Everyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Staff can manage products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- Políticas para orders
CREATE POLICY "Guardians can view own orders" ON public.orders FOR SELECT USING (
    guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid())
);
CREATE POLICY "Guardians can create orders" ON public.orders FOR INSERT WITH CHECK (
    guardian_id IN (SELECT id FROM public.guardians WHERE user_id = auth.uid())
);
CREATE POLICY "Staff can view all orders" ON public.orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- Políticas para order_items
CREATE POLICY "Guardians can view own order items" ON public.order_items FOR SELECT USING (
    order_id IN (
        SELECT id FROM public.orders WHERE guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    )
);
CREATE POLICY "Staff can view all order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- Políticas para payments
CREATE POLICY "Guardians can view own payments" ON public.payments FOR SELECT USING (
    order_id IN (
        SELECT id FROM public.orders WHERE guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    )
);
CREATE POLICY "Staff can view all payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- Políticas para settings (solo staff)
CREATE POLICY "Staff can manage settings" ON public.settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.guardians WHERE user_id = auth.uid() AND is_staff = true)
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar configuraciones por defecto
INSERT INTO public.settings (key, value, description) VALUES
('order_cutoff_time', '10:00:00', 'Hora límite para hacer pedidos (formato HH:MM:SS)'),
('system_name', 'Casino Escolar', 'Nombre del sistema'),
('contact_email', 'casino@colegio.cl', 'Email de contacto del casino'),
('prices_last_updated', NOW()::TEXT, 'Última actualización de precios')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_guardians_user_id ON public.guardians(user_id);
CREATE INDEX IF NOT EXISTS idx_guardians_email ON public.guardians(email);
CREATE INDEX IF NOT EXISTS idx_students_guardian_id ON public.students(guardian_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_section ON public.students(grade, section);
CREATE INDEX IF NOT EXISTS idx_products_fecha ON public.products(fecha);
CREATE INDEX IF NOT EXISTS idx_products_dia ON public.products(dia);
CREATE INDEX IF NOT EXISTS idx_orders_guardian_id ON public.orders(guardian_id);
CREATE INDEX IF NOT EXISTS idx_orders_student_id ON public.orders(student_id);
CREATE INDEX IF NOT EXISTS idx_orders_fecha_pedido ON public.orders(fecha_pedido);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_getnet_transaction_id ON public.payments(getnet_transaction_id);

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.guardians IS 'Tabla de responsables/apoderados de estudiantes';
COMMENT ON TABLE public.students IS 'Tabla de estudiantes del colegio';
COMMENT ON TABLE public.products IS 'Tabla de productos/menús disponibles por día';
COMMENT ON TABLE public.orders IS 'Tabla de pedidos realizados';
COMMENT ON TABLE public.order_items IS 'Tabla de items específicos de cada pedido';
COMMENT ON TABLE public.payments IS 'Tabla de pagos procesados a través de GetNet';
COMMENT ON TABLE public.settings IS 'Tabla de configuraciones del sistema';

COMMENT ON FUNCTION get_pedidos_agrupados IS 'Función para obtener pedidos agrupados por fecha y nivel educativo';
COMMENT ON FUNCTION can_make_order IS 'Función para verificar si se puede realizar un pedido según horario de corte';