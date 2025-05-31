-- Crear base de datos
CREATE DATABASE IF NOT EXISTS fruteria_nina;
USE fruteria_nina;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'operador') DEFAULT 'operador',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador de prueba
INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES 
('Administrador', 'admin@fruteria.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'admin');
-- Contraseña: admin123