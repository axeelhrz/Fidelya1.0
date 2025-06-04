-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_date TEXT;
    sequence_num INTEGER;
BEGIN
    order_date := TO_CHAR(NOW(), 'YYYYMMDD');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM public.orders
    WHERE order_number LIKE order_date || '%';
    
    RETURN order_date || LPAD(sequence_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to check if orders can be placed for a specific date
CREATE OR REPLACE FUNCTION can_place_order(target_date DATE)
RETURNS BOOLEAN AS $$
DECLARE
    cutoff_hour INTEGER;
    current_time TIME;
    target_day_of_week TEXT;
BEGIN
    -- Get cutoff hour from settings
    SELECT CAST(value AS INTEGER) INTO cutoff_hour
    FROM public.settings WHERE key = 'order_cutoff_hour';
    
    -- Default to 10 AM if not set
    IF cutoff_hour IS NULL THEN
        cutoff_hour := 10;
    END IF;
    
    current_time := CURRENT_TIME;
    target_day_of_week := TO_CHAR(target_date, 'Day');
    
    -- Can't order for past dates
    IF target_date < CURRENT_DATE THEN
        RETURN FALSE;
    END IF;
    
    -- Can't order for weekends (unless enabled in settings)
    IF EXTRACT(DOW FROM target_date) IN (0, 6) THEN
        RETURN EXISTS (
            SELECT 1 FROM public.settings 
            WHERE key = 'allow_weekend_orders' AND value = 'true'
        );
    END IF;
    
    -- For today's orders, check cutoff time
    IF target_date = CURRENT_DATE THEN
        RETURN current_time < (cutoff_hour || ':00:00')::TIME;
    END IF;
    
    -- For future dates, allow ordering
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get orders summary for admin dashboard
CREATE OR REPLACE FUNCTION get_orders_summary(summary_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_orders BIGINT,
    total_amount BIGINT,
    pending_orders BIGINT,
    paid_orders BIGINT,
    orders_by_grade JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_amount,
        COUNT(*) FILTER (WHERE o.status = 'pending') as pending_orders,
        COUNT(*) FILTER (WHERE o.status = 'paid') as paid_orders,
        COALESCE(
            jsonb_object_agg(
                s.grade, 
                jsonb_build_object(
                    'count', grade_counts.order_count,
                    'amount', grade_counts.total_amount
                )
            ), 
            '{}'::jsonb
        ) as orders_by_grade
    FROM public.orders o
    JOIN public.students s ON o.student_id = s.id
    LEFT JOIN (
        SELECT 
            s2.grade,
            COUNT(*) as order_count,
            SUM(o2.total_amount) as total_amount
        FROM public.orders o2
        JOIN public.students s2 ON o2.student_id = s2.id
        WHERE o2.delivery_date = summary_date
        GROUP BY s2.grade
    ) grade_counts ON s.grade = grade_counts.grade
    WHERE o.delivery_date = summary_date;
END;
$$ LANGUAGE plpgsql;

-- Function to get kitchen report
CREATE OR REPLACE FUNCTION get_kitchen_report(report_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    product_name TEXT,
    product_type product_type,
    total_quantity BIGINT,
    orders_by_grade JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name as product_name,
        p.type as product_type,
        SUM(oi.quantity) as total_quantity,
        jsonb_object_agg(
            s.grade,
            jsonb_build_object(
                'quantity', grade_quantities.quantity,
                'students', grade_quantities.students
            )
        ) as orders_by_grade
    FROM public.order_items oi
    JOIN public.orders o ON oi.order_id = o.id
    JOIN public.products p ON oi.product_id = p.id
    JOIN public.students s ON o.student_id = s.id
    LEFT JOIN (
        SELECT 
            oi2.product_id,
            s2.grade,
            SUM(oi2.quantity) as quantity,
            array_agg(DISTINCT s2.name) as students
        FROM public.order_items oi2
        JOIN public.orders o2 ON oi2.order_id = o2.id
        JOIN public.students s2 ON o2.student_id = s2.id
        WHERE o2.delivery_date = report_date AND o2.status = 'paid'
        GROUP BY oi2.product_id, s2.grade
    ) grade_quantities ON p.id = grade_quantities.product_id AND s.grade = grade_quantities.grade
    WHERE o.delivery_date = report_date AND o.status = 'paid'
    GROUP BY p.id, p.name, p.type
    ORDER BY p.type, p.name;
END;
$$ LANGUAGE plpgsql;

-- Function to create guardian profile after auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.guardians (user_id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
        NEW.email,
        CASE 
            WHEN NEW.email LIKE '%@casinoescolar.cl' THEN 'admin'::user_role
            ELSE 'guardian'::user_role
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create guardian profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to validate order before creation
CREATE OR REPLACE FUNCTION validate_order_creation()
RETURNS TRIGGER AS $$
DECLARE
    max_orders INTEGER;
    current_orders INTEGER;
    student_guardian_id UUID;
BEGIN
    -- Check if student belongs to the guardian
    SELECT guardian_id INTO student_guardian_id
    FROM public.students
    WHERE id = NEW.student_id;
    
    IF student_guardian_id != NEW.guardian_id THEN
        RAISE EXCEPTION 'Student does not belong to this guardian';
    END IF;
    
    -- Check if orders can be placed for this date
    IF NOT can_place_order(NEW.delivery_date) THEN
        RAISE EXCEPTION 'Orders cannot be placed for this date';
    END IF;
    
    -- Check maximum orders per day per student
    SELECT CAST(value AS INTEGER) INTO max_orders
    FROM public.settings WHERE key = 'max_orders_per_day';
    
    IF max_orders IS NOT NULL THEN
        SELECT COUNT(*) INTO current_orders
        FROM public.orders
        WHERE student_id = NEW.student_id 
        AND delivery_date = NEW.delivery_date
        AND status != 'cancelled';
        
        IF current_orders >= max_orders THEN
            RAISE EXCEPTION 'Maximum orders per day exceeded for this student';
        END IF;
    END IF;
    
    -- Generate order number if not provided
    IF NEW.order_number IS NULL THEN
        NEW.order_number := generate_order_number();
    END IF;
    
    -- Set day of week
    NEW.day_of_week := TO_CHAR(NEW.delivery_date, 'Day');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for order validation
CREATE TRIGGER validate_order_before_insert
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION validate_order_creation();

-- Function to update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
DECLARE
    order_total INTEGER;
BEGIN
    -- Calculate new total for the order
    SELECT COALESCE(SUM(subtotal), 0) INTO order_total
    FROM public.order_items
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);
    
    -- Update the order total
    UPDATE public.orders
    SET total_amount = order_total,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for order total updates
CREATE TRIGGER update_order_total_on_item_insert
    AFTER INSERT ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_item_update
    AFTER UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION update_order_total();

CREATE TRIGGER update_order_total_on_item_delete
    AFTER DELETE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION update_order_total();