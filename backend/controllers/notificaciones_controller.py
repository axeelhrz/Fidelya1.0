import mysql.connector
from datetime import datetime, timedelta
import logging
import smtplib
import os

# Configurar logging
logger = logging.getLogger(__name__)

# Configuración de base de datos
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'Admin2024!'),
    'database': os.environ.get('DB_NAME', 'fruteria_nina'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': False,
    'raise_on_warnings': True
}

def get_db_connection():
    """Crear conexión a la base de datos MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
        else:
            logger.error("No se pudo establecer conexión con la base de datos")
            return None
    except mysql.connector.Error as e:
        logger.error(f"Error de conexión MySQL: {e}")
        return None
    except Exception as e:
        logger.error(f"Error inesperado de conexión: {e}")
        return None

class NotificacionesController:
    """Controlador para gestión de notificaciones"""
    
    @staticmethod
    def obtener_notificaciones(usuario_id, filtros=None):
        """Obtener todas las notificaciones del usuario"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return []
                
            cursor = connection.cursor()
            
            # Construir consulta base
            query = """
                SELECT id, tipo, titulo, mensaje, leida, canal, creada
                FROM notificaciones
                WHERE usuario_id = %s
            """
            params = [usuario_id]
            
            # Aplicar filtros
            if filtros:
                if filtros.get('tipo'):
                    query += " AND tipo = %s"
                    params.append(filtros['tipo'])
                
                if filtros.get('leida') is not None:
                    query += " AND leida = %s"
                    params.append(filtros['leida'])
                
                if filtros.get('fecha_desde'):
                    query += " AND DATE(creada) >= %s"
                    params.append(filtros['fecha_desde'])
                
                if filtros.get('fecha_hasta'):
                    query += " AND DATE(creada) <= %s"
                    params.append(filtros['fecha_hasta'])
            
            query += " ORDER BY creada DESC"
            
            # Aplicar límite
            limite = filtros.get('limite', 50) if filtros else 50
            query += " LIMIT %s"
            params.append(limite)
            
            cursor.execute(query, params)
            
            notificaciones = []
            for row in cursor.fetchall():
                notificacion = {
                    'id': row[0],
                    'tipo': row[1],
                    'titulo': row[2],
                    'mensaje': row[3],
                    'leida': bool(row[4]),
                    'canal': row[5],
                    'creada': row[6].isoformat() if row[6] else None
                }
                notificaciones.append(notificacion)
            
            return notificaciones
            
        except Exception as e:
            logger.error(f"Error obteniendo notificaciones: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def contar_no_leidas(usuario_id):
        """Contar notificaciones no leídas"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return 0
                
            cursor = connection.cursor()
            
            cursor.execute("""
                SELECT COUNT(*) FROM notificaciones 
                WHERE usuario_id = %s AND leida = FALSE
            """, (usuario_id,))
            
            count = cursor.fetchone()[0]
            return count or 0
            
        except Exception as e:
            logger.error(f"Error contando notificaciones no leídas: {e}")
            return 0
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def marcar_como_leidas(usuario_id, notificacion_ids=None):
        """Marcar notificaciones como leídas"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            if notificacion_ids:
                # Marcar notificaciones específicas
                placeholders = ','.join(['%s'] * len(notificacion_ids))
                query = f"""
                    UPDATE notificaciones 
                    SET leida = TRUE 
                    WHERE usuario_id = %s AND id IN ({placeholders})
                """
                params = [usuario_id] + notificacion_ids
            else:
                # Marcar todas como leídas
                query = """
                    UPDATE notificaciones 
                    SET leida = TRUE 
                    WHERE usuario_id = %s
                """
                params = [usuario_id]
            
            cursor.execute(query, params)
            connection.commit()
            
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error marcando notificaciones como leídas: {e}")
            if connection:
                connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def crear_notificacion(usuario_id, tipo, titulo, mensaje, canal='web'):
        """Crear nueva notificación"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            
            cursor.execute("""
                INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, canal)
                VALUES (%s, %s, %s, %s, %s)
            """, (usuario_id, tipo, titulo, mensaje, canal))
            
            notificacion_id = cursor.lastrowid
            connection.commit()
            
            logger.info(f"Notificación creada: {notificacion_id} para usuario {usuario_id}")
            return notificacion_id
            
        except Exception as e:
            logger.error(f"Error creando notificación: {e}")
            if connection:
                connection.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def obtener_configuracion(usuario_id):
        """Obtener configuración de notificaciones del usuario"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            
            cursor.execute("""
                SELECT recibir_email, recibir_sms, telefono, frecuencia
                FROM preferencias_notificaciones
                WHERE usuario_id = %s
            """, (usuario_id,))
            
            row = cursor.fetchone()
            
            if row:
                return {
                    'recibir_email': bool(row[0]),
                    'recibir_sms': bool(row[1]),
                    'telefono': row[2] or '',
                    'frecuencia': row[3]
                }
            else:
                # Crear configuración por defecto
                cursor.execute("""
                    INSERT INTO preferencias_notificaciones (usuario_id)
                    VALUES (%s)
                """, (usuario_id,))
                connection.commit()
                
                return {
                    'recibir_email': True,
                    'recibir_sms': False,
                    'telefono': '',
                    'frecuencia': 'inmediata'
                }
            
        except Exception as e:
            logger.error(f"Error obteniendo configuración: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def actualizar_configuracion(usuario_id, configuracion):
        """Actualizar configuración de notificaciones"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            # Verificar si existe configuración
            cursor.execute("""
                SELECT id FROM preferencias_notificaciones WHERE usuario_id = %s
            """, (usuario_id,))
            
            if cursor.fetchone():
                # Actualizar existente
                cursor.execute("""
                    UPDATE preferencias_notificaciones 
                    SET recibir_email = %s, recibir_sms = %s, telefono = %s, frecuencia = %s
                    WHERE usuario_id = %s
                """, (
                    configuracion.get('recibir_email', True),
                    configuracion.get('recibir_sms', False),
                    configuracion.get('telefono', ''),
                    configuracion.get('frecuencia', 'inmediata'),
                    usuario_id
                ))
            else:
                # Crear nueva
                cursor.execute("""
                    INSERT INTO preferencias_notificaciones 
                    (usuario_id, recibir_email, recibir_sms, telefono, frecuencia)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    usuario_id,
                    configuracion.get('recibir_email', True),
                    configuracion.get('recibir_sms', False),
                    configuracion.get('telefono', ''),
                    configuracion.get('frecuencia', 'inmediata')
                ))
            
            connection.commit()
            return True
            
        except Exception as e:
            logger.error(f"Error actualizando configuración: {e}")
            if connection:
                connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def verificar_alertas_stock():
        """Verificar y crear alertas de stock bajo"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return []
                
            cursor = connection.cursor()
            
            # Obtener productos con stock bajo
            cursor.execute("""
                SELECT id, nombre, stock_actual, stock_minimo, categoria
                FROM productos
                WHERE stock_actual <= stock_minimo AND activo = TRUE
            """)
            
            productos_stock_bajo = cursor.fetchall()
            
            if productos_stock_bajo:
                # Obtener todos los usuarios activos
                cursor.execute("""
                    SELECT id FROM usuarios WHERE activo = TRUE
                """)
                usuarios = cursor.fetchall()
                
                # Crear notificaciones para cada usuario
                for usuario in usuarios:
                    usuario_id = usuario[0]
                    
                    # Verificar si ya existe una notificación reciente de stock bajo
                    cursor.execute("""
                        SELECT id FROM notificaciones
                        WHERE usuario_id = %s AND tipo = 'stock' 
                        AND DATE(creada) = CURDATE()
                    """, (usuario_id,))
                    
                    if not cursor.fetchone():
                        # Crear notificación
                        titulo = f"⚠️ Alerta de Stock Bajo"
                        mensaje = f"{len(productos_stock_bajo)} producto(s) requieren reposición urgente"
                        
                        cursor.execute("""
                            INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
                            VALUES (%s, %s, %s, %s)
                        """, (usuario_id, 'stock', titulo, mensaje))
                
                connection.commit()
                logger.info(f"Alertas de stock creadas para {len(productos_stock_bajo)} productos")
            
            return productos_stock_bajo
            
        except Exception as e:
            logger.error(f"Error verificando alertas de stock: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def verificar_pagos_pendientes():
        """Verificar y crear alertas de pagos pendientes a proveedores"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return []
                
            cursor = connection.cursor()
            
            # Obtener compras pendientes de pago (ejemplo: más de 30 días)
            cursor.execute("""
                SELECT c.id, c.total, c.fecha, p.nombre as proveedor_nombre, p.correo, p.telefono
                FROM compras c
                INNER JOIN proveedores p ON c.proveedor_id = p.id
                WHERE c.estado = 'completada' 
                AND DATEDIFF(CURDATE(), c.fecha) > 30
                AND c.id NOT IN (
                    SELECT DISTINCT referencia_id 
                    FROM notificaciones 
                    WHERE tipo = 'pago' AND DATE(creada) = CURDATE()
                )
            """)
            
            compras_pendientes = cursor.fetchall()
            
            if compras_pendientes:
                # Obtener usuarios administradores
                cursor.execute("""
                    SELECT id FROM usuarios WHERE rol IN ('admin', 'operador') AND activo = TRUE
                """)
                usuarios = cursor.fetchall()
                
                for compra in compras_pendientes:
                    compra_id, total, fecha, proveedor, correo, telefono = compra
                    
                    for usuario in usuarios:
                        usuario_id = usuario[0]
                        
                        titulo = f"💰 Pago Pendiente - {proveedor}"
                        mensaje = f"Compra #{compra_id} por ${total:.2f} pendiente desde {fecha.strftime('%d/%m/%Y')}"
                        
                        cursor.execute("""
                            INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
                            VALUES (%s, %s, %s, %s)
                        """, (usuario_id, 'pago', titulo, mensaje))
                
                connection.commit()
                logger.info(f"Alertas de pagos pendientes creadas para {len(compras_pendientes)} compras")
            
            return compras_pendientes
            
        except Exception as e:
            logger.error(f"Error verificando pagos pendientes: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    @staticmethod
    def verificar_cobros_pendientes():
        """Verificar y crear alertas de cobros pendientes a clientes"""
        connection = None
        cursor = None
        
        try:
            connection = get_db_connection()
            if not connection:
                return []
                
            cursor = connection.cursor()
            
            # Obtener ventas a crédito pendientes
            cursor.execute("""
                SELECT v.id, v.total, v.fecha, c.nombre as cliente_nombre, c.correo, c.telefono
                FROM ventas v
                INNER JOIN clientes c ON v.cliente_id = c.id
                WHERE v.forma_pago = 'credito' 
                AND v.estado = 'completada'
                AND DATEDIFF(CURDATE(), v.fecha) > 15
                AND v.id NOT IN (
                    SELECT DISTINCT referencia_id 
                    FROM notificaciones 
                    WHERE tipo = 'cobro' AND DATE(creada) = CURDATE()
                )
            """)
            
            ventas_pendientes = cursor.fetchall()
            
            if ventas_pendientes:
                # Obtener usuarios administradores y cajeros
                cursor.execute("""
                    SELECT id FROM usuarios WHERE rol IN ('admin', 'cajero') AND activo = TRUE
                """)
                usuarios = cursor.fetchall()
                
                for venta in ventas_pendientes:
                    venta_id, total, fecha, cliente, correo, telefono = venta
                    
                    for usuario in usuarios:
                        usuario_id = usuario[0]
                        
                        titulo = f"🧾 Cobro Pendiente - {cliente}"
                        mensaje = f"Venta #{venta_id} por ${total:.2f} pendiente desde {fecha.strftime('%d/%m/%Y')}"
                        
                        cursor.execute("""
                            INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje)
                            VALUES (%s, %s, %s, %s)
                        """, (usuario_id, 'cobro', titulo, mensaje))
                
                connection.commit()
                logger.info(f"Alertas de cobros pendientes creadas para {len(ventas_pendientes)} ventas")
            
            return ventas_pendientes
            
        except Exception as e:
            logger.error(f"Error verificando cobros pendientes: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
