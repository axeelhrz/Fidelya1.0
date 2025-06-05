-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT NOT NULL DEFAULT 'user' CHECK (rol IN ('user', 'admin')),
    estado TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'pendiente_verificacion')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de productos/menú
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'principal' CHECK (categoria IN ('principal', 'bebida', 'postre', 'entrada')),
    disponible BOOLEAN DEFAULT true,
    fecha_disponible DATE,
    imagen_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    fecha_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'pagado', 'entregado', 'cancelado')),
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de items de pedidos
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago TEXT NOT NULL DEFAULT 'getnet' CHECK (metodo_pago IN ('getnet', 'mercadopago', 'efectivo')),
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
    transaction_id TEXT,
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para users
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los usuarios" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Políticas de seguridad para products
CREATE POLICY "Todos pueden ver productos disponibles" ON public.products
    FOR SELECT USING (disponible = true);

CREATE POLICY "Solo administradores pueden gestionar productos" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Políticas de seguridad para orders
CREATE POLICY "Los usuarios pueden ver sus propios pedidos" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios pedidos" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios pedidos pendientes" ON public.orders
    FOR UPDATE USING (
        auth.uid() = user_id AND 
        estado IN ('pendiente', 'confirmado')
    );

CREATE POLICY "Los administradores pueden ver todos los pedidos" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

CREATE POLICY "Los administradores pueden actualizar todos los pedidos" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Políticas de seguridad para order_items
CREATE POLICY "Los usuarios pueden ver items de sus propios pedidos" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Los usuarios pueden crear items en sus propios pedidos" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Los administradores pueden ver todos los items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Políticas de seguridad para payments
CREATE POLICY "Los usuarios pueden ver pagos de sus propios pedidos" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Los administradores pueden ver todos los pagos" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Insertar algunos productos de ejemplo
INSERT INTO public.products (nombre, descripcion, precio, categoria, disponible) VALUES
('Milanesa con puré', 'Milanesa de carne con puré de papas', 2500.00, 'principal', true),
('Pollo al horno', 'Pollo al horno con ensalada', 2200.00, 'principal', true),
('Empanadas (x2)', 'Dos empanadas de carne', 1800.00, 'principal', true),
('Agua mineral', 'Botella de agua mineral 500ml', 500.00, 'bebida', true),
('Jugo natural', 'Jugo de naranja natural', 800.00, 'bebida', true),
('Flan casero', 'Flan casero con dulce de leche', 1200.00, 'postre', true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON public.users(rol);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_fecha_pedido ON public.orders(fecha_pedido);
CREATE INDEX IF NOT EXISTS idx_orders_estado ON public.orders(estado);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON public.products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_disponible ON public.products(disponible);
