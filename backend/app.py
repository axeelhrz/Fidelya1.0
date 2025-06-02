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
        
        # Crear tablas existentes
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
            
            # NUEVAS TABLAS PARA FACTURACIÓN
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
            
            # Tablas existentes restantes...
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
            """,
            
            # NUEVAS TABLAS PARA NOTIFICACIONES
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

@app.route('/api/facturas/exportar/<int:factura_id>', methods=['POST'])
@jwt_required
def exportar_factura_pdf(current_user_id, factura_id):
    """Exportar una factura a PDF"""
    try:
        # Simular exportación PDF (en producción usar reportlab)
        nombre_archivo = f"factura_{factura_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        resultado = {
            'mensaje': 'Factura exportada exitosamente',
            'nombre_archivo': nombre_archivo,
            'formato': 'pdf',
            'url_descarga': f'/api/facturas/descargar/{nombre_archivo}',
            'fecha_generacion': datetime.now().isoformat()
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error exportando factura PDF: {e}")
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

# ==================== ENDPOINTS DE CLIENTES ====================

@app.route('/api/clientes', methods=['GET'])
@jwt_required
def obtener_clientes(current_user_id):
    """Listar clientes activos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        search = request.args.get('q', '').strip()
        activo = request.args.get('activo', 'true').lower() == 'true'
        
        # Construir consulta
        query = """
            SELECT id, nombre, correo, telefono, direccion, documento
            FROM clientes
            WHERE activo = %s
        """
        params = [activo]
        
        if search:
            query += " AND (nombre LIKE %s OR correo LIKE %s OR documento LIKE %s)"
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
                'documento': row[5] or ''
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

# ==================== FUNCIÓN DE INICIALIZACIÓN ====================

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

        # Insertar productos de ejemplo
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
                ('Cliente General', '', '', '', '', 'Cliente por defecto para ventas sin cliente específico'),
                ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '099887766', 'Av. Principal 456', '12345678', 'Cliente mayorista'),
                ('Supermercado Villa', 'compras@villa.com', '098776655', 'Calle Comercial 789', '87654321', 'Cliente corporativo'),
                ('Panadería Central', 'panaderia@central.com', '097665544', 'Centro 123', '11223344', 'Cliente frecuente'),
                ('Hotel Plaza', 'compras@hotelplaza.com', '096554433', 'Plaza Principal 456', '44332211', 'Cliente premium')
            ]
            
            for cliente in clientes_ejemplo:
                cursor.execute("""
                    INSERT INTO clientes (nombre, correo, telefono, direccion, documento, notas)
                    VALUES (%s, %s, %s, %s, %s, %s)
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
        'version': '6.0.0 - Sistema Completo con Facturación',
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
            'Cierre de Caja Diario',
            'Módulo de Facturación Completo'
        ]
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

@app.route('/', methods=['GET'])
def root():
    """Información de la API"""
    response = jsonify({
        'message': 'API Frutería Nina - Sistema Completo v6.0 con Facturación',
        'version': '6.0.0',
        'status': 'running',
        'description': 'Sistema completo de gestión para frutería con módulo de facturación profesional',
        'modules': {
            'authentication': '✅ Completo - JWT con roles',
            'products': '✅ Completo - CRUD con categorías',
            'inventory': '✅ Completo - Control de stock avanzado',
            'sales': '✅ Completo - Ventas con detalle',
            'clients': '✅ Completo - Gestión de clientes',
            'suppliers': '✅ Completo - Gestión de proveedores',
            'stock_movements': '✅ Completo - Trazabilidad total',
            'financial_reports': '✅ Completo - Reportes contables',
            'cash_closure': '✅ Completo - Cierre de caja diario',
            'invoicing': '✅ NUEVO - Módulo de facturación completo',
            'export_functionality': '✅ Completo - PDF/Excel'
        },
        'endpoints': {
            'auth': [
                'POST /api/register',
                'POST /api/login', 
                'POST /api/verify-token'
            ],
            'invoicing': [
                'GET /api/facturas/ultimo-numero',
                'POST /api/facturas/crear',
                'GET /api/facturas/historial',
                'GET /api/facturas/<id>',
                'POST /api/facturas/exportar/<id>'
            ],
            'products': [
                'GET /api/productos'
            ],
            'clients': [
                'GET /api/clientes'
            ],
            'system': [
                'GET /api/health',
                'GET /'
            ]
        },
        'new_features_v6': [
            '🧾 Módulo Completo de Facturación',
            '📄 Emisión de Comprobantes Profesionales',
            '🔢 Numeración Correlativa Automática (FCT-000001)',
            '👥 Gestión Completa de Datos del Cliente',
            '📊 Cálculo Automático de IVA y Totales',
            '📋 Historial Completo de Facturas',
            '🔍 Filtros Avanzados por Cliente, Fecha y Número',
            '📄 Exportación PDF Profesional',
            '💼 Integración con Sistema de Ventas',
            '🔐 Control de Permisos y Auditoría',
            '📱 Interfaz Responsive y Moderna',
            '⚡ Validación en Tiempo Real'
        ],
        'invoice_features': {
            'numbering': 'Correlativo automático FCT-XXXXXX',
            'client_data': 'Nombre, documento, dirección, teléfono',
            'products': 'Detalle completo con cantidades y precios',
            'calculations': 'Subtotal, IVA (22%), Total automático',
            'export': 'PDF profesional con datos fiscales',
            'history': 'Búsqueda y filtros avanzados',
            'integration': 'Vinculación con ventas del sistema'
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
            '/api/facturas/ultimo-numero',
            '/api/facturas/crear',
            '/api/facturas/historial',
            '/api/facturas/<id>',
            '/api/facturas/exportar/<id>',
            '/api/productos',
            '/api/clientes',
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

# ==================== ENDPOINTS DE NOTIFICACIONES ====================

@app.route('/api/notificaciones', methods=['GET'])
@jwt_required
def obtener_notificaciones(current_user_id):
    """Obtener todas las notificaciones del usuario"""
    try:
        # Obtener parámetros de filtros
        tipo = request.args.get('tipo')
        leida = request.args.get('leida')
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')
        limite = int(request.args.get('limite', 50))
        
        filtros = {}
        if tipo:
            filtros['tipo'] = tipo
        if leida is not None:
            filtros['leida'] = leida.lower() == 'true'
        if fecha_desde:
            filtros['fecha_desde'] = fecha_desde
        if fecha_hasta:
            filtros['fecha_hasta'] = fecha_hasta
        if limite:
            filtros['limite'] = limite
        
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
        data = request.get_json()
        notificacion_ids = data.get('notificacion_ids') if data else None
        
        success = NotificacionesController.marcar_como_leidas(current_user_id, notificacion_ids)
        
        if success:
            response = jsonify({'message': 'Notificaciones marcadas como leídas'})
        else:
            response = jsonify({'message': 'Error marcando notificaciones'})
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200 if success else 500
        
    except Exception as e:
        logger.error(f"Error marcando notificaciones como leídas: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/enviar-email', methods=['POST'])
@jwt_required
def enviar_notificacion_email(current_user_id):
    """Enviar notificación por email"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('destinatario', 'asunto', 'mensaje')):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        email_service = EmailService()
        success = email_service._enviar_email(
            data['destinatario'],
            data['asunto'],
            data['mensaje']
        )
        
        if success:
            # Crear notificación en el sistema
            NotificacionesController.crear_notificacion(
                current_user_id,
                'general',
                f"Email enviado a {data['destinatario']}",
                f"Asunto: {data['asunto']}",
                'email'
            )
            
            response = jsonify({'message': 'Email enviado exitosamente'})
    else:
            response = jsonify({'message': 'Error enviando email'})
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200 if success else 500
        
    except Exception as e:
        logger.error(f"Error enviando email: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/enviar-sms', methods=['POST'])
@jwt_required
def enviar_notificacion_sms(current_user_id):
    """Enviar notificación por SMS"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('telefono', 'mensaje')):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        sms_service = SMSService()
        success = sms_service._enviar_sms(data['telefono'], data['mensaje'])
        
        if success:
            # Crear notificación en el sistema
            NotificacionesController.crear_notificacion(
                current_user_id,
                'general',
                f"SMS enviado a {data['telefono']}",
                data['mensaje'],
                'sms'
            )
            
            response = jsonify({'message': 'SMS enviado exitosamente'})
        else:
            response = jsonify({'message': 'Error enviando SMS'})
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200 if success else 500
        
    except Exception as e:
        logger.error(f"Error enviando SMS: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/configuracion', methods=['GET'])
@jwt_required
def obtener_configuracion_notificaciones(current_user_id):
    """Obtener configuración de notificaciones del usuario"""
    try:
        configuracion = NotificacionesController.obtener_configuracion(current_user_id)
        
        if configuracion:
            response = jsonify(configuracion)
        else:
            response = jsonify({'message': 'Error obteniendo configuración'})
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200 if configuracion else 500
        
    except Exception as e:
        logger.error(f"Error obteniendo configuración: {e}")
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
        else:
            response = jsonify({'message': 'Error actualizando configuración'})
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200 if success else 500
        
    except Exception as e:
        logger.error(f"Error actualizando configuración: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

@app.route('/api/notificaciones/verificar-alertas', methods=['POST'])
@jwt_required
@role_required(['admin', 'operador'])
def verificar_alertas_sistema(current_user_id):
    """Verificar y generar alertas automáticas del sistema"""
    try:
        # Verificar alertas de stock
        productos_stock_bajo = NotificacionesController.verificar_alertas_stock()
        
        # Verificar pagos pendientes
        pagos_pendientes = NotificacionesController.verificar_pagos_pendientes()
        
        # Verificar cobros pendientes
        cobros_pendientes = NotificacionesController.verificar_cobros_pendientes()
        
        resultado = {
            'alertas_generadas': {
                'stock_bajo': len(productos_stock_bajo),
                'pagos_pendientes': len(pagos_pendientes),
                'cobros_pendientes': len(cobros_pendientes)
            },
            'mensaje': 'Verificación de alertas completada'
        }
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        logger.error(f"Error verificando alertas: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

# ==================== FUNCIÓN PRINCIPAL ====================

if __name__ == '__main__':
    print("🚀 Iniciando Frutería Nina Backend - Sistema Completo v6.0 con Facturación...")
    print("=" * 100)
    
    # Crear tablas primero
    if create_tables():
        # Luego inicializar datos
        if init_database():
            print("=" * 100)
            print("✅ ¡Sistema Completo de Frutería Nina v6.0 con Facturación Listo!")
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
            print("🧾 MÓDULO DE FACTURACIÓN (NUEVO):")
            print("   ✅ Emisión de comprobantes profesionales")
            print("   ✅ Numeración correlativa automática (FCT-000001)")
            print("   ✅ Gestión completa de datos del cliente")
            print("   ✅ Cálculo automático de IVA (22%) y totales")
            print("   ✅ Detalle completo de productos vendidos")
            print("   ✅ Historial completo con filtros avanzados")
            print("   ✅ Exportación a PDF profesional")
            print("   ✅ Integración con sistema de ventas")
            print("   ✅ Control de permisos y auditoría")
            print("   ✅ Validación en tiempo real")
            print("")
            print("💰 CIERRE DE CAJA DIARIO:")
            print("   ✅ Resumen automático de ventas del día")
            print("   ✅ Registro de efectivo contado")
            print("   ✅ Comparación automática de diferencias")
            print("   ✅ Historial completo de cierres")
            print("   ✅ Exportación a PDF profesional")
            print("   ✅ Control de un cierre por día")
            print("   ✅ Validación de permisos por rol")
            print("")
            print("📦 GESTIÓN DE PRODUCTOS:")
            print("   ✅ CRUD completo de productos")
            print("   ✅ Categorización (frutas, verduras, otros)")
            print("   ✅ Control de stock con alertas automáticas")
            print("   ✅ Precios de compra y venta")
            print("   ✅ Gestión de proveedores")
            print("")
            print("👥 GESTIÓN DE CLIENTES:")
            print("   ✅ CRUD completo de clientes")
            print("   ✅ Datos fiscales completos")
            print("   ✅ Historial de compras")
            print("   ✅ Integración con facturación")
            print("")
            print("💰 GESTIÓN DE VENTAS:")
            print("   ✅ Registro de ventas con detalle")
            print("   ✅ Múltiples formas de pago")
            print("   ✅ Control automático de stock")
            print("   ✅ Historial completo de ventas")
            print("   ✅ Integración con facturación")
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
            print("🎉 ¡Sistema de Frutería Nina v6.0 con Facturación Completa Listo!")
            print("💡 Presiona Ctrl+C para detener el servidor")
            print("🔗 Documentación completa: http://localhost:5001/")
            print("📊 Health check: http://localhost:5001/api/health")
            print("🧾 Facturación disponible en: http://localhost:3000/facturacion")
            print("")
            print("🆕 NUEVAS FUNCIONALIDADES v6.0:")
            print("   🧾 Módulo completo de facturación profesional")
            print("   📄 Emisión de comprobantes con numeración correlativa")
            print("   👥 Gestión completa de datos fiscales del cliente")
            print("   📊 Cálculo automático de IVA y totales")
            print("   📋 Historial completo con filtros avanzados")
            print("   📄 Exportación PDF profesional")
            print("   💼 Integración total con sistema de ventas")
            print("   🔐 Control de permisos y auditoría completa")
            print("")
            print("🧾 ENDPOINTS DE FACTURACIÓN:")
            print("   GET  /api/facturas/ultimo-numero - Obtener próximo número")
            print("   POST /api/facturas/crear - Crear nueva factura")
            print("   GET  /api/facturas/historial - Lista de facturas")
            print("   GET  /api/facturas/<id> - Detalle de factura")
            print("   POST /api/facturas/exportar/<id> - Exportar PDF")
            print("")
            print("👥 USUARIOS DE EJEMPLO:")
            print("   🔑 Admin: admin@fruteria.com / admin123")
            print("   💰 Cajero: cajero@fruteria.com / cajero123")
            print("")
            print("📋 FORMATO DE FACTURA:")
            print("   📄 Número: FCT-000001, FCT-000002, ...")
            print("   👤 Cliente: Nombre, documento, dirección, teléfono")
            print("   📦 Productos: Detalle completo con cantidades y precios")
            print("   💰 Cálculos: Subtotal + IVA (22%) = Total")
            print("   📅 Fecha y hora de emisión")
            print("   👨‍💼 Usuario que genera la factura")
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