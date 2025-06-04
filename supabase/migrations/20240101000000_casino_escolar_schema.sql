-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.guardians CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('guardian', 'admin', 'staff');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'cancelled', 'delivered');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE product_type AS ENUM ('almuerzo', 'colacion');
CREATE TYPE grade_level AS ENUM ('preescolar', 'basica', 'media');

-- Settings table
CREATE TABLE public.settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guardians table (parents/tutors)
CREATE TABLE public.guardians (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role user_role DEFAULT 'guardian',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE public.students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    section VARCHAR(10) NOT NULL,
    level grade_level NOT NULL,
    dietary_restrictions TEXT,
    allergies TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (menu items)
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type product_type NOT NULL,
    price_student INTEGER NOT NULL, -- Price in cents
    price_staff INTEGER NOT NULL,   -- Price in cents
    available_date DATE NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    guardian_id UUID REFERENCES public.guardians(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    delivery_date DATE NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    total_amount INTEGER NOT NULL, -- Total in cents
    status order_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price INTEGER NOT NULL, -- Price in cents at time of order
    subtotal INTEGER NOT NULL,   -- Subtotal in cents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id VARCHAR(255) UNIQUE,
    payment_method VARCHAR(50) DEFAULT 'getnet',
    amount INTEGER NOT NULL, -- Amount in cents
    status payment_status DEFAULT 'pending',
    gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_guardians_user_id ON public.guardians(user_id);
CREATE INDEX idx_guardians_email ON public.guardians(email);
CREATE INDEX idx_students_guardian_id ON public.students(guardian_id);
CREATE INDEX idx_students_grade_section ON public.students(grade, section);
CREATE INDEX idx_products_date_type ON public.products(available_date, type);
CREATE INDEX idx_products_code ON public.products(code);
CREATE INDEX idx_orders_guardian_id ON public.orders(guardian_id);
CREATE INDEX idx_orders_student_id ON public.orders(student_id);
CREATE INDEX idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guardians_updated_at BEFORE UPDATE ON public.guardians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
('system_name', 'Casino Escolar', 'Nombre del sistema'),
('order_cutoff_hour', '10', 'Hora límite para realizar pedidos (24h format)'),
('contact_email', 'contacto@casinoescolar.cl', 'Email de contacto'),
('contact_phone', '+56912345678', 'Teléfono de contacto'),
('enable_email_notifications', 'true', 'Habilitar notificaciones por email'),
('enable_order_reminders', 'true', 'Habilitar recordatorios de pedidos'),
('max_orders_per_day', '2', 'Máximo de pedidos por día por estudiante'),
('allow_weekend_orders', 'false', 'Permitir pedidos para fines de semana');