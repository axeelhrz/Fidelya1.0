import os
from flask import Flask
from flask_cors import CORS

# Importar configuración
from backend.config.settings import get_config

# Importar componentes optimizados
from backend.database.connection_pool import db_pool
from backend.cache.redis_cache import cache
from backend.middleware.security_middleware import security_middleware
from backend.error_handling.error_handler import error_handler
from backend.logging.structured_logger import structured_logger
from backend.monitoring.metrics import metrics_collector, monitor_performance

# Importar blueprints
try:
    from backend.api.auth_endpoints import auth_bp
except ImportError:
    from flask import Blueprint
    auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

try:
    from backend.api.productos_endpoints import productos_bp
except ImportError:
    from flask import Blueprint
    productos_bp = Blueprint('productos', __name__, url_prefix='/api/productos')

try:
    from backend.api.ventas_endpoints import ventas_bp
except ImportError:
    from flask import Blueprint
    ventas_bp = Blueprint('ventas', __name__, url_prefix='/api/ventas')

try:
    from backend.api.clientes_endpoints import clientes_bp
except ImportError:
    from flask import Blueprint
    clientes_bp = Blueprint('clientes', __name__, url_prefix='/api/clientes')

try:
    from backend.api.dashboard_endpoints import dashboard_bp
except ImportError:
    from flask import Blueprint
    dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

try:
    from backend.api.monitoring_endpoints import monitoring_bp
except ImportError:
    from flask import Blueprint
    monitoring_bp = Blueprint('monitoring', __name__, url_prefix='/api/monitoring')

def create_app(config_name=None):
    """Factory para crear la aplicación Flask"""
    
    # Crear aplicación
    app = Flask(__name__)
    
    # Cargar configuración
    config_class = get_config()
    app.config.from_object(config_class)
    
    # Validar configuración
    config_errors = config_class.validate_config()
    if config_errors:
        for error in config_errors:
            structured_logger.logger.error(f"Config Error: {error}")
        if app.config['ENV'] == 'production':
            raise ValueError("Configuración inválida para producción")
    
    # Configurar CORS
    CORS(app, 
         origins=app.config['CORS_ORIGINS'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    # Inicializar componentes
    security_middleware.init_app(app)
    error_handler.init_app(app)
    
    # Middleware de monitoreo
    @app.before_request
    def before_request():
        import time
        from flask import g, request
        g.start_time = time.time()
    
    @app.after_request
    @monitor_performance
    def after_request(response):
        import time
        from flask import g, request
        
        if hasattr(g, 'start_time'):
            duration = (time.time() - g.start_time) * 1000
            structured_logger.log_request(
                method=request.method,
                endpoint=request.endpoint,
                duration=duration,
                status_code=response.status_code
            )
        
        return response
    
    # Registrar blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(productos_bp)
    app.register_blueprint(ventas_bp)
    app.register_blueprint(clientes_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(monitoring_bp)
    
    # Endpoint de información de la aplicación
    @app.route('/api/info')
    def app_info():
        return {
            'name': 'Frutería Nina API',
            'version': '2.0.0',
            'environment': app.config['ENV'],
            'debug': app.config['DEBUG']
        }
    
    # Inicializar base de datos si es necesario
    with app.app_context():
        try:
            # Verificar conexión a la base de datos
            with db_pool.get_connection() as connection:
                cursor = connection.cursor()
                cursor.execute("SELECT 1")
                structured_logger.logger.info("✅ Conexión a base de datos verificada")
        except Exception as e:
            structured_logger.log_error(e, {"component": "database_initialization"})
            if app.config['ENV'] == 'production':
                raise
    
    structured_logger.logger.info(f"✅ Aplicación Flask creada - Entorno: {app.config['ENV']}")
    return app

def run_app():
    """Ejecutar la aplicación"""
    app = create_app()
    
    # Configuración del servidor
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', '5001'))
    debug = app.config['DEBUG']
    
    structured_logger.logger.info(f"🚀 Iniciando servidor en {host}:{port}")
    structured_logger.logger.info(f"🌐 CORS configurado para: {app.config['CORS_ORIGINS']}")
    structured_logger.logger.info(f"📊 Métricas habilitadas: {app.config['METRICS_ENABLED']}")
    
    app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    run_app()