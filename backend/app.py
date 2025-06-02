from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from functools import wraps
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuración CORS
CORS(app, 
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True
)

# Configuración
app.config['SECRET_KEY'] = 'tu_clave_secreta_muy_segura_para_jwt'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'fruteria_user',
    'password': 'fruteria_password_123',
    'database': 'fruteria_nina',
    'charset': 'utf8mb4',
    'autocommit': False,
    'raise_on_warnings': True
}

def get_db_connection():
    """Obtiene conexión a la base de datos con manejo de errores mejorado"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
        else:
            logger.error("❌ Error: Conexión no establecida")
            return None
    except mysql.connector.Error as err:
        logger.error(f"❌ Error conectando a la base de datos: {err}")
        return None
    except Exception as e:
        logger.error(f"❌ Error inesperado conectando a la base de datos: {e}")
        return None

def init_database():
    """Inicializa la base de datos y crea las tablas necesarias"""
    connection = None
    cursor = None
    
    try:
        # Conectar sin especificar base de datos para crearla
        temp_config = DB_CONFIG.copy()
        temp_config.pop('database', None)
        connection = mysql.connector.connect(**temp_config)
        cursor = connection.cursor()
        
        logger.info("✅ Conectado a MySQL exitosamente")
        
        # Crear base de datos si no existe
        try:
            cursor.execute("CREATE DATABASE IF NOT EXISTS fruteria_nina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            logger.info("✅ Base de datos 'fruteria_nina' creada o ya existe")
        except mysql.connector.Error as db_err:
            if db_err.errno == 1007:  # Database exists
                logger.info("✅ Base de datos 'fruteria_nina' ya existe")
            else:
                logger.warning(f"⚠️ Error creando base de datos: {db_err}")
        
        # Usar la base de datos
        cursor.execute("USE fruteria_nina")
        
        # Crear tabla usuarios
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) NOT NULL UNIQUE,
                contraseña VARCHAR(255) NOT NULL,
                rol ENUM('admin', 'operador') DEFAULT 'operador',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla usuarios creada")
        
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
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_nombre (nombre),
                INDEX idx_activo (activo)
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
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_nombre (nombre),
                INDEX idx_correo (correo),
                INDEX idx_telefono (telefono),
                INDEX idx_activo (activo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla clientes creada")
        
        # Crear tabla productos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad ENUM('kg', 'unidad', 'caja', 'litro') DEFAULT 'unidad',
                stock_actual DECIMAL(10,2) DEFAULT 0,
                stock_minimo DECIMAL(10,2) DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                proveedor_id INT,
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                INDEX idx_categoria (categoria),
                INDEX idx_stock_bajo (stock_actual, stock_minimo),
                INDEX idx_nombre (nombre),
                INDEX idx_activo (activo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla productos creada")
        
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
                FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
                INDEX idx_usuario_fecha (usuario_id, fecha),
                INDEX idx_proveedor (proveedor_id),
                INDEX idx_fecha (fecha),
                INDEX idx_estado (estado)
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
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                INDEX idx_compra (compra_id),
                INDEX idx_producto (producto_id)
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
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_fecha (fecha),
                INDEX idx_usuario (usuario_id),
                INDEX idx_cliente (cliente_id),
                INDEX idx_estado (estado),
                INDEX idx_forma_pago (forma_pago)
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
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                INDEX idx_venta (venta_id),
                INDEX idx_producto (producto_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla detalle_ventas creada")
        
        # Crear tabla movimientos_stock
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL DEFAULT 0,
                motivo VARCHAR(255),
                referencia_id INT,
                referencia_tipo ENUM('compra', 'venta', 'ajuste'),
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto_fecha (producto_id, fecha),
                INDEX idx_tipo (tipo),
                INDEX idx_referencia (referencia_tipo, referencia_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla movimientos_stock creada")
        
        # Crear tabla movimientos (actividad general)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tipo ENUM('venta', 'compra', 'ajuste', 'sistema') NOT NULL,
                detalle TEXT NOT NULL,
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_fecha (fecha),
                INDEX idx_tipo (tipo),
                INDEX idx_usuario (usuario_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla movimientos creada")
        
        # Crear usuario administrador si no existe
        cursor.execute("SELECT COUNT(*) FROM usuarios")
        if cursor.fetchone()[0] == 0:
            hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (%s, %s, %s, %s)",
                ('Administrador', 'admin@fruteria.com', hashed_password, 'admin')
            )
            logger.info("✅ Usuario administrador creado")
        else:
            logger.info("✅ Usuario administrador ya existe")
        
        # Insertar datos de ejemplo para proveedores
        cursor.execute("SELECT COUNT(*) FROM proveedores")
        if cursor.fetchone()[0] == 0:
            proveedores_ejemplo = [
                ('Frutas del Valle', 'Juan Pérez', '555-0101', 'juan@frutasdelvalle.com', 'Av. Principal 123', 'Proveedor principal de frutas'),
                ('Verduras Frescas S.A.', 'María González', '555-0102', 'maria@verdurasfrescas.com', 'Calle Verde 456', 'Especialistas en verduras orgánicas'),
                ('Distribuidora Central', 'Carlos López', '555-0103', 'carlos@distribuidora.com', 'Zona Industrial 789', 'Distribuidor mayorista'),
                ('Mercado Local', 'Ana Rodríguez', '555-0104', 'ana@mercadolocal.com', 'Plaza Central 321', 'Proveedor local de temporada')
            ]
            
            for proveedor in proveedores_ejemplo:
                cursor.execute("""
                    INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, notas)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, proveedor)
            logger.info("✅ Proveedores de ejemplo creados")
        
        # Insertar datos de ejemplo para productos
        cursor.execute("SELECT COUNT(*) FROM productos")
        if cursor.fetchone()[0] == 0:
            # Obtener IDs de proveedores
            cursor.execute("SELECT id FROM proveedores LIMIT 4")
            proveedores_ids = [row[0] for row in cursor.fetchall()]
            
            productos_ejemplo = [
                ('Manzana Roja', 'frutas', 'kg', 50.0, 10.0, 3.50, proveedores_ids[0] if proveedores_ids else None),
                ('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, proveedores_ids[0] if proveedores_ids else None),
                ('Naranja', 'frutas', 'kg', 40.0, 8.0, 3.20, proveedores_ids[0] if proveedores_ids else None),
                ('Lechuga', 'verduras', 'unidad', 25.0, 5.0, 1.50, proveedores_ids[1] if proveedores_ids else None),
                ('Tomate', 'verduras', 'kg', 35.0, 7.0, 4.20, proveedores_ids[1] if proveedores_ids else None),
                ('Zanahoria', 'verduras', 'kg', 20.0, 5.0, 2.50, proveedores_ids[1] if proveedores_ids else None),
                ('Papas', 'verduras', 'kg', 60.0, 15.0, 2.00, proveedores_ids[2] if proveedores_ids else None),
                ('Cebolla', 'verduras', 'kg', 45.0, 10.0, 1.80, proveedores_ids[2] if proveedores_ids else None)
            ]
            
            for producto in productos_ejemplo:
                cursor.execute("""
                    INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, precio_unitario, proveedor_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, producto)
            logger.info("✅ Productos de ejemplo creados")
        
        # Insertar datos de ejemplo para clientes
        cursor.execute("SELECT COUNT(*) FROM clientes")
        if cursor.fetchone()[0] == 0:
            clientes_ejemplo = [
                ('Cliente General', None, None, None, 'Cliente para ventas rápidas'),
                ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '555-1001', 'Av. Gastronómica 100', 'Cliente mayorista - restaurante'),
                ('Supermercado La Esquina', 'compras@laesquina.com', '555-1002', 'Calle Comercial 200', 'Supermercado local'),
                ('María Fernández', 'maria.fernandez@email.com', '555-1003', 'Residencial Los Pinos 45', 'Cliente frecuente'),
                ('Hotel Plaza', 'cocina@hotelplaza.com', '555-1004', 'Plaza Principal 1', 'Hotel - pedidos semanales')
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
        
    except mysql.connector.Error as err:
        logger.error(f"❌ Error de MySQL: {err}")
        if err.errno == 1007:  # Database exists
            logger.info("✅ Continuando con base de datos existente...")
            return True
        return False
    except Exception as e:
        logger.error(f"❌ Error inesperado: {e}")
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
        if request.method == "OPTIONS":
            response = jsonify()
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
            response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
            response.headers.add('Access-Control-Allow-Credentials', "true")
            return response
        
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'message': 'Token requerido'}), 401

        try:
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
            else:
                token = auth_header
                
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        except Exception as e:
            logger.error(f"Error en jwt_required: {e}")
            return jsonify({'message': 'Error procesando token'}), 401
            
        return f(current_user_id, *args, **kwargs)
    return decorated

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', "true")
        return response

# ==================== ENDPOINTS DE AUTENTICACIÓN ====================

@app.route('/api/register', methods=['POST'])
def register():
    """Endpoint para registro de usuarios"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        if not all(k in data for k in ('nombre', 'correo', 'contraseña')):
            return jsonify({'message': 'Faltan campos requeridos: nombre, correo, contraseña'}), 400
            
        nombre = data['nombre'].strip()
        correo = data['correo'].strip().lower()
        contraseña = data['contraseña']
        
        if len(nombre) < 2:
            return jsonify({'message': 'El nombre debe tener al menos 2 caracteres'}), 400
        if len(contraseña) < 6:
            return jsonify({'message': 'La contraseña debe tener al menos 6 caracteres'}), 400
        if '@' not in correo:
            return jsonify({'message': 'Correo electrónico inválido'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si el usuario ya existe
        cursor.execute("SELECT id FROM usuarios WHERE correo = %s", (correo,))
        if cursor.fetchone():
            return jsonify({'message': 'El correo ya está registrado'}), 409
            
        # Hashear contraseña
        hashed_password = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())
        
        # Insertar usuario
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (%s, %s, %s)",
            (nombre, correo, hashed_password)
        )
        connection.commit()
        
        logger.info(f"Usuario registrado exitosamente: {correo}")
        response = jsonify({
            'message': 'Usuario registrado exitosamente',
            'success': True
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
    """Endpoint para inicio de sesión"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        if not all(k in data for k in ('correo', 'contraseña')):
            return jsonify({'message': 'Correo y contraseña requeridos'}), 400
            
        correo = data['correo'].strip().lower()
        contraseña = data['contraseña']
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id, nombre, contraseña, rol FROM usuarios WHERE correo = %s",
            (correo,)
        )
        user = cursor.fetchone()
        
        if not user or not bcrypt.checkpw(contraseña.encode('utf-8'), user[2].encode('utf-8')):
            return jsonify({'message': 'Credenciales incorrectas'}), 401
            
        # Generar token JWT
        payload = {
            'user_id': user[0],
            'correo': correo,
            'rol': user[3],
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        
        logger.info(f"Login exitoso para usuario: {correo}")
        response = jsonify({
            'token': token,
            'user': {
                'id': user[0],
                'nombre': user[1],
                'correo': correo,
                'rol': user[3]
            },
            'message': 'Inicio de sesión exitoso'
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

@app.route('/api/verify-token', methods=['GET'])
@jwt_required
def verify_token(current_user_id):
    """Verifica si el token es válido"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'valid': False, 'message': 'Error de base de datos'}), 500
            
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id, nombre, correo, rol FROM usuarios WHERE id = %s",
            (current_user_id,)
        )
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
            return jsonify({'valid': False, 'message': 'Usuario no encontrado'}), 401
    except Exception as e:
        logger.error(f"Error verificando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE PROVEEDORES ====================

@app.route('/api/proveedores', methods=['GET'])
@jwt_required
def obtener_proveedores(current_user_id):
    """Listar proveedores con búsqueda"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🏪 Obteniendo proveedores para usuario {current_user_id}")
        
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
        
        logger.info(f"✅ Proveedores obtenidos: {len(proveedores)}")
        response = jsonify(proveedores)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo proveedores: {e}")
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
        logger.info(f"🏪 Creando proveedor: {data}")
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'El nombre del proveedor es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si ya existe un proveedor con el mismo nombre
        cursor.execute("SELECT id FROM proveedores WHERE nombre = %s", (data['nombre'].strip(),))
        if cursor.fetchone():
            return jsonify({'message': 'Ya existe un proveedor con este nombre'}), 409
        
        # Insertar proveedor
        cursor.execute("""
            INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, notas)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data.get('contacto', '').strip() or None,
            data.get('telefono', '').strip() or None,
            data.get('correo', '').strip() or None,
            data.get('direccion', '').strip() or None,
            data.get('notas', '').strip() or None
        ))
        
        proveedor_id = cursor.lastrowid
        connection.commit()
        
        logger.info(f"✅ Proveedor creado: {data['nombre']} (ID: {proveedor_id})")
        response = jsonify({
            'message': 'Proveedor creado exitosamente',
            'id': proveedor_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error creando proveedor: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/proveedores/<int:proveedor_id>', methods=['PUT'])
@jwt_required
def actualizar_proveedor(current_user_id, proveedor_id):
    """Actualizar proveedor"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"🏪 Actualizando proveedor {proveedor_id}: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el proveedor existe
        cursor.execute("SELECT id FROM proveedores WHERE id = %s", (proveedor_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        # Construir consulta de actualización
        campos_actualizables = ['nombre', 'contacto', 'telefono', 'correo', 'direccion', 'notas', 'activo']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                if campo == 'activo':
                    valores.append(bool(data[campo]))
                else:
                    valor = data[campo].strip() if isinstance(data[campo], str) else data[campo]
                    valores.append(valor if valor else None)
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(proveedor_id)
        
        query = f"UPDATE proveedores SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Proveedor {proveedor_id} actualizado exitosamente")
        response = jsonify({'message': 'Proveedor actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error actualizando proveedor: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/proveedores/<int:proveedor_id>', methods=['DELETE'])
@jwt_required
def eliminar_proveedor(current_user_id, proveedor_id):
    """Eliminar proveedor"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🏪 Eliminando proveedor {proveedor_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el proveedor existe
        cursor.execute("SELECT nombre FROM proveedores WHERE id = %s", (proveedor_id,))
        proveedor = cursor.fetchone()
        if not proveedor:
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        # Verificar si tiene compras asociadas
        cursor.execute("SELECT COUNT(*) FROM compras WHERE proveedor_id = %s", (proveedor_id,))
        compras_count = cursor.fetchone()[0]
        
        if compras_count > 0:
            # Solo desactivar si tiene compras asociadas
            cursor.execute("UPDATE proveedores SET activo = FALSE WHERE id = %s", (proveedor_id,))
            mensaje = 'Proveedor desactivado (tiene compras asociadas)'
        else:
            # Eliminar completamente si no tiene compras
            cursor.execute("DELETE FROM proveedores WHERE id = %s", (proveedor_id,))
            mensaje = 'Proveedor eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"✅ Proveedor {proveedor_id} ({proveedor[0]}) procesado")
        response = jsonify({'message': mensaje})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error eliminando proveedor: {e}")
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
    """Listar compras con filtros"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🛒 Obteniendo compras para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtro
        proveedor_id = request.args.get('proveedor_id')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        estado = request.args.get('estado')
        
        # Construir consulta
        query = """
            SELECT c.id, c.numero_factura, c.total, DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha,
                   c.estado, c.notas, c.creado,
                   p.nombre as proveedor_nombre,
                   COUNT(dc.id) as cantidad_productos
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            LEFT JOIN detalle_compras dc ON c.id = dc.compra_id
            WHERE 1=1
        """
        params = []
        
        # Agregar filtros
        if proveedor_id:
            query += " AND c.proveedor_id = %s"
            params.append(proveedor_id)
            
        if fecha_inicio:
            query += " AND c.fecha >= %s"
            params.append(fecha_inicio)
            
        if fecha_fin:
            query += " AND c.fecha <= %s"
            params.append(fecha_fin)
            
        if estado:
            query += " AND c.estado = %s"
            params.append(estado)
        
        query += " GROUP BY c.id ORDER BY c.fecha DESC, c.creado DESC LIMIT 100"
        
        cursor.execute(query, params)
        compras = []
        
        for row in cursor.fetchall():
            compra = {
                'id': row[0],
                'numero_factura': row[1] or '',
                'total': float(row[2]) if row[2] else 0.0,
                'fecha': row[3] if row[3] else '',
                'estado': row[4] or 'completada',
                'notas': row[5] or '',
                'creado': row[6].isoformat() if row[6] else None,
                'proveedor_nombre': row[7] or 'Sin proveedor',
                'cantidad_productos': row[8] or 0
            }
            compras.append(compra)
        
        logger.info(f"✅ Compras obtenidas: {len(compras)}")
        response = jsonify(compras)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo compras: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras', methods=['POST'])
@jwt_required
def crear_compra(current_user_id):
    """Crear compra (actualiza stock automáticamente)"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"🛒 Creando compra para usuario {current_user_id}: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        # Validaciones básicas
        if not data.get('productos') or len(data['productos']) == 0:
            return jsonify({'message': 'Debe incluir al menos un producto'}), 400
            
        if not data.get('fecha'):
            return jsonify({'message': 'La fecha es requerida'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Validar proveedor si se proporciona
        proveedor_id = data.get('proveedor_id')
        if proveedor_id:
            cursor.execute("SELECT id FROM proveedores WHERE id = %s AND activo = TRUE", (proveedor_id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Proveedor no encontrado o inactivo'}), 404
        
        # Validar y calcular totales
        productos_validados = []
        total_compra = 0
        
        for producto in data['productos']:
            if not all(k in producto for k in ('producto_id', 'cantidad', 'precio_unitario')):
                return jsonify({'message': 'Cada producto debe tener: producto_id, cantidad, precio_unitario'}), 400
            
            try:
                cantidad = float(producto['cantidad'])
                precio_unitario = float(producto['precio_unitario'])
                if cantidad <= 0 or precio_unitario <= 0:
                    return jsonify({'message': 'Cantidad y precio deben ser mayores a 0'}), 400
                
                # Verificar que el producto existe
                cursor.execute("SELECT id, nombre FROM productos WHERE id = %s", (producto['producto_id'],))
                producto_db = cursor.fetchone()
                if not producto_db:
                    return jsonify({'message': f'Producto con ID {producto["producto_id"]} no encontrado'}), 404
                
                subtotal = cantidad * precio_unitario
                total_compra += subtotal
                
                productos_validados.append({
                    'producto_id': producto['producto_id'],
                    'nombre': producto_db[1],
                    'cantidad': cantidad,
                    'precio_unitario': precio_unitario,
                    'subtotal': subtotal
                })
            except (ValueError, TypeError):
                return jsonify({'message': 'Cantidad y precio deben ser números válidos'}), 400
        
        # Iniciar transacción
        cursor.execute("START TRANSACTION")
        
        try:
            # Insertar compra principal
            cursor.execute("""
                INSERT INTO compras (usuario_id, proveedor_id, numero_factura, total, fecha, estado, notas)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                current_user_id,
                proveedor_id,
                data.get('numero_factura', '').strip() or None,
                total_compra,
                data['fecha'],
                data.get('estado', 'completada'),
                data.get('notas', '').strip() or None
            ))
            
            compra_id = cursor.lastrowid
            
            # Insertar detalles de compra y actualizar stock
            for producto in productos_validados:
                # Insertar detalle
                cursor.execute("""
                    INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    compra_id,
                    producto['producto_id'],
                    producto['cantidad'],
                    producto['precio_unitario'],
                    producto['subtotal']
                ))
                
                # Actualizar stock del producto
                cursor.execute("""
                    UPDATE productos 
                    SET stock_actual = stock_actual + %s 
                    WHERE id = %s
                """, (producto['cantidad'], producto['producto_id']))
                
                # Registrar movimiento de stock
                cursor.execute("""
                    INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id)
                    VALUES (%s, 'ingreso', %s, %s, %s, 'compra', %s)
                """, (
                    producto['producto_id'],
                    producto['cantidad'],
                    f'Compra #{compra_id}',
                    compra_id,
                    current_user_id
                ))
                
                logger.info(f"✅ Stock actualizado para {producto['nombre']}: +{producto['cantidad']}")
            
            # Registrar movimiento general
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle, usuario_id)
                VALUES ('compra', %s, %s)
            """, (f'Compra #{compra_id} por ${total_compra:.2f}', current_user_id))
            
            # Confirmar transacción
            connection.commit()
            
            logger.info(f"✅ Compra {compra_id} creada exitosamente por ${total_compra:.2f}")
            
            response = jsonify({
                'message': 'Compra registrada exitosamente',
                'compra_id': compra_id,
                'total': total_compra
            })
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 201
            
        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except Exception as e:
        logger.error(f"❌ Error creando compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/<int:compra_id>', methods=['GET'])
@jwt_required
def obtener_compra(current_user_id, compra_id):
    """Obtener detalle de compra"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🛒 Obteniendo detalle de compra {compra_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener datos principales de la compra
        cursor.execute("""
            SELECT c.id, c.numero_factura, c.total, DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha,
                   c.estado, c.notas, c.creado,
                   p.nombre as proveedor_nombre, p.id as proveedor_id
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            WHERE c.id = %s
        """, (compra_id,))
        
        compra_data = cursor.fetchone()
        if not compra_data:
            return jsonify({'message': 'Compra no encontrada'}), 404
        
        # Obtener detalles de productos
        cursor.execute("""
            SELECT dc.producto_id, p.nombre as producto_nombre, dc.cantidad, dc.precio_unitario, dc.subtotal
            FROM detalle_compras dc
            INNER JOIN productos p ON dc.producto_id = p.id
            WHERE dc.compra_id = %s
            ORDER BY p.nombre
        """, (compra_id,))
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'producto_id': row[0],
                'producto_nombre': row[1],
                'cantidad': float(row[2]),
                'precio_unitario': float(row[3]),
                'subtotal': float(row[4])
            }
            productos.append(producto)
        
        compra = {
            'id': compra_data[0],
            'numero_factura': compra_data[1] or '',
            'total': float(compra_data[2]),
            'fecha': compra_data[3],
            'estado': compra_data[4],
            'notas': compra_data[5] or '',
            'creado': compra_data[6].isoformat() if compra_data[6] else None,
            'proveedor': {
                'id': compra_data[8],
                'nombre': compra_data[7] or 'Sin proveedor'
            } if compra_data[8] else None,
            'productos': productos
        }
        
        logger.info(f"✅ Detalle de compra obtenido: {len(productos)} productos")
        response = jsonify(compra)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo detalle de compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/<int:compra_id>', methods=['PUT'])
@jwt_required
def actualizar_compra(current_user_id, compra_id):
    """Actualizar compra"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"🛒 Actualizando compra {compra_id}: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que la compra existe
        cursor.execute("SELECT estado FROM compras WHERE id = %s", (compra_id,))
        compra = cursor.fetchone()
        if not compra:
            return jsonify({'message': 'Compra no encontrada'}), 404
        
        # Solo permitir edición si está en borrador
        if compra[0] != 'borrador':
            return jsonify({'message': 'Solo se pueden editar compras en estado borrador'}), 403
        
        # Construir consulta de actualización
        campos_actualizables = ['proveedor_id', 'numero_factura', 'fecha', 'estado', 'notas']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                valores.append(data[campo])
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(compra_id)
        
        query = f"UPDATE compras SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Compra {compra_id} actualizada exitosamente")
        response = jsonify({'message': 'Compra actualizada exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error actualizando compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/<int:compra_id>', methods=['DELETE'])
@jwt_required
def eliminar_compra(current_user_id, compra_id):
    """Eliminar compra (revierte stock)"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🛒 Eliminando compra {compra_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que la compra existe
        cursor.execute("SELECT estado, total FROM compras WHERE id = %s", (compra_id,))
        compra = cursor.fetchone()
        if not compra:
            return jsonify({'message': 'Compra no encontrada'}), 404
        
        # Iniciar transacción
        cursor.execute("START TRANSACTION")
        
        try:
            # Obtener productos de la compra para revertir stock
            cursor.execute("""
                SELECT producto_id, cantidad 
                FROM detalle_compras 
                WHERE compra_id = %s
            """, (compra_id,))
            
            productos_compra = cursor.fetchall()
            
            # Revertir stock de productos
            for producto_id, cantidad in productos_compra:
                cursor.execute("""
                    UPDATE productos 
                    SET stock_actual = stock_actual - %s 
                    WHERE id = %s
                """, (cantidad, producto_id))
                
                # Registrar movimiento de stock
                cursor.execute("""
                    INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id)
                    VALUES (%s, 'egreso', %s, %s, %s, 'compra', %s)
                """, (
                    producto_id,
                    cantidad,
                    f'Eliminación de compra #{compra_id}',
                    compra_id,
                    current_user_id
                ))
            
            # Eliminar compra (los detalles se eliminan automáticamente por CASCADE)
            cursor.execute("DELETE FROM compras WHERE id = %s", (compra_id,))
            
            # Registrar movimiento
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle, usuario_id)
                VALUES ('compra', %s, %s)
            """, (f'Eliminación de compra #{compra_id} por ${compra[1]:.2f}', current_user_id))
            
            # Confirmar transacción
            connection.commit()
            
            logger.info(f"✅ Compra {compra_id} eliminada exitosamente")
            response = jsonify({'message': 'Compra eliminada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200

        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except Exception as e:
        logger.error(f"❌ Error eliminando compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_compras(current_user_id):
    """Estadísticas de compras"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo estadísticas de compras")
        
        connection = get_db_connection()
        if not connection:
            estadisticas_default = {
                'compras_mes': 0,
                'gasto_mes': 0.0,
                'gasto_promedio': 0.0,
                'proveedor_frecuente': 'N/A',
                'productos_mas_comprados': [],
                'total_compras': 0,
                'gasto_total': 0.0
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Compras del mes actual
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM compras 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        compras_mes = cursor.fetchone()
        total_compras_mes = compras_mes[0] if compras_mes else 0
        gasto_mes = float(compras_mes[1]) if compras_mes else 0.0
        
        # Gasto promedio por compra
        cursor.execute("""
            SELECT AVG(total) FROM compras 
            WHERE estado = 'completada' AND total > 0
        """)
        gasto_promedio = cursor.fetchone()[0]
        gasto_promedio = float(gasto_promedio) if gasto_promedio else 0.0
        
        # Proveedor más frecuente
        cursor.execute("""
            SELECT p.nombre, COUNT(*) as frecuencia
            FROM compras c
            INNER JOIN proveedores p ON c.proveedor_id = p.id
            WHERE c.estado = 'completada'
            GROUP BY p.id, p.nombre 
            ORDER BY frecuencia DESC 
            LIMIT 1
        """)
        proveedor_frecuente = cursor.fetchone()
        proveedor_top = proveedor_frecuente[0] if proveedor_frecuente else 'N/A'
        
        # Productos más comprados
        cursor.execute("""
            SELECT p.nombre, SUM(dc.cantidad) as total_cantidad
            FROM detalle_compras dc
            INNER JOIN productos p ON dc.producto_id = p.id
            INNER JOIN compras c ON dc.compra_id = c.id
            WHERE c.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY total_cantidad DESC
            LIMIT 5
        """)
        productos_top = []
        for row in cursor.fetchall():
            productos_top.append({
                'producto': row[0],
                'cantidad_total': float(row[1])
            })
        
        # Total general de compras
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM compras 
            WHERE estado = 'completada'
        """)
        totales = cursor.fetchone()
        total_compras = totales[0] if totales else 0
        gasto_total = float(totales[1]) if totales else 0.0
        
        estadisticas = {
            'compras_mes': total_compras_mes,
            'gasto_mes': gasto_mes,
            'gasto_promedio': gasto_promedio,
            'proveedor_frecuente': proveedor_top,
            'productos_mas_comprados': productos_top,
            'total_compras': total_compras,
            'gasto_total': gasto_total
        }
        
        logger.info(f"✅ Estadísticas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas de compras: {e}")
        estadisticas_default = {
            'compras_mes': 0,
            'gasto_mes': 0.0,
            'gasto_promedio': 0.0,
            'proveedor_frecuente': 'N/A',
            'productos_mas_comprados': [],
            'total_compras': 0,
            'gasto_total': 0.0
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
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
        logger.info(f"👥 Obteniendo clientes")
        
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
                'nombre': row[1] or '',
                'correo': row[2] or '',
                'telefono': row[3] or '',
                'direccion': row[4] or '',
                'notas': row[5] or '',
                'activo': bool(row[6]),
                'creado': row[7].isoformat() if row[7] else None
            }
            clientes.append(cliente)
        
        logger.info(f"✅ Clientes obtenidos: {len(clientes)}")
        response = jsonify(clientes)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo clientes: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes', methods=['POST'])
@jwt_required
def crear_cliente(current_user_id):
    """Crear cliente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"👥 Creando cliente: {data}")
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'El nombre del cliente es requerido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Validar email si se proporciona
        correo = data.get('correo', '').strip()
        if correo:
            if '@' not in correo:
                return jsonify({'message': 'El correo electrónico no es válido'}), 400
            
            # Verificar si el correo ya existe
            cursor.execute("SELECT id FROM clientes WHERE correo = %s", (correo,))
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un cliente con este correo electrónico'}), 409
        
        # Insertar cliente
        cursor.execute("""
            INSERT INTO clientes (nombre, correo, telefono, direccion, notas)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            correo if correo else None,
            data.get('telefono', '').strip() or None,
            data.get('direccion', '').strip() or None,
            data.get('notas', '').strip() or None
        ))
        
        cliente_id = cursor.lastrowid
        connection.commit()
        
        logger.info(f"✅ Cliente creado: {data['nombre']} (ID: {cliente_id})")
        response = jsonify({
            'message': 'Cliente creado exitosamente',
            'id': cliente_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error creando cliente: {e}")
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
        logger.info(f"👥 Actualizando cliente {cliente_id}: {data}")
        
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
        
        # Validar correo si se proporciona
        if 'correo' in data and data['correo']:
            correo = data['correo'].strip()
            if '@' not in correo:
                return jsonify({'message': 'El correo electrónico no es válido'}), 400
            
            # Verificar que el correo no esté en uso por otro cliente
            cursor.execute("SELECT id FROM clientes WHERE correo = %s AND id != %s", (correo, cliente_id))
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe otro cliente con este correo electrónico'}), 409
        
        # Construir consulta de actualización
        campos_actualizables = ['nombre', 'correo', 'telefono', 'direccion', 'notas', 'activo']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                if campo == 'activo':
                    valores.append(bool(data[campo]))
                else:
                    valor = data[campo].strip() if isinstance(data[campo], str) else data[campo]
                    valores.append(valor if valor else None)
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(cliente_id)
        
        query = f"UPDATE clientes SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Cliente {cliente_id} actualizado exitosamente")
        response = jsonify({'message': 'Cliente actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error actualizando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/<int:cliente_id>', methods=['DELETE'])
@jwt_required
def eliminar_cliente(current_user_id, cliente_id):
    """Eliminar cliente"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"👥 Eliminando cliente {cliente_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el cliente existe
        cursor.execute("SELECT nombre FROM clientes WHERE id = %s", (cliente_id,))
        cliente = cursor.fetchone()
        if not cliente:
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        # Verificar si tiene ventas asociadas
        cursor.execute("SELECT COUNT(*) FROM ventas WHERE cliente_id = %s", (cliente_id,))
        ventas_count = cursor.fetchone()[0]
        
        if ventas_count > 0:
            # Solo desactivar si tiene ventas asociadas
            cursor.execute("UPDATE clientes SET activo = FALSE WHERE id = %s", (cliente_id,))
            mensaje = 'Cliente desactivado (tiene ventas asociadas)'
        else:
            # Eliminar completamente si no tiene ventas
            cursor.execute("DELETE FROM clientes WHERE id = %s", (cliente_id,))
            mensaje = 'Cliente eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"✅ Cliente {cliente_id} ({cliente[0]}) procesado")
        response = jsonify({'message': mensaje})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error eliminando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE INVENTARIO ====================

@app.route('/api/inventario', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Listar productos"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Obteniendo productos")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtro
        categoria = request.args.get('categoria')
        stock_bajo = request.args.get('stock_bajo', 'false').lower() == 'true'
        search = request.args.get('q', '').strip()
        
        # Construir consulta
        query = """
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, p.stock_minimo, 
                   p.precio_unitario, p.activo, p.creado,
                   pr.nombre as proveedor_nombre
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = TRUE
        """
        params = []
        
        if categoria:
            query += " AND p.categoria = %s"
            params.append(categoria)
        
        if stock_bajo:
            query += " AND p.stock_actual <= p.stock_minimo"
        
        if search:
            query += " AND p.nombre LIKE %s"
            params.append(f"%{search}%")
        
        query += " ORDER BY p.nombre ASC"
        
        cursor.execute(query, params)
        productos = []
        
        for row in cursor.fetchall():
            producto = {
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'unidad': row[3],
                'stock_actual': float(row[4]) if row[4] else 0.0,
                'stock_minimo': float(row[5]) if row[5] else 0.0,
                'precio_unitario': float(row[6]) if row[6] else 0.0,
                'activo': bool(row[7]),
                'creado': row[8].isoformat() if row[8] else None,
                'proveedor_nombre': row[9] or '',
                'stock_bajo': (row[4] or 0) <= (row[5] or 0)
            }
            productos.append(producto)
        
        logger.info(f"✅ Productos obtenidos: {len(productos)}")
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo productos: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario', methods=['POST'])
@jwt_required
def crear_producto(current_user_id):
    """Crear producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"📦 Creando producto: {data}")
        
        if not data or not data.get('nombre'):
            return jsonify({'message': 'El nombre del producto es requerido'}), 400
        
        if not data.get('categoria'):
            return jsonify({'message': 'La categoría es requerida'}), 400
        
        try:
            precio = float(data.get('precio_unitario', 0))
            if precio < 0:
                return jsonify({'message': 'El precio no puede ser negativo'}), 400
        except (ValueError, TypeError):
            return jsonify({'message': 'Precio inválido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si ya existe un producto con el mismo nombre
        cursor.execute("SELECT id FROM productos WHERE nombre = %s", (data['nombre'].strip(),))
        if cursor.fetchone():
            return jsonify({'message': 'Ya existe un producto con este nombre'}), 409
        
        # Insertar producto
        cursor.execute("""
            INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, 
                                 precio_unitario, proveedor_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['categoria'],
            data.get('unidad', 'unidad'),
            float(data.get('stock_actual', 0)),
            float(data.get('stock_minimo', 0)),
            precio,
            data.get('proveedor_id') if data.get('proveedor_id') else None
        ))
        
        producto_id = cursor.lastrowid
        connection.commit()
        
        logger.info(f"✅ Producto creado: {data['nombre']} (ID: {producto_id})")
        response = jsonify({
            'message': 'Producto creado exitosamente',
            'id': producto_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error creando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>', methods=['PUT'])
@jwt_required
def actualizar_producto(current_user_id, producto_id):
    """Actualizar producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"📦 Actualizando producto {producto_id}: {data}")
        
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
        
        # Validaciones
        if 'precio_unitario' in data:
            try:
                precio = float(data['precio_unitario'])
                if precio < 0:
                    return jsonify({'message': 'El precio no puede ser negativo'}), 400
            except (ValueError, TypeError):
                return jsonify({'message': 'El precio debe ser un número válido'}), 400
        
        # Construir consulta de actualización
        campos_actualizables = ['nombre', 'categoria', 'unidad', 'stock_actual', 'stock_minimo', 
                              'precio_unitario', 'proveedor_id', 'activo']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                if campo in ['stock_actual', 'stock_minimo', 'precio_unitario']:
                    valores.append(float(data[campo]))
                elif campo == 'activo':
                    valores.append(bool(data[campo]))
                elif campo == 'proveedor_id':
                    valores.append(data[campo] if data[campo] else None)
                else:
                    valores.append(data[campo].strip() if isinstance(data[campo], str) else data[campo])
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(producto_id)
        
        query = f"UPDATE productos SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Producto {producto_id} actualizado exitosamente")
        response = jsonify({'message': 'Producto actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error actualizando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>', methods=['DELETE'])
@jwt_required
def eliminar_producto(current_user_id, producto_id):
    """Eliminar producto"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Eliminando producto {producto_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT nombre FROM productos WHERE id = %s", (producto_id,))
        producto = cursor.fetchone()
        if not producto:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Verificar si tiene movimientos asociados
        cursor.execute("""
            SELECT COUNT(*) FROM (
                SELECT 1 FROM detalle_compras WHERE producto_id = %s
                UNION ALL
                SELECT 1 FROM detalle_ventas WHERE producto_id = %s
            ) as movimientos
        """, (producto_id, producto_id))
        
        movimientos_count = cursor.fetchone()[0]
        
        if movimientos_count > 0:
            # Solo desactivar si tiene movimientos asociados
            cursor.execute("UPDATE productos SET activo = FALSE WHERE id = %s", (producto_id,))
            mensaje = 'Producto desactivado (tiene movimientos asociados)'
        else:
            # Eliminar completamente si no tiene movimientos
            cursor.execute("DELETE FROM productos WHERE id = %s", (producto_id,))
            mensaje = 'Producto eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"✅ Producto {producto_id} ({producto[0]}) procesado")
        response = jsonify({'message': mensaje})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error eliminando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE VENTAS ====================

@app.route('/api/ventas', methods=['POST'])
@jwt_required
def crear_venta(current_user_id):
    """Crear venta"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"💰 Creando venta para usuario {current_user_id}: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        # Validaciones básicas
        if not data.get('productos') or len(data['productos']) == 0:
            return jsonify({'message': 'Debe incluir al menos un producto'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Validar cliente si se proporciona
        cliente_id = data.get('cliente_id')
        if cliente_id:
            cursor.execute("SELECT id FROM clientes WHERE id = %s AND activo = TRUE", (cliente_id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Cliente no encontrado o inactivo'}), 404
        
        # Validar y calcular totales
        productos_validados = []
        subtotal_total = 0
        
        for producto in data['productos']:
            if not all(k in producto for k in ('producto_id', 'cantidad', 'precio_unitario')):
                return jsonify({'message': 'Cada producto debe tener: producto_id, cantidad, precio_unitario'}), 400
            
            try:
                cantidad = float(producto['cantidad'])
                precio_unitario = float(producto['precio_unitario'])
                if cantidad <= 0 or precio_unitario <= 0:
                    return jsonify({'message': 'Cantidad y precio deben ser mayores a 0'}), 400
                
                # Verificar que el producto existe y hay stock suficiente
                cursor.execute("SELECT id, nombre, stock_actual FROM productos WHERE id = %s AND activo = TRUE", (producto['producto_id'],))
                producto_db = cursor.fetchone()
                if not producto_db:
                    return jsonify({'message': f'Producto con ID {producto["producto_id"]} no encontrado o inactivo'}), 404
                
                if producto_db[2] < cantidad:
                    return jsonify({'message': f'Stock insuficiente para {producto_db[1]}. Disponible: {producto_db[2]}'}), 400
                
                subtotal = cantidad * precio_unitario
                subtotal_total += subtotal
                
                productos_validados.append({
                    'producto_id': producto['producto_id'],
                    'nombre': producto_db[1],
                    'cantidad': cantidad,
                    'precio_unitario': precio_unitario,
                    'subtotal': subtotal
                })
            except (ValueError, TypeError):
                return jsonify({'message': 'Cantidad y precio deben ser números válidos'}), 400
        
        # Calcular descuento e impuestos
        descuento = float(data.get('descuento', 0))
        impuestos = float(data.get('impuestos', 0))
        total = subtotal_total - descuento + impuestos
        
        # Iniciar transacción
        cursor.execute("START TRANSACTION")
        
        try:
            # Insertar venta principal
            cursor.execute("""
                INSERT INTO ventas (cliente_id, usuario_id, numero_venta, forma_pago, subtotal, descuento, impuestos, total, estado, observaciones)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                cliente_id,
                current_user_id,
                data.get('numero_venta', '').strip() or None,
                data.get('forma_pago', 'efectivo'),
                subtotal_total,
                descuento,
                impuestos,
                total,
                data.get('estado', 'completada'),
                data.get('observaciones', '').strip() or None
            ))
            
            venta_id = cursor.lastrowid
            
            # Insertar detalles de venta y actualizar stock
            for producto in productos_validados:
                # Insertar detalle
                cursor.execute("""
                    INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    venta_id,
                    producto['producto_id'],
                    producto['cantidad'],
                    producto['precio_unitario'],
                    producto['subtotal']
                ))
                
                # Actualizar stock del producto
                cursor.execute("""
                    UPDATE productos 
                    SET stock_actual = stock_actual - %s 
                    WHERE id = %s
                """, (producto['cantidad'], producto['producto_id']))
                
                # Registrar movimiento de stock
                cursor.execute("""
                    INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id)
                    VALUES (%s, 'egreso', %s, %s, %s, 'venta', %s)
                """, (
                    producto['producto_id'],
                    producto['cantidad'],
                    f'Venta #{venta_id}',
                    venta_id,
                    current_user_id
                ))
                
                logger.info(f"✅ Stock actualizado para {producto['nombre']}: -{producto['cantidad']}")
            
            # Registrar movimiento general
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle, usuario_id)
                VALUES ('venta', %s, %s)
            """, (f'Venta #{venta_id} por ${total:.2f}', current_user_id))
            
            # Confirmar transacción
            connection.commit()
            
            logger.info(f"✅ Venta {venta_id} creada exitosamente por ${total:.2f}")
            
            response = jsonify({
                'message': 'Venta registrada exitosamente',
                'venta_id': venta_id,
                'total': total
            })
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 201
            
        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except Exception as e:
        logger.error(f"❌ Error creando venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas', methods=['GET'])
@jwt_required
def obtener_ventas(current_user_id):
    """Listar ventas"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"💰 Obteniendo ventas")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtro
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        cliente_id = request.args.get('cliente_id')
        forma_pago = request.args.get('forma_pago')
        estado = request.args.get('estado')
        
        # Construir consulta
        query = """
            SELECT v.id, v.numero_venta, v.cliente_id, c.nombre as cliente_nombre, 
                   v.usuario_id, u.nombre as usuario_nombre,
                   DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') as fecha, v.forma_pago, 
                   v.subtotal, v.descuento, v.impuestos, v.total, v.estado, v.observaciones,
                   COUNT(dv.id) as cantidad_productos
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
            WHERE 1=1
        """
        params = []
        
        # Agregar filtros
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
            
        if estado:
            query += " AND v.estado = %s"
            params.append(estado)
        
        query += " GROUP BY v.id ORDER BY v.fecha DESC LIMIT 100"
        
        cursor.execute(query, params)
        ventas = []
        
        for row in cursor.fetchall():
            venta = {
                'id': row[0],
                'numero_venta': row[1] or '',
                'cliente_id': row[2],
                'cliente_nombre': row[3] or 'Venta rápida',
                'usuario_id': row[4],
                'usuario_nombre': row[5] or 'Usuario desconocido',
                'fecha': row[6] if row[6] else '',
                'forma_pago': row[7] or 'efectivo',
                'subtotal': float(row[8]) if row[8] is not None else 0.0,
                'descuento': float(row[9]) if row[9] is not None else 0.0,
                'impuestos': float(row[10]) if row[10] is not None else 0.0,
                'total': float(row[11]) if row[11] is not None else 0.0,
                'estado': row[12] or 'completada',
                'observaciones': row[13] or '',
                'cantidad_productos': row[14] or 0
            }
            ventas.append(venta)
        
        logger.info(f"✅ Ventas obtenidas: {len(ventas)}")
        response = jsonify(ventas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo ventas: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['GET'])
@jwt_required
def obtener_venta(current_user_id, venta_id):
    """Obtener detalle de venta"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"💰 Obteniendo detalle de venta {venta_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener datos principales de la venta
        cursor.execute("""
            SELECT v.id, v.numero_venta, v.cliente_id, c.nombre as cliente_nombre, 
                   c.correo as cliente_correo, c.telefono as cliente_telefono, 
                   v.usuario_id, u.nombre as usuario_nombre,
                   DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') as fecha, v.forma_pago, 
                   v.subtotal, v.descuento, v.impuestos, v.total, v.estado, v.observaciones
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            LEFT JOIN usuarios u ON v.usuario_id = u.id
            WHERE v.id = %s
        """, (venta_id,))
        
        venta_data = cursor.fetchone()
        if not venta_data:
            return jsonify({'message': 'Venta no encontrada'}), 404
        
        # Obtener detalles de productos
        cursor.execute("""
            SELECT dv.producto_id, p.nombre as producto_nombre, dv.cantidad, dv.precio_unitario, dv.subtotal
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            WHERE dv.venta_id = %s
            ORDER BY p.nombre
        """, (venta_id,))
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'producto_id': row[0],
                'producto_nombre': row[1],
                'cantidad': float(row[2]),
                'precio_unitario': float(row[3]),
                'subtotal': float(row[4])
            }
            productos.append(producto)
        
        venta = {
            'id': venta_data[0],
            'numero_venta': venta_data[1] or '',
            'cliente_id': venta_data[2],
            'cliente': {
                'nombre': venta_data[3] or 'Venta rápida',
                'correo': venta_data[4] or '',
                'telefono': venta_data[5] or ''
            } if venta_data[2] else None,
            'usuario_id': venta_data[6],
            'usuario_nombre': venta_data[7],
            'fecha': venta_data[8],
            'forma_pago': venta_data[9],
            'subtotal': float(venta_data[10]),
            'descuento': float(venta_data[11]),
            'impuestos': float(venta_data[12]),
            'total': float(venta_data[13]),
            'estado': venta_data[14],
            'observaciones': venta_data[15] or '',
            'productos': productos
        }
        
        logger.info(f"✅ Detalle de venta obtenido: {len(productos)} productos")
        response = jsonify(venta)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo detalle de venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['PUT'])
@jwt_required
def actualizar_venta(current_user_id, venta_id):
    """Actualizar venta"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"💰 Actualizando venta {venta_id}: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que la venta existe y obtener su estado
        cursor.execute("""
            SELECT estado, usuario_id, DATE(fecha) as fecha_venta 
            FROM ventas 
            WHERE id = %s
        """, (venta_id,))
        
        venta = cursor.fetchone()
        if not venta:
            return jsonify({'message': 'Venta no encontrada'}), 404
        
        # Verificar permisos de edición
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (current_user_id,))
        user_role = cursor.fetchone()
        
        # Solo se puede editar si:
        # 1. La venta está en borrador, O
        # 2. El usuario es admin, O
        # 3. Es el mismo día y el usuario es el creador
        hoy = datetime.now().date()
        puede_editar = (
            venta[0] == 'borrador' or 
            (user_role and user_role[0] == 'admin') or
            (venta[2] == hoy and venta[1] == current_user_id)
        )
        
        if not puede_editar:
            return jsonify({'message': 'No tienes permisos para editar esta venta'}), 403
        
        # Construir consulta de actualización dinámicamente
        campos_actualizables = ['cliente_id', 'numero_venta', 'forma_pago', 'descuento', 'impuestos', 'estado', 'observaciones']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                valores.append(data[campo])
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(venta_id)
        
        query = f"UPDATE ventas SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Venta {venta_id} actualizada exitosamente")
        response = jsonify({'message': 'Venta actualizada exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error actualizando venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['DELETE'])
@jwt_required
def eliminar_venta(current_user_id, venta_id):
    """Eliminar venta"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"💰 Eliminando venta {venta_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que la venta existe y obtener información
        cursor.execute("""
            SELECT estado, usuario_id, DATE(fecha) as fecha_venta, total
            FROM ventas 
            WHERE id = %s
        """, (venta_id,))
        
        venta = cursor.fetchone()
        if not venta:
            return jsonify({'message': 'Venta no encontrada'}), 404
        
        # Verificar permisos de eliminación
        cursor.execute("SELECT rol FROM usuarios WHERE id = %s", (current_user_id,))
        user_role = cursor.fetchone()
        
        hoy = datetime.now().date()
        puede_eliminar = (
            (user_role and user_role[0] == 'admin') or
            (venta[2] == hoy and venta[1] == current_user_id and venta[0] != 'completada')
        )
        
        if not puede_eliminar:
            return jsonify({'message': 'Solo se pueden eliminar ventas del día y no completadas'}), 403
        
        # Iniciar transacción
        cursor.execute("START TRANSACTION")
        
        try:
            # Obtener productos de la venta para restaurar stock
            cursor.execute("""
                SELECT producto_id, cantidad 
                FROM detalle_ventas 
                WHERE venta_id = %s
            """, (venta_id,))
            
            productos_venta = cursor.fetchall()
            
            # Restaurar stock de productos
            for producto_id, cantidad in productos_venta:
                cursor.execute("""
                    UPDATE productos 
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
            
            # Registrar movimiento
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle, usuario_id)
                VALUES ('venta', %s, %s)
            """, (f'Eliminación de venta #{venta_id} por ${venta[3]:.2f}', current_user_id))
            
            # Confirmar transacción
            connection.commit()
            
            logger.info(f"✅ Venta {venta_id} eliminada exitosamente")
            response = jsonify({'message': 'Venta eliminada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200

        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except Exception as e:
        logger.error(f"❌ Error eliminando venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard', methods=['GET'])
@jwt_required
def dashboard(current_user_id):
    """Dashboard principal"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo dashboard para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            dashboard_default = {
                'resumen': {
                    'totalProductos': 0,
                    'ventasDelDia': 0.0,
                    'cantidadVentas': 0,
                    'productosStockBajo': 0
                },
                'ventasRecientes': [],
                'productosStockBajo': [],
                'estadisticas': {
                    'ventasSemana': 0.0,
                    'comprasSemana': 0.0,
                    'clientesActivos': 0,
                    'proveedoresActivos': 0
                }
            }
            response = jsonify(dashboard_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Resumen general
        resumen = {}
        
        # Total de productos
        try:
            cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
            resumen['totalProductos'] = cursor.fetchone()[0] or 0
        except:
            resumen['totalProductos'] = 0
        
        # Ventas del día
        try:
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0), COUNT(*) 
                FROM ventas 
                WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
            """)
            ventas_hoy = cursor.fetchone()
            resumen['ventasDelDia'] = float(ventas_hoy[0]) if ventas_hoy[0] else 0.0
            resumen['cantidadVentas'] = ventas_hoy[1] if ventas_hoy[1] else 0
        except:
            resumen['ventasDelDia'] = 0.0
            resumen['cantidadVentas'] = 0
        
        # Productos con stock bajo
        try:
            cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo AND activo = TRUE")
            resumen['productosStockBajo'] = cursor.fetchone()[0] or 0
        except:
            resumen['productosStockBajo'] = 0
        
        # Ventas recientes (últimas 5)
        ventas_recientes = []
        try:
            cursor.execute("""
                SELECT v.id, v.total, DATE_FORMAT(v.fecha, '%H:%i') as hora,
                       COALESCE(c.nombre, 'Venta rápida') as cliente_nombre
                FROM ventas v
                LEFT JOIN clientes c ON v.cliente_id = c.id
                WHERE DATE(v.fecha) = CURDATE()
                ORDER BY v.fecha DESC
                LIMIT 5
            """)
            
            for row in cursor.fetchall():
                ventas_recientes.append({
                    'id': row[0],
                    'total': float(row[1]),
                    'hora': row[2],
                    'cliente': row[3]
                })
        except:
            pass
        
        # Productos con stock bajo (detalles)
        productos_stock_bajo = []
        try:
            cursor.execute("""
                SELECT nombre, stock_actual, stock_minimo, unidad
                FROM productos 
                WHERE stock_actual <= stock_minimo AND activo = TRUE
                ORDER BY stock_actual ASC
                LIMIT 10
            """)
            
            for row in cursor.fetchall():
                productos_stock_bajo.append({
                    'nombre': row[0],
                    'stock': float(row[1]),
                    'stockMinimo': float(row[2]),
                    'unidad': row[3]
                })
        except:
            pass
        
        # Estadísticas adicionales
        estadisticas = {}
        
        # Ventas de la semana
        try:
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0)
                FROM ventas 
                WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
                AND estado = 'completada'
            """)
            estadisticas['ventasSemana'] = float(cursor.fetchone()[0] or 0)
        except:
            estadisticas['ventasSemana'] = 0.0
        
        # Compras de la semana
        try:
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0)
                FROM compras 
                WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
                AND estado = 'completada'
            """)
            estadisticas['comprasSemana'] = float(cursor.fetchone()[0] or 0)
        except:
            estadisticas['comprasSemana'] = 0.0
        
        # Clientes activos
        try:
            cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo = TRUE")
            estadisticas['clientesActivos'] = cursor.fetchone()[0] or 0
        except:
            estadisticas['clientesActivos'] = 0
        
        # Proveedores activos
        try:
            cursor.execute("SELECT COUNT(*) FROM proveedores WHERE activo = TRUE")
            estadisticas['proveedoresActivos'] = cursor.fetchone()[0] or 0
        except:
            estadisticas['proveedoresActivos'] = 0
        
        dashboard_data = {
            'resumen': resumen,
            'ventasRecientes': ventas_recientes,
            'productosStockBajo': productos_stock_bajo,
            'estadisticas': estadisticas
        }
        
        logger.info(f"✅ Dashboard generado exitosamente")
        response = jsonify(dashboard_data)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error generando dashboard: {e}")
        dashboard_default = {
            'resumen': {
                'totalProductos': 0,
                'ventasDelDia': 0.0,
                'cantidadVentas': 0,
                'productosStockBajo': 0
            },
            'ventasRecientes': [],
            'productosStockBajo': [],
            'estadisticas': {
                'ventasSemana': 0.0,
                'comprasSemana': 0.0,
                'clientesActivos': 0,
                'proveedoresActivos': 0
            }
        }
        response = jsonify(dashboard_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/resumen', methods=['GET'])
@jwt_required
def dashboard_resumen(current_user_id):
    """Resumen del dashboard"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo resumen del dashboard")
        
        connection = get_db_connection()
        if not connection:
            resumen_default = {
                'totalProductos': 0,
                'ventasDelDia': 0.0,
                'cantidadVentas': 0,
                'productosStockBajo': 0
            }
            response = jsonify(resumen_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        resumen = {}
        
        # Total de productos
        try:
            cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
            resumen['totalProductos'] = cursor.fetchone()[0] or 0
        except:
            resumen['totalProductos'] = 0
        
        # Ventas del día
        try:
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0), COUNT(*) 
                FROM ventas 
                WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
            """)
            ventas_hoy = cursor.fetchone()
            resumen['ventasDelDia'] = float(ventas_hoy[0]) if ventas_hoy[0] else 0.0
            resumen['cantidadVentas'] = ventas_hoy[1] if ventas_hoy[1] else 0
        except:
            resumen['ventasDelDia'] = 0.0
            resumen['cantidadVentas'] = 0
        
        # Productos con stock bajo
        try:
            cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo AND activo = TRUE")
            resumen['productosStockBajo'] = cursor.fetchone()[0] or 0
        except:
            resumen['productosStockBajo'] = 0
        
        logger.info(f"✅ Resumen calculado: {resumen}")
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo resumen: {e}")
        resumen_default = {
            'totalProductos': 0,
            'ventasDelDia': 0.0,
            'cantidadVentas': 0,
            'productosStockBajo': 0
        }
        response = jsonify(resumen_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
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
        'version': '2.0.0'
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

@app.route('/', methods=['GET'])
def root():
    """Información de la API"""
    response = jsonify({
        'message': 'API Frutería Nina - Sistema Completo',
        'version': '2.0.0',
        'status': 'running',
        'modules': {
            'authentication': '✅ Completo',
            'suppliers': '✅ Completo',
            'purchases': '✅ Completo',
            'clients': '✅ Completo',
            'inventory': '✅ Completo',
            'sales': '✅ Completo',
            'dashboard': '✅ Completo'
        },
        'endpoints': {
            'auth': ['/api/register', '/api/login', '/api/verify-token'],
            'proveedores': ['/api/proveedores', '/api/proveedores/<id>'],
            'compras': ['/api/compras', '/api/compras/<id>', '/api/compras/estadisticas'],
            'clientes': ['/api/clientes', '/api/clientes/<id>'],
            'inventario': ['/api/inventario', '/api/inventario/<id>'],
            'ventas': ['/api/ventas', '/api/ventas/<id>'],
            'dashboard': ['/api/dashboard', '/api/dashboard/resumen'],
            'system': ['/api/health', '/']
        },
        'features': [
            'JWT Authentication',
            'Automatic Stock Management',
            'Transaction Support',
            'Comprehensive Validation',
            'Error Handling',
            'CORS Configuration',
            'Detailed Logging',
            'Sample Data'
        ]
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def not_found(error):
    response = jsonify({
        'message': 'Endpoint no encontrado',
        'error': 'Not Found',
        'status_code': 404
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

@app.errorhandler(400)
def bad_request(error):
    response = jsonify({
        'message': 'Solicitud incorrecta',
        'error': 'Bad Request',
        'status_code': 400
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 400

@app.errorhandler(401)
def unauthorized(error):
    response = jsonify({
        'message': 'No autorizado',
        'error': 'Unauthorized',
        'status_code': 401
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 401

@app.errorhandler(403)
def forbidden(error):
    response = jsonify({
        'message': 'Acceso prohibido',
        'error': 'Forbidden',
        'status_code': 403
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 403

@app.errorhandler(409)
def conflict(error):
    response = jsonify({
        'message': 'Conflicto en la solicitud',
        'error': 'Conflict',
        'status_code': 409
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 409

# ==================== FUNCIÓN PRINCIPAL ====================

if __name__ == '__main__':
    print("🚀 Iniciando Frutería Nina Backend - Sistema Completo...")
    print("=" * 80)
    
    # Inicializar base de datos
    init_database()
    
    print("=" * 80)
    print("✅ ¡Sistema Completo Listo!")
    print("🌐 Servidor Flask iniciado en: http://localhost:5001")
    print("🎯 Frontend esperado en: http://localhost:3000")
    print("")
    print("📋 MÓDULOS DISPONIBLES:")
    print("")
    print("🔐 AUTENTICACIÓN (3 endpoints):")
    print("   - POST /api/register          - Registro de usuarios")
    print("   - POST /api/login             - Inicio de sesión")
    print("   - GET  /api/verify-token      - Verificación de token JWT")
    print("")
    print("🏪 PROVEEDORES (4 endpoints):")
    print("   - GET  /api/proveedores       - Listar proveedores con búsqueda")
    print("   - POST /api/proveedores       - Crear nuevo proveedor")
    print("   - PUT  /api/proveedores/<id>  - Actualizar proveedor")
    print("   - DELETE /api/proveedores/<id> - Eliminar proveedor")
    print("")
    print("🛒 COMPRAS (5 endpoints):")
    print("   - GET  /api/compras           - Listar compras con filtros")
    print("   - POST /api/compras           - Crear compra (actualiza stock automáticamente)")
    print("   - GET  /api/compras/<id>      - Obtener detalle de compra")
    print("   - PUT  /api/compras/<id>      - Actualizar compra")
    print("   - DELETE /api/compras/<id>    - Eliminar compra (revierte stock)")
    print("   - GET  /api/compras/estadisticas - Estadísticas de compras")
    print("")
    print("👥 CLIENTES (4 endpoints):")
    print("   - GET  /api/clientes          - Listar clientes")
    print("   - POST /api/clientes          - Crear cliente")
    print("   - PUT  /api/clientes/<id>     - Actualizar cliente")
    print("   - DELETE /api/clientes/<id>   - Eliminar cliente")
    print("")
    print("📦 INVENTARIO (4 endpoints):")
    print("   - GET  /api/inventario        - Listar productos")
    print("   - POST /api/inventario        - Crear producto")
    print("   - PUT  /api/inventario/<id>   - Actualizar producto")
    print("   - DELETE /api/inventario/<id> - Eliminar producto")
    print("")
    print("💰 VENTAS (5 endpoints):")
    print("   - POST /api/ventas            - Crear venta")
    print("   - GET  /api/ventas            - Listar ventas")
    print("   - GET  /api/ventas/<id>       - Obtener detalle de venta")
    print("   - PUT  /api/ventas/<id>       - Actualizar venta")
    print("   - DELETE /api/ventas/<id>     - Eliminar venta")
    print("")
    print("📊 DASHBOARD (2 endpoints):")
    print("   - GET  /api/dashboard         - Dashboard principal")
    print("   - GET  /api/dashboard/resumen - Resumen del dashboard")
    print("")
    print("🔧 SISTEMA (2 endpoints):")
    print("   - GET  /api/health            - Estado del servidor")
    print("   - GET  /                      - Información de la API")
    print("")
    print("✨ CARACTERÍSTICAS PRINCIPALES:")
    print("   ✅ Base de datos completa con todas las tablas necesarias")
    print("   ✅ Transacciones para operaciones críticas")
    print("   ✅ Actualización automática de stock en compras y ventas")
    print("   ✅ Validaciones robustas en todos los endpoints")
    print("   ✅ Manejo de errores completo")
    print("   ✅ CORS configurado para el frontend")
    print("   ✅ JWT authentication con decorador")
    print("   ✅ Logging detallado para debugging")
    print("   ✅ Datos de ejemplo para testing")
    print("")
    print("🗄️  BASE DE DATOS:")
    print("   - Host: localhost")
    print("   - Usuario: fruteria_user")
    print("   - Base de datos: fruteria_nina")
    print("   - Tablas: usuarios, proveedores, clientes, productos, compras,")
    print("            detalle_compras, ventas, detalle_ventas, movimientos_stock, movimientos")
    print("")
    print("🔐 AUTENTICACIÓN:")
    print("   - JWT con expiración de 24 horas")
    print("   - Usuario administrador: admin@fruteria.com / admin123")
    print("   - Roles: admin, operador")
    print("")
    print("📊 FUNCIONALIDADES AVANZADAS:")
    print("   - Control de stock automático")
    print("   - Historial de movimientos")
    print("   - Estadísticas en tiempo real")
    print("   - Filtros y búsquedas avanzadas")
    print("   - Validación de permisos por rol")
    print("   - Transacciones seguras")
    print("   - Manejo de estados (borrador, completada, cancelada)")
    print("")
    print("=" * 80)
    print("🎉 ¡Servidor listo para recibir peticiones!")
    print("💡 Presiona Ctrl+C para detener el servidor")
    print("🔗 Documentación completa disponible en el endpoint raíz: /")
    print("=" * 80)

    # Iniciar el servidor Flask
    app.run(
        debug=True, 
        port=5001, 
        host='0.0.0.0',
        threaded=True
    )