from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
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

# Configuración de la base de datos SQLite
DATABASE_PATH = 'fruteria_nina.db'

def get_db_connection():
    """Obtiene conexión a la base de datos SQLite"""
    try:
        connection = sqlite3.connect(DATABASE_PATH)
        connection.row_factory = sqlite3.Row  # Para acceder por nombre de columna
        return connection
    except Exception as err:
        print(f"Error conectando a la base de datos: {err}")
        return None

def init_database():
    """Inicializa la base de datos SQLite y crea las tablas necesarias"""
    try:
        connection = sqlite3.connect(DATABASE_PATH)
        cursor = connection.cursor()
        
        # Crear tabla usuarios
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL UNIQUE,
                contraseña TEXT NOT NULL,
                rol TEXT DEFAULT 'operador' CHECK(rol IN ('admin', 'operador')),
                creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        connection.commit()
        print("✅ Base de datos SQLite inicializada correctamente")
        return True
        
    except Exception as err:
        print(f"❌ Error inicializando base de datos: {err}")
        return False
    finally:
        if connection:
            connection.close()

# ... resto del código igual, solo cambiando las consultas SQL para SQLite