-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- =====================================================
-- POLÍTICAS PARA USUARIOS
-- =====================================================

-- Los usuarios pueden ver su propia información
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.read')
    );

-- Los usuarios pueden actualizar su propia información
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.update')
    );

-- Solo admins pueden crear usuarios
CREATE POLICY "users_insert_admin" ON public.users
    FOR INSERT WITH CHECK (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.create')
    );

-- Solo super admins pueden eliminar usuarios
CREATE POLICY "users_delete_super_admin" ON public.users
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.delete')
    );

-- =====================================================
-- POLÍTICAS PARA ESTUDIANTES
-- =====================================================

-- Los usuarios pueden ver sus propios estudiantes
CREATE POLICY "students_select_own" ON public.students
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.read')
    );

-- Los usuarios pueden crear estudiantes para sí mismos
CREATE POLICY "students_insert_own" ON public.students
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.create')
    );

-- Los usuarios pueden actualizar sus propios estudiantes
CREATE POLICY "students_update_own" ON public.students
    FOR UPDATE USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'usuarios.update')
    );

-- Solo admins pueden eliminar estudiantes
CREATE POLICY "students_delete_admin" ON public.students
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'usuarios.delete')
    );

-- =====================================================
-- POLÍTICAS PARA ELEMENTOS DEL MENÚ
-- =====================================================

-- Todos pueden ver elementos del menú disponibles
CREATE POLICY "menu_items_select_all" ON public.menu_items
    FOR SELECT USING (true);

-- Solo admins pueden modificar elementos del menú
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

-- =====================================================
-- POLÍTICAS PARA PEDIDOS
-- =====================================================

-- Los usuarios pueden ver sus propios pedidos
CREATE POLICY "orders_select_own" ON public.orders
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.read')
    );

-- Los usuarios pueden crear pedidos para sí mismos
CREATE POLICY "orders_insert_own" ON public.orders
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.create')
    );

-- Los usuarios pueden actualizar sus propios pedidos pendientes
CREATE POLICY "orders_update_own" ON public.orders
    FOR UPDATE USING (
        (auth.uid() = guardian_id AND status = 'pending') OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.update')
    );

-- Solo admins pueden eliminar pedidos
CREATE POLICY "orders_delete_admin" ON public.orders
    FOR DELETE USING (
        public.user_has_permission(public.get_current_user_email(), 'pedidos.delete')
    );

-- =====================================================
-- POLÍTICAS PARA TRANSACCIONES DE PAGO
-- =====================================================

-- Los usuarios pueden ver sus propias transacciones
CREATE POLICY "payment_transactions_select_own" ON public.payment_transactions
    FOR SELECT USING (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.read')
    );

-- Los usuarios pueden crear transacciones para sí mismos
CREATE POLICY "payment_transactions_insert_own" ON public.payment_transactions
    FOR INSERT WITH CHECK (
        auth.uid() = guardian_id OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.create')
    );

-- Solo el sistema puede actualizar transacciones
CREATE POLICY "payment_transactions_update_system" ON public.payment_transactions
    FOR UPDATE USING (
        public.user_has_permission(public.get_current_user_email(), 'pedidos.update')
    );

-- =====================================================
-- POLÍTICAS PARA RELACIONES PEDIDOS-TRANSACCIONES
-- =====================================================

-- Los usuarios pueden ver sus propias relaciones
CREATE POLICY "order_transactions_select_own" ON public.order_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id AND o.guardian_id = auth.uid()
        ) OR
        public.user_has_permission(public.get_current_user_email(), 'pedidos.read')
    );

-- Solo el sistema puede crear/actualizar relaciones
CREATE POLICY "order_transactions_insert_system" ON public.order_transactions
    FOR INSERT WITH CHECK (
        public.user_has_permission(public.get_current_user_email(), 'pedidos.create')
    );

-- =====================================================
-- POLÍTICAS PARA SISTEMA DE PERMISOS
-- =====================================================

-- Todos pueden ver permisos y roles (para UI)
CREATE POLICY "permissions_select_all" ON public.permissions
    FOR SELECT USING (true);

CREATE POLICY "roles_select_all" ON public.roles
    FOR SELECT USING (true);

CREATE POLICY "role_permissions_select_all" ON public.role_permissions
    FOR SELECT USING (true);

-- Solo super admins pueden modificar permisos y roles
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

-- =====================================================
-- POLÍTICAS PARA CONFIGURACIÓN DEL SISTEMA
-- =====================================================

-- Todos pueden ver configuración pública
CREATE POLICY "system_config_select_public" ON public.system_config
    FOR SELECT USING (
        is_public = true OR
        public.user_has_permission(public.get_current_user_email(), 'configuracion.read')
    );

-- Solo admins pueden modificar configuración
CREATE POLICY "system_config_modify_admin" ON public.system_config
    FOR ALL USING (
        public.user_has_permission(public.get_current_user_email(), 'configuracion.update')
    );

-- =====================================================
-- POLÍTICAS PARA LOGS DE ACTIVIDAD
-- =====================================================

-- Los usuarios pueden ver sus propios logs
CREATE POLICY "activity_logs_select_own" ON public.activity_logs
    FOR SELECT USING (
        auth.uid() = user_id OR
        public.user_has_permission(public.get_current_user_email(), 'estadisticas.read')
    );

-- Solo el sistema puede insertar logs
CREATE POLICY "activity_logs_insert_system" ON public.activity_logs
    FOR INSERT WITH CHECK (true);
