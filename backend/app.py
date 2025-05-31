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
        
        # Crear tablas adicionales para el dashboard
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                categoria ENUM('frutas', 'verduras', 'otros') DEFAULT 'frutas',
                stock INT DEFAULT 0,
                stock_minimo INT DEFAULT 5,
                precio DECIMAL(10,2) DEFAULT 0.00,
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ventas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                total DECIMAL(10,2) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                usuario_id INT,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS compras (
                id INT AUTO_INCREMENT PRIMARY KEY,
                proveedor VARCHAR(100) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS movimientos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tipo ENUM('venta', 'compra', 'ajuste') NOT NULL,
                detalle TEXT NOT NULL,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """)
        
        # Insertar datos de ejemplo si las tablas están vacías
        cursor.execute("SELECT COUNT(*) FROM productos")
        if cursor.fetchone()[0] == 0:
            productos_ejemplo = [
                ('Banana', 'frutas', 15, 5, 2.50),
                ('Manzana', 'frutas', 3, 5, 3.00),
                ('Naranja', 'frutas', 20, 5, 2.80),
                ('Lechuga', 'verduras', 8, 3, 1.50),
                ('Tomate', 'verduras', 12, 5, 4.00),
                ('Cebolla', 'verduras', 25, 10, 1.20),
                ('Bolsas', 'otros', 100, 20, 0.50)
            ]
            cursor.executemany(
                "INSERT INTO productos (nombre, categoria, stock, stock_minimo, precio) VALUES (%s, %s, %s, %s, %s)",
                productos_ejemplo
        )
        
        # Insertar ventas de ejemplo
        cursor.execute("SELECT COUNT(*) FROM ventas")
        if cursor.fetchone()[0] == 0:
            ventas_ejemplo = [
                (1250.50, '2024-01-15 10:30:00', 1),
                (890.00, '2024-01-15 14:20:00', 1),
                (2100.75, '2024-01-14 16:45:00', 1),
                (1580.25, '2024-01-14 11:15:00', 1),
                (950.00, '2024-01-13 09:30:00', 1)
            ]
            cursor.executemany(
                "INSERT INTO ventas (total, fecha, usuario_id) VALUES (%s, %s, %s)",
                ventas_ejemplo
        )
        
        # Insertar compras de ejemplo
        cursor.execute("SELECT COUNT(*) FROM compras")
        if cursor.fetchone()[0] == 0:
            compras_ejemplo = [
                ('Frutas del Sur', 4500.00, '2024-01-15 08:00:00'),
                ('Verduras Uruguay', 2900.00, '2024-01-14 07:30:00'),
                ('Distribuidora Central', 3200.00, '2024-01-13 09:00:00')
            ]
            cursor.executemany(
                "INSERT INTO compras (proveedor, total, fecha) VALUES (%s, %s, %s)",
                compras_ejemplo
        )
        
        # Insertar movimientos de ejemplo
        cursor.execute("SELECT COUNT(*) FROM movimientos")
        if cursor.fetchone()[0] == 0:
            movimientos_ejemplo = [
                ('venta', 'Venta por $1800', '2024-01-15 15:30:00'),
                ('compra', 'Compra por $2500', '2024-01-15 10:12:00'),
                ('venta', 'Venta por $950', '2024-01-15 09:45:00'),
                ('ajuste', 'Ajuste de inventario', '2024-01-14 18:00:00'),
                ('venta', 'Venta por $1200', '2024-01-14 14:20:00')
            ]
            cursor.executemany(
                "INSERT INTO movimientos (tipo, detalle, fecha) VALUES (%s, %s, %s)",
                movimientos_ejemplo
            )
        
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

@app.route('/api/dashboard/resumen', methods=['GET'])
@jwt_required
def dashboard_resumen(current_user_id):
    """Obtiene resumen general del dashboard"""
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
        
        # Ventas del día
        cursor.execute("""
            SELECT COALESCE(SUM(total), 0), COUNT(*) 
            FROM ventas 
            WHERE DATE(fecha) = CURDATE()
        """)
        ventas_hoy = cursor.fetchone()
        ventas_del_dia = float(ventas_hoy[0]) if ventas_hoy[0] else 0.0
        cantidad_ventas = ventas_hoy[1] if ventas_hoy[1] else 0
        
        response = jsonify({
            'totalProductos': total_productos,
            'ventasDelDia': ventas_del_dia,
            'cantidadVentas': cantidad_ventas
        })
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response, 200
        
    except Exception as e:
        print(f"Error en dashboard resumen: {e}")
        return jsonify({'message': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

@app.route('/api/dashboard/stock-bajo', methods=['GET'])
@jwt_required
def dashboard_stock_bajo(current_user_id):
    """Obtiene productos con stock bajo"""
    connection = None
    cursor = None
    
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Error de conexión a la base de datos'}), 500
            
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT nombre, stock, stock_minimo 
            FROM productos 
            WHERE stock <= stock_minimo
            ORDER BY stock ASC
        """)
        
        productos_bajo_stock = []
        for row in cursor.fetchall():
            productos_bajo_stock.append({
                'nombre': row[0],
                'stock': row[1],
                'stockMinimo': row[2]
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
            LIMIT 3
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
            mes_nombre = row[0]
            total = float(row[1])
            meses_con_datos[mes_nombre] = total
        
        # Asegurar que todos los meses estén representados
        meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        
        for mes in meses:
            ventas_mensuales.append({
                'mes': mes,
                'total': meses_con_datos.get(mes, 0)
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
            LIMIT 5
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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    db_status = "OK"
    try:
        connection = get_db_connection()
        if connection:
            connection.close()
        else:
            db_status = "ERROR"
    except:
        db_status = "ERROR"
    
    response = jsonify({
        'status': 'OK',
        'database': db_status,
        'message': 'Servidor Flask funcionando correctamente',
        'timestamp': datetime.utcnow().isoformat()
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

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

if __name__ == '__main__':
    print("🚀 Iniciando Frutería Nina Backend...")
    print("=" * 50)
    if init_database():
        print("=" * 50)
        print("✅ ¡Sistema listo!")
        print("🌐 Servidor Flask iniciado en: http://localhost:5001")
        print("🎯 Frontend esperado en: http://localhost:3000")
        print("📋 Endpoints disponibles:")
        print("   - POST /api/register")
        print("   - POST /api/login") 
        print("   - GET /api/verify-token")
        print("   - GET /api/dashboard")
        print("   - GET /api/dashboard/resumen")
        print("   - GET /api/dashboard/stock-bajo")
        print("   - GET /api/dashboard/compras-recientes")
        print("   - GET /api/dashboard/ventas-mensuales")
        print("   - GET /api/dashboard/stock-distribucion")
        print("   - GET /api/dashboard/ultimos-movimientos")
        print("   - GET /api/health")
        print("=" * 50)
        app.run(debug=True, port=5001, host='0.0.0.0')
    else:
        print("=" * 50)
        print("❌ Error inicializando base de datos")
        print("💡 Ejecuta estos comandos en MySQL:")
        print("   mysql -u root -p")
        print("   DROP USER IF EXISTS 'fruteria_user'@'localhost';")
        print("   CREATE USER 'fruteria_user'@'localhost' IDENTIFIED BY 'fruteria_password_123';")
        print("   GRANT ALL PRIVILEGES ON fruteria_nina.* TO 'fruteria_user'@'localhost';")
        print("   GRANT CREATE ON *.* TO 'fruteria_user'@'localhost';")
        print("   FLUSH PRIVILEGES;")
        print("   EXIT;")
        print("=" * 50)
