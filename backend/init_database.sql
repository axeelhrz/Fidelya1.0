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

-- Crear tabla productos actualizada para inventario
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria ENUM('fruta', 'verdura', 'otro') NOT NULL,
    proveedor VARCHAR(100),
    unidad VARCHAR(20) DEFAULT 'kg',
    precio_compra DECIMAL(10,2) DEFAULT 0.00,
    precio_venta DECIMAL(10,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla movimientos de stock
CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
    cantidad INT NOT NULL,
    motivo VARCHAR(255),
    usuario_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Crear tablas adicionales para el dashboard
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('venta', 'compra', 'ajuste') NOT NULL,
    detalle TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario administrador de prueba
INSERT IGNORE INTO usuarios (nombre, correo, contraseña, rol) VALUES 
('Administrador', 'admin@fruteria.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'admin');
-- Contraseña: admin123

-- Insertar productos de ejemplo
INSERT IGNORE INTO productos (nombre, categoria, proveedor, unidad, precio_compra, precio_venta, stock, stock_minimo) VALUES
('Banana', 'fruta', 'Frutas del Sur', 'kg', 1.50, 2.50, 15, 5),
('Manzana Roja', 'fruta', 'Frutas del Sur', 'kg', 2.00, 3.00, 3, 5),
('Naranja', 'fruta', 'Frutas del Sur', 'kg', 1.80, 2.80, 20, 5),
('Lechuga', 'verdura', 'Verduras Uruguay', 'unidad', 0.80, 1.50, 8, 3),
('Tomate', 'verdura', 'Verduras Uruguay', 'kg', 2.50, 4.00, 12, 5),
('Cebolla', 'verdura', 'Verduras Uruguay', 'kg', 0.70, 1.20, 25, 10),
('Bolsas Plásticas', 'otro', 'Distribuidora Central', 'paquete', 0.30, 0.50, 100, 20),
('Pera', 'fruta', 'Frutas del Sur', 'kg', 2.20, 3.50, 2, 5),
('Zanahoria', 'verdura', 'Verduras Uruguay', 'kg', 1.00, 1.80, 18, 8),
('Limón', 'fruta', 'Frutas del Sur', 'kg', 1.20, 2.00, 30, 10);