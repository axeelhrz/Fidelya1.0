import mysql.connector.pooling
import os
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class DatabasePool:
    _instance = None
    _pool = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabasePool, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._pool is None:
            self._initialize_pool()
    
    def _initialize_pool(self):
        """Inicializar pool de conexiones"""
        try:
            config = {
                'host': os.environ.get('DB_HOST', 'localhost'),
                'user': os.environ.get('DB_USER', 'fruteria_nina'),
                'password': os.environ.get('DB_PASSWORD', 'Admin123'),
                'database': os.environ.get('DB_NAME', 'fruteria_nina'),
                'charset': 'utf8mb4',
                'collation': 'utf8mb4_unicode_ci',
                'autocommit': False,
                'raise_on_warnings': False,
                'pool_name': 'fruteria_pool',
                'pool_size': int(os.environ.get('DB_POOL_SIZE', '10')),
                'pool_reset_session': True,
                'pool_timeout': int(os.environ.get('DB_POOL_TIMEOUT', '30'))
            }
            
            self._pool = mysql.connector.pooling.MySQLConnectionPool(**config)
            logger.info(f"✅ Pool de conexiones inicializado: {config['pool_size']} conexiones")
            
        except Exception as e:
            logger.error(f"❌ Error inicializando pool de conexiones: {e}")
            raise
    
    @contextmanager
    def get_connection(self):
        """Context manager para obtener conexiones del pool"""
        connection = None
        try:
            connection = self._pool.get_connection()
            yield connection
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Error en conexión de base de datos: {e}")
            raise
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    def get_pool_status(self):
        """Obtener estado del pool"""
        return {
            'pool_size': self._pool.pool_size,
            'connections_in_use': len(self._pool._cnx_queue._queue),
            'available_connections': self._pool.pool_size - len(self._pool._cnx_queue._queue)
        }

# Instancia global del pool
db_pool = DatabasePool()