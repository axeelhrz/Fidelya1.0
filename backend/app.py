import os
import logging
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps

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
    logger.info("🚀 Iniciando Frutería Nina Backend - Sistema Simplificado v8.0...")
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
            logger.info("📋 Endpoints principales disponibles:")
            logger.info("   🔐 Autenticación: /api/register, /api/login, /api/verify-token")
            logger.info("   📊 Dashboard: /api/dashboard")
            logger.info("   📦 Productos: /api/productos")
            logger.info("   🏪 Proveedores: /api/proveedores")
            logger.info("   👥 Clientes: /api/clientes")
            logger.info("=" * 100)
            
            app.run(debug=True, host='0.0.0.0', port=5001)
        else:
            logger.error("❌ Error inicializando datos base")
    else:
        logger.error("❌ Error creando tablas de la base de datos. Revisa la configuración.")
        logger.info("💡 Asegúrate de que:")
        logger.info("   - La base de datos 'fruteria_nina' existe")
        logger.info("   - El usuario tiene permisos suficientes")
        logger.info("   - MySQL está ejecutándose")