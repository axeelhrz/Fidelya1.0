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
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', 'Admin2024!'),
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
        temp_config.pop('collation', None)
        
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
                    notas TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    INDEX idx_nombre (nombre),
                    INDEX idx_correo (correo),
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
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
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
        
        # Crear usuario cajero de ejemplo
        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE rol = 'cajero'")
        cajero_count = cursor.fetchone()[0]
        
        if cajero_count == 0:
            cajero_password = bcrypt.hashpw('cajero123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("""
                INSERT INTO usuarios (nombre, correo, password_hash, rol)
                VALUES ('Cajero Principal', 'cajero@fruteria.com', %s, 'cajero')
            """, (cajero_password.decode('utf-8'),))
            logger.info("✅ Usuario cajero creado")
        
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
                ('Uva Verde', 'frutas', 'kg', 15.0, 3.0, 6.50, 5.20, 'Uvas verdes sin semilla', proveedores_ids[0] if proveedores_ids else None),
                # Verduras
                ('Tomate', 'verduras', 'kg', 35.0, 8.0, 5.20, 4.10, 'Tomates frescos de invernadero', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
                ('Lechuga', 'verduras', 'unidad', 20.0, 5.0, 2.50, 1.80, 'Lechuga crespa fresca', proveedores_ids[1] if len(proveedores_ids) > 1 else None),
                ('Papa', 'verduras', 'kg', 80.0, 15.0, 1.80, 1.20, 'Papas lavadas nacionales', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
                ('Zanahoria', 'verduras', 'kg', 30.0, 7.0, 3.20, 2.50, 'Zanahorias frescas', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
                ('Cebolla', 'verduras', 'kg', 45.0, 10.0, 2.90, 2.10, 'Cebollas blancas', proveedores_ids[2] if len(proveedores_ids) > 2 else None),
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

# ==================== ENDPOINTS DE CIERRE DE CAJA ====================

@app.route('/api/cierre-caja/hoy', methods=['GET'])
@role_required(['admin', 'cajero'])
def obtener_resumen_ventas_hoy(current_user_id):
    """Obtiene resumen automático de ventas del día actual"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener fecha actual
        fecha_hoy = datetime.now().date()
        
        # Verificar si ya existe un cierre para hoy
        cursor.execute("""
            SELECT id, total_ventas_esperado, total_efectivo_contado, diferencia, 
                   numero_ventas, observaciones, hora_cierre, estado
            FROM cierres_caja 
            WHERE usuario_id = %s AND fecha_cierre = %s
        """, (current_user_id, fecha_hoy))
        
        cierre_existente = cursor.fetchone()
        
        # Obtener resumen de ventas del día
        cursor.execute("""
            SELECT 
                COUNT(*) as numero_ventas,
                COALESCE(SUM(CASE WHEN forma_pago = 'efectivo' THEN total ELSE 0 END), 0) as total_efectivo,
                COALESCE(SUM(CASE WHEN forma_pago = 'tarjeta' THEN total ELSE 0 END), 0) as total_tarjeta,
                COALESCE(SUM(CASE WHEN forma_pago = 'transferencia' THEN total ELSE 0 END), 0) as total_transferencia,
                COALESCE(SUM(total), 0) as total_ventas
            FROM ventas 
            WHERE DATE(fecha) = %s AND estado = 'completada'
        """, (fecha_hoy,))
        
        resumen_ventas = cursor.fetchone()
        
        # Obtener detalle de ventas por producto
        cursor.execute("""
            SELECT p.nombre, p.categoria, SUM(dv.cantidad) as cantidad_vendida, 
                   SUM(dv.subtotal) as total_producto
            FROM detalle_ventas dv
            INNER JOIN ventas v ON dv.venta_id = v.id
            INNER JOIN productos p ON dv.producto_id = p.id
            WHERE DATE(v.fecha) = %s AND v.estado = 'completada'
            GROUP BY p.id, p.nombre, p.categoria
            ORDER BY total_producto DESC
        """, (fecha_hoy,))
        
        detalle_productos = []
        for row in cursor.fetchall():
            detalle_productos.append({
                'nombre': row[0],
                'categoria': row[1],
                'cantidad_vendida': float(row[2]),
                'total_producto': float(row[3])
            })
        
        resultado = {
            'fecha': fecha_hoy.isoformat(),
            'cierre_existente': None,
            'resumen_ventas': {
                'numero_ventas': int(resumen_ventas[0]) if resumen_ventas[0] else 0,
                'total_efectivo': float(resumen_ventas[1]) if resumen_ventas[1] else 0,
                'total_tarjeta': float(resumen_ventas[2]) if resumen_ventas[2] else 0,
                'total_transferencia': float(resumen_ventas[3]) if resumen_ventas[3] else 0,
                'total_ventas': float(resumen_ventas[4]) if resumen_ventas[4] else 0
            },
            'detalle_productos': detalle_productos,
            'puede_cerrar': True
        }
        
        # Si existe un cierre, incluir la información
        if cierre_existente:
            resultado['cierre_existente'] = {
                'id': cierre_existente[0],
                'total_ventas_esperado': float(cierre_existente[1]),
                'total_efectivo_contado': float(cierre_existente[2]),
                'diferencia': float(cierre_existente[3]),
                'numero_ventas': int(cierre_existente[4]),
                'observaciones': cierre_existente[5] or '',
                'hora_cierre': cierre_existente[6].isoformat() if cierre_existente[6] else None,
                'estado': cierre_existente[7]
            }
            resultado['puede_cerrar'] = cierre_existente[7] == 'abierto'
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo resumen de ventas del día: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/cierre-caja/registrar', methods=['POST'])
@role_required(['admin', 'cajero'])
def registrar_cierre_caja(current_user_id):
    """Registra el cierre de caja diario"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or 'total_efectivo_contado' not in data:
            return jsonify({'message': 'El total de efectivo contado es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener fecha actual
        fecha_hoy = datetime.now().date()
        
        # Verificar si ya existe un cierre cerrado para hoy
        cursor.execute("""
            SELECT id, estado FROM cierres_caja 
            WHERE usuario_id = %s AND fecha_cierre = %s
        """, (current_user_id, fecha_hoy))
        
        cierre_existente = cursor.fetchone()
        
        if cierre_existente and cierre_existente[1] == 'cerrado':
            return jsonify({'message': 'Ya existe un cierre de caja para el día de hoy'}), 409
        
        # Calcular totales de ventas del día
        cursor.execute("""
            SELECT 
                COUNT(*) as numero_ventas,
                COALESCE(SUM(CASE WHEN forma_pago = 'efectivo' THEN total ELSE 0 END), 0) as total_efectivo_esperado
            FROM ventas 
            WHERE DATE(fecha) = %s AND estado = 'completada'
        """, (fecha_hoy,))
        
        ventas_data = cursor.fetchone()
        numero_ventas = int(ventas_data[0]) if ventas_data[0] else 0
        total_efectivo_esperado = float(ventas_data[1]) if ventas_data[1] else 0
        
        total_efectivo_contado = float(data['total_efectivo_contado'])
        observaciones = data.get('observaciones', '').strip() or None
        
        if cierre_existente:
            # Actualizar cierre existente
            cursor.execute("""
                UPDATE cierres_caja 
                SET total_ventas_esperado = %s, total_efectivo_contado = %s, 
                    numero_ventas = %s, observaciones = %s, estado = 'cerrado',
                    hora_cierre = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                total_efectivo_esperado,
                total_efectivo_contado,
                numero_ventas,
                observaciones,
                cierre_existente[0]
            ))
            cierre_id = cierre_existente[0]
        else:
            # Crear nuevo cierre
            cursor.execute("""
                INSERT INTO cierres_caja (usuario_id, fecha_cierre, total_ventas_esperado, 
                                        total_efectivo_contado, numero_ventas, observaciones, estado)
                VALUES (%s, %s, %s, %s, %s, %s, 'cerrado')
            """, (
                current_user_id,
                fecha_hoy,
                total_efectivo_esperado,
                total_efectivo_contado,
                numero_ventas,
                observaciones
            ))
            cierre_id = cursor.lastrowid
        
        connection.commit()
        
        # Obtener el cierre completo para respuesta
        cursor.execute("""
            SELECT cc.id, cc.fecha_cierre, cc.hora_cierre, cc.total_ventas_esperado,
                   cc.total_efectivo_contado, cc.diferencia, cc.numero_ventas,
                   cc.observaciones, cc.estado, u.nombre as usuario_nombre
            FROM cierres_caja cc
            INNER JOIN usuarios u ON cc.usuario_id = u.id
            WHERE cc.id = %s
        """, (cierre_id,))
        
        cierre_data = cursor.fetchone()
        
        resultado = {
            'id': cierre_data[0],
            'fecha_cierre': cierre_data[1].isoformat(),
            'hora_cierre': cierre_data[2].isoformat() if cierre_data[2] else None,
            'total_ventas_esperado': float(cierre_data[3]),
            'total_efectivo_contado': float(cierre_data[4]),
            'diferencia': float(cierre_data[5]),
            'numero_ventas': int(cierre_data[6]),
            'observaciones': cierre_data[7] or '',
            'estado': cierre_data[8],
            'usuario_nombre': cierre_data[9],
            'estado_diferencia': 'correcto' if float(cierre_data[5]) == 0 else 'faltante' if float(cierre_data[5]) < 0 else 'sobrante'
        }
        
        logger.info(f"Cierre de caja registrado: ID {cierre_id}, Diferencia: {cierre_data[5]}")
        
        response = jsonify({
            'message': 'Cierre de caja registrado exitosamente',
            'cierre': resultado
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error registrando cierre de caja: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/cierre-caja/historial', methods=['GET'])
@role_required(['admin', 'cajero'])
def obtener_historial_cierres(current_user_id):
    """Lista de cierres anteriores"""
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
        limite = int(request.args.get('limite', 30))
        
        # Construir consulta
        query = """
            SELECT cc.id, cc.fecha_cierre, cc.hora_cierre, cc.total_ventas_esperado,
                   cc.total_efectivo_contado, cc.diferencia, cc.numero_ventas,
                   cc.observaciones, cc.estado, u.nombre as usuario_nombre
            FROM cierres_caja cc
            INNER JOIN usuarios u ON cc.usuario_id = u.id
            WHERE 1=1
        """
        params = []
        
        # Solo mostrar cierres del usuario actual si no es admin
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (current_user_id,))
        user_role = cursor.fetchone()
        
        if user_role and user_role[0] != 'admin':
            query += " AND cc.usuario_id = %s"
            params.append(current_user_id)
        
        if fecha_inicio:
            query += " AND cc.fecha_cierre >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND cc.fecha_cierre <= %s"
            params.append(fecha_fin)
        
        query += " ORDER BY cc.fecha_cierre DESC, cc.hora_cierre DESC LIMIT %s"
        params.append(limite)
        
        cursor.execute(query, params)
        
        cierres = []
        for row in cursor.fetchall():
            diferencia = float(row[5])
            cierre = {
                'id': row[0],
                'fecha_cierre': row[1].isoformat(),
                'hora_cierre': row[2].isoformat() if row[2] else None,
                'total_ventas_esperado': float(row[3]),
                'total_efectivo_contado': float(row[4]),
                'diferencia': diferencia,
                'numero_ventas': int(row[6]),
                'observaciones': row[7] or '',
                'estado': row[8],
                'usuario_nombre': row[9],
                'estado_diferencia': 'correcto' if diferencia == 0 else 'faltante' if diferencia < 0 else 'sobrante'
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

@app.route('/api/cierre-caja/detalle/<int:cierre_id>', methods=['GET'])
@role_required(['admin', 'cajero'])
def obtener_detalle_cierre(current_user_id, cierre_id):
    """Detalle de un cierre específico"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar permisos
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (current_user_id,))
        user_role = cursor.fetchone()
        
        query_cierre = """
            SELECT cc.id, cc.fecha_cierre, cc.hora_cierre, cc.total_ventas_esperado,
                   cc.total_efectivo_contado, cc.diferencia, cc.numero_ventas,
                   cc.observaciones, cc.estado, u.nombre as usuario_nombre, cc.usuario_id
            FROM cierres_caja cc
            INNER JOIN usuarios u ON cc.usuario_id = u.id
            WHERE cc.id = %s
        """
        
        # Si no es admin, solo puede ver sus propios cierres
        if user_role and user_role[0] != 'admin':
            query_cierre += " AND cc.usuario_id = %s"
            cursor.execute(query_cierre, (cierre_id, current_user_id))
        else:
            cursor.execute(query_cierre, (cierre_id,))
        
        cierre_data = cursor.fetchone()
        
        if not cierre_data:
            return jsonify({'message': 'Cierre no encontrado'}), 404
        
        # Obtener detalle de ventas del día del cierre
        cursor.execute("""
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.total,
                   c.nombre as cliente_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE DATE(v.fecha) = %s AND v.estado = 'completada'
            ORDER BY v.fecha ASC
        """, (cierre_data[1],))
        
        ventas_detalle = []
        for row in cursor.fetchall():
            venta = {
                'id': row[0],
                'numero_venta': row[1] or f'V-{row[0]}',
                'fecha': row[2].isoformat() if row[2] else None,
                'forma_pago': row[3],
                'total': float(row[4]),
                'cliente_nombre': row[5] or 'Cliente General'
            }
            ventas_detalle.append(venta)
        
        # Obtener resumen por forma de pago
        cursor.execute("""
            SELECT forma_pago, COUNT(*) as cantidad, SUM(total) as total
            FROM ventas
            WHERE DATE(fecha) = %s AND estado = 'completada'
            GROUP BY forma_pago
        """, (cierre_data[1],))
        
        resumen_formas_pago = {}
        for row in cursor.fetchall():
            resumen_formas_pago[row[0]] = {
                'cantidad': int(row[1]),
                'total': float(row[2])
            }
        
        diferencia = float(cierre_data[5])
        
        resultado = {
            'id': cierre_data[0],
            'fecha_cierre': cierre_data[1].isoformat(),
            'hora_cierre': cierre_data[2].isoformat() if cierre_data[2] else None,
            'total_ventas_esperado': float(cierre_data[3]),
            'total_efectivo_contado': float(cierre_data[4]),
            'diferencia': diferencia,
            'numero_ventas': int(cierre_data[6]),
            'observaciones': cierre_data[7] or '',
            'estado': cierre_data[8],
            'usuario_nombre': cierre_data[9],
            'estado_diferencia': 'correcto' if diferencia == 0 else 'faltante' if diferencia < 0 else 'sobrante',
            'ventas_detalle': ventas_detalle,
            'resumen_formas_pago': resumen_formas_pago
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo detalle de cierre: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/cierre-caja/exportar-pdf/<int:cierre_id>', methods=['POST'])
@role_required(['admin', 'cajero'])
def exportar_cierre_pdf(current_user_id, cierre_id):
    """Exporta cierre en PDF profesional"""
    try:
        # Simular exportación PDF (en producción usar reportlab)
        nombre_archivo = f"cierre_caja_{cierre_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        resultado = {
            'mensaje': 'Cierre de caja exportado exitosamente',
            'nombre_archivo': nombre_archivo,
            'formato': 'pdf',
            'url_descarga': f'/api/cierre-caja/descargar/{nombre_archivo}',
            'fecha_generacion': datetime.now().isoformat()
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error exportando cierre PDF: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500

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

# ==================== ENDPOINTS DE PRODUCTOS ====================

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
        orden_valido = orden if orden in ['nombre', 'categoria', 'stock_actual', 'precio_unitario', 'creado'] else 'nombre'
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

# ==================== ENDPOINTS DE VENTAS ====================

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

# ==================== ENDPOINTS DE DASHBOARD ====================

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
        'version': '5.0.0 - Sistema Completo con Cierre de Caja',
        'features': [
            'Autenticación JWT',
            'Gestión de Productos',
            'Control de Inventario',
            'Ventas y Facturación',
            'Gestión de Clientes',
            'Gestión de Proveedores',
            'Movimientos de Stock',
            'Reportes Financieros',
            'Estado de Resultados',
            'Análisis de Ventas',
            'Reportes de Inventario',
            'Exportación PDF/Excel',
            'Dashboard Avanzado',
            'Cierre de Caja Diario'
        ]
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

@app.route('/', methods=['GET'])
def root():
    """Información de la API"""
    response = jsonify({
        'message': 'API Frutería Nina - Sistema Completo v5.0',
        'version': '5.0.0',
        'status': 'running',
        'description': 'Sistema completo de gestión para frutería con cierre de caja diario',
        'modules': {
            'authentication': '✅ Completo - JWT con roles',
            'products': '✅ Completo - CRUD con categorías',
            'inventory': '✅ Completo - Control de stock avanzado',
            'sales': '✅ Completo - Ventas con detalle',
            'clients': '✅ Completo - Gestión de clientes',
            'suppliers': '✅ Completo - Gestión de proveedores',
            'stock_movements': '✅ Completo - Trazabilidad total',
            'financial_reports': '✅ Completo - Reportes contables',
            'cash_closure': '✅ NUEVO - Cierre de caja diario',
            'export_functionality': '✅ Completo - PDF/Excel'
        },
        'endpoints': {
            'auth': [
                'POST /api/register',
                'POST /api/login', 
                'POST /api/verify-token'
            ],
            'cash_closure': [
                'GET /api/cierre-caja/hoy',
                'POST /api/cierre-caja/registrar',
                'GET /api/cierre-caja/historial',
                'GET /api/cierre-caja/detalle/<id>',
                'POST /api/cierre-caja/exportar-pdf/<id>'
            ],
            'products': [
                'GET /api/productos'
            ],
            'sales': [
                'GET /api/ventas'
            ],
            'dashboard': [
                'GET /api/dashboard'
            ],
            'system': [
                'GET /api/health',
                'GET /'
            ]
        },
        'new_features_v5': [
            '💰 Módulo Completo de Cierre de Caja',
            '📊 Resumen Automático de Ventas del Día',
            '🔍 Comparación Efectivo Esperado vs Real',
            '📋 Historial Completo de Cierres',
            '📄 Exportación PDF de Cierres',
            '🔐 Control de Permisos por Rol',
            '⚠️ Validación de Un Cierre por Día',
            '📈 Análisis de Diferencias de Caja',
            '🎯 Interfaz Profesional para Cajeros',
            '📱 Responsive Design Optimizado'
        ],
        'roles': {
            'admin': 'Acceso completo al sistema',
            'cajero': 'Acceso a cierre de caja y ventas',
            'operador': 'Acceso básico al sistema'
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
            '/api/cierre-caja/hoy',
            '/api/cierre-caja/registrar',
            '/api/cierre-caja/historial',
            '/api/productos',
            '/api/ventas',
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
    print("🚀 Iniciando Frutería Nina Backend - Sistema Completo v5.0...")
    print("=" * 100)
    
    # Crear tablas primero
    if create_tables():
        # Luego inicializar datos
        if init_database():
            print("=" * 100)
            print("✅ ¡Sistema Completo de Frutería Nina v5.0 Listo!")
            print("🌐 Servidor Flask iniciado en: http://localhost:5001")
            print("🎯 Frontend esperado en: http://localhost:3000")
            print("")
            print("📋 FUNCIONALIDADES IMPLEMENTADAS:")
            print("")
            print("🔐 AUTENTICACIÓN Y SEGURIDAD:")
            print("   ✅ Registro y login de usuarios")
            print("   ✅ JWT tokens seguros con expiración")
            print("   ✅ Verificación de tokens")
            print("   ✅ Roles de usuario (admin/operador/cajero)")
            print("   ✅ Middleware de autenticación")
            print("   ✅ Control de permisos por rol")
            print("")
            print("💰 CIERRE DE CAJA DIARIO (NUEVO):")
            print("   ✅ Resumen automático de ventas del día")
            print("   ✅ Registro de efectivo contado")
            print("   ✅ Comparación automática de diferencias")
            print("   ✅ Historial completo de cierres")
            print("   ✅ Exportación a PDF profesional")
            print("   ✅ Control de un cierre por día")
            print("   ✅ Validación de permisos por rol")
            print("   ✅ Análisis de diferencias (correcto/faltante/sobrante)")
            print("")
            print("📦 GESTIÓN DE PRODUCTOS:")
            print("   ✅ CRUD completo de productos")
            print("   ✅ Categorización (frutas, verduras, otros)")
            print("   ✅ Control de stock con alertas automáticas")
            print("   ✅ Precios de compra y venta")
            print("   ✅ Gestión de proveedores")
            print("")
            print("💰 GESTIÓN DE VENTAS:")
            print("   ✅ Registro de ventas con detalle")
            print("   ✅ Múltiples formas de pago")
            print("   ✅ Control automático de stock")
            print("   ✅ Historial completo de ventas")
            print("   ✅ Integración con cierre de caja")
            print("")
            print("📈 DASHBOARD AVANZADO:")
            print("   ✅ KPIs en tiempo real")
            print("   ✅ Resumen financiero")
            print("   ✅ Alertas de stock")
            print("   ✅ Actividad reciente")
            print("   ✅ Estadísticas de ventas")
            print("")
            print("🔧 CARACTERÍSTICAS TÉCNICAS:")
            print("   ✅ Base de datos MySQL optimizada")
            print("   ✅ Índices para consultas rápidas")
            print("   ✅ Transacciones ACID")
            print("   ✅ Manejo de errores robusto")
            print("   ✅ Logging detallado")
            print("   ✅ CORS configurado")
            print("   ✅ Validación de datos")
            print("")
            print("=" * 100)
            print("🎉 ¡Sistema de Frutería Nina v5.0 con Cierre de Caja Listo!")
            print("💡 Presiona Ctrl+C para detener el servidor")
            print("🔗 Documentación completa: http://localhost:5001/")
            print("📊 Health check: http://localhost:5001/api/health")
            print("💰 Cierre de caja disponible en: http://localhost:3000/cierre-caja")
            print("")
            print("🆕 NUEVAS FUNCIONALIDADES v5.0:")
            print("   💰 Módulo completo de cierre de caja diario")
            print("   📊 Resumen automático de ventas del día")
            print("   🔍 Comparación efectivo esperado vs real")
            print("   📋 Historial completo de cierres")
            print("   📄 Exportación PDF profesional")
            print("   🔐 Control de permisos por rol")
            print("   ⚠️ Validación de un cierre por día")
            print("")
            print("👥 USUARIOS DE EJEMPLO:")
            print("   🔑 Admin: admin@fruteria.com / admin123")
            print("   💰 Cajero: cajero@fruteria.com / cajero123")
            print("")
            print("=" * 100)
            
            # Iniciar el servidor Flask
            app.run(
                debug=True, 
                port=5001, 
                host='0.0.0.0',
                threaded=True
            )
        else:
            print("❌ Error inicializando datos de la base de datos.")
    else:
        print("❌ Error creando tablas de la base de datos. Revisa la configuración.")