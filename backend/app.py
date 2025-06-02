import os
import logging
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import smtplib

# Fix for email import issues
try:
    from email.mime.text import MimeText
    from email.mime.multipart import MimeMultipart
except ImportError:
    # Alternative import for problematic environments
    import email.mime.text as mime_text
    import email.mime.multipart as mime_multipart
    MimeText = mime_text.MimeText
    MimeMultipart = mime_multipart.MimeMultipart

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
    'raise_on_warnings': True
}

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
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            logger.error("❌ No se pudo conectar a la base de datos. Verifica que la base de datos 'fruteria_nina' exista.")
            return False
            
        cursor = connection.cursor()
        
        # Verificar que estamos usando la base de datos correcta
        cursor.execute(f"USE {DB_CONFIG['database']}")
        logger.info(f"✅ Conectado a la base de datos: {DB_CONFIG['database']}")
        
        # Definir todas las tablas
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
            
            'preferencias_notificaciones': """
                CREATE TABLE IF NOT EXISTS preferencias_notificaciones (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT,
                    recibir_email BOOLEAN DEFAULT TRUE,
                    recibir_sms BOOLEAN DEFAULT FALSE,
                    telefono VARCHAR(20),
                    frecuencia ENUM('inmediata', 'diaria', 'semanal') DEFAULT 'inmediata',
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
                    UNIQUE KEY unique_usuario (usuario_id)
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
            """
        }
        
        for table_name, table_sql in tables.items():
            cursor.execute(table_sql)
            logger.info(f"✅ Tabla '{table_name}' creada/verificada")
        
        connection.commit()
        logger.info("✅ Todas las tablas creadas exitosamente")
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
        
        if not data or not all(k in data for k in ('nombre', 'correo', 'password')):
            return jsonify({'message': 'Faltan campos requeridos: nombre, correo, password'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si el usuario ya existe
        cursor.execute("SELECT id FROM usuarios WHERE correo = %s", (data['correo'].strip().lower(),))
        if cursor.fetchone():
            return jsonify({'message': 'El correo ya está registrado'}), 409
        
        # Hashear password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
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
        
        if not data or not all(k in data for k in ('correo', 'password')):
            return jsonify({'message': 'Correo y contraseña son requeridos'}), 400
        
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
        if not bcrypt.checkpw(data['password'].encode('utf-8'), user[2].encode('utf-8')):
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
            ORDER BY
Collapse Code

Reject
Accept

Click to continue generating
Claude 4 sonnet PCAI





sigue

app.py



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

# ==================== ENDPOINTS DE INVENTARIO/PRODUCTOS ====================

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
        logger.error(f"Error obteniendo clientes: {e}")
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
        
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        limite = int(request.args.get('limite', 50))
        
        query = """
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.subtotal,
                   v.descuento, v.impuestos, v.total, v.estado, v.observaciones,
                   c.nombre as cliente_nombre, u.nombre as usuario_nombre
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
        
        query += " ORDER BY v.fecha DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        ventas = []
        for row in cursor.fetchall():
            venta = {
                'id': row[0],
                'numero_venta': row[1],
                'fecha': row[2].isoformat() if row[2] else None,
                'forma_pago': row[3],
                'subtotal': float(row[4]),
                'descuento': float(row[5]),
                'impuestos': float(row[6]),
                'total': float(row[7]),
                'estado': row[8],
                'observaciones': row[9] or '',
                'cliente_nombre': row[10] or 'Cliente General',
                'usuario_nombre': row[11]
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

@app.route('/api/ventas', methods=['POST'])
@jwt_required
def crear_venta(current_user_id):
    """Crear nueva venta"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('productos') or not data.get('total'):
            return jsonify({'message': 'Productos y total son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Generar número de venta
        cursor.execute("SELECT COUNT(*) FROM ventas WHERE DATE(fecha) = CURDATE()")
        ventas_hoy = cursor.fetchone()[0] + 1
        numero_venta = f"V{datetime.now().strftime('%Y%m%d')}-{ventas_hoy:04d}"
        
        # Insertar venta
        cursor.execute("""
            INSERT INTO ventas (
                cliente_id, usuario_id, numero_venta, forma_pago,
                subtotal, descuento, impuestos, total, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('cliente_id'),
            current_user_id,
            numero_venta,
            data.get('forma_pago', 'efectivo'),
            float(data.get('subtotal', 0)),
            float(data.get('descuento', 0)),
            float(data.get('impuestos', 0)),
            float(data['total']),
            data.get('observaciones', '')
        ))
        
        venta_id = cursor.lastrowid
        
        # Insertar detalle de productos
        for producto in data['productos']:
            cursor.execute("""
                INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                venta_id,
                producto['id'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                float(producto['subtotal'])
            ))
            
            # Actualizar stock del producto
            cursor.execute("""
                UPDATE productos 
                SET stock_actual = stock_actual - %s 
                WHERE id = %s
            """, (float(producto['cantidad']), producto['id']))
            
            # Registrar movimiento de stock
            cursor.execute("""
                INSERT INTO movimientos_stock (
                    producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id
                ) VALUES (%s, 'egreso', %s, 'Venta', %s, 'venta', %s)
            """, (producto['id'], float(producto['cantidad']), venta_id, current_user_id))
        
        connection.commit()
        
        response = jsonify({
            'message': 'Venta creada exitosamente',
            'id': venta_id,
            'numero_venta': numero_venta
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando venta: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE COMPRAS ====================

@app.route('/api/compras', methods=['GET'])
@jwt_required
def obtener_compras(current_user_id):
    """Obtener lista de compras"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        limite = int(request.args.get('limite', 50))
        
        query = """
            SELECT c.id, c.numero_compra, c.fecha, c.subtotal, c.impuestos,
                   c.total, c.estado, c.observaciones,
                   p.nombre as proveedor_nombre, u.nombre as usuario_nombre
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        if fecha_inicio:
            query += " AND DATE(c.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(c.fecha) <= %s"
            params.append(fecha_fin)
        
        query += " ORDER BY c.fecha DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        compras = []
        for row in cursor.fetchall():
            compra = {
                'id': row[0],
                'numero_compra': row[1],
                'fecha': row[2].isoformat() if row[2] else None,
                'subtotal': float(row[3]),
                'impuestos': float(row[4]),
                'total': float(row[5]),
                'estado': row[6],
                'observaciones': row[7] or '',
                'proveedor_nombre': row[8] or 'Sin proveedor',
                'usuario_nombre': row[9]
            }
            compras.append(compra)
        
        response = jsonify(compras)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo compras: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras', methods=['POST'])
@jwt_required
def crear_compra(current_user_id):
    """Crear nueva compra"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('productos') or not data.get('total'):
            return jsonify({'message': 'Productos y total son requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Generar número de compra
        cursor.execute("SELECT COUNT(*) FROM compras WHERE DATE(fecha) = CURDATE()")
        compras_hoy = cursor.fetchone()[0] + 1
        numero_compra = f"C{datetime.now().strftime('%Y%m%d')}-{compras_hoy:04d}"
        
        # Insertar compra
        cursor.execute("""
            INSERT INTO compras (
                proveedor_id, usuario_id, numero_compra, subtotal, impuestos, total, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('proveedor_id'),
            current_user_id,
            numero_compra,
            float(data.get('subtotal', 0)),
            float(data.get('impuestos', 0)),
            float(data['total']),
            data.get('observaciones', '')
        ))
        
        compra_id = cursor.lastrowid
        
        # Insertar detalle de productos
        for producto in data['productos']:
            cursor.execute("""
                INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                compra_id,
                producto['id'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                float(producto['subtotal'])
            ))
            
            # Actualizar stock del producto
            cursor.execute("""
                UPDATE productos 
                SET stock_actual = stock_actual + %s, precio_compra = %s
                WHERE id = %s
            """, (float(producto['cantidad']), float(producto['precio_unitario']), producto['id']))
            
            # Registrar movimiento de stock
            cursor.execute("""
                INSERT INTO movimientos_stock (
                    producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id
                ) VALUES (%s, 'ingreso', %s, 'Compra', %s, 'compra', %s)
            """, (producto['id'], float(producto['cantidad']), compra_id, current_user_id))
        
        connection.commit()
        
        response = jsonify({
            'message': 'Compra creada exitosamente',
            'id': compra_id,
            'numero_compra': numero_compra
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando compra: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE FACTURACIÓN ====================

def generar_numero_factura():
    """Genera el siguiente número de factura correlativo"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return None
            
        cursor = connection.cursor()
        
        # Obtener el último número de factura
        cursor.execute("""
            SELECT nro_factura FROM facturas 
            WHERE nro_factura LIKE 'FCT-%' 
            ORDER BY id DESC LIMIT 1
        """)
        
        ultimo_numero = cursor.fetchone()
        
        if ultimo_numero:
            # Extraer el número y incrementar
            numero_actual = int(ultimo_numero[0].split('-')[1])
            nuevo_numero = numero_actual + 1
        else:
            # Primera factura
            nuevo_numero = 1
        
        # Formatear con ceros a la izquierda
        nro_factura = f"FCT-{nuevo_numero:06d}"
        
        return nro_factura
        
    except Exception as e:
        logger.error(f"Error generando número de factura: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/facturas/ultimo-numero', methods=['GET'])
@jwt_required
def obtener_ultimo_numero_factura(current_user_id):
    """Obtiene el último número correlativo registrado"""
    try:
        nro_factura = generar_numero_factura()
        
        if nro_factura:
            response = jsonify({
                'ultimo_numero': nro_factura,
                'siguiente_numero': nro_factura
            })
        else:
            response = jsonify({
                'ultimo_numero': 'FCT-000000',
                'siguiente_numero': 'FCT-000001'
            })
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        logger.error(f"Error obteniendo último número de factura: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/facturas/crear', methods=['POST'])
@jwt_required
def crear_factura(current_user_id):
    """Crear nueva factura"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['cliente_nombre', 'productos', 'subtotal', 'total']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        if not data['productos'] or len(data['productos']) == 0:
            return jsonify({'message': 'Debe incluir al menos un producto'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Generar número de factura
        nro_factura = generar_numero_factura()
        if not nro_factura:
            return jsonify({'message': 'Error generando número de factura'}), 500
        
        # Calcular IVA (22% en Uruguay)
        subtotal = float(data['subtotal'])
        iva = subtotal * 0.22
        total = float(data['total'])
        
        # Insertar factura
        cursor.execute("""
            INSERT INTO facturas (
                nro_factura, id_venta, cliente_nombre, cliente_documento, 
                cliente_direccion, cliente_telefono, subtotal, iva, total, 
                generado_por, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            nro_factura,
            data.get('id_venta'),
            data['cliente_nombre'],
            data.get('cliente_documento', ''),
            data.get('cliente_direccion', ''),
            data.get('cliente_telefono', ''),
            subtotal,
            iva,
            total,
            current_user_id,
            data.get('observaciones', '')
        ))
        
        factura_id = cursor.lastrowid
        
        # Insertar detalle de productos
        for producto in data['productos']:
            cursor.execute("""
                INSERT INTO detalle_factura (
                    id_factura, producto, cantidad, precio_unitario, total_producto
                ) VALUES (%s, %s, %s, %s, %s)
            """, (
                factura_id,
                producto['nombre'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                float(producto['total'])
            ))
        
        connection.commit()
        
        # Obtener la factura completa para respuesta
        cursor.execute("""
            SELECT f.id, f.nro_factura, f.cliente_nombre, f.cliente_documento,
                   f.subtotal, f.iva, f.total, f.fecha, f.observaciones,
                   u.nombre as generado_por_nombre
            FROM facturas f
            INNER JOIN usuarios u ON f.generado_por = u.id
            WHERE f.id = %s
        """, (factura_id,))
        
        factura_data = cursor.fetchone()
        
        resultado = {
            'id': factura_data[0],
            'nro_factura': factura_data[1],
            'cliente_nombre': factura_data[2],
            'cliente_documento': factura_data[3] or '',
            'subtotal': float(factura_data[4]),
            'iva': float(factura_data[5]),
            'total': float(factura_data[6]),
            'fecha': factura_data[7].isoformat() if factura_data[7] else None,
            'observaciones': factura_data[8] or '',
            'generado_por_nombre': factura_data[9],
            'productos': data['productos']
        }
        
        logger.info(f"Factura creada: {nro_factura} por usuario {current_user_id}")
        
        response = jsonify({
            'message': 'Factura creada exitosamente',
            'factura': resultado
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando factura: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/facturas/historial', methods=['GET'])
@jwt_required
def obtener_historial_facturas(current_user_id):
    """Obtener lista completa de facturas"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        cliente = request.args.get('cliente', '').strip()
        numero = request.args.get('numero', '').strip()
        limite = int(request.args.get('limite', 50))
        
        # Construir consulta
        query = """
            SELECT f.id, f.nro_factura, f.cliente_nombre, f.cliente_documento,
                   f.subtotal, f.iva, f.total, f.fecha, f.estado,
                   u.nombre as generado_por_nombre
            FROM facturas f
            INNER JOIN usuarios u ON f.generado_por = u.id
            WHERE 1=1
        """
        params = []
        
        if fecha_inicio:
            query += " AND DATE(f.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(f.fecha) <= %s"
            params.append(fecha_fin)
        
        if cliente:
            query += " AND f.cliente_nombre LIKE %s"
            params.append(f"%{cliente}%")
        
        if numero:
            query += " AND f.nro_factura LIKE %s"
            params.append(f"%{numero}%")
        
        query += " ORDER BY f.fecha DESC, f.id DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        facturas = []
        for row in cursor.fetchall():
            factura = {
                'id': row[0],
                'nro_factura': row[1],
                'cliente_nombre': row[2],
                'cliente_documento': row[3] or '',
                'subtotal': float(row[4]),
                'iva': float(row[5]),
                'total': float(row[6]),
                'fecha': row[7].isoformat() if row[7] else None,
                'estado': row[8],
                'generado_por_nombre': row[9]
            }
            facturas.append(factura)
        
        response = jsonify(facturas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo historial de facturas: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/facturas/<int:factura_id>', methods=['GET'])
@jwt_required
def obtener_detalle_factura(current_user_id, factura_id):
    """Ver detalle de una factura"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener datos de la factura
        cursor.execute("""
            SELECT f.id, f.nro_factura, f.cliente_nombre, f.cliente_documento,
                   f.cliente_direccion, f.cliente_telefono, f.subtotal, f.iva, 
                   f.total, f.fecha, f.estado, f.observaciones,
                   u.nombre as generado_por_nombre
            FROM facturas f
            INNER JOIN usuarios u ON f.generado_por = u.id
            WHERE f.id = %s
        """, (factura_id,))
        
        factura_data = cursor.fetchone()
        
        if not factura_data:
            return jsonify({'message': 'Factura no encontrada'}), 404
        
        # Obtener detalle de productos
        cursor.execute("""
            SELECT producto, cantidad, precio_unitario, total_producto
            FROM detalle_factura
            WHERE id_factura = %s
            ORDER BY id
        """, (factura_id,))
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'nombre': row[0],
                'cantidad': float(row[1]),
                'precio_unitario': float(row[2]),
                'total': float(row[3])
            }
            productos.append(producto)
        
        resultado = {
            'id': factura_data[0],
            'nro_factura': factura_data[1],
            'cliente_nombre': factura_data[2],
            'cliente_documento': factura_data[3] or '',
            'cliente_direccion': factura_data[4] or '',
            'cliente_telefono': factura_data[5] or '',
            'subtotal': float(factura_data[6]),
            'iva': float(factura_data[7]),
            'total': float(factura_data[8]),
            'fecha': factura_data[9].isoformat() if factura_data[9] else None,
            'estado': factura_data[10],
            'observaciones': factura_data[11] or '',
            'generado_por_nombre': factura_data[12],
            'productos': productos
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo detalle de factura: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE CONFIGURACIÓN ====================

@app.route('/api/configuracion', methods=['GET'])
@jwt_required
def obtener_configuracion(current_user_id):
    """Obtener configuración del sistema"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener configuración principal
        cursor.execute("SELECT * FROM configuracion WHERE id = 1")
        config_data = cursor.fetchone()
        
        if not config_data:
            # Crear configuración por defecto
            cursor.execute("""
                INSERT INTO configuracion (id, iva, moneda, decimales, nombre_fruteria)
                VALUES (1, 22.00, 'UYU', 2, 'Frutería Nina')
            """)
            connection.commit()
            
            config_data = (1, 22.00, 'UYU', 2, 'Frutería Nina', None, None, None, None, None, None, None)
        
        configuracion = {
            'id': config_data[0],
            'iva': float(config_data[1]),
            'moneda': config_data[2],
            'decimales': config_data[3],
            'nombre_fruteria': config_data[4],
            'direccion': config_data[5] or '',
            'telefono': config_data[6] or '',
            'email': config_data[7] or '',
            'rut': config_data[8] or '',
            'logo_url': config_data[9] or ''
        }
        
        response = jsonify(configuracion)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo configuración: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/configuracion', methods=['PUT'])
@role_required(['admin'])
def actualizar_configuracion(current_user_id):
    """Actualizar configuración del sistema"""
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
        
        # Actualizar configuración
        cursor.execute("""
            UPDATE configuracion SET
                iva = %s,
                moneda = %s,
                decimales = %s,
                nombre_fruteria = %s,
                direccion = %s,
                telefono = %s,
                email = %s,
                rut = %s,
                logo_url = %s,
                actualizado = CURRENT_TIMESTAMP
            WHERE id = 1
        """, (
            data.get('iva', 22.00),
            data.get('moneda', 'UYU'),
            data.get('decimales', 2),
            data.get('nombre_fruteria', 'Frutería Nina'),
            data.get('direccion', ''),
            data.get('telefono', ''),
            data.get('email', ''),
            data.get('rut', ''),
            data.get('logo_url', '')
        ))
        
        connection.commit()
        
        response = jsonify({'message': 'Configuración actualizada exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error actualizando configuración: {e}")
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
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener notificaciones del usuario
        cursor.execute("""
            SELECT id, tipo, titulo, mensaje, leida, creada, referencia_id, referencia_tipo
            FROM notificaciones
            WHERE usuario_id = %s OR usuario_id IS NULL
            ORDER BY creada DESC
            LIMIT 50
        """, (current_user_id,))
        
        notificaciones = []
        for row in cursor.fetchall():
            notificacion = {
                'id': row[0],
                'tipo': row[1],
                'titulo': row[2],
                'mensaje': row[3],
                'leida': bool(row[4]),
                'fecha': row[5].isoformat() if row[5] else None,
                'referencia_id': row[6],
                'referencia_tipo': row[7]
            }
            notificaciones.append(notificacion)
        
        response = jsonify(notificaciones)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo notificaciones: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/notificaciones/<int:notificacion_id>/marcar-leida', methods=['PUT'])
@jwt_required
def marcar_notificacion_leida(current_user_id, notificacion_id):
    """Marcar notificación como leída"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            UPDATE notificaciones 
            SET leida = TRUE 
            WHERE id = %s AND (usuario_id = %s OR usuario_id IS NULL)
        """, (notificacion_id, current_user_id))
        
        connection.commit()
        
        response = jsonify({'message': 'Notificación marcada como leída'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error marcando notificación como leída: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE REPORTES ====================

@app.route('/api/reportes/ventas', methods=['GET'])
@jwt_required
def reporte_ventas(current_user_id):
    """Generar reporte de ventas"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        fecha_inicio = request.args.get('fecha_inicio', datetime.now().strftime('%Y-%m-01'))
        fecha_fin = request.args.get('fecha_fin', datetime.now().strftime('%Y-%m-%d'))
        
        # Ventas por día
        cursor.execute("""
            SELECT DATE(fecha) as fecha, COUNT(*) as cantidad, SUM(total) as total
            FROM ventas
            WHERE DATE(fecha) BETWEEN %s AND %s AND estado = 'completada'
            GROUP BY DATE(fecha)
            ORDER BY fecha
        """, (fecha_inicio, fecha_fin))
        
        ventas_por_dia = []
        for row in cursor.fetchall():
            ventas_por_dia.append({
                'fecha': row[0].isoformat() if row[0] else None,
                'cantidad': row[1],
                'total': float(row[2])
            })
        
        # Ventas por forma de pago
        cursor.execute("""
            SELECT forma_pago, COUNT(*) as cantidad, SUM(total) as total
            FROM ventas
            WHERE DATE(fecha) BETWEEN %s AND %s AND estado = 'completada'
            GROUP BY forma_pago
        """, (fecha_inicio, fecha_fin))
        
        ventas_por_forma_pago = []
        for row in cursor.fetchall():
            ventas_por_forma_pago.append({
                'forma_pago': row[0],
                'cantidad': row[1],
                'total': float(row[2])
            })
        
        # Productos más vendidos
        cursor.execute("""
            SELECT p.nombre, SUM(dv.cantidad) as cantidad_vendida, SUM(dv.subtotal) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE DATE(v.fecha) BETWEEN %s AND %s AND v.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 10
        """, (fecha_inicio, fecha_fin))
        
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'producto': row[0],
                'cantidad_vendida': float(row[1]),
                'total_vendido': float(row[2])
            })
        
        # Totales generales
        cursor.execute("""
            SELECT COUNT(*) as total_ventas, SUM(total) as total_ingresos,
                   AVG(total) as promedio_venta
            FROM ventas
            WHERE DATE(fecha) BETWEEN %s AND %s AND estado = 'completada'
        """, (fecha_inicio, fecha_fin))
        
        totales = cursor.fetchone()
        
        reporte = {
            'periodo': {
                'fecha_inicio': fecha_inicio,
                'fecha_fin': fecha_fin
            },
            'totales': {
                'total_ventas': totales[0] or 0,
                'total_ingresos': float(totales[1] or 0),
                'promedio_venta': float(totales[2] or 0)
            },
            'ventas_por_dia': ventas_por_dia,
            'ventas_por_forma_pago': ventas_por_forma_pago,
            'productos_mas_vendidos': productos_mas_vendidos,
            'fecha_generacion': datetime.now().isoformat()
        }
        
        response = jsonify(reporte)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error generando reporte de ventas: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/reportes/inventario', methods=['GET'])
@jwt_required
def reporte_inventario(current_user_id):
    """Generar reporte de inventario"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Resumen por categorías
        cursor.execute("""
            SELECT categoria, COUNT(*) as cantidad_productos,
                   SUM(stock_actual) as stock_total,
                   SUM(stock_actual * precio_unitario) as valor_total
            FROM productos
            WHERE activo = TRUE
            GROUP BY categoria
        """)
        
        resumen_categorias = []
        for row in cursor.fetchall():
            resumen_categorias.append({
                'categoria': row[0],
                'cantidad_productos': row[1],
                'stock_total': float(row[2]),
                'valor_total': float(row[3])
            })
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT nombre, categoria, stock_actual, stock_minimo, precio_unitario
            FROM productos
            WHERE stock_actual <= stock_minimo AND activo = TRUE
            ORDER BY stock_actual ASC
        """)
        
        productos_stock_bajo = []
        for row in cursor.fetchall():
            productos_stock_bajo.append({
                'nombre': row[0],
                'categoria': row[1],
                'stock_actual': float(row[2]),
                'stock_minimo': float(row[3]),
                'precio_unitario': float(row[4])
            })
        
        # Productos sin stock
        cursor.execute("""
            SELECT nombre, categoria, precio_unitario
            FROM productos
            WHERE stock_actual = 0 AND activo = TRUE
        """)
        
        productos_sin_stock = []
        for row in cursor.fetchall():
            productos_sin_stock.append({
                'nombre': row[0],
                'categoria': row[1],
                'precio_unitario': float(row[2])
            })
        
        # Totales generales
        cursor.execute("""
            SELECT COUNT(*) as total_productos,
                   SUM(stock_actual) as stock_total,
                   SUM(stock_actual * precio_unitario) as valor_total_inventario
            FROM productos
            WHERE activo = TRUE
        """)
        
        totales = cursor.fetchone()
        
        reporte = {
            'totales': {
                'total_productos': totales[0] or 0,
                'stock_total': float(totales[1] or 0),
                'valor_total_inventario': float(totales[2] or 0)
            },
            'resumen_categorias': resumen_categorias,
            'productos_stock_bajo': productos_stock_bajo,
            'productos_sin_stock': productos_sin_stock,
            'alertas': {
                'productos_stock_bajo': len(productos_stock_bajo),
                'productos_sin_stock': len(productos_sin_stock)
            },
            'fecha_generacion': datetime.now().isoformat()
        }
        
        response = jsonify(reporte)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error generando reporte de inventario: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE CIERRE DE CAJA ====================

@app.route('/api/cierre-caja', methods=['POST'])
@jwt_required
def crear_cierre_caja(current_user_id):
    """Crear cierre de caja"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or 'total_efectivo_contado' not in data:
            return jsonify({'message': 'Total efectivo contado es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        fecha_cierre = data.get('fecha_cierre', datetime.now().date())
        
        # Verificar si ya existe un cierre para esta fecha y usuario
        cursor.execute("""
            SELECT id FROM cierres_caja 
            WHERE usuario_id = %s AND fecha_cierre = %s
        """, (current_user_id, fecha_cierre))
        
        if cursor.fetchone():
            return jsonify({'message': 'Ya existe un cierre de caja para esta fecha'}), 409
        
        # Calcular total de ventas del día
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas
            WHERE usuario_id = %s AND DATE(fecha) = %s 
            AND estado = 'completada' AND forma_pago = 'efectivo'
        """, (current_user_id, fecha_cierre))
        
        ventas_data = cursor.fetchone()
        numero_ventas = ventas_data[0] or 0
        total_ventas_esperado = float(ventas_data[1] or 0)
        
        # Insertar cierre de caja
        cursor.execute("""
            INSERT INTO cierres_caja (
                usuario_id, fecha_cierre, total_ventas_esperado, 
                total_efectivo_contado, numero_ventas, observaciones
            ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            current_user_id,
            fecha_cierre,
            total_ventas_esperado,
            float(data['total_efectivo_contado']),
            numero_ventas,
            data.get('observaciones', '')
        ))
        
        cierre_id = cursor.lastrowid
        connection.commit()
        
        # Calcular diferencia
        diferencia = float(data['total_efectivo_contado']) - total_ventas_esperado
        
        response = jsonify({
            'message': 'Cierre de caja creado exitosamente',
            'id': cierre_id,
            'diferencia': diferencia,
            'total_ventas_esperado': total_ventas_esperado,
            'numero_ventas': numero_ventas
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando cierre de caja: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/cierre-caja/historial', methods=['GET'])
@jwt_required
def obtener_historial_cierres(current_user_id):
    """Obtener historial de cierres de caja"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        limite = int(request.args.get('limite', 30))
        
        query = """
            SELECT c.id, c.fecha_cierre, c.hora_cierre, c.total_ventas_esperado,
                   c.total_efectivo_contado, c.diferencia, c.numero_ventas,
                   c.observaciones, c.estado, u.nombre as usuario_nombre
            FROM cierres_caja c
            INNER JOIN usuarios u ON c.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        # Filtrar por usuario si no es admin
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (current_user_id,))
        user_role = cursor.fetchone()
        if user_role and user_role[0] != 'admin':
            query += " AND c.usuario_id = %s"
            params.append(current_user_id)
        
        if fecha_inicio:
            query += " AND c.fecha_cierre >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND c.fecha_cierre <= %s"
            params.append(fecha_fin)
        
        query += " ORDER BY c.fecha_cierre DESC, c.hora_cierre DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        cierres = []
        for row in cursor.fetchall():
            cierre = {
                'id': row[0],
                'fecha_cierre': row[1].isoformat() if row[1] else None,
                'hora_cierre': row[2].isoformat() if row[2] else None,
                'total_ventas_esperado': float(row[3]),
                'total_efectivo_contado': float(row[4]),
                'diferencia': float(row[5]),
                'numero_ventas': row[6],
                'observaciones': row[7] or '',
                'estado': row[8],
                'usuario_nombre': row[9]
            }
            cierres.append(cierre)
        
        response = jsonify(cierres)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo historial de cierres: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE MOVIMIENTOS DE STOCK ====================

@app.route('/api/movimientos-stock', methods=['GET'])
@jwt_required
def obtener_movimientos_stock(current_user_id):
    """Obtener movimientos de stock"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        producto_id = request.args.get('producto_id')
        tipo = request.args.get('tipo')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        limite = int(request.args.get('limite', 50))
        
        query = """
            SELECT ms.id, ms.fecha, ms.tipo, ms.cantidad, ms.motivo,
                   ms.observaciones, ms.referencia_tipo, ms.referencia_id,
                   p.nombre as producto_nombre, u.nombre as usuario_nombre
            FROM movimientos_stock ms
            INNER JOIN productos p ON ms.producto_id = p.id
            LEFT JOIN usuarios u ON ms.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        if producto_id:
            query += " AND ms.producto_id = %s"
            params.append(producto_id)
        
        if tipo:
            query += " AND ms.tipo = %s"
            params.append(tipo)
        
        if fecha_inicio:
            query += " AND DATE(ms.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(ms.fecha) <= %s"
            params.append(fecha_fin)
        
        query += " ORDER BY ms.fecha DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        movimientos = []
        for row in cursor.fetchall():
            movimiento = {
                'id': row[0],
                'fecha': row[1].isoformat() if row[1] else None,
                'tipo': row[2],
                'cantidad': float(row[3]),
                'motivo': row[4] or '',
                'observaciones': row[5] or '',
                'referencia_tipo': row[6],
                'referencia_id': row[7],
                'producto_nombre': row[8],
                'usuario_nombre': row[9] or 'Sistema'
            }
            movimientos.append(movimiento)
        
        response = jsonify(movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo movimientos de stock: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/movimientos-stock', methods=['POST'])
@jwt_required
def crear_movimiento_stock(current_user_id):
    """Crear movimiento de stock manual"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        required_fields = ['producto_id', 'tipo', 'cantidad', 'motivo']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        if data['tipo'] not in ['ingreso', 'egreso', 'ajuste']:
            return jsonify({'message': 'Tipo de movimiento inválido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        producto_id = data['producto_id']
        tipo = data['tipo']
        cantidad = float(data['cantidad'])
        motivo = data['motivo']
        
        # Obtener stock actual del producto
        cursor.execute("SELECT stock_actual FROM productos WHERE id = %s", (producto_id,))
        producto = cursor.fetchone()
        
        if not producto:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        stock_anterior = float(producto[0])
        
        # Calcular nuevo stock
        if tipo == 'ingreso':
            stock_nuevo = stock_anterior + cantidad
        elif tipo == 'egreso':
            stock_nuevo = stock_anterior - cantidad
            if stock_nuevo < 0:
                return jsonify({'message': 'Stock insuficiente'}), 400
        else:  # ajuste
            stock_nuevo = cantidad
        
        # Insertar movimiento
        cursor.execute("""
            INSERT INTO movimientos_stock (
                producto_id, tipo, cantidad, cantidad_anterior, cantidad_nueva,
                motivo, observaciones, usuario_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            producto_id, tipo, cantidad, stock_anterior, stock_nuevo,
            motivo, data.get('observaciones', ''), current_user_id
        ))
        
        # Actualizar stock del producto
        cursor.execute("""
            UPDATE productos SET stock_actual = %s WHERE id = %s
        """, (stock_nuevo, producto_id))
        
        connection.commit()
        
        response = jsonify({
            'message': 'Movimiento de stock creado exitosamente',
            'stock_anterior': stock_anterior,
            'stock_nuevo': stock_nuevo
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error creando movimiento de stock: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS ADICIONALES ====================

@app.route('/api/estadisticas/dashboard', methods=['GET'])
@jwt_required
def estadisticas_dashboard_completas(current_user_id):
    """Obtener estadísticas completas para el dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Ventas del día actual
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
        """)
        ventas_hoy = cursor.fetchone()
        
        # Ventas del mes actual
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE()) 
            AND estado = 'completada'
        """)
        ventas_mes = cursor.fetchone()
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0]
        
        # Total productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0]
        
        # Valor total del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0)
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = cursor.fetchone()[0]
        
        # Clientes activos
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo = TRUE")
        total_clientes = cursor.fetchone()[0]
        
        # Proveedores activos
        cursor.execute("SELECT COUNT(*) FROM proveedores WHERE activo = TRUE")
        total_proveedores = cursor.fetchone()[0]
        
        # Facturas del mes
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM facturas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'emitida'
        """)
        facturas_mes = cursor.fetchone()
        
        # Últimas 5 ventas
        cursor.execute("""
            SELECT v.id, v.numero_venta, v.total, v.fecha, 
                   COALESCE(c.nombre, 'Cliente General') as cliente_nombre,
                   v.forma_pago
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.estado = 'completada'
            ORDER BY v.fecha DESC
            LIMIT 5
        """)
        
        ultimas_ventas = []
        for row in cursor.fetchall():
            ultimas_ventas.append({
                'id': row[0],
                'numero_venta': row[1],
                'total': float(row[2]),
                'fecha': row[3].isoformat() if row[3] else None,
                'cliente_nombre': row[4],
                'forma_pago': row[5]
            })
        
        # Productos más vendidos (últimos 30 días)
        cursor.execute("""
            SELECT p.nombre, p.categoria, SUM(dv.cantidad) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre, p.categoria
            ORDER BY total_vendido DESC
            LIMIT 5
        """)
        
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'nombre': row[0],
                'categoria': row[1],
                'cantidad_vendida': float(row[2])
            })
        
        # Alertas importantes
        alertas = []
        
        if productos_stock_bajo > 0:
            alertas.append({
                'tipo': 'warning',
                'titulo': 'Stock Bajo',
                'mensaje': f'{productos_stock_bajo} productos requieren reposición',
                'icono': '⚠️'
            })
        
        # Verificar ventas sin facturar (últimos 7 días)
        cursor.execute("""
            SELECT COUNT(*) FROM ventas v
            LEFT JOIN facturas f ON v.id = f.id_venta
            WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND v.estado = 'completada'
            AND f.id IS NULL
        """)
        ventas_sin_facturar = cursor.fetchone()[0]
        
        if ventas_sin_facturar > 0:
            alertas.append({
                'tipo': 'info',
                'titulo': 'Ventas sin Facturar',
                'mensaje': f'{ventas_sin_facturar} ventas pendientes de facturación',
                'icono': '📄'
            })
        
        estadisticas = {
            'resumen': {
                'ventas_hoy': {
                    'cantidad': ventas_hoy[0] or 0,
                    'total': float(ventas_hoy[1] or 0)
                },
                'ventas_mes': {
                    'cantidad': ventas_mes[0] or 0,
                    'total': float(ventas_mes[1] or 0)
                },
                'facturas_mes': {
                    'cantidad': facturas_mes[0] or 0,
                    'total': float(facturas_mes[1] or 0)
                },
                'productos_stock_bajo': productos_stock_bajo,
                'total_productos': total_productos,
                'valor_inventario': float(valor_inventario),
                'total_clientes': total_clientes,
                'total_proveedores': total_proveedores
            },
            'ultimas_ventas': ultimas_ventas,
            'productos_mas_vendidos': productos_mas_vendidos,
            'alertas': alertas,
            'fecha_actualizacion': datetime.now().isoformat()
        }
        
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo estadísticas del dashboard: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def not_found(error):
    response = jsonify({'message': 'Endpoint no encontrado'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 404

@app.errorhandler(500)
def internal_error(error):
    response = jsonify({'message': 'Error interno del servidor'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 500

# ==================== OPCIONES CORS ====================

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response

# ==================== INICIALIZACIÓN ====================

def inicializar_datos_base():
    """Insertar datos básicos del sistema"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
        # Verificar si ya existen datos
        cursor.execute("SELECT COUNT(*) FROM usuarios")
        if cursor.fetchone()[0] > 0:
            logger.info("✅ Datos base ya existen")
            return True
        
        # Crear usuario administrador por defecto
        admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
        cursor.execute("""
            INSERT INTO usuarios (nombre, correo, password_hash, rol)
            VALUES (%s, %s, %s, %s)
        """, ('Administrador', 'admin@fruteria.com', admin_password.decode('utf-8'), 'admin'))
        
        # Crear usuario cajero por defecto
        cajero_password = bcrypt.hashpw('cajero123'.encode('utf-8'), bcrypt.gensalt())
        cursor.execute("""
            INSERT INTO usuarios (nombre, correo, password_hash, rol)
            VALUES (%s, %s, %s, %s)
        """, ('Cajero Principal', 'cajero@fruteria.com', cajero_password.decode('utf-8'), 'cajero'))
        
        # Insertar configuración por defecto
        cursor.execute("""
            INSERT INTO configuracion (id, iva, moneda, decimales, nombre_fruteria, direccion, telefono)
            VALUES (1, 22.00, 'UYU', 2, 'Frutería Nina', 'Montevideo, Uruguay', '+598 99 123 456')
        """)
        
        # Insertar categorías por defecto
        categorias_default = [
            ('producto', 'Frutas Frescas', 'Frutas de temporada y tropicales'),
            ('producto', 'Verduras', 'Verduras frescas y orgánicas'),
            ('producto', 'Otros', 'Productos varios y complementarios'),
            ('gasto', 'Servicios', 'Gastos en servicios básicos'),
            ('gasto', 'Mantenimiento', 'Gastos de mantenimiento y reparaciones')
        ]
        
        for categoria in categorias_default:
            cursor.execute("""
                INSERT INTO categorias (tipo, nombre, descripcion)
                VALUES (%s, %s, %s)
            """, categoria)
        
        # Insertar proveedores de ejemplo
        proveedores_ejemplo = [
            ('Distribuidora Central', 'Juan Pérez', '099123456', 'juan@distribuidora.com', 'Av. Central 123'),
            ('Frutas del Norte', 'María González', '098765432', 'maria@frutasnorte.com', 'Ruta 5 Km 45'),
            ('Verduras Orgánicas', 'Carlos López', '097654321', 'carlos@organicas.com', 'Zona Rural 456')
        ]
        
        for proveedor in proveedores_ejemplo:
            cursor.execute("""
                INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion)
                VALUES (%s, %s, %s, %s, %s)
            """, proveedor)
        
        # Insertar algunos productos de ejemplo
        productos_ejemplo = [
            ('Manzana Roja', 'frutas', 'kg', 50.0, 10.0, 3.50, 2.80, '7891234567890', 'Manzanas rojas frescas', 1),
            ('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, 2.20, '7891234567891', 'Bananas maduras', 1),
            ('Tomate', 'verduras', 'kg', 35.0, 8.0, 5.20, 4.10, '7891234567892', 'Tomates frescos', 2),
            ('Lechuga', 'verduras', 'unidad', 20.0, 5.0, 2.50, 1.80, '7891234567893', 'Lechuga crespa', 2),
            ('Naranja', 'frutas', 'kg', 40.0, 8.0, 4.20, 3.50, '7891234567894', 'Naranjas jugosas', 1),
            ('Papa', 'verduras', 'kg', 80.0, 15.0, 1.80, 1.20, '7891234567895', 'Papas lavadas', 3),
            ('Zanahoria', 'verduras', 'kg', 30.0, 7.0, 3.20, 2.50, '7891234567896', 'Zanahorias frescas', 3),
            ('Cebolla', 'verduras', 'kg', 45.0, 10.0, 2.90, 2.10, '7891234567897', 'Cebollas blancas', 3)
        ]
        
        for producto in productos_ejemplo:
            cursor.execute("""
                INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, 
                                     precio_unitario, precio_compra, codigo_barras, descripcion, proveedor_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, producto)
        
        # Insertar clientes de ejemplo
        clientes_ejemplo = [
            ('Cliente General', '', '', '', '', 'Cliente por defecto'),
            ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '099887766', 'Av. Principal 456', '12345678', 'Cliente mayorista'),
            ('Supermercado Villa', 'compras@villa.com', '098776655', 'Calle Comercial 789', '87654321', 'Cliente corporativo')
        ]
        
        for cliente in clientes_ejemplo:
            cursor.execute("""
                INSERT INTO clientes (nombre, correo, telefono, direccion, documento, notas)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, cliente)
        
        connection.commit()
        logger.info("✅ Datos base inicializados correctamente")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error inicializando datos base: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

if __name__ == '__main__':
    logger.info("🚀 Iniciando Frutería Nina Backend - Sistema Completo v7.0...")
    logger.info("=" * 100)
    
    # Crear tablas
    if create_tables():
        logger.info("✅ Base de datos inicializada correctamente")
        
        # Inicializar datos base
        if inicializar_datos_base():
            logger.info("✅ Sistema listo para usar")
            logger.info("📧 Usuario admin: admin@fruteria.com")
            logger.info("🔑 Contraseña admin: admin123")
            logger.info("📧 Usuario cajero: cajero@fruteria.com")
            logger.info("🔑 Contraseña cajero: cajero123")
            logger.info("🌐 Servidor iniciando en http://localhost:5000")
            logger.info("=" * 100)
            logger.info("📋 Endpoints disponibles:")
            logger.info("   🔐 Autenticación:")
            logger.info("     - POST /api/register")
            logger.info("     - POST /api/login")
            logger.info("     - POST /api/verify-token")
            logger.info("   📊 Dashboard:")
            logger.info("     - GET /api/dashboard")
            logger.info("     - GET /api/estadisticas/dashboard")
            logger.info("   📦 Productos:")
            logger.info("     - GET /api/productos")
            logger.info("     - POST /api/productos")
            logger.info("     - PUT /api/productos/<id>")
            logger.info("     - DELETE /api/productos/<id>")
            logger.info("   🏪 Proveedores:")
            logger.info("     - GET /api/proveedores")
            logger.info("     - POST /api/proveedores")
            logger.info("   👥 Clientes:")
            logger.info("     - GET /api/clientes")
            logger.info("     - POST /api/clientes")
            logger.info("   💰 Ventas:")
            logger.info("     - GET /api/ventas")
            logger.info("     - POST /api/ventas")
            logger.info("   🛒 Compras:")
            logger.info("     - GET /api/compras")
            logger.info("     - POST /api/compras")
            logger.info("   📄 Facturación:")
            logger.info("     - GET /api/facturas/ultimo-numero")
            logger.info("     - POST /api/facturas/crear")
            logger.info("     - GET /api/facturas/historial")
            logger.info("     - GET /api/facturas/<id>")
            logger.info("   ⚙️ Configuración:")
            logger.info("     - GET /api/configuracion")
            logger.info("     - PUT /api/configuracion")
            logger.info("   🔔 Notificaciones:")
            logger.info("     - GET /api/notificaciones")
            logger.info("     - PUT /api/notificaciones/<id>/marcar-leida")
            logger.info("   📈 Reportes:")
            logger.info("     - GET /api/reportes/ventas")
            logger.info("     - GET /api/reportes/inventario")
            logger.info("   💵 Cierre de Caja:")
            logger.info("     - POST /api/cierre-caja")
            logger.info("     - GET /api/cierre-caja/historial")
            logger.info("   📋 Movimientos de Stock:")
            logger.info("     - GET /api/movimientos-stock")
            logger.info("     - POST /api/movimientos-stock")
            logger.info("=" * 100)
            
            app.run(debug=True, host='0.0.0.0', port=5000)
        else:
            logger.error("❌ Error inicializando datos base")
    else:
        logger.error("❌ Error creando tablas de la base de datos. Revisa la configuración.")
        logger.info("💡 Asegúrate de que:")
        logger.info("   - La base de datos 'fruteria_nina' existe")
        logger.info("   - El usuario tiene permisos suficientes")
        logger.info("   - MySQL está ejecutándose")