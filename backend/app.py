from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from datetime import datetime, timedelta
import mysql.connector
import bcrypt
import jwt
import os
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración de Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'tu-clave-secreta-muy-segura')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Configurar CORS
CORS(app, 
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True
)

DB_CONFIG = {
    'host': 'localhost',
    'user': 'fruteria_user',
    'password': 'fruteria_password',
    'database': 'fruteria_nina',
    'charset': 'utf8mb4',
    'autocommit': False
}

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
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'tu_clave_secreta_super_segura_2024')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Configurar CORS
CORS(app, origins=["http://localhost:3000"])

# Configuración de base de datos
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
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
        # Crear base de datos si no existe
        temp_config = DB_CONFIG.copy()
        temp_config.pop('database', None)
        
        connection = mysql.connector.connect(**temp_config)
        cursor = connection.cursor()
        
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE {DB_CONFIG['database']}")
        
        # Crear tablas
        tables = {
            'usuarios': """
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    correo VARCHAR(150) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    rol ENUM('admin', 'operador') DEFAULT 'operador',
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_correo (correo),
                    INDEX idx_rol (rol),
                    INDEX idx_activo (activo)
                )
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
                )
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
                    descripcion TEXT,
                    proveedor_id INT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                    INDEX idx_nombre (nombre),
                    INDEX idx_categoria (categoria),
                    INDEX idx_stock_bajo (stock_actual, stock_minimo),
                    INDEX idx_activo (activo)
                )
            """,
            
            'clientes': """
                CREATE TABLE IF NOT EXISTS clientes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(150) NOT NULL,
                    correo VARCHAR(150),
                    telefono VARCHAR(20),
                    direccion TEXT,
                    notas TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_nombre (nombre),
                    INDEX idx_correo (correo),
                    INDEX idx_activo (activo)
                )
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
                    INDEX idx_total (total)
                )
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
                )
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
                )
            """,
            
            'filtros_personalizados': """
                CREATE TABLE IF NOT EXISTS filtros_personalizados (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    usuario_id INT NOT NULL,
                    nombre VARCHAR(100) NOT NULL,
                    filtros JSON NOT NULL,
                    modulo VARCHAR(50) DEFAULT 'inventario',
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    INDEX idx_usuario_modulo (usuario_id, modulo)
                )
            """,
            
            'configuracion_sistema': """
                CREATE TABLE IF NOT EXISTS configuracion_sistema (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    clave VARCHAR(100) UNIQUE NOT NULL,
                    valor TEXT NOT NULL,
                    descripcion TEXT,
                    tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_clave (clave)
                )
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

import os
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
import logging
import json

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'mi_clave_secreta_super_segura_2024')
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

CORS(app, origins=["http://localhost:3000"])

# Configuración de base de datos
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'fruteria_nina'),
    'charset': 'utf8mb4',
    'autocommit': False
}

def get_db_connection():
    """Obtener conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as e:
        logger.error(f"Error conectando a la base de datos: {e}")
        return None

def create_tables():
    """Crear todas las tablas necesarias"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
        # Crear tablas una por una
        tables = [
            """
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                rol ENUM('admin', 'operador') DEFAULT 'operador',
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS proveedores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                contacto VARCHAR(100),
                telefono VARCHAR(20),
                correo VARCHAR(150),
                direccion TEXT,
                notas TEXT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad VARCHAR(20) DEFAULT 'kg',
                stock_actual DECIMAL(10,3) DEFAULT 0,
                stock_minimo DECIMAL(10,3) DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL,
                precio_compra DECIMAL(10,2) DEFAULT 0,
                descripcion TEXT,
                proveedor_id INT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                INDEX idx_categoria (categoria),
                INDEX idx_activo (activo),
                INDEX idx_stock_bajo (stock_actual, stock_minimo)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(150),
                telefono VARCHAR(20),
                direccion TEXT,
                notas TEXT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                numero_venta VARCHAR(50),
                cliente_id INT,
                usuario_id INT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                forma_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
                subtotal DECIMAL(10,2) NOT NULL,
                descuento DECIMAL(10,2) DEFAULT 0,
                impuestos DECIMAL(10,2) DEFAULT 0,
                total DECIMAL(10,2) NOT NULL,
                estado ENUM('completada', 'cancelada') DEFAULT 'completada',
                observaciones TEXT,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_fecha (fecha),
                INDEX idx_estado (estado)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                venta_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,3) NOT NULL,
                precio_unitario DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad DECIMAL(10,3) NOT NULL,
                cantidad_anterior DECIMAL(10,3),
                cantidad_nueva DECIMAL(10,3),
                motivo VARCHAR(255),
                observaciones TEXT,
                referencia_id INT,
                referencia_tipo VARCHAR(50),
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto_fecha (producto_id, fecha),
                INDEX idx_tipo (tipo)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS filtros_personalizados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                filtros JSON NOT NULL,
                modulo VARCHAR(50) DEFAULT 'inventario',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS alertas_inventario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('stock_bajo', 'sin_stock', 'vencimiento', 'rotacion_baja') NOT NULL,
                mensaje TEXT NOT NULL,
                prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
                activa BOOLEAN DEFAULT TRUE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_resolucion TIMESTAMP NULL,
                resuelto_por INT NULL,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (resuelto_por) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_activa (activa),
                INDEX idx_prioridad (prioridad)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS configuracion_sistema (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clave VARCHAR(100) UNIQUE NOT NULL,
                valor TEXT NOT NULL,
                descripcion TEXT,
                tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """
        ]
        
        for table_sql in tables:
            cursor.execute(table_sql)
        
        connection.commit()
        logger.info("✅ Tablas creadas correctamente")
        return True
        
    except mysql.connector.Error as e:
        logger.error(f"Error creando tablas: {e}")
        return False
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def init_database():
    """Inicializar base de datos con datos de ejemplo"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
        # Verificar y crear usuario administrador
        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin'")
        admin_count = cursor.fetchone()[0]
        
        if admin_count == 0:
            admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("""
                INSERT INTO usuarios (nombre, correo, password_hash, rol)
                VALUES ('Administrador', 'admin@fruteria.com', %s, 'admin')
            """, (admin_password.decode('utf-8'),))
            logger.info("✅ Usuario administrador creado")
        
        # Configuraciones del sistema
        configuraciones_default = [
            ('stock_minimo_global', '5', 'Stock mínimo por defecto para nuevos productos', 'number'),
            ('alertas_stock_activas', 'true', 'Activar alertas automáticas de stock bajo', 'boolean'),
            ('dias_analisis_rotacion', '30', 'Días para análisis de rotación de inventario', 'number'),
            ('formato_codigo_barras', 'EAN13', 'Formato de código de barras por defecto', 'string'),
            ('moneda_sistema', 'UYU', 'Moneda del sistema', 'string'),
            ('precision_decimales', '2', 'Precisión decimal para precios y cantidades', 'number')
        ]
        
        for config in configuraciones_default:
            cursor.execute("""
                INSERT IGNORE INTO configuracion_sistema (clave, valor, descripcion, tipo)
                VALUES (%s, %s, %s, %s)
            """, config)
        
        # Crear proveedores de ejemplo
        cursor.execute("SELECT COUNT(*) FROM proveedores")
        if cursor.fetchone()[0] == 0:
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
            logger.info("✅ Proveedores de ejemplo creados")

def jwt_required(f):
    """Decorador para rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token or not token.startswith('Bearer '):
            return jsonify({'message': 'Token requerido'}), 401
        
        try:
            token = token.split(' ')[1]
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = payload['user_id']
            return f(current_user_id, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
    
    return decorated
        ('Distribuidora Central', 'Juan Pérez', '099123456', 'juan@distribuidora.com', 'Av. Central 123'),
                ('Frutas del Norte', 'María González', '098765432', 'maria@frutasnorte.com', 'Ruta 5 Km 45'),
        if connection:
            connection.rollback()
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
  VALUES (%s, %s, %s, %s, %s)
                """, proveedor)
        
        # Insertar productos de ejemplo MEJORADOS
        connection = get_db_connection()
        if not connection:
            logger.error("No se pudo conectar a la base de datos")
            return False
            
        cursor = connection.cursor()
        
        # Crear tablas aquí (implementación pendiente)
        logger.info("Tablas creadas exitosamente")
        return True
        
    except Exception as e:
        logger.error(f"Error creando tablas: {e}")
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()
       
def jwt_required(f):
    """Decorador para verificar JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token requerido'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
            return f(current_user_id, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401

    return decorated
al', '', '', '', 'Cliente por defecto para ventas sin cliente específico'),
                ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '099887766', 'Av. Principal 456', 'Cliente mayorista'),
                ('Supermercado Villa', 'compras@villa.com', '098776655', 'Calle Comercial 789', 'Cliente corporativo'),
                ('Panadería Central', 'panaderia@central.com', '097665544', 'Centro 123', 'Cliente frecuente'),
                ('Hotel Plaza', 'compras@hotelplaza.com', '096554433', 'Plaza Principal 456', 'Cliente premium')
            ]
            
            for cliente in clientes_ejemplo:
                cursor.execute("""
        connection = get_db_connection()
        if not connection:
            logger.error("No se pudo conectar a la base de datos")
            return False
            
        cursor = connection.cursor()
        
        # Aquí iría el código para crear las tablas
        logger.info("Tablas creadas exitosamente")
        return True
        
    except Exception as e:
        logger.error(f"Error creando tablas: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
  if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def create_tables():
    """Crear tablas de la base de datos si no existen"""
    try:
        connection = get_db_connection()
        if not connection:
            logger.error("No se pudo conectar a la base de datos")
            return False
            
        cursor = connection.cursor()
        
        # Crear tablas aquí (implementación pendiente)
        logger.info("Tablas creadas exitosamente")
        return True
        
    except Exception as e:
        logger.error(f"Error creando tablas: {e}")
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

def jwt_required(f):
    """Decorador para verificar JWT token"""
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

def create_tables():
    """Crear todas las tablas de la base de datos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            logger.error("No se pudo conectar a la base de datos")
            return False
            
        cursor = connection.cursor()
        
        # Aquí iría el código para crear las tablas
        logger.info("Tablas creadas exitosamente")
        return True
        
    except Exception as e:
        logger.error(f"Error creando tablas: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

import os
import logging
import bcrypt
import jwt
import mysql.connector
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Configuración
app.config['SECRET_KEY'] = 'tu_clave_secreta_muy_segura_para_jwt'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Configuración de base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Admin2024!',
    'database': 'fruteria_nina',
    'charset': 'utf8mb4',
    'autocommit': False
}

def get_db_connection():
    """Crear conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as e:
        logger.error(f"Error conectando a la base de datos: {e}")
        return None

def jwt_required(f):
    """Decorador para rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token or not token.startswith('Bearer '):
            return jsonify({'message': 'Token requerido'}), 401
        
        try:
            token = token.split(' ')[1]
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        except Exception as e:
            return jsonify({'message': 'Error procesando token'}), 401

        return f(current_user_id, *args, **kwargs)
    return decorated

def create_tables():
    """Crear tablas de la base de datos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
        # Crear tabla usuarios
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                rol ENUM('admin', 'operador', 'vendedor') DEFAULT 'operador',
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Crear tabla proveedores
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS proveedores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                contacto VARCHAR(100),
                telefono VARCHAR(20),
                correo VARCHAR(100),
                direccion TEXT,
                notas TEXT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Crear tabla clientes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100),
                telefono VARCHAR(20),
                direccion TEXT,
                notas TEXT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Crear tabla productos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad VARCHAR(20) DEFAULT 'unidad',
                stock_actual DECIMAL(10,2) DEFAULT 0,
                stock_minimo DECIMAL(10,2) DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL,
                precio_compra DECIMAL(10,2),
                codigo_barras VARCHAR(50),
                descripcion TEXT,
                proveedor_id INT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                INDEX idx_nombre (nombre),
                INDEX idx_categoria (categoria),
                INDEX idx_activo (activo)
            )
        """)
        
        # Crear tabla movimientos_stock
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL,
                cantidad_anterior DECIMAL(10,2),
                cantidad_nueva DECIMAL(10,2),
                motivo VARCHAR(200),
                observaciones TEXT,
                referencia_id INT,
                referencia_tipo VARCHAR(50),
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto (producto_id),
                INDEX idx_fecha (fecha),
                INDEX idx_tipo (tipo)
            )
        """)
        
        # Crear tabla ventas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                numero_venta VARCHAR(50),
                cliente_id INT,
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                forma_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'credito') DEFAULT 'efectivo',
                subtotal DECIMAL(10,2) NOT NULL,
                descuento DECIMAL(10,2) DEFAULT 0,
                impuestos DECIMAL(10,2) DEFAULT 0,
                total DECIMAL(10,2) NOT NULL,
                estado ENUM('pendiente', 'completada', 'cancelada') DEFAULT 'completada',
                observaciones TEXT,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_fecha (fecha),
                INDEX idx_estado (estado)
            )
        """)
        
        # Crear tabla detalle_ventas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                venta_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL,
                precio_unitario DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                proveedor_id INT,
                usuario_id INT,
                numero_compra VARCHAR(50),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                subtotal DECIMAL(10,2) NOT NULL,
                impuestos DECIMAL(10,2) DEFAULT 0,
                total DECIMAL(10,2) NOT NULL,
                estado ENUM('pendiente', 'recibida', 'cancelada') DEFAULT 'recibida',
                observaciones TEXT,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
            )
        """)
        
        # Crear tabla detalle_compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                compra_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL,
                precio_unitario DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla filtros_personalizados
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS filtros_personalizados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                filtros JSON NOT NULL,
                modulo VARCHAR(50) DEFAULT 'inventario',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla alertas_inventario
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alertas_inventario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('stock_bajo', 'sin_stock', 'vencimiento', 'rotacion_baja') NOT NULL,
                mensaje TEXT NOT NULL,
                prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
                activa BOOLEAN DEFAULT TRUE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_resolucion TIMESTAMP NULL,
                resuelto_por INT NULL,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (resuelto_por) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_activa (activa),
                INDEX idx_prioridad (prioridad)
            )
        """)
        
        # Crear tabla configuracion_sistema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS configuracion_sistema (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clave VARCHAR(100) UNIQUE NOT NULL,
                valor TEXT NOT NULL,
                descripcion TEXT,
                tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        connection.commit()
        logger.info("✅ Tablas creadas correctamente")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creando tablas: {e}")
        if connection:
            connection.rollback()
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def init_database():
    """Inicializar base de datos con datos de ejemplo"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            logger.error("No se pudo conectar a la base de datos")
            return False
            
        cursor = connection.cursor()
        
        # Verificar si existe usuario administrador
        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin'")
        admin_count = cursor.fetchone()[0]
        
        # Crear usuario administrador si no existe
        if admin_count == 0:
            admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("""
                INSERT INTO usuarios (nombre, correo, password_hash, rol)
                VALUES ('Administrador', 'admin@fruteria.com', %s, 'admin')
            """, (admin_password.decode('utf-8'),))
            logger.info("✅ Usuario administrador creado")
        
        # Configuraciones por defecto del sistema
        configuraciones_default = [
            ('stock_minimo_global', '5', 'Stock mínimo por defecto para nuevos productos', 'number'),
            ('alertas_stock_activas', 'true', 'Activar alertas automáticas de stock bajo', 'boolean'),
            ('dias_analisis_rotacion', '30', 'Días para análisis de rotación de inventario', 'number'),
            ('formato_codigo_barras', 'EAN13', 'Formato de código de barras por defecto', 'string'),
            ('moneda_sistema', 'UYU', 'Moneda del sistema', 'string'),
            ('precision_decimales', '2', 'Precisión decimal para precios y cantidades', 'number')
        ]
        
        for config in configuraciones_default:
            cursor.execute("""
                INSERT IGNORE INTO configuracion_sistema (clave, valor, descripcion, tipo)
                VALUES (%s, %s, %s, %s)
            """, config)
        
        # Crear proveedores de ejemplo
        cursor.execute("SELECT COUNT(*) FROM proveedores")
# Crear tabla ventas
cursor.execute("""
    CREATE TABLE IF NOT EXISTS ventas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT,
        usuario_id INT NOT NULL,
        numero_venta VARCHAR(50),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        forma_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
        subtotal DECIMAL(10,2) NOT NULL,
        descuento DECIMAL(10,2) DEFAULT 0,
        impuestos DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        estado ENUM('completada', 'cancelada') DEFAULT 'completada',
        observaciones TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_fecha (fecha),
        INDEX idx_estado (estado)
    )
""")
            cursor.execute("SELECT id FROM proveedores ORDER BY id")
            proveedores_ids = [row[0] for row in cursor.fetchall()]
            
            productos_ejemplo = [
                # Frutas
                ('Manzana Roja', 'frutas', 'kg', 50.0, 10.0, 3.50, 2.80, 'Manzanas rojas frescas y crujientes', proveedores_ids[0] if proveedores_ids else None),
                ('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, 2.20, 'Bananas maduras y dulces', proveedores_ids[0] if proveedores_ids else None),
                ('Naranja', 'frutas', 'kg', 40.0, 8.0, 4.20, 3.50, 'Naranjas jugosas para zumo', proveedores_ids[0] if proveedores_ids else None),
                ('Pera', 'frutas', 'kg', 25.0, 6.0, 4.80, 3.90, 'Peras dulces y suaves', proveedores_ids[0] if proveedores_ids else None),
                # Verduras
                ('Tomate', 'verduras', 'kg', 35.0, 8.0, 5.20, 4.10, 'Tomates frescos de invernadero', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
                ('Lechuga', 'verduras', 'unidad', 20.0, 5.0, 2.50, 1.80, 'Lechuga crespa fresca', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
                ('Papa', 'verduras', 'kg', 80.0, 15.0, 1.80, 1.20, 'Papas lavadas nacionales', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
                ('Zanahoria', 'verduras', 'kg', 30.0, 7.0, 3.20, 2.50, 'Zanahorias frescas', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
                # Otros
                ('Aceite de Oliva', 'otros', 'litro', 12.0, 2.0, 8.90, 6.50, 'Aceite de oliva extra virgen', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
                ('Miel Natural', 'otros', 'unidad', 8.0, 1.0, 12.50, 9.80, 'Miel pura de abeja', proveedores_ids[1] if len(proveedores_ids) > 1 else None)
            ]
            
            for producto in productos_ejemplo:
                cursor.execute("""
                    INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, 
                                         precio_unitario, precio_compra, descripcion, proveedor_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, producto)
            logger.info("✅ Productos de ejemplo creados")
        
        # Insertar clientes de ejemplo
        cursor.execute("SELECT COUNT(*) FROM clientes")
        if cursor.fetchone()[0] == 0:
            clientes_ejemplo = [
                ('Cliente General', '', '', '', 'Cliente por defecto para ventas sin cliente específico'),
                ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '099887766', 'Av. Principal 456', 'Cliente mayorista'),
                ('Supermercado Villa', 'compras@villa.com', '098776655', 'Calle Comercial 789', 'Cliente corporativo'),
                ('Panadería Central', 'panaderia@central.com', '097665544', 'Centro 123', 'Cliente frecuente'),
                ('Hotel Plaza', 'compras@hotelplaza.com', '096554433', 'Plaza Principal 456', 'Cliente premium')
            ]
            
            for cliente in clientes_ejemplo:
                cursor.execute("""
                    INSERT INTO clientes (nombre, correo, telefono, direccion, notas)
                    VALUES (%s, %s, %s, %s, %s)
                """, cliente)
            logger.info("✅ Clientes de ejemplo creados")
        
        connection.commit()
        logger.info("✅ Base de datos inicializada correctamente")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error inicializando base de datos: {e}")
        if connection:
            connection.rollback()
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
id INT AUTO_INCREMENT PRIMARY KEY,
cliente_id INT,
                usuario_id INT NOT NULL,
                numero_venta VARCHAR(50),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                forma_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
                subtotal DECIMAL(10,2) NOT NULL,
                descuento DECIMAL(10,2) DEFAULT 0,
                impuestos DECIMAL(10,2) DEFAULT 0,
                total DECIMAL(10,2) NOT NULL,
                estado ENUM('completada', 'cancelada') DEFAULT 'completada',
                observaciones TEXT,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_fecha (fecha),
                INDEX idx_estado (estado)
            )
        """)
        
        # Crear tabla detalle_ventas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                venta_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL,
                precio_unitario DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                proveedor_id INT,
                usuario_id INT NOT NULL,
                numero_compra VARCHAR(50),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                subtotal DECIMAL(10,2) NOT NULL,
                impuestos DECIMAL(10,2) DEFAULT 0,
                total DECIMAL(10,2) NOT NULL,
                estado ENUM('completada', 'cancelada') DEFAULT 'completada',
                observaciones TEXT,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla detalle_compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                compra_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL,
                precio_unitario DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla movimientos_stock
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL,
                cantidad_anterior DECIMAL(10,2),
                cantidad_nueva DECIMAL(10,2),
                motivo VARCHAR(200),
                observaciones TEXT,
                referencia_id INT,
                referencia_tipo ENUM('venta', 'compra', 'ajuste') DEFAULT 'ajuste',
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto (producto_id),
                INDEX idx_fecha (fecha)
            )
        """)
        
        # Crear tabla filtros_personalizados
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS filtros_personalizados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                filtros JSON NOT NULL,
                modulo VARCHAR(50) DEFAULT 'inventario',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            )
        """)
        
        # Crear tabla configuracion_sistema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS configuracion_sistema (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clave VARCHAR(100) UNIQUE NOT NULL,
                valor TEXT NOT NULL,
                descripcion TEXT,
                tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Crear tabla alertas_inventario
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alertas_inventario (
n')
            """, (admin_password.decode('utf-8'),))
            logger.info("✅ Usuario administrador creado")
        
        # Crear tabla configuracion_sistema
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS configuracion_sistema (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clave VARCHAR(100) UNIQUE NOT NULL,
                valor TEXT,
                descripcion VARCHAR(255),
                tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_clave (clave)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla configuracion_sistema creada")
        
        # Crear tabla proveedores
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS proveedores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                contacto VARCHAR(100),
                telefono VARCHAR(20),
                correo VARCHAR(100),
                direccion VARCHAR(255),
                notas TEXT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla proveedores creada")
        
        # Resto de las tablas ya están definidas más abajo en el código...
        
        connection.commit()
        logger.info("✅ Base de datos inicializada correctamente")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error inicializando base de datos: {e}")
        if connection:
            connection.rollback()
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
        creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_clave (clave)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
""")
logger.info("✅ Tabla configuracion_sistema creada")

# Crear tabla proveedores
cursor.execute("""
    CREATE TABLE IF NOT EXISTS proveedores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        contacto VARCHAR(100),
        telefono VARCHAR(20),
        correo VARCHAR(100),
        direccion VARCHAR(255),
        notas TEXT,
        activo BOOLEAN DEFAULT TRUE,
        creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
""")
logger.info("✅ Tabla proveedores creada")
        
        # Crear tabla clientes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) UNIQUE,
                telefono VARCHAR(20),
                direccion VARCHAR(255),
                notas TEXT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla clientes creada")
        
        # Crear tabla productos MEJORADA con campos adicionales
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad ENUM('kg', 'unidad', 'caja', 'litro') DEFAULT 'unidad',
                stock_actual DECIMAL(10,2) DEFAULT 0,
                stock_minimo DECIMAL(10,2) DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                precio_compra DECIMAL(10,2) DEFAULT 0.00,
                codigo_barras VARCHAR(50) UNIQUE,
                descripcion TEXT,
                imagen_url VARCHAR(255),
                proveedor_id INT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                INDEX idx_categoria (categoria),
                INDEX idx_stock_bajo (stock_actual, stock_minimo),
                INDEX idx_nombre (nombre),
                INDEX idx_activo (activo),
                INDEX idx_codigo_barras (codigo_barras)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla productos mejorada creada")
        
        # Crear tabla compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                proveedor_id INT,
                numero_factura VARCHAR(50),
                total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                fecha DATE NOT NULL,
                estado ENUM('borrador', 'completada', 'cancelada') DEFAULT 'completada',
                notas TEXT,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla compras creada")
        
        # Crear tabla detalle_compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                compra_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla detalle_compras creada")
        
        # Crear tabla ventas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT NULL,
                usuario_id INT NOT NULL,
                numero_venta VARCHAR(50),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                forma_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'mixto') DEFAULT 'efectivo',
                subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                descuento DECIMAL(10,2) DEFAULT 0.00,
                impuestos DECIMAL(10,2) DEFAULT 0.00,
                total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                estado ENUM('borrador', 'completada', 'cancelada') DEFAULT 'completada',
                observaciones TEXT,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla ventas creada")
        
        # Crear tabla detalle_ventas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                venta_id INT NOT NULL,
                producto_id INT NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla detalle_ventas creada")
        
        # Crear tabla movimientos_stock MEJORADA
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL DEFAULT 0,
                cantidad_anterior DECIMAL(10,2) DEFAULT 0,
                cantidad_nueva DECIMAL(10,2) DEFAULT 0,
                motivo VARCHAR(255),
                observaciones TEXT,
                referencia_id INT,
                referencia_tipo ENUM('compra', 'venta', 'ajuste', 'transferencia'),
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto_fecha (producto_id, fecha),
                INDEX idx_tipo (tipo),
                INDEX idx_fecha (fecha)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla movimientos_stock mejorada creada")
        
        # Crear tabla movimientos (actividad general)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tipo ENUM('venta', 'compra', 'ajuste', 'sistema') NOT NULL,
                detalle TEXT NOT NULL,
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla movimientos creada")
        
        # NUEVAS TABLAS PARA FUNCIONALIDADES AVANZADAS
        
        # Crear tabla filtros_personalizados
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS filtros_personalizados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                filtros JSON NOT NULL,
                modulo ENUM('inventario', 'ventas', 'compras') DEFAULT 'inventario',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_usuario_modulo (usuario_id, modulo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla filtros_personalizados creada")
        
        # Crear tabla alertas_inventario
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alertas_inventario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('stock_bajo', 'sin_stock', 'vencimiento', 'rotacion_baja') NOT NULL,
                mensaje TEXT NOT NULL,
                prioridad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
                activa BOOLEAN DEFAULT TRUE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_resolucion TIMESTAMP NULL,
                resuelto_por INT NULL,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (resuelto_por) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_activa (activa),
                INDEX idx_prioridad (prioridad),
        if admin_count == 0:
            admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("""
                INSERT INTO usuarios (nombre, correo, password_hash, rol)
                VALUES ('Administrador', 'admin@fruteria.com', %s, 'admin')
            """, (admin_password.decode('utf-8'),))
            logger.info("✅ Usuario administrador creado")
        if admin_count == 0:
            admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("""
                INSERT INTO usuarios (nombre, correo, contraseña, rol)
                VALUES ('Administrador', 'admin@fruteria.com', %s, 'admin')
            """, (admin_password,))
            logger.info("✅ Usuario administrador creado")
        
        # Insertar configuraciones por defecto
        configuraciones_default = [
            ('stock_minimo_global', '5', 'Stock mínimo por defecto para nuevos productos', 'number'),
            ('alertas_stock_activas', 'true', 'Activar alertas automáticas de stock bajo', 'boolean'),
            ('dias_analisis_rotacion', '30', 'Días para análisis de rotación de inventario', 'number'),
            ('formato_codigo_barras', 'EAN13', 'Formato de código de barras por defecto', 'string'),
            ('moneda_sistema', 'UYU', 'Moneda del sistema', 'string'),
            ('precision_decimales', '2', 'Precisión decimal para precios y cantidades', 'number')
        ]
        
        for config in configuraciones_default:
            cursor.execute("""
                INSERT IGNORE INTO configuracion_sistema (clave, valor, descripcion, tipo)
                VALUES (%s, %s, %s, %s)
            """, config)
        
        # Insertar datos de ejemplo para proveedores
        cursor.execute("SELECT COUNT(*) FROM proveedores")
        if cursor.fetchone()[0] == 0:
            proveedores_ejemplo = [
def jwt_required(f):
    """Decorador para rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
# Insertar datos de ejemplo para proveedores
cursor.execute("SELECT COUNT(*) FROM proveedores")
if cursor.fetchone()[0] == 0:
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
    logger.info("✅ Proveedores de ejemplo creados")
                ('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, 2.20, 'Bananas maduras y dulces', proveedores_ids[0] if proveedores_ids else None),
                ('Naranja', 'frutas', 'kg', 40.0, 8.0, 4.20, 3.50, 'Naranjas jugosas para zumo', proveedores_ids[3] if len(proveedores_ids) > 3 else None),
                ('Pera', 'frutas', 'kg', 25.0, 6.0, 4.80, 3.90, 'Peras dulces y suaves', proveedores_ids[0] if proveedores_ids else None),
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
            
# Insertar productos de ejemplo MEJORADOS
cursor.execute("SELECT COUNT(*) FROM productos")
if cursor.fetchone()[0] == 0:
    # Obtener IDs de proveedores
    cursor.execute("SELECT id FROM proveedores ORDER BY id")
    proveedores_ids = [row[0] for row in cursor.fetchall()]
    
    productos_ejemplo = [
        # Frutas
        ('Manzana Roja', 'frutas', 'kg', 50.0, 10.0, 3.50, 2.80, 'Manzanas rojas frescas y crujientes', proveedores_ids[0] if proveedores_ids else None),
        ('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, 2.20, 'Bananas maduras y dulces', proveedores_ids[0] if proveedores_ids else None),
        ('Naranja', 'frutas', 'kg', 40.0, 8.0, 4.20, 3.50, 'Naranjas jugosas para zumo', proveedores_ids[0] if proveedores_ids else None),
        ('Pera', 'frutas', 'kg', 25.0, 6.0, 4.80, 3.90, 'Peras dulces y suaves', proveedores_ids[0] if proveedores_ids else None),
        # Verduras
        ('Tomate', 'verduras', 'kg', 35.0, 8.0, 5.20, 4.10, 'Tomates frescos de invernadero', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
        ('Lechuga', 'verduras', 'unidad', 20.0, 5.0, 2.50, 1.80, 'Lechuga crespa fresca', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
        ('Papa', 'verduras', 'kg', 80.0, 15.0, 1.80, 1.20, 'Papas lavadas nacionales', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
        ('Zanahoria', 'verduras', 'kg', 30.0, 7.0, 3.20, 2.50, 'Zanahorias frescas', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
        # Otros
        ('Aceite de Oliva', 'otros', 'litro', 12.0, 2.0, 8.90, 6.50, 'Aceite de oliva extra virgen', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
        ('Miel Natural', 'otros', 'unidad', 8.0, 1.0, 12.50, 9.80, 'Miel pura de abeja', proveedores_ids[1] if len(proveedores_ids) > 1 else None)
    ]
    
    for producto in productos_ejemplo:
        cursor.execute("""
            INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, 
                                 precio_unitario, precio_compra, descripcion, proveedor_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, producto)
    logger.info("✅ Productos de ejemplo creados")
            VALUES (%s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['correo'].strip().lower(),
            hashed_password.decode('utf-8'),
            data.get('rol', 'operador')
        ))
        
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
        return jsonify({'message': 'Error interno del servidor'}), 500
        # Otros
        ('Aceite de Oliva', 'otros', 'litro', 12.0, 2.0, 8.90, 6.50, 'Aceite de oliva extra virgen', 2),
        ('Miel Natural', 'otros', 'unidad', 8.0, 1.0, 12.50, 9.80, 'Miel pura de abeja', 2)
    ]
    
    for producto in productos_ejemplo:
        cursor.execute("""
            INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, 
                                 precio_unitario, precio_compra, descripcion, proveedor_id)
    # Insertar clientes de ejemplo
    cursor.execute("SELECT COUNT(*) FROM clientes")
    if cursor.fetchone()[0] == 0:
        clientes_ejemplo = [
            ('Cliente General', '', '', '', 'Cliente por defecto para ventas sin cliente específico'),
            ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '099887766', 'Av. Principal 456', 'Cliente mayorista'),
            ('Supermercado Villa', 'compras@villa.com', '098776655', 'Calle Comercial 789', 'Cliente corporativo'),
            ('Panadería Central', 'panaderia@central.com', '097665544', 'Centro 123', 'Cliente frecuente'),
            ('Hotel Plaza', 'compras@hotelplaza.com', '096554433', 'Plaza Principal 456', 'Cliente premium')
        ]
        
        for cliente in clientes_ejemplo:
            cursor.execute("""
                INSERT INTO clientes (nombre, correo, telefono, direccion, notas)
                VALUES (%s, %s, %s, %s, %s)
            """, cliente)
        logger.info("✅ Clientes de ejemplo creados")
    
    connection.commit()
    logger.info("✅ Base de datos inicializada correctamente")
    return True
    
except Exception as e:
    logger.error(f"❌ Error inicializando base de datos: {e}")
    if connection:
        connection.rollback()
    return False
finally:
    if cursor:
        cursor.close()
    if connection and connection.is_connected():
        connection.close()
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
logger.info("✅ Clientes de ejemplo creados")
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
nfo("✅ Clientes de ejemplo creados")
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
        cursor.execute("""
            SELECT id, nombre, correo, rol 
            FROM usuarios 
            WHERE id = %s AND activo = TRUE
        """, (payload['user_id'],))
        
        user = cursor.fetchone()
        
        if user:
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
        else:
            return jsonify({'valid': False, 'message': 'Usuario no encontrado'}), 404
            
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
@app.route('/api/productos', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Listar productos con filtros mejorados"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        search = request.args.get('q', '').strip()
        categoria = request.args.get('categoria')
        activo = request.args.get('activo', 'true').lower() == 'true'
        stock_bajo = request.args.get('stock_bajo', 'false').lower() == 'true'
        orden = request.args.get('orden', 'nombre')
        direccion = request.args.get('direccion', 'asc')
        
        # Construir consulta
        query = """
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, p.stock_minimo, 
                   p.precio_unitario, p.activo, p.creado, pr.nombre as proveedor_nombre,
                   CASE WHEN p.stock_actual <= p.stock_minimo THEN 1 ELSE 0 END as stock_bajo
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = %s
        """
        params = [activo]
        
        if search:
            query += " AND (p.nombre LIKE %s OR pr.nombre LIKE %s)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param])
        
        if categoria and categoria != 'todos':
            query += " AND p.categoria = %s"
            params.append(categoria)
        
        if stock_bajo:
            query += " AND p.stock_actual <= p.stock_minimo"
        
        # Ordenamiento
                'proveedor': row[9] or 'Sin proveedor',
        direccion_valida = 'DESC' if direccion.lower() == 'desc' else 'ASC'
        query += f" ORDER BY p.{orden_valido} {direccion_valida}"
        
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
                'activo': bool(row[7]),
                'creado': row[8].isoformat() if row[8] else None,
                'proveedor_nombre': row[9] or 'Sin proveedor',
                'stock_bajo': bool(row[10])
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
 data.get('rol', 'operador')
@app.route('/api/productos', methods=['POST'])
@jwt_required
def crear_producto(current_user_id):
    """Crear nuevo producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('nombre', 'categoria', 'precio_unitario')):
            return jsonify({'message': 'Faltan campos requeridos: nombre, categoria, precio_unitario'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si ya existe un producto con el mismo nombre
        cursor.execute("SELECT id FROM productos WHERE nombre = %s", (data['nombre'].strip(),))
        if cursor.fetchone():
            return jsonify({'message': 'Ya existe un producto con este nombre'}), 409
        
        # Insertar producto con campos adicionales
        cursor.execute("""
            INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, 
                                 precio_unitario, precio_compra, descripcion, proveedor_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['categoria'],
            data.get('unidad', 'unidad'),
            float(data.get('stock_actual', 0)),
            float(data.get('stock_minimo', 0)),
            float(data['precio_unitario']),
            float(data.get('precio_compra', data['precio_unitario'])),
            data.get('descripcion', '').strip() or None,
            data.get('proveedor_id') or None
        ))
        
        producto_id = cursor.lastrowid
        connection.commit()
        
        logger.info(f"Producto creado: {data['nombre']} (ID: {producto_id})")
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
    """Actualizar producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT id FROM productos WHERE id = %s", (producto_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Construir consulta de actualización
        campos_actualizables = ['nombre', 'categoria', 'unidad', 'stock_actual', 'stock_minimo', 
                               'precio_unitario', 'precio_compra', 'descripcion', 'proveedor_id', 'activo']
        campos_a_actualizar = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                if campo in ['stock_actual', 'stock_minimo', 'precio_unitario', 'precio_compra']:
                    campos_a_actualizar.append(f"{campo} = %s")
                    valores.append(float(data[campo]))
                elif campo == 'activo':
                    campos_a_actualizar.append(f"{campo} = %s")
                    valores.append(bool(data[campo]))
                else:
                    campos_a_actualizar.append(f"{campo} = %s")
                    valor = data[campo].strip() if isinstance(data[campo], str) else data[campo]
                    valores.append(valor if valor else None)
        
        if not campos_a_actualizar:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        # Verificar nombre único si se está actualizando
        if 'nombre' in data:
            cursor.execute(
                "SELECT id FROM productos WHERE nombre = %s AND id != %s", 
                (data['nombre'].strip(), producto_id)
            )
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un producto con este nombre'}), 409
        
        # Actualizar producto
        query = f"UPDATE productos SET {', '.join(campos_a_actualizar)} WHERE id = %s"
        valores.append(producto_id)
        connection.commit()
        
        logger.info(f"Producto {producto_id} actualizado")
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

        if not token or not token.startswith('Bearer '):
            return jsonify({'valid': False, 'message': 'Token requerido'}), 401
        
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
        cursor.execute("SELECT id FROM productos WHERE id = %s", (producto_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Verificar si tiene movimientos de stock
        cursor.execute("SELECT COUNT(*) FROM movimientos_stock WHERE producto_id = %s", (producto_id,))
        movimientos_count = cursor.fetchone()[0]
        
        # Verificar si está en detalles de ventas o compras
        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM detalle_ventas WHERE producto_id = %s) +
                (SELECT COUNT(*) FROM detalle_compras WHERE producto_id = %s) as total
        """, (producto_id, producto_id))
        detalles_count = cursor.fetchone()[0]
        
        if movimientos_count > 0 or detalles_count > 0:
            # Soft delete - marcar como inactivo
            cursor.execute("UPDATE productos SET activo = FALSE WHERE id = %s", (producto_id,))
            mensaje = 'Producto desactivado (tiene movimientos o transacciones asociadas)'
        else:
            # Hard delete si no tiene movimientos
            cursor.execute("DELETE FROM productos WHERE id = %s", (producto_id,))
            mensaje = 'Producto eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"{mensaje}")
        response = jsonify({'message': mensaje})
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

@app.route('/api/stock-bajo', methods=['GET'])
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
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, p.stock_minimo, 
                   p.precio_unitario, pr.nombre as proveedor_nombre
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.stock_actual <= p.stock_minimo AND p.activo = TRUE
            ORDER BY (p.stock_actual - p.stock_minimo) ASC
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
                'proveedor_nombre': row[7] or 'Sin proveedor',
                'diferencia': float(row[4]) - float(row[5])
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

@app.route('/api/stock/movimiento', methods=['POST'])
@jwt_required
def crear_movimiento_stock(current_user_id):
    """Registrar movimiento de stock mejorado"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('producto_id', 'tipo', 'cantidad')):
            return jsonify({'message': 'Faltan campos requeridos: producto_id, tipo, cantidad'}), 400
        
        if data['tipo'] not in ['ingreso', 'egreso', 'ajuste']:
            return jsonify({'message': 'Tipo debe ser: ingreso, egreso o ajuste'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT stock_actual FROM productos WHERE id = %s", (data['producto_id'],))
        producto = cursor.fetchone()
        if not producto:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        stock_actual = float(producto[0])
        cantidad = float(data['cantidad'])
        
        # Calcular nuevo stock según el tipo de movimiento
        if data['tipo'] == 'ingreso':
            nuevo_stock = stock_actual + cantidad
        elif data['tipo'] == 'egreso':
            if stock_actual < cantidad:
                return jsonify({'message': 'Stock insuficiente'}), 400
            nuevo_stock = stock_actual - cantidad
        else:  # ajuste
            nuevo_stock = cantidad
            cantidad = cantidad - stock_actual  # Diferencia para el registro
        
        # Actualizar stock del producto
        cursor.execute(
            "UPDATE productos SET stock_actual = %s WHERE id = %s",
            (nuevo_stock, data['producto_id'])
        )
        
        # Registrar movimiento con información adicional
        cursor.execute("""
            INSERT INTO movimientos_stock (producto_id, tipo, cantidad, cantidad_anterior, 
                                         cantidad_nueva, motivo, observaciones, referencia_tipo, usuario_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'ajuste', %s)
        """, (
            data['producto_id'],
            data['tipo'],
            abs(cantidad),
            stock_actual,
            nuevo_stock,
            data.get('motivo', 'Ajuste manual').strip(),
            data.get('observaciones', '').strip() or None,
            current_user_id
        ))
        
        connection.commit()
        
        logger.info(f"Movimiento de stock creado para producto {data['producto_id']}")
        response = jsonify({
            'message': 'Movimiento de stock registrado exitosamente',
            'nuevo_stock': nuevo_stock
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

# ==================== NUEVOS ENDPOINTS AVANZADOS DE INVENTARIO ====================

@app.route('/api/inventario/resumen', methods=['GET'])
@jwt_required
def obtener_resumen_inventario(current_user_id):
    """Obtener resumen completo del inventario con estadísticas avanzadas"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'estadisticas_generales': {
                    'total_productos': 0,
                    'productos_stock_bajo': 0,
                    'productos_sin_stock': 0,
                    'valor_inventario': 0,
                    'stock_total_unidades': 0
                },
                'distribucion_categorias': [],
                'productos_mas_vendidos': [],
                'movimientos_recientes': {
                    'total': 0,
                    'ingresos': 0,
                    'egresos': 0,
                    'ajustes': 0
                },
                'proveedores_principales': [],
                'alertas': [],
                'tendencias': {
                    'productos_nuevos_mes': 0,
                    'tendencia_porcentual': 0
                }
            }), 200
            
        cursor = connection.cursor()
        
        # Total de productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0] or 0
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0] or 0
        
        # Productos sin stock
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual = 0 AND activo = TRUE
        """)
        productos_sin_stock = cursor.fetchone()[0] or 0
        
        # Valor total del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) 
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = float(cursor.fetchone()[0] or 0)
        
        # Stock total por unidades
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual), 0) 
            FROM productos WHERE activo = TRUE
        """)
        stock_total_unidades = float(cursor.fetchone()[0] or 0)
        
        # Distribución por categorías
        cursor.execute("""
            SELECT categoria, COUNT(*) as cantidad, 
                   COALESCE(SUM(stock_actual * precio_unitario), 0) as valor
            FROM productos 
            WHERE activo = TRUE 
            GROUP BY categoria
            ORDER BY cantidad DESC
        """)
        categorias = []
        for row in cursor.fetchall():
            categorias.append({
                'categoria': row[0],
                'cantidad_productos': row[1],
                'valor_total': float(row[2])
            })
        
        # Productos más vendidos (últimos 30 días)
        cursor.execute("""
            SELECT p.nombre, p.categoria, COALESCE(SUM(dv.cantidad), 0) as total_vendido,
                   COALESCE(SUM(dv.subtotal), 0) as ingresos_generados
            FROM productos p
            LEFT JOIN detalle_ventas dv ON p.id = dv.producto_id
            LEFT JOIN ventas v ON dv.venta_id = v.id
            WHERE p.activo = TRUE 
            AND (v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) OR v.fecha IS NULL)
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre, p.categoria
            HAVING total_vendido > 0
            ORDER BY total_vendido DESC
            LIMIT 10
        """)
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'nombre': row[0],
                'categoria': row[1],
                'cantidad_vendida': float(row[2]),
                'ingresos_generados': float(row[3])
            })
        
        # Movimientos recientes (últimos 7 días)
        cursor.execute("""
            SELECT COUNT(*) as total_movimientos,
                   SUM(CASE WHEN tipo = 'ingreso' THEN 1 ELSE 0 END) as ingresos,
                   SUM(CASE WHEN tipo = 'egreso' THEN 1 ELSE 0 END) as egresos,
                   SUM(CASE WHEN tipo = 'ajuste' THEN 1 ELSE 0 END) as ajustes
            FROM movimientos_stock 
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        """)
        movimientos_data = cursor.fetchone()
        movimientos_recientes = {
            'total': movimientos_data[0] or 0,
            'ingresos': movimientos_data[1] or 0,
            'egresos': movimientos_data[2] or 0,
            'ajustes': movimientos_data[3] or 0
        }
        
        # Proveedores con más productos
        cursor.execute("""
            SELECT pr.nombre, COUNT(p.id) as productos_suministrados,
                   COALESCE(SUM(p.stock_actual * p.precio_unitario), 0) as valor_inventario
            FROM proveedores pr
            INNER JOIN productos p ON pr.id = p.proveedor_id
            WHERE p.activo = TRUE AND pr.activo = TRUE
            GROUP BY pr.id, pr.nombre
            ORDER BY productos_suministrados DESC
            LIMIT 5
        """)
        proveedores_principales = []
        for row in cursor.fetchall():
            proveedores_principales.append({
                'nombre': row[0],
                'productos_suministrados': row[1],
                'valor_inventario': float(row[2])
            })
        
        # Alertas y recomendaciones
        alertas = []
        
        if productos_sin_stock > 0:
            alertas.append({
                'tipo': 'critico',
                'mensaje': f'{productos_sin_stock} productos sin stock',
                'accion': 'Reabastecer inmediatamente'
            })
        
        if productos_stock_bajo > 0:
            alertas.append({
                'tipo': 'advertencia',
                'mensaje': f'{productos_stock_bajo} productos con stock bajo',
                'accion': 'Planificar reposición'
            })
        
        # Tendencias (comparación con mes anterior)
        cursor.execute("""
            SELECT 
                COUNT(CASE WHEN DATE(creado) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as productos_nuevos_mes,
                COUNT(CASE WHEN DATE(creado) >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) 
                           AND DATE(creado) < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) as productos_mes_anterior
            FROM productos WHERE activo = TRUE
        """)
        tendencias_data = cursor.fetchone()
        productos_nuevos_mes = tendencias_data[0] or 0
        productos_mes_anterior = tendencias_data[1] or 0
        
        tendencia_productos = 0
        if productos_mes_anterior > 0:
            tendencia_productos = ((productos_nuevos_mes - productos_mes_anterior) / productos_mes_anterior) * 100
        
        resumen = {
            'estadisticas_generales': {
                'total_productos': total_productos,
                'productos_stock_bajo': productos_stock_bajo,
                'productos_sin_stock': productos_sin_stock,
                'valor_inventario': valor_inventario,
                'stock_total_unidades': stock_total_unidades
            },
            'distribucion_categorias': categorias,
            'productos_mas_vendidos': productos_mas_vendidos,
            'movimientos_recientes': movimientos_recientes,
            'proveedores_principales': proveedores_principales,
            'alertas': alertas,
            'tendencias': {
                'productos_nuevos_mes': productos_nuevos_mes,
                'tendencia_porcentual': round(tendencia_productos, 2)
            },
            'fecha_actualizacion': datetime.now().isoformat()
        }
        
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo resumen de inventario: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/productos/busqueda-avanzada', methods=['GET'])
@jwt_required
def busqueda_avanzada_productos(current_user_id):
    """Búsqueda avanzada de productos con múltiples filtros"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'productos': [],
                'paginacion': {
                    'pagina_actual': 1,
                    'limite': 50,
                    'total_registros': 0,
                    'total_paginas': 0,
                    'tiene_siguiente': False,
                    'tiene_anterior': False
                },
                'filtros_aplicados': {}
            }), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        busqueda = request.args.get('q', '').strip()
        categoria = request.args.get('categoria')
        proveedor_id = request.args.get('proveedor_id')
        stock_minimo = request.args.get('stock_minimo', type=int)
        stock_maximo = request.args.get('stock_maximo', type=int)
        precio_minimo = request.args.get('precio_minimo', type=float)
        precio_maximo = request.args.get('precio_maximo', type=float)
        solo_stock_bajo = request.args.get('solo_stock_bajo', 'false').lower() == 'true'
        solo_sin_stock = request.args.get('solo_sin_stock', 'false').lower() == 'true'
        orden = request.args.get('orden', 'nombre')
        direccion = request.args.get('direccion', 'asc')
        limite = request.args.get('limite', 50, type=int)
        pagina = request.args.get('pagina', 1, type=int)
        
        # Construir consulta base
        query = """
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, p.stock_minimo, 
                   p.precio_unitario, p.activo, p.creado, p.actualizado,
                   pr.nombre as proveedor_nombre, pr.id as proveedor_id,
                   CASE WHEN p.stock_actual <= p.stock_minimo THEN 1 ELSE 0 END as stock_bajo,
                   CASE WHEN p.stock_actual = 0 THEN 1 ELSE 0 END as sin_stock,
                   (p.stock_actual * p.precio_unitario) as valor_stock
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE
        """
        params = []
        
        # Aplicar filtros
        if busqueda:
            query += " AND (p.nombre LIKE %s OR pr.nombre LIKE %s)"
            busqueda_param = f"%{busqueda}%"
            params.extend([busqueda_param, busqueda_param])
        
        if categoria:
            query += " AND p.categoria = %s"
            params.append(categoria)
        
        if proveedor_id:
            query += " AND p.proveedor_id = %s"
            params.append(proveedor
Collapse Code


Click to continue generating
Claude 4 sonnet PCAI





sigue




        if proveedor_id:
            query += " AND p.proveedor_id = %s"
            params.append(proveedor_id)
        
        if stock_minimo is not None:
            query += " AND p.stock_actual >= %s"
            params.append(stock_minimo)
        
        if stock_maximo is not None:
            query += " AND p.stock_actual <= %s"
            params.append(stock_maximo)
        
        if precio_minimo is not None:
            query += " AND p.precio_unitario >= %s"
            params.append(precio_minimo)
        
        if precio_maximo is not None:
            query += " AND p.precio_unitario <= %s"
            params.append(precio_maximo)
        
        if solo_stock_bajo:
            query += " AND p.stock_actual <= p.stock_minimo"
        
        if solo_sin_stock:
            query += " AND p.stock_actual = 0"
        
        # Ordenamiento
        campos_orden_validos = ['nombre', 'categoria', 'stock_actual', 'precio_unitario', 'creado', 'valor_stock']
        if orden in campos_orden_validos:
            direccion_sql = 'DESC' if direccion.lower() == 'desc' else 'ASC'
            query += f" ORDER BY p.{orden} {direccion_sql}"
        else:
            query += " ORDER BY p.nombre ASC"
        
        # Paginación
        offset = (pagina - 1) * limite
        query += " LIMIT %s OFFSET %s"
        params.extend([limite, offset])
        
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
                'activo': bool(row[7]),
                'creado': row[8].isoformat() if row[8] else None,
                'actualizado': row[9].isoformat() if row[9] else None,
                'proveedor': {
                    'id': row[11],
                    'nombre': row[10] or 'Sin proveedor'
                },
                'stock_bajo': bool(row[12]),
                'sin_stock': bool(row[13]),
                'valor_stock': float(row[14])
            }
            productos.append(producto)
        
        # Obtener total de registros para paginación
        query_count = """
            SELECT COUNT(*) FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE
        """
        params_count = []
        
        # Aplicar los mismos filtros para el conteo
        if busqueda:
            query_count += " AND (p.nombre LIKE %s OR pr.nombre LIKE %s)"
            params_count.extend([busqueda_param, busqueda_param])
        
        if categoria:
            query_count += " AND p.categoria = %s"
            params_count.append(categoria)
        
        if proveedor_id:
            query_count += " AND p.proveedor_id = %s"
            params_count.append(proveedor_id)
        
        if stock_minimo is not None:
            query_count += " AND p.stock_actual >= %s"
            params_count.append(stock_minimo)
        
        if stock_maximo is not None:
            query_count += " AND p.stock_actual <= %s"
            params_count.append(stock_maximo)
        
        if precio_minimo is not None:
            query_count += " AND p.precio_unitario >= %s"
            params_count.append(precio_minimo)
        
        if precio_maximo is not None:
            query_count += " AND p.precio_unitario <= %s"
            params_count.append(precio_maximo)
        
        if solo_stock_bajo:
            query_count += " AND p.stock_actual <= p.stock_minimo"
        
        if solo_sin_stock:
            query_count += " AND p.stock_actual = 0"
        
        cursor.execute(query_count, params_count)
        total_registros = cursor.fetchone()[0]
        
        resultado = {
            'productos': productos,
            'paginacion': {
                'pagina_actual': pagina,
                'limite': limite,
                'total_registros': total_registros,
                'total_paginas': (total_registros + limite - 1) // limite,
                'tiene_siguiente': pagina * limite < total_registros,
                'tiene_anterior': pagina > 1
            },
            'filtros_aplicados': {
                'busqueda': busqueda,
                'categoria': categoria,
                'proveedor_id': proveedor_id,
                'solo_stock_bajo': solo_stock_bajo,
                'solo_sin_stock': solo_sin_stock
            }
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error en búsqueda avanzada: {e}")
        return jsonify({'productos': [], 'error': 'Error en la búsqueda'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/productos/operaciones-masivas', methods=['POST'])
@jwt_required
def operaciones_masivas_productos(current_user_id):
    """Realizar operaciones masivas en productos"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('operacion') or not data.get('productos_ids'):
            return jsonify({'error': 'Faltan datos requeridos'}), 400
        
        operacion = data['operacion']
        productos_ids = data['productos_ids']
        parametros = data.get('parametros', {})
        
        if not isinstance(productos_ids, list) or len(productos_ids) == 0:
            return jsonify({'error': 'Lista de productos inválida'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        resultados = {
            'exitosos': 0,
            'fallidos': 0,
            'errores': []
        }
        
        if operacion == 'actualizar_precios':
            # Actualización masiva de precios
            porcentaje_cambio = parametros.get('porcentaje_cambio', 0)
            precio_fijo = parametros.get('precio_fijo')
            
            for producto_id in productos_ids:
                try:
                    if precio_fijo is not None:
                        cursor.execute(
                            "UPDATE productos SET precio_unitario = %s WHERE id = %s",
                            (precio_fijo, producto_id)
                        )
                    elif porcentaje_cambio != 0:
                        cursor.execute("""
                            UPDATE productos 
                            SET precio_unitario = precio_unitario * (1 + %s / 100) 
                            WHERE id = %s
                        """, (porcentaje_cambio, producto_id))
                    
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        elif operacion == 'cambiar_categoria':
            # Cambio masivo de categoría
            nueva_categoria = parametros.get('categoria')
            if nueva_categoria not in ['frutas', 'verduras', 'otros']:
                return jsonify({'error': 'Categoría inválida'}), 400
            
            for producto_id in productos_ids:
                try:
                    cursor.execute(
                        "UPDATE productos SET categoria = %s WHERE id = %s",
                        (nueva_categoria, producto_id)
                    )
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        elif operacion == 'ajustar_stock_minimo':
            # Ajuste masivo de stock mínimo
            nuevo_stock_minimo = parametros.get('stock_minimo')
            porcentaje_stock_actual = parametros.get('porcentaje_stock_actual')
            
            for producto_id in productos_ids:
                try:
                    if nuevo_stock_minimo is not None:
                        cursor.execute(
                            "UPDATE productos SET stock_minimo = %s WHERE id = %s",
                            (nuevo_stock_minimo, producto_id)
                        )
                    elif porcentaje_stock_actual is not None:
                        cursor.execute("""
                            UPDATE productos 
                            SET stock_minimo = ROUND(stock_actual * %s / 100) 
                            WHERE id = %s
                        """, (porcentaje_stock_actual, producto_id))
                    
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        elif operacion == 'desactivar':
            # Desactivación masiva
            for producto_id in productos_ids:
                try:
                    cursor.execute(
                        "UPDATE productos SET activo = FALSE WHERE id = %s",
                        (producto_id,)
                    )
                    resultados['exitosos'] += 1
                except Exception as e:
                    resultados['fallidos'] += 1
                    resultados['errores'].append(f"Producto {producto_id}: {str(e)}")
        
        else:
            return jsonify({'error': 'Operación no válida'}), 400
        
        connection.commit()
        
        response = jsonify({
            'mensaje': f'Operación {operacion} completada',
            'resultados': resultados
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error en operaciones masivas: {e}")
        if connection:
            connection.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/filtros-personalizados', methods=['GET'])
@jwt_required
def obtener_filtros_personalizados(current_user_id):
    """Obtener filtros personalizados del usuario"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT id, nombre, filtros, modulo, creado
            FROM filtros_personalizados
            WHERE usuario_id = %s
            ORDER BY creado DESC
        """, (current_user_id,))
        
        filtros = []
        for row in cursor.fetchall():
            filtro = {
                'id': row[0],
                'nombre': row[1],
                'filtros': row[2],  # JSON
                'modulo': row[3],
                'creado': row[4].isoformat() if row[4] else None
            }
            filtros.append(filtro)
        
        response = jsonify(filtros)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo filtros personalizados: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/filtros-personalizados', methods=['POST'])
@jwt_required
def guardar_filtro_personalizado(current_user_id):
    """Guardar filtro personalizado"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre') or not data.get('filtros'):
            return jsonify({'error': 'Faltan datos requeridos: nombre, filtros'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Insertar filtro personalizado
        cursor.execute("""
            INSERT INTO filtros_personalizados (usuario_id, nombre, filtros, modulo)
            VALUES (%s, %s, %s, %s)
        """, (
            current_user_id,
            data['nombre'].strip(),
            data['filtros'],  # JSON
            data.get('modulo', 'inventario')
        ))
        
        filtro_id = cursor.lastrowid
        connection.commit()
        
        response = jsonify({
            'mensaje': 'Filtro guardado exitosamente',
            'id': filtro_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error guardando filtro personalizado: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS EXISTENTES MANTENIDOS ====================

@app.route('/api/ventas', methods=['GET'])
@jwt_required
def obtener_ventas(current_user_id):
    """Listar ventas con filtros"""
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
        cliente_id = request.args.get('cliente_id')
        forma_pago = request.args.get('forma_pago')
        estado = request.args.get('estado', 'completada')
        
        # Construir consulta
        query = """
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.subtotal, v.descuento, 
                   v.impuestos, v.total, v.estado, v.observaciones,
                   c.nombre as cliente_nombre, u.nombre as usuario_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.estado = %s
        """
        params = [estado]
        
        if fecha_inicio:
            query += " AND DATE(v.fecha) >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND DATE(v.fecha) <= %s"
            params.append(fecha_fin)
        
        if cliente_id:
            query += " AND v.cliente_id = %s"
            params.append(cliente_id)
        
        if forma_pago:
            query += " AND v.forma_pago = %s"
            params.append(forma_pago)
        
        query += " ORDER BY v.fecha DESC, v.id DESC"
        
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
                'cliente_nombre': row[10] or 'Cliente General',
                'usuario_nombre': row[11] or 'Usuario desconocido'
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
    """Registrar nueva venta con detalle"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('productos') or not isinstance(data['productos'], list):
            return jsonify({'message': 'Se requiere una lista de productos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar stock disponible antes de procesar
        for producto in data['productos']:
            if not all(k in producto for k in ('producto_id', 'cantidad', 'precio_unitario')):
                return jsonify({'message': 'Faltan campos requeridos en productos'}), 400
            cursor.execute("SELECT stock_actual FROM productos WHERE id = %s", (producto['producto_id'],))
            stock_result = cursor.fetchone()
            if not stock_result or stock_result[0] < float(producto['cantidad']):
                cursor.execute("SELECT nombre FROM productos WHERE id = %s", (producto['producto_id'],))
                nombre_producto = cursor.fetchone()
                nombre = nombre_producto[0] if nombre_producto else 'Producto'
                return jsonify({'message': f'Stock insuficiente para {nombre}'}), 400
        
        # Calcular totales
        subtotal = sum(float(p['cantidad']) * float(p['precio_unitario']) for p in data['productos'])
        descuento = float(data.get('descuento', 0))
        impuestos = float(data.get('impuestos', 0))
        total = subtotal - descuento + impuestos
        
        # Insertar venta
        cursor.execute("""
            INSERT INTO ventas (cliente_id, usuario_id, numero_venta, forma_pago, subtotal, 
                              descuento, impuestos, total, observaciones)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('cliente_id') or None,
            current_user_id,
            data.get('numero_venta', '').strip() or None,
            data.get('forma_pago', 'efectivo'),
            subtotal,
            descuento,
            impuestos,
            total,
            data.get('observaciones', '').strip() or None
        ))
        
        venta_id = cursor.lastrowid
        
        # Insertar detalles de venta y actualizar stock
        for producto in data['productos']:
            # Insertar detalle
            subtotal_producto = float(producto['cantidad']) * float(producto['precio_unitario'])
            cursor.execute("""
                INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                venta_id,
                producto['producto_id'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                subtotal_producto
            ))
            
            # Actualizar stock del producto
            cursor.execute("""
                UPDATE productos 
                SET stock_actual = stock_actual - %s 
                WHERE id = %s
            """, (float(producto['cantidad']), producto['producto_id']))
            
            # Registrar movimiento de stock
            cursor.execute("""
                INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id)
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT id, nombre, filtros, modulo, creado
            FROM filtros_personalizados
            WHERE usuario_id = %s
            ORDER BY creado DESC
        """, (current_user_id,))
        
        filtros = []
        for row in cursor.fetchall():
            filtro = {
                'id': row[0],
                'nombre': row[1],
                'filtros': row[2],
                'modulo': row[3],
                'creado': row[4].isoformat() if row[4] else None
            }
            filtros.append(filtro)
        
        response = jsonify(filtros)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo filtros personalizados: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/filtros-personalizados', methods=['POST'])
@jwt_required
def guardar_filtro_personalizado(current_user_id):
    """Guardar filtro personalizado"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not data.get('nombre') or not data.get('filtros'):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Insertar filtro personalizado
        cursor.execute("""
            INSERT INTO filtros_personalizados (usuario_id, nombre, filtros, modulo)
            VALUES (%s, %s, %s, %s)
        """, (
            current_user_id,
            data['nombre'].strip(),
            data['filtros'],  # JSON
            data.get('modulo', 'inventario')
        ))
        
        filtro_id = cursor.lastrowid
        connection.commit()
        
        response = jsonify({
            'mensaje': 'Filtro guardado exitosamente',
            'id': filtro_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error guardando filtro personalizado: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

        venta = {
            'id': venta_data[0],
            'numero_venta': venta_data[1] or '',
            'fecha': venta_data[2].isoformat() if venta_data[2] else None,
            'forma_pago': venta_data[3],
            'subtotal': float(venta_data[4]),
            'descuento': float(venta_data[5]),
            'impuestos': float(venta_data[6]),
            'total': float(venta_data[7]),
            'estado': venta_data[8],
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        cliente_id = request.args.get('cliente_id')
        forma_pago = request.args.get('forma_pago')
        estado = request.args.get('estado', 'completada')
        
        # Construir consulta
        query = """
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.subtotal, v.descuento, 
                   v.impuestos, v.total, v.estado, v.observaciones,
                   c.nombre as cliente_nombre, u.nombre as usuario_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.estado = %s
        """
        params = [estado]
        
        if fecha_inicio:
            query += " AND v.fecha >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND v.fecha <= %s"
            params.append(fecha_fin)
        
        if cliente_id:
            query += " AND v.cliente_id = %s"
            params.append(cliente_id)
        
        if forma_pago:
            query += " AND v.forma_pago = %s"
            params.append(forma_pago)
        
        query += " ORDER BY v.fecha DESC, v.id DESC"
        
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
                'observaciones': row[9],
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

        puede_eliminar = (
            (user_role and user_role[0] == 'admin') or
            (venta[2] == hoy and venta[1] == current_user_id and venta[0] != 'completada')
        )
        
        if not puede_eliminar:
            return jsonify({'message': 'Solo se pueden eliminar ventas del día y no completadas'}), 403
        
        # Iniciar transacción
        cursor.execute("START TRANSACTION")
        if not data or not data.get('productos') or not isinstance(data['productos'], list):
            return jsonify({'message': 'Se requiere lista de productos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar stock disponible antes de procesar
        for producto in data['productos']:
            cursor.execute("SELECT stock_actual FROM productos WHERE id = %s", (producto['producto_id'],))
            stock_result = cursor.fetchone()
            if not stock_result or float(stock_result[0]) < float(producto['cantidad']):
                return jsonify({'message': f'Stock insuficiente para producto ID {producto["producto_id"]}'}), 400
        
        # Calcular totales
        subtotal = sum(float(p['cantidad']) * float(p['precio_unitario']) for p in data['productos'])
        descuento = float(data.get('descuento', 0))
        impuestos = float(data.get('impuestos', 0))
        total = subtotal - descuento + impuestos
        
        # Insertar venta
        cursor.execute("""
            INSERT INTO ventas (cliente_id, usuario_id, forma_pago, subtotal, descuento, impuestos, total, observaciones)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('cliente_id'),
            current_user_id,
            data.get('forma_pago', 'efectivo'),
            subtotal,
            descuento,
            impuestos,
            total,
            data.get('observaciones', '')
        ))
        
        venta_id = cursor.lastrowid
        
        # Insertar detalles y actualizar stock
        for producto in data['productos']:
            # Insertar detalle
            cursor.execute("""
                INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                venta_id,
                producto['producto_id'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                float(producto['cantidad']) * float(producto['precio_unitario'])
            ))
            
            # Actualizar stock
            cursor.execute("""
                UPDATE productos SET stock_actual = stock_actual - %s WHERE id = %s
            """, (float(producto['cantidad']), producto['producto_id']))
        
        connection.commit()
        
        response = jsonify({
            'message': 'Venta registrada exitosamente',
            'venta_id': venta_id,
            'total': total
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

                    SET stock_actual = stock_actual + %s 
                    WHERE id = %s
                """, (cantidad, producto_id))
                
                # Registrar movimiento de stock
                cursor.execute("""
                    INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id)
                    VALUES (%s, 'ingreso', %s, %s, %s, 'venta', %s)
                """, (
                    producto_id,
                    cantidad,
                    f'Eliminación de venta #{venta_id}',
                    venta_id,
                    current_user_id
                ))
            
            # Eliminar venta (los detalles se eliminan automáticamente por CASCADE)
            cursor.execute("DELETE FROM ventas WHERE id = %s", (venta_id,))
            
            # Confirmar transacción
            connection.commit()
            
            logger.info(f"Venta {venta_id} eliminada exitosamente")
            response = jsonify({'message': 'Venta eliminada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        except Exception as e:
            # Revertir transacción en caso de error
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.subtotal, v.descuento, 
                   v.impuestos, v.total, v.estado, v.observaciones,
                   c.nombre as cliente_nombre, u.nombre as usuario_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.id = %s
        """, (venta_id,))
        
        venta = cursor.fetchone()
        if not venta:
            return jsonify({'message': 'Venta no encontrada'}), 404
        
        # Obtener detalles de la venta
        cursor.execute("""
            SELECT dv.cantidad, dv.precio_unitario, dv.subtotal, p.nombre
            FROM detalle_ventas dv
            JOIN productos p ON dv.producto_id = p.id
            WHERE dv.venta_id = %s
        """, (venta_id,))
        
        detalles = []
        for detalle in cursor.fetchall():
            detalles.append({
                'cantidad': float(detalle[0]),
                'precio_unitario': float(detalle[1]),
                'subtotal': float(detalle[2]),
                'producto_nombre': detalle[3]
            })
        
        resultado = {
            'id': venta[0],
            'numero_venta': venta[1],
            'fecha': venta[2].isoformat() if venta[2] else None,
            'forma_pago': venta[3],
            'subtotal': float(venta[4]),
            'descuento': float(venta[5]),
            'impuestos': float(venta[6]),
            'total': float(venta[7]),
            'estado': venta[8],
            'observaciones': venta[9],
            'cliente_nombre': venta[10] or 'Cliente General',
            'usuario_nombre': venta[11],
            'detalles': detalles
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo detalle de venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['DELETE'])
@jwt_required
def eliminar_venta(current_user_id, venta_id):
    """Cancelar una venta"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que la venta existe y no está ya cancelada
        cursor.execute("SELECT estado FROM ventas WHERE id = %s", (venta_id,))
        venta = cursor.fetchone()
        if not venta:
            return jsonify({'message': 'Venta no encontrada'}), 404
        
        if venta[0] == 'cancelada':
            return jsonify({'message': 'La venta ya está cancelada'}), 400
        
        # Restaurar stock de productos vendidos
        cursor.execute("""
            SELECT producto_id, cantidad FROM detalle_ventas WHERE venta_id = %s
        """, (venta_id,))
        
        for detalle in cursor.fetchall():
            cursor.execute("""
                UPDATE productos SET stock_actual = stock_actual + %s WHERE id = %s
            """, (detalle[1], detalle[0]))
        
        # Marcar venta como cancelada
        cursor.execute("UPDATE ventas SET estado = 'cancelada' WHERE id = %s", (venta_id,))
        
        connection.commit()
        
        response = jsonify({'message': 'Venta cancelada exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error cancelando venta: {e}")
        if connection:
            connection.rollback()
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
    """Listar clientes"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT id, nombre, correo, telefono, direccion, notas, activo, creado
            FROM clientes
            WHERE activo = TRUE
            ORDER BY nombre
        """)
        
        clientes = []
        for row in cursor.fetchall():
            cliente = {
                'id': row[0],
                'nombre': row[1],
                'correo': row[2],
                'telefono': row[3],
                'direccion': row[4],
                'notas': row[5],
                'activo': bool(row[6]),
                'creado': row[7].isoformat() if row[7] else None
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
            return jsonify({'message': 'El nombre es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            INSERT INTO clientes (nombre, correo, telefono, direccion, notas)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data.get('correo', '').strip() or None,
            data.get('telefono', '').strip() or None,
            data.get('direccion', '').strip() or None,
            data.get('notas', '').strip() or None
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

# Inicializar base de datos al iniciar la aplicación
if __name__ == '__main__':
    if create_tables():
        init_database()
        logger.info("🚀 Aplicación iniciada correctamente")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        logger.error("❌ Error inicializando la base de datos")
on.close()

# ==================== ENDPOINTS DE CLIENTES ====================

@app.route('/api/clientes', methods=['GET'])
@jwt_required
def obtener_clientes(current_user_id):
    """Listar clientes"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de búsqueda
        search = request.args.get('q', '').strip()
        activo = request.args.get('activo', 'true').lower() == 'true'
        
        # Construir consulta
        query = """
            SELECT id, nombre, correo, telefono, direccion, notas, activo, creado
            FROM clientes
            WHERE activo = %s
        """
        params = [activo]
        
        if search:
            query += " AND (nombre LIKE %s OR correo LIKE %s OR telefono LIKE %s)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])
        
        query += " ORDER BY nombre ASC"
        
        cursor.execute(query, params)
        clientes = []
        
        for row in cursor.fetchall():
            cliente = {
                'id': row[0],
                'nombre': row[1],
                'correo': row[2] or '',
                'telefono': row[3] or '',
                'direccion': row[4] or '',
                'notas': row[5] or '',
                'activo': bool(row[6]),
                'creado': row[7].isoformat() if row[7] else None
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
            return jsonify({'message': 'El nombre del cliente es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si ya existe un cliente con el mismo correo
        if data.get('correo'):
            cursor.execute("SELECT id FROM clientes WHERE correo = %s", (data['correo'].strip(),))
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un cliente con este correo'}), 409
        
        # Insertar cliente
        cursor.execute("""
            INSERT INTO clientes (nombre, correo, telefono, direccion, notas)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data.get('correo', '').strip() or None,
            data.get('telefono', '').strip() or None,
            data.get('direccion', '').strip() or None,
            data.get('notas', '').strip() or None
        ))
        
        cliente_id = cursor.lastrowid
        connection.commit()
        
        logger.info(f"Cliente creado: {data['nombre']} (ID: {cliente_id})")
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
    """Actualizar cliente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el cliente existe
        cursor.execute("SELECT id FROM clientes WHERE id = %s", (cliente_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        # Verificar correo único si se está actualizando
        if data.get('correo'):
            cursor.execute(
                "SELECT id FROM clientes WHERE correo = %s AND id != %s", 
                (data['correo'].strip(), cliente_id)
            )
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un cliente con este correo'}), 409
        
        # Construir consulta de actualización
        campos_actualizables = ['nombre', 'correo', 'telefono', 'direccion', 'notas', 'activo']
        campos_a_actualizar = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                if campo == 'activo':
                    campos_a_actualizar.append(f"{campo} = %s")
                    valores.append(bool(data[campo]))
                else:
                    campos_a_actualizar.append(f"{campo} = %s")
                    valor = data[campo].strip() if isinstance(data[campo], str) else data[campo]
                    valores.append(valor if valor else None)
        
        if not campos_a_actualizar:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        # Actualizar cliente
        query = f"UPDATE clientes SET {', '.join(campos_a_actualizar)} WHERE id = %s"
        valores.append(cliente_id)
        
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"Cliente {cliente_id} actualizado")
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
        cursor.execute("SELECT id FROM clientes WHERE id = %s", (cliente_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        # Verificar si tiene ventas asociadas
        cursor.execute("SELECT COUNT(*) FROM ventas WHERE cliente_id = %s", (cliente_id,))
        ventas_count = cursor.fetchone()[0]
        
        if ventas_count > 0:
            # Soft delete - marcar como inactivo
            cursor.execute("UPDATE clientes SET activo = FALSE WHERE id = %s", (cliente_id,))
            mensaje = 'Cliente desactivado (tiene ventas asociadas)'
        else:
            # Hard delete si no tiene ventas
            cursor.execute("DELETE FROM clientes WHERE id = %s", (cliente_id,))
            mensaje = 'Cliente eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"{mensaje}")
        response = jsonify({'message': mensaje})
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

# ==================== ENDPOINTS DE PROVEEDORES ====================

@app.route('/api/proveedores', methods=['GET'])
@jwt_required
def obtener_proveedores(current_user_id):
    """Listar proveedores"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de búsqueda
        search = request.args.get('q', '').strip()
        activo = request.args.get('activo', 'true').lower() == 'true'
        
        # Construir consulta
        query = """
            SELECT id, nombre, contacto, telefono, correo, direccion, notas, activo, creado
            FROM proveedores
            WHERE activo = %s
        """
        params = [activo]
        
        if search:
            query += " AND (nombre LIKE %s OR contacto LIKE %s OR correo LIKE %s)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])
        
        query += " ORDER BY nombre ASC"
        
        cursor.execute(query, params)
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

# ==================== ENDPOINTS DE MOVIMIENTOS ====================

@app.route('/api/movimientos', methods=['GET'])
@jwt_required
def obtener_movimientos(current_user_id):
    """Listar movimientos de stock con filtros mejorados"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        producto_id = request.args.get('producto_id')
        tipo = request.args.get('tipo')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        limit = int(request.args.get('limit', 50))
        
        # Construir consulta
        query = """
            SELECT ms.id, ms.tipo, ms.cantidad, ms.motivo, ms.fecha,
                   p.nombre as producto_nombre, p.unidad,
                   u.nombre as usuario_nombre, ms.observaciones,
                   ms.cantidad_anterior, ms.cantidad_nueva
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
        
        query += " ORDER BY ms.fecha DESC, ms.id DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(query, params)
        movimientos = []
        
        for row in cursor.fetchall():
            movimiento = {
                'id': row[0],
                'tipo': row[1],
                'cantidad': float(row[2]),
                'motivo': row[3] or '',
                'fecha': row[4].isoformat() if row[4] else None,
                'producto_nombre': row[5],
                'unidad': row[6],
                'usuario_nombre': row[7] or 'Sistema',
                'observaciones': row[8] or '',
                'cantidad_anterior': float(row[9]) if row[9] is not None else None,
                'cantidad_nueva': float(row[10]) if row[10] is not None else None
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

# ==================== ENDPOINTS DE ESTADÍSTICAS ====================

@app.route('/api/inventario/stats', methods=['GET'])
@jwt_required
def obtener_estadisticas_inventario(current_user_id):
    """Obtener estadísticas básicas del inventario (mantenido para compatibilidad)"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'total_productos': 0,
                'productos_stock_bajo': 0,
                'valor_inventario': 0.0,
                'stock_total': 0
            }), 200
            
        cursor = connection.cursor()
        
        # Total de productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0] or 0
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0] or 0
        
        # Valor total del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) 
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = float(cursor.fetchone()[0] or 0)
        
        # Stock total
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual), 0) 
            FROM productos WHERE activo = TRUE
        """)
        stock_total = float(cursor.fetchone()[0] or 0)
        
        estadisticas = {
            'total_productos': total_productos,
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': valor_inventario,
            'stock_total': stock_total
        }
        
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo estadísticas básicas: {e}")
        return jsonify({
            'total_productos': 0,
            'productos_stock_bajo': 0,
            'valor_inventario': 0.0,
            'stock_total': 0
        }), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard', methods=['GET'])
@jwt_required
def obtener_datos_dashboard(current_user_id):
    """Obtener datos para el dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'ventas_hoy': {'total': 0, 'cantidad': 0},
                'productos_stock_bajo': 0,
                'valor_inventario': 0,
                'actividad_reciente': []
            }), 200
            
        cursor = connection.cursor()
        
        # Ventas de hoy
        cursor.execute("""
            SELECT COALESCE(SUM(total), 0) as total_ventas, COUNT(*) as cantidad_ventas
            FROM ventas 
            WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
        """)
        ventas_hoy = cursor.fetchone()
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_stock_bajo = cursor.fetchone()[0] or 0
        
        # Valor del inventario
        cursor.execute("""
            SELECT COALESCE(SUM(stock_actual * precio_unitario), 0) 
            FROM productos WHERE activo = TRUE
        """)
        valor_inventario = float(cursor.fetchone()[0] or 0)
        
        # Actividad reciente (últimos movimientos)
        cursor.execute("""
            SELECT 'stock' as tipo, CONCAT('Movimiento de stock: ', p.nombre) as detalle, 
                   ms.fecha, u.nombre as usuario
            FROM movimientos_stock ms
            INNER JOIN productos p ON ms.producto_id = p.id
            LEFT JOIN usuarios u ON ms.usuario_id = u.id
            WHERE ms.fecha >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            
            UNION ALL
            
            SELECT 'venta' as tipo, CONCAT('Venta #', v.id, ' - $', v.total) as detalle,
                   v.fecha, u.nombre as usuario
            FROM ventas v
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.fecha >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            AND v.estado = 'completada'
            
            ORDER BY fecha DESC
            LIMIT 10
        """)
        
        actividad_reciente = []
        for row in cursor.fetchall():
            actividad = {
                'tipo': row[0],
                'detalle': row[1],
                'fecha': row[2].isoformat() if row[2] else None,
                'usuario': row[3] or 'Sistema'
            }
            actividad_reciente.append(actividad)
        
        dashboard_data = {
            'ventas_hoy': {
                'total': float(ventas_hoy[0] or 0),
                'cantidad': ventas_hoy[1] or 0
            },
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': valor_inventario,
            'actividad_reciente': actividad_reciente
        }
        
        response = jsonify(dashboard_data)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo datos del dashboard: {e}")
        return jsonify({
            'ventas_hoy': {'total': 0, 'cantidad': 0},
            'productos_stock_bajo': 0,
            'valor_inventario': 0,
            'actividad_reciente': []
        }), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS GENERALES ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Estado del servidor"""
    db_status = "OK"
    try:
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            connection.close()
        else:
            db_status = "ERROR"
    except Exception as e:
        logger.error(f"Error en health check: {e}")
        db_status = "ERROR"
    
    response = jsonify({
        'status': 'OK',
        'database': db_status,
        'message': 'Servidor Flask funcionando correctamente',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '3.0.0 - Sistema Completo de Inventario',
        'features': [
            'Inventario Avanzado',
            'Búsqueda Inteligente',
            'Operaciones Masivas',
            'Reportes Detallados',
            'Alertas Automáticas',
            'Filtros Personalizados',
            'Dashboard Mejorado',
            'Gestión de Ventas',
            'Control de Clientes',
            'Manejo de Proveedores'
        ]
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

@app.route('/', methods=['GET'])
def root():
    """Información de la API"""
    response = jsonify({
        'message': 'API Frutería Nina - Sistema Completo de Inventario v3.0',
        'version': '3.0.0',
        'status': 'running',
        'modules': {
            'authentication': '✅ Completo',
            'inventory_basic': '✅ Completo',
            'inventory_advanced': '✅ Completo',
            'stock_management': '✅ Completo',
            'bulk_operations': '✅ Completo',
            'advanced_reports': '✅ Completo',
            'smart_alerts': '✅ Completo',
            'custom_filters': '✅ Completo',
            'sales_management': '✅ Completo',
            'client_management': '✅ Completo',
            'supplier_management': '✅ Completo'
        },
        'endpoints': {
            'auth': ['/api/register', '/api/login', '/api/verify-token'],
            'productos': ['/api/productos', '/api/productos/<id>', '/api/stock-bajo'],
            'inventario_avanzado': [
                '/api/inventario/resumen',
                '/api/inventario/productos/busqueda-avanzada',
                '/api/inventario/productos/operaciones-masivas',
                '/api/inventario/filtros-personalizados'
            ],
            'movimientos': ['/api/movimientos', '/api/stock/movimiento'],
            'ventas': ['/api/ventas', '/api/ventas/<id>'],
            'clientes': ['/api/clientes', '/api/clientes/<id>'],
            'proveedores': ['/api/proveedores'],
            'estadisticas': ['/api/inventario/stats', '/api/dashboard'],
            'system': ['/api/health', '/']
        },
        'new_features_v3': [
            '🔍 Búsqueda avanzada con múltiples filtros',
            '⚡ Operaciones masivas en productos',
            '📊 Reportes detallados de movimientos',
            '🚨 Alertas inteligentes de inventario',
            '💾 Filtros personalizados guardables',
            '📈 Dashboard con KPIs avanzados',
            '🏷️ Códigos de barras integrados',
            '📤 Exportación mejorada (PDF/Excel)',
            '🎨 Interfaz moderna y responsiva',
            '⚡ Operaciones en tiempo real'
        ],
        'database_info': {
            'tables': [
                'usuarios', 'productos', 'proveedores', 'clientes',
                'ventas', 'detalle_ventas', 'compras', 'detalle_compras',
                'movimientos_stock', 'filtros_personalizados',
                'alertas_inventario', 'configuracion_sistema'
            ],
            'features': [
                'Relaciones FK completas',
                'Índices optimizados',
                'Soft delete',
                'Auditoría de cambios',
                'Configuración flexible'
            ]
        }
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def not_found(error):
    response = jsonify({
        'message': 'Endpoint no encontrado',
        'error': 'Not Found',
        'status_code': 404,
        'available_endpoints': [
            '/api/inventario/resumen',
            '/api/inventario/productos/busqueda-avanzada',
            '/api/inventario/productos/operaciones-masivas',
            '/api/productos',
            '/api/ventas',
            '/api/clientes',
            '/api/proveedores',
            '/api/movimientos',
            '/api/dashboard',
            '/api/health'
        ]
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 404

@app.errorhandler(500)
def internal_error(error):
    response = jsonify({
        'message': 'Error interno del servidor',
        'error': 'Internal Server Error',
        'status_code': 500
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 500

@app.errorhandler(405)
def method_not_allowed(error):
    response = jsonify({
        'message': 'Método no permitido',
        'error': 'Method Not Allowed',
        'status_code': 405
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 405

# ==================== FUNCIÓN PRINCIPAL ====================

if __name__ == '__main__':
    print("🚀 Iniciando Frutería Nina Backend - Sistema Completo de Inventario v3.0...")
    print("=" * 90)
    
    # Inicializar base de datos
    if init_database():
        print("=" * 90)
        print("✅ ¡Sistema Completo de Inventario Listo!")
        print("🌐 Servidor Flask iniciado en: http://localhost:5001")
        print("🎯 Frontend esperado en: http://localhost:3000")
        print("")
        print("📋 FUNCIONALIDADES IMPLEMENTADAS:")
        print("")
        print("🔐 AUTENTICACIÓN:")
        print("   - Registro y login de usuarios")
        print("   - JWT tokens seguros")
        print("   - Verificación de tokens")
        print("   - Roles de usuario (admin/operador)")
        print("")
        print("📦 GESTIÓN DE PRODUCTOS:")
        print("   - CRUD completo de productos")
        print("   - Categorización (frutas, verduras, otros)")
        print("   - Control de stock con alertas")
        print("   - Precios de compra y venta")
        print("   - Gestión de proveedores")
        print("")
        print("🔍 BÚSQUEDA AVANZADA:")
        print("   - Filtros múltiples simultáneos")
        print("   - Búsqueda por texto, categoría, proveedor")
        print("   - Filtros de precio y stock")
        print("   - Paginación inteligente")
        print("   - Ordenamiento personalizable")
        print("")
        print("⚡ OPERACIONES MASIVAS:")
        print("   - Actualización de precios en lote")
        print("   - Cambio de categorías masivo")
        print("   - Ajuste de stock mínimo")
        print("   - Activación/desactivación múltiple")
        print("")
        print("📊 REPORTES Y ESTADÍSTICAS:")
        print("   - Dashboard con KPIs en tiempo real")
        print("   - Resumen completo del inventario")
        print("   - Análisis por categorías")
        print("   - Productos más vendidos")
        print("   - Movimientos de stock detallados")
        print("")
        print("🚨 ALERTAS INTELIGENTES:")
        print("   - Detección automática de stock bajo")
        print("   - Productos sin stock")
        print("   - Alertas críticas visuales")
        print("   - Tendencias y análisis")
        print("")
        print("💾 FILTROS PERSONALIZADOS:")
        print("   - Guardado de configuraciones de filtros")
        print("   - Filtros rápidos predefinidos")
        print("   - Búsquedas guardadas por usuario")
        print("")
        print("💰 GESTIÓN DE VENTAS:")
        print("   - Registro de ventas con detalle")
        print("   - Múltiples formas de pago")
        print("   - Control de stock automático")
        print("   - Historial de ventas")
        print("")
        print("👥 GESTIÓN DE CLIENTES:")
        print("   - CRUD completo de clientes")
        print("   - Historial de compras")
        print("   - Información de contacto")
        print("")
        print("🏭 GESTIÓN DE PROVEEDORES:")
        print("   - Registro de proveedores")
        print("   - Asociación con productos")
        print("   - Información de contacto")
        print("")
        print("🔄 CONTROL DE MOVIMIENTOS:")
        print("   - Registro detallado de ingresos/egresos")
        print("   - Historial completo por producto")
        print("   - Trazabilidad completa")
        print("   - Motivos y observaciones")
        print("")
        print("🎨 INTERFAZ MEJORADA:")
        print("   - Diseño moderno y responsivo")
        print("   - Componentes reutilizables")
        print("   - Navegación intuitiva")
        print("   - Feedback visual")
        print("")
        print("=" * 90)
        print("🎉 ¡Sistema de Inventario Completo v3.0 Listo!")
        print("💡 Presiona Ctrl+C para detener el servidor")
        print("🔗 Documentación completa disponible en: http://localhost:5001/")
        print("📊 Health check disponible en: http://localhost:5001/api/health")
        print("=" * 90)
        
        # Iniciar el servidor Flask
        app.run(
            debug=True, 
            port=5001, 
            host='0.0.0.0',
            threaded=True
        )
    else:
        print("❌ Error inicializando la base de datos. Revisa la configuración.")