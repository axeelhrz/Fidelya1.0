import redis
import json
import pickle
import os
import logging
from functools import wraps
from datetime import timedelta

logger = logging.getLogger(__name__)

class RedisCache:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=os.environ.get('REDIS_HOST', 'localhost'),
            port=int(os.environ.get('REDIS_PORT', '6379')),
            db=int(os.environ.get('REDIS_DB', '0')),
            password=os.environ.get('REDIS_PASSWORD'),
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
            health_check_interval=30
        )
        
        # Verificar conexión
        try:
            self.redis_client.ping()
            logger.info("✅ Conexión a Redis establecida")
        except Exception as e:
            logger.warning(f"⚠️ Redis no disponible: {e}")
            self.redis_client = None
    
    def get(self, key):
        """Obtener valor del cache"""
        if not self.redis_client:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            logger.error(f"Error obteniendo cache {key}: {e}")
        return None
    
    def set(self, key, value, ttl=3600):
        """Establecer valor en cache"""
        if not self.redis_client:
            return False
        
        try:
            serialized_value = json.dumps(value, default=str)
            return self.redis_client.setex(key, ttl, serialized_value)
        except Exception as e:
            logger.error(f"Error estableciendo cache {key}: {e}")
            return False
    
    def delete(self, key):
        """Eliminar clave del cache"""
        if not self.redis_client:
            return False
        
        try:
            return self.redis_client.delete(key)
        except Exception as e:
            logger.error(f"Error eliminando cache {key}: {e}")
            return False
    
    def delete_pattern(self, pattern):
        """Eliminar claves que coincidan con patrón"""
        if not self.redis_client:
            return False
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
        except Exception as e:
            logger.error(f"Error eliminando patrón {pattern}: {e}")
            return False

# Instancia global del cache
cache = RedisCache()

def cached(ttl=3600, key_prefix=""):
    """Decorador para cache automático"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generar clave única
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Intentar obtener del cache
            cached_result = cache.get(cache_key)
            if cached_result is not None:
                logger.debug(f"Cache hit: {cache_key}")
                return cached_result
            
            # Ejecutar función y cachear resultado
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            logger.debug(f"Cache set: {cache_key}")
            
            return result
        return wrapper
    return decorator