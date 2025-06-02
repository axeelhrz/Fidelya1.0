from flask import Blueprint, request, jsonify
from functools import wraps
import mysql.connector
from datetime import datetime, timedelta
import logging

# Configurar logging
logger = logging.getLogger(__name__)

# Crear blueprint para inventario
inventario_bp = Blueprint('inventario', __name__, url_prefix='/api/inventario')

def get_db_connection():
    """Obtiene conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='fruteria_user',
            password='fruteria_password',
            database='fruteria_nina',
            charset='utf8mb4',
            autocommit=False
        )
        return connection
    except mysql.connector.Error as err:
        logger.error(f"Error de conexión MySQL: {err}")
        return None

@inventario_bp.route('/resumen', methods=['GET'])
def obtener_resumen_inventario():
    """Obtener resumen completo del inventario con KPIs"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Total de productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0] or 0
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0] or 0
        
        # Productos sin stock
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual = 0 AND activo = TRUE
        """)
        productos_sin_stock = cursor.fetchone()[0] or 0
        
        # Valor total del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) 
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = float(cursor.fetchone()[0] or 0)
        
        # Stock total por unidades
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual), 0) 
            FROM productos WHERE activo = TRUE
        """)
        stock_total_unidades = float(cursor.fetchone()[0] or 0)
        
        # Distribución por categorías
        cursor.execute("""
            SELECT categoria, COUNT(*) as cantidad, 
                   COALESCE(SUM(stock_actual * precio_unitario), 0) as valor
            FROM productos 
            WHERE activo = TRUE 
            GROUP BY categoria
            ORDER BY cantidad DESC
        """)
        categorias = []
        for row in cursor.fetchall():
            categorias.append({
                'categoria': row[0],
                'cantidad_productos': row[1],
                'valor_total': float(row[2])
            })
        
        # Productos más vendidos (últimos 30 días)
        cursor.execute("""
            SELECT p.nombre, p.categoria, COALESCE(SUM(dv.cantidad), 0) as total_vendido,
                   COALESCE(SUM(dv.subtotal), 0) as ingresos_generados
            FROM productos p
            LEFT JOIN detalle_ventas dv ON p.id = dv.producto_id
            LEFT JOIN ventas v ON dv.venta_id = v.id
            WHERE p.activo = TRUE 
            AND (v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) OR v.fecha IS NULL)
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre, p.categoria
            HAVING total_vendido > 0
            ORDER BY total_vendido DESC
            LIMIT 10
        """)
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'nombre': row[0],
                'categoria': row[1],
                'cantidad_vendida': float(row[2]),
                'ingresos_generados': float(row[3])
            })
        
        # Movimientos recientes (últimos 7 días)
        cursor.execute("""
            SELECT COUNT(*) as total_movimientos,
                   SUM(CASE WHEN tipo = 'ingreso' THEN 1 ELSE 0 END) as ingresos,
                   SUM(CASE WHEN tipo = 'egreso' THEN 1 ELSE 0 END) as egresos,
                   SUM(CASE WHEN tipo = 'ajuste' THEN 1 ELSE 0 END) as ajustes
            FROM movimientos_stock 
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        """)
        movimientos_data = cursor.fetchone()
        movimientos_recientes = {
            'total': movimientos_data[0] or 0,
            'ingresos': movimientos_data[1] or 0,
            'egresos': movimientos_data[2] or 0,
            'ajustes': movimientos_data[3] or 0
        }
        
        # Proveedores con más productos
        cursor.execute("""
            SELECT pr.nombre, COUNT(p.id) as productos_suministrados,
                   COALESCE(SUM(p.stock_actual * p.precio_unitario), 0) as valor_inventario
            FROM proveedores pr
            INNER JOIN productos p ON pr.id = p.proveedor_id
            WHERE p.activo = TRUE AND pr.activo = TRUE
            GROUP BY pr.id, pr.nombre
            ORDER BY productos_suministrados DESC
            LIMIT 5
        """)
        proveedores_principales = []
        for row in cursor.fetchall():
            proveedores_principales.append({
                'nombre': row[0],
                'productos_suministrados': row[1],
                'valor_inventario': float(row[2])
            })
        
        # Alertas y recomendaciones
        alertas = []
        
        if productos_sin_stock > 0:
            alertas.append({
                'tipo': 'critico',
                'mensaje': f'{productos_sin_stock} productos sin stock',
                'accion': 'Reabastecer inmediatamente'
            })
        
        if productos_stock_bajo > 0:
            alertas.append({
                'tipo': 'advertencia',
                'mensaje': f'{productos_stock_bajo} productos con stock bajo',
                'accion': 'Planificar reposición'
            })
        
        # Tendencias (comparación con mes anterior)
        cursor.execute("""
            SELECT 
                COUNT(CASE WHEN DATE(creado) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as productos_nuevos_mes,
                COUNT(CASE WHEN DATE(creado) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
                           AND DATE(creado) < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as productos_mes_anterior
            FROM productos WHERE activo = TRUE
        """)
        tendencias_data = cursor.fetchone()
        productos_nuevos_mes = tendencias_data[0] or 0
        productos_mes_anterior = tendencias_data[1] or 0
        
        tendencia_productos = 0
        if productos_mes_anterior > 0:
            tendencia_productos = ((productos_nuevos_mes - productos_mes_anterior) / productos_mes_anterior) * 100
        
        resumen = {
            'estadisticas_generales': {
                'total_productos': total_productos,
                'productos_stock_bajo': productos_stock_bajo,
                'productos_sin_stock': productos_sin_stock,
                'valor_inventario': valor_inventario,
                'stock_total_unidades': stock_total_unidades
            },
            'distribucion_categorias': categorias,
            'productos_mas_vendidos': productos_mas_vendidos,
            'movimientos_recientes': movimientos_recientes,
            'proveedores_principales': proveedores_principales,
            'alertas': alertas,
            'tendencias': {
                'productos_nuevos_mes': productos_nuevos_mes,
                'tendencia_porcentual': round(tendencia_productos, 2)
            },
            'fecha_actualizacion': datetime.now().isoformat()
        }
        
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo resumen de inventario: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@inventario_bp.route('/productos/busqueda-avanzada', methods=['GET'])
def busqueda_avanzada_productos():
    """Búsqueda avanzada de productos con múltiples filtros"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        busqueda = request.args.get('q', '').strip()
        categoria = request.args.get('categoria')
        proveedor_id = request.args.get('proveedor_id')
        stock_minimo = request.args.get('stock_minimo', type=int)
        stock_maximo = request.args.get('stock_maximo', type=int)
        precio_minimo = request.args.get('precio_minimo', type=float)
        precio_maximo = request.args.get('precio_maximo', type=float)
        solo_stock_bajo = request.args.get('solo_stock_bajo', 'false').lower() == 'true'
        solo_sin_stock = request.args.get('solo_sin_stock', 'false').lower() == 'true'
        orden = request.args.get('orden', 'nombre')
        direccion = request.args.get('direccion', 'asc')
        limite = request.args.get('limite', 50, type=int)
        pagina = request.args.get('pagina', 1, type=int)
        
        # Construir consulta base
        query = """
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, p.stock_minimo, 
                   p.precio_unitario, p.activo, p.creado, p.actualizado,
                   pr.nombre as proveedor_nombre, pr.id as proveedor_id,
                   CASE WHEN p.stock_actual <= p.stock_minimo THEN 1 ELSE 0 END as stock_bajo,
                   CASE WHEN p.stock_actual = 0 THEN 1 ELSE 0 END as sin_stock,
                   (p.stock_actual * p.precio_unitario) as valor_stock
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE
        """
        params = []
        
        # Aplicar filtros
        if busqueda:
            query += " AND (p.nombre LIKE %s OR pr.nombre LIKE %s)"
            busqueda_param = f"%{busqueda}%"
            params.extend([busqueda_param, busqueda_param])
        
        if categoria:
            query += " AND p.categoria = %s"
            params.append(categoria)
        
        if proveedor_id:
            query += " AND p.proveedor_id = %s"
            params.append(proveedor_id)
        
        if stock_minimo is not None:
            query += " AND p.stock_actual >= %s"
            params.append(stock_minimo)
        
        if stock_maximo is not None:
            query += " AND p.stock_actual <= %s"
            params.append(stock_maximo)
        
        if precio_minimo is not None:
            query += " AND p.precio_unitario >= %s"
            params.append(precio_minimo)
        
        if precio_maximo is not None:
            query += " AND p.precio_unitario <= %s"
            params.append(precio_maximo)
        
        if solo_stock_bajo:
            query += " AND p.stock_actual <= p.stock_minimo"
        
        if solo_sin_stock:
            query += " AND p.stock_actual = 0"
        
        # Ordenamiento
        campos_orden_validos = ['nombre', 'categoria', 'stock_actual', 'precio_unitario', 'creado', 'valor_stock']
        if orden in campos_orden_validos:
            direccion_sql = 'DESC' if direccion.lower() == 'desc' else 'ASC'
            query += f" ORDER BY p.{orden} {direccion_sql}"
        else:
            query += " ORDER BY p.nombre ASC"
        
        # Paginación
        offset = (pagina - 1) * limite
        query += " LIMIT %s OFFSET %s"
        params.extend([limite, offset])
        
        cursor.execute(query, params)
        productos = []
        
        for row in cursor.fetchall():
            producto = {
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'unidad': row[3],
                'stock_actual': float(row[4]),
                'stock_minimo': float(row[5]),
                'precio_unitario': float(row[6]),
                'activo': bool(row[7]),
                'creado': row[8].isoformat() if row[8] else None,
                'actualizado': row[9].isoformat() if row[9] else None,
                'proveedor': {
                    'id': row[11],
                    'nombre': row[10] or 'Sin proveedor'
                },
                'stock_bajo': bool(row[12]),
                'sin_stock': bool(row[13]),
                'valor_stock': float(row[14])
            }
            productos.append(producto)
        
        # Obtener total de registros para paginación
        query_count = """
            SELECT COUNT(*) FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE
        """
        params_count = []
        
        # Aplicar los mismos filtros para el conteo
        if busqueda:
            query_count += " AND (p.nombre LIKE %s OR pr.nombre LIKE %s)"
            params_count.extend([busqueda_param, busqueda_param])
        
        if categoria:
            query_count += " AND p.categoria = %s"
            params_count.append(categoria)
        
        if proveedor_id:
            query_count += " AND p.proveedor_id = %s"
            params_count.append(proveedor_id)
        
        if stock_minimo is not None:
            query_count += " AND p.stock_actual >= %s"
            params_count.append(stock_minimo)
        
        if stock_maximo is not None:
            query_count += " AND p.stock_actual <= %s"
            params_count.append(stock_maximo)
        
        if precio_minimo is not None:
            query_count += " AND p.precio_unitario >= %s"
            params_count.append(precio_minimo)
        
        if precio_maximo is not None:
            query_count += " AND p.precio_unitario <= %s"
            params_count.append(precio_maximo)
        
        if solo_stock_bajo:
            query_count += " AND p.stock_actual <= p.stock_minimo"
        
        if solo_sin_stock:
            query_count += " AND p.stock_actual = 0"
        
        cursor.execute(query_count, params_count)
        total_registros = cursor.fetchone()[0]
        
        resultado = {
            'productos': productos,
            'paginacion': {
                'pagina_actual': pagina,
                'limite': limite,
                'total_registros': total_registros,
                'total_paginas': (total_registros + limite - 1) // limite,
                'tiene_siguiente': pagina * limite < total_registros,
                'tiene_anterior': pagina > 1
            },
            'filtros_aplicados': {
                'busqueda': busqueda,
                'categoria': categoria,
                'proveedor_id': proveedor_id,
                'solo_stock_bajo': solo_stock_bajo,
                'solo_sin_stock': solo_sin_stock
            }
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error en búsqueda avanzada: {e}")
        return jsonify({'productos': [], 'error': 'Error en la búsqueda'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@inventario_bp.route('/productos/operaciones-masivas', methods=['POST'])
def operaciones_masivas_productos():
    """Realizar operaciones masivas en productos"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('operacion') or not data.get('productos_ids'):
            return jsonify({'error': 'Faltan datos requeridos'}), 400
        
        operacion = data['operacion']
        productos_ids = data['productos_ids']
        parametros = data.get('parametros', {})
        
        if not isinstance(productos_ids, list) or len(productos_ids) == 0:
            return jsonify({'error': 'Lista de productos inválida'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        resultados = {
            'exitosos': 0,
            'fallidos': 0,
            'errores': []
        }
        
        if operacion == 'actualizar_precios':
            # Actualización masiva de precios
            porcentaje_cambio = parametros.get('porcentaje_cambio', 0)
            precio_fijo = parametros.get('precio_fijo')
            
            for producto_id in productos_ids:
                try:
                    if precio_fijo is not None:
                        cursor.execute(
                            "UPDATE productos SET precio_unitario = %s WHERE id = %s",
                            (precio_fijo, producto_id)
                        )
                    elif porcentaje_cambio != 0:
                        cursor.execute("""
                            UPDATE productos 
                            SET precio_unitario = precio_unitario * (1 + %s / 100) 
                            WHERE id = %s
                        """, (porcentaje_cambio, producto_id))
                    
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        elif operacion == 'cambiar_categoria':
            # Cambio masivo de categoría
            nueva_categoria = parametros.get('categoria')
            if nueva_categoria not in ['frutas', 'verduras', 'otros']:
                return jsonify({'error': 'Categoría inválida'}), 400
            
            for producto_id in productos_ids:
                try:
                    cursor.execute(
                        "UPDATE productos SET categoria = %s WHERE id = %s",
                        (nueva_categoria, producto_id)
                    )
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        elif operacion == 'ajustar_stock_minimo':
            # Ajuste masivo de stock mínimo
            nuevo_stock_minimo = parametros.get('stock_minimo')
            porcentaje_stock_actual = parametros.get('porcentaje_stock_actual')
            
            for producto_id in productos_ids:
                try:
                    if nuevo_stock_minimo is not None:
                        cursor.execute(
                            "UPDATE productos SET stock_minimo = %s WHERE id = %s",
                            (nuevo_stock_minimo, producto_id)
                        )
                    elif porcentaje_stock_actual is not None:
                        cursor.execute("""
                            UPDATE productos 
                            SET stock_minimo = ROUND(stock_actual * %s / 100) 
                            WHERE id = %s
                        """, (porcentaje_stock_actual, producto_id))
                    
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        elif operacion == 'desactivar':
            # Desactivación masiva
            for producto_id in productos_ids:
                try:
                    cursor.execute(
                        "UPDATE productos SET activo = FALSE WHERE id = %s",
                        (producto_id,)
                    )
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        else:
            return jsonify({'error': 'Operación no válida'}), 400
        
        connection.commit()
        
        response = jsonify({
            'mensaje': f'Operación {operacion} completada',
            'resultados': resultados
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error en operaciones masivas: {e}")
        if connection:
            connection.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@inventario_bp.route('/reportes/movimientos-detallado', methods=['GET'])
def reporte_movimientos_detallado():
    """Generar reporte detallado de movimientos de stock"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Parámetros de filtros
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        producto_id = request.args.get('producto_id')
        tipo_movimiento = request.args.get('tipo')
        usuario_id = request.args.get('usuario_id')
        
        # Consulta base
        query = """
            SELECT ms.id, ms.fecha, ms.tipo, ms.cantidad, ms.motivo,
                   p.nombre as producto_nombre, p.categoria, p.unidad,
                   u.nombre as usuario_nombre,
                   ms.referencia_tipo, ms.referencia_id,
                   p.precio_unitario,
                   (ms.cantidad * p.precio_unitario) as valor_movimiento
            FROM movimientos_stock ms
            INNER JOIN productos p ON ms.producto_id = p.id
            LEFT JOIN usuarios u ON ms.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        # Aplicar filtros
        if fecha_inicio:
            query += " AND DATE(ms.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(ms.fecha) <= %s"
            params.append(fecha_fin)
        
        if producto_id:
            query += " AND ms.producto_id = %s"
            params.append(producto_id)
        
        if tipo_movimiento:
            query += " AND ms.tipo = %s"
            params.append(tipo_movimiento)
        
        if usuario_id:
            query += " AND ms.usuario_id = %s"
            params.append(usuario_id)
        
        query += " ORDER BY ms.fecha DESC, ms.id DESC"
        
        cursor.execute(query, params)
        movimientos = []
        
        total_ingresos = 0
        total_egresos = 0
        total_ajustes = 0
        valor_total_movimientos = 0
        
        for row in cursor.fetchall():
            movimiento = {
                'id': row[0],
                'fecha': row[1].isoformat() if row[1] else None,
                'tipo': row[2],
                'cantidad': float(row[3]),
                'motivo': row[4] or '',
                'producto': {
                    'nombre': row[5],
                    'categoria': row[6],
                    'unidad': row[7]
                },
                'usuario_nombre': row[8] or 'Sistema',
                'referencia': {
                    'tipo': row[9],
                    'id': row[10]
                },
                'precio_unitario': float(row[11]),
                'valor_movimiento': float(row[12])
            }
            movimientos.append(movimiento)
            
            # Acumular estadísticas
            if row[2] == 'ingreso':
                total_ingresos += float(row[3])
            elif row[2] == 'egreso':
                total_egresos += float(row[3])
            else:
                total_ajustes += float(row[3])
            
            valor_total_movimientos += float(row[12])
        
        # Estadísticas del reporte
        estadisticas = {
            'total_movimientos': len(movimientos),
            'total_ingresos': total_ingresos,
            'total_egresos': total_egresos,
            'total_ajustes': total_ajustes,
            'valor_total_movimientos': valor_total_movimientos,
            'periodo': {
                'fecha_inicio': fecha_inicio,
                'fecha_fin': fecha_fin
            }
        }
        
        # Resumen por categorías
        cursor.execute("""
            SELECT p.categoria, ms.tipo,
                   COUNT(*) as cantidad_movimientos,
                   SUM(ms.cantidad) as total_unidades,
                   SUM(ms.cantidad * p.precio_unitario) as valor_total
            FROM movimientos_stock ms
            INNER JOIN productos p ON ms.producto_id = p.id
            WHERE 1=1
        """ + (" AND DATE(ms.fecha) >= %s" if fecha_inicio else "") +
              (" AND DATE(ms.fecha) <= %s" if fecha_fin else "") + """
            GROUP BY p.categoria, ms.tipo
            ORDER BY p.categoria, ms.tipo
        """, [p for p in [fecha_inicio, fecha_fin] if p])
        
        resumen_categorias = {}
        for row in cursor.fetchall():
            categoria = row[0]
            tipo = row[1]
            if categoria not in resumen_categorias:
                resumen_categorias[categoria] = {}
            resumen_categorias[categoria][tipo] = {
                'cantidad_movimientos': row[2],
                'total_unidades': float(row[3]),
                'valor_total': float(row[4])
            }
        
        reporte = {
            'movimientos': movimientos,
            'estadisticas': estadisticas,
            'resumen_por_categorias': resumen_categorias,
            'fecha_generacion': datetime.now().isoformat()
        }
        
        response = jsonify(reporte)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error generando reporte de movimientos: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()