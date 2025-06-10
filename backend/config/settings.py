import os
from datetime import timedelta
from typing import Optional

class Config:
    """Configuración base"""
    
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fruteria_nina_secret_key_2024_super_secure')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    TESTING = os.environ.get('FLASK_TESTING', 'False').lower() == 'true'
    
    # Base de datos
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_USER = os.environ.get('DB_USER', 'fruteria_nina')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Admin123')
    DB_NAME = os.environ.get('DB_NAME', 'fruteria_nina')
    DB_PORT = int(os.environ.get('DB_PORT', '3306'))
    DB_CHARSET = os.environ.get('DB_CHARSET', 'utf8mb4')
    DB_POOL_SIZE = int(os.environ.get('DB_POOL_SIZE', '10'))
    DB_POOL_TIMEOUT = int(os.environ.get('DB_POOL_TIMEOUT', '30'))
    
    # Redis
    REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.environ.get('REDIS_PORT', '6379'))
    REDIS_DB = int(os.environ.get('REDIS_DB', '0'))
    REDIS_PASSWORD = os.environ.get('REDIS_PASSWORD')
    
    # JWT
    JWT_EXPIRATION_DELTA = timedelta(
        hours=int(os.environ.get('JWT_EXPIRATION_HOURS', '24'))
    )
    JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE')
    
    # Email
    SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
    SMTP_USER = os.environ.get('SMTP_USER', '')
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
    FROM_NAME = os.environ.get('FROM_NAME', 'Frutería Nina')
    
    # SMS
    TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')
    
    # Seguridad
    RATE_LIMIT_PER_MINUTE = int(os.environ.get('RATE_LIMIT_PER_MINUTE', '100'))
    MAX_REQUEST_SIZE = int(os.environ.get('MAX_REQUEST_SIZE', '10485760'))  # 10MB
    BLOCKED_IPS_FILE = os.environ.get('BLOCKED_IPS_FILE', 'blocked_ips.txt')
    
    # Cache
    CACHE_DEFAULT_TTL = int(os.environ.get('CACHE_DEFAULT_TTL', '3600'))
    CACHE_ENABLED = os.environ.get('CACHE_ENABLED', 'True').lower() == 'true'
    
    # Archivos
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', '16777216'))  # 16MB
    ALLOWED_EXTENSIONS = set(os.environ.get('ALLOWED_EXTENSIONS', 'txt,pdf,png,jpg,jpeg,gif').split(','))
    
    # Monitoreo
    METRICS_ENABLED = os.environ.get('METRICS_ENABLED', 'True').lower() == 'true'
    HEALTH_CHECK_ENABLED = os.environ.get('HEALTH_CHECK_ENABLED', 'True').lower() == 'true'
    
    @property
    def database_url(self):
        """Construir URL de base de datos"""
        return f"mysql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @classmethod
    def validate_config(cls):
        """Validar configuración crítica"""
        errors = []
        
        if not cls.SECRET_KEY or cls.SECRET_KEY == 'default_secret':
            errors.append("SECRET_KEY debe ser configurada en producción")
        
        if not cls.DB_PASSWORD:
            errors.append("DB_PASSWORD es requerida")
        
        if cls.SMTP_USER and not cls.SMTP_PASSWORD:
            errors.append("SMTP_PASSWORD es requerida si SMTP_USER está configurado")
        
        return errors

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    CACHE_ENABLED = False

class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    TESTING = False
    LOG_LEVEL = 'WARNING'
    
    @classmethod
    def validate_config(cls):
        """Validaciones adicionales para producción"""
        errors = super().validate_config()
        
        if cls.SECRET_KEY == 'fruteria_nina_secret_key_2024_super_secure':
            errors.append("SECRET_KEY por defecto no debe usarse en producción")
        
        if not cls.REDIS_PASSWORD:
            errors.append("REDIS_PASSWORD recomendada en producción")
        
        return errors

class TestingConfig(Config):
    """Configuración para testing"""
    TESTING = True
    DB_NAME = 'fruteria_nina_test'
    CACHE_ENABLED = False
    RATE_LIMIT_PER_MINUTE = 1000  # Sin límites en testing

# Mapeo de configuraciones
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Obtener configuración basada en el entorno"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config_map.get(env, config_map['default'])