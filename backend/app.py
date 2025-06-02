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
            logger.info("✅ Conexión a la base de datos establecida")
            return connection
        else:
            logger.error("❌ No se pudo establecer conexión a la base de datos")
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
        connection = get_db_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
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

        # Verificar si las tablas ya existen
        cursor.execute("SHOW TABLES")
        existing_tables = [table[0] for table in cursor.fetchall()]

        if existing_tables:
            logger.info(f"✅ Base de datos existente con {len(existing_tables)} tablas")
            logger.info("📋 Tablas existentes: " + ", ".join(existing_tables))
            
            # Verificar usuario administrador
            try:
                cursor.execute("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin'")
                admin_count = cursor.fetchone()[0]
                if admin_count == 0:
                    logger.info("🔧 Creando usuario administrador...")
                    hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
                    cursor.execute(
                        "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (%s, %s, %s, %s)",
                        ('Administrador', 'admin@fruteria.com', hashed_password, 'admin')
                    )
                    connection.commit()
                    logger.info("✅ Usuario administrador creado")
                else:
                    logger.info(f"✅ Usuario administrador ya existe ({admin_count} admin(s))")
            except Exception as e:
                logger.warning(f"⚠️ Error verificando usuario administrador: {e}")
            
            return True
        
        # Si no hay tablas, crear toda la estructura
        logger.info("🔧 Creando estructura de base de datos...")
        
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
        
        # Crear usuario administrador
        hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (%s, %s, %s, %s)",
            ('Administrador', 'admin@fruteria.com', hashed_password, 'admin')
        )
        logger.info("✅ Usuario administrador creado")
        
        # Insertar datos de ejemplo para proveedores
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
        logger.info("✅ Base de datos inicializada correctamente con datos de ejemplo")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error inicializando base de datos: {e}")
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
            return jsonify({'message': 'OK'}), 200
        
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'message': 'Token de autorización requerido'}), 401

        try:
            token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        except Exception as e:
            logger.error(f"Error validando token: {e}")
            return jsonify({'message': 'Token inválido'}), 401
            
        return f(current_user_id, *args, **kwargs)
    return decorated

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
            return jsonify({'message': 'El usuario ya existe'}), 409
        
        # Hashear contraseña
        hashed_password = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())
        
        # Insertar usuario
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (%s, %s, %s, %s)",
            (nombre, correo, hashed_password, 'operador')
        )
        
        connection.commit()
        
        response = jsonify({
            'message': 'Usuario registrado exitosamente',
            'success': True
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error registrando usuario: {e}")
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
            return jsonify({'message': 'Faltan campos requeridos: correo, contraseña'}), 400
        
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
            return jsonify({'message': 'Correo o contraseña incorrectos'}), 401

        # Generar token JWT
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }, app.config['SECRET_KEY'], algorithm='HS256')

        logger.info(f"Login exitoso para usuario: {correo}")
        response = jsonify({
            'token': token,
            'user': {
                'id': user[0],
                'nombre': user[1],
                'correo': correo,
                'rol': user[3]
            }
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error en login: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/verify-token', methods=['GET'])
@jwt_required
def verify_token(current_user_id):
    """Verificar validez del token"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
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
        
        # Verificar nombre único si se está actualizando
        if 'nombre' in data:
            cursor.execute(
                "SELECT id FROM proveedores WHERE nombre = %s AND id != %s", 
                (data['nombre'].strip(), proveedor_id)
            )
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un proveedor con este nombre'}), 409
        
        # Actualizar proveedor
        query = f"UPDATE proveedores SET {', '.join(campos_a_actualizar)} WHERE id = %s"
        valores.append(proveedor_id)
        
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Proveedor {proveedor_id} actualizado")
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
    """Eliminar proveedor (soft delete)"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🏪 Eliminando proveedor {proveedor_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el proveedor existe
        cursor.execute("SELECT id FROM proveedores WHERE id = %s", (proveedor_id,))
        if not cursor.fetchone():
            return jsonify({'message': 'Proveedor no encontrado'}), 404
        
        # Verificar si tiene productos asociados
        cursor.execute("SELECT COUNT(*) FROM productos WHERE proveedor_id = %s", (proveedor_id,))
        productos_count = cursor.fetchone()[0]
        
        if productos_count > 0:
            # Soft delete - marcar como inactivo
            cursor.execute("UPDATE proveedores SET activo = FALSE WHERE id = %s", (proveedor_id,))
            mensaje = f'Proveedor desactivado (tiene {productos_count} productos asociados)'
        else:
            # Hard delete si no tiene productos
            cursor.execute("DELETE FROM proveedores WHERE id = %s", (proveedor_id,))
            mensaje = 'Proveedor eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"✅ {mensaje}")
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

# ==================== ENDPOINTS DE CLIENTES ====================

@app.route('/api/clientes', methods=['GET'])
@jwt_required
def obtener_clientes(current_user_id):
    """Listar clientes con búsqueda"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"👥 Obteniendo clientes para usuario {current_user_id}")
        
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
    """Crear nuevo cliente"""
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
        
        # Verificar correo único si se proporciona
        correo = data.get('correo', '').strip()
        if correo:
            cursor.execute("SELECT id FROM clientes WHERE correo = %s", (correo,))
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un cliente con este correo'}), 409
        
        # Insertar cliente
        cursor.execute("""
            INSERT INTO clientes (nombre, correo, telefono, direccion, notas)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            correo or None,
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
        
        # Verificar correo único si se está actualizando
        if 'correo' in data and data['correo'].strip():
            cursor.execute(
                "SELECT id FROM clientes WHERE correo = %s AND id != %s", 
                (data['correo'].strip(), cliente_id)
            )
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe un cliente con este correo'}), 409
        
        # Actualizar cliente
        query = f"UPDATE clientes SET {', '.join(campos_a_actualizar)} WHERE id = %s"
        valores.append(cliente_id)
        
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Cliente {cliente_id} actualizado")
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
    """Eliminar cliente (soft delete)"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"👥 Eliminando cliente {cliente_id}")
        
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
            mensaje = f'Cliente desactivado (tiene {ventas_count} ventas asociadas)'
        else:
            # Hard delete si no tiene ventas
            cursor.execute("DELETE FROM clientes WHERE id = %s", (cliente_id,))
            mensaje = 'Cliente eliminado exitosamente'
        
        connection.commit()
        
        logger.info(f"✅ {mensaje}")
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

@app.route('/api/clientes/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_clientes(current_user_id):
    """Estadísticas de clientes"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo estadísticas de clientes")
        
        connection = get_db_connection()
        if not connection:
            estadisticas_default = {
                'total_clientes': 0,
                'clientes_mes': 0,
                'cliente_frecuente': 'N/A',
                'ventas_por_cliente': 0.0,
                'clientes_activos': 0,
                'clientes_con_ventas': 0,
                'promedio_compras_cliente': 0.0
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Total de clientes
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo = TRUE")
        total_clientes = cursor.fetchone()[0] or 0
        
        # Clientes nuevos del mes actual
        cursor.execute("""
            SELECT COUNT(*) 
            FROM clientes 
            WHERE YEAR(creado) = YEAR(CURDATE()) 
            AND MONTH(creado) = MONTH(CURDATE())
            AND activo = TRUE
        """)
        clientes_mes = cursor.fetchone()[0] or 0
        
        # Cliente más frecuente (con más ventas)
        cursor.execute("""
            SELECT c.nombre, COUNT(*) as frecuencia
            FROM ventas v
            INNER JOIN clientes c ON v.cliente_id = c.id
            WHERE v.estado = 'completada'
            GROUP BY c.id, c.nombre 
            ORDER BY frecuencia DESC 
            LIMIT 1
        """)
        cliente_frecuente = cursor.fetchone()
        cliente_top = cliente_frecuente[0] if cliente_frecuente else 'N/A'
        
        # Promedio de ventas por cliente
        cursor.execute("""
            SELECT AVG(total_por_cliente) 
            FROM (
                SELECT SUM(v.total) as total_por_cliente
                FROM ventas v
                WHERE v.cliente_id IS NOT NULL AND v.estado = 'completada'
                GROUP BY v.cliente_id
            ) as subquery
        """)
        ventas_por_cliente = cursor.fetchone()[0]
        ventas_por_cliente = float(ventas_por_cliente) if ventas_por_cliente else 0.0
        
        # Clientes activos
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo = TRUE")
        clientes_activos = cursor.fetchone()[0] or 0
        
        # Clientes con al menos una venta
        cursor.execute("""
            SELECT COUNT(DISTINCT cliente_id) 
            FROM ventas 
            WHERE cliente_id IS NOT NULL AND estado = 'completada'
        """)
        clientes_con_ventas = cursor.fetchone()[0] or 0
        
        # Promedio de compras por cliente
        cursor.execute("""
            SELECT AVG(compras_por_cliente) 
            FROM (
                SELECT COUNT(*) as compras_por_cliente
                FROM ventas v
                WHERE v.cliente_id IS NOT NULL AND v.estado = 'completada'
                GROUP BY v.cliente_id
            ) as subquery
        """)
        promedio_compras = cursor.fetchone()[0]
        promedio_compras_cliente = float(promedio_compras) if promedio_compras else 0.0
        
        estadisticas = {
            'total_clientes': total_clientes,
            'clientes_mes': clientes_mes,
            'cliente_frecuente': cliente_top,
            'ventas_por_cliente': ventas_por_cliente,
            'clientes_activos': clientes_activos,
            'clientes_con_ventas': clientes_con_ventas,
            'promedio_compras_cliente': promedio_compras_cliente
        }
        
        logger.info(f"✅ Estadísticas de clientes calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas de clientes: {e}")
        estadisticas_default = {
            'total_clientes': 0,
            'clientes_mes': 0,
            'cliente_frecuente': 'N/A',
            'ventas_por_cliente': 0.0,
            'clientes_activos': 0,
            'clientes_con_ventas': 0,
            'promedio_compras_cliente': 0.0
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE PRODUCTOS ====================

@app.route('/api/productos', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Listar productos con búsqueda y filtros"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Obteniendo productos para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de búsqueda
        search = request.args.get('q', '').strip()
        categoria = request.args.get('categoria', '').strip()
        activo = request.args.get('activo', 'true').lower() == 'true'
        stock_bajo = request.args.get('stock_bajo', 'false').lower() == 'true'
        
        # Construir consulta
        query = """
            SELECT p.id, p.nombre, p.categoria, p.unidad, p.stock_actual, p.stock_minimo, 
                   p.precio_unitario, p.activo, p.creado, pr.nombre as proveedor_nombre
            FROM productos p
            LEFT JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE p.activo = %s
        """
        params = [activo]
        
        if search:
            query += " AND p.nombre LIKE %s"
            params.append(f"%{search}%")
        
        if categoria:
            query += " AND p.categoria = %s"
            params.append(categoria)
        
        if stock_bajo:
            query += " AND p.stock_actual <= p.stock_minimo"
        
        query += " ORDER BY p.nombre ASC"
        
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
                'proveedor_nombre': row[9] or 'Sin proveedor'
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

@app.route('/api/productos', methods=['POST'])
@jwt_required
def crear_producto(current_user_id):
    """Crear nuevo producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"📦 Creando producto: {data}")
        
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
            float(data['precio_unitario']),
            data.get('proveedor_id') or None
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

@app.route('/api/productos/<int:producto_id>', methods=['PUT'])
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
        
        # Construir consulta de actualización
        campos_actualizables = ['nombre', 'categoria', 'unidad', 'stock_actual', 'stock_minimo', 
                               'precio_unitario', 'proveedor_id', 'activo']
        campos_a_actualizar = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                if campo in ['stock_actual', 'stock_minimo', 'precio_unitario']:
                    campos_a_actualizar.append(f"{campo} = %s")
                    valores.append(float(data[campo]))
                elif campo == 'activo':
                    campos_a_actualizar.append(f"{campo} = %s")
                    valores.append(bool(data[campo]))
                elif campo == 'proveedor_id':
                    campos_a_actualizar.append(f"{campo} = %s")
                    valores.append(data[campo] if data[campo] else None)
                else:
                    campos_a_actualizar.append(f"{campo} = %s")
                    valor = data[campo].strip() if isinstance(data[campo], str) else data[campo]
                    valores.append(valor)
        
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
        
        cursor.execute(query, valores)
        connection.commit()
        
        logger.info(f"✅ Producto {producto_id} actualizado")
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


@app.route('/api/productos/<int:producto_id>', methods=['DELETE'])
@jwt_required
def eliminar_producto(current_user_id, producto_id):
    """Eliminar producto (soft delete)"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Eliminando producto {producto_id}")
        
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
        
        logger.info(f"✅ {mensaje}")
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

@app.route('/api/productos/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_productos(current_user_id):
    """Estadísticas de productos e inventario"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo estadísticas de productos")
        
        connection = get_db_connection()
        if not connection:
            estadisticas_default = {
                'total_productos': 0,
                'productos_activos': 0,
                'stock_bajo': 0,
                'valor_inventario': 0.0,
                'productos_sin_stock': 0,
                'categoria_mas_productos': 'N/A',
                'producto_mas_caro': 'N/A',
                'promedio_precio': 0.0
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Total de productos
        cursor.execute("SELECT COUNT(*) FROM productos")
        total_productos = cursor.fetchone()[0] or 0
        
        # Productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        productos_activos = cursor.fetchone()[0] or 0
        
        # Productos con stock bajo
        cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo AND activo = TRUE")
        stock_bajo = cursor.fetchone()[0] or 0
        
        # Valor total del inventario
        cursor.execute("SELECT SUM(stock_actual * precio_unitario) FROM productos WHERE activo = TRUE")
        valor_inventario = cursor.fetchone()[0]
        valor_inventario = float(valor_inventario) if valor_inventario else 0.0
        
        # Productos sin stock
        cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual = 0 AND activo = TRUE")
        productos_sin_stock = cursor.fetchone()[0] or 0
        
        # Categoría con más productos
        cursor.execute("""
            SELECT categoria, COUNT(*) as cantidad
            FROM productos 
            WHERE activo = TRUE
            GROUP BY categoria 
            ORDER BY cantidad DESC 
            LIMIT 1
        """)
        categoria_top = cursor.fetchone()
        categoria_mas_productos = categoria_top[0] if categoria_top else 'N/A'
        
        # Producto más caro
        cursor.execute("""
            SELECT nombre, precio_unitario
            FROM productos 
            WHERE activo = TRUE
            ORDER BY precio_unitario DESC 
            LIMIT 1
        """)
        producto_caro = cursor.fetchone()
        producto_mas_caro = producto_caro[0] if producto_caro else 'N/A'
        
        # Promedio de precios
        cursor.execute("SELECT AVG(precio_unitario) FROM productos WHERE activo = TRUE")
        promedio_precio = cursor.fetchone()[0]
        promedio_precio = float(promedio_precio) if promedio_precio else 0.0
        
        estadisticas = {
            'total_productos': total_productos,
            'productos_activos': productos_activos,
            'stock_bajo': stock_bajo,
            'valor_inventario': valor_inventario,
            'productos_sin_stock': productos_sin_stock,
            'categoria_mas_productos': categoria_mas_productos,
            'producto_mas_caro': producto_mas_caro,
            'promedio_precio': promedio_precio
        }
        
        logger.info(f"✅ Estadísticas de productos calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas de productos: {e}")
        estadisticas_default = {
            'total_productos': 0,
            'productos_activos': 0,
            'stock_bajo': 0,
            'valor_inventario': 0.0,
            'productos_sin_stock': 0,
            'categoria_mas_productos': 'N/A',
            'producto_mas_caro': 'N/A',
            'promedio_precio': 0.0
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
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
        logger.info(f"💰 Obteniendo ventas para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        cliente_id = request.args.get('cliente_id')
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

@app.route('/api/ventas', methods=['POST'])
@jwt_required
def crear_venta(current_user_id):
    """Crear nueva venta"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"💰 Creando venta: {data}")
        
        if not data or not data.get('productos') or not isinstance(data['productos'], list):
            return jsonify({'message': 'Faltan productos en la venta'}), 400
        
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
            if not stock_result:
                return jsonify({'message': f'Producto {producto["producto_id"]} no encontrado'}), 404
            
            if float(stock_result[0]) < float(producto['cantidad']):
                return jsonify({'message': f'Stock insuficiente para producto {producto["producto_id"]}'}), 400
        
        # Calcular totales
        subtotal = 0
        for producto in data['productos']:
            subtotal += float(producto['cantidad']) * float(producto['precio_unitario'])
        
        descuento = float(data.get('descuento', 0))
        impuestos = float(data.get('impuestos', 0))
        total = subtotal - descuento + impuestos
        
        # Insertar venta
        cursor.execute("""
            INSERT INTO ventas (cliente_id, usuario_id, numero_venta, forma_pago, subtotal, descuento, impuestos, total, observaciones)
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
                VALUES (%s, 'egreso', %s, 'Venta', %s, 'venta', %s)
            """, (
                producto['producto_id'],
                float(producto['cantidad']),
                venta_id,
                current_user_id
            ))
        
        connection.commit()
        
        logger.info(f"✅ Venta creada: ID {venta_id}, Total: ${total}")
        response = jsonify({
            'message': 'Venta creada exitosamente',
            'id': venta_id,
            'total': total
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error creando venta: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['GET'])
@jwt_required
def obtener_venta_detalle(current_user_id, venta_id):
    """Obtener detalle de una venta específica"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"💰 Obteniendo detalle de venta {venta_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener datos de la venta
        cursor.execute("""
            SELECT v.id, v.numero_venta, v.fecha, v.forma_pago, v.subtotal, v.descuento, 
                   v.impuestos, v.total, v.estado, v.observaciones,
                   c.nombre as cliente_nombre, u.nombre as usuario_nombre
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
            SELECT dv.producto_id, dv.cantidad, dv.precio_unitario, dv.subtotal,
                   p.nombre as producto_nombre, p.unidad
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            WHERE dv.venta_id = %s
        """, (venta_id,))
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'producto_id': row[0],
                'cantidad': float(row[1]),
                'precio_unitario': float(row[2]),
                'subtotal': float(row[3]),
                'producto_nombre': row[4],
                'unidad': row[5]
            }
            productos.append(producto)
        
        # Construir respuesta
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
            'observaciones': venta_data[9] or '',
            'cliente_nombre': venta_data[10] or 'Cliente General',
            'usuario_nombre': venta_data[11] or 'Usuario desconocido',
            'productos': productos
        }
        
        logger.info(f"✅ Detalle de venta {venta_id} obtenido")
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

@app.route('/api/ventas/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_ventas(current_user_id):
    """Estadísticas de ventas"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo estadísticas de ventas")
        
        connection = get_db_connection()
        if not connection:
            estadisticas_default = {
                'total_ventas': 0,
                'ventas_mes': 0,
                'total_ingresos': 0.0,
                'ingresos_mes': 0.0,
                'promedio_venta': 0.0,
                'forma_pago_popular': 'efectivo',
                'productos_vendidos': 0,
                'ventas_hoy': 0,
                'ingresos_hoy': 0.0
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Total de ventas
        cursor.execute("SELECT COUNT(*) FROM ventas WHERE estado = 'completada'")
        total_ventas = cursor.fetchone()[0] or 0
        
        # Ventas del mes actual
        cursor.execute("""
            SELECT COUNT(*) 
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        ventas_mes = cursor.fetchone()[0] or 0
        
        # Total de ingresos
        cursor.execute("SELECT SUM(total) FROM ventas WHERE estado = 'completada'")
        total_ingresos = cursor.fetchone()[0]
        total_ingresos = float(total_ingresos) if total_ingresos else 0.0
        
        # Ingresos del mes actual
        cursor.execute("""
            SELECT SUM(total) 
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        ingresos_mes = cursor.fetchone()[0]
        ingresos_mes = float(ingresos_mes) if ingresos_mes else 0.0
        
        # Promedio por venta
        promedio_venta = total_ingresos / total_ventas if total_ventas > 0 else 0.0
        
        # Forma de pago más popular
        cursor.execute("""
            SELECT forma_pago, COUNT(*) as frecuencia
            FROM ventas 
            WHERE estado = 'completada'
            GROUP BY forma_pago 
            ORDER BY frecuencia DESC 
            LIMIT 1
        """)
        forma_pago_result = cursor.fetchone()
        forma_pago_popular = forma_pago_result[0] if forma_pago_result else 'efectivo'
        
        # Total de productos vendidos (cantidad)
        cursor.execute("""
            SELECT SUM(dv.cantidad) 
            FROM detalle_ventas dv
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE v.estado = 'completada'
        """)
        productos_vendidos = cursor.fetchone()[0]
        productos_vendidos = float(productos_vendidos) if productos_vendidos else 0.0
        
        # Ventas de hoy
        cursor.execute("""
            SELECT COUNT(*) 
            FROM ventas 
            WHERE DATE(fecha) = CURDATE()
            AND estado = 'completada'
        """)
        ventas_hoy = cursor.fetchone()[0] or 0
        
        # Ingresos de hoy
        cursor.execute("""
            SELECT SUM(total) 
            FROM ventas 
            WHERE DATE(fecha) = CURDATE()
            AND estado = 'completada'
        """)
        ingresos_hoy = cursor.fetchone()[0]
        ingresos_hoy = float(ingresos_hoy) if ingresos_hoy else 0.0
        
        estadisticas = {
            'total_ventas': total_ventas,
            'ventas_mes': ventas_mes,
            'total_ingresos': total_ingresos,
            'ingresos_mes': ingresos_mes,
            'promedio_venta': promedio_venta,
            'forma_pago_popular': forma_pago_popular,
            'productos_vendidos': int(productos_vendidos),
            'ventas_hoy': ventas_hoy,
            'ingresos_hoy': ingresos_hoy
        }
        
        logger.info(f"✅ Estadísticas de ventas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas de ventas: {e}")
        estadisticas_default = {
            'total_ventas': 0,
            'ventas_mes': 0,
            'total_ingresos': 0.0,
            'ingresos_mes': 0.0,
            'promedio_venta': 0.0,
            'forma_pago_popular': 'efectivo',
            'productos_vendidos': 0,
            'ventas_hoy': 0,
            'ingresos_hoy': 0.0
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard', methods=['GET'])
@jwt_required
def obtener_dashboard(current_user_id):
    """Datos del dashboard principal"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo datos del dashboard para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            dashboard_default = {
                'ventas_hoy': {'cantidad': 0, 'total': 0.0},
                'ventas_mes': {'cantidad': 0, 'total': 0.0},
                'productos_bajo_stock': 0,
                'total_productos': 0,
                'total_clientes': 0,
                'actividad_reciente': [],
                'productos_mas_vendidos': [],
                'ventas_por_dia': []
            }
            response = jsonify(dashboard_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Ventas de hoy
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
        """)
        ventas_hoy_data = cursor.fetchone()
        ventas_hoy = {
            'cantidad': ventas_hoy_data[0] or 0,
            'total': float(ventas_hoy_data[1]) if ventas_hoy_data[1] else 0.0
        }
        
        # Ventas del mes
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        ventas_mes_data = cursor.fetchone()
        ventas_mes = {
            'cantidad': ventas_mes_data[0] or 0,
            'total': float(ventas_mes_data[1]) if ventas_mes_data[1] else 0.0
        }
        
        # Productos con stock bajo
        cursor.execute("""
            SELECT COUNT(*) 
            FROM productos 
            WHERE stock_actual <= stock_minimo AND activo = TRUE
        """)
        productos_bajo_stock = cursor.fetchone()[0] or 0
        
        # Total de productos activos
        cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
        total_productos = cursor.fetchone()[0] or 0
        
        # Total de clientes activos
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo = TRUE")
        total_clientes = cursor.fetchone()[0] or 0
        
        # Actividad reciente (últimas 10 ventas)
        cursor.execute("""
            SELECT v.id, v.total, v.fecha, c.nombre as cliente_nombre
            FROM ventas v
            LEFT JOIN clientes c ON v.cliente_id = c.id
            WHERE v.estado = 'completada'
            ORDER BY v.fecha DESC
            LIMIT 10
        """)
        actividad_reciente = []
        for row in cursor.fetchall():
            actividad = {
                'id': row[0],
                'total': float(row[1]),
                'fecha': row[2].isoformat() if row[2] else None,
                'cliente_nombre': row[3] or 'Cliente General'
            }
            actividad_reciente.append(actividad)
        
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
        
        # Ventas por día (últimos 7 días)
        cursor.execute("""
            SELECT DATE(v.fecha) as fecha, COUNT(*) as cantidad, SUM(v.total) as total
            FROM ventas v
            WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND v.estado = 'completada'
            GROUP BY DATE(v.fecha)
            ORDER BY fecha ASC
        """)
        ventas_por_dia = []
        for row in cursor.fetchall():
            dia = {
                'fecha': row[0].isoformat() if row[0] else None,
                'cantidad': row[1] or 0,
                'total': float(row[2]) if row[2] else 0.0
            }
            ventas_por_dia.append(dia)
        
        dashboard = {
            'ventas_hoy': ventas_hoy,
            'ventas_mes': ventas_mes,
            'productos_bajo_stock': productos_bajo_stock,
            'total_productos': total_productos,
            'total_clientes': total_clientes,
            'actividad_reciente': actividad_reciente,
            'productos_mas_vendidos': productos_mas_vendidos,
            'ventas_por_dia': ventas_por_dia
        }
        
        logger.info(f"✅ Datos del dashboard obtenidos")
        response = jsonify(dashboard)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo datos del dashboard: {e}")
        dashboard_default = {
            'ventas_hoy': {'cantidad': 0, 'total': 0.0},
            'ventas_mes': {'cantidad': 0, 'total': 0.0},
            'productos_bajo_stock': 0,
            'total_productos': 0,
            'total_clientes': 0,
            'actividad_reciente': [],
            'productos_mas_vendidos': [],
            'ventas_por_dia': []
        }
        response = jsonify(dashboard_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE DASHBOARD ADICIONALES ====================

@app.route('/api/dashboard/compras-recientes', methods=['GET'])
@jwt_required
def obtener_compras_recientes(current_user_id):
    """Obtener compras recientes para el dashboard"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🛒 Obteniendo compras recientes para dashboard")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener últimas 10 compras
        cursor.execute("""
            SELECT c.id, c.total, c.fecha, p.nombre as proveedor_nombre, c.numero_factura
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            WHERE c.estado = 'completada'
            ORDER BY c.fecha DESC
            LIMIT 10
        """)
        
        compras_recientes = []
        for row in cursor.fetchall():
            compra = {
                'id': row[0],
                'total': float(row[1]),
                'fecha': row[2].isoformat() if row[2] else None,
                'proveedor_nombre': row[3] or 'Sin proveedor',
                'numero_factura': row[4] or ''
            }
            compras_recientes.append(compra)
        
        logger.info(f"✅ Compras recientes obtenidas: {len(compras_recientes)}")
        response = jsonify(compras_recientes)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo compras recientes: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/ventas-mensuales', methods=['GET'])
@jwt_required
def obtener_ventas_mensuales(current_user_id):
    """Obtener datos de ventas mensuales para gráficos"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Obteniendo ventas mensuales para dashboard")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener ventas de los últimos 12 meses
        cursor.execute("""
            SELECT 
                YEAR(fecha) as año,
                MONTH(fecha) as mes,
                COUNT(*) as cantidad,
                SUM(total) as total
            FROM ventas 
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            AND estado = 'completada'
            GROUP BY YEAR(fecha), MONTH(fecha)
            ORDER BY año ASC, mes ASC
        """)
        
        ventas_mensuales = []
        for row in cursor.fetchall():
            venta_mes = {
                'año': row[0],
                'mes': row[1],
                'cantidad': row[2] or 0,
                'total': float(row[3]) if row[3] else 0.0
            }
            ventas_mensuales.append(venta_mes)
        
        logger.info(f"✅ Ventas mensuales obtenidas: {len(ventas_mensuales)}")
        response = jsonify(ventas_mensuales)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo ventas mensuales: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/stock-distribucion', methods=['GET'])
@jwt_required
def obtener_stock_distribucion(current_user_id):
    """Obtener distribución de stock por categorías"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Obteniendo distribución de stock para dashboard")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener distribución por categorías
        cursor.execute("""
            SELECT 
                categoria,
                COUNT(*) as cantidad_productos,
                SUM(stock_actual) as stock_total,
                SUM(stock_actual * precio_unitario) as valor_total
            FROM productos 
            WHERE activo = TRUE
            GROUP BY categoria
            ORDER BY cantidad_productos DESC
        """)
        
        distribucion_stock = []
        for row in cursor.fetchall():
            categoria = {
                'categoria': row[0],
                'cantidad_productos': row[1] or 0,
                'stock_total': float(row[2]) if row[2] else 0.0,
                'valor_total': float(row[3]) if row[3] else 0.0
            }
            distribucion_stock.append(categoria)
        
        logger.info(f"✅ Distribución de stock obtenida: {len(distribucion_stock)}")
        response = jsonify(distribucion_stock)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo distribución de stock: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/ultimos-movimientos', methods=['GET'])
@jwt_required
def obtener_ultimos_movimientos(current_user_id):
    """Obtener últimos movimientos de stock"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Obteniendo últimos movimientos para dashboard")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener últimos 15 movimientos
        cursor.execute("""
            SELECT 
                ms.id,
                ms.tipo,
                ms.cantidad,
                ms.motivo,
                ms.fecha,
                p.nombre as producto_nombre,
                u.nombre as usuario_nombre
            FROM movimientos_stock ms
            INNER JOIN productos p ON ms.producto_id = p.id
            LEFT JOIN usuarios u ON ms.usuario_id = u.id
            ORDER BY ms.fecha DESC
            LIMIT 15
        """)
        
        ultimos_movimientos = []
        for row in cursor.fetchall():
            movimiento = {
                'id': row[0],
                'tipo': row[1],
                'cantidad': float(row[2]),
                'motivo': row[3] or '',
                'fecha': row[4].isoformat() if row[4] else None,
                'producto_nombre': row[5],
                'usuario_nombre': row[6] or 'Sistema'
            }
            ultimos_movimientos.append(movimiento)
        
        logger.info(f"✅ Últimos movimientos obtenidos: {len(ultimos_movimientos)}")
        response = jsonify(ultimos_movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo últimos movimientos: {e}")
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
    """Listar movimientos de stock"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📦 Obteniendo movimientos de stock")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        producto_id = request.args.get('producto_id')
        tipo = request.args.get('tipo')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        
        # Construir consulta
        query = """
            SELECT ms.id, ms.tipo, ms.cantidad, ms.motivo, ms.fecha,
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
        
        query += " ORDER BY ms.fecha DESC LIMIT 100"
        
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
                'usuario_nombre': row[6] or 'Sistema'
            }
            movimientos.append(movimiento)
        
        logger.info(f"✅ Movimientos de stock obtenidos: {len(movimientos)}")
        response = jsonify(movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo movimientos de stock: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/movimientos-stock', methods=['POST'])
@jwt_required
def crear_movimiento_stock(current_user_id):
    """Crear ajuste de stock manual"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"📦 Creando movimiento de stock: {data}")
        
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
        
        # Registrar movimiento
        cursor.execute("""
            INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_tipo, usuario_id)
            VALUES (%s, %s, %s, %s, 'ajuste', %s)
        """, (
            data['producto_id'],
            data['tipo'],
            abs(cantidad),
            data.get('motivo', 'Ajuste manual').strip(),
            current_user_id
        ))
        
        connection.commit()
        
        logger.info(f"✅ Movimiento de stock creado para producto {data['producto_id']}")
        response = jsonify({
            'message': 'Movimiento de stock registrado exitosamente',
            'nuevo_stock': nuevo_stock
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error creando movimiento de stock: {e}")
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
    """Listar compras con filtros"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"🛒 Obteniendo compras para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        proveedor_id = request.args.get('proveedor_id')
        estado = request.args.get('estado', 'completada')
        
        # Construir consulta
        query = """
            SELECT c.id, c.numero_factura, c.total, c.fecha, c.estado, c.notas, c.creado,
                   p.nombre as proveedor_nombre, u.nombre as usuario_nombre
            FROM compras c
            LEFT JOIN proveedores p ON c.proveedor_id = p.id
            LEFT JOIN usuarios u ON c.usuario_id = u.id
            WHERE c.estado = %s
        """
        params = [estado]
        
        if fecha_inicio:
            query += " AND c.fecha >= %s"
            params.append(fecha_inicio)
        
        if fecha_fin:
            query += " AND c.fecha <= %s"
            params.append(fecha_fin)
        
        if proveedor_id:
            query += " AND c.proveedor_id = %s"
            params.append(proveedor_id)
        
        query += " ORDER BY c.fecha DESC, c.id DESC"
        
        cursor.execute(query, params)
        compras = []
        
        for row in cursor.fetchall():
            compra = {
                'id': row[0],
                'numero_factura': row[1] or '',
                'total': float(row[2]),
                'fecha': row[3].isoformat() if row[3] else None,
                'estado': row[4],
                'notas': row[5] or '',
                'creado': row[6].isoformat() if row[6] else None,
                'proveedor_nombre': row[7] or 'Sin proveedor',
                'usuario_nombre': row[8] or 'Usuario desconocido'
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
    """Crear nueva compra"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        logger.info(f"🛒 Creando compra: {data}")
        
        if not data or not data.get('productos') or not isinstance(data['productos'], list):
            return jsonify({'message': 'Faltan productos en la compra'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Calcular total
        total = 0
        for producto in data['productos']:
            if not all(k in producto for k in ('producto_id', 'cantidad', 'precio_unitario')):
                return jsonify({'message': 'Faltan campos requeridos en productos'}), 400
            total += float(producto['cantidad']) * float(producto['precio_unitario'])
        
        # Insertar compra
        cursor.execute("""
            INSERT INTO compras (usuario_id, proveedor_id, numero_factura, total, fecha, notas)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            current_user_id,
            data.get('proveedor_id') or None,
            data.get('numero_factura', '').strip() or None,
            total,
            data.get('fecha', datetime.now().date()),
            data.get('notas', '').strip() or None
        ))
        
        compra_id = cursor.lastrowid
        
        # Insertar detalles de compra y actualizar stock
        for producto in data['productos']:
            # Insertar detalle
            subtotal_producto = float(producto['cantidad']) * float(producto['precio_unitario'])
            cursor.execute("""
                INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                compra_id,
                producto['producto_id'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                subtotal_producto
            ))
            
            # Actualizar stock del producto
            cursor.execute("""
                UPDATE productos 
                SET stock_actual = stock_actual + %s 
                WHERE id = %s
            """, (float(producto['cantidad']), producto['producto_id']))
            
            # Registrar movimiento de stock
            cursor.execute("""
                INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, referencia_id, referencia_tipo, usuario_id)
                VALUES (%s, 'ingreso', %s, 'Compra', %s, 'compra', %s)
            """, (
                producto['producto_id'],
                float(producto['cantidad']),
                compra_id,
                current_user_id
            ))
        
        connection.commit()
        
        logger.info(f"✅ Compra creada: ID {compra_id}, Total: ${total}")
        response = jsonify({
            'message': 'Compra creada exitosamente',
            'id': compra_id,
            'total': total
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"❌ Error creando compra: {e}")
        if connection:
            connection.rollback()
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE COMPRAS - ESTADÍSTICAS ====================

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
                'total_compras': 0,
                'compras_mes': 0,
                'total_gastado': 0.0,
                'gastado_mes': 0.0,
                'promedio_compra': 0.0,
                'proveedor_frecuente': 'N/A',
                'productos_comprados': 0,
                'compras_hoy': 0,
                'gastado_hoy': 0.0
            }
            response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

        cursor = connection.cursor()
        
        # Total de compras
        cursor.execute("SELECT COUNT(*) FROM compras WHERE estado = 'completada'")
        total_compras = cursor.fetchone()[0] or 0
        
        # Compras del mes actual
        cursor.execute("""
            SELECT COUNT(*) 
            FROM compras 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        compras_mes = cursor.fetchone()[0] or 0
        
        # Total gastado
        cursor.execute("SELECT SUM(total) FROM compras WHERE estado = 'completada'")
        total_gastado = cursor.fetchone()[0]
        total_gastado = float(total_gastado) if total_gastado else 0.0
        
        # Gastado del mes actual
        cursor.execute("""
            SELECT SUM(total) 
            FROM compras 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        gastado_mes = cursor.fetchone()[0]
        gastado_mes = float(gastado_mes) if gastado_mes else 0.0
        
        # Promedio por compra
        promedio_compra = total_gastado / total_compras if total_compras > 0 else 0.0
        
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
        proveedor_result = cursor.fetchone()
        proveedor_frecuente = proveedor_result[0] if proveedor_result else 'N/A'
        
        # Total de productos comprados (cantidad)
        cursor.execute("""
            SELECT SUM(dc.cantidad) 
            FROM detalle_compras dc
            INNER JOIN compras c ON dc.compra_id = c.id
            WHERE c.estado = 'completada'
        """)
        productos_comprados = cursor.fetchone()[0]
        productos_comprados = float(productos_comprados) if productos_comprados else 0.0
        
        # Compras de hoy
        cursor.execute("""
            SELECT COUNT(*) 
            FROM compras 
            WHERE DATE(fecha) = CURDATE()
            AND estado = 'completada'
        """)
        compras_hoy = cursor.fetchone()[0] or 0
        
        # Gastado hoy
        cursor.execute("""
            SELECT SUM(total) 
            FROM compras 
            WHERE DATE(fecha) = CURDATE()
            AND estado = 'completada'
        """)
        gastado_hoy = cursor.fetchone()[0]
        gastado_hoy = float(gastado_hoy) if gastado_hoy else 0.0
        
        estadisticas = {
            'total_compras': total_compras,
            'compras_mes': compras_mes,
            'total_gastado': total_gastado,
            'gastado_mes': gastado_mes,
            'promedio_compra': promedio_compra,
            'proveedor_frecuente': proveedor_frecuente,
            'productos_comprados': int(productos_comprados),
            'compras_hoy': compras_hoy,
            'gastado_hoy': gastado_hoy
        }
        
        logger.info(f"✅ Estadísticas de compras calculadas: {estadisticas}")
        response = jsonify(estadisticas)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

    except Exception as e:
        logger.error(f"❌ Error obteniendo estadísticas de compras: {e}")
        estadisticas_default = {
            'total_compras': 0,
            'compras_mes': 0,
            'total_gastado': 0.0,
            'gastado_mes': 0.0,
            'promedio_compra': 0.0,
            'proveedor_frecuente': 'N/A',
            'productos_comprados': 0,
            'compras_hoy': 0,
            'gastado_hoy': 0.0
        }
        response = jsonify(estadisticas_default)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE REPORTES ====================

@app.route('/api/reportes/ventas', methods=['GET'])
@jwt_required
def reporte_ventas(current_user_id):
    """Reporte de ventas por período"""
    connection = None
    cursor = None
    
    try:
        logger.info(f"📊 Generando reporte de ventas")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener parámetros
        fecha_inicio = request.args.get('fecha_inicio', datetime.now().replace(day=1).date())
        fecha_fin = request.args.get('fecha_fin', datetime.now().date())
        
        # Resumen general
        cursor.execute("""
            SELECT 
                COUNT(*) as total_ventas,
                SUM(total) as total_ingresos,
                AVG(total) as promedio_venta,
                SUM(descuento) as total_descuentos
            FROM ventas 
            WHERE DATE(fecha) BETWEEN %s AND %s 
            AND estado = 'completada'
        """, (fecha_inicio, fecha_fin))
        
        resumen = cursor.fetchone()
        
        # Ventas por día
        cursor.execute("""
            SELECT 
                DATE(fecha) as fecha,
                COUNT(*) as cantidad,
                SUM(total) as total
            FROM ventas 
            WHERE DATE(fecha) BETWEEN %s AND %s 
            AND estado = 'completada'
            GROUP BY DATE(fecha)
            ORDER BY fecha ASC
        """, (fecha_inicio, fecha_fin))
        
        ventas_por_dia = []
        for row in cursor.fetchall():
            ventas_por_dia.append({
                'fecha': row[0].isoformat() if row[0] else None,
                'cantidad': row[1] or 0,
                'total': float(row[2]) if row[2] else 0.0
            })
        
        # Productos más vendidos
        cursor.execute("""
            SELECT 
                p.nombre,
                SUM(dv.cantidad) as cantidad_vendida,
                SUM(dv.subtotal) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE DATE(v.fecha) BETWEEN %s AND %s 
            AND v.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 10
        """, (fecha_inicio, fecha_fin))
        
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'nombre': row[0],
                'cantidad_vendida': float(row[1]),
                'total_vendido': float(row[2])
            })
        
        # Ventas por forma de pago
        cursor.execute("""
            SELECT 
                forma_pago,
                COUNT(*) as cantidad,
                SUM(total) as total
            FROM ventas 
            WHERE DATE(fecha) BETWEEN %s AND %s 
            AND estado = 'completada'
            GROUP BY forma_pago
            ORDER BY total DESC
        """, (fecha_inicio, fecha_fin))
        
        ventas_por_forma_pago = []
        for row in cursor.fetchall():
            ventas_por_forma_pago.append({
                'forma_pago': row[0],
                'cantidad': row[1] or 0,
                'total': float(row[2]) if row[2] else 0.0
            })
        
        reporte = {
            'periodo': {
                'fecha_inicio': str(fecha_inicio),
                'fecha_fin': str(fecha_fin)
            },
            'resumen': {
                'total_ventas': resumen[0] or 0,
                'total_ingresos': float(resumen[1]) if resumen[1] else 0.0,
                'promedio_venta': float(resumen[2]) if resumen[2] else 0.0,
                'total_descuentos': float(resumen[3]) if resumen[3] else 0.0
            },
            'ventas_por_dia': ventas_por_dia,
            'productos_mas_vendidos': productos_mas_vendidos,
            'ventas_por_forma_pago': ventas_por_forma_pago
        }
        
        logger.info(f"✅ Reporte de ventas generado")
        response = jsonify(reporte)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"❌ Error generando reporte de ventas: {e}")
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE PRUEBA ====================

@app.route('/api/test', methods=['GET'])
def test():
    """Endpoint de prueba"""
    response = jsonify({
        'message': 'API funcionando correctamente',
        'timestamp': datetime.now().isoformat(),
        'status': 'OK'
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

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

@app.errorhandler(405)
def method_not_allowed(error):
    response = jsonify({'message': 'Método no permitido'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 405
# ==================== MANEJO DE OPCIONES CORS ====================

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({'message': 'OK'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200

# ==================== INICIALIZACIÓN ====================

if __name__ == '__main__':
    logger.info("🚀 Iniciando aplicación Frutería Nina...")
    
    # Inicializar base de datos
    if init_database():
        logger.info("✅ Base de datos inicializada correctamente")
    else:
        logger.error("❌ Error inicializando base de datos")
        exit(1)
    
    # Configurar y ejecutar aplicación
    logger.info("🌐 Iniciando servidor Flask...")
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,
        threaded=True
    )