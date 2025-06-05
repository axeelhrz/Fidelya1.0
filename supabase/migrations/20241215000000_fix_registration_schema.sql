-- Fix database schema for registration issues

-- First, ensure the clientes table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    correo_apoderado TEXT UNIQUE NOT NULL,
    nombre_apoderado TEXT NOT NULL,
    telefono TEXT,
    hijos JSONB DEFAULT '[]'::jsonb,
    rol TEXT DEFAULT 'user' CHECK (rol IN ('user', 'admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_correo ON public.clientes(correo_apoderado);
CREATE INDEX IF NOT EXISTS idx_clientes_rol ON public.clientes(rol);

-- Enable RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own client data" ON public.clientes;
DROP POLICY IF EXISTS "Users can insert their own client data" ON public.clientes;
DROP POLICY IF EXISTS "Users can update their own client data" ON public.clientes;
DROP POLICY IF EXISTS "Admins can view all client data" ON public.clientes;
DROP POLICY IF EXISTS "Admins can update all client data" ON public.clientes;

-- Create RLS policies for clientes table
CREATE POLICY "Users can view their own client data" ON public.clientes
    FOR SELECT USING (
        auth.uid() = user_id OR 
        correo_apoderado = auth.jwt() ->> 'email'
    );

CREATE POLICY "Users can insert their own client data" ON public.clientes
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        correo_apoderado = auth.jwt() ->> 'email'
    );

CREATE POLICY "Users can update their own client data" ON public.clientes
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        correo_apoderado = auth.jwt() ->> 'email'
    );

-- Admin policies
CREATE POLICY "Admins can view all client data" ON public.clientes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.clientes c 
            WHERE c.user_id = auth.uid() 
            AND c.rol IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all client data" ON public.clientes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.clientes c 
            WHERE c.user_id = auth.uid() 
            AND c.rol IN ('admin', 'super_admin')
        )
    );

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS handle_clientes_updated_at ON public.clientes;
CREATE TRIGGER handle_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Ensure almuerzos table exists
CREATE TABLE IF NOT EXISTS public.almuerzos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio_estudiante DECIMAL(10,2) NOT NULL,
    precio_funcionario DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    dia TEXT NOT NULL,
    tipo_dia TEXT NOT NULL,
    codigo TEXT,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure colaciones table exists
CREATE TABLE IF NOT EXISTS public.colaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    codigo TEXT,
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure pedidos table exists
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
    nombre_estudiante TEXT NOT NULL,
    curso TEXT NOT NULL,
    letra TEXT NOT NULL,
    nivel TEXT NOT NULL,
    tipo_pedido TEXT NOT NULL CHECK (tipo_pedido IN ('almuerzo', 'colacion')),
    opcion_elegida TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    dia_entrega DATE NOT NULL,
    estado_pago TEXT DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'pagado', 'rechazado', 'error')),
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for other tables
ALTER TABLE public.almuerzos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- RLS policies for almuerzos (everyone can read)
DROP POLICY IF EXISTS "Anyone can view almuerzos" ON public.almuerzos;
CREATE POLICY "Anyone can view almuerzos" ON public.almuerzos
    FOR SELECT USING (true);

-- RLS policies for colaciones (everyone can read)
DROP POLICY IF EXISTS "Anyone can view colaciones" ON public.colaciones;
CREATE POLICY "Anyone can view colaciones" ON public.colaciones
    FOR SELECT USING (true);

-- RLS policies for pedidos
DROP POLICY IF EXISTS "Users can view their own pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Users can insert their own pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Users can update their own pedidos" ON public.pedidos;

CREATE POLICY "Users can view their own pedidos" ON public.pedidos
    FOR SELECT USING (
        cliente_id IN (
            SELECT id FROM public.clientes 
            WHERE user_id = auth.uid() OR correo_apoderado = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can insert their own pedidos" ON public.pedidos
    FOR INSERT WITH CHECK (
        cliente_id IN (
            SELECT id FROM public.clientes 
            WHERE user_id = auth.uid() OR correo_apoderado = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Users can update their own pedidos" ON public.pedidos
    FOR UPDATE USING (
        cliente_id IN (
            SELECT id FROM public.clientes 
            WHERE user_id = auth.uid() OR correo_apoderado = auth.jwt() ->> 'email'
        )
    );

-- Create triggers for updated_at on other tables
DROP TRIGGER IF EXISTS handle_almuerzos_updated_at ON public.almuerzos;
CREATE TRIGGER handle_almuerzos_updated_at
    BEFORE UPDATE ON public.almuerzos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_colaciones_updated_at ON public.colaciones;
CREATE TRIGGER handle_colaciones_updated_at
    BEFORE UPDATE ON public.colaciones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_pedidos_updated_at ON public.pedidos;
CREATE TRIGGER handle_pedidos_updated_at
    BEFORE UPDATE ON public.pedidos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
