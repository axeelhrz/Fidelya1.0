from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from functools import wraps

app = Flask(__name__)

# Configuración CORS más específica y segura
CORS(app, 
     origins=['http://localhost:3000', 'http://127.0.0.1:3000'],  # Orígenes permitidos
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],        # Métodos permitidos
     allow_headers=['Content-Type', 'Authorization'],             # Headers permitidos
     supports_credentials=True                                    # Permitir cookies/credenciales
)

# Configuración
app.config['SECRET_KEY'] = 'tu_clave_secreta_muy_segura_para_jwt'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Cambia por tu contraseña de MySQL
    'database': 'fruteria_nina'
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
    try:
        connection = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = connection.cursor()
        
        # Crear base de datos si no existe
        cursor.execute("CREATE DATABASE IF NOT EXISTS fruteria_nina")
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
        )
        """)
        
        connection.commit()
        print("Base de datos inicializada correctamente")
        
    except mysql.connector.Error as err:
        print(f"Error inicializando base de datos: {err}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def jwt_required(f):
    """Decorador para rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Manejar preflight requests
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
            # Extraer token del header Authorization
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]  # Remover 'Bearer '
            else:
                token = auth_header
                
            # Decodificar token
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

# Manejar preflight requests de CORS globalmente
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
    try:
        data = request.get_json()
        
        # Validar que se recibieron datos
        if not data:
            return jsonify({'message': 'No se recibieron datos'}), 400
        
        # Validar datos requeridos
        if not all(k in data for k in ('nombre', 'correo', 'contraseña')):
            return jsonify({'message': 'Faltan campos requeridos: nombre, correo, contraseña'}), 400
            
        nombre = data['nombre'].strip()
        correo = data['correo'].strip().lower()
        contraseña = data['contraseña']
        
        # Validaciones básicas
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
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/login', methods=['POST'])
def login():
    """Endpoint para inicio de sesión"""
    try:
        data = request.get_json()
        
        # Validar que se recibieron datos
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
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
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
        print(f"Error verificando token: {e}")
        return jsonify({'valid': False, 'message': 'Error interno'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
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

# Ruta de prueba para verificar que el servidor funciona
@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    response = jsonify({
        'status': 'OK',
        'message': 'Servidor Flask funcionando correctamente',
        'timestamp': datetime.utcnow().isoformat()
    })
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 200

# Manejo de errores 404
@app.errorhandler(404)
def not_found(error):
    response = jsonify({'message': 'Endpoint no encontrado'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 404

# Manejo de errores 500
@app.errorhandler(500)
def internal_error(error):
    response = jsonify({'message': 'Error interno del servidor'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    return response, 500

if __name__ == '__main__':
    print("Inicializando base de datos...")
    init_database()
    print("Iniciando servidor Flask...")
    print("Servidor disponible en: http://localhost:5000")
    print("Endpoints disponibles:")
    print("  - POST /api/register")
    print("  - POST /api/login") 
    print("  - GET /api/verify-token")
    print("  - GET /api/dashboard")
    print("  - GET /api/health")
    app.run(debug=True, port=5000, host='0.0.0.0')
