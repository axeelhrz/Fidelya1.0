import os
import logging
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta, date
from controllers.notificaciones_controller import NotificacionesController
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from decimal import Decimal
import json

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Inicializar Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fruteria_nina_secret_key_2024_super_secure')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Configurar CORS
CORS(app, 
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True
)

# Configuración de base de datos
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'fruteria_nina'),
    'password': os.environ.get('DB_PASSWORD', 'Admin123'),
    'database': os.environ.get('DB_NAME', 'fruteria_nina'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': False,
    'raise_on_warnings': False
}

# Variable global para evitar múltiples inicializaciones
_database_initialized = False

def get_db_connection():
    """Crear conexión a la base de datos MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
        else:
            logger.error("No se pudo establecer conexión con la base de datos")
            return None
    except mysql.connector.Error as e:
        logger.error(f"Error de conexión MySQL: {e}")
        return None
    except Exception as e:
        logger.error(f"Error inesperado de conexión: {e}")
        return None

def create_tables():
    """Crear tablas de la base de datos"""
    global _database_initialized
    
    if _database_initialized:
        logger.info("✅ Base de datos ya inicializada, omitiendo creación de tablas")
        return True
    
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            logger.error("❌ No se pudo conectar a la base de datos.")
            return False
            
        cursor = connection.cursor()
        cursor.execute(f"USE {DB_CONFIG['database']}")
        logger.info(f"✅ Conectado a la base de datos: {DB_CONFIG['database']}")
        
        # Verificar si las tablas principales ya existen
        cursor.execute("SHOW TABLES LIKE 'usuarios'")
        if cursor.fetchone():
            logger.info("✅ Las tablas ya existen, omitiendo creación")
            _database_initialized = True
            return True
        
        # Crear todas las tablas necesarias
        tables = {
            'usuarios': """
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    correo VARCHAR(150) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    rol ENUM('admin', 'operador', 'cajero') DEFAULT 'operador',
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_correo (correo),
                    INDEX idx_rol (rol),
                    INDEX idx_activo (activo)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'proveedores': """
                CREATE TABLE IF NOT EXISTS proveedores (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    contacto VARCHAR(100),
                    telefono VARCHAR(20),
                    correo VARCHAR(150),
                    direccion TEXT,
                    notas TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_nombre (nombre),
                    INDEX idx_activo (activo)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,

            'preferencias_notificaciones': """
                CREATE TABLE IF NOT EXISTS preferencias_notificaciones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT NOT NULL,
                    recibir_email BOOLEAN DEFAULT TRUE,
                    recibir_sms BOOLEAN DEFAULT FALSE,
                    telefono VARCHAR(20),
                    frecuencia ENUM('inmediata', 'diaria', 'semanal') DEFAULT 'inmediata',
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_user_preferences (usuario_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'productos': """
                CREATE TABLE IF NOT EXISTS productos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                    unidad ENUM('kg', 'unidad', 'litro', 'gramo') DEFAULT 'kg',
                    stock_actual DECIMAL(10,3) DEFAULT 0,
                    stock_minimo DECIMAL(10,3) DEFAULT 0,
                    precio_unitario DECIMAL(10,2) NOT NULL,
                    precio_compra DECIMAL(10,2),
                    codigo_barras VARCHAR(50) UNIQUE,
                    descripcion TEXT,
                    imagen_url VARCHAR(255),
                    proveedor_id INT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                    INDEX idx_nombre (nombre),
                    INDEX idx_categoria (categoria),
                    INDEX idx_stock_bajo (stock_actual, stock_minimo),
                    INDEX idx_activo (activo),
                    INDEX idx_codigo_barras (codigo_barras)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'clientes': """
                CREATE TABLE IF NOT EXISTS clientes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    correo VARCHAR(150),
                    telefono VARCHAR(20),
                    direccion TEXT,
                    documento VARCHAR(20),
                    notas TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_nombre (nombre),
                    INDEX idx_correo (correo),
                    INDEX idx_documento (documento),
                    INDEX idx_activo (activo)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'ventas': """
                CREATE TABLE IF NOT EXISTS ventas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cliente_id INT,
                    usuario_id INT NOT NULL,
                    numero_venta VARCHAR(50),
                    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    forma_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'credito') DEFAULT 'efectivo',
                    subtotal DECIMAL(10,2) NOT NULL,
                    descuento DECIMAL(10,2) DEFAULT 0,
                    impuestos DECIMAL(10,2) DEFAULT 0,
                    total DECIMAL(10,2) NOT NULL,
                    estado ENUM('borrador', 'completada', 'cancelada') DEFAULT 'completada',
                    observaciones TEXT,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
                    INDEX idx_fecha (fecha),
                    INDEX idx_estado (estado),
                    INDEX idx_total (total),
                    INDEX idx_forma_pago (forma_pago)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'detalle_ventas': """
                CREATE TABLE IF NOT EXISTS detalle_ventas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    venta_id INT NOT NULL,
                    producto_id INT NOT NULL,
                    cantidad DECIMAL(10,3) NOT NULL,
                    precio_unitario DECIMAL(10,2) NOT NULL,
                    subtotal DECIMAL(10,2) NOT NULL,
                    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
                    INDEX idx_venta (venta_id),
                    INDEX idx_producto (producto_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'compras': """
                CREATE TABLE IF NOT EXISTS compras (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    proveedor_id INT,
                    usuario_id INT NOT NULL,
                    numero_compra VARCHAR(50),
                    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    subtotal DECIMAL(10,2) NOT NULL,
                    impuestos DECIMAL(10,2) DEFAULT 0,
                    total DECIMAL(10,2) NOT NULL,
                    estado ENUM('borrador', 'completada', 'cancelada') DEFAULT 'completada',
                    observaciones TEXT,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
                    INDEX idx_fecha (fecha),
                    INDEX idx_estado (estado)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'detalle_compras': """
                CREATE TABLE IF NOT EXISTS detalle_compras (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    compra_id INT NOT NULL,
                    producto_id INT NOT NULL,
                    cantidad DECIMAL(10,3) NOT NULL,
                    precio_unitario DECIMAL(10,2) NOT NULL,
                    subtotal DECIMAL(10,2) NOT NULL,
                    FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
                    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
                    INDEX idx_compra (compra_id),
                    INDEX idx_producto (producto_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'facturas': """
                CREATE TABLE IF NOT EXISTS facturas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nro_factura VARCHAR(20) UNIQUE NOT NULL,
                    id_venta INT,
                    cliente_nombre VARCHAR(100) NOT NULL,
                    cliente_documento VARCHAR(20),
                    cliente_direccion TEXT,
                    cliente_telefono VARCHAR(20),
                    subtotal DECIMAL(10,2) NOT NULL,
                    iva DECIMAL(10,2) DEFAULT 0,
                    total DECIMAL(10,2) NOT NULL,
                    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                    generado_por INT NOT NULL,
                    observaciones TEXT,
                    estado ENUM('emitida', 'anulada') DEFAULT 'emitida',
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id_venta) REFERENCES ventas(id) ON DELETE SET NULL,
                    FOREIGN KEY (generado_por) REFERENCES usuarios(id) ON DELETE RESTRICT,
                    INDEX idx_nro_factura (nro_factura),
                    INDEX idx_fecha (fecha),
                    INDEX idx_cliente (cliente_nombre),
                    INDEX idx_estado (estado),
                    INDEX idx_generado_por (generado_por)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'detalle_factura': """
                CREATE TABLE IF NOT EXISTS detalle_factura (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    id_factura INT NOT NULL,
                    producto VARCHAR(100) NOT NULL,
                    cantidad DECIMAL(10,3) NOT NULL,
                    precio_unitario DECIMAL(10,2) NOT NULL,
                    total_producto DECIMAL(10,2) NOT NULL,
                    FOREIGN KEY (id_factura) REFERENCES facturas(id) ON DELETE CASCADE,
                    INDEX idx_factura (id_factura)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'movimientos_stock': """
                CREATE TABLE IF NOT EXISTS movimientos_stock (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    producto_id INT NOT NULL,
                    tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                    cantidad DECIMAL(10,3) NOT NULL,
                    cantidad_anterior DECIMAL(10,3),
                    cantidad_nueva DECIMAL(10,3),
                    motivo VARCHAR(200),
                    observaciones TEXT,
                    referencia_id INT,
                    referencia_tipo ENUM('venta', 'compra', 'ajuste') DEFAULT 'ajuste',
                    usuario_id INT,
                    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                    INDEX idx_producto_fecha (producto_id, fecha),
                    INDEX idx_tipo (tipo),
                    INDEX idx_fecha (fecha)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'cierres_caja': """
                CREATE TABLE IF NOT EXISTS cierres_caja (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT NOT NULL,
                    fecha_cierre DATE NOT NULL,
                    hora_cierre TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    total_ventas_esperado DECIMAL(10,2) NOT NULL DEFAULT 0,
                    total_efectivo_contado DECIMAL(10,2) NOT NULL,
                    diferencia DECIMAL(10,2) GENERATED ALWAYS AS (total_efectivo_contado - total_ventas_esperado) STORED,
                    numero_ventas INT NOT NULL DEFAULT 0,
                    observaciones TEXT,
                    estado ENUM('abierto', 'cerrado') DEFAULT 'cerrado',
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
                    UNIQUE KEY unique_cierre_diario (usuario_id, fecha_cierre),
                    INDEX idx_fecha_cierre (fecha_cierre),
                    INDEX idx_usuario_fecha (usuario_id, fecha_cierre),
                    INDEX idx_estado (estado)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'notificaciones': """
                CREATE TABLE IF NOT EXISTS notificaciones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT,
                    tipo ENUM('stock', 'pago', 'cobro', 'general') NOT NULL,
                    titulo VARCHAR(255),
                    mensaje TEXT,
                    leida BOOLEAN DEFAULT FALSE,
                    canal ENUM('web', 'email', 'sms') DEFAULT 'web',
                    referencia_id INT,
                    referencia_tipo VARCHAR(50),
                    creada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                    INDEX idx_usuario_leida (usuario_id, leida),
                    INDEX idx_tipo (tipo),
                    INDEX idx_creada (creada)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'configuracion': """
                CREATE TABLE IF NOT EXISTS configuracion (
                    id INT PRIMARY KEY,
                    iva DECIMAL(5,2) DEFAULT 22.00,
                    moneda VARCHAR(10) DEFAULT 'UYU',
                    decimales INT DEFAULT 2,
                    nombre_fruteria VARCHAR(255) DEFAULT 'Frutería Nina',
                    direccion TEXT,
                    telefono VARCHAR(50),
                    email VARCHAR(100),
                    rut VARCHAR(50),
                    logo_url TEXT,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'categorias': """
                CREATE TABLE IF NOT EXISTS categorias (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    tipo ENUM('producto', 'gasto') NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_tipo (tipo),
                    INDEX idx_activo (activo),
                    INDEX idx_nombre (nombre)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """,
            
            'preferencias_notificaciones': """
                CREATE TABLE IF NOT EXISTS preferencias_notificaciones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT NOT NULL,
                    recibir_email BOOLEAN DEFAULT TRUE,
                    recibir_sms BOOLEAN DEFAULT FALSE,
                    telefono VARCHAR(20),
                    frecuencia ENUM('inmediata', 'diaria', 'semanal') DEFAULT 'inmediata',
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_user_preferences (usuario_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
        }
        
        for table_name, table_sql in tables.items():
            try:
                cursor.execute(table_sql)
                logger.info(f"✅ Tabla '{table_name}' creada/verificada")
            except mysql.connector.Error as e:
                if e.errno == 1050:  # Table already exists
                    logger.info(f"✅ Tabla '{table_name}' ya existe")
                else:
                    logger.error(f"❌ Error creando tabla '{table_name}': {e}")
                    raise
        
        connection.commit()
        logger.info("✅ Todas las tablas creadas exitosamente")
        _database_initialized = True
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creando tablas: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def jwt_required(f):
    """Decorador para rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token or not token.startswith('Bearer '):
            return jsonify({'message': 'Token de acceso requerido'}), 401
        
        try:
            token = token.split(' ')[1]
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = payload['user_id']
            return f(current_user_id, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        except Exception as e:
            logger.error(f"Error verificando token: {e}")
            return jsonify({'message': 'Error de autenticación'}), 401

    return decorated

def role_required(allowed_roles):
    """Decorador para rutas que requieren roles específicos"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            
            if not token or not token.startswith('Bearer '):
                return jsonify({'message': 'Token de acceso requerido'}), 401
            
            try:
                token = token.split(' ')[1]
                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                current_user_id = payload['user_id']
                
                # Verificar rol del usuario
                connection = get_db_connection()
                if not connection:
                    return jsonify({'message': 'Error de conexión a la base de datos'}), 500
                
                cursor = connection.cursor()
                cursor.execute("SELECT rol FROM usuarios WHERE id = %s AND activo = TRUE", (current_user_id,))
                user_role = cursor.fetchone()
                
                if not user_role or user_role[0] not in allowed_roles:
                    return jsonify({'message': 'Permisos insuficientes'}), 403
                
                cursor.close()
                connection.close()
                
                return f(current_user_id, *args, **kwargs)
                
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token expirado'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Token inválido'}), 401
            except Exception as e:
                logger.error(f"Error verificando token y rol: {e}")
                return jsonify({'message': 'Error de autenticación'}), 401

        return decorated
    return decorator

# ==================== ENDPOINTS DE AUTENTICACIÓN ====================

@app.route('/api/register', methods=['POST'])
def register():
    """Registrar nuevo usuario"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        # Fix: Accept both 'password' y 'contraseña' para coincidir con frontend
        if not data or not all(k in data for k in ('nombre', 'correo')) or not (data.get('password') or data.get('contraseña')):
            return jsonify({'message': 'Faltan campos requeridos: nombre, correo, contraseña'}), 400
        
        # Obtener contraseña de cualquiera de los nombres
        password = data.get('contraseña') or data.get('password')
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si el usuario ya existe
        cursor.execute("SELECT id FROM usuarios WHERE correo = %s", (data['correo'].strip().lower(),))
        if cursor.fetchone():
            return jsonify({'message': 'El correo ya está registrado'}), 409
        
        # Hashear password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Insertar usuario
        cursor.execute("""
            INSERT INTO usuarios (nombre, correo, password_hash, rol)
            VALUES (%s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['correo'].strip().lower(),
            hashed_password.decode('utf-8'),
            data.get('rol', 'operador')
        ))
        
        user_id = cursor.lastrowid
        connection.commit()
        
        # Generar token JWT
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        
        response = jsonify({
            'message': 'Usuario registrado exitosamente',
            'token': token,
            'user': {
                'id': user_id,
                'nombre': data['nombre'].strip(),
                'correo': data['correo'].strip().lower(),
                'rol': data.get('rol', 'operador')
            }
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error en registro: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/login', methods=['POST'])
def login():
    """Autenticar usuario"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        # Fix: Accept both 'password' y 'contraseña' para coincidir con frontend
        if not data or not data.get('correo') or not (data.get('password') or data.get('contraseña')):
            return jsonify({'message': 'Correo y contraseña son requeridos'}), 400
        
        # Obtener contraseña de cualquiera de los nombres
        password = data.get('contraseña') or data.get('password')
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Buscar usuario
        cursor.execute("""
            SELECT id, nombre, password_hash, rol, activo 
            FROM usuarios 
            WHERE correo = %s
        """, (data['correo'].strip().lower(),))
        
        user = cursor.fetchone()
        
        if not user or not user[4]:  # Usuario no existe o está inactivo
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        # Verificar password
        if not bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        # Generar token JWT
        payload = {
            'user_id': user[0],
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        
        response = jsonify({
            'message': 'Login exitoso',
            'token': token,
            'user': {
                'id': user[0],
                'nombre': user[1],
                'correo': data['correo'].strip().lower(),
                'rol': user[3]
            }
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error en login: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/verify-token', methods=['POST'])
def verify_token():
    """Verificar si un token es válido"""
    connection = None
    cursor = None
    
    try:
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'valid': False, 'message': 'Token no proporcionado'}), 401
        
        token = token.split(' ')[1]
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'valid': False, 'message': 'Error de base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el usuario aún existe y está activo
        cursor.execute("""
            SELECT id, nombre, correo, rol, activo 
            FROM usuarios 
            WHERE id = %s AND activo = TRUE
        """, (payload['user_id'],))
        
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'valid': False, 'message': 'Usuario no encontrado'}), 401
        
        response = jsonify({
            'valid': True,
            'user': {
                'id': user[0],
                'nombre': user[1],
                'correo': user[2],
                'rol': user[3]
            }
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False, 'message': 'Token expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'valid': False, 'message': 'Token inválido'}), 401
    except Exception as e:
        logger.error(f"Error verificando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard', methods=['GET'])
@jwt_required
def dashboard(current_user_id):
    """Obtener datos del dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Ventas del día
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
        """)
        ventas_hoy = cursor.fetchone()
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*)
            FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0]
        
        # Total de productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0]
        
        # Ventas del mes
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE()) 
            AND estado = 'completada'
        """)
        ventas_mes = cursor.fetchone()
        
        # Últimas ventas
        cursor.execute("""
            SELECT v.id, v.numero_venta, v.total, v.fecha, 
                   COALESCE(c.nombre, 'Cliente General') as cliente_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.estado = 'completada'
            ORDER BY v.fecha DESC
            LIMIT 5
        """)

        ultimas_ventas = []
        for row in cursor.fetchall():
            venta = {
                'id': row[0],
                'numero_venta': row[1],
                'total': float(row[2]),
                'fecha': row[3].isoformat() if row[3] else None,
                'cliente_nombre': row[4]
            }
            ultimas_ventas.append(venta)
        
        # Productos más vendidos (últimos 30 días)
        cursor.execute("""
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY total_vendido DESC
            LIMIT 5
        """)
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            producto = {
                'nombre': row[0],
                'cantidad_vendida': float(row[1])
            }
            productos_mas_vendidos.append(producto)
        
        dashboard_data = {
            'ventas_hoy': {
                'cantidad': ventas_hoy[0] or 0,
                'total': float(ventas_hoy[1] or 0)
            },
            'ventas_mes': {
                'cantidad': ventas_mes[0] or 0,
                'total': float(ventas_mes[1] or 0)
            },
            'productos_stock_bajo': productos_stock_bajo,
            'total_productos': total_productos,
            'ultimas_ventas': ultimas_ventas,
            'productos_mas_vendidos': productos_mas_vendidos
        }
        
        response = jsonify(dashboard_data)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo datos del dashboard: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ==================== ENDPOINTS ESPECÍFICOS DE DASHBOARD ====================

@app.route('/api/dashboard/resumen', methods=['GET'])
@jwt_required
def dashboard_resumen(current_user_id):
    """Obtener resumen general del dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Ventas del día
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
        """)
        ventas_hoy = cursor.fetchone()
        
        # Ventas del mes
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE()) 
            AND estado = 'completada'
        """)
        ventas_mes = cursor.fetchone()
        
        # Total de productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0]
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*)
            FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0]
        
        # Valor total del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) 
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = float(cursor.fetchone()[0])
        
        resumen = {
            'ventas_hoy': {
                'cantidad': ventas_hoy[0] or 0,
                'total': float(ventas_hoy[1] or 0)
            },
            'ventas_mes': {
                'cantidad': ventas_mes[0] or 0,
                'total': float(ventas_mes[1] or 0)
            },
            'total_productos': total_productos,
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': valor_inventario
        }
        
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo resumen del dashboard: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/stock-bajo', methods=['GET'])
@jwt_required
def dashboard_stock_bajo(current_user_id):
    """Obtener productos con stock bajo para el dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, 
                   p.stock_minimo, p.precio_unitario
            FROM productos p
            WHERE p.activo = TRUE AND p.stock_actual <= p.stock_minimo
            ORDER BY p.stock_actual ASC
            LIMIT 10
        """)
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'unidad': row[3],
                'stock_actual': float(row[4]),
                'stock_minimo': float(row[5]),
                'precio_unitario': float(row[6]),
                'stock_bajo': True
            }
            productos.append(producto)
        
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo productos con stock bajo: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/compras-recientes', methods=['GET'])
@jwt_required
def dashboard_compras_recientes(current_user_id):
    """Obtener compras recientes para el dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT c.id, c.numero_compra, c.fecha, c.total,
                   COALESCE(p.nombre, 'Sin proveedor') as proveedor_nombre
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            WHERE c.estado = 'completada'
            ORDER BY c.fecha DESC
            LIMIT 5
        """)
        
        compras = []
        for row in cursor.fetchall():
            compra = {
                'id': row[0],
                'numero_compra': row[1],
                'fecha': row[2].isoformat() if row[2] else None,
                'total': float(row[3]),
                'proveedor_nombre': row[4]
            }
            compras.append(compra)
        
        response = jsonify(compras)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo compras recientes: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/ventas-mensuales', methods=['GET'])
@jwt_required
def dashboard_ventas_mensuales(current_user_id):
    """Obtener datos de ventas mensuales para gráficos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Ventas de los últimos 12 meses
        cursor.execute("""
            SELECT 
                DATE_FORMAT(fecha, '%Y-%m') as mes,
                COUNT(*) as cantidad,
                SUM(total) as total
            FROM ventas 
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            AND estado = 'completada'
            GROUP BY DATE_FORMAT(fecha, '%Y-%m')
            ORDER BY mes
        """)
        
        ventas_mensuales = []
        for row in cursor.fetchall():
            venta = {
                'mes': row[0],
                'cantidad': row[1],
                'total': float(row[2])
            }
            ventas_mensuales.append(venta)
        
        response = jsonify(ventas_mensuales)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo ventas mensuales: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/stock-distribucion', methods=['GET'])
@jwt_required
def dashboard_stock_distribucion(current_user_id):
    """Obtener distribución de stock por categorías"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'frutas': 0, 'verduras': 0, 'otros': 0}), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT 
                categoria,
                COUNT(*) as cantidad,
                SUM(stock_actual) as stock_total
            FROM productos 
            WHERE activo = TRUE
            GROUP BY categoria
        """)
        
        distribucion = {'frutas': 0, 'verduras': 0, 'otros': 0}
        for row in cursor.fetchall():
            categoria = row[0]
            cantidad = row[1]
            stock_total = float(row[2])
            
            if categoria in distribucion:
                distribucion[categoria] = {
                    'cantidad_productos': cantidad,
                    'stock_total': stock_total
                }
        
        response = jsonify(distribucion)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo distribución de stock: {e}")
        return jsonify({'frutas': 0, 'verduras': 0, 'otros': 0}), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/ultimos-movimientos', methods=['GET'])
@jwt_required
def dashboard_ultimos_movimientos(current_user_id):
    """Obtener últimos movimientos de stock"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT m.id, m.producto_id, p.nombre as producto_nombre, m.tipo,
                   m.cantidad, m.motivo, m.fecha, u.nombre as usuario_nombre
            FROM movimientos_stock m
            INNER JOIN productos p ON m.producto_id = p.id
            LEFT JOIN usuarios u ON m.usuario_id = u.id
            ORDER BY m.fecha DESC
            LIMIT 10
        """)
        
        movimientos = []
        for row in cursor.fetchall():
            movimiento = {
                'id': row[0],
                'producto_id': row[1],
                'producto_nombre': row[2],
                'tipo': row[3],
                'cantidad': float(row[4]),
                'motivo': row[5] or '',
                'fecha': row[6].isoformat() if row[6] else None,
                'usuario_nombre': row[7] or ''
            }
            movimientos.append(movimiento)
        
        response = jsonify(movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo últimos movimientos: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE PRODUCTOS/INVENTARIO ====================

@app.route('/api/productos', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Obtener lista de productos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        categoria = request.args.get('categoria')
        busqueda = request.args.get('busqueda', '').strip()
        stock_bajo = request.args.get('stock_bajo') == 'true'
        limite = int(request.args.get('limite', 100))
        
        # Construir consulta
        query = """
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, 
                   p.stock_minimo, p.precio_unitario, p.precio_compra,
                   p.codigo_barras, p.activo, pr.nombre as proveedor_nombre,
                   p.descripcion, p.creado
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE
        """
        params = []
        
        if categoria:
            query += " AND p.categoria = %s"
            params.append(categoria)
        
        if busqueda:
            query += " AND (p.nombre LIKE %s OR p.codigo_barras LIKE %s)"
            params.extend([f"%{busqueda}%", f"%{busqueda}%"])
        
        if stock_bajo:
            query += " AND p.stock_actual <= p.stock_minimo"
        
        query += " ORDER BY p.nombre LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'unidad': row[3],
                'stock_actual': float(row[4]),
                'stock_minimo': float(row[5]),
                'precio_unitario': float(row[6]),
                'precio_compra': float(row[7]) if row[7] else 0,
                'codigo_barras': row[8] or '',
                'activo': bool(row[9]),
                'proveedor_nombre': row[10] or '',
                'descripcion': row[11] or '',
                'creado': row[12].isoformat() if row[12] else None,
                'stock_bajo': float(row[4]) <= float(row[5])
            }
            productos.append(producto)
        
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo productos: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/productos/<int:producto_id>', methods=['GET'])
@jwt_required
def obtener_producto(current_user_id, producto_id):
    """Obtener un producto específico"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, 
                   p.stock_minimo, p.precio_unitario, p.precio_compra,
                   p.codigo_barras, p.activo, pr.nombre as proveedor_nombre,
                   p.descripcion, p.creado, p.proveedor_id
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.id = %s
        """, (producto_id,))
        
        row = cursor.fetchone()
        if not row:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        producto = {
            'id': row[0],
            'nombre': row[1],
            'categoria': row[2],
            'unidad': row[3],
            'stock_actual': float(row[4]),
            'stock_minimo': float(row[5]),
            'precio_unitario': float(row[6]),
            'precio_compra': float(row[7]) if row[7] else 0,
            'codigo_barras': row[8] or '',
            'activo': bool(row[9]),
            'proveedor_nombre': row[10] or '',
            'descripcion': row[11] or '',
            'creado': row[12].isoformat() if row[12] else None,
            'proveedor_id': row[13],
            'stock_bajo': float(row[4]) <= float(row[5])
        }
        
        response = jsonify(producto)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/productos', methods=['POST'])
@jwt_required
def crear_producto(current_user_id):
    """Crear nuevo producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre') or not data.get('categoria'):
            return jsonify({'message': 'Nombre y categoría son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Insertar producto
        cursor.execute("""
            INSERT INTO productos (
                nombre, categoria, unidad, stock_actual, stock_minimo,
                precio_unitario, precio_compra, codigo_barras, descripcion, proveedor_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['categoria'],
            data.get('unidad', 'kg'),
            float(data.get('stock_actual', 0)),
            float(data.get('stock_minimo', 0)),
            float(data.get('precio_unitario', 0)),
            float(data.get('precio_compra', 0)) if data.get('precio_compra') else None,
            data.get('codigo_barras', '').strip() or None,
            data.get('descripcion', '').strip(),
            data.get('proveedor_id') if data.get('proveedor_id') else None
        ))
        
        producto_id = cursor.lastrowid
        connection.commit()
        
        response = jsonify({
            'message': 'Producto creado exitosamente',
            'id': producto_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/productos/<int:producto_id>', methods=['PUT'])
@jwt_required
def actualizar_producto(current_user_id, producto_id):
    """Actualizar producto existente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Datos requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT id FROM productos WHERE id = %s", (producto_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Actualizar producto
        cursor.execute("""
            UPDATE productos SET
                nombre = %s, categoria = %s, unidad = %s, stock_actual = %s,
                stock_minimo = %s, precio_unitario = %s, precio_compra = %s,
                codigo_barras = %s, descripcion = %s, proveedor_id = %s
            WHERE id = %s
        """, (
            data.get('nombre', '').strip(),
            data.get('categoria'),
            data.get('unidad', 'kg'),
            float(data.get('stock_actual', 0)),
            float(data.get('stock_minimo', 0)),
            float(data.get('precio_unitario', 0)),
            float(data.get('precio_compra', 0)) if data.get('precio_compra') else None,
            data.get('codigo_barras', '').strip() or None,
            data.get('descripcion', '').strip(),
            data.get('proveedor_id') if data.get('proveedor_id') else None,
            producto_id
        ))
        
        connection.commit()
        
        response = jsonify({'message': 'Producto actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error actualizando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/productos/<int:producto_id>', methods=['DELETE'])
@jwt_required
def eliminar_producto(current_user_id, producto_id):
    """Eliminar producto (soft delete)"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT nombre FROM productos WHERE id = %s", (producto_id,))
        producto = cursor.fetchone()
        if not producto:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Soft delete
        cursor.execute("UPDATE productos SET activo = FALSE WHERE id = %s", (producto_id,))
        connection.commit()
        
        response = jsonify({'message': 'Producto eliminado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error eliminando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/productos/stock-bajo', methods=['GET'])
@jwt_required
def obtener_productos_stock_bajo(current_user_id):
    """Obtener productos con stock bajo"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, 
                   p.stock_minimo, p.precio_unitario, pr.nombre as proveedor_nombre
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE AND p.stock_actual <= p.stock_minimo
            ORDER BY p.stock_actual ASC
        """)
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'unidad': row[3],
                'stock_actual': float(row[4]),
                'stock_minimo': float(row[5]),
                'precio_unitario': float(row[6]),
                'proveedor_nombre': row[7] or '',
                'stock_bajo': True
            }
            productos.append(producto)
        
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo productos con stock bajo: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_inventario(current_user_id):
    """Obtener estadísticas del inventario"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Total de productos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0]
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE activo = TRUE AND stock_actual <= stock_minimo
        """)
        productos_stock_bajo = cursor.fetchone()[0]
        
        # Valor total del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) 
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = float(cursor.fetchone()[0])
        
        # Stock total
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual), 0) 
            FROM productos WHERE activo = TRUE
        """)
        stock_total = float(cursor.fetchone()[0])
        
        # Productos por categoría
        cursor.execute("""
            SELECT categoria, COUNT(*) 
            FROM productos WHERE activo = TRUE 
            GROUP BY categoria
        """)
        productos_por_categoria = {}
        for row in cursor.fetchall():
            productos_por_categoria[row[0]] = row[1]
        
        estadisticas = {
            'total_productos': total_productos,
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': valor_inventario,
            'stock_total': stock_total,
            'productos_por_categoria': productos_por_categoria,
            'categorias_principales': list(productos_por_categoria.keys())
        }
        
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo estadísticas: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINT ESPECÍFICO DE INVENTARIO ====================

@app.route('/api/inventario/resumen', methods=['GET'])
@jwt_required
def obtener_resumen_inventario_completo(current_user_id):
    """Obtener resumen completo del inventario con estadísticas avanzadas"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Estadísticas generales
        cursor.execute("""
            SELECT 
                COUNT(*) as total_productos,
                COUNT(CASE WHEN stock_actual <= stock_minimo THEN 1 END) as productos_stock_bajo,
                COUNT(CASE WHEN stock_actual = 0 THEN 1 END) as productos_sin_stock,
                COALESCE(SUM(stock_actual * precio_unitario), 0) as valor_total_inventario,
                COALESCE(SUM(stock_actual), 0) as stock_total_unidades
            FROM productos 
            WHERE activo = TRUE
        """)
        
        estadisticas = cursor.fetchone()
        
        # Distribución por categorías
        cursor.execute("""
            SELECT 
                categoria,
                COUNT(*) as total_productos,
                SUM(stock_actual) as stock_total,
                SUM(stock_actual * precio_unitario) as valor_total
            FROM productos 
            WHERE activo = TRUE
            GROUP BY categoria
        """)
        
        distribucion_categorias = []
        for row in cursor.fetchall():
            distribucion_categorias.append({
                'categoria': row[0],
                'total_productos': row[1],
                'stock_total': float(row[2]),
                'valor_total': float(row[3])
            })
        
        # Productos con stock bajo - CORREGIDO
        cursor.execute("""
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, 
                   p.stock_minimo, p.precio_unitario, pr.nombre as proveedor_nombre
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE AND p.stock_actual <= p.stock_minimo
            ORDER BY p.stock_actual ASC
        """)
        
        productos_stock_bajo = []
        for row in cursor.fetchall():
            productos_stock_bajo.append({
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'unidad': row[3],
                'stock_actual': float(row[4]),
                'stock_minimo': float(row[5]),
                'precio_unitario': float(row[6]),
                'proveedor_nombre': row[7] or '',
                'stock_bajo': True
            })
        
        # Productos más vendidos (últimos 30 días)
        cursor.execute("""
            SELECT 
                p.nombre,
                SUM(dv.cantidad) as cantidad_vendida,
                SUM(dv.subtotal) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 5
        """)
        
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'nombre': row[0],
                'cantidad_vendida': float(row[1]),
                'total_vendido': float(row[2])
            })
        
        # Últimos movimientos de stock
        cursor.execute("""
            SELECT m.id, m.producto_id, p.nombre as producto_nombre, m.tipo,
                   m.cantidad, m.motivo, m.fecha, u.nombre as usuario_nombre
            FROM movimientos_stock m
            INNER JOIN productos p ON m.producto_id = p.id
            LEFT JOIN usuarios u ON m.usuario_id = u.id
            ORDER BY m.fecha DESC
            LIMIT 10
        """)
        
        ultimos_movimientos = []
        for row in cursor.fetchall():
            ultimos_movimientos.append({
                'id': row[0],
                'producto_id': row[1],
                'producto_nombre': row[2],
                'tipo': row[3],
                'cantidad': float(row[4]),
                'motivo': row[5] or '',
                'fecha': row[6].isoformat() if row[6] else None,
                'usuario_nombre': row[7] or ''
            })
        
        # Alertas
        alertas = []
        if estadisticas[1] > 0:  # productos_stock_bajo
            alertas.append({
                'tipo': 'stock_bajo',
                'mensaje': f'{estadisticas[1]} productos con stock bajo',
                'prioridad': 'alta' if estadisticas[1] > 5 else 'media'
            })
        
        if estadisticas[2] > 0:  # productos_sin_stock
            alertas.append({
                'tipo': 'sin_stock',
                'mensaje': f'{estadisticas[2]} productos sin stock',
                'prioridad': 'critica'
            })
        
        # Construir respuesta
        resumen = {
            'total_productos': estadisticas[0],
            'productos_stock_bajo': productos_stock_bajo,  # CORREGIDO: devolver la lista completa
            'productos_sin_stock': estadisticas[2],
            'valor_total_inventario': float(estadisticas[3]),
            'stock_total_unidades': float(estadisticas[4]),
            'distribucion_categorias': distribucion_categorias,
            'productos_mas_vendidos': productos_mas_vendidos,
            'ultimos_movimientos': ultimos_movimientos,
            'alertas': alertas
        }
        
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo resumen completo del inventario: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

            # ==================== ENDPOINT TEMPORAL PARA TESTING ====================

@app.route('/api/test/crear-productos-stock-bajo', methods=['POST'])
@jwt_required
def crear_productos_stock_bajo_test(current_user_id):
    """Endpoint temporal para crear productos con stock bajo para testing"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Actualizar algunos productos existentes para que tengan stock bajo
        productos_stock_bajo = [
            # Actualizar Uva Verde: stock_actual = 2, stock_minimo = 3
            (2.0, 3.0, 5),  # id = 5 (Uva Verde)
            # Actualizar Lechuga: stock_actual = 3, stock_minimo = 5  
            (3.0, 5.0, 7),  # id = 7 (Lechuga)
            # Actualizar Miel Natural: stock_actual = 0, stock_minimo = 1
            (0.0, 1.0, 12), # id = 12 (Miel Natural)
            # Actualizar Banana: stock_actual = 4, stock_minimo = 5
            (4.0, 5.0, 2),  # id = 2 (Banana)
        ]
        
        productos_actualizados = []
        
        for stock_actual, stock_minimo, producto_id in productos_stock_bajo:
            # Verificar que el producto existe
            cursor.execute("SELECT nombre FROM productos WHERE id = %s", (producto_id,))
            producto = cursor.fetchone()
            
            if producto:
                # Actualizar el producto
                cursor.execute("""
                    UPDATE productos 
                    SET stock_actual = %s, stock_minimo = %s 
                    WHERE id = %s
                """, (stock_actual, stock_minimo, producto_id))
                
                productos_actualizados.append({
                    'id': producto_id,
                    'nombre': producto[0],
                    'stock_actual': stock_actual,
                    'stock_minimo': stock_minimo
                })
        
        connection.commit()
        
        # Verificar cuántos productos tienen stock bajo ahora
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE activo = TRUE AND stock_actual <= stock_minimo
        """)
        total_stock_bajo = cursor.fetchone()[0]
        
        response = jsonify({
            'message': 'Productos con stock bajo creados exitosamente',
            'productos_actualizados': productos_actualizados,
            'total_productos_stock_bajo': total_stock_bajo
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error creando productos con stock bajo: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINT PARA RESETEAR PRODUCTOS ====================

@app.route('/api/test/resetear-productos', methods=['POST'])
@jwt_required
def resetear_productos_test(current_user_id):
    """Endpoint temporal para resetear productos a stock normal"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Resetear productos a stock normal
        productos_reset = [
            (15.0, 3.0, 5),   # Uva Verde
            (20.0, 5.0, 7),   # Lechuga  
            (8.0, 1.0, 12),   # Miel Natural
            (30.0, 5.0, 2),   # Banana
        ]
        
        for stock_actual, stock_minimo, producto_id in productos_reset:
            cursor.execute("""
                UPDATE productos 
                SET stock_actual = %s, stock_minimo = %s 
                WHERE id = %s
            """, (stock_actual, stock_minimo, producto_id))
        
        connection.commit()
        
        response = jsonify({'message': 'Productos reseteados exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error reseteando productos: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE MOVIMIENTOS DE STOCK ====================

@app.route('/api/stock/movimiento', methods=['POST'])
@jwt_required
def registrar_movimiento_stock(current_user_id):
    """Registrar movimiento de stock"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('producto_id', 'tipo', 'cantidad')):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener stock actual
        cursor.execute("SELECT stock_actual FROM productos WHERE id = %s", (data['producto_id'],))
        producto = cursor.fetchone()
        if not producto:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        stock_anterior = float(producto[0])
        cantidad = float(data['cantidad'])
        
        # Calcular nuevo stock
        if data['tipo'] == 'ingreso':
            stock_nuevo = stock_anterior + cantidad
        elif data['tipo'] == 'egreso':
            stock_nuevo = stock_anterior - cantidad
            if stock_nuevo < 0:
                return jsonify({'message': 'Stock insuficiente'}), 400
        else:  # ajuste
            stock_nuevo = cantidad
        
        # Registrar movimiento
        cursor.execute("""
            INSERT INTO movimientos_stock (
                producto_id, tipo, cantidad, cantidad_anterior, cantidad_nueva,
                motivo, observaciones, usuario_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['producto_id'],
            data['tipo'],
            cantidad,
            stock_anterior,
            stock_nuevo,
            data.get('motivo', ''),
            data.get('observaciones', ''),
            current_user_id
        ))
        
        # Actualizar stock del producto
        cursor.execute("""
            UPDATE productos SET stock_actual = %s WHERE id = %s
        """, (stock_nuevo, data['producto_id']))
        
        connection.commit()
        
        response = jsonify({
            'message': 'Movimiento registrado exitosamente',
            'stock_anterior': stock_anterior,
            'stock_nuevo': stock_nuevo
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error registrando movimiento: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/movimientos', methods=['GET'])
@jwt_required
def obtener_movimientos(current_user_id):
    """Obtener historial de movimientos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Parámetros de filtro
        producto_id = request.args.get('producto_id')
        tipo = request.args.get('tipo')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        limit = int(request.args.get('limit', 50))
        
        query = """
            SELECT m.id, m.producto_id, p.nombre as producto_nombre, m.tipo,
                   m.cantidad, m.cantidad_anterior, m.cantidad_nueva, m.motivo,
                   m.observaciones, m.fecha, u.nombre as usuario_nombre
            FROM movimientos_stock m
            INNER JOIN productos p ON m.producto_id = p.id
            LEFT JOIN usuarios u ON m.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        if producto_id:
            query += " AND m.producto_id = %s"
            params.append(producto_id)
        
        if tipo:
            query += " AND m.tipo = %s"
            params.append(tipo)
        
        if fecha_inicio:
            query += " AND DATE(m.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(m.fecha) <= %s"
            params.append(fecha_fin)
        
        query += " ORDER BY m.fecha DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(query, params)
        
        movimientos = []
        for row in cursor.fetchall():
            movimiento = {
                'id': row[0],
                'producto_id': row[1],
                'producto_nombre': row[2],
                'tipo': row[3],
                'cantidad': float(row[4]),
                'cantidad_anterior': float(row[5]) if row[5] else 0,
                'cantidad_nueva': float(row[6]) if row[6] else 0,
                'motivo': row[7] or '',
                'observaciones': row[8] or '',
                'fecha': row[9].isoformat() if row[9] else None,
                'usuario_nombre': row[10] or ''
            }
            movimientos.append(movimiento)
        
        response = jsonify(movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo movimientos: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE CLIENTES ====================

@app.route('/api/clientes', methods=['GET'])
@jwt_required
def obtener_clientes(current_user_id):
    """Obtener lista de clientes"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener filtros
        busqueda = request.args.get('busqueda', '').strip()
        limite = int(request.args.get('limite', 100))
        
        query = """
            SELECT id, nombre, correo, telefono, direccion, documento, notas, activo, creado
            FROM clientes
            WHERE activo = TRUE
        """
        params = []
        
        if busqueda:
            query += " AND (nombre LIKE %s OR correo LIKE %s OR documento LIKE %s)"
            params.extend([f"%{busqueda}%", f"%{busqueda}%", f"%{busqueda}%"])
        
        query += " ORDER BY nombre LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        clientes = []
        for row in cursor.fetchall():
            cliente = {
                'id': row[0],
                'nombre': row[1],
                'correo': row[2] or '',
                'telefono': row[3] or '',
                'direccion': row[4] or '',
                'documento': row[5] or '',
                'notas': row[6] or '',
                'activo': bool(row[7]),
                'creado': row[8].isoformat() if row[8] else None
            }
            clientes.append(cliente)
        
        response = jsonify(clientes)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obtener clientes: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes', methods=['POST'])
@jwt_required
def crear_cliente(current_user_id):
    """Crear nuevo cliente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'Nombre del cliente es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            INSERT INTO clientes (nombre, correo, telefono, direccion, documento, notas)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data.get('correo', '').strip(),
            data.get('telefono', '').strip(),
            data.get('direccion', '').strip(),
            data.get('documento', '').strip(),
            data.get('notas', '').strip()
        ))
        
        cliente_id = cursor.lastrowid
        connection.commit()
        
        response = jsonify({
            'message': 'Cliente creado exitosamente',
            'id': cliente_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/<int:cliente_id>', methods=['PUT'])
@jwt_required
def actualizar_cliente(current_user_id, cliente_id):
    """Actualizar cliente existente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Datos requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el cliente existe
        cursor.execute("SELECT id FROM clientes WHERE id = %s", (cliente_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        # Actualizar cliente
        cursor.execute("""
            UPDATE clientes SET
                nombre = %s, correo = %s, telefono = %s, direccion = %s,
                documento = %s, notas = %s
            WHERE id = %s
        """, (
            data.get('nombre', '').strip(),
            data.get('correo', '').strip(),
            data.get('telefono', '').strip(),
            data.get('direccion', '').strip(),
            data.get('documento', '').strip(),
            data.get('notas', '').strip(),
            cliente_id
        ))
        
        connection.commit()
        
        response = jsonify({'message': 'Cliente actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error actualizando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/<int:cliente_id>', methods=['DELETE'])
@jwt_required
def eliminar_cliente(current_user_id, cliente_id):
    """Eliminar cliente (soft delete)"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el cliente existe
        cursor.execute("SELECT nombre FROM clientes WHERE id = %s", (cliente_id,))
        cliente = cursor.fetchone()

        if not cliente:
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        # Soft delete
        cursor.execute("UPDATE clientes SET activo = FALSE WHERE id = %s", (cliente_id,))
        connection.commit()
        
        response = jsonify({'message': 'Cliente eliminado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error eliminando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_clientes(current_user_id):
    """Obtener estadísticas de clientes"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Total de clientes
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo = TRUE")
        total_clientes = cursor.fetchone()[0]
        
        # Clientes activos (con compras en los últimos 30 días)
        cursor.execute("""
            SELECT COUNT(DISTINCT cliente_id) 
            FROM ventas 
            WHERE cliente_id IS NOT NULL 
            AND fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND estado = 'completada'
        """)
        clientes_activos = cursor.fetchone()[0]
        
        # Clientes con compras
        cursor.execute("""
            SELECT COUNT(DISTINCT cliente_id) 
            FROM ventas 
            WHERE cliente_id IS NOT NULL AND estado = 'completada'
        """)
        clientes_con_compras = cursor.fetchone()[0]
        
        # Promedio de compras por cliente
        cursor.execute("""
            SELECT AVG(total_compras) FROM (
                SELECT COUNT(*) as total_compras
                FROM ventas 
                WHERE cliente_id IS NOT NULL AND estado = 'completada'
                GROUP BY cliente_id
            ) as subquery
        """)
        promedio_compras = float(cursor.fetchone()[0] or 0)
        
        estadisticas = {
            'total_clientes': total_clientes,
            'clientes_activos': clientes_activos,
            'clientes_con_compras': clientes_con_compras,
            'promedio_compras': round(promedio_compras, 2)
        }
        
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo estadísticas de clientes: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE PROVEEDORES ====================

@app.route('/api/proveedores', methods=['GET'])
@jwt_required
def obtener_proveedores(current_user_id):
    """Obtener lista de proveedores"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT id, nombre, contacto, telefono, correo, direccion, notas, activo, creado
            FROM proveedores
            WHERE activo = TRUE
            ORDER BY nombre
        """)
        
        proveedores = []
        for row in cursor.fetchall():
            proveedor = {
                'id': row[0],
                'nombre': row[1],
                'contacto': row[2] or '',
                'telefono': row[3] or '',
                'correo': row[4] or '',
                'direccion': row[5] or '',
                'notas': row[6] or '',
                'activo': bool(row[7]),
                'creado': row[8].isoformat() if row[8] else None
            }
            proveedores.append(proveedor)
        
        response = jsonify(proveedores)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo proveedores: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/proveedores', methods=['POST'])
@jwt_required
def crear_proveedor(current_user_id):
    """Crear nuevo proveedor"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'Nombre del proveedor es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, notas)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data.get('contacto', '').strip(),
            data.get('telefono', '').strip(),
            data.get('correo', '').strip(),
            data.get('direccion', '').strip(),
            data.get('notas', '').strip()
        ))
        
        proveedor_id = cursor.lastrowid
        connection.commit()
        
        response = jsonify({
            'message': 'Proveedor creado exitosamente',
            'id': proveedor_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando proveedor: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/proveedores/<int:proveedor_id>', methods=['PUT'])
@jwt_required
def actualizar_proveedor(current_user_id, proveedor_id):
    """Actualizar proveedor existente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Datos requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el proveedor existe
        cursor.execute("SELECT id FROM proveedores WHERE id = %s", (proveedor_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        # Actualizar proveedor
        cursor.execute("""
            UPDATE proveedores SET
                nombre = %s, contacto = %s, telefono = %s, correo = %s,
                direccion = %s, notas = %s
            WHERE id = %s
        """, (
            data.get('nombre', '').strip(),
            data.get('contacto', '').strip(),
            data.get('telefono', '').strip(),
            data.get('correo', '').strip(),
            data.get('direccion', '').strip(),
            data.get('notas', '').strip(),
            proveedor_id
        ))
        
        connection.commit()
        
        response = jsonify({'message': 'Proveedor actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error actualizando proveedor: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/proveedores/<int:proveedor_id>', methods=['DELETE'])
@jwt_required
def eliminar_proveedor(current_user_id, proveedor_id):
    """Eliminar proveedor (soft delete)"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el proveedor existe
        cursor.execute("SELECT nombre FROM proveedores WHERE id = %s", (proveedor_id,))
        proveedor = cursor.fetchone()
        if not proveedor:
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        # Soft delete
        cursor.execute("UPDATE proveedores SET activo = FALSE WHERE id = %s", (proveedor_id,))
        connection.commit()
        
        response = jsonify({'message': 'Proveedor eliminado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error eliminando proveedor: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE NOTIFICACIONES ====================

@app.route('/api/notificaciones', methods=['GET'])
@jwt_required
def obtener_notificaciones(current_user_id):
    """Obtener notificaciones del usuario"""
    try:
        # Obtener filtros de la query string
        filtros = {}
        if request.args.get('tipo'):
            filtros['tipo'] = request.args.get('tipo')
        if request.args.get('leida') is not None:
            filtros['leida'] = request.args.get('leida').lower() == 'true'
        if request.args.get('fecha_desde'):
            filtros['fecha_desde'] = request.args.get('fecha_desde')
        if request.args.get('fecha_hasta'):
            filtros['fecha_hasta'] = request.args.get('fecha_hasta')
        if request.args.get('limite'):
            filtros['limite'] = int(request.args.get('limite'))
        
        notificaciones = NotificacionesController.obtener_notificaciones(current_user_id, filtros)
        
        response = jsonify(notificaciones)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        logger.error(f"Error obteniendo notificaciones: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/no-leidas', methods=['GET'])
@jwt_required
def contar_notificaciones_no_leidas(current_user_id):
    """Contar notificaciones no leídas"""
    try:
        count = NotificacionesController.contar_no_leidas(current_user_id)
        
        response = jsonify({'count': count})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        logger.error(f"Error contando notificaciones no leídas: {e}")
        return jsonify({'count': 0}), 200

@app.route('/api/notificaciones/marcar-leidas', methods=['POST'])
@jwt_required
def marcar_notificaciones_leidas(current_user_id):
    """Marcar notificaciones como leídas"""
    try:
        data = request.get_json() or {}
        notificacion_ids = data.get('notificacion_ids')
        
        success = NotificacionesController.marcar_como_leidas(current_user_id, notificacion_ids)
        
        if success:
            response = jsonify({'message': 'Notificaciones marcadas como leídas'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        else:
            return jsonify({'message': 'Error marcando notificaciones'}), 500
            
    except Exception as e:
        logger.error(f"Error marcando notificaciones como leídas: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/configuracion', methods=['GET'])
@jwt_required
def obtener_configuracion_notificaciones(current_user_id):
    """Obtener configuración de notificaciones del usuario"""
    try:
        configuracion = NotificacionesController.obtener_configuracion(current_user_id)
        
        if configuracion:
            response = jsonify(configuracion)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        else:
            return jsonify({'message': 'Error obteniendo configuración'}), 500
            
    except Exception as e:
        logger.error(f"Error obteniendo configuración de notificaciones: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/configuracion', methods=['PUT'])
@jwt_required
def actualizar_configuracion_notificaciones(current_user_id):
    """Actualizar configuración de notificaciones"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Datos de configuración requeridos'}), 400
        
        success = NotificacionesController.actualizar_configuracion(current_user_id, data)
        
        if success:
            response = jsonify({'message': 'Configuración actualizada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        else:
            return jsonify({'message': 'Error actualizando configuración'}), 500
            
    except Exception as e:
        logger.error(f"Error actualizando configuración de notificaciones: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/verificar-alertas', methods=['POST'])
@jwt_required
def verificar_alertas_sistema(current_user_id):
    """Verificar y crear alertas automáticas del sistema"""
    try:
        # Verificar alertas de stock bajo
        productos_stock_bajo = NotificacionesController.verificar_alertas_stock()
        
        # Verificar pagos pendientes
        pagos_pendientes = NotificacionesController.verificar_pagos_pendientes()
        
        # Verificar cobros pendientes
        cobros_pendientes = NotificacionesController.verificar_cobros_pendientes()
        
        resultado = {
            'productos_stock_bajo': len(productos_stock_bajo),
            'pagos_pendientes': len(pagos_pendientes),
            'cobros_pendientes': len(cobros_pendientes),
            'alertas_creadas': True
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        logger.error(f"Error verificando alertas del sistema: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

# ==================== ENDPOINTS DE VENTAS ====================

# ==================== ENDPOINTS DE VENTAS ====================

@app.route('/api/ventas', methods=['GET'])
@jwt_required
def obtener_ventas(current_user_id):
    """Obtener lista de ventas"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Parámetros de filtro
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        estado = request.args.get('estado')
        cliente_id = request.args.get('cliente_id')
        limite = int(request.args.get('limite', 50))
        
        query = """
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.subtotal,
                   v.descuento, v.impuestos, v.total, v.estado, v.observaciones,
                   COALESCE(c.nombre, 'Cliente General') as cliente_nombre,
                   u.nombre as usuario_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        if fecha_inicio:
            query += " AND DATE(v.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(v.fecha) <= %s"
            params.append(fecha_fin)
        
        if estado:
            query += " AND v.estado = %s"
            params.append(estado)
        
        if cliente_id:
            query += " AND v.cliente_id = %s"
            params.append(cliente_id)
        
        query += " ORDER BY v.fecha DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        ventas = []
        for row in cursor.fetchall():
            venta = {
                'id': row[0],
                'numero_venta': row[1] or '',
                'fecha': row[2].isoformat() if row[2] else None,
                'forma_pago': row[3],
                'subtotal': float(row[4]),
                'descuento': float(row[5]),
                'impuestos': float(row[6]),
                'total': float(row[7]),
                'estado': row[8],
                'observaciones': row[9] or '',
                'cliente_nombre': row[10],
                'usuario_nombre': row[11] or ''
            }
            ventas.append(venta)
        
        response = jsonify(ventas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo ventas: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


# ==================== ENDPOINT PARA INICIALIZAR APLICACIÓN ====================

@app.route('/api/init', methods=['POST'])
def init_database():
    """Inicializar base de datos y crear datos por defecto"""
    try:
        # Crear las tablas
        if create_tables():
            logger.info("✅ Base de datos inicializada correctamente")
            return jsonify({'message': 'Base de datos inicializada correctamente'}), 200
        else:
            logger.error("❌ Error inicializando la base de datos")
            return jsonify({'message': 'Error inicializando la base de datos'}), 500
    except Exception as e:
        logger.error(f"❌ Error en inicialización: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500


# ==================== HANDLER DE ERRORES ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Endpoint no encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Error interno del servidor'}), 500


# ==================== INICIALIZACIÓN ====================

if __name__ == '__main__':
    logger.info("🚀 Iniciando servidor de Frutería Nina...")
    
    # Inicializar base de datos
    if create_tables():
        logger.info("✅ Base de datos lista")
    else:
        logger.error("❌ Error configurando base de datos")
    
    # Ejecutar servidor
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"🌐 Servidor ejecutándose en puerto {port}")
    logger.info(f"🔧 Modo debug: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)