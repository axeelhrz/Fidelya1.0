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

def get_db_connection():
    """Obtiene conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        logger.error(f"Error de conexión MySQL: {err}")
        return None
    except Exception as e:
        logger.error(f"Error inesperado al conectar: {e}")
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
        cursor.execute("CREATE DATABASE IF NOT EXISTS fruteria_nina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute("USE fruteria_nina")
        logger.info("✅ Base de datos 'fruteria_nina' creada o ya existe")
        
        # Crear tabla usuarios
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) NOT NULL UNIQUE,
                contraseña VARCHAR(255) NOT NULL,
                rol ENUM('admin', 'operador') DEFAULT 'operador',
                activo BOOLEAN DEFAULT TRUE,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
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
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        logger.info("✅ Tabla movimientos creada")
        
        # Verificar si existe usuario administrador
        cursor.execute("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin'")
        admin_count = cursor.fetchone()[0]
        
        if admin_count == 0:
            admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("""
                INSERT INTO usuarios (nombre, correo, contraseña, rol)
                VALUES ('Administrador', 'admin@fruteria.com', %s, 'admin')
            """, (admin_password,))
            logger.info("✅ Usuario administrador creado")
        
        # Insertar datos de ejemplo para proveedores
        cursor.execute("SELECT COUNT(*) FROM proveedores")
        if cursor.fetchone()[0] == 0:
            proveedores_ejemplo = [
                ('Frutas del Valle', 'Juan Pérez', '555-0101', 'juan@frutasdelvalle.com', 'Av. Principal 123', 'Proveedor principal de frutas'),
                ('Verduras Frescas S.A.', 'María González', '555-0102', 'maria@verdurasfrescas.com', 'Calle Verde 456', 'Especialistas en verduras orgánicas'),
                ('Distribuidora Central', 'Carlos López', '555-0103', 'carlos@distribuidora.com', 'Zona Industrial 789', 'Distribuidor mayorista')
            ]
            
            for proveedor in proveedores_ejemplo:
                cursor.execute("""
                    INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion, notas)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, proveedor)
            logger.info("✅ Proveedores de ejemplo creados")
        
        # Insertar productos de ejemplo
        cursor.execute("SELECT COUNT(*) FROM productos")
        if cursor.fetchone()[0] == 0:
            cursor.execute("SELECT id FROM proveedores LIMIT 3")
            proveedores_ids = [row[0] for row in cursor.fetchall()]
            
            productos_ejemplo = [
                ('Manzana Roja', 'frutas', 'kg', 50.0, 10.0, 3.50, proveedores_ids[0] if proveedores_ids else None),
                ('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, proveedores_ids[0] if proveedores_ids else None),
                ('Lechuga', 'verduras', 'kg', 35.0, 7.0, 4.20, proveedores_ids[1] if len(proveedores_ids) > 1 else None),
                ('Cebolla', 'verduras', 'kg', 20.0, 5.0, 1.80, proveedores_ids[2] if len(proveedores_ids) > 2 else None)
            ]
            
            for producto in productos_ejemplo:
                cursor.execute("""
                    INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, precio_unitario, proveedor_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, producto)
            logger.info("✅ Productos de ejemplo creados")
        
        # Insertar clientes de ejemplo
        cursor.execute("SELECT COUNT(*) FROM clientes")
        if cursor.fetchone()[0] == 0:
            clientes_ejemplo = [
                ('Cliente General', None, None, None, 'Cliente para ventas rápidas'),
                ('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '555-1001', 'Av. Gastronómica 100', 'Cliente mayorista'),
                ('Supermercado La Esquina', 'compras@laesquina.com', '555-1002', 'Calle Comercial 200', 'Supermercado local')
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

# ==================== ENDPOINTS DE AUTENTICACIÓN ====================

@app.route('/api/register', methods=['POST'])
def register():
    """Registrar nuevo usuario"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('nombre', 'correo', 'contraseña')):
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
        
        # Verificar si el correo ya existe
        cursor.execute("SELECT id FROM usuarios WHERE correo = %s", (correo,))
        if cursor.fetchone():
            return jsonify({'message': 'El correo ya está registrado'}), 409
            
        # Hashear contraseña
        hashed_password = bcrypt.hashpw(contraseña.encode('utf-8'), bcrypt.gensalt())
        
        # Insertar usuario
        cursor.execute("""
            INSERT INTO usuarios (nombre, correo, contraseña, rol)
            VALUES (%s, %s, %s, %s)
        """, (
            nombre,
            correo,
            hashed_password,
            data.get('rol', 'operador')
        ))
        
        usuario_id = cursor.lastrowid
        connection.commit()
        
        logger.info(f"Usuario registrado: {correo}")
        response = jsonify({
            'message': 'Usuario registrado exitosamente',
            'id': usuario_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        logger.error(f"Error registrando usuario: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/login', methods=['POST'])
def login():
    """Iniciar sesión"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('correo', 'contraseña')):
            return jsonify({'message': 'Faltan campos requeridos: correo, contraseña'}), 400
            
        correo = data['correo'].strip().lower()
        contraseña = data['contraseña']
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Buscar usuario
        cursor.execute("""
            SELECT id, nombre, correo, contraseña, rol 
            FROM usuarios 
            WHERE correo = %s AND activo = TRUE
        """, (correo,))
        
        user = cursor.fetchone()
        
        if not user or not bcrypt.checkpw(contraseña.encode('utf-8'), user[3].encode('utf-8')):
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        # Generar token
        payload = {
            'user_id': user[0],
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        
        logger.info(f"Usuario autenticado: {correo}")
        response = jsonify({
            'message': 'Login exitoso',
            'token': token,
            'user': {
                'id': user[0],
                'nombre': user[1],
                'correo': user[2],
                'rol': user[4]
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
            return jsonify({'valid': False, 'message': 'Token requerido'}), 401
        
        token = token.split(' ')[1]
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'valid': False, 'message': 'Error de conexión'}), 500
            
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
            return jsonify({'valid': False, 'message': 'Usuario no encontrado'}), 401
            
    except Exception as e:
        logger.error(f"Error verificando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE PRODUCTOS ====================

@app.route('/api/productos', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Listar productos con filtros"""
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
    """Registrar movimiento de stock (entrada/salida/ajuste)"""
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
                VALUES (%s, 'egreso', %s, 'Venta', %s, 'venta', %s)
            """, (
                producto['producto_id'],
                float(producto['cantidad']),
                venta_id,
                current_user_id
            ))
        
        connection.commit()
        
        logger.info(f"Venta creada: ID {venta_id}, Total: ${total}")
        response = jsonify({
            'message': 'Venta registrada exitosamente',
            'id': venta_id,
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

@app.route('/api/ventas/<int:venta_id>', methods=['GET'])
@jwt_required
def obtener_venta_detalle(current_user_id, venta_id):
    """Ver detalle de una venta específica"""
    connection = None
    cursor = None
    
    try:
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
        
        response = jsonify(venta)
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
    """Eliminar una venta"""
    connection = None
    cursor = None
    
    try:
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
            
            # Confirmar transacción
            connection.commit()
            
            logger.info(f"Venta {venta_id} eliminada exitosamente")
            response = jsonify({'message': 'Venta eliminada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except Exception as e:
        logger.error(f"Error eliminando venta: {e}")
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
    """Agregar cliente"""
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

# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard', methods=['GET'])
@jwt_required
def obtener_dashboard(current_user_id):
    """Dashboard principal con estadísticas"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            dashboard_default = {
                'ventas_hoy': {'cantidad': 0, 'total': 0.0},
                'ventas_mes': {'cantidad': 0, 'total': 0.0},
                'productos_bajo_stock': 0,
                'total_productos': 0,
                'total_clientes': 0,
                'actividad_reciente': []
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
        
        dashboard = {
            'ventas_hoy': ventas_hoy,
            'ventas_mes': ventas_mes,
            'productos_bajo_stock': productos_bajo_stock,
            'total_productos': total_productos,
            'total_clientes': total_clientes,
            'actividad_reciente': actividad_reciente
        }
        
        response = jsonify(dashboard)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo dashboard: {e}")
        dashboard_default = {
            'ventas_hoy': {'cantidad': 0, 'total': 0.0},
            'ventas_mes': {'cantidad': 0, 'total': 0.0},
            'productos_bajo_stock': 0,
            'total_productos': 0,
            'total_clientes': 0,
            'actividad_reciente': []
        }
        response = jsonify(dashboard_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
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

@app.route('/api/proveedores', methods=['POST'])
@jwt_required
def crear_proveedor(current_user_id):
    """Agregar proveedor"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
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

        logger.info(f"Proveedor creado: {data['nombre']} (ID: {proveedor_id})")
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

# ==================== ENDPOINTS DE COMPRAS ====================

@app.route('/api/compras', methods=['GET'])
@jwt_required
def obtener_compras(current_user_id):
    """Listar compras"""
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
    """Registrar compra (actualiza stock)"""
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
            subtotal = float(producto['cantidad']) * float(producto['precio_unitario'])
            cursor.execute("""
                INSERT INTO detalle_compras (compra_id, producto_id, cantidad, precio_unitario, subtotal)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                compra_id,
                producto['producto_id'],
                float(producto['cantidad']),
                float(producto['precio_unitario']),
                subtotal
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
        
        logger.info(f"Compra creada: ID {compra_id}, Total: ${total}")
        response = jsonify({
            'message': 'Compra registrada exitosamente',
            'id': compra_id,
            'total': total
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
            'products': '✅ Completo',
            'sales': '✅ Completo',
            'suppliers': '✅ Completo',
            'purchases': '✅ Completo',
            'dashboard': '✅ Completo',
            'clients': '✅ Completo'
        },
        'endpoints': {
            'auth': ['/api/register', '/api/login', '/api/verify-token'],
            'productos': ['/api/productos', '/api/productos/<id>', '/api/stock-bajo', '/api/stock/movimiento'],
            'ventas': ['/api/ventas', '/api/ventas/<id>'],
            'proveedores': ['/api/proveedores', '/api/proveedores/<id>'],
            'compras': ['/api/compras', '/api/compras/<id>'],
            'clientes': ['/api/clientes', '/api/clientes/<id>'],
            'dashboard': ['/api/dashboard'],
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

# ==================== ENDPOINTS DE INVENTARIO MEJORADOS ====================

@app.route('/api/inventario/stats', methods=['GET'])
@jwt_required
def obtener_estadisticas_inventario(current_user_id):
    """Obtener estadísticas detalladas del inventario"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'total_productos': 0,
                'productos_stock_bajo': 0,
                'valor_inventario': 0.0,
                'stock_total': 0,
                'productos_por_categoria': {},
                'categorias_principales': []
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
        
        # Productos por categoría
        cursor.execute("""
            SELECT categoria, COUNT(*) 
            FROM productos 
            WHERE activo = TRUE 
            GROUP BY categoria
        """)
        productos_por_categoria = {}
        for row in cursor.fetchall():
            productos_por_categoria[row[0]] = row[1]
        
        # Categorías principales (con más productos)
        categorias_principales = sorted(
            productos_por_categoria.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
        
        # Productos más vendidos (últimos 30 días)
        cursor.execute("""
            SELECT p.nombre, COALESCE(SUM(dv.cantidad), 0) as total_vendido
            FROM productos p
            LEFT JOIN detalle_ventas dv ON p.id = dv.producto_id
            LEFT JOIN ventas v ON dv.venta_id = v.id
            WHERE p.activo = TRUE 
            AND (v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) OR v.fecha IS NULL)
            GROUP BY p.id, p.nombre
            ORDER BY total_vendido DESC
            LIMIT 5
        """)
        productos_mas_vendidos = []
        for row in cursor.fetchall():
            productos_mas_vendidos.append({
                'nombre': row[0],
                'cantidad_vendida': float(row[1])
            })
        
        estadisticas = {
            'total_productos': total_productos,
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': valor_inventario,
            'stock_total': stock_total,
            'productos_por_categoria': productos_por_categoria,
            'categorias_principales': [{'categoria': cat, 'cantidad': cant} for cat, cant in categorias_principales],
            'productos_mas_vendidos': productos_mas_vendidos
        }
        
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo estadísticas de inventario: {e}")
        return jsonify({
            'total_productos': 0,
            'productos_stock_bajo': 0,
            'valor_inventario': 0.0,
            'stock_total': 0,
            'productos_por_categoria': {},
            'categorias_principales': []
        }), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/movimientos', methods=['GET'])
@jwt_required
def obtener_movimientos_stock(current_user_id):
    """Listar movimientos de stock con filtros"""
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
                   u.nombre as usuario_nombre
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
                'usuario_nombre': row[7] or 'Sistema'
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

@app.route('/api/productos/export/pdf', methods=['GET'])
@jwt_required
def exportar_productos_pdf(current_user_id):
    """Exportar productos a PDF"""
    try:
        # Por ahora retornamos un mensaje, la implementación completa requiere librerías adicionales
        response = jsonify({
            'message': 'Funcionalidad de exportación PDF en desarrollo',
            'url': '/api/productos/export/pdf',
            'formato': 'application/pdf'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        logger.error(f"Error exportando PDF: {e}")
        return jsonify({'message': 'Error en exportación PDF'}), 500

@app.route('/api/productos/export/excel', methods=['GET'])
@jwt_required
def exportar_productos_excel(current_user_id):
    """Exportar productos a Excel"""
    try:
        # Por ahora retornamos un mensaje, la implementación completa requiere librerías adicionales
        response = jsonify({
            'message': 'Funcionalidad de exportación Excel en desarrollo',
            'url': '/api/productos/export/excel',
            'formato': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        logger.error(f"Error exportando Excel: {e}")
        return jsonify({'message': 'Error en exportación Excel'}), 500

# Actualizar el endpoint de productos para mejorar filtros
@app.route('/api/productos', methods=['GET'])
@jwt_required
def obtener_productos_mejorado(current_user_id):
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
                'proveedor': row[9] or 'Sin proveedor',
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

# ==================== ENDPOINTS DE REPORTES FINANCIEROS ====================

@app.route('/api/reportes/resumen', methods=['GET'])
@jwt_required
def obtener_resumen_financiero(current_user_id):
    """Obtener resumen financiero con KPIs principales"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({
                'ingresos': 0.0,
                'egresos': 0.0,
                'balance': 0.0,
                'impuestos': 0.0
            }), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')
        
        # Construir condiciones de fecha
        fecha_condicion = ""
        params_ingresos = []
        params_egresos = []
        
        if fecha_desde and fecha_hasta:
            fecha_condicion = " AND DATE(fecha) BETWEEN %s AND %s"
            params_ingresos = [fecha_desde, fecha_hasta]
            params_egresos = [fecha_desde, fecha_hasta]
        elif fecha_desde:
            fecha_condicion = " AND DATE(fecha) >= %s"
            params_ingresos = [fecha_desde]
            params_egresos = [fecha_desde]
        elif fecha_hasta:
            fecha_condicion = " AND DATE(fecha) <= %s"
            params_ingresos = [fecha_hasta]
            params_egresos = [fecha_hasta]
        
        # Calcular ingresos totales (ventas)
        query_ingresos = f"""
            SELECT COALESCE(SUM(total), 0) as total_ingresos,
                   COALESCE(SUM(impuestos), 0) as total_impuestos
            FROM ventas 
            WHERE estado = 'completada' {fecha_condicion}
        """
        cursor.execute(query_ingresos, params_ingresos)
        ingresos_data = cursor.fetchone()
        total_ingresos = float(ingresos_data[0]) if ingresos_data[0] else 0.0
        total_impuestos = float(ingresos_data[1]) if ingresos_data[1] else 0.0
        
        # Calcular egresos totales (compras)
        query_egresos = f"""
            SELECT COALESCE(SUM(total), 0) as total_egresos
            FROM compras 
            WHERE estado = 'completada' {fecha_condicion}
        """
        cursor.execute(query_egresos, params_egresos)
        egresos_data = cursor.fetchone()
        total_egresos = float(egresos_data[0]) if egresos_data[0] else 0.0
        
        # Calcular balance neto
        balance_neto = total_ingresos - total_egresos
        
        resumen = {
            'ingresos': total_ingresos,
            'egresos': total_egresos,
            'balance': balance_neto,
            'impuestos': total_impuestos
        }
        
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo resumen financiero: {e}")
        return jsonify({
            'ingresos': 0.0,
            'egresos': 0.0,
            'balance': 0.0,
            'impuestos': 0.0
        }), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/reportes/movimientos', methods=['GET'])
@jwt_required
def obtener_movimientos_financieros(current_user_id):
    """Obtener listado detallado de movimientos financieros"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtros
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')
        tipo = request.args.get('tipo')  # venta, compra, movimiento
        categoria = request.args.get('categoria')
        cliente_id = request.args.get('cliente_id')
        proveedor_id = request.args.get('proveedor_id')
        
        movimientos = []
        
        # Obtener ventas si se solicita
        if not tipo or tipo == 'venta':
            query_ventas = """
                SELECT v.fecha, 'venta' as tipo, 
                       CONCAT('Venta #', v.id, ' - ', COALESCE(c.nombre, 'Cliente General')) as detalle,
                       v.total as monto, u.nombre as responsable
                FROM ventas v
                LEFT JOIN clientes c ON v.cliente_id = c.id
                LEFT JOIN usuarios u ON v.usuario_id = u.id
                WHERE v.estado = 'completada'
            """
            params_ventas = []
            
            if fecha_desde:
                query_ventas += " AND DATE(v.fecha) >= %s"
                params_ventas.append(fecha_desde)
            if fecha_hasta:
                query_ventas += " AND DATE(v.fecha) <= %s"
                params_ventas.append(fecha_hasta)
            if cliente_id:
                query_ventas += " AND v.cliente_id = %s"
                params_ventas.append(cliente_id)
            
            cursor.execute(query_ventas, params_ventas)
            for row in cursor.fetchall():
                movimientos.append({
                    'fecha': row[0].isoformat() if row[0] else None,
                    'tipo': row[1],
                    'detalle': row[2],
                    'monto': float(row[3]),
                    'responsable': row[4] or 'Usuario desconocido'
                })
        
        # Obtener compras si se solicita
        if not tipo or tipo == 'compra':
            query_compras = """
                SELECT c.fecha, 'compra' as tipo,
                       CONCAT('Compra #', c.id, ' - ', COALESCE(p.nombre, 'Sin proveedor')) as detalle,
                       c.total as monto, u.nombre as responsable
                FROM compras c
                LEFT JOIN proveedores p ON c.proveedor_id = p.id
                LEFT JOIN usuarios u ON c.usuario_id = u.id
                WHERE c.estado = 'completada'
            """
            params_compras = []
            
            if fecha_desde:
                query_compras += " AND DATE(c.fecha) >= %s"
                params_compras.append(fecha_desde)
            if fecha_hasta:
                query_compras += " AND DATE(c.fecha) <= %s"
                params_compras.append(fecha_hasta)
            if proveedor_id:
                query_compras += " AND c.proveedor_id = %s"
                params_compras.append(proveedor_id)
            
            cursor.execute(query_compras, params_compras)
            for row in cursor.fetchall():
                movimientos.append({
                    'fecha': row[0].isoformat() if row[0] else None,
                    'tipo': row[1],
                    'detalle': row[2],
                    'monto': float(row[3]),
                    'responsable': row[4] or 'Usuario desconocido'
                })
        
        # Obtener movimientos de stock si se solicita
        if not tipo or tipo == 'movimiento':
            query_movimientos = """
                SELECT ms.fecha, 'movimiento' as tipo,
                       CONCAT('Ajuste de stock - ', p.nombre, ' (', ms.tipo, ')') as detalle,
                       0 as monto, u.nombre as responsable
                FROM movimientos_stock ms
                INNER JOIN productos p ON ms.producto_id = p.id
                LEFT JOIN usuarios u ON ms.usuario_id = u.id
                WHERE ms.referencia_tipo = 'ajuste'
            """
            params_movimientos = []
            
            if fecha_desde:
                query_movimientos += " AND DATE(ms.fecha) >= %s"
                params_movimientos.append(fecha_desde)
            if fecha_hasta:
                query_movimientos += " AND DATE(ms.fecha) <= %s"
                params_movimientos.append(fecha_hasta)
            
            cursor.execute(query_movimientos, params_movimientos)
            for row in cursor.fetchall():
                movimientos.append({
                    'fecha': row[0].isoformat() if row[0] else None,
                    'tipo': row[1],
                    'detalle': row[2],
                    'monto': float(row[3]),
                    'responsable': row[4] or 'Sistema'
                })
        
        # Ordenar por fecha descendente
        movimientos.sort(key=lambda x: x['fecha'] or '', reverse=True)
        
        response = jsonify(movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo movimientos financieros: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/reportes/grafico/ingresos-egresos', methods=['GET'])
@jwt_required
def obtener_grafico_ingresos_egresos(current_user_id):
    """Obtener datos para gráfico de ingresos vs egresos por mes"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener datos de los últimos 12 meses
        cursor.execute("""
            SELECT 
                DATE_FORMAT(fecha, '%Y-%m') as mes,
                MONTHNAME(fecha) as nombre_mes,
                YEAR(fecha) as año
            FROM (
                SELECT fecha FROM ventas WHERE estado = 'completada'
                UNION
                SELECT fecha FROM compras WHERE estado = 'completada'
            ) as fechas
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(fecha, '%Y-%m'), MONTHNAME(fecha), YEAR(fecha)
            ORDER BY mes ASC
        """)
        
        meses_data = cursor.fetchall()
        resultado = []
        
        for mes_data in meses_data:
            mes = mes_data[0]
            nombre_mes = mes_data[1]
            año = mes_data[2]
            
            # Obtener ingresos del mes
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0)
                FROM ventas 
                WHERE estado = 'completada' 
                AND DATE_FORMAT(fecha, '%Y-%m') = %s
            """, (mes,))
            ingresos = float(cursor.fetchone()[0])
            
            # Obtener egresos del mes
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0)
                FROM compras 
                WHERE estado = 'completada' 
                AND DATE_FORMAT(fecha, '%Y-%m') = %s
            """, (mes,))
            egresos = float(cursor.fetchone()[0])
            
            resultado.append({
                'mes': f"{nombre_mes} {año}",
                'ingresos': ingresos,
                'egresos': egresos
            })
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo gráfico ingresos-egresos: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/reportes/grafico/categorias', methods=['GET'])
@jwt_required
def obtener_grafico_categorias(current_user_id):
    """Obtener distribución por categoría de productos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify([]), 200
            
        cursor = connection.cursor()
        
        # Obtener parámetros
        tipo_reporte = request.args.get('tipo', 'venta')  # venta o compra
        fecha_desde = request.args.get('fecha_desde')
        fecha_hasta = request.args.get('fecha_hasta')
        
        if tipo_reporte == 'venta':
            query = """
                SELECT p.categoria, COALESCE(SUM(dv.subtotal), 0) as total
                FROM productos p
                INNER JOIN detalle_ventas dv ON p.id = dv.producto_id
                INNER JOIN ventas v ON dv.venta_id = v.id
                WHERE v.estado = 'completada'
            """
            params = []
            
            if fecha_desde:
                query += " AND DATE(v.fecha) >= %s"
                params.append(fecha_desde)
            if fecha_hasta:
                query += " AND DATE(v.fecha) <= %s"
                params.append(fecha_hasta)
                
            query += " GROUP BY p.categoria ORDER BY total DESC"
            
        else:  # compra
            query = """
                SELECT p.categoria, COALESCE(SUM(dc.subtotal), 0) as total
                FROM productos p
                INNER JOIN detalle_compras dc ON p.id = dc.producto_id
                INNER JOIN compras c ON dc.compra_id = c.id
                WHERE c.estado = 'completada'
            """
            params = []
            
            if fecha_desde:
                query += " AND DATE(c.fecha) >= %s"
                params.append(fecha_desde)
            if fecha_hasta:
                query += " AND DATE(c.fecha) <= %s"
                params.append(fecha_hasta)
                
            query += " GROUP BY p.categoria ORDER BY total DESC"
        
        cursor.execute(query, params)
        resultado = []
        
        for row in cursor.fetchall():
            categoria = row[0].capitalize() if row[0] else 'Sin categoría'
            total = float(row[1])
            if total > 0:  # Solo incluir categorías con movimiento
                resultado.append({
                    'categoria': categoria,
                    'total': total
                })
        
        response = jsonify(resultado)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        logger.error(f"Error obteniendo gráfico de categorías: {e}")
        return jsonify([]), 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/reportes/export/pdf', methods=['GET'])
@jwt_required
def exportar_reporte_pdf(current_user_id):
    """Exportar reporte financiero a PDF"""
    try:
        # Por ahora retornamos información sobre la funcionalidad
        # La implementación completa requiere configuración adicional
        response = jsonify({
            'message': 'Funcionalidad de exportación PDF disponible',
            'url': '/api/reportes/export/pdf',
            'formato': 'application/pdf',
            'parametros_disponibles': [
                'fecha_desde', 'fecha_hasta', 'tipo', 'categoria'
            ],
            'nota': 'Implementación completa requiere configuración adicional'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        logger.error(f"Error exportando PDF: {e}")
        return jsonify({'message': 'Error en exportación PDF'}), 500

@app.route('/api/reportes/export/excel', methods=['GET'])
@jwt_required
def exportar_reporte_excel(current_user_id):
    """Exportar reporte financiero a Excel"""
    try:
        # Por ahora retornamos información sobre la funcionalidad
        # La implementación completa requiere configuración adicional
        response = jsonify({
            'message': 'Funcionalidad de exportación Excel disponible',
            'url': '/api/reportes/export/excel',
            'formato': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'parametros_disponibles': [
                'fecha_desde', 'fecha_hasta', 'tipo', 'categoria'
            ],
            'pestañas_incluidas': ['Resumen', 'Ingresos', 'Egresos', 'Movimientos'],
            'nota': 'Implementación completa requiere configuración adicional'
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        logger.error(f"Error exportando Excel: {e}")
        return jsonify({'message': 'Error en exportación Excel'}), 500

# ==================== FUNCIÓN PRINCIPAL ====================

if __name__ == '__main__':
    print("🚀 Iniciando Frutería Nina Backend - Sistema Completo...")
    print("=" * 80)
    
    # Inicializar base de datos
    if init_database():
        print("=" * 80)
        print("✅ ¡Sistema Completo Listo!")
        print("🌐 Servidor Flask iniciado en: http://localhost:5000")
        print("🎯 Frontend esperado en: http://localhost:3000")
        print("")
        print("📋 MÓDULOS DISPONIBLES:")
        print("")
        print("🔐 AUTENTICACIÓN (3 endpoints):")
        print("   - POST /api/register          - Registro de usuarios")
        print("   - POST /api/login             - Inicio de sesión")
        print("   - POST /api/verify-token      - Verificación de token JWT")
        print("")
        print("📦 PRODUCTOS (6 endpoints):")
        print("   - GET  /api/productos         - Listar productos con filtros")
        print("   - POST /api/productos         - Crear nuevo producto")
        print("   - PUT  /api/productos/<id>    - Actualizar producto")
        print("   - DELETE /api/productos/<id>  - Eliminar producto")
        print("   - GET  /api/stock-bajo        - Productos con stock bajo")
        print("   - POST /api/stock/movimiento  - Registrar movimiento de stock")
        print("")
        print("💰 VENTAS (3 endpoints):")
        print("   - GET  /api/ventas            - Listar ventas")
        print("   - POST /api/ventas            - Registrar nueva venta")
        print("   - GET  /api/ventas/<id>       - Ver detalle de venta")
        print("   - DELETE /api/ventas/<id>     - Eliminar venta")
        print("")
        print("🏪 PROVEEDORES (2 endpoints):")
        print("   - GET  /api/proveedores       - Listar proveedores")
        print("   - POST /api/proveedores       - Agregar proveedor")
        print("")
        print("🛒 COMPRAS (2 endpoints):")
        print("   - GET  /api/compras           - Listar compras")
        print("   - POST /api/compras           - Registrar compra")
        print("")
        print("👥 CLIENTES (2 endpoints):")
        print("   - GET  /api/clientes          - Listar clientes")
        print("   - POST /api/clientes          - Agregar cliente")
        print("")
        print("📊 DASHBOARD (1 endpoint):")
        print("   - GET  /api/dashboard         - Dashboard principal")
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
    else:
        print("❌ Error inicializando la base de datos. Revisa la configuración.")