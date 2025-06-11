import logging
from models.configuracion_model import ConfiguracionModel

logger = logging.getLogger(__name__)

class ConfiguracionController:
    def __init__(self, db_config):
        self.model = ConfiguracionModel(db_config)
    
    def obtener_configuracion(self):
        """Obtener configuración general del sistema"""
        try:
            configuracion = self.model.obtener_configuracion_general()
            if configuracion:
                return {
                    'success': True,
                    'data': configuracion
                }
            else:
                return {
                    'success': False,
                    'message': 'Error obteniendo configuración'
                }
        except Exception as e:
            logger.error(f"Error en controlador obtener_configuracion: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }
    
    def actualizar_configuracion(self, datos):
        """Actualizar configuración general"""
        try:
            # Validar datos
            if not datos:
                return {
                    'success': False,
                    'message': 'Datos de configuración requeridos'
                }
            
            # Validar IVA
            if 'iva' in datos:
                iva = float(datos['iva'])
                if iva < 0 or iva > 30:
                    return {
                        'success': False,
                        'message': 'El IVA debe estar entre 0% y 30%'
                    }
            
            success = self.model.actualizar_configuracion(datos)
            
            if success:
                return {
                    'success': True,
                    'message': 'Configuración actualizada exitosamente'
                }
            else:
                return {
                    'success': False,
                    'message': 'Error actualizando configuración'
                }
                
        except ValueError:
            return {
                'success': False,
                'message': 'Valor de IVA inválido'
            }
        except Exception as e:
            logger.error(f"Error en controlador actualizar_configuracion: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }
    
    def obtener_categorias(self, tipo=None):
        """Obtener categorías por tipo"""
        try:
            categorias = self.model.obtener_categorias(tipo)
            return {
                'success': True,
                'data': categorias
            }
        except Exception as e:
            logger.error(f"Error en controlador obtener_categorias: {e}")
            return {
                'success': False,
                'message': 'Error obteniendo categorías',
                'data': []
            }
    
    def crear_categoria(self, datos):
        """Crear nueva categoría"""
        try:
            # Validar datos requeridos
            if not datos or not datos.get('nombre') or not datos.get('tipo'):
                return {
                    'success': False,
                    'message': 'Nombre y tipo de categoría son requeridos'
                }
            
            # Validar tipo
            if datos['tipo'] not in ['producto', 'gasto']:
                return {
                    'success': False,
                    'message': 'Tipo de categoría debe ser "producto" o "gasto"'
                }
            
            categoria = self.model.crear_categoria(datos)
            
            if categoria:
                return {
                    'success': True,
                    'message': 'Categoría creada exitosamente',
                    'data': categoria
                }
            else:
                return {
                    'success': False,
                    'message': 'Error creando categoría'
                }
                
        except Exception as e:
            logger.error(f"Error en controlador crear_categoria: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }
    
    def actualizar_categoria(self, categoria_id, datos):
        """Actualizar categoría existente"""
        try:
            if not datos or not datos.get('nombre'):
                return {
                    'success': False,
                    'message': 'Nombre de categoría es requerido'
                }
            
            success = self.model.actualizar_categoria(categoria_id, datos)
            
            if success:
                return {
                    'success': True,
                    'message': 'Categoría actualizada exitosamente'
                }
            else:
                return {
                    'success': False,
                    'message': 'Categoría no encontrada o error actualizando'
                }
                
        except Exception as e:
            logger.error(f"Error en controlador actualizar_categoria: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }
    
    def eliminar_categoria(self, categoria_id):
        """Eliminar categoría"""
        try:
            success = self.model.eliminar_categoria(categoria_id)
            
            if success:
                return {
                    'success': True,
                    'message': 'Categoría eliminada exitosamente'
                }
            else:
                return {
                    'success': False,
                    'message': 'Categoría no encontrada'
                }
                
        except Exception as e:
            logger.error(f"Error en controlador eliminar_categoria: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }
    
    def obtener_usuarios(self):
        """Obtener lista de usuarios"""
        try:
            usuarios = self.model.obtener_usuarios()
            return {
                'success': True,
                'data': usuarios
            }
        except Exception as e:
            logger.error(f"Error en controlador obtener_usuarios: {e}")
            return {
                'success': False,
                'message': 'Error obteniendo usuarios',
                'data': []
            }
    
    def cambiar_rol_usuario(self, usuario_id, nuevo_rol):
        """Cambiar rol de usuario"""
        try:
            # Validar rol
            if nuevo_rol not in ['admin', 'operador', 'cajero']:
                return {
                    'success': False,
                    'message': 'Rol inválido'
                }
            
            success = self.model.cambiar_rol_usuario(usuario_id, nuevo_rol)
            
            if success:
                return {
                    'success': True,
                    'message': 'Rol de usuario actualizado exitosamente'
                }
            else:
                return {
                    'success': False,
                    'message': 'Usuario no encontrado'
                }
                
        except Exception as e:
            logger.error(f"Error en controlador cambiar_rol_usuario: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }
    
    def activar_desactivar_usuario(self, usuario_id, activo):
        """Activar o desactivar usuario"""
        try:
            success = self.model.activar_desactivar_usuario(usuario_id, activo)
            
            if success:
                estado = 'activado' if activo else 'desactivado'
                return {
                    'success': True,
                    'message': f'Usuario {estado} exitosamente'
                }
            else:
                return {
                    'success': False,
                    'message': 'Usuario no encontrado'
                }
                
        except Exception as e:
            logger.error(f"Error en controlador activar_desactivar_usuario: {e}")
            return {
                'success': False,
                'message': 'Error interno del servidor'
            }