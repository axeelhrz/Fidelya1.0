-- =====================================================
-- DIAGNÓSTICO DE FUNCIONES - CASINO ESCOLAR
-- =====================================================

-- 1. Verificar qué funciones existen actualmente
DO $$
DECLARE
  func_record RECORD;
BEGIN
  RAISE NOTICE '=== FUNCIONES EXISTENTES ===';
  
  FOR func_record IN 
    SELECT 
      p.proname as function_name,
      pg_get_function_arguments(p.oid) as arguments,
      pg_get_function_result(p.oid) as return_type
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN (
      'can_place_order',
      'generate_order_number', 
      'get_kitchen_report',
      'get_orders_summary',
      'get_pedidos_agrupados',
      'check_menu_availability',
      'get_system_stats',
      'cleanup_old_data',
      'validate_data_integrity'
    )
    ORDER BY p.proname
  LOOP
    RAISE NOTICE 'Función: % - Argumentos: % - Retorna: %', 
      func_record.function_name, 
      func_record.arguments, 
      func_record.return_type;
  END LOOP;
END $$;

-- 2. Probar cada función individualmente
DO $$
BEGIN
  RAISE NOTICE '=== PROBANDO FUNCIONES ===';
  
  -- Probar can_place_order
  BEGIN
    PERFORM can_place_order(CURRENT_DATE + 1);
    RAISE NOTICE '✅ can_place_order: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ can_place_order: ERROR - %', SQLERRM;
  END;
  
  -- Probar generate_order_number
  BEGIN
    PERFORM generate_order_number();
    RAISE NOTICE '✅ generate_order_number: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ generate_order_number: ERROR - %', SQLERRM;
  END;
  
  -- Probar get_kitchen_report
  BEGIN
    PERFORM * FROM get_kitchen_report(CURRENT_DATE);
    RAISE NOTICE '✅ get_kitchen_report: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ get_kitchen_report: ERROR - %', SQLERRM;
  END;
  
  -- Probar get_orders_summary
  BEGIN
    PERFORM * FROM get_orders_summary(CURRENT_DATE, CURRENT_DATE + 7);
    RAISE NOTICE '✅ get_orders_summary: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ get_orders_summary: ERROR - %', SQLERRM;
  END;
  
  -- Probar check_menu_availability
  BEGIN
    PERFORM * FROM check_menu_availability(CURRENT_DATE);
    RAISE NOTICE '✅ check_menu_availability: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ check_menu_availability: ERROR - %', SQLERRM;
  END;
  
  -- Probar get_system_stats
  BEGIN
    PERFORM * FROM get_system_stats();
    RAISE NOTICE '✅ get_system_stats: OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ get_system_stats: ERROR - %', SQLERRM;
  END;
  
END $$;

-- 3. Verificar permisos
DO $$
DECLARE
  perm_record RECORD;
BEGIN
  RAISE NOTICE '=== VERIFICANDO PERMISOS ===';
  
  FOR perm_record IN
    SELECT 
      p.proname as function_name,
      array_agg(pr.rolname) as granted_to
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    LEFT JOIN pg_proc_acl pa ON p.oid = pa.oid
    LEFT JOIN pg_roles pr ON pa.grantee = pr.oid
    WHERE n.nspname = 'public'
    AND p.proname LIKE '%order%' OR p.proname LIKE '%kitchen%' OR p.proname LIKE '%menu%'
    GROUP BY p.proname
    ORDER BY p.proname
  LOOP
    RAISE NOTICE 'Función: % - Permisos: %', 
      perm_record.function_name, 
      COALESCE(array_to_string(perm_record.granted_to, ', '), 'Sin permisos específicos');
  END LOOP;
END $$;

-- 4. Verificar dependencias de tablas
DO $$
BEGIN
  RAISE NOTICE '=== VERIFICANDO TABLAS REQUERIDAS ===';
  
  -- Verificar guardians
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'guardians') THEN
    RAISE NOTICE '✅ Tabla guardians: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tabla guardians: NOT EXISTS';
  END IF;
  
  -- Verificar students
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'students') THEN
    RAISE NOTICE '✅ Tabla students: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tabla students: NOT EXISTS';
  END IF;
  
  -- Verificar products
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
    RAISE NOTICE '✅ Tabla products: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tabla products: NOT EXISTS';
  END IF;
  
  -- Verificar orders
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    RAISE NOTICE '✅ Tabla orders: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tabla orders: NOT EXISTS';
  END IF;
  
  -- Verificar settings
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
    RAISE NOTICE '✅ Tabla settings: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tabla settings: NOT EXISTS';
  END IF;
  
END $$;

-- 5. Verificar tipos ENUM
DO $$
BEGIN
  RAISE NOTICE '=== VERIFICANDO TIPOS ENUM ===';
  
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
    RAISE NOTICE '✅ Tipo product_type: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tipo product_type: NOT EXISTS';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    RAISE NOTICE '✅ Tipo order_status: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tipo order_status: NOT EXISTS';
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    RAISE NOTICE '✅ Tipo payment_status: EXISTS';
  ELSE
    RAISE NOTICE '❌ Tipo payment_status: NOT EXISTS';
  END IF;
  
END $$;
