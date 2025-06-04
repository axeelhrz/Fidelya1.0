-- =====================================================
-- ESQUEMA COMPLETO PARA SISTEMA DE CASINO ESCOLAR
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de guardians (apoderados)
CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de students (estudiantes)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    section TEXT NOT NULL,
    level TEXT NOT NULL,
    dietary_restrictions TEXT,
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de almuerzos
CREATE TABLE IF NOT EXISTS public.almuerzos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    dia TEXT NOT NULL,
    fecha DATE NOT NULL,
    precio_estudiante INTEGER NOT NULL,
    precio_funcionario INTEGER NOT NULL,
    tipo_dia TEXT DEFAULT 'NORMAL',
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codigo, fecha)
);

-- Crear tabla de colaciones
CREATE TABLE IF NOT EXISTS public.colaciones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    dia TEXT NOT NULL,
    fecha DATE NOT NULL,
    precio_estudiante INTEGER NOT NULL,
    precio_funcionario INTEGER NOT NULL,
    tipo_dia TEXT DEFAULT 'NORMAL',
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codigo, fecha)
);

-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    almuerzo_id UUID REFERENCES public.almuerzos(id),
    colacion_id UUID REFERENCES public.colaciones(id),
    fecha_entrega DATE NOT NULL,
    dia_entrega TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    estado_pago TEXT DEFAULT 'PENDIENTE' CHECK (estado_pago IN ('PENDIENTE', 'PAGADO', 'CANCELADO')),
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
    transaction_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    payment_method TEXT,
    gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de settings
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuraciones básicas
INSERT INTO public.settings (key, value, description) VALUES
('system_name', 'Casino Escolar', 'Nombre del sistema'),
    ('order_cutoff_time', '10:00', 'Hora límite para realizar pedidos'),
    ('contact_email', 'contacto@casinoescolar.cl', 'Email de contacto'),
    ('enable_email_notifications', 'true', 'Habilitar notificaciones por email')
ON CONFLICT (key) DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_guardians_user_id ON public.guardians(user_id);
CREATE INDEX IF NOT EXISTS idx_guardians_email ON public.guardians(email);
CREATE INDEX IF NOT EXISTS idx_students_guardian_id ON public.students(guardian_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_guardian_id ON public.pedidos(guardian_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_student_id ON public.pedidos(student_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha_entrega ON public.pedidos(fecha_entrega);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_almuerzos_fecha ON public.almuerzos(fecha);
CREATE INDEX IF NOT EXISTS idx_colaciones_fecha ON public.colaciones(fecha);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_guardians_updated_at BEFORE UPDATE ON public.guardians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_almuerzos_updated_at BEFORE UPDATE ON public.almuerzos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colaciones_updated_at BEFORE UPDATE ON public.colaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at BEFORE UPDATE ON public.pedidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear políticas RLS para guardians
CREATE POLICY "Users can view own guardian profile" ON public.guardians
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own guardian profile" ON public.guardians
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own guardian profile" ON public.guardians
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Crear políticas RLS para students
CREATE POLICY "Guardians can view own students" ON public.students
    FOR SELECT USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Guardians can manage own students" ON public.students
    FOR ALL USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

-- Crear políticas RLS para almuerzos y colaciones (lectura pública)
CREATE POLICY "Anyone can view almuerzos" ON public.almuerzos FOR SELECT USING (true);
CREATE POLICY "Anyone can view colaciones" ON public.colaciones FOR SELECT USING (true);

-- Crear políticas RLS para pedidos
CREATE POLICY "Guardians can view own orders" ON public.pedidos
    FOR SELECT USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Guardians can create orders" ON public.pedidos
    FOR INSERT WITH CHECK (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

-- Crear políticas RLS para payments
CREATE POLICY "Guardians can view own payments" ON public.payments
    FOR SELECT USING (
        order_id IN (
            SELECT p.id FROM public.pedidos p
            JOIN public.guardians g ON p.guardian_id = g.id
            WHERE g.user_id = auth.uid()
        )
    );

-- Crear políticas RLS para settings (lectura pública)
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);

-- Crear políticas para staff (administradores)
CREATE POLICY "Staff can view all guardians" ON public.guardians
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

CREATE POLICY "Staff can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

CREATE POLICY "Staff can manage almuerzos" ON public.almuerzos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

CREATE POLICY "Staff can manage colaciones" ON public.colaciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

CREATE POLICY "Staff can view all orders" ON public.pedidos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

CREATE POLICY "Staff can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

CREATE POLICY "Staff can manage settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND is_staff = true
        )
    );

-- Crear vistas para reportes
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
FROM public.pedidos o
JOIN public.students s ON o.student_id = s.id
JOIN public.guardians g ON o.guardian_id = g.id
JOIN public.almuerzos alm ON o.almuerzo_id = alm.id
JOIN public.colaciones col ON o.colacion_id = col.id;

CREATE OR REPLACE VIEW public.pedidos_agrupados AS
SELECT 
    o.dia_entrega as dia,
    o.fecha_pedido as fecha,
    p.descripcion as opcion,
    COUNT(*) as cantidad,
    s.level as nivel
FROM public.pedidos o
JOIN public.students s ON o.student_id = s.id
JOIN public.almuerzos alm ON o.almuerzo_id = alm.id
JOIN public.colaciones col ON o.colacion_id = col.id
WHERE o.status = 'PAGADO'
GROUP BY o.dia_entrega, o.fecha_pedido, p.descripcion, s.level
ORDER BY o.fecha_pedido, s.level, p.descripcion;

-- Crear funciones útiles
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
