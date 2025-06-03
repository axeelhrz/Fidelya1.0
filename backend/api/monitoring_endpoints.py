from flask import Blueprint, jsonify
from backend.monitoring.metrics import metrics_collector
from backend.database.connection_pool import db_pool
from backend.cache.redis_cache import cache
import time

monitoring_bp = Blueprint('monitoring', __name__, url_prefix='/api/monitoring')

@monitoring_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint de health check"""
    try:
        # Verificar base de datos
        with db_pool.get_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Verificar Redis
    try:
        if cache.redis_client:
            cache.redis_client.ping()
            redis_status = "healthy"
        else:
            redis_status = "not_configured"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"
    
    # Estado general del sistema
    system_health = metrics_collector.get_health_status()
    
    overall_status = "healthy"
    if db_status != "healthy" or redis_status.startswith("unhealthy"):
        overall_status = "unhealthy"
    elif system_health['status'] in ['warning', 'critical']:
        overall_status = system_health['status']
    
    response = {
        'status': overall_status,
        'timestamp': time.time(),
        'services': {
            'database': db_status,
            'redis': redis_status,
            'system': system_health
        },
        'version': '1.0.0'
    }
    
    status_code = 200 if overall_status == "healthy" else 503
    return jsonify(response), status_code

@monitoring_bp.route('/metrics', methods=['GET'])
def get_metrics():
    """Endpoint para obtener métricas del sistema"""
    return jsonify({
        'request_metrics': metrics_collector.get_request_metrics(),
        'system_metrics': metrics_collector.get_system_metrics(),
        'business_metrics': metrics_collector.get_business_metrics(),
        'database_pool': db_pool.get_pool_status() if db_pool else None
    })

@monitoring_bp.route('/metrics/requests', methods=['GET'])
def get_request_metrics():
    """Endpoint específico para métricas de requests"""
    return jsonify(metrics_collector.get_request_metrics())

@monitoring_bp.route('/metrics/system', methods=['GET'])
def get_system_metrics():
    """Endpoint específico para métricas del sistema"""
    return jsonify(metrics_collector.get_system_metrics())

@monitoring_bp.route('/metrics/business', methods=['GET'])
def get_business_metrics():
    """Endpoint específico para métricas de negocio"""
    return jsonify(metrics_collector.get_business_metrics())