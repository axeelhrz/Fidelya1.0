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
            print("❌ Error: Conexión no establecida")
            return None
    except mysql.connector.Error as err:
        print(f"❌ Error conectando a la base de datos: {err}")
        return None
    except Exception as e:
        print(f"❌ Error inesperado conectando a la base de datos: {e}")
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
        
        print("✅ Conectado a MySQL exitosamente")
        
        # Crear base de datos si no existe
        try:
            cursor.execute("CREATE DATABASE IF NOT EXISTS fruteria_nina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("✅ Base de datos 'fruteria_nina' creada o ya existe")
        except mysql.connector.Error as db_err:
            if db_err.errno == 1007:  # Database exists
                print("✅ Base de datos 'fruteria_nina' ya existe")
            else:
                print(f"⚠️ Error creando base de datos: {db_err}")
        
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
        print("✅ Tabla usuarios creada")
        
        # Crear tabla clientes
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) UNIQUE,
                telefono VARCHAR(20),
                direccion VARCHAR(255),
                notas TEXT,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_nombre (nombre),
                INDEX idx_correo (correo),
                INDEX idx_telefono (telefono)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✅ Tabla clientes creada")
        
        # Crear tabla productos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad ENUM('kg', 'unidad', 'caja') DEFAULT 'unidad',
                stock_actual INT DEFAULT 0,
                stock_minimo INT DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                proveedor VARCHAR(100) DEFAULT '',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_categoria (categoria),
                INDEX idx_stock_bajo (stock_actual, stock_minimo),
                INDEX idx_nombre (nombre)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✅ Tabla productos creada")
        
        # Crear tabla compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                proveedor VARCHAR(100) NOT NULL,
                total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                fecha DATE NOT NULL,
                notas TEXT,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_usuario_fecha (usuario_id, fecha),
                INDEX idx_proveedor (proveedor),
                INDEX idx_fecha (fecha)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✅ Tabla compras creada")
        
        # Crear tabla detalle_compras
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS detalle_compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                compra_id INT NOT NULL,
                producto VARCHAR(100) NOT NULL,
                cantidad DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                unidad VARCHAR(20) DEFAULT 'kg',
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
                INDEX idx_compra (compra_id),
                INDEX idx_producto (producto)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✅ Tabla detalle_compras creada")
        
        # Crear tabla movimientos_stock
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos_stock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                producto_id INT NOT NULL,
                tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
                cantidad INT NOT NULL DEFAULT 0,
                motivo VARCHAR(255),
                usuario_id INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                INDEX idx_producto_fecha (producto_id, fecha),
                INDEX idx_tipo (tipo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("✅ Tabla movimientos_stock creada")
        
        # Crear tabla ventas actualizada
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT NULL,
                usuario_id INT NOT NULL,
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
        print("✅ Tabla ventas creada")
        
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
        print("✅ Tabla detalle_ventas creada")
        
        # Crear tabla movimientos
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
        print("✅ Tabla movimientos creada")
        
        # Crear usuario administrador si no existe
        cursor.execute("SELECT COUNT(*) FROM usuarios")
        if cursor.fetchone()[0] == 0:
            hashed_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (%s, %s, %s, %s)",
                ('Administrador', 'admin@fruteria.com', hashed_password, 'admin')
            )
            print("✅ Usuario administrador creado")
        else:
            print("✅ Usuario administrador ya existe")
        
        connection.commit()
        print("✅ Base de datos inicializada correctamente")
        return True
        
    except mysql.connector.Error as err:
        print(f"❌ Error de MySQL: {err}")
        if err.errno == 1007:  # Database exists
            print("✅ Continuando con base de datos existente...")
            return True
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
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

# ==================== ENDPOINTS DE VENTAS ====================

@app.route('/api/ventas', methods=['POST'])
@jwt_required
def crear_venta(current_user_id):
    """Crea una nueva venta y actualiza el stock automáticamente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        print(f"💰 Creando venta para usuario {current_user_id}: {data}")
        
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
            cursor.execute("SELECT id FROM clientes WHERE id = %s", (cliente_id,))
            if not cursor.fetchone():
                return jsonify({'message': 'Cliente no encontrado'}), 404
        
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
                cursor.execute("SELECT id, nombre, stock_actual FROM productos WHERE id = %s", (producto['producto_id'],))
                producto_db = cursor.fetchone()
                if not producto_db:
                    return jsonify({'message': f'Producto con ID {producto["producto_id"]} no encontrado'}), 404
                
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
                INSERT INTO ventas (cliente_id, usuario_id, forma_pago, subtotal, descuento, impuestos, total, estado, observaciones)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                cliente_id,
                current_user_id,
                data.get('forma_pago', 'efectivo'),
                subtotal_total,
                descuento,
                impuestos,
                total,
                data.get('estado', 'completada'),
                data.get('observaciones', '')
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
                """, (int(producto['cantidad']), producto['producto_id']))
                
                # Registrar movimiento de stock
                cursor.execute("""
                    INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
                    VALUES (%s, 'egreso', %s, %s, %s)
                """, (
                    producto['producto_id'],
                    int(producto['cantidad']),
                    f'Venta #{venta_id}',
                    current_user_id
                ))
                
                print(f"✅ Stock actualizado para {producto['nombre']}: -{producto['cantidad']}")
            
            # Registrar movimiento general
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle)
                VALUES ('venta', %s)
            """, (f'Venta #{venta_id} por ${total:.2f}',))
            
            # Confirmar transacción
            connection.commit()
            
            print(f"✅ Venta {venta_id} creada exitosamente por ${total:.2f}")
            
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

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos creando venta: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error creando venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas', methods=['GET'])
@jwt_required
def obtener_ventas(current_user_id):
    """Obtiene todas las ventas con filtros opcionales"""
    connection = None
    cursor = None
    
    try:
        print(f"💰 Obteniendo ventas para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla ventas existe
        cursor.execute("SHOW TABLES LIKE 'ventas'")
        if not cursor.fetchone():
            print("⚠️ Tabla 'ventas' no existe, devolviendo array vacío")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200

        # Obtener parámetros de filtro
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        cliente_id = request.args.get('cliente_id')
        usuario_id = request.args.get('usuario_id')
        forma_pago = request.args.get('forma_pago')
        producto = request.args.get('producto')
        
        # Construir consulta base
        query = """
            SELECT v.id, v.cliente_id, c.nombre as cliente_nombre, v.usuario_id, u.nombre as usuario_nombre,
                   DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') as fecha, v.forma_pago, v.subtotal, v.descuento, 
                   v.impuestos, v.total, v.estado, v.observaciones,
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
            
        if usuario_id:
            query += " AND v.usuario_id = %s"
            params.append(usuario_id)
            
        if forma_pago:
            query += " AND v.forma_pago = %s"
            params.append(forma_pago)
            
        if producto:
            query += """ AND EXISTS (
                SELECT 1 FROM detalle_ventas dv2 
                INNER JOIN productos p ON dv2.producto_id = p.id 
                WHERE dv2.venta_id = v.id AND p.nombre LIKE %s
            )"""
            params.append(f"%{producto}%")
        
        query += " GROUP BY v.id ORDER BY v.fecha DESC LIMIT 100"
        


        print(f"🔍 Ejecutando consulta: {query}")
        cursor.execute(query, params)
        
        ventas = []
        rows = cursor.fetchall()
        print(f"📋 Encontradas {len(rows)} ventas")
        
        for row in rows:
            try:
                venta = {
                    'id': row[0],
                    'cliente_id': row[1],
                    'cliente_nombre': row[2] or 'Venta rápida',
                    'usuario_id': row[3],
                    'usuario_nombre': row[4] or 'Usuario desconocido',
                    'fecha': row[5] if row[5] else '',
                    'forma_pago': row[6] or 'efectivo',
                    'subtotal': float(row[7]) if row[7] is not None else 0.0,
                    'descuento': float(row[8]) if row[8] is not None else 0.0,
                    'impuestos': float(row[9]) if row[9] is not None else 0.0,
                    'total': float(row[10]) if row[10] is not None else 0.0,
                    'estado': row[11] or 'completada',
                    'observaciones': row[12] or '',
                    'cantidad_productos': row[13] or 0
                }
                ventas.append(venta)
                print(f"   ✅ {venta['cliente_nombre']} - ${venta['total']:.2f}")
            except Exception as e:
                print(f"⚠️ Error procesando venta: {e}")
                continue
        
        print(f"✅ Ventas procesadas exitosamente: {len(ventas)}")
        response = jsonify(ventas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo ventas: {db_err}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo ventas: {e}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['GET'])
@jwt_required
def obtener_venta(current_user_id, venta_id):
    """Obtiene el detalle completo de una venta específica"""
    connection = None
    cursor = None
    
    try:
        print(f"💰 Obteniendo detalle de venta {venta_id} para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener datos principales de la venta
        cursor.execute("""
            SELECT v.id, v.cliente_id, c.nombre as cliente_nombre, c.correo as cliente_correo, 
                   c.telefono as cliente_telefono, v.usuario_id, u.nombre as usuario_nombre,
                   DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i:%s') as fecha, v.forma_pago, v.subtotal, 
                   v.descuento, v.impuestos, v.total, v.estado, v.observaciones
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
            'cliente_id': venta_data[1],
            'cliente': {
                'nombre': venta_data[2] or 'Venta rápida',
                'correo': venta_data[3] or '',
                'telefono': venta_data[4] or ''
            } if venta_data[1] else None,
            'usuario_id': venta_data[5],
            'usuario_nombre': venta_data[6],
            'fecha': venta_data[7],
            'forma_pago': venta_data[8],
            'subtotal': float(venta_data[9]),
            'descuento': float(venta_data[10]),
            'impuestos': float(venta_data[11]),
            'total': float(venta_data[12]),
            'estado': venta_data[13],
            'observaciones': venta_data[14] or '',
            'productos': productos
        }
        
        print(f"✅ Detalle de venta obtenido: {venta['cliente']['nombre'] if venta['cliente'] else 'Venta rápida'} - {len(productos)} productos")
        response = jsonify(venta)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo detalle de venta: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error obteniendo detalle de venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['PUT'])
@jwt_required
def actualizar_venta(current_user_id, venta_id):
    """Actualiza una venta existente (solo en estado borrador o si es admin)"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        print(f"💰 Actualizando venta {venta_id} para usuario {current_user_id}: {data}")
        
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
        campos_actualizables = ['cliente_id', 'forma_pago', 'descuento', 'impuestos', 'estado', 'observaciones']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                valores.append(data[campo])
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(venta_id)
        
        query = f"UPDATE ventas SET {', '.join(campos_update)}, actualizado = NOW() WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        print(f"✅ Venta {venta_id} actualizada exitosamente")
        response = jsonify({'message': 'Venta actualizada exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos actualizando venta: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error actualizando venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/<int:venta_id>', methods=['DELETE'])
@jwt_required
def eliminar_venta(current_user_id, venta_id):
    """Elimina una venta (solo del día y no cobradas)"""
    connection = None
    cursor = None
    
    try:
        print(f"💰 Eliminando venta {venta_id} para usuario {current_user_id}")
        
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
                """, (int(cantidad), producto_id))
                
                # Registrar movimiento de stock
                cursor.execute("""
                    INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id)
                    VALUES (%s, 'ingreso', %s, %s, %s)
                """, (
                    producto_id,
                    int(cantidad),
                    f'Eliminación de venta #{venta_id}',
                    current_user_id
                ))
            
            # Eliminar venta (los detalles se eliminan automáticamente por CASCADE)
            cursor.execute("DELETE FROM ventas WHERE id = %s", (venta_id,))
            
            # Registrar movimiento
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle)
                VALUES ('venta', %s)
            """, (f'Eliminación de venta #{venta_id} por ${venta[3]:.2f}',))
            
            # Confirmar transacción
            connection.commit()
            
            print(f"✅ Venta {venta_id} eliminada exitosamente")
            response = jsonify({'message': 'Venta eliminada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200

        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos eliminando venta: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error eliminando venta: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/ventas/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_ventas(current_user_id):
    """Obtiene estadísticas de ventas"""
    connection = None
    cursor = None
    
    try:
        print(f"📊 Obteniendo estadísticas de ventas para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            estadisticas_default = {
                'ventas_hoy': 0,
                'ingresos_hoy': 0.0,
                'ventas_mes': 0,
                'ingresos_mes': 0.0,
                'venta_promedio': 0.0,
                'producto_mas_vendido': 'N/A',
                'forma_pago_preferida': 'efectivo',
                'ventas_por_forma_pago': {},
                'ventas_por_dia': []
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla ventas existe
        cursor.execute("SHOW TABLES LIKE 'ventas'")
        if not cursor.fetchone():
            estadisticas_default = {
                'ventas_hoy': 0,
                'ingresos_hoy': 0.0,
                'ventas_mes': 0,
                'ingresos_mes': 0.0,
                'venta_promedio': 0.0,
                'producto_mas_vendido': 'N/A',
                'forma_pago_preferida': 'efectivo',
                'ventas_por_forma_pago': {},
                'ventas_por_dia': []
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        
        # Ventas e ingresos de hoy
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
        """)
        ventas_hoy = cursor.fetchone()
        total_ventas_hoy = ventas_hoy[0] if ventas_hoy else 0
        ingresos_hoy = float(ventas_hoy[1]) if ventas_hoy else 0.0
        
        # Ventas e ingresos del mes
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM ventas 
            WHERE YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
            AND estado = 'completada'
        """)
        ventas_mes = cursor.fetchone()
        total_ventas_mes = ventas_mes[0] if ventas_mes else 0
        ingresos_mes = float(ventas_mes[1]) if ventas_mes else 0.0
        
        # Venta promedio
        cursor.execute("""
            SELECT AVG(total) FROM ventas 
            WHERE estado = 'completada' AND total > 0
        """)
        venta_promedio = cursor.fetchone()[0]
        venta_promedio = float(venta_promedio) if venta_promedio else 0.0
        
        # Producto más vendido
        cursor.execute("""
            SELECT p.nombre, SUM(dv.cantidad) as total_vendido
            FROM detalle_ventas dv
            INNER JOIN productos p ON dv.producto_id = p.id
            INNER JOIN ventas v ON dv.venta_id = v.id
            WHERE v.estado = 'completada'
            GROUP BY p.id, p.nombre
            ORDER BY total_vendido DESC
            LIMIT 1
        """)
        producto_top = cursor.fetchone()
        producto_mas_vendido = producto_top[0] if producto_top else 'N/A'
        
        # Forma de pago preferida
        cursor.execute("""
            SELECT forma_pago, COUNT(*) as frecuencia
            FROM ventas 
            WHERE estado = 'completada'
            GROUP BY forma_pago 
            ORDER BY frecuencia DESC 
            LIMIT 1
        """)
        forma_pago_top = cursor.fetchone()
        forma_pago_preferida = forma_pago_top[0] if forma_pago_top else 'efectivo'
        
        # Ventas por forma de pago
        cursor.execute("""
            SELECT forma_pago, COUNT(*), SUM(total)
            FROM ventas 
            WHERE estado = 'completada'
            GROUP BY forma_pago
        """)
        ventas_por_forma_pago = {}
        for row in cursor.fetchall():
            ventas_por_forma_pago[row[0]] = {
                'cantidad': row[1],
                'total': float(row[2])
            }
        
        # Ventas por día (últimos 7 días)
        cursor.execute("""
            SELECT DATE(fecha) as dia, COUNT(*), SUM(total)
            FROM ventas 
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND estado = 'completada'
            GROUP BY DATE(fecha)
            ORDER BY dia DESC
        """)
        ventas_por_dia = []
        for row in cursor.fetchall():
            ventas_por_dia.append({
                'fecha': row[0].strftime('%Y-%m-%d'),
                'cantidad': row[1],
                'total': float(row[2])
            })
        
        estadisticas = {
            'ventas_hoy': total_ventas_hoy,
            'ingresos_hoy': ingresos_hoy,
            'ventas_mes': total_ventas_mes,
            'ingresos_mes': ingresos_mes,
            'venta_promedio': venta_promedio,
            'producto_mas_vendido': producto_mas_vendido,
            'forma_pago_preferida': forma_pago_preferida,
            'ventas_por_forma_pago': ventas_por_forma_pago,
            'ventas_por_dia': ventas_por_dia
        }
        
        print(f"✅ Estadísticas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo estadísticas de ventas: {db_err}")
        estadisticas_default = {
            'ventas_hoy': 0,
            'ingresos_hoy': 0.0,
            'ventas_mes': 0,
            'ingresos_mes': 0.0,
            'venta_promedio': 0.0,
            'producto_mas_vendido': 'N/A',
            'forma_pago_preferida': 'efectivo',
            'ventas_por_forma_pago': {},
            'ventas_por_dia': []
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo estadísticas de ventas: {e}")
        estadisticas_default = {
            'ventas_hoy': 0,
            'ingresos_hoy': 0.0,
            'ventas_mes': 0,
            'ingresos_mes': 0.0,
            'venta_promedio': 0.0,
            'producto_mas_vendido': 'N/A',
            'forma_pago_preferida': 'efectivo',
            'ventas_por_forma_pago': {},
            'ventas_por_dia': []
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
    """Obtiene todos los clientes con filtros opcionales"""
    connection = None
    cursor = None
    
    try:
        print(f"👥 Obteniendo clientes para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla clientes existe
        cursor.execute("SHOW TABLES LIKE 'clientes'")
        if not cursor.fetchone():
            print("⚠️ Tabla 'clientes' no existe, devolviendo array vacío")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        
        # Obtener parámetros de búsqueda
        search = request.args.get('q', '').strip()
        
        # Construir consulta base
        query = """
            SELECT id, nombre, correo, telefono, direccion, notas, creado
            FROM clientes
        """
        params = []
        
        # Agregar filtro de búsqueda si existe
        if search:
            query += """ 
                WHERE (nombre LIKE %s OR correo LIKE %s OR telefono LIKE %s)
            """
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])
        
        query += " ORDER BY nombre ASC"
        
        cursor.execute(query, params)
        clientes = []
        rows = cursor.fetchall()
        
        for row in rows:
            try:
                cliente = {
                    'id': row[0],
                    'nombre': row[1] or '',
                    'correo': row[2] or '',
                    'telefono': row[3] or '',
                    'direccion': row[4] or '',
                    'notas': row[5] or '',
                    'creado': row[6].isoformat() if row[6] else None
                }
                clientes.append(cliente)
            except Exception as e:
                print(f"⚠️ Error procesando cliente: {e}")
                continue
        
        print(f"✅ Clientes procesados exitosamente: {len(clientes)}")
        response = jsonify(clientes)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo clientes: {db_err}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error general obteniendo clientes: {e}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes', methods=['POST'])
@jwt_required
def crear_cliente(current_user_id):
    """Crea un nuevo cliente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        print(f"👥 Creando cliente: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        # Validaciones básicas
        if not data.get('nombre') or len(data['nombre'].strip()) < 2:
            return jsonify({'message': 'El nombre debe tener al menos 2 caracteres'}), 400
        
        # Validar email si se proporciona
        correo = data.get('correo', '').strip()
        if correo and '@' not in correo:
            return jsonify({'message': 'El correo electrónico no es válido'}), 400
        
        # Validar teléfono si se proporciona
        telefono = data.get('telefono', '').strip()
        if telefono and len(telefono) < 8:
            return jsonify({'message': 'El teléfono debe tener al menos 8 dígitos'}), 400
            
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar si el correo ya existe (solo si se proporciona)
        if correo:
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
            telefono if telefono else None,
            data.get('direccion', '').strip() if data.get('direccion') else None,
            data.get('notas', '').strip() if data.get('notas') else None
        ))
        
        cliente_id = cursor.lastrowid
        connection.commit()
        
        print(f"✅ Cliente creado: {data['nombre']} (ID: {cliente_id})")
        response = jsonify({
            'message': 'Cliente creado exitosamente',
            'id': cliente_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos creando cliente: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error creando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/<int:cliente_id>', methods=['PUT'])
@jwt_required
def actualizar_cliente(current_user_id, cliente_id):
    """Actualiza un cliente existente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        print(f"👥 Actualizando cliente {cliente_id}: {data}")
        
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
        
        # Validaciones
        if 'nombre' in data and (not data['nombre'] or len(data['nombre'].strip()) < 2):
            return jsonify({'message': 'El nombre debe tener al menos 2 caracteres'}), 400
        
        if 'correo' in data and data['correo']:
            correo = data['correo'].strip()
            if '@' not in correo:
                return jsonify({'message': 'El correo electrónico no es válido'}), 400

            # Verificar que el correo no esté en uso por otro cliente
            cursor.execute("SELECT id FROM clientes WHERE correo = %s AND id != %s", (correo, cliente_id))
            if cursor.fetchone():
                return jsonify({'message': 'Ya existe otro cliente con este correo electrónico'}), 409
        
        if 'telefono' in data and data['telefono'] and len(data['telefono'].strip()) < 8:
            return jsonify({'message': 'El teléfono debe tener al menos 8 dígitos'}), 400
        
        # Construir consulta de actualización dinámicamente
        campos_actualizables = ['nombre', 'correo', 'telefono', 'direccion', 'notas']
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                valor = data[campo].strip() if isinstance(data[campo], str) else data[campo]
                valores.append(valor if valor else None)
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(cliente_id)
        
        query = f"UPDATE clientes SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        print(f"✅ Cliente {cliente_id} actualizado exitosamente")
        response = jsonify({'message': 'Cliente actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos actualizando cliente: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error actualizando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/<int:cliente_id>', methods=['DELETE'])
@jwt_required
def eliminar_cliente(current_user_id, cliente_id):
    """Elimina un cliente"""
    connection = None
    cursor = None
    
    try:
        print(f"👥 Eliminando cliente {cliente_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el cliente existe
        cursor.execute("SELECT nombre FROM clientes WHERE id = %s", (cliente_id,))
        cliente = cursor.fetchone()
        if not cliente:
            return jsonify({'message': 'Cliente no encontrado'}), 404
        
        # Eliminar cliente
        cursor.execute("DELETE FROM clientes WHERE id = %s", (cliente_id,))
        connection.commit()
        
        print(f"✅ Cliente {cliente_id} ({cliente[0]}) eliminado exitosamente")
        response = jsonify({'message': 'Cliente eliminado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos eliminando cliente: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error eliminando cliente: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/search', methods=['GET'])
@jwt_required
def buscar_clientes(current_user_id):
    """Busca clientes por nombre, correo o teléfono"""
    connection = None
    cursor = None
    
    try:
        search_query = request.args.get('q', '').strip()
        
        if not search_query:
            return jsonify({'message': 'Parámetro de búsqueda requerido'}), 400
        
        print(f"🔍 Buscando clientes con: {search_query}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Búsqueda en nombre, correo y teléfono
        query = """
            SELECT id, nombre, correo, telefono, direccion, notas, creado
            FROM clientes
            WHERE nombre LIKE %s OR correo LIKE %s OR telefono LIKE %s
            ORDER BY nombre ASC
            LIMIT 50
        """
        
        search_param = f"%{search_query}%"
        cursor.execute(query, [search_param, search_param, search_param])
        
        clientes = []
        rows = cursor.fetchall()
        
        for row in rows:
            try:
                cliente = {
                    'id': row[0],
                    'nombre': row[1] or '',
                    'correo': row[2] or '',
                    'telefono': row[3] or '',
                    'direccion': row[4] or '',
                    'notas': row[5] or '',
                    'creado': row[6].isoformat() if row[6] else None
                }
                clientes.append(cliente)
            except Exception as e:
                print(f"⚠️ Error procesando cliente: {e}")
                continue
        
        print(f"✅ Encontrados {len(clientes)} clientes")
        response = jsonify(clientes)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos buscando clientes: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error buscando clientes: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/clientes/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_clientes(current_user_id):
    """Obtiene estadísticas de clientes"""
    connection = None
    cursor = None
    
    try:
        print(f"📊 Obteniendo estadísticas de clientes para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            estadisticas_default = {
                'total_clientes': 0,
                'clientes_mes': 0,
                'clientes_con_correo': 0,
                'clientes_con_telefono': 0,
                'ultimo_cliente': {'nombre': 'N/A', 'fecha': 'N/A'},
                'porcentaje_con_correo': 0,
                'porcentaje_con_telefono': 0
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla clientes existe
        cursor.execute("SHOW TABLES LIKE 'clientes'")
        if not cursor.fetchone():
            print("⚠️ Tabla 'clientes' no existe")
            estadisticas_default = {
                'total_clientes': 0,
                'clientes_mes': 0,
                'clientes_con_correo': 0,
                'clientes_con_telefono': 0,
                'ultimo_cliente': {'nombre': 'N/A', 'fecha': 'N/A'},
                'porcentaje_con_correo': 0,
                'porcentaje_con_telefono': 0
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        
        # Total de clientes
        cursor.execute("SELECT COUNT(*) FROM clientes")
        total_clientes = cursor.fetchone()[0] or 0
        
        # Clientes registrados este mes
        cursor.execute("""
            SELECT COUNT(*) FROM clientes 
            WHERE YEAR(creado) = YEAR(CURDATE()) 
            AND MONTH(creado) = MONTH(CURDATE())
        """)
        clientes_mes = cursor.fetchone()[0] or 0
        
        # Clientes con correo
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE correo IS NOT NULL AND correo != ''")
        clientes_con_correo = cursor.fetchone()[0] or 0
        
        # Clientes con teléfono
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE telefono IS NOT NULL AND telefono != ''")
        clientes_con_telefono = cursor.fetchone()[0] or 0
        
        # Último cliente registrado
        cursor.execute("""
            SELECT nombre, DATE_FORMAT(creado, '%Y-%m-%d') 
            FROM clientes 
            ORDER BY creado DESC 
            LIMIT 1
        """)
        ultimo_cliente = cursor.fetchone()
        ultimo_cliente_info = {
            'nombre': ultimo_cliente[0] if ultimo_cliente else 'N/A',
            'fecha': ultimo_cliente[1] if ultimo_cliente else 'N/A'
        }
        
        estadisticas = {
            'total_clientes': total_clientes,
            'clientes_mes': clientes_mes,
            'clientes_con_correo': clientes_con_correo,
            'clientes_con_telefono': clientes_con_telefono,
            'ultimo_cliente': ultimo_cliente_info,
            'porcentaje_con_correo': round((clientes_con_correo / total_clientes * 100) if total_clientes > 0 else 0, 1),
            'porcentaje_con_telefono': round((clientes_con_telefono / total_clientes * 100) if total_clientes > 0 else 0, 1)
        }
        
        print(f"✅ Estadísticas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo estadísticas: {db_err}")
        estadisticas_default = {
            'total_clientes': 0,
            'clientes_mes': 0,
            'clientes_con_correo': 0,
            'clientes_con_telefono': 0,
            'ultimo_cliente': {'nombre': 'N/A', 'fecha': 'N/A'},
            'porcentaje_con_correo': 0,
            'porcentaje_con_telefono': 0
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo estadísticas de clientes: {e}")
        estadisticas_default = {
            'total_clientes': 0,
            'clientes_mes': 0,
            'clientes_con_correo': 0,
            'clientes_con_telefono': 0,
            'ultimo_cliente': {'nombre': 'N/A', 'fecha': 'N/A'},
            'porcentaje_con_correo': 0,
            'porcentaje_con_telefono': 0
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE INVENTARIO ====================

@app.route('/api/inventario', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Obtiene todos los productos"""
    connection = None
    cursor = None
    
    try:
        print(f"📦 Obteniendo productos para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ No se pudo conectar a la base de datos")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla productos existe
        cursor.execute("SHOW TABLES LIKE 'productos'")
        if not cursor.fetchone():
            print("⚠️ Tabla 'productos' no existe")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        
        query = """
            SELECT id, nombre, categoria, proveedor, unidad, precio_unitario, 
                   stock_actual, stock_minimo, creado
            FROM productos 
            ORDER BY nombre ASC
        """
        
        cursor.execute(query)
        productos = []
        rows = cursor.fetchall()
        
        for row in rows:
            try:
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
                productos.append(producto)
            except Exception as e:
                print(f"⚠️ Error procesando producto: {e}")
                continue
        
        print(f"✅ Productos procesados exitosamente: {len(productos)}")
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo productos: {db_err}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo productos: {e}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
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
        print(f"📦 Creando producto: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        # Validaciones básicas
        if not data.get('nombre') or len(data['nombre'].strip()) < 2:
            return jsonify({'message': 'El nombre es requerido'}), 400
            
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
        
        # Insertar producto
        cursor.execute("""
            INSERT INTO productos (nombre, categoria, proveedor, unidad, precio_unitario, 
                                 stock_actual, stock_minimo)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['nombre'].strip(),
            data['categoria'],
            data.get('proveedor', '').strip(),
            data.get('unidad', 'unidad'),
            precio,
            int(data.get('stock_actual', 0)),
            int(data.get('stock_minimo', 0))
        ))
        
        producto_id = cursor.lastrowid
        connection.commit()
        
        print(f"✅ Producto creado: {data['nombre']} (ID: {producto_id})")
        response = jsonify({
            'message': 'Producto creado exitosamente',
            'id': producto_id
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos creando producto: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error creando producto: {e}")
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
        print(f"📦 Actualizando producto {producto_id}: {data}")
        
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
        if 'nombre' in data and (not data['nombre'] or len(data['nombre'].strip()) < 2):
            return jsonify({'message': 'El nombre debe tener al menos 2 caracteres'}), 400
            
        if 'precio_unitario' in data:
            try:
                precio = float(data['precio_unitario'])
                if precio < 0:
                    return jsonify({'message': 'El precio no puede ser negativo'}), 400
            except (ValueError, TypeError):
                return jsonify({'message': 'El precio debe ser un número válido'}), 400
            
        if 'categoria' in data and data['categoria'] not in ['frutas', 'verduras', 'otros']:
            return jsonify({'message': 'Categoría inválida'}), 400
            
        if 'unidad' in data and data['unidad'] not in ['kg', 'unidad', 'caja']:
            return jsonify({'message': 'Unidad inválida'}), 400
        
        # Construir consulta de actualización dinámicamente
        campos_actualizables = ['nombre', 'categoria', 'proveedor', 'unidad', 
                              'precio_unitario', 'stock_actual', 'stock_minimo']
        
        campos_update = []
        valores = []
        
        for campo in campos_actualizables:
            if campo in data:
                campos_update.append(f"{campo} = %s")
                if campo in ['stock_actual', 'stock_minimo']:
                    valores.append(int(data[campo]))
                else:
                    valores.append(data[campo].strip() if isinstance(data[campo], str) else data[campo])
        
        if not campos_update:
            return jsonify({'message': 'No hay campos para actualizar'}), 400
        
        valores.append(producto_id)
        
        query = f"UPDATE productos SET {', '.join(campos_update)} WHERE id = %s"
        cursor.execute(query, valores)
        connection.commit()
        
        print(f"✅ Producto {producto_id} actualizado exitosamente")
        response = jsonify({'message': 'Producto actualizado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos actualizando producto: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error actualizando producto: {e}")
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
        print(f"📦 Eliminando producto {producto_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que el producto existe
        cursor.execute("SELECT nombre FROM productos WHERE id = %s", (producto_id,))
        producto = cursor.fetchone()
        if not producto:
            return jsonify({'message': 'Producto no encontrado'}), 404
        
        # Eliminar producto
        cursor.execute("DELETE FROM productos WHERE id = %s", (producto_id,))
        connection.commit()
        
        print(f"✅ Producto {producto_id} ({producto[0]}) eliminado exitosamente")
        response = jsonify({'message': 'Producto eliminado exitosamente'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos eliminando producto: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error eliminando producto: {e}")
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
        print(f"📊 Obteniendo estadísticas para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            estadisticas_default = {
                'total_productos': 0,
                'productos_stock_bajo': 0,
                'valor_inventario': 0.0,
                'stock_total': 0,
                'productos_por_categoria': {},
                'categorias_principales': []
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla productos existe
        cursor.execute("SHOW TABLES LIKE 'productos'")
        if not cursor.fetchone():
            estadisticas_default = {
                'total_productos': 0,
                'productos_stock_bajo': 0,
                'valor_inventario': 0.0,
                'stock_total': 0,
                'productos_por_categoria': {},
                'categorias_principales': []
            }
            response = jsonify(estadisticas_default)
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        
        # Estadísticas básicas
        cursor.execute("SELECT COUNT(*) FROM productos")
        total_productos = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo")
        productos_stock_bajo = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT SUM(stock_actual * precio_unitario) FROM productos")
        valor_inventario = cursor.fetchone()[0] or 0.0
        
        cursor.execute("SELECT SUM(stock_actual) FROM productos")
        stock_total = cursor.fetchone()[0] or 0
        
        # Productos por categoría
        cursor.execute("SELECT categoria, COUNT(*) FROM productos GROUP BY categoria")
        productos_por_categoria = {}
        for row in cursor.fetchall():
            productos_por_categoria[row[0]] = row[1]
        
        estadisticas = {
            'total_productos': total_productos,
            'productos_stock_bajo': productos_stock_bajo,
            'valor_inventario': float(valor_inventario),
            'stock_total': stock_total,
            'productos_por_categoria': productos_por_categoria,
            'categorias_principales': list(productos_por_categoria.items())[:3]
        }
        
        print(f"✅ Estadísticas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo estadísticas: {db_err}")
        estadisticas_default = {
            'total_productos': 0,
            'productos_stock_bajo': 0,
            'valor_inventario': 0.0,
            'stock_total': 0,
            'productos_por_categoria': {},
            'categorias_principales': []
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo estadísticas: {e}")
        estadisticas_default = {
            'total_productos': 0,
            'productos_stock_bajo': 0,
            'valor_inventario': 0.0,
            'stock_total': 0,
            'productos_por_categoria': {},
            'categorias_principales': []
        }
        response = jsonify(estadisticas_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE COMPRAS ====================

@app.route('/api/compras', methods=['POST'])
@jwt_required
def crear_compra(current_user_id):
    """Crea una nueva compra y actualiza el stock automáticamente"""
    connection = None
    cursor = None
    
    try:
        data = request.get_json()
        print(f"🛒 Creando compra para usuario {current_user_id}: {data}")
        
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        # Validaciones básicas
        if not data.get('proveedor') or len(data['proveedor'].strip()) < 2:
            return jsonify({'message': 'El proveedor es requerido'}), 400
            
        if not data.get('productos') or len(data['productos']) == 0:
            return jsonify({'message': 'Debe incluir al menos un producto'}), 400
            
        if not data.get('fecha'):
            return jsonify({'message': 'La fecha es requerida'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Calcular total
        total_compra = 0
        productos_validados = []
        
        for producto in data['productos']:
            if not all(k in producto for k in ('producto', 'cantidad', 'precio_unitario')):
                return jsonify({'message': 'Cada producto debe tener: producto, cantidad, precio_unitario'}), 400
            
            try:
                cantidad = float(producto['cantidad'])
                precio_unitario = float(producto['precio_unitario'])
                if cantidad <= 0 or precio_unitario <= 0:
                    return jsonify({'message': 'Cantidad y precio deben ser mayores a 0'}), 400
                
                subtotal = cantidad * precio_unitario
                total_compra += subtotal
                
                productos_validados.append({
                    'producto': producto['producto'].strip(),
                    'cantidad': cantidad,
                    'unidad': producto.get('unidad', 'kg').strip(),
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
                INSERT INTO compras (usuario_id, proveedor, total, fecha, notas, creado)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (
                current_user_id,
                data['proveedor'].strip(),
                total_compra,
                data['fecha'],
                data.get('notas', '').strip()
            ))
            
            compra_id = cursor.lastrowid
            
            # Insertar detalles de compra y actualizar stock
            for producto in productos_validados:
                # Insertar detalle
                cursor.execute("""
                    INSERT INTO detalle_compras (compra_id, producto, cantidad, unidad, precio_unitario, subtotal)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    compra_id,
                    producto['producto'],
                    producto['cantidad'],
                    producto['unidad'],
                    producto['precio_unitario'],
                    producto['subtotal']
                ))
                
                # Buscar producto en inventario para actualizar stock
                cursor.execute("""
                    SELECT id, stock_actual FROM productos 
                    WHERE LOWER(nombre) = LOWER(%s)
                    LIMIT 1
                """, (producto['producto'],))
                
                producto_existente = cursor.fetchone()
                
                if producto_existente:
                    # Actualizar stock del producto existente
                    nuevo_stock = producto_existente[1] + int(producto['cantidad'])
                    cursor.execute("""
                        UPDATE productos 
                        SET stock_actual = %s 
                        WHERE id = %s
                    """, (nuevo_stock, producto_existente[0]))
                    
                    # Registrar movimiento de stock
                    cursor.execute("""
                        INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id, fecha)
                        VALUES (%s, 'ingreso', %s, %s, %s, NOW())
                    """, (
                        producto_existente[0],
                        int(producto['cantidad']),
                        f'Compra #{compra_id} - {data["proveedor"]}',
                        current_user_id
                    ))
                    
                    print(f"✅ Stock actualizado para {producto['producto']}: +{producto['cantidad']}")
                else:
                    print(f"⚠️ Producto {producto['producto']} no encontrado en inventario")
            
            # Registrar movimiento general
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle, fecha)
                VALUES ('compra', %s, NOW())
            """, (f'Compra #{compra_id} - {data["proveedor"]} por ${total_compra:.2f}',))
            
            # Confirmar transacción
            connection.commit()
            
            print(f"✅ Compra {compra_id} creada exitosamente por ${total_compra:.2f}")
            
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

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos creando compra: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error creando compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras', methods=['GET'])
@jwt_required
def obtener_compras(current_user_id):
    """Obtiene todas las compras del usuario autenticado con filtros opcionales"""
    connection = None
    cursor = None
    
    try:
        print(f"🛒 Obteniendo compras para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla compras existe
        cursor.execute("SHOW TABLES LIKE 'compras'")
        if not cursor.fetchone():
            print("⚠️ Tabla 'compras' no existe, devolviendo array vacío")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200

        # Obtener parámetros de filtro
        proveedor = request.args.get('proveedor')
        fecha_inicio = request.args.get('fecha_inicio')
        fecha_fin = request.args.get('fecha_fin')
        producto = request.args.get('producto')
        
        # Construir consulta base
        query = """
            SELECT c.id, c.proveedor, c.total, DATE_FORMAT(c.fecha, '%Y-%m-%d') as fecha,
                   c.notas, c.creado,
                   COUNT(dc.id) as cantidad_productos
            FROM compras c
            LEFT JOIN detalle_compras dc ON c.id = dc.compra_id
            WHERE c.usuario_id = %s
        """
        params = [current_user_id]
        
        # Agregar filtros
        if proveedor:
            query += " AND c.proveedor LIKE %s"
            params.append(f"%{proveedor}%")
            
        if fecha_inicio:
            query += " AND c.fecha >= %s"
            params.append(fecha_inicio)
            
        if fecha_fin:
            query += " AND c.fecha <= %s"
            params.append(fecha_fin)
            
        if producto:
            query += " AND EXISTS (SELECT 1 FROM detalle_compras dc2 WHERE dc2.compra_id = c.id AND dc2.producto LIKE %s)"
            params.append(f"%{producto}%")
        
        query += " GROUP BY c.id ORDER BY c.fecha DESC, c.creado DESC LIMIT 100"
        
        print(f"🔍 Ejecutando consulta: {query}")
        cursor.execute(query, params)
        
        compras = []
        rows = cursor.fetchall()
        print(f"📋 Encontradas {len(rows)} compras")
        
        for row in rows:
            try:
                compra = {
                    'id': row[0],
                    'proveedor': row[1] if row[1] else 'Sin proveedor',
                    'total': float(row[2]) if row[2] is not None else 0.0,
                    'fecha': row[3] if row[3] else '',
                    'notas': row[4] or '',
                    'creado': row[5].isoformat() if row[5] else None,
                    'cantidad_productos': row[6] or 0
                }
                compras.append(compra)
                print(f"   ✅ {compra['proveedor']} - ${compra['total']:.2f}")
            except Exception as e:
                print(f"⚠️ Error procesando compra: {e}")
                continue
        
        print(f"✅ Compras procesadas exitosamente: {len(compras)}")
        response = jsonify(compras)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo compras: {db_err}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo compras: {e}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/<int:compra_id>', methods=['GET'])
@jwt_required
def obtener_compra(current_user_id, compra_id):
    """Obtiene el detalle completo de una compra específica"""
    connection = None
    cursor = None
    
    try:
        print(f"🛒 Obteniendo detalle de compra {compra_id} para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Obtener datos principales de la compra
        cursor.execute("""
            SELECT id, proveedor, total, DATE_FORMAT(fecha, '%Y-%m-%d') as fecha,
                   notas, creado
            FROM compras 
            WHERE id = %s AND usuario_id = %s
        """, (compra_id, current_user_id))
        
        compra_data = cursor.fetchone()
        if not compra_data:
            return jsonify({'message': 'Compra no encontrada'}), 404
        
        # Obtener detalles de productos
        cursor.execute("""
            SELECT producto, cantidad, unidad, precio_unitario, subtotal
            FROM detalle_compras 
            WHERE compra_id = %s
            ORDER BY producto
        """, (compra_id,))
        
        productos = []
        for row in cursor.fetchall():
            producto = {
                'producto': row[0],
                'cantidad': float(row[1]),
                'unidad': row[2],
                'precio_unitario': float(row[3]),
                'subtotal': float(row[4])
            }
            productos.append(producto)
        
        compra = {
            'id': compra_data[0],
            'proveedor': compra_data[1],
            'total': float(compra_data[2]),
            'fecha': compra_data[3],
            'notas': compra_data[4] or '',
            'creado': compra_data[5].isoformat() if compra_data[5] else None,
            'productos': productos
        }
        
        print(f"✅ Detalle de compra obtenido: {compra['proveedor']} - {len(productos)} productos")
        response = jsonify(compra)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo detalle de compra: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error obteniendo detalle de compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/<int:compra_id>', methods=['DELETE'])
@jwt_required
def eliminar_compra(current_user_id, compra_id):
    """Elimina una compra"""
    connection = None
    cursor = None
    
    try:
        print(f"🛒 Eliminando compra {compra_id} para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Verificar que la compra existe y pertenece al usuario
        cursor.execute("""
            SELECT proveedor FROM compras 
            WHERE id = %s AND usuario_id = %s
        """, (compra_id, current_user_id))
        
        compra = cursor.fetchone()
        if not compra:
            return jsonify({'message': 'Compra no encontrada'}), 404
        
        # Iniciar transacción
        cursor.execute("START TRANSACTION")
        
        try:
            # Eliminar compra principal (los detalles se eliminan automáticamente por CASCADE)
            cursor.execute("DELETE FROM compras WHERE id = %s", (compra_id,))
            
            # Registrar movimiento
            cursor.execute("""
                INSERT INTO movimientos (tipo, detalle, fecha)
                VALUES ('compra', %s, NOW())
            """, (f'Eliminación de compra #{compra_id} - {compra[0]}',))
            
            # Confirmar transacción
            connection.commit()
            
            print(f"✅ Compra {compra_id} ({compra[0]}) eliminada exitosamente")
            response = jsonify({'message': 'Compra eliminada exitosamente'})
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200

        except Exception as e:
            # Revertir transacción en caso de error
            connection.rollback()
            raise e

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos eliminando compra: {db_err}")
        return jsonify({'message': 'Error de base de datos'}), 500
    except Exception as e:
        print(f"❌ Error eliminando compra: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/compras/estadisticas', methods=['GET'])
@jwt_required
def obtener_estadisticas_compras(current_user_id):
    """Obtiene estadísticas de compras del usuario"""
    connection = None
    cursor = None
    
    try:
        print(f"📊 Obteniendo estadísticas de compras para usuario {current_user_id}")
        
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
        
        # Verificar si la tabla compras existe
        cursor.execute("SHOW TABLES LIKE 'compras'")
        if not cursor.fetchone():
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
        
        # Total de compras del mes actual
        cursor.execute("""
            SELECT COUNT(*), COALESCE(SUM(total), 0)
            FROM compras 
            WHERE usuario_id = %s 
            AND YEAR(fecha) = YEAR(CURDATE()) 
            AND MONTH(fecha) = MONTH(CURDATE())
        """, (current_user_id,))
        
        compras_mes = cursor.fetchone()
        total_compras_mes = compras_mes[0] if compras_mes else 0
        gasto_mes = float(compras_mes[1]) if compras_mes else 0.0
        
        # Gasto promedio por compra
        cursor.execute("""
            SELECT AVG(total) FROM compras 
            WHERE usuario_id = %s AND total > 0
        """, (current_user_id,))
        
        gasto_promedio = cursor.fetchone()[0]
        gasto_promedio = float(gasto_promedio) if gasto_promedio else 0.0
        
        # Proveedor más frecuente
        cursor.execute("""
            SELECT proveedor, COUNT(*) as frecuencia
            FROM compras 
            WHERE usuario_id = %s
            GROUP BY proveedor 
            ORDER BY frecuencia DESC 
            LIMIT 1
        """, (current_user_id,))
        
        proveedor_frecuente = cursor.fetchone()
        proveedor_top = proveedor_frecuente[0] if proveedor_frecuente else 'N/A'
        
        # Productos más comprados
        cursor.execute("""
            SELECT dc.producto, SUM(dc.cantidad) as total_cantidad
            FROM detalle_compras dc
            INNER JOIN compras c ON dc.compra_id = c.id
            WHERE c.usuario_id = %s
            GROUP BY dc.producto
            ORDER BY total_cantidad DESC
            LIMIT 5
        """, (current_user_id,))
        
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
            WHERE usuario_id = %s
        """, (current_user_id,))
        
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
        
        print(f"✅ Estadísticas calculadas: {estadisticas}")
        response = jsonify(estadisticas)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo estadísticas de compras: {db_err}")
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
    except Exception as e:
        print(f"❌ Error obteniendo estadísticas de compras: {e}")
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

@app.route('/api/proveedores', methods=['GET'])
@jwt_required
def obtener_proveedores(current_user_id):
    """Obtiene lista de proveedores únicos del usuario"""
    connection = None
    cursor = None
    
    try:
        print(f"🏪 Obteniendo proveedores para usuario {current_user_id}")
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Obtener proveedores únicos de compras del usuario
        cursor.execute("""
            SELECT DISTINCT proveedor 
            FROM compras 
            WHERE usuario_id = %s AND proveedor IS NOT NULL AND proveedor != ''
            ORDER BY proveedor
        """, (current_user_id,))
        
        proveedores_compras = [row[0] for row in cursor.fetchall()]
        
        # Obtener proveedores únicos de productos (globales)
        cursor.execute("""
            SELECT DISTINCT proveedor 
            FROM productos 
            WHERE proveedor IS NOT NULL AND proveedor != ''
            ORDER BY proveedor
        """)
        
        proveedores_productos = [row[0] for row in cursor.fetchall()]
        
        # Combinar y eliminar duplicados
        todos_proveedores = list(set(proveedores_compras + proveedores_productos))
        todos_proveedores.sort()
        
        print(f"✅ Encontrados {len(todos_proveedores)} proveedores únicos")
        response = jsonify(todos_proveedores)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos obteniendo proveedores: {db_err}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error obteniendo proveedores: {e}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard/resumen', methods=['GET'])
@jwt_required
def dashboard_resumen(current_user_id):
    """Obtiene resumen general del dashboard"""
    connection = None
    cursor = None
    
    try:
        print(f"🔍 Obteniendo resumen del dashboard para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
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
        
        # Inicializar valores por defecto
        total_productos = 0
        ventas_del_dia = 0.0
        cantidad_ventas = 0
        productos_stock_bajo = 0
        
        try:
            # Total de productos
            cursor.execute("SELECT COUNT(*) FROM productos")
            result = cursor.fetchone()
            total_productos = result[0] if result else 0
        except Exception as e:
            print(f"⚠️ Error consultando productos: {e}")
        
        try:
            # Ventas del día
            cursor.execute("""
                SELECT COALESCE(SUM(total), 0), COUNT(*) 
                FROM ventas 
                WHERE DATE(fecha) = CURDATE() AND estado = 'completada'
            """)
            ventas_hoy = cursor.fetchone()
            if ventas_hoy:
                ventas_del_dia = float(ventas_hoy[0]) if ventas_hoy[0] else 0.0
                cantidad_ventas = ventas_hoy[1] if ventas_hoy[1] else 0
        except Exception as e:
            print(f"⚠️ Error consultando ventas: {e}")
        
        try:
            # Productos con stock bajo
            cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo")
            result = cursor.fetchone()
            productos_stock_bajo = result[0] if result else 0
        except Exception as e:
            print(f"⚠️ Error consultando stock bajo: {e}")
        
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
        resumen_default = {
            'totalProductos': 0,
            'ventasDelDia': 0.0,
            'cantidadVentas': 0,
            'productosStockBajo': 0
        }
        response = jsonify(resumen_default)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error general en dashboard resumen: {e}")
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

@app.route('/api/dashboard/stock-bajo', methods=['GET'])
@jwt_required
def dashboard_stock_bajo(current_user_id):
    """Obtiene productos con stock bajo para el dashboard"""
    connection = None
    cursor = None
    
    try:
        print(f"🔍 Obteniendo productos con stock bajo para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ Error: No se pudo conectar a la base de datos")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
            
        cursor = connection.cursor()
        
        # Verificar si la tabla productos existe
        cursor.execute("SHOW TABLES LIKE 'productos'")
        if not cursor.fetchone():
            print("⚠️ Tabla 'productos' no existe")
            response = jsonify([])
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            return response, 200
        
        query = """
            SELECT nombre, stock_actual, stock_minimo, unidad, categoria
            FROM productos 
            WHERE stock_actual <= stock_minimo
            ORDER BY stock_actual ASC
            LIMIT 10
        """
        
        cursor.execute(query)
        
        productos_bajo_stock = []
        rows = cursor.fetchall()
        
        for row in rows:
            try:
                producto = {
                    'nombre': row[0] if row[0] else 'Sin nombre',
                    'stock': int(row[1]) if row[1] is not None else 0,
                    'stockMinimo': int(row[2]) if row[2] is not None else 0,
                    'unidad': row[3] if row[3] else 'unidad',
                    'categoria': row[4] if row[4] else 'otros'
                }
                productos_bajo_stock.append(producto)
            except Exception as e:
                print(f"⚠️ Error procesando producto: {e}")
                continue
        
        print(f"✅ Total productos con stock bajo procesados: {len(productos_bajo_stock)}")
        
        response = jsonify(productos_bajo_stock)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        

    except mysql.connector.Error as db_err:
        print(f"❌ Error de base de datos en stock bajo: {db_err}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        print(f"❌ Error general en stock bajo: {e}")
        response = jsonify([])
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
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
            'clientes': ['/api/clientes', '/api/clientes/search', '/api/clientes/estadisticas'],
            'inventory': ['/api/inventario', '/api/inventario/stats'],
            'purchases': ['/api/compras', '/api/compras/estadisticas', '/api/proveedores'],
            'ventas': ['/api/ventas', '/api/ventas/estadisticas'],
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
    
    # Siempre intentar iniciar el servidor, incluso si hay errores menores en la BD
    init_database()
    
    print("=" * 60)
    print("✅ ¡Sistema listo!")
    print("🌐 Servidor Flask iniciado en: http://localhost:5001")
    print("🎯 Frontend esperado en: http://localhost:3000")
    print("📋 Endpoints disponibles:")
    print("   - POST /api/register          - Registro de usuarios")
    print("   - POST /api/login             - Inicio de sesión")
    print("   - GET  /api/verify-token      - Verificar token JWT")
    print("   - GET  /api/clientes          - Listar clientes")
    print("   - POST /api/clientes          - Crear cliente")
    print("   - PUT  /api/clientes/<id>     - Actualizar cliente")
    print("   - DELETE /api/clientes/<id>   - Eliminar cliente")
    print("   - GET  /api/clientes/search   - Buscar clientes")
    print("   - GET  /api/inventario        - Listar productos")
    print("   - POST /api/ventas            - Crear venta")
    print("   - GET  /api/ventas            - Listar ventas")
    print("   - GET  /api/ventas/<id>       - Detalle de venta")
    print("   - PUT  /api/ventas/<id>       - Editar venta")
    print("   - DELETE /api/ventas/<id>     - Eliminar venta")
    print("   - GET  /api/ventas/estadisticas - Estadísticas de ventas")
    print("   - GET  /api/dashboard         - Dashboard principal")
    print("   - GET  /api/health            - Estado del servidor")
    print("   - GET  /                      - Información de la API")
    print("")
    print("🗄️  Base de datos configurada:")
    print("   - Host: localhost")
    print("   - Usuario: fruteria_user")
    print("   - Base de datos: fruteria_nina")
    print("")
    print("🔐 Autenticación:")
    print("   - JWT con expiración de 24 horas")
    print("   - Usuario administrador: admin@fruteria.com / admin123")
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