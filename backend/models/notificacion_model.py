from datetime import datetime
import mysql.connector
import logging

logger = logging.getLogger(__name__)

class NotificacionModel:
    """Modelo para gestión de notificaciones en base de datos"""
    
    def __init__(self, db_connection):
        self.connection = db_connection
    
    def crear_notificacion(self, usuario_id, tipo, titulo, mensaje, canal='web', referencia_id=None, referencia_tipo=None):
        """Crear nueva notificación"""
        cursor = None
        try:
            cursor = self.connection.cursor()
            
            query = """
                INSERT INTO notificaciones 
                (usuario_id, tipo, titulo, mensaje, canal, referencia_id, referencia_tipo)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                usuario_id, tipo, titulo, mensaje, canal, referencia_id, referencia_tipo
            ))
            
            notificacion_id = cursor.lastrowid
            self.connection.commit()
            
            return notificacion_id
            
        except Exception as e:
            logger.error(f"Error creando notificación: {e}")
            self.connection.rollback()
            return None
        finally:
            if cursor:
                cursor.close()
    
    def obtener_notificaciones_usuario(self, usuario_id, limite=50, solo_no_leidas=False):
        """Obtener notificaciones de un usuario"""
        cursor = None
        try:
            cursor = self.connection.cursor()
            
            query = """
                SELECT id, tipo, titulo, mensaje, leida, canal, creada, referencia_id, referencia_tipo
                FROM notificaciones
                WHERE usuario_id = %s
            """
            params = [usuario_id]
            
            if solo_no_leidas:
                query += " AND leida = FALSE"
            
            query += " ORDER BY creada DESC LIMIT %s"
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
                    'creada': row[6].isoformat() if row[6] else None,
                    'referencia_id': row[7],
                    'referencia_tipo': row[8]
                }
                notificaciones.append(notificacion)
            
            return notificaciones
            
        except Exception as e:
            logger.error(f"Error obteniendo notificaciones: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
    
    def marcar_como_leida(self, notificacion_id, usuario_id):
        """Marcar notificación como leída"""
        cursor = None
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                UPDATE notificaciones 
                SET leida = TRUE 
                WHERE id = %s AND usuario_id = %s
            """, (notificacion_id, usuario_id))
            
            self.connection.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error marcando notificación como leída: {e}")
            self.connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
    
    def contar_no_leidas(self, usuario_id):
        """Contar notificaciones no leídas"""
        cursor = None
        try:
            cursor = self.connection.cursor()
            
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
    
    def limpiar_notificaciones_antiguas(self, dias=30):
        """Limpiar notificaciones antiguas"""
        cursor = None
        try:
            cursor = self.connection.cursor()
            
            cursor.execute("""
                DELETE FROM notificaciones 
                WHERE leida = TRUE AND creada < DATE_SUB(NOW(), INTERVAL %s DAY)
            """, (dias,))
            
            eliminadas = cursor.rowcount
            self.connection.commit()
            
            logger.info(f"Eliminadas {eliminadas} notificaciones antiguas")
            return eliminadas
            
        except Exception as e:
            logger.error(f"Error limpiando notificaciones antiguas: {e}")
            self.connection.rollback()
            return 0
        finally:
            if cursor:
                cursor.close()