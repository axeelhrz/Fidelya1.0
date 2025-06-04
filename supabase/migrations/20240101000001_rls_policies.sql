-- Enable RLS on all tables
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Guardians policies
CREATE POLICY "Guardians can view their own profile" ON public.guardians
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Guardians can update their own profile" ON public.guardians
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all guardians" ON public.guardians
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can manage all guardians" ON public.guardians
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Students policies
CREATE POLICY "Guardians can view their students" ON public.students
    FOR SELECT USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Guardians can manage their students" ON public.students
    FOR ALL USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can manage all students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Products policies (menu items)
CREATE POLICY "Everyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Orders policies
CREATE POLICY "Guardians can view their orders" ON public.orders
    FOR SELECT USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Guardians can create orders for their students" ON public.orders
    FOR INSERT WITH CHECK (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        ) AND
        student_id IN (
            SELECT id FROM public.students 
            WHERE guardian_id IN (
                SELECT id FROM public.guardians WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Guardians can update their pending orders" ON public.orders
    FOR UPDATE USING (
        guardian_id IN (
            SELECT id FROM public.guardians WHERE user_id = auth.uid()
        ) AND status = 'pending'
    );

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Order items policies
CREATE POLICY "Guardians can view their order items" ON public.order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM public.orders 
            WHERE guardian_id IN (
                SELECT id FROM public.guardians WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Guardians can manage items for their pending orders" ON public.order_items
    FOR ALL USING (
        order_id IN (
            SELECT id FROM public.orders 
            WHERE guardian_id IN (
                SELECT id FROM public.guardians WHERE user_id = auth.uid()
            ) AND status = 'pending'
        )
    );

CREATE POLICY "Admins can view all order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can manage all order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Payments policies
CREATE POLICY "Guardians can view their payments" ON public.payments
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM public.orders 
            WHERE guardian_id IN (
                SELECT id FROM public.guardians WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "System can manage payments" ON public.payments
    FOR ALL USING (true); -- This will be restricted by service role key

-- Settings policies
CREATE POLICY "Everyone can view settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.guardians 
            WHERE user_id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- =====================================================
-- FIX PARA TABLAS FALTANTES - CASINO ESCOLAR
-- =====================================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREAR TIPOS ENUM NECESARIOS
-- =====================================================

DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('almuerzo', 'colacion');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO', 'ENTREGADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. CREAR TABLA PRODUCTS (REQUERIDA POR EL SISTEMA)
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type product_type NOT NULL,
  price_student INTEGER NOT NULL DEFAULT 0,
  price_staff INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREAR TABLA ORDERS (REQUERIDA POR EL SISTEMA)
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID,
  student_id UUID,
  delivery_date DATE NOT NULL,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status order_status DEFAULT 'PENDIENTE',
  payment_status payment_status DEFAULT 'PENDING',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREAR TABLA ORDER_ITEMS (REQUERIDA POR EL SISTEMA)
-- =====================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREAR TABLAS PRINCIPALES SI NO EXISTEN
-- =====================================================

CREATE TABLE IF NOT EXISTS guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID REFERENCES guardians(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  level TEXT NOT NULL,
  dietary_restrictions TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID,
  transaction_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  payment_method TEXT,
  gateway_response JSONB,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. FUNCIONES REQUERIDAS POR EL SISTEMA
-- =====================================================

-- Función para verificar si se puede hacer un pedido
CREATE OR REPLACE FUNCTION can_place_order(order_date DATE)
RETURNS BOOLEAN AS $$
DECLARE
  cutoff_hour INTEGER := 10;
  current_time TIME;
  order_day_of_week INTEGER;
BEGIN
  -- Obtener hora de corte desde settings
  SELECT COALESCE(value::INTEGER, 10) INTO cutoff_hour
  FROM settings 
  WHERE key = 'order_cutoff_hour';
  
  current_time := CURRENT_TIME;
  order_day_of_week := EXTRACT(DOW FROM order_date);
  
  -- No se puede pedir para fines de semana
  IF order_day_of_week = 0 OR order_day_of_week = 6 THEN
    RETURN FALSE;
  END IF;
  
  -- No se puede pedir para el mismo día después de la hora de corte
  IF order_date = CURRENT_DATE AND EXTRACT(HOUR FROM current_time) >= cutoff_hour THEN
    RETURN FALSE;
  END IF;
  
  -- No se puede pedir para fechas pasadas
  IF order_date < CURRENT_DATE THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para generar número de orden
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_number TEXT;
  seq_val INTEGER;
BEGIN
  -- Crear secuencia si no existe
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'order_number_seq') THEN
    CREATE SEQUENCE order_number_seq START 1;
  END IF;
  
  seq_val := NEXTVAL('order_number_seq');
  order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(seq_val::TEXT, 4, '0');
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener reporte de cocina
CREATE OR REPLACE FUNCTION get_kitchen_report(report_date DATE)
RETURNS TABLE (
  product_name TEXT,
  product_type TEXT,
  total_quantity BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.name as product_name,
    p.type::TEXT as product_type,
    COUNT(oi.id) as total_quantity
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  JOIN orders o ON oi.order_id = o.id
  WHERE o.delivery_date = report_date
    AND o.status = 'PAGADO'
  GROUP BY p.name, p.type
  ORDER BY p.type, p.name;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener resumen de órdenes
CREATE OR REPLACE FUNCTION get_orders_summary(start_date DATE, end_date DATE)
RETURNS TABLE (
  date DATE,
  total_orders BIGINT,
  total_amount BIGINT,
  paid_orders BIGINT,
  pending_orders BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.delivery_date as date,
    COUNT(*) as total_orders,
    SUM(o.total_amount) as total_amount,
    COUNT(*) FILTER (WHERE o.status = 'PAGADO') as paid_orders,
    COUNT(*) FILTER (WHERE o.status = 'PENDIENTE') as pending_orders
  FROM orders o
  WHERE o.delivery_date BETWEEN start_date AND end_date
  GROUP BY o.delivery_date
  ORDER BY o.delivery_date;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. CONFIGURACIONES INICIALES
-- =====================================================

INSERT INTO settings (key, value, description) VALUES
  ('order_cutoff_hour', '10', 'Hora límite para realizar pedidos (formato 24h)'),
  ('system_name', 'Casino Escolar', 'Nombre del sistema'),
  ('contact_email', 'contacto@casinoescolar.cl', 'Email de contacto del sistema'),
  ('contact_phone', '+56912345678', 'Teléfono de contacto del sistema'),
  ('payment_enabled', 'true', 'Indica si los pagos están habilitados'),
  ('max_advance_days', '7', 'Máximo número de días de anticipación para pedidos'),
  ('default_student_price', '2500', 'Precio por defecto para estudiantes (en pesos)'),
  ('default_staff_price', '3500', 'Precio por defecto para funcionarios (en pesos)')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- =====================================================
-- 8. ÍNDICES BÁSICOS
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_date ON products(date);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_guardian_id ON orders(guardian_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_guardians_email ON guardians(email);
CREATE INDEX IF NOT EXISTS idx_students_guardian_id ON students(guardian_id);

-- =====================================================
-- 9. POLÍTICAS RLS BÁSICAS
-- =====================================================

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (lectura pública para productos, resto restringido)
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view settings" ON settings;
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Tablas faltantes creadas exitosamente';
  RAISE NOTICE 'Funciones del sistema configuradas';
  RAISE NOTICE 'Configuraciones iniciales insertadas';
END $$;