from backend.database.connection_pool import db_pool
from backend.cache.redis_cache import cached
import logging

logger = logging.getLogger(__name__)

class OptimizedQueries:
    
    @staticmethod
    @cached(ttl=300, key_prefix="productos")
    def get_productos_with_stats(filtros=None):
        """Obtener productos con estadísticas optimizado"""
        with db_pool.get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            
            # Query optimizada con JOINs y subconsultas
            query = """
            SELECT 
                p.id,
                p.nombre,
                p.categoria,
                p.unidad,
                p.stock_actual,
                p.stock_minimo,
                p.precio_unitario,
                p.precio_compra,
                p.codigo_barras,
                p.descripcion,
                p.activo,
                p.creado,
                pr.nombre as proveedor_nombre,
                pr.id as proveedor_id,
                CASE WHEN p.stock_actual <= p.stock_minimo THEN 1 ELSE 0 END as stock_bajo,
                (p.stock_actual * p.precio_unitario) as valor_stock,
                COALESCE(ventas_stats.total_vendido, 0) as total_vendido_mes,
                COALESCE(ventas_stats.ingresos_generados, 0) as ingresos_mes
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            LEFT JOIN (
                SELECT 
                    dv.producto_id,
                    SUM(dv.cantidad) as total_vendido,
                    SUM(dv.subtotal) as ingresos_generados
                FROM detalle_ventas dv
                INNER JOIN ventas v ON dv.venta_id = v.id
                WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                AND v.estado = 'completada'
                GROUP BY dv.producto_id
            ) ventas_stats ON p.id = ventas_stats.producto_id
            WHERE p.activo = TRUE
            """
            
            params = []
            
            # Aplicar filtros dinámicamente
            if filtros:
                if filtros.get('categoria'):
                    query += " AND p.categoria = %s"
                    params.append(filtros['categoria'])
                
                if filtros.get('busqueda'):
                    query += " AND (p.nombre LIKE %s OR p.codigo_barras LIKE %s)"
                    busqueda = f"%{filtros['busqueda']}%"
                    params.extend([busqueda, busqueda])
                
                if filtros.get('stock_bajo'):
                    query += " AND p.stock_actual <= p.stock_minimo"
                
                if filtros.get('proveedor_id'):
                    query += " AND p.proveedor_id = %s"
                    params.append(filtros['proveedor_id'])
            
            # Ordenamiento y límite
            orden = filtros.get('orden', 'nombre') if filtros else 'nombre'
            direccion = filtros.get('direccion', 'asc') if filtros else 'asc'
            limite = filtros.get('limite', 100) if filtros else 100
            
            query += f" ORDER BY p.{orden} {direccion.upper()} LIMIT %s"
            params.append(limite)
            
            cursor.execute(query, params)
            return cursor.fetchall()
    
    @staticmethod
    @cached(ttl=600, key_prefix="dashboard")
    def get_dashboard_data(user_id):
        """Obtener datos del dashboard optimizado"""
        with db_pool.get_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            
            # Una sola consulta para múltiples estadísticas
            cursor.execute("""
            SELECT 
                -- Ventas del día
                (SELECT COUNT(*) FROM ventas WHERE DATE(fecha) = CURDATE() AND estado = 'completada') as ventas_hoy_count,
                (SELECT COALESCE(SUM(total), 0) FROM ventas WHERE DATE(fecha) = CURDATE() AND estado = 'completada') as ventas_hoy_total,
                
                -- Ventas del mes
                (SELECT COUNT(*) FROM ventas WHERE YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE()) AND estado = 'completada') as ventas_mes_count,
                (SELECT COALESCE(SUM(total), 0) FROM ventas WHERE YEAR(fecha) = YEAR(CURDATE()) AND MONTH(fecha) = MONTH(CURDATE()) AND estado = 'completada') as ventas_mes_total,
                
                -- Productos
                (SELECT COUNT(*) FROM productos WHERE activo = TRUE) as total_productos,
                (SELECT COUNT(*) FROM productos WHERE activo = TRUE AND stock_actual <= stock_minimo) as productos_stock_bajo,
                
                -- Valor inventario
                (SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) FROM productos WHERE activo = TRUE) as valor_inventario
            """)
            
            stats = cursor.fetchone()
            
            # Últimas ventas con JOIN optimizado
            cursor.execute("""
            SELECT v.id, v.numero_venta, v.total, v.fecha, 
                   COALESCE(c.nombre, 'Cliente General') as cliente_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.estado = 'completada'
            ORDER BY v.fecha DESC
            LIMIT 5
            """)
            
            ultimas_ventas = cursor.fetchall()
            
            # Productos más vendidos
            cursor.execute("""
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY total_vendido DESC
            LIMIT 5
            """)
            
            productos_mas_vendidos = cursor.fetchall()
            
            return {
                'ventas_hoy': {
                    'cantidad': stats['ventas_hoy_count'],
                    'total': float(stats['ventas_hoy_total'])
                },
                'ventas_mes': {
                    'cantidad': stats['ventas_mes_count'],
                    'total': float(stats['ventas_mes_total'])
                },
                'total_productos': stats['total_productos'],
                'productos_stock_bajo': stats['productos_stock_bajo'],
                'valor_inventario': float(stats['valor_inventario']),
                'ultimas_ventas': [dict(venta) for venta in ultimas_ventas],
                'productos_mas_vendidos': [dict(producto) for producto in productos_mas_vendidos]
            }
    
    @staticmethod
    def invalidate_cache_patterns(patterns):
        """Invalidar patrones de cache relacionados"""
        from backend.cache.redis_cache import cache
        for pattern in patterns:
            cache.delete_pattern(pattern)