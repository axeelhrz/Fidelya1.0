import mysql.connector
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ConfiguracionModel:
    def __init__(self, db_config):
        self.db_config = db_config
    
    def get_db_connection(self):
        """Crear conexión a la base de datos"""
        try:
            connection = mysql.connector.connect(**self.db_config)
            return connection
        except mysql.connector.Error as e:
            logger.error(f"Error de conexión: {e}")
            return None
    
    def obtener_configuracion_general(self):
        """Obtener configuración general del sistema"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            
            cursor.execute("""
                SELECT id, iva, moneda, decimales, nombre_fruteria, 
                       direccion, telefono, email, rut, logo_url
                FROM configuracion 
                WHERE id = 1
            """)
            
            result = cursor.fetchone()
            
            if result:
                return {
                    'id': result[0],
                    'iva': float(result[1]) if result[1] else 22.0,
                    'moneda': result[2] or 'UYU',
                    'decimales': result[3] or 2,
                    'nombre_fruteria': result[4] or '',
                    'direccion': result[5] or '',
                    'telefono': result[6] or '',
                    'email': result[7] or '',
                    'rut': result[8] or '',
                    'logo_url': result[9] or ''
                }
            else:
                # Crear configuración por defecto
                return self.crear_configuracion_defecto()
                
        except Exception as e:
            logger.error(f"Error obteniendo configuración: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def crear_configuracion_defecto(self):
        """Crear configuración por defecto"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            
            cursor.execute("""
                INSERT INTO configuracion (
                    id, iva, moneda, decimales, nombre_fruteria,
                    direccion, telefono, email, rut
                ) VALUES (1, 22.0, 'UYU', 2, 'Frutería Nina', '', '', '', '')
                ON DUPLICATE KEY UPDATE id = id
            """)
            
            connection.commit()
            
            return {
                'id': 1,
                'iva': 22.0,
                'moneda': 'UYU',
                'decimales': 2,
                'nombre_fruteria': 'Frutería Nina',
                'direccion': '',
                'telefono': '',
                'email': '',
                'rut': '',
                'logo_url': ''
            }
            
        except Exception as e:
            logger.error(f"Error creando configuración por defecto: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def actualizar_configuracion(self, datos):
        """Actualizar configuración general"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            cursor.execute("""
                UPDATE configuracion SET
                    iva = %s,
                    moneda = %s,
                    decimales = %s,
                    nombre_fruteria = %s,
                    direccion = %s,
                    telefono = %s,
                    email = %s,
                    rut = %s,
                    logo_url = %s
                WHERE id = 1
            """, (
                datos.get('iva', 22.0),
                datos.get('moneda', 'UYU'),
                datos.get('decimales', 2),
                datos.get('nombre_fruteria', ''),
                datos.get('direccion', ''),
                datos.get('telefono', ''),
                datos.get('email', ''),
                datos.get('rut', ''),
                datos.get('logo_url', '')
            ))
            
            connection.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error actualizando configuración: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def obtener_categorias(self, tipo=None):
        """Obtener categorías por tipo"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return []
                
            cursor = connection.cursor()
            
            if tipo:
                cursor.execute("""
                    SELECT id, tipo, nombre, descripcion, activo
                    FROM categorias 
                    WHERE tipo = %s AND activo = TRUE
                    ORDER BY nombre
                """, (tipo,))
            else:
                cursor.execute("""
                    SELECT id, tipo, nombre, descripcion, activo
                    FROM categorias 
                    WHERE activo = TRUE
                    ORDER BY tipo, nombre
                """)
            
            categorias = []
            for row in cursor.fetchall():
                categorias.append({
                    'id': row[0],
                    'tipo': row[1],
                    'nombre': row[2],
                    'descripcion': row[3] or '',
                    'activo': bool(row[4])
                })
            
            return categorias
            
        except Exception as e:
            logger.error(f"Error obteniendo categorías: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def crear_categoria(self, datos):
        """Crear nueva categoría"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return None
                
            cursor = connection.cursor()
            
            cursor.execute("""
                INSERT INTO categorias (tipo, nombre, descripcion, activo)
                VALUES (%s, %s, %s, %s)
            """, (
                datos['tipo'],
                datos['nombre'],
                datos.get('descripcion', ''),
                datos.get('activo', True)
            ))
            
            categoria_id = cursor.lastrowid
            connection.commit()
            
            return {
                'id': categoria_id,
                'tipo': datos['tipo'],
                'nombre': datos['nombre'],
                'descripcion': datos.get('descripcion', ''),
                'activo': datos.get('activo', True)
            }
            
        except Exception as e:
            logger.error(f"Error creando categoría: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def actualizar_categoria(self, categoria_id, datos):
        """Actualizar categoría existente"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            cursor.execute("""
                UPDATE categorias SET
                    nombre = %s,
                    descripcion = %s,
                    activo = %s
                WHERE id = %s
            """, (
                datos['nombre'],
                datos.get('descripcion', ''),
                datos.get('activo', True),
                categoria_id
            ))
            
            connection.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error actualizando categoría: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def eliminar_categoria(self, categoria_id):
        """Eliminar categoría (soft delete)"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            cursor.execute("""
                UPDATE categorias SET activo = FALSE
                WHERE id = %s
            """, (categoria_id,))
            
            connection.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error eliminando categoría: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def obtener_usuarios(self):
        """Obtener lista de usuarios"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return []
                
            cursor = connection.cursor()
            
            cursor.execute("""
                SELECT id, nombre, correo, rol, activo, creado
                FROM usuarios 
                ORDER BY nombre
            """)
            
            usuarios = []
            for row in cursor.fetchall():
                usuarios.append({
                    'id': row[0],
                    'nombre': row[1],
                    'correo': row[2],
                    'rol': row[3],
                    'activo': bool(row[4]),
                    'creado': row[5].isoformat() if row[5] else None
                })
            
            return usuarios
            
        except Exception as e:
            logger.error(f"Error obteniendo usuarios: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def cambiar_rol_usuario(self, usuario_id, nuevo_rol):
        """Cambiar rol de usuario"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            cursor.execute("""
                UPDATE usuarios SET rol = %s
                WHERE id = %s
            """, (nuevo_rol, usuario_id))
            
            connection.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error cambiando rol de usuario: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()
    
    def activar_desactivar_usuario(self, usuario_id, activo):
        """Activar o desactivar usuario"""
        connection = None
        cursor = None
        
        try:
            connection = self.get_db_connection()
            if not connection:
                return False
                
            cursor = connection.cursor()
            
            cursor.execute("""
                UPDATE usuarios SET activo = %s
                WHERE id = %s
            """, (activo, usuario_id))
            
            connection.commit()
            return cursor.rowcount > 0
            
        except Exception as e:
            logger.error(f"Error activando/desactivando usuario: {e}")
            return False
        finally:
            if cursor:
                cursor.close()
            if connection and connection.is_connected():
                connection.close()