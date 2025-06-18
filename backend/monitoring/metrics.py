import time
import psutil
import threading
from collections import defaultdict, deque
from datetime import datetime, timedelta
from flask import request, g
from functools import wraps
import json

class MetricsCollector:
    def __init__(self):
        self.request_metrics = defaultdict(lambda: {
            'count': 0,
            'total_time': 0,
            'errors': 0,
            'recent_times': deque(maxlen=100)
        })
        self.system_metrics = {}
        self.business_metrics = defaultdict(int)
        self.start_time = time.time()
        
        # Iniciar recolección de métricas del sistema
        self._start_system_monitoring()
    
    def _start_system_monitoring(self):
        """Iniciar monitoreo del sistema en hilo separado"""
        def collect_system_metrics():
            while True:
                try:
                    self.system_metrics = {
                        'cpu_percent': psutil.cpu_percent(interval=1),
                        'memory_percent': psutil.virtual_memory().percent,
                        'disk_percent': psutil.disk_usage('/').percent,
                        'timestamp': datetime.utcnow().isoformat()
                    }
                    time.sleep(30)  # Recolectar cada 30 segundos
                except Exception as e:
                    print(f"Error recolectando métricas del sistema: {e}")
                    time.sleep(60)
        
        thread = threading.Thread(target=collect_system_metrics, daemon=True)
        thread.start()
    
    def record_request(self, endpoint, method, duration, status_code):
        """Registrar métrica de request"""
        key = f"{method}:{endpoint}"
        metrics = self.request_metrics[key]
        
        metrics['count'] += 1
        metrics['total_time'] += duration
        metrics['recent_times'].append(duration)
        
        if status_code >= 400:
            metrics['errors'] += 1
    
    def record_business_event(self, event_type):
        """Registrar evento de negocio"""
        self.business_metrics[event_type] += 1
    
    def get_request_metrics(self):
        """Obtener métricas de requests"""
        result = {}
        for endpoint, metrics in self.request_metrics.items():
            avg_time = metrics['total_time'] / metrics['count'] if metrics['count'] > 0 else 0
            recent_avg = sum(metrics['recent_times']) / len(metrics['recent_times']) if metrics['recent_times'] else 0
            
            result[endpoint] = {
                'total_requests': metrics['count'],
                'total_errors': metrics['errors'],
                'error_rate': metrics['errors'] / metrics['count'] if metrics['count'] > 0 else 0,
                'avg_response_time': round(avg_time, 3),
                'recent_avg_response_time': round(recent_avg, 3),
                'requests_per_minute': self._calculate_rpm(endpoint)
            }
        
        return result
    
    def get_system_metrics(self):
        """Obtener métricas del sistema"""
        uptime = time.time() - self.start_time
        return {
            **self.system_metrics,
            'uptime_seconds': round(uptime, 2),
            'uptime_formatted': str(timedelta(seconds=int(uptime)))
        }
    
    def get_business_metrics(self):
        """Obtener métricas de negocio"""
        return dict(self.business_metrics)
    
    def _calculate_rpm(self, endpoint):
        """Calcular requests por minuto"""
        metrics = self.request_metrics[endpoint]
        if not metrics['recent_times']:
            return 0
        
        # Estimar basado en requests recientes
        recent_count = len(metrics['recent_times'])
        time_span = 60  # Asumir 1 minuto para simplificar
        return round(recent_count * (60 / time_span), 2)
    
    def get_health_status(self):
        """Obtener estado de salud del sistema"""
        system = self.get_system_metrics()
        
        # Determinar estado basado en métricas
        status = "healthy"
        issues = []
        
        if system.get('cpu_percent', 0) > 80:
            status = "warning"
            issues.append("High CPU usage")
        
        if system.get('memory_percent', 0) > 85:
            status = "warning"
            issues.append("High memory usage")
        
        if system.get('disk_percent', 0) > 90:
            status = "critical"
            issues.append("Low disk space")
        
        # Verificar error rates
        request_metrics = self.get_request_metrics()
        high_error_endpoints = [
            endpoint for endpoint, metrics in request_metrics.items()
            if metrics['error_rate'] > 0.1  # 10% error rate
        ]
        
        if high_error_endpoints:
            status = "warning"
            issues.append(f"High error rate in: {', '.join(high_error_endpoints)}")
        
        return {
            'status': status,
            'issues': issues,
            'timestamp': datetime.utcnow().isoformat()
        }

# Instancia global del collector
metrics_collector = MetricsCollector()

def monitor_performance(func):
    """Decorador para monitorear rendimiento de funciones"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        try:
            result = func(*args, **kwargs)
            status_code = getattr(result, 'status_code', 200) if hasattr(result, 'status_code') else 200
        except Exception as e:
            status_code = 500
            raise
        finally:
            duration = (time.time() - start_time) * 1000  # en millisegundos
            
            # Registrar métrica
            endpoint = getattr(request, 'endpoint', func.__name__)
            method = getattr(request, 'method', 'UNKNOWN')
            metrics_collector.record_request(endpoint, method, duration, status_code)
        
        return result
    return wrapper