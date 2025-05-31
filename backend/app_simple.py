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
        print("✅ Conexión a base de datos exitosa")
        return connection
    except mysql.connector.Error as err:
        print(f"❌ Error conectando a la base de datos: {err}")
        return None

def test_database():
    """Prueba la conexión y estructura de la base de datos"""
    try:
        connection = get_db_connection()
        if not connection:
            return False
            
        cursor = connection.cursor()
        
        # Verificar si existe la tabla productos
        cursor.execute("SHOW TABLES LIKE 'productos'")
        if not cursor.fetchone():
            print("❌ La tabla 'productos' no existe")
            return False
            
        # Verificar estructura de la tabla
        cursor.execute("DESCRIBE productos")
        columns = cursor.fetchall()
        print("📋 Estructura de la tabla productos:")
        for col in columns:
            print(f"   - {col[0]}: {col[1]}")
            
        # Contar productos
        cursor.execute("SELECT COUNT(*) FROM productos")
        count = cursor.fetchone()[0]
        print(f"📦 Total productos en base de datos: {count}")
        
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error probando base de datos: {e}")
        return False

def init_simple_database():
    """Inicializa una base de datos simple"""
    connection = None
    cursor = None
    
    try:
        # Conectar sin especificar base de datos
        temp_config = DB_CONFIG.copy()
        temp_config.pop('database', None)
        connection = mysql.connector.connect(**temp_config)
        cursor = connection.cursor()
        
        print("🔗 Conectado a MySQL")
        
        # Crear base de datos
        cursor.execute("CREATE DATABASE IF NOT EXISTS fruteria_nina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute("USE fruteria_nina")
        print("📁 Base de datos seleccionada")
        
        # Crear tabla usuarios simple
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
        print("👤 Tabla usuarios creada")
        
        # CORREGIR: Eliminar tabla productos existente si tiene estructura incorrecta
        cursor.execute("DROP TABLE IF EXISTS productos")
        print("🗑️ Tabla productos anterior eliminada")
        # Crear tabla productos con la estructura correcta
        cursor.execute("""
            CREATE TABLE productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
                unidad ENUM('kg', 'unidad', 'caja') DEFAULT 'unidad',
                stock_actual INT DEFAULT 0,
                stock_minimo INT DEFAULT 0,
                precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                proveedor VARCHAR(100) DEFAULT '',
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        print("📦 Tabla productos creada con estructura correcta")
        
        # Insertar productos de ejemplo
        productos_ejemplo = [
            ('Banana', 'frutas', 'kg', 15, 5, 2.50, 'Frutas del Sur'),
            ('Manzana Roja', 'frutas', 'kg', 3, 5, 3.00, 'Frutas del Sur'),
            ('Naranja', 'frutas', 'kg', 20, 5, 2.80, 'Frutas del Sur'),
            ('Lechuga', 'verduras', 'unidad', 8, 3, 1.50, 'Verduras Uruguay'),
            ('Tomate', 'verduras', 'kg', 12, 5, 4.00, 'Verduras Uruguay'),
            ('Cebolla', 'verduras', 'kg', 25, 10, 1.20, 'Verduras Uruguay'),
            ('Pera', 'frutas', 'kg', 2, 5, 3.50, 'Frutas del Sur'),
            ('Zanahoria', 'verduras', 'kg', 18, 8, 1.80, 'Verduras Uruguay'),
        ]
        cursor.executemany(
            "INSERT INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, precio_unitario, proveedor) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            productos_ejemplo
        )
        print("🌱 Productos de ejemplo insertados")
        
        connection.commit()
        print("✅ Base de datos inicializada correctamente")
        return True
        
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
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

@app.route('/api/login', methods=['POST'])
def login():
    """Endpoint para inicio de sesión"""
    try:
        data = request.get_json()
        print(f"🔐 Intento de login: {data}")
        
        if not data or not all(k in data for k in ('correo', 'contraseña')):
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
        
        print(f"✅ Login exitoso para: {correo}")
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
        print(f"❌ Error en login: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

@app.route('/api/register', methods=['POST'])
def register():
    """Endpoint para registro de usuarios"""
    try:
        data = request.get_json()
        print(f"📝 Intento de registro: {data}")
        
        if not data or not all(k in data for k in ('nombre', 'correo', 'contraseña')):
            return jsonify({'message': 'Faltan campos requeridos'}), 400
            
        nombre = data['nombre'].strip()
        correo = data['correo'].strip().lower()
        contraseña = data['contraseña']
        
        if len(nombre) < 2 or len(contraseña) < 6 or '@' not in correo:
            return jsonify({'message': 'Datos inválidos'}), 400

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
        
        print(f"✅ Usuario registrado: {correo}")
        response = jsonify({
            'message': 'Usuario registrado exitosamente',
            'success': True
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 201

    except Exception as e:
        print(f"❌ Error en registro: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

@app.route('/api/verify-token', methods=['GET'])
@jwt_required
def verify_token(current_user_id):
    """Verifica si el token es válido"""
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
        print(f"❌ Error verificando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

# ==================== ENDPOINTS DE INVENTARIO ====================

@app.route('/api/inventario', methods=['GET'])
@jwt_required
def obtener_productos(current_user_id):
    """Obtiene todos los productos - VERSION SIMPLE"""
    try:
        print(f"📦 Obteniendo productos para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            print("❌ No se pudo conectar a la base de datos")
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Consulta simple
        query = """
            SELECT id, nombre, categoria, proveedor, unidad, precio_unitario, 
                   stock_actual, stock_minimo, creado
            FROM productos 
            ORDER BY nombre ASC
        """
        
        print(f"🔍 Ejecutando consulta: {query}")
        cursor.execute(query)
        
        productos = []
        rows = cursor.fetchall()
        print(f"📋 Encontrados {len(rows)} productos")
        
        for row in rows:
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
            print(f"   ✅ {producto['nombre']} - Stock: {producto['stock_actual']}")
        
        print(f"✅ Productos procesados exitosamente: {len(productos)}")
        response = jsonify(productos)
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"❌ Error obteniendo productos: {e}")
        return jsonify({'message': f'Error interno del servidor: {str(e)}'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

@app.route('/api/inventario', methods=['POST'])
@jwt_required
def crear_producto(current_user_id):
    """Crea un nuevo producto - VERSION SIMPLE"""
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

    except Exception as e:
        print(f"❌ Error creando producto: {e}")
        return jsonify({'message': f'Error interno del servidor: {str(e)}'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

@app.route('/api/inventario/stats', methods=['GET'])
@jwt_required
def obtener_estadisticas_inventario(current_user_id):
    """Obtiene estadísticas del inventario - VERSION SIMPLE"""
    try:
        print(f"📊 Obteniendo estadísticas para usuario {current_user_id}")
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        # Estadísticas básicas
        cursor.execute("SELECT COUNT(*) FROM productos")
        total_productos = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM productos WHERE stock_actual <= stock_minimo")
        productos_stock_bajo = cursor.fetchone()[0]
        
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
        
    except Exception as e:
        print(f"❌ Error obteniendo estadísticas: {e}")
        return jsonify({'message': f'Error interno del servidor: {str(e)}'}), 500
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals() and connection.is_connected():
            connection.close()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    db_status = "ERROR"
    try:
        if test_database():
            db_status = "OK"
    except:
        pass
    
    response = jsonify({
        'status': 'OK',
        'database': db_status,
        'message': 'Servidor Flask funcionando',
        'timestamp': datetime.utcnow().isoformat()
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

@app.route('/api/test-db', methods=['GET'])
def test_db():
    """Endpoint para probar la base de datos"""
    try:
        if test_database():
            response = jsonify({'status': 'OK', 'message': 'Base de datos funcionando correctamente'})
        else:
            response = jsonify({'status': 'ERROR', 'message': 'Problemas con la base de datos'})
        
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
    except Exception as e:
        response = jsonify({'status': 'ERROR', 'message': f'Error: {str(e)}'})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 500

if __name__ == '__main__':
    print("🚀 Iniciando Frutería Nina Backend (Versión Simple)...")
    print("=" * 60)
    
    if init_simple_database():
        print("=" * 60)
        print("✅ ¡Sistema listo!")
        print("🌐 Servidor Flask iniciado en: http://localhost:5001")
        print("🎯 Frontend esperado en: http://localhost:3000")
        print("📋 Endpoints disponibles:")
        print("   - POST /api/login")
        print("   - POST /api/register") 
        print("   - GET /api/verify-token")
        print("   - GET /api/inventario")
        print("   - POST /api/inventario")
        print("   - GET /api/inventario/stats")
        print("   - GET /api/health")
        print("   - GET /api/test-db")
        print("=" * 60)
        print("🎉 ¡Servidor listo para recibir peticiones!")
        print("💡 Presiona Ctrl+C para detener el servidor")
        print("=" * 60)
        
        app.run(debug=True, port=5001, host='0.0.0.0')
    else:
        print("=" * 60)
        print("❌ Error inicializando base de datos")
        print("💡 Verifica que MySQL esté ejecutándose y las credenciales sean correctas")
        print("=" * 60)