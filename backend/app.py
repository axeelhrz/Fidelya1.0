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
    'raise_on_warnings': False  # Evitar que warnings se traten como errores
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
    
    # Evitar múltiples inicializaciones
    if _database_initialized:
        logger.info("✅ Base de datos ya inicializada, omitiendo creación de tablas")
        return True
        
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
        # Verificar si las tablas principales ya existen
        cursor.execute("SHOW TABLES LIKE 'usuarios'")
        if cursor.fetchone():
            logger.info("✅ Las tablas ya existen, omitiendo creación")
            _database_initialized = True
            return True
        
        # Ejecutar el script SQL completo
        try:
            with open('init_database.sql', 'r', encoding='utf-8') as sql_file:
                sql_script = sql_file.read()
                
            # Dividir el script en comandos individuales
            commands = [cmd.strip() for cmd in sql_script.split(';') if cmd.strip()]
            
            for command in commands:
                if command.upper().startswith(('CREATE', 'INSERT', 'ALTER')):
                    try:
                        cursor.execute(command)
                    except mysql.connector.Error as e:
                        if e.errno == 1050:  # Table already exists
                            continue
                        elif e.errno == 1062:  # Duplicate entry
                            continue
                        else:
                            logger.warning(f"Warning ejecutando comando SQL: {e}")
            
            connection.commit()
            logger.info("✅ Todas las tablas creadas exitosamente")
            _database_initialized = True
            return True
            
        except FileNotFoundError:
            logger.warning("Archivo init_database.sql no encontrado, creando tablas manualmente...")
            return create_tables_manually(cursor, connection)
        
    except mysql.connector.Error as e:
        if e.errno == 1050:  # Table already exists
            logger.info("✅ Las tablas ya existen, continuando...")
            _database_initialized = True
            return True
        else:
            logger.error(f"❌ Error creando tablas: {e}")
            return False
    except Exception as e:
        logger.error(f"❌ Error creando tablas: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

def create_tables_manually(cursor, connection):
    """Crear tablas manualmente si no existe el archivo SQL"""
    global _database_initialized
    
    try:
        # Tabla usuarios
        cursor.execute("""
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
        """)
        
        # Tabla proveedores
        cursor.execute("""
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
        """)
        
        # Tabla productos
        cursor.execute("""
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
        """)
        
        # Tabla clientes
        cursor.execute("""
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
        """)
        
        connection.commit()
        logger.info("✅ Tablas básicas creadas exitosamente")
        _database_initialized = True
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creando tablas manualmente: {e}")
        return False

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
        
        # Datos básicos del dashboard
        dashboard_data = {
            'ventas_hoy': {'cantidad': 0, 'total': 0},
            'ventas_mes': {'cantidad': 0, 'total': 0},
            'productos_stock_bajo': 0,
            'total_productos': 0,
            'ultimas_ventas': [],
            'productos_mas_vendidos': []
        }
        
        # Verificar si existen las tablas necesarias
        cursor.execute("SHOW TABLES LIKE 'productos'")
        if cursor.fetchone():
            cursor.execute("SELECT COUNT(*) FROM productos WHERE activo = TRUE")
            dashboard_data['total_productos'] = cursor.fetchone()[0]
        
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
    logger.info("🚀 Iniciando Frutería Nina Backend - Sistema Simplificado v8.1...")
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
            logger.info("🌐 Servidor iniciando en http://localhost:5001")
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