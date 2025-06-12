from flask import request, jsonify, g
from functools import wraps
import time
import hashlib
import os
import re
from collections import defaultdict, deque
import logging

logger = logging.getLogger(__name__)

class SecurityMiddleware:
    def __init__(self, app=None):
        self.app = app
        self.rate_limits = defaultdict(lambda: deque())
        self.blocked_ips = set()
        self.failed_attempts = defaultdict(int)
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Inicializar middleware con la app Flask"""
        app.before_request(self.before_request)
        app.after_request(self.after_request)
    
    def before_request(self):
        """Ejecutar antes de cada request"""
        # Rate limiting
        if not self.check_rate_limit():
            return jsonify({'error': 'Rate limit exceeded'}), 429
        
        # IP blocking
        if self.is_ip_blocked():
            return jsonify({'error': 'IP blocked'}), 403
        
        # Request size limiting
        if not self.check_request_size():
            return jsonify({'error': 'Request too large'}), 413
        
        # SQL injection basic detection
        if self.detect_sql_injection():
            self.log_security_event('SQL_INJECTION_ATTEMPT')
            return jsonify({'error': 'Invalid request'}), 400
    
    def after_request(self, response):
        """Ejecutar después de cada request"""
        # Agregar headers de seguridad
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response
    
    def check_rate_limit(self, limit=100, window=60):
        """Verificar rate limiting"""
        client_ip = self.get_client_ip()
        current_time = time.time()
        
        # Limpiar requests antiguos
        while (self.rate_limits[client_ip] and 
               current_time - self.rate_limits[client_ip][0] > window):
            self.rate_limits[client_ip].popleft()
        
        # Verificar límite
        if len(self.rate_limits[client_ip]) >= limit:
            self.log_security_event('RATE_LIMIT_EXCEEDED', {'ip': client_ip})
            return False
        
        # Agregar request actual
        self.rate_limits[client_ip].append(current_time)
        return True
    
    def is_ip_blocked(self):
        """Verificar si la IP está bloqueada"""
        client_ip = self.get_client_ip()
        return client_ip in self.blocked_ips
    
    def check_request_size(self, max_size=10*1024*1024):  # 10MB
        """Verificar tamaño del request"""
        content_length = request.content_length
        if content_length and content_length > max_size:
            return False
        return True
    
    def detect_sql_injection(self):
        """Detección básica de SQL injection"""
        dangerous_patterns = [
            r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)",
            r"(\b(UNION|OR|AND)\b.*\b(SELECT|INSERT|UPDATE|DELETE)\b)",
            r"(--|#|/\*|\*/)",
            r"(\b(xp_|sp_)\w+)",
            r"(\b(EXEC|EXECUTE)\b)"
        ]
        
        # Verificar en parámetros de query
        for param in request.args.values():
            for pattern in dangerous_patterns:
                if re.search(pattern, param, re.IGNORECASE):
                    return True
        
        # Verificar en JSON body
        if request.is_json:
            json_str = str(request.get_json())
            for pattern in dangerous_patterns:
                if re.search(pattern, json_str, re.IGNORECASE):
                    return True
        
        return False
    
    def get_client_ip(self):
        """Obtener IP real del cliente"""
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0].strip()
        elif request.headers.get('X-Real-IP'):
            return request.headers.get('X-Real-IP')
        else:
            return request.remote_addr
    
    def log_security_event(self, event_type, details=None):
        """Registrar evento de seguridad"""
        event_data = {
            'type': event_type,
            'ip': self.get_client_ip(),
            'user_agent': request.headers.get('User-Agent'),
            'endpoint': request.endpoint,
            'method': request.method,
            'timestamp': time.time(),
            'details': details or {}
        }
        
        logger.warning(f"Security Event: {event_type} - {event_data}")
        
        # Incrementar intentos fallidos para esta IP
        if event_type in ['SQL_INJECTION_ATTEMPT', 'RATE_LIMIT_EXCEEDED']:
            client_ip = self.get_client_ip()
            self.failed_attempts[client_ip] += 1
            
            # Bloquear IP después de muchos intentos
            if self.failed_attempts[client_ip] >= 10:
                self.blocked_ips.add(client_ip)
                logger.error(f"IP {client_ip} bloqueada por múltiples intentos maliciosos")

# Instancia global del middleware
security_middleware = SecurityMiddleware()