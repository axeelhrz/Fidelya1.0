from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from functools import wraps

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
    'collation': 'utf8mb4_unicode_ci'
}

def get_db_connection():
    """Obtiene conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error conectando a la base de datos: {err}")
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
        
        print("Conectado a MySQL exitosamente")
        
        # Crear base de datos si no existe
        cursor.execute("CREATE DATABASE IF NOT EXISTS fruteria_nina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print("Base de datos 'fruteria_nina' creada o ya existe")
        
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
        
        # Crear tabla productos según especificaciones del prompt
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad ENUM('kg', 'unidad', 'caja') DEFAULT 'unidad',
                stock_actual INT DEFAULT 0,
                stock_minimo INT DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL,
                proveedor VARCHAR(100),
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_categoria (categoria),
                INDEX idx_stock_bajo (stock_actual, stock_minimo),
                INDEX idx_nombre (nombre)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Crear tabla movimientos de stock
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad INT NOT NULL,
                motivo VARCHAR(255),
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto_fecha (producto_id, fecha),
                INDEX idx_tipo (tipo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Crear tablas adicionales para el dashboard
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                total DECIMAL(10,2) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                usuario_id INT,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_fecha (fecha)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                proveedor VARCHAR(100) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_fecha (fecha),
                INDEX idx_proveedor (proveedor)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tipo ENUM('venta', 'compra', 'ajuste') NOT NULL,
                detalle TEXT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_fecha (fecha),
                INDEX idx_tipo (tipo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Insertar datos de ejemplo si las tablas están vacías
        cursor.execute("SELECT COUNT(*) FROM productos")
        if cursor.fetchone()[0] == 0:
            productos_ejemplo = [
                ('Banana', 'frutas', 'kg', 15, 5, 2.50, 'Frutas del Sur'),
                ('Manzana Roja', 'frutas', 'kg', 3, 5, 3.00, 'Frutas del Sur'),
                ('Naranja', 'frutas', 'kg', 20, 5, 2.80, 'Frutas del Sur'),
                ('Lechuga', 'verduras', 'unidad', 8, 3, 1.50, 'Verduras Uruguay'),
                ('Tomate', 'verduras', 'kg', 12, 5, 4.00, 'Verduras Uruguay'),
                ('Cebolla', 'verduras', 'kg', 25, 10, 1.20, 'Verduras Uruguay'),
                ('Bolsas Plásticas', 'otros', 'caja', 100, 20, 0.50, 'Distribuidora Central'),
                ('Pera', 'frutas', 'kg', 2, 5, 3.50, 'Frutas del Sur'),
                ('Zanahoria', 'verduras', 'kg', 18, 8, 1.80, 'Verduras Uruguay'),
                ('Limón', 'frutas', 'kg', 30, 10, 2.00, 'Frutas del Sur'),
                ('Apio', 'verduras', 'unidad', 1, 3, 1.00, 'Verduras Uruguay'),
                ('Uva', 'frutas', 'kg', 5, 3, 4.50, 'Frutas del Sur'),
                ('Papa', 'verduras', 'kg', 50, 15, 0.80, 'Verduras Uruguay'),
                ('Mandarina', 'frutas', 'kg', 8, 5, 2.20, 'Frutas del Sur'),
                ('Etiquetas', 'otros', 'caja', 200, 50, 0.30, 'Distribuidora Central')
            ]
            cursor.executemany(
                "INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, precio_unitario, proveedor) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                productos_ejemplo
            )
            print("Productos de ejemplo insertados")
        
        # Insertar ventas de ejemplo
        cursor.execute("SELECT COUNT(*) FROM ventas")
        if cursor.fetchone()[0] == 0:
            ventas_ejemplo = [
                (1250.50, '2024-01-15 10:30:00', 1),
                (890.00, '2024-01-15 14:20:00', 1),
                (2100.75, '2024-01-14 16:45:00', 1),
                (1580.25, '2024-01-14 11:15:00', 1),
                (950.00, '2024-01-13 09:30:00', 1),
                (1750.00, '2024-01-13 15:20:00', 1),
                (680.50, '2024-01-12 11:45:00', 1),
                (2200.75, '2024-01-12 16:30:00', 1),
                (1320.00, '2024-01-11 10:15:00', 1),
                (1890.25, '2024-01-11 14:50:00', 1)
            ]
            cursor.executemany(
                "INSERT INTO ventas (total, fecha, usuario_id) VALUES (%s, %s, %s)",
                ventas_ejemplo
            )
            print("Ventas de ejemplo insertadas")
        
        # Insertar compras de ejemplo
        cursor.execute("SELECT COUNT(*) FROM compras")
        if cursor.fetchone()[0] == 0:
            compras_ejemplo = [
                ('Frutas del Sur', 4500.00, '2024-01-15 08:00:00'),
                ('Verduras Uruguay', 2900.00, '2024-01-14 07:30:00'),
                ('Distribuidora Central', 3200.00, '2024-01-13 09:00:00'),
                ('Frutas del Sur', 3800.00, '2024-01-12 08:15:00'),
                ('Verduras Uruguay', 2100.00, '2024-01-11 07:45:00')
            ]
            cursor.executemany(
                "INSERT INTO compras (proveedor, total, fecha) VALUES (%s, %s, %s)",
                compras_ejemplo
            )
            print("Compras de ejemplo insertadas")
        
        # Insertar movimientos de ejemplo
        cursor.execute("SELECT COUNT(*) FROM movimientos")
        if cursor.fetchone()[0] == 0:
            movimientos_ejemplo = [
                ('venta', 'Venta por $1800', '2024-01-15 15:30:00'),
                ('compra', 'Compra por $2500', '2024-01-15 10:12:00'),
                ('venta', 'Venta por $950', '2024-01-15 09:45:00'),
                ('ajuste', 'Ajuste de inventario', '2024-01-14 18:00:00'),
                ('venta', 'Venta por $1200', '2024-01-14 14:20:00'),
                ('compra', 'Compra por $3200', '2024-01-14 08:30:00'),
                ('venta', 'Venta por $2100', '2024-01-13 16:45:00'),
                ('venta', 'Venta por $890', '2024-01-13 11:20:00')
            ]
            cursor.executemany(
                "INSERT INTO movimientos (tipo, detalle, fecha) VALUES (%s, %s, %s)",
                movimientos_ejemplo
            )
            print("Movimientos de ejemplo insertados")
        
        connection.commit()
        print("Tablas creadas y datos de ejemplo insertados exitosamente")
        print("Base de datos inicializada correctamente")
        
    except mysql.connector.Error as err:
        print(f"Error inicializando base de datos: {err}")
        return False
    except Exception as e:
        print(f"Error inesperado: {e}")
        return False
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("Conexión a MySQL cerrada")

    return True

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
            print(f"Error en jwt_required: {e}")
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
        
        print(f"Usuario registrado exitosamente: {correo}")
        response = jsonify({
            'message': 'Usuario registrado exitosamente',
            'success': True
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        print(f"Error en registro: {e}")
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
        
        print(f"Login exitoso para usuario: {correo}")
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
        print(f"Error en login: {e}")
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
        print(f"Error verificando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE INVENTARIO ====================

@app.route('/api/inventario', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Obtiene todos los productos con filtros opcionales"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener parámetros de filtro
        categoria = request.args.get('categoria')
        busqueda = request.args.get('busqueda')
        stock_bajo = request.args.get('stock_bajo') == 'true'
        precio_min = request.args.get('precio_min')
        precio_max = request.args.get('precio_max')
        orden = request.args.get('orden', 'nombre')
        direccion = request.args.get('direccion', 'asc')
        
        # Construir consulta base
        query = """
            SELECT id, nombre, categoria, proveedor, unidad, precio_unitario, 
                   stock_actual, stock_minimo, creado
            FROM productos 
            WHERE 1=1
        """
        params = []
        
        # Aplicar filtros
        if categoria and categoria != 'todos':
            query += " AND categoria = %s"
            params.append(categoria)
            
        if busqueda:
            query += " AND (nombre LIKE %s OR proveedor LIKE %s)"
            busqueda_param = f"%{busqueda}%"
            params.extend([busqueda_param, busqueda_param])
            
        if stock_bajo:
            query += " AND stock_actual <= stock_minimo"
            
        if precio_min:
            try:
                query += " AND precio_unitario >= %s"
                params.append(float(precio_min))
            except ValueError:
                pass
            
        if precio_max:
            try:
                query += " AND precio_unitario <= %s"
                params.append(float(precio_max))
            except ValueError:
                pass
        
        # Aplicar ordenamiento
        orden_valido = ['nombre', 'categoria', 'stock_actual', 'precio_unitario', 'creado']
        if orden in orden_valido:
            direccion_sql = 'ASC' if direccion.lower() == 'asc' else 'DESC'
            query += f" ORDER BY {orden} {direccion_sql}"
        else:
            query += " ORDER BY nombre ASC"
        
        print(f"Ejecutando consulta: {query}")
        print(f"Parámetros: {params}")
        
        cursor.execute(query, params)
        productos = []
        
        for row in cursor.fetchall():
            productos.append({
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'proveedor': row[3] or '',
                'unidad': row[4],
                'precio_unitario': float(row[5]) if row[5] else 0.0,
                'stock_actual': row[6],
                'stock_minimo': row[7],
                'creado': row[8].isoformat() if row[8] else None,
                'stock_bajo': row[6] <= row[7]
            })
        
        print(f"Productos encontrados: {len(productos)}")
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error obteniendo productos: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>', methods=['GET'])
@jwt_required
def obtener_producto(current_user_id, producto_id):
    """Obtiene un producto específico"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        cursor.execute("""
            SELECT id, nombre, categoria, proveedor, unidad, precio_unitario, 
                   stock_actual, stock_minimo, creado
            FROM productos 
            WHERE id = %s
        """, (producto_id,))
        
        row = cursor.fetchone()
        if not row:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        producto = {
            'id': row[0],
            'nombre': row[1],
            'categoria': row[2],
            'proveedor': row[3] or '',
            'unidad': row[4],
            'precio_unitario': float(row[5]) if row[5] else 0.0,
            'stock_actual': row[6],
            'stock_minimo': row[7],
            'creado': row[8].isoformat() if row[8] else None,
            'stock_bajo': row[6] <= row[7]
        }
        
        print(f"Producto obtenido: {producto['nombre']}")
        response = jsonify(producto)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error obteniendo producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario', methods=['POST'])
@jwt_required
def crear_producto(current_user_id):
    """Crea un nuevo producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        print(f"Datos recibidos para crear producto: {data}")
        
        # Validar campos requeridos
        if not data.get('nombre') or len(data['nombre'].strip()) < 2:
            return jsonify({'message': 'El nombre es requerido y debe tener al menos 2 caracteres'}), 400
            
        if not data.get('categoria'):
            return jsonify({'message': 'La categoría es requerida'}), 400
            
        try:
            precio = float(data.get('precio_unitario', 0))
            if precio <= 0:
                return jsonify({'message': 'El precio debe ser mayor a 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'message': 'El precio debe ser un número válido'}), 400
        
        # Validar categoría
        categorias_validas = ['frutas', 'verduras', 'otros']
        if data['categoria'] not in categorias_validas:
            return jsonify({'message': 'Categoría inválida. Debe ser: frutas, verduras o otros'}), 400
            
        # Validar unidad
        unidades_validas = ['kg', 'unidad', 'caja']
        unidad = data.get('unidad', 'unidad')
        if unidad not in unidades_validas:
            return jsonify({'message': 'Unidad inválida. Debe ser: kg, unidad o caja'}), 400
        
        # Validar stock
        try:
            stock_actual = int(data.get('stock_actual', 0))
            stock_minimo = int(data.get('stock_minimo', 0))
            if stock_actual < 0 or stock_minimo < 0:
                return jsonify({'message': 'El stock no puede ser negativo'}), 400
        except (ValueError, TypeError):
            return jsonify({'message': 'El stock debe ser un número entero válido'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si el producto ya existe
        cursor.execute("SELECT id FROM productos WHERE nombre = %s", (data['nombre'].strip(),))
        if cursor.fetchone():
            return jsonify({'message': 'Ya existe un producto con ese nombre'}), 409
        
        # Insertar producto
        cursor.execute("""
            INSERT INTO productos (nombre, categoria, proveedor, unidad, precio_unitario, 
                                 stock_actual, stock_minimo)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['categoria'],
            data.get('proveedor', '').strip(),
            unidad,
            precio,
            stock_actual,
            stock_minimo
        ))
        
        producto_id = cursor.lastrowid
        connection.commit()
        
        # Registrar movimiento de stock inicial si hay stock
        if stock_actual > 0:
            cursor.execute("""
                INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
                VALUES (%s, 'ingreso', %s, 'Stock inicial', %s)
            """, (producto_id, stock_actual, current_user_id))
            connection.commit()
        



        print(f"Producto creado exitosamente: {data['nombre']} (ID: {producto_id})")
        response = jsonify({
            'message': 'Producto creado exitosamente',
            'id': producto_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except ValueError as e:
        print(f"Error de validación: {e}")
        return jsonify({'message': 'Datos numéricos inválidos'}), 400
    except Exception as e:
        print(f"Error creando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>', methods=['PUT'])
@jwt_required
def actualizar_producto(current_user_id, producto_id):
    """Actualiza un producto existente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        print(f"Actualizando producto {producto_id} con datos: {data}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT id, nombre FROM productos WHERE id = %s", (producto_id,))
        producto_existente = cursor.fetchone()
        if not producto_existente:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Validaciones
        if 'nombre' in data and (not data['nombre'] or len(data['nombre'].strip()) < 2):
            return jsonify({'message': 'El nombre debe tener al menos 2 caracteres'}), 400
            
        if 'precio_unitario' in data:
            try:
                precio = float(data['precio_unitario'])
                if precio <= 0:
                    return jsonify({'message': 'El precio debe ser mayor a 0'}), 400
            except (ValueError, TypeError):
                return jsonify({'message': 'El precio debe ser un número válido'}), 400
            
        if 'categoria' in data and data['categoria'] not in ['frutas', 'verduras', 'otros']:
            return jsonify({'message': 'Categoría inválida'}), 400
            
        if 'unidad' in data and data['unidad'] not in ['kg', 'unidad', 'caja']:
            return jsonify({'message': 'Unidad inválida'}), 400
            
        if 'stock_actual' in data:
            try:
                stock = int(data['stock_actual'])
                if stock < 0:
                    return jsonify({'message': 'El stock no puede ser negativo'}), 400
            except (ValueError, TypeError):
                return jsonify({'message': 'El stock debe ser un número entero válido'}), 400
                
        if 'stock_minimo' in data:
            try:
                stock_min = int(data['stock_minimo'])
                if stock_min < 0:
                    return jsonify({'message': 'El stock mínimo no puede ser negativo'}), 400
            except (ValueError, TypeError):
                return jsonify({'message': 'El stock mínimo debe ser un número entero válido'}), 400
        
        # Construir consulta de actualización dinámicamente
        campos_actualizables = ['nombre', 'categoria', 'proveedor', 'unidad', 
                              'precio_unitario', 'stock_actual', 'stock_minimo']
        
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                if campo in ['precio_unitario']:
                    valores.append(float(data[campo]))
                elif campo in ['stock_actual', 'stock_minimo']:
                    valores.append(int(data[campo]))
                else:
                    valores.append(data[campo].strip() if isinstance(data[campo], str) else data[campo])
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(producto_id)
        
        query = f"UPDATE productos SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        print(f"Producto {producto_id} ({producto_existente[1]}) actualizado exitosamente")
        response = jsonify({'message': 'Producto actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except ValueError as e:
        print(f"Error de validación: {e}")
        return jsonify({'message': 'Datos numéricos inválidos'}), 400
    except Exception as e:
        print(f"Error actualizando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>', methods=['DELETE'])
@jwt_required
def eliminar_producto(current_user_id, producto_id):
    """Elimina un producto"""
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
        
        # Eliminar movimientos de stock relacionados primero
        cursor.execute("DELETE FROM movimientos_stock WHERE producto_id = %s", (producto_id,))
        
        # Eliminar producto
        cursor.execute("DELETE FROM productos WHERE id = %s", (producto_id,))
        connection.commit()
        
        print(f"Producto {producto_id} ({producto[0]}) eliminado exitosamente")
        response = jsonify({'message': 'Producto eliminado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        print(f"Error eliminando producto: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/stock-bajo', methods=['GET'])
@jwt_required
def obtener_productos_stock_bajo(current_user_id):
    """Obtiene productos con stock bajo"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT id, nombre, categoria, proveedor, unidad, precio_unitario, 
                   stock_actual, stock_minimo, creado
            FROM productos 
            WHERE stock_actual <= stock_minimo
            ORDER BY stock_actual ASC
        """)
        
        productos = []
        for row in cursor.fetchall():
            productos.append({
                'id': row[0],
                'nombre': row[1],
                'categoria': row[2],
                'proveedor': row[3] or '',
                'unidad': row[4],
                'precio_unitario': float(row[5]) if row[5] else 0.0,
                'stock_actual': row[6],
                'stock_minimo': row[7],
                'creado': row[8].isoformat() if row[8] else None,
                'stock_bajo': True
            })
        
        print(f"Productos con stock bajo encontrados: {len(productos)}")
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error obteniendo productos con stock bajo: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/stats', methods=['GET'])
@jwt_required
def obtener_estadisticas_inventario(current_user_id):
    """Obtiene estadísticas del inventario"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Total de productos
        cursor.execute("SELECT COUNT(*) FROM productos")
        total_productos = cursor.fetchone()[0]
        
        # Productos con stock bajo
        cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo")
        productos_stock_bajo = cursor.fetchone()[0]
        
        # Valor total del inventario
        cursor.execute("SELECT SUM(stock_actual * precio_unitario) FROM productos")
        valor_inventario = cursor.fetchone()[0] or 0.0
        
        # Stock total disponible
        cursor.execute("SELECT SUM(stock_actual) FROM productos")
        stock_total = cursor.fetchone()[0] or 0
        
        # Productos por categoría
        cursor.execute("""
            SELECT categoria, COUNT(*) 
            FROM productos 
            GROUP BY categoria
        """)
        productos_por_categoria = {}
        for row in cursor.fetchall():
            productos_por_categoria[row[0]] = row[1]
        
        # Categorías principales (con más productos)
        categorias_principales = sorted(productos_por_categoria.items(), key=lambda x: x[1], reverse=True)
        
        # Productos sin movimiento (últimos 30 días)
        cursor.execute("""
            SELECT COUNT(DISTINCT p.id)
            FROM productos p
            LEFT JOIN movimientos_stock ms ON p.id = ms.producto_id 
                AND ms.fecha >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            WHERE ms.id IS NULL
        """)
        productos_sin_movimiento = cursor.fetchone()[0] or 0
        
        estadisticas = {
            'total_productos': total_productos,
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': float(valor_inventario),
            'stock_total': stock_total,
            'productos_por_categoria': productos_por_categoria,
            'categorias_principales': categorias_principales[:3] if categorias_principales else [],
            'productos_sin_movimiento': productos_sin_movimiento
        }
        
        print(f"Estadísticas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error obteniendo estadísticas: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>/stock', methods=['POST'])
@jwt_required
def ajustar_stock(current_user_id, producto_id):
    """Ajusta el stock de un producto"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        print(f"Ajustando stock del producto {producto_id}: {data}")
        
        # Validar campos requeridos
        if not all(campo in data for campo in ['tipo', 'cantidad']):
            return jsonify({'message': 'Faltan campos requeridos: tipo, cantidad'}), 400
        
        # Validar tipo de movimiento
        tipos_validos = ['ingreso', 'egreso', 'ajuste']
        if data['tipo'] not in tipos_validos:
            return jsonify({'message': 'Tipo de movimiento inválido'}), 400
        
        # Validar cantidad
        try:
            cantidad = int(data['cantidad'])
            if cantidad <= 0:
                return jsonify({'message': 'La cantidad debe ser mayor a 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'message': 'Cantidad inválida'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener stock actual
        cursor.execute("SELECT stock_actual, nombre FROM productos WHERE id = %s", (producto_id,))
        resultado = cursor.fetchone()
        if not resultado:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        stock_actual = resultado[0]
        nombre_producto = resultado[1]
        
        # Calcular nuevo stock
        if data['tipo'] == 'ingreso':
            nuevo_stock = stock_actual + cantidad
        elif data['tipo'] == 'egreso':
            if stock_actual < cantidad:
                return jsonify({'message': f'Stock insuficiente. Stock actual: {stock_actual}'}), 400
            nuevo_stock = stock_actual - cantidad
        else:  # ajuste
            nuevo_stock = cantidad
        
        # Actualizar stock
        cursor.execute("UPDATE productos SET stock_actual = %s WHERE id = %s", (nuevo_stock, producto_id))
        
        # Registrar movimiento
        cursor.execute("""
            INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
            VALUES (%s, %s, %s, %s, %s)
        """, (producto_id, data['tipo'], cantidad, data.get('motivo', ''), current_user_id))
        
        connection.commit()
        
        print(f"Stock ajustado para producto {producto_id} ({nombre_producto}): {stock_actual} -> {nuevo_stock}")
        response = jsonify({
            'message': 'Stock ajustado exitosamente',
            'stock_anterior': stock_actual,
            'stock_nuevo': nuevo_stock
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except Exception as e:
        print(f"Error ajustando stock: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/inventario/<int:producto_id>/movimientos', methods=['GET'])
@jwt_required
def obtener_movimientos_producto(current_user_id, producto_id):
    """Obtiene el historial de movimientos de un producto"""
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
        
        # Obtener movimientos
        cursor.execute("""
            SELECT ms.tipo, ms.cantidad, ms.motivo, ms.fecha, u.nombre
            FROM movimientos_stock ms
            LEFT JOIN usuarios u ON ms.usuario_id = u.id
            WHERE ms.producto_id = %s
            ORDER BY ms.fecha DESC
            LIMIT 50
        """, (producto_id,))
        
        movimientos = []
        for row in cursor.fetchall():
            movimientos.append({
                'tipo': row[0],
                'cantidad': row[1],
                'motivo': row[2] or '',
                'fecha': row[3].isoformat() if row[3] else None,
                'usuario': row[4] or 'Sistema'
            })
        
        print(f"Movimientos obtenidos para producto {producto_id}: {len(movimientos)}")
        response = jsonify({
            'producto': producto[0],
            'movimientos': movimientos
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error obteniendo movimientos: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard/resumen', methods=['GET'])
@jwt_required
def dashboard_resumen(current_user_id):
    """Obtiene resumen general del dashboard - VERSION MEJORADA"""
    connection = None
    cursor = None
    
    try:
        print(f"🔍 Obteniendo resumen del dashboard para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Inicializar valores por defecto
        total_productos = 0
        ventas_del_dia = 0.0
        cantidad_ventas = 0
        productos_stock_bajo = 0
        
        try:
            # Total de productos
            print("📊 Consultando total de productos...")
            cursor.execute("SELECT COUNT(*) FROM productos")
            result = cursor.fetchone()
            total_productos = result[0] if result else 0
            print(f"✅ Total productos: {total_productos}")
        except Exception as e:
            print(f"⚠️ Error consultando productos: {e}")
        
        try:
            # Ventas del día (usar fecha actual)
            print("💰 Consultando ventas del día...")
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0), COUNT(*) 
                FROM ventas 
                WHERE DATE(fecha) = CURDATE()
            """)
            ventas_hoy = cursor.fetchone()
            if ventas_hoy:
                ventas_del_dia = float(ventas_hoy[0]) if ventas_hoy[0] else 0.0
                cantidad_ventas = ventas_hoy[1] if ventas_hoy[1] else 0
            print(f"✅ Ventas del día: ${ventas_del_dia}, Cantidad: {cantidad_ventas}")
        except Exception as e:
            print(f"⚠️ Error consultando ventas: {e}")
        
        try:
            # Productos con stock bajo
            print("⚠️ Consultando productos con stock bajo...")
            cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo")
            result = cursor.fetchone()
            productos_stock_bajo = result[0] if result else 0
            print(f"✅ Productos stock bajo: {productos_stock_bajo}")
        except Exception as e:
            print(f"⚠️ Error consultando stock bajo: {e}")
        
        # Preparar respuesta
        resumen = {
            'totalProductos': total_productos,
            'ventasDelDia': ventas_del_dia,
            'cantidadVentas': cantidad_ventas,
            'productosStockBajo': productos_stock_bajo
        }
        
        print(f"✅ Resumen calculado exitosamente: {resumen}")
        
        response = jsonify(resumen)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos en dashboard resumen: {db_err}")
        return jsonify({
            'message': 'Error de base de datos',
            'error': str(db_err)
        }), 500
    except Exception as e:
        print(f"❌ Error general en dashboard resumen: {e}")
        return jsonify({
            'message': 'Error interno del servidor',
            'error': str(e)
        }), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("🔌 Conexión a base de datos cerrada")

@app.route('/api/dashboard/stock-bajo', methods=['GET'])
@jwt_required
def dashboard_stock_bajo(current_user_id):
    """Obtiene productos con stock bajo para el dashboard"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT nombre, stock_actual, stock_minimo, unidad
            FROM productos 
            WHERE stock_actual <= stock_minimo
            ORDER BY stock_actual ASC
            LIMIT 10
        """)
        
        productos_bajo_stock = []
        for row in cursor.fetchall():
            productos_bajo_stock.append({
                'nombre': row[0],
                'stock': row[1],
                'stockMinimo': row[2],
                'unidad': row[3]
            })
        
        response = jsonify(productos_bajo_stock)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error en dashboard stock bajo: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/compras-recientes', methods=['GET'])
@jwt_required
def dashboard_compras_recientes(current_user_id):
    """Obtiene las últimas compras"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT proveedor, DATE_FORMAT(fecha, '%Y-%m-%d'), total 
            FROM compras 
            ORDER BY fecha DESC 
            LIMIT 5
        """)
        
        compras_recientes = []
        for row in cursor.fetchall():
            compras_recientes.append({
                'proveedor': row[0],
                'fecha': row[1],
                'total': float(row[2])
            })
        
        response = jsonify(compras_recientes)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error en dashboard compras recientes: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/ventas-mensuales', methods=['GET'])
@jwt_required
def dashboard_ventas_mensuales(current_user_id):
    """Obtiene ventas por mes del año actual"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT 
                MONTH(fecha) as mes_num,
                MONTHNAME(fecha) as mes,
                COALESCE(SUM(total), 0) as total
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE())
            GROUP BY MONTH(fecha), MONTHNAME(fecha)
            ORDER BY MONTH(fecha)
        """)
        
        ventas_mensuales = []
        meses_con_datos = {}
        
        for row in cursor.fetchall():
            mes_nombre = row[1]
            total = float(row[2])
            meses_con_datos[mes_nombre] = total
        
        # Asegurar que todos los meses estén representados
        meses = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']
        
        meses_es = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        
        for i, mes_en in enumerate(meses):
            ventas_mensuales.append({
                'mes': meses_es[i],
                'total': meses_con_datos.get(mes_en, 0)
            })
        
        response = jsonify(ventas_mensuales)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error en dashboard ventas mensuales: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/stock-distribucion', methods=['GET'])
@jwt_required
def dashboard_stock_distribucion(current_user_id):
    """Obtiene distribución de stock por categoría"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT categoria, COUNT(*) 
            FROM productos 
            GROUP BY categoria
        """)
        
        distribucion = {'frutas': 0, 'verduras': 0, 'otros': 0}
        
        for row in cursor.fetchall():
            categoria = row[0]
            cantidad = row[1]
            distribucion[categoria] = cantidad
        
        response = jsonify(distribucion)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error en dashboard stock distribución: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/ultimos-movimientos', methods=['GET'])
@jwt_required
def dashboard_ultimos_movimientos(current_user_id):
    """Obtiene los últimos movimientos"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT tipo, detalle, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i') 
            FROM movimientos 
            ORDER BY fecha DESC 
            LIMIT 10
        """)
        
        movimientos = []
        for row in cursor.fetchall():
            movimientos.append({
                'tipo': row[0],
                'detalle': row[1],
                'fecha': row[2]
            })
        
        response = jsonify(movimientos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error en dashboard últimos movimientos: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard', methods=['GET'])
@jwt_required
def dashboard(current_user_id):
    """Ruta protegida de ejemplo"""
    try:
        response = jsonify({
            'message': f'Bienvenido al dashboard, usuario {current_user_id}',
            'data': 'Datos del dashboard aquí',
            'user_id': current_user_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"Error en dashboard: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500

# ==================== ENDPOINTS GENERALES ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
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
        print(f"Error en health check: {e}")
        db_status = "ERROR"
    
    response = jsonify({
        'status': 'OK',
        'database': db_status,
        'message': 'Servidor Flask funcionando correctamente',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

@app.route('/', methods=['GET'])
def root():
    """Endpoint raíz"""
    response = jsonify({
        'message': 'API Frutería Nina',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'auth': ['/api/register', '/api/login', '/api/verify-token'],
            'inventory': ['/api/inventario', '/api/inventario/stats', '/api/inventario/stock-bajo'],
            'dashboard': ['/api/dashboard', '/api/dashboard/resumen', '/api/dashboard/stock-bajo'],
            'health': '/api/health'
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
    print("🚀 Iniciando Frutería Nina Backend...")
    print("=" * 60)
    
    if init_database():
        print("=" * 60)
        print("✅ ¡Sistema listo!")
        print("🌐 Servidor Flask iniciado en: http://localhost:5001")
        print("🎯 Frontend esperado en: http://localhost:3000")
        print("📋 Endpoints de Autenticación:")
        print("   - POST /api/register          - Registro de usuarios")
        print("   - POST /api/login             - Inicio de sesión")
        print("   - GET  /api/verify-token      - Verificar token JWT")
        print("")
        print("📦 Endpoints de Inventario:")
        print("   - GET    /api/inventario                    - Listar productos")
        print("   - GET    /api/inventario/<id>               - Obtener producto")
        print("   - POST   /api/inventario                    - Crear producto")
        print("   - PUT    /api/inventario/<id>               - Actualizar producto")
        print("   - DELETE /api/inventario/<id>               - Eliminar producto")
        print("   - GET    /api/inventario/stock-bajo         - Productos con stock bajo")
        print("   - GET    /api/inventario/stats              - Estadísticas de inventario")
        print("   - POST   /api/inventario/<id>/stock         - Ajustar stock")
        print("   - GET    /api/inventario/<id>/movimientos   - Historial de movimientos")
        print("")
        print("📊 Endpoints de Dashboard:")
        print("   - GET /api/dashboard                    - Dashboard principal")
        print("   - GET /api/dashboard/resumen            - Resumen general")
        print("   - GET /api/dashboard/stock-bajo         - Productos con stock bajo")
        print("   - GET /api/dashboard/compras-recientes  - Últimas compras")
        print("   - GET /api/dashboard/ventas-mensuales   - Ventas por mes")
        print("   - GET /api/dashboard/stock-distribucion - Distribución por categoría")
        print("   - GET /api/dashboard/ultimos-movimientos - Últimos movimientos")
        print("")
        print("🔧 Endpoints Generales:")
        print("   - GET /api/health                       - Estado del servidor")
        print("   - GET /                                 - Información de la API")
        print("")
        print("🗄️  Base de datos configurada:")
        print("   - Host: localhost")
        print("   - Usuario: fruteria_user")
        print("   - Base de datos: fruteria_nina")
        print("   - Tablas: usuarios, productos, movimientos_stock, ventas, compras, movimientos")
        print("")
        print("🔐 Autenticación:")
        print("   - JWT con expiración de 24 horas")
        print("   - Contraseñas hasheadas con bcrypt")
        print("   - CORS configurado para localhost:3000")
        print("")
        print("📝 Datos de ejemplo incluidos:")
        print("   - 15 productos de ejemplo (frutas, verduras, otros)")
        print("   - Ventas y compras de ejemplo")
        print("   - Movimientos de stock de ejemplo")
        print("=" * 60)
        print("🎉 ¡Servidor listo para recibir peticiones!")
        print("💡 Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        
        # Iniciar el servidor Flask
        app.run(
            debug=True, 
            port=5001, 
            host='0.0.0.0',
            threaded=True
        )
    else:
        print("=" * 60)
        print("❌ Error inicializando base de datos")
        print("")
        print("💡 Para solucionar este problema, ejecuta estos comandos en MySQL:")
        print("   mysql -u root -p")
        print("   DROP USER IF EXISTS 'fruteria_user'@'localhost';")
        print("   CREATE USER 'fruteria_user'@'localhost' IDENTIFIED BY 'fruteria_password_123';")
        print("   GRANT ALL PRIVILEGES ON fruteria_nina.* TO 'fruteria_user'@'localhost';")
        print("   GRANT CREATE ON *.* TO 'fruteria_user'@'localhost';")
        print("   FLUSH PRIVILEGES;")
        print("   EXIT;")
        print("")
        print("🔧 Alternativamente, puedes:")
        print("   1. Verificar que MySQL esté ejecutándose")
        print("   2. Cambiar las credenciales en DB_CONFIG si es necesario")
        print("   3. Asegurarte de que el usuario tenga permisos suficientes")
        print("=" * 60)
        print("❌ El servidor no pudo iniciarse")