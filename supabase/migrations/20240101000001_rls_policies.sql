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