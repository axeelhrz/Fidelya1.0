#!/bin/bash

echo "🚀 Iniciando Frutería Nina Backend..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado. Por favor instala Python3 primero."
    exit 1
fi

# Verificar si pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 no está instalado. Por favor instala pip3 primero."
    exit 1
fi

# Cambiar al directorio del backend
cd backend

# Verificar si existe requirements.txt
if [ ! -f "requirements.txt" ]; then
    echo "📦 Creando requirements.txt..."
    cat > requirements.txt << EOF
Flask==2.3.3
Flask-CORS==4.0.0
mysql-connector-python==8.1.0
bcrypt==4.0.1
PyJWT==2.8.0
python-dotenv==1.0.0
EOF
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
pip3 install -r requirements.txt

# Verificar si MySQL está ejecutándose
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL no está ejecutándose. Por favor inicia MySQL primero."
    echo "   En macOS: brew services start mysql"
    echo "   En Ubuntu: sudo systemctl start mysql"
    echo "   En Windows: net start mysql"
    exit 1
fi

# Verificar conexión a la base de datos
echo "🔍 Verificando conexión a la base de datos..."
python3 -c "
import mysql.connector
try:
    connection = mysql.connector.connect(
        host='localhost',
        user='fruteria_nina',
        password='Admin123',
        database='fruteria_nina'
    )
    print('✅ Conexión a la base de datos exitosa')
    connection.close()
except Exception as e:
    print(f'❌ Error de conexión: {e}')
    print('💡 Asegúrate de que:')
    print('   - MySQL está ejecutándose')
    print('   - La base de datos \"fruteria_nina\" existe')
    print('   - El usuario \"fruteria_nina\" tiene permisos')
    exit(1)
"

# Iniciar el servidor
echo "🌐 Iniciando servidor en puerto 5001..."
python3 app.py
