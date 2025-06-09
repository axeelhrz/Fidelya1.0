from flask import jsonify, request
import traceback
import sys
from backend.logging.structured_logger import structured_logger
from marshmallow import ValidationError
import mysql.connector

class ErrorHandler:
    def __init__(self, app=None):
        self.app = app
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Registrar manejadores de error con Flask"""
        app.register_error_handler(ValidationError, self.handle_validation_error)
        app.register_error_handler(mysql.connector.Error, self.handle_database_error)
        app.register_error_handler(Exception, self.handle_generic_error)
        app.register_error_handler(404, self.handle_not_found)
        app.register_error_handler(403, self.handle_forbidden)
        app.register_error_handler(401, self.handle_unauthorized)
        app.register_error_handler(500, self.handle_internal_error)
    
    def handle_validation_error(self, error):
        """Manejar errores de validación de Marshmallow"""
        structured_logger.log_error(error, {
            'endpoint': request.endpoint,
            'method': request.method,
            'validation_errors': error.messages
        })
        
        response = jsonify({
            'error': 'Datos de entrada inválidos',
            'details': error.messages,
            'error_code': 'VALIDATION_ERROR'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 400
    
    def handle_database_error(self, error):
        """Manejar errores de base de datos"""
        error_code = getattr(error, 'errno', None)
        
        # Mapear códigos de error específicos
        if error_code == 1062:  # Duplicate entry
            message = 'El registro ya existe'
            status_code = 409
        elif error_code == 1452:  # Foreign key constraint
            message = 'Referencia inválida a otro registro'
            status_code = 400
        elif error_code == 1048:  # Column cannot be null
            message = 'Faltan campos requeridos'
            status_code = 400
        else:
            message = 'Error de base de datos'
            status_code = 500
        
        structured_logger.log_error(error, {
            'endpoint': request.endpoint,
            'method': request.method,
            'mysql_error_code': error_code,
            'mysql_error_msg': str(error)
        })
        
        response = jsonify({
            'error': message,
            'error_code': 'DATABASE_ERROR'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, status_code
    
    def handle_generic_error(self, error):
        """Manejar errores genéricos"""
        # Log completo del error
        structured_logger.log_error(error, {
            'endpoint': request.endpoint,
            'method': request.method,
            'traceback': traceback.format_exc()
        })
        
        # En producción, no exponer detalles del error
        if self.app and self.app.config.get('ENV') == 'production':
            message = 'Error interno del servidor'
        else:
            message = str(error)
        
        response = jsonify({
            'error': message,
            'error_code': 'INTERNAL_ERROR'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 500
    
    def handle_not_found(self, error):
        """Manejar errores 404"""
        response = jsonify({
            'error': 'Recurso no encontrado',
            'error_code': 'NOT_FOUND'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 404
    
    def handle_forbidden(self, error):
        """Manejar errores 403"""
        response = jsonify({
            'error': 'Acceso denegado',
            'error_code': 'FORBIDDEN'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 403
    
    def handle_unauthorized(self, error):
        """Manejar errores 401"""
        response = jsonify({
            'error': 'No autorizado',
            'error_code': 'UNAUTHORIZED'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 401
    
    def handle_internal_error(self, error):
        """Manejar errores 500"""
        response = jsonify({
            'error': 'Error interno del servidor',
            'error_code': 'INTERNAL_SERVER_ERROR'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 500

# Instancia global del manejador de errores
error_handler = ErrorHandler()