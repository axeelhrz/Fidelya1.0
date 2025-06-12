import logging
import json
import sys
from datetime import datetime
from pythonjsonlogger import jsonlogger
import os

class StructuredLogger:
    def __init__(self, name="fruteria_nina"):
        self.logger = logging.getLogger(name)
        self.setup_logger()
    
    def setup_logger(self):
        """Configurar logger estructurado"""
        # Limpiar handlers existentes
        self.logger.handlers.clear()
        
        # Configurar nivel
        log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()
        self.logger.setLevel(getattr(logging, log_level))
        
        # Formatter JSON
        json_formatter = jsonlogger.JsonFormatter(
            fmt='%(asctime)s %(name)s %(levelname)s %(message)s %(pathname)s %(lineno)d',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Handler para consola
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(json_formatter)
        self.logger.addHandler(console_handler)
        
        # Handler para archivo (si está configurado)
        log_file = os.environ.get('LOG_FILE')
        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(json_formatter)
            self.logger.addHandler(file_handler)
    
    def log_request(self, method, endpoint, user_id=None, duration=None, status_code=None):
        """Log de requests HTTP"""
        self.logger.info("HTTP Request", extra={
            'event_type': 'http_request',
            'method': method,
            'endpoint': endpoint,
            'user_id': user_id,
            'duration_ms': duration,
            'status_code': status_code,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    def log_database_operation(self, operation, table, user_id=None, duration=None, affected_rows=None):
        """Log de operaciones de base de datos"""
        self.logger.info("Database Operation", extra={
            'event_type': 'database_operation',
            'operation': operation,
            'table': table,
            'user_id': user_id,
            'duration_ms': duration,
            'affected_rows': affected_rows,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    def log_business_event(self, event_type, details, user_id=None):
        """Log de eventos de negocio"""
        self.logger.info("Business Event", extra={
            'event_type': 'business_event',
            'business_event_type': event_type,
            'details': details,
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    def log_error(self, error, context=None, user_id=None):
        """Log de errores"""
        self.logger.error("Application Error", extra={
            'event_type': 'error',
            'error_type': type(error).__name__,
            'error_message': str(error),
            'context': context or {},
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    def log_security_event(self, event_type, details, severity='warning'):
        """Log de eventos de seguridad"""
        log_method = getattr(self.logger, severity.lower())
        log_method("Security Event", extra={
            'event_type': 'security_event',
            'security_event_type': event_type,
            'details': details,
            'timestamp': datetime.utcnow().isoformat()
        })

# Instancia global del logger
structured_logger = StructuredLogger()